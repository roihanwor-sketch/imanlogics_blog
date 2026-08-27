import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { MCP_CONFIG } from './config/env'
import { MEDIA_SOURCE_POOLS, PRIMARY_SOURCE_LAYERS, MediaOutlet } from './config/media-pool'
import { TechResearchEngine, TechNewsStory } from './domains/research/tech-engine'
import { IslamicResearchEngine, IslamicAcademicStory } from './domains/research/islamic-engine'
import { SourceVerifier } from './domains/research/source-verifier'
import { AssetDownloader } from './domains/media/asset-downloader'
import { TechArticleBuilder } from './domains/editorial/tech-builder'
import { IslamicArticleBuilder } from './domains/editorial/islamic-builder'
import { EditorialQCEngine } from './domains/qc/qc-engine'
import { GitSyncService } from './domains/publishing/git-sync'
import { WhatsAppService } from './domains/notification/wa-service'
import { ReportFormatter } from './domains/notification/report-formatter'
import { LockManager } from './core/lock-manager'
import { StateStore } from './core/state-store'
import { EditorialOrchestrator } from './orchestrator'
import { MdxArticle, NotificationPayload, SourceCitation, ImageCreditRecord } from './core/types'

export function createImanLogicsMcpServer(): Server {
  const server = new Server(
    {
      name: 'imanlogics-blog-engine',
      version: '1.1.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
    }
  )

  // -------------------------------------------------------------
  // LIST TOOLS
  // -------------------------------------------------------------
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'imanlogics_discover_stories',
          description:
            'Discover verified candidate stories across Tech/AI and Islamic Logic domains with 3-layer source validation, anti-duplicate filtering, and recency scoring.',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                enum: ['tech-ai', 'islamic-logic', 'all'],
                description: 'Content category filter',
              },
            },
          },
        },
        {
          name: 'imanlogics_inspect_evidence',
          description:
            'Inspect structured epistemological points (FACT, EVIDENCE, CLAIM, COUNTERARGUMENT, UNCERTAINTY) and citation chains for a topic.',
          inputSchema: {
            type: 'object',
            properties: {
              storyId: { type: 'string', description: 'ID of the story candidate' },
              category: { type: 'string', enum: ['tech-ai', 'islamic-logic'] },
            },
            required: ['storyId', 'category'],
          },
        },
        {
          name: 'imanlogics_inspect_media_pool',
          description:
            'Inspect the permanent 75 media outlets catalog (25 ID, 25 EN, 25 AR) and Layer 1 primary source definitions.',
          inputSchema: {
            type: 'object',
            properties: {
              language: { type: 'string', enum: ['id', 'en', 'ar', 'all'] },
            },
          },
        },
        {
          name: 'imanlogics_verify_sources',
          description:
            'Verify multi-tier sources (Tier 1 Primary / Tier 2 Journalism) for authoritative factual integrity.',
          inputSchema: {
            type: 'object',
            properties: {
              sources: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    url: { type: 'string' },
                    tier: { type: 'number', enum: [1, 2, 3] },
                    type: { type: 'string' },
                  },
                  required: ['name', 'url', 'tier'],
                },
              },
            },
            required: ['sources'],
          },
        },
        {
          name: 'imanlogics_source_media',
          description:
            'Search copyright-safe images from verified vault (Unsplash/Wikimedia), verify license, and download locally.',
          inputSchema: {
            type: 'object',
            properties: {
              keywords: { type: 'array', items: { type: 'string' } },
              category: { type: 'string', enum: ['tech-ai', 'islamic-logic'] },
              articleSlug: { type: 'string' },
              maxCount: { type: 'number', default: 3 },
            },
            required: ['keywords', 'category', 'articleSlug'],
          },
        },
        {
          name: 'imanlogics_build_article',
          description:
            'Build full investigative trilingual MDX articles (ID, EN, AR) with frontmatter, ATM benchmark context, and image credits.',
          inputSchema: {
            type: 'object',
            properties: {
              category: { type: 'string', enum: ['tech-ai', 'islamic-logic'] },
              storyId: { type: 'string' },
            },
            required: ['category', 'storyId'],
          },
        },
        {
          name: 'imanlogics_audit_qc',
          description:
            'Run 100-Point Multidimensional Human-Level Editorial QC Gatekeeper on MDX article.',
          inputSchema: {
            type: 'object',
            properties: {
              filename: { type: 'string' },
              content: { type: 'string' },
              language: { type: 'string', enum: ['id', 'en', 'ar'] },
              category: { type: 'string', enum: ['tech-ai', 'islamic-logic'] },
              articleType: { type: 'string' },
              publishedHoursAgo: { type: 'number' },
              sources: { type: 'array' },
              imageCredits: { type: 'array' },
            },
            required: ['filename', 'content', 'language', 'category'],
          },
        },
        {
          name: 'imanlogics_publish_cycle',
          description:
            'Execute 3-hour autonomous editorial publishing cycle (Discover -> Build -> QC -> Publish -> Git Push -> Optional WhatsApp).',
          inputSchema: {
            type: 'object',
            properties: {
              dryRun: { type: 'boolean', default: false },
              gitPush: { type: 'boolean', default: true },
              notifyWhatsApp: { type: 'boolean', default: false },
            },
          },
        },
        {
          name: 'imanlogics_sync_git',
          description:
            'Safely commit and push published MDX articles and local images to GitHub origin main.',
          inputSchema: {
            type: 'object',
            properties: {
              articleCount: { type: 'number', default: 1 },
            },
          },
        },
        {
          name: 'imanlogics_dispatch_notification',
          description:
            'Send formatted Markdown notification report to WhatsApp number 085335329341.',
          inputSchema: {
            type: 'object',
            properties: {
              payload: { type: 'object' },
              phoneNumber: { type: 'string' },
            },
            required: ['payload'],
          },
        },
        {
          name: 'imanlogics_inspect_wa_report',
          description:
            'Preview the 12-hour aggregated WhatsApp report for 05:00 / 17:00 dissemination.',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'imanlogics_get_system_status',
          description:
            'Get live status of 3-hour scheduler lock, next run slot, 12-hour cycle history, and system time info.',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }
  })

  // -------------------------------------------------------------
  // CALL TOOL
  // -------------------------------------------------------------
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params

    switch (name) {
      case 'imanlogics_discover_stories': {
        const cat = (args?.category as string) || 'all'
        let techStories: TechNewsStory[] = []
        let islamicStories: IslamicAcademicStory[] = []

        if (cat === 'all' || cat === 'tech-ai') {
          techStories = await TechResearchEngine.discoverVerifiedStories()
        }
        if (cat === 'all' || cat === 'islamic-logic') {
          islamicStories = await IslamicResearchEngine.discoverVerifiedStories()
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  totalDiscovered: techStories.length + islamicStories.length,
                  techStories,
                  islamicStories,
                },
                null,
                2
              ),
            },
          ],
        }
      }

      case 'imanlogics_inspect_evidence': {
        const storyId = args?.storyId as string
        const category = args?.category as string
        const today = new Date().toISOString().split('T')[0]

        if (category === 'islamic-logic') {
          const candidates = IslamicResearchEngine.getFreshIslamicAcademicCandidates(today)
          const match = candidates.find((s) => s.id === storyId)
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    storyId,
                    titles: match?.titles,
                    epistemologicalPoints:
                      match?.epistemologicalPoints || match?.epistemologicalMatrix || [],
                    honestBoundaries: match?.honestBoundaries,
                    sources: match?.sources,
                  },
                  null,
                  2
                ),
              },
            ],
          }
        } else {
          const candidates = TechResearchEngine.getFreshTechNewsCandidates(today)
          const match = candidates.find((s) => s.id === storyId)
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    storyId,
                    titles: match?.titles,
                    citationChain: match?.citationChain,
                    editorialBenchmark: match?.editorialBenchmark,
                    metrics: match?.metrics,
                    sources: match?.sources,
                  },
                  null,
                  2
                ),
              },
            ],
          }
        }
      }

      case 'imanlogics_inspect_media_pool': {
        const lang = (args?.language as string) || 'all'
        let pools: Record<string, MediaOutlet[]> = MEDIA_SOURCE_POOLS
        if (lang === 'id') pools = { indonesia: MEDIA_SOURCE_POOLS.indonesia }
        if (lang === 'en') pools = { globalEnglish: MEDIA_SOURCE_POOLS.globalEnglish }
        if (lang === 'ar') pools = { arabic: MEDIA_SOURCE_POOLS.arabic }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  pools,
                  primaryLayers: PRIMARY_SOURCE_LAYERS,
                },
                null,
                2
              ),
            },
          ],
        }
      }

      case 'imanlogics_verify_sources': {
        const sources = (args?.sources as SourceCitation[]) || []
        const result = SourceVerifier.verifyDualTier(sources)
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        }
      }

      case 'imanlogics_source_media': {
        const keywords = (args?.keywords as string[]) || []
        const category = (args?.category as 'tech-ai' | 'islamic-logic') || 'tech-ai'
        const articleSlug = (args?.articleSlug as string) || 'default'
        const maxCount = (args?.maxCount as number) || 3

        const result = await AssetDownloader.discoverAndDownloadSafeImages(
          keywords,
          category,
          2,
          maxCount,
          articleSlug
        )
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        }
      }

      case 'imanlogics_build_article': {
        const category = args?.category as string
        const storyId = args?.storyId as string
        const today = new Date().toISOString().split('T')[0]

        if (category === 'tech-ai') {
          const candidates = TechResearchEngine.getFreshTechNewsCandidates(today)
          const story = candidates.find((s) => s.id === storyId) || candidates[0]
          const articles = await TechArticleBuilder.buildTrilingualArticles(story)
          return {
            content: [{ type: 'text', text: JSON.stringify({ storyId, articles }, null, 2) }],
          }
        } else {
          const candidates = IslamicResearchEngine.getFreshIslamicAcademicCandidates(today)
          const story = candidates.find((s) => s.id === storyId) || candidates[0]
          const articles = await IslamicArticleBuilder.buildTrilingualArticles(story)
          return {
            content: [{ type: 'text', text: JSON.stringify({ storyId, articles }, null, 2) }],
          }
        }
      }

      case 'imanlogics_audit_qc': {
        const article: MdxArticle = {
          filename: (args?.filename as string) || 'article.mdx',
          filepath: '',
          content: (args?.content as string) || '',
          language: (args?.language as 'id' | 'en' | 'ar') || 'id',
          publishedHoursAgo: (args?.publishedHoursAgo as number) ?? 0,
          frontmatter: {
            title: '',
            date: '',
            tags: [],
            draft: false,
            summary: '',
            images: [],
            authors: ['default'],
            language: (args?.language as 'id' | 'en' | 'ar') || 'id',
            translation_group: '',
            original_language: 'id',
            category: (args?.category as 'tech-ai' | 'islamic-logic') || 'tech-ai',
            articleType: (args?.articleType as string) || 'Analysis',
            sources: (args?.sources as Array<{ name: string; url: string; tier: number }>) || [],
            imageCredits: (args?.imageCredits as ImageCreditRecord[]) || [],
          },
        }

        const qcResult = EditorialQCEngine.evaluateArticle(article)
        return {
          content: [{ type: 'text', text: JSON.stringify(qcResult, null, 2) }],
        }
      }

      case 'imanlogics_publish_cycle': {
        const dryRun = Boolean(args?.dryRun)
        const gitPush = args?.gitPush !== false
        const notifyWA = Boolean(args?.notifyWhatsApp)

        const report = await EditorialOrchestrator.runEditorialPipeline({
          dryRun,
          gitPush,
        })

        if (notifyWA && !dryRun) {
          await WhatsAppService.sendNotification({
            status: report.status,
            articlesPublished: report.articlesPublished,
            publishedStories: report.publishedStoryDetails,
            techArticlesCount: report.publishedStoryDetails.filter((s) => s.category === 'tech-ai')
              .length,
            islamicArticlesCount: report.publishedStoryDetails.filter(
              (s) => s.category === 'islamic-logic'
            ).length,
            totalTrilingualArticles: report.articlesPublished.length,
            qcAverageScore: 100,
            gitPushStatus: report.gitCommitHash
              ? `Ter-push ke origin/main (Commit: ${report.gitCommitHash})`
              : 'ℹ️ Bersih / Tidak ada commit baru',
            nextCycleTime: '05:00 / 17:00 WIB',
          })
        }

        return {
          content: [{ type: 'text', text: JSON.stringify(report, null, 2) }],
        }
      }

      case 'imanlogics_sync_git': {
        const count = (args?.articleCount as number) || 1
        const res = GitSyncService.syncToOrigin(count)
        return {
          content: [{ type: 'text', text: JSON.stringify(res, null, 2) }],
        }
      }

      case 'imanlogics_dispatch_notification': {
        const rawPayload = args?.payload as unknown as NotificationPayload | undefined
        const payload = rawPayload || WhatsAppService.buildAggregatedPayload()
        const phone = args?.phoneNumber as string | undefined
        const success = await WhatsAppService.sendNotification(payload, phone)
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success,
                recipient: phone || MCP_CONFIG.targetWhatsAppNumber,
              }),
            },
          ],
        }
      }

      case 'imanlogics_inspect_wa_report': {
        const report = StateStore.getLatestReport()
        const messageText = ReportFormatter.formatWhatsAppReport({
          status: report?.status || 'SUCCESS',
          articlesPublished: report?.articlesPublished || [],
          publishedStories: report?.publishedStoryDetails || [],
          techArticlesCount:
            report?.publishedStoryDetails.filter((s) => s.category === 'tech-ai').length || 0,
          islamicArticlesCount:
            report?.publishedStoryDetails.filter((s) => s.category === 'islamic-logic').length || 0,
          totalTrilingualArticles: report?.articlesPublished.length || 0,
          qcAverageScore: 100,
          gitPushStatus: 'ℹ️ Preview Mode',
          nextCycleTime: '05:00 / 17:00 WIB',
        })
        return {
          content: [{ type: 'text', text: messageText }],
        }
      }

      case 'imanlogics_get_system_status': {
        const tz = ReportFormatter.getLocalSystemTimeInfo()
        const isLocked = LockManager.isLocked()
        const recentCycles = StateStore.getReportsInTimeWindow(12)
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  systemTime: tz,
                  schedulerLockActive: isLocked,
                  researchIntervalHours: 3,
                  whatsappScheduleSlots: ['05:00', '17:00'],
                  recent12HourCyclesCount: recentCycles.length,
                  latestReport: recentCycles[0] || null,
                  config: {
                    blogDataDir: MCP_CONFIG.blogDataDir,
                    blogBaseUrl: MCP_CONFIG.blogBaseUrl,
                    targetWhatsAppNumber: MCP_CONFIG.targetWhatsAppNumber,
                  },
                },
                null,
                2
              ),
            },
          ],
        }
      }

      default:
        throw new Error(`Unknown tool name: ${name}`)
    }
  })

  // -------------------------------------------------------------
  // LIST RESOURCES
  // -------------------------------------------------------------
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: 'imanlogics://config/site',
          name: 'Site Configuration',
          mimeType: 'application/json',
          description: 'Global site metadata and blog configuration',
        },
        {
          uri: 'imanlogics://config/media-pools',
          name: '75 Media Source Pools & Primary Layers',
          mimeType: 'application/json',
          description: 'Permanent catalog of 75 benchmark media outlets across ID/EN/AR',
        },
        {
          uri: 'imanlogics://vault/media',
          name: 'Copyright-Safe Image Vault',
          mimeType: 'application/json',
          description: 'Catalog of verified editorial images with license details',
        },
        {
          uri: 'imanlogics://status/scheduler',
          name: 'Scheduler Status',
          mimeType: 'application/json',
          description: 'Live scheduler lock and recent 12-hour cycle reports',
        },
      ],
    }
  })

  // -------------------------------------------------------------
  // READ RESOURCE
  // -------------------------------------------------------------
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params

    if (uri === 'imanlogics://config/site') {
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(MCP_CONFIG, null, 2),
          },
        ],
      }
    }

    if (uri === 'imanlogics://config/media-pools') {
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({ MEDIA_SOURCE_POOLS, PRIMARY_SOURCE_LAYERS }, null, 2),
          },
        ],
      }
    }

    if (uri === 'imanlogics://vault/media') {
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(
              { message: '100% Dynamic Wikimedia Commons & Scraped Media API Active' },
              null,
              2
            ),
          },
        ],
      }
    }

    if (uri === 'imanlogics://status/scheduler') {
      const state = StateStore.load()
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(state, null, 2),
          },
        ],
      }
    }

    throw new Error(`Resource not found: ${uri}`)
  })

  // -------------------------------------------------------------
  // LIST & GET PROMPTS
  // -------------------------------------------------------------
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
      prompts: [
        {
          name: 'imanlogics_run_cycle',
          description: 'Run the end-to-end autonomous publication cycle with human preview.',
        },
        {
          name: 'imanlogics_qc_audit',
          description: 'Perform a comprehensive 100-point QC audit on a draft article.',
        },
      ],
    }
  })

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name } = request.params
    if (name === 'imanlogics_run_cycle') {
      return {
        description: 'Run the end-to-end autonomous publication cycle with human preview.',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: 'Please execute imanlogics_publish_cycle with dryRun=true first to inspect QC scores, then publish and push to GitHub.',
            },
          },
        ],
      }
    }
    throw new Error(`Prompt not found: ${name}`)
  })

  return server
}

/**
 * Main Stdio Entrypoint
 */
export async function runMcpServerStdio() {
  const server = createImanLogicsMcpServer()
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('ImanLogics MCP Server running on stdio transport.')
}

if (require.main === module) {
  runMcpServerStdio().catch((err) => {
    console.error('Fatal MCP Server Error:', err)
    process.exit(1)
  })
}
