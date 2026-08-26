import fs from 'fs'
import path from 'path'
import { DiscoveredWebLead } from './web-discovery'
import { MCP_CONFIG } from '../../config/env'
import { Logger } from '../../core/logger'

export interface ScoredCandidate {
  lead: DiscoveredWebLead
  scores: {
    freshness: number
    evidenceQuality: number
    readerInterest: number
    novelty: number
    domainDiversity: number
    repetitionPenalty: number
    totalScore: number
  }
  repetitionReason?: string
  editorialRationale: string
  approvedForPipeline: boolean
  determinedFormat:
    | 'BREAKING_NEWS'
    | 'EXPLAINER'
    | 'DEEP_DIVE_ARCHITECTURAL'
    | 'ECONOMIC_ANALYSIS'
    | 'SECURITY_INVESTIGATION'
    | 'READER_FIRST_INQUIRY'
}

export interface EditorialBoardDecision {
  totalLeadsEvaluated: number
  approvedCandidates: ScoredCandidate[]
  rejectedCandidates: ScoredCandidate[]
  topTechCandidate?: ScoredCandidate
  topIslamicCandidate?: ScoredCandidate
  decisionSummary: string
}

export class EditorialSelectionBoard {
  /**
   * Evaluates raw discovered leads and selects only the highest-caliber candidates
   */
  static evaluateAndSelectCandidates(leads: DiscoveredWebLead[]): EditorialBoardDecision {
    Logger.info(
      'EditorialBoard',
      `Evaluating ${leads.length} raw web leads across multi-criteria matrix...`
    )

    const blogDir = MCP_CONFIG.blogDataDir
    const publishedSlugs: string[] = fs.existsSync(blogDir)
      ? fs.readdirSync(blogDir).map((f) => f.replace(/(\.id|\.en|\.ar)?\.mdx$/, ''))
      : []

    // Read recent 5 cycles history to detect repetition patterns
    const historyPath =
      MCP_CONFIG.historyFilePath || path.join(process.cwd(), 'data', '.cycle-history.json')
    let recentPublishedKeywords: string[] = []
    if (fs.existsSync(historyPath)) {
      try {
        const hist = JSON.parse(fs.readFileSync(historyPath, 'utf8'))
        if (Array.isArray(hist)) {
          recentPublishedKeywords = hist
            .slice(-10)
            .flatMap(
              (h: { storyKeywords?: string[]; storyTitle?: string }) =>
                h.storyKeywords || [h.storyTitle || '']
            )
            .map((k: string) => k.toLowerCase())
        }
      } catch {
        recentPublishedKeywords = []
      }
    }

    const scoredCandidates: ScoredCandidate[] = []

    for (const lead of leads) {
      const lowerTitle = lead.title.toLowerCase()
      const lowerSnippet = lead.snippet.toLowerCase()
      const combined = `${lowerTitle} ${lowerSnippet}`

      // 1. Freshness Score (0-10)
      let freshness = 8
      if (lead.publishedHoursAgo <= 3) freshness = 10
      else if (lead.publishedHoursAgo <= 12) freshness = 9
      else if (lead.publishedHoursAgo <= 24) freshness = 8
      else if (lead.publishedHoursAgo <= 48) freshness = 7
      else if (lead.category === 'islamic-logic')
        freshness = 8 // Evergreen resilience for Islamic logic
      else freshness = 4

      // 2. Evidence Quality (0-10)
      let evidenceQuality = 7
      if (lead.detectedPrimarySources.length > 0) evidenceQuality += 2
      if (lead.sourceTier === 1) evidenceQuality += 1
      evidenceQuality = Math.min(10, evidenceQuality)

      // 3. Reader Interest & Curiosity (0-10)
      let readerInterest = 7
      if (
        combined.includes('why') ||
        combined.includes('how') ||
        combined.includes('breakthrough') ||
        combined.includes('mystery') ||
        combined.includes('vs') ||
        combined.includes('truth') ||
        combined.includes('jesus') ||
        combined.includes('god') ||
        combined.includes('reasoning') ||
        combined.includes('efficiency')
      ) {
        readerInterest = 9
      }

      // 4. Novelty Score vs Published Archive (0-10)
      let novelty = 8
      const isAlreadyPublished = publishedSlugs.some((slug) => {
        const leadSlug = lead.id.replace(/^(tech|islamic)-/, '')
        return slug.includes(leadSlug) || leadSlug.includes(slug)
      })

      if (isAlreadyPublished) {
        novelty = 1
      }

      // 5. Domain Diversity Score (0-10)
      let domainDiversity = 8
      if (
        lead.subCategory === 'daily-tech-news' ||
        lead.subCategory === 'mobile-gadgets' ||
        lead.subCategory === 'software-apps-web' ||
        lead.subCategory === 'ai-tools-innovation' ||
        lead.subCategory === 'HIKMAH_AND_SPIRITUAL_LIFE' ||
        lead.subCategory === 'RATIONALITY_OF_SHARIA' ||
        lead.subCategory === 'ATHEISM_DOUBT_FAITH' ||
        lead.subCategory === 'COMPARATIVE_RELIGION'
      ) {
        domainDiversity = 10 // Bonus for high-value general audience topics
      }

      // 6. Dynamic Repetition Penalty (checks against recent keyword collisions)
      let repetitionPenalty = 0
      let repetitionReason: string | undefined = undefined

      const leadWords = lowerTitle.split(/\s+/).filter((w) => w.length > 4)
      const duplicateWord = leadWords.find((w) => recentPublishedKeywords.includes(w))
      if (duplicateWord) {
        repetitionPenalty = 4
        repetitionReason = `Topic containing "${duplicateWord}" covered in recent cycles`
      }

      const totalScore =
        freshness * 0.2 +
        evidenceQuality * 0.25 +
        readerInterest * 0.2 +
        novelty * 0.25 +
        domainDiversity * 0.1 -
        repetitionPenalty

      // Determine Editorial Format
      let determinedFormat: ScoredCandidate['determinedFormat'] = 'EXPLAINER'
      if (lead.category === 'islamic-logic') {
        determinedFormat = 'READER_FIRST_INQUIRY'
      } else if (lead.publishedHoursAgo <= 4) {
        determinedFormat = 'BREAKING_NEWS'
      } else if (lead.subCategory === 'cybersecurity-consumer') {
        determinedFormat = 'SECURITY_INVESTIGATION'
      } else if (lead.subCategory === 'ai-tools-innovation') {
        determinedFormat = 'DEEP_DIVE_ARCHITECTURAL'
      } else {
        determinedFormat = 'EXPLAINER'
      }

      const approvedForPipeline = totalScore >= 6.8 && novelty >= 5

      scoredCandidates.push({
        lead,
        scores: {
          freshness,
          evidenceQuality,
          readerInterest,
          novelty,
          domainDiversity,
          repetitionPenalty,
          totalScore: Math.max(0, Math.round(totalScore * 10) / 10),
        },
        repetitionReason,
        editorialRationale: `Scored ${totalScore.toFixed(1)}/10 [Novelty: ${novelty}/10, Evidence: ${evidenceQuality}/10, Format: ${determinedFormat}]`,
        approvedForPipeline,
        determinedFormat,
      })
    }

    scoredCandidates.sort((a, b) => b.scores.totalScore - a.scores.totalScore)

    const approvedCandidates = scoredCandidates.filter((c) => c.approvedForPipeline)
    const rejectedCandidates = scoredCandidates.filter((c) => !c.approvedForPipeline)

    const topTechCandidate = approvedCandidates.find((c) => c.lead.category === 'tech-ai')
    const topIslamicCandidate = approvedCandidates.find((c) => c.lead.category === 'islamic-logic')

    const decisionSummary = `Editorial Board approved ${approvedCandidates.length} of ${leads.length} leads. Top Tech: ${topTechCandidate ? topTechCandidate.lead.title : 'None'}, Top Islamic: ${topIslamicCandidate ? topIslamicCandidate.lead.title : 'None'}`

    Logger.info('EditorialBoard', decisionSummary)

    return {
      totalLeadsEvaluated: leads.length,
      approvedCandidates,
      rejectedCandidates,
      topTechCandidate,
      topIslamicCandidate,
      decisionSummary,
    }
  }
}
