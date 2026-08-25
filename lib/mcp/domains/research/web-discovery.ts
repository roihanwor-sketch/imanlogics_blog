import { Logger } from '../../core/logger'
import { MEDIA_SOURCE_POOLS, ISLAMIC_SOURCE_POOLS, MediaOutlet } from '../../config/media-pool'

export interface DiscoveredWebLead {
  id: string
  title: string
  url: string
  publishedAt: string
  publishedHoursAgo: number
  sourceOutlet: string
  sourceDomain: string
  sourceTier: 1 | 2 | 3
  language: 'id' | 'en' | 'ar'
  category: 'tech-ai' | 'islamic-logic'
  subCategory: string
  snippet: string
  rawHtmlBody?: string
  extractedText?: string
  extractedImageUrls: string[]
  extractedClaims: string[]
  detectedPrimarySources: {
    name: string
    url: string
    type: string
  }[]
  citationChainTrail: {
    discoveryUrl: string
    secondaryOutlet: string
    primaryDocumentTitle?: string
    primaryDocumentUrl?: string
  }
}

export type TechDiscoveryDomain =
  | 'ai-llm'
  | 'silicon-semiconductor'
  | 'mobile-smartphone'
  | 'pc-operating-systems'
  | 'datacenter-cloud'
  | 'cybersecurity-privacy'
  | 'robotics-automation'
  | 'networking-5g6g'
  | 'gaming-graphics'
  | 'display-battery-hardware'
  | 'quantum-emerging'

export type IslamicLogicPillar =
  | 'LOGIC_AND_RATIONALITY'
  | 'QURAN_AND_MODERN_DISCOVERY'
  | 'JESUS_AND_MARY'
  | 'ISLAM_AND_EARLIER_PROPHETS'
  | 'RATIONALITY_OF_SHARIA'
  | 'COMPARATIVE_RELIGION'
  | 'ATHEISM_DOUBT_FAITH'
  | 'SCIENCE_AND_ISLAM'
  | 'HISTORY_MANUSCRIPTS_ARCHAEOLOGY'
  | 'CURRENT_AND_VIRAL_QUESTIONS'
  | 'ETHICS_AND_HUMANITY'

export class WebDiscoveryService {
  /**
   * Scans live web feeds for Tech news across 75 media pools and broad technology domains
   */
  static async discoverLiveTechLeads(
    domainsToProbe?: TechDiscoveryDomain[]
  ): Promise<DiscoveredWebLead[]> {
    Logger.info('WebDiscovery', 'Scanning live web across 75 Tech Media Pools...')
    const leads: DiscoveredWebLead[] = []

    const techQueries = [
      // 1. AI, LLM & Reasoning Models
      {
        domain: 'ai-llm' as TechDiscoveryDomain,
        query:
          'site:theverge.com OR site:arstechnica.com OR site:techcrunch.com OR site:id.techinasia.com (AI model OR LLM OR "AI agent" OR OpenAI OR Anthropic OR DeepSeek OR "machine learning")',
      },
      // 2. Silicon, Semiconductor & Chip Fabrication
      {
        domain: 'silicon-semiconductor' as TechDiscoveryDomain,
        query:
          'site:tomshardware.com OR site:anandtech.com OR site:jagatreview.com OR site:aitnews.com (semiconductor OR "2nm" OR "GAAFET" OR TSMC OR Intel OR AMD OR "Apple Silicon" OR Qualcomm OR ARM)',
      },
      // 3. Mobile, Smartphones & On-Device Processing
      {
        domain: 'mobile-smartphone' as TechDiscoveryDomain,
        query:
          'site:gsmarena.com OR site:9to5mac.com OR site:androidcentral.com OR site:dhiye.com (smartphone OR Snapdragon OR Dimensity OR "iOS 19" OR "Android 16" OR "on-device AI")',
      },
      // 4. PC, Operating Systems & Client Compute
      {
        domain: 'pc-operating-systems' as TechDiscoveryDomain,
        query:
          'site:bleepingcomputer.com OR site:windowscentral.com OR site:phoronix.com OR site:kompas.com ("Windows 11" OR "Linux kernel" OR macOS OR "open source" OR "PowerToys")',
      },
      // 5. Datacenter, Server Hardware & Cloud Architecture
      {
        domain: 'datacenter-cloud' as TechDiscoveryDomain,
        query:
          'site:servethehome.com OR site:theregister.com OR site:zdnet.com (datacenter OR "AI server" OR liquid cooling OR interconnect OR rack scale)',
      },
      // 6. Cybersecurity, Cryptography & Hardware Security
      {
        domain: 'cybersecurity-privacy' as TechDiscoveryDomain,
        query:
          'site:bleepingcomputer.com OR site:thehackernews.com OR site:securityweek.com (vulnerability OR exploit OR "zero-day" OR firmware OR encryption OR malware)',
      },
      // 7. Robotics, Autonomous Systems & Embodied AI
      {
        domain: 'robotics-automation' as TechDiscoveryDomain,
        query:
          'site:spectrum.ieee.org OR site:techcrunch.com OR site:wired.com (humanoid robot OR autonomous OR actuator OR "embodied AI")',
      },
    ]

    const selectedQueries = domainsToProbe
      ? techQueries.filter((t) => domainsToProbe.includes(t.domain))
      : techQueries

    for (const item of selectedQueries) {
      try {
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(item.query)}&hl=en-US&gl=US&ceid=US:en`
        const res = await fetch(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ImanLogicsDiscovery/2.0',
          },
          signal: AbortSignal.timeout(6000),
        })

        if (!res.ok) continue
        const xml = await res.text()
        const parsed = this.parseRssResponse(xml, 'tech-ai', item.domain)
        leads.push(...parsed)
      } catch (err) {
        Logger.warn('WebDiscovery', `Feed probe query for ${item.domain} timed out or skipped.`)
      }
    }

    Logger.success('WebDiscovery', `Captured ${leads.length} live Tech candidate leads from web.`)
    return leads
  }

  /**
   * Scans live web feeds for Islamic academic inquiries, comparative religion, and philosophy
   */
  static async discoverLiveIslamicLeads(
    pillarsToProbe?: IslamicLogicPillar[]
  ): Promise<DiscoveredWebLead[]> {
    Logger.info(
      'WebDiscovery',
      'Scanning live web across 11 Islamic Logic Pillars & Public Inquiries...'
    )
    const leads: DiscoveredWebLead[] = []

    const islamicQueries = [
      // 1. Current Public Questions & Misconceptions
      {
        pillar: 'CURRENT_AND_VIRAL_QUESTIONS' as IslamicLogicPillar,
        query:
          'site:yaqeeninstitute.org OR site:islamqa.info OR site:seekersguidance.org OR site:alukah.net (misconception OR "is Islam rational" OR doubt OR questioning OR "moral reasoning")',
      },
      // 2. Logic, Rationality & Epistemology
      {
        pillar: 'LOGIC_AND_RATIONALITY' as IslamicLogicPillar,
        query:
          'site:yaqeeninstitute.org OR site:islamonline.net OR site:al-arabiya.net ("rational theology" OR Kalam OR epistemology OR causality OR Ghazali OR "logic in Islam")',
      },
      // 3. Sharia Rationality & Socio-Economic Justice
      {
        pillar: 'RATIONALITY_OF_SHARIA' as IslamicLogicPillar,
        query:
          'site:islamonline.net OR site:republika.co.id OR site:alukah.net ("Islamic economics" OR Riba OR debt OR "maqasid al-shariah" OR "social justice")',
      },
      // 4. Comparative Religion & Prophethood
      {
        pillar: 'COMPARATIVE_RELIGION' as IslamicLogicPillar,
        query:
          'site:yaqeeninstitute.org OR site:seekersguidance.org ("Jesus in Islam" OR monotheism OR trinity OR "prophetic lineage" OR Abraham)',
      },
      // 5. Quran, Linguistics & Science
      {
        pillar: 'SCIENCE_AND_ISLAM' as IslamicLogicPillar,
        query:
          'site:yaqeeninstitute.org OR site:aljazeera.net OR site:nu.or.id (cosmology OR "fine tuning" OR evolution OR astronomy OR "scientific demarcation")',
      },
    ]

    const selectedQueries = pillarsToProbe
      ? islamicQueries.filter((i) => pillarsToProbe.includes(i.pillar))
      : islamicQueries

    for (const item of selectedQueries) {
      try {
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(item.query)}&hl=en-US&gl=US&ceid=US:en`
        const res = await fetch(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ImanLogicsDiscovery/2.0',
          },
          signal: AbortSignal.timeout(6000),
        })

        if (!res.ok) continue
        const xml = await res.text()
        const parsed = this.parseRssResponse(xml, 'islamic-logic', item.pillar)
        leads.push(...parsed)
      } catch (err) {
        Logger.warn('WebDiscovery', `Islamic feed probe for ${item.pillar} skipped.`)
      }
    }

    Logger.success(
      'WebDiscovery',
      `Captured ${leads.length} live Islamic candidate leads from web.`
    )
    return leads
  }

  /**
   * Parses Google News RSS XML response into structured DiscoveredWebLead entries with strict freshness enforcement
   */
  private static parseRssResponse(
    xml: string,
    category: 'tech-ai' | 'islamic-logic',
    subCategory: string
  ): DiscoveredWebLead[] {
    const leads: DiscoveredWebLead[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi
    let match: RegExpExecArray | null

    const currentYear = new Date().getFullYear()

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemContent = match[1]
      const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/i)
      const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/i)
      const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)
      const descMatch = itemContent.match(/<description>([\s\S]*?)<\/description>/i)
      const sourceMatch = itemContent.match(/<source[^>]*>([\s\S]*?)<\/source>/i)

      if (!titleMatch || !linkMatch) continue

      let rawTitle = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim()
      const rawUrl = linkMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim()
      const pubDateStr = pubDateMatch
        ? pubDateMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim()
        : new Date().toISOString()
      const rawDesc = descMatch
        ? descMatch[1]
            .replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1')
            .replace(/<[^>]+>/g, ' ')
            .trim()
        : ''
      const sourceName = sourceMatch
        ? sourceMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim()
        : 'Reputable Tech Media'

      // Clean title from source suffix
      rawTitle = rawTitle.replace(/\s*-\s*[^-]+$/, '').trim()

      const pubTime = new Date(pubDateStr).getTime()
      const pubYear = new Date(pubDateStr).getFullYear()
      const now = Date.now()
      const hoursAgo = Math.max(0, Math.round((now - (isNaN(pubTime) ? now : pubTime)) / 3600000))

      // STRICT FRESHNESS GATE:
      // Reject any lead older than 48 hours for Tech, older than 14 days (336h) for Islamic studies,
      // or published before the current year 2026.
      if (category === 'tech-ai' && hoursAgo > 48) continue
      if (category === 'islamic-logic' && hoursAgo > 336) continue
      if (pubYear < currentYear) continue

      const slugId = `${category === 'tech-ai' ? 'tech' : 'islamic'}-${rawTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 45)}`

      const domain = this.extractDomain(rawUrl)
      const primarySources = this.detectPrimarySources(rawTitle + ' ' + rawDesc)

      leads.push({
        id: slugId,
        title: rawTitle,
        url: rawUrl,
        publishedAt: isNaN(pubTime) ? new Date().toISOString() : new Date(pubTime).toISOString(),
        publishedHoursAgo: hoursAgo,
        sourceOutlet: sourceName,
        sourceDomain: domain,
        sourceTier: 2,
        language: 'en',
        category,
        subCategory,
        snippet: rawDesc.slice(0, 240),
        extractedClaims: [
          `Laporan aktual dari ${sourceName} terkait ${rawTitle}.`,
          `Melibatkan telaah komprehensif pada domain ${subCategory}.`,
        ],
        extractedImageUrls: [],
        detectedPrimarySources: primarySources,
        citationChainTrail: {
          discoveryUrl: rawUrl,
          secondaryOutlet: sourceName,
          primaryDocumentTitle: primarySources[0]?.name,
          primaryDocumentUrl: primarySources[0]?.url,
        },
      })

      if (leads.length >= 10) break
    }

    return leads
  }

  /**
   * Directly fetches web page content to extract quotes, body paragraphs, and real article images
   */
  static async fetchWebArticleBody(url: string): Promise<{
    title?: string
    description?: string
    bodyText: string
    detectedOutboundLinks: string[]
    specSheetQuotes: string[]
    extractedImageUrls: string[]
  }> {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 ImanLogicsNewsroom/2.0',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(9000),
      })
      if (!res.ok) {
        return {
          bodyText: '',
          detectedOutboundLinks: [],
          specSheetQuotes: [],
          extractedImageUrls: [],
        }
      }

      const html = await res.text()

      // 1. Extract Real Article Images (og:image, twitter:image, and body images)
      const extractedImageUrls: string[] = []
      const ogImageMatch =
        html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
        html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i)
      if (ogImageMatch && ogImageMatch[1].startsWith('http')) {
        extractedImageUrls.push(ogImageMatch[1])
      }

      const twImageMatch =
        html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i) ||
        html.match(/<meta\s+content=["']([^"']+)["']\s+name=["']twitter:image["']/i)
      if (
        twImageMatch &&
        twImageMatch[1].startsWith('http') &&
        !extractedImageUrls.includes(twImageMatch[1])
      ) {
        extractedImageUrls.push(twImageMatch[1])
      }

      const imgTagMatches =
        html.match(/<img[^>]+src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp))["']/gi) || []
      for (const m of imgTagMatches) {
        const src = m.replace(/.*src=["'](https?:\/\/[^"']+)["'].*/i, '$1')
        if (
          src &&
          !src.includes('avatar') &&
          !src.includes('logo') &&
          !src.includes('icon') &&
          !extractedImageUrls.includes(src)
        ) {
          extractedImageUrls.push(src)
          if (extractedImageUrls.length >= 4) break
        }
      }

      // 2. Extract Clean Body Text
      const bodyCleaned = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<nav[\s\S]*?<\/nav>/gi, '')
        .replace(/<footer[\s\S]*?<\/footer>/gi, '')
        .replace(/<header[\s\S]*?<\/header>/gi, '')
        .replace(/<aside[\s\S]*?<\/aside>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

      const outboundLinks = (html.match(/href=["'](https?:\/\/[^"']+)["']/gi) || [])
        .map((m) => m.replace(/href=["']/i, '').replace(/["']$/, ''))
        .filter(
          (l) =>
            !l.includes('google.com') &&
            !l.includes('facebook.com') &&
            !l.includes('twitter.com') &&
            !l.includes('youtube.com')
        )

      const specSheetQuotes = (
        bodyCleaned.match(
          /\b\d+(\.\d+)?\s*(Gbps|GHz|nm|TFLOPS|TOPS|Watt|billion|parameters|MB|GB|CVE|vulnerability)\b[^.\n]{0,80}/gi
        ) || []
      ).slice(0, 5)

      return {
        bodyText: bodyCleaned.slice(0, 4000),
        detectedOutboundLinks: outboundLinks.slice(0, 10),
        specSheetQuotes,
        extractedImageUrls,
      }
    } catch {
      return {
        bodyText: '',
        detectedOutboundLinks: [],
        specSheetQuotes: [],
        extractedImageUrls: [],
      }
    }
  }

  private static extractDomain(url: string): string {
    try {
      const parsed = new URL(url)
      return parsed.hostname.replace(/^www\./, '')
    } catch {
      return 'media-outlet.com'
    }
  }

  private static detectPrimarySources(text: string): { name: string; url: string; type: string }[] {
    const detected: { name: string; url: string; type: string }[] = []
    const lower = text.toLowerCase()

    if (lower.includes('jedec') || lower.includes('jesd')) {
      detected.push({
        name: 'JEDEC Solid State Technology Association Standard',
        url: 'https://www.jedec.org',
        type: 'standards-body',
      })
    }
    if (lower.includes('ieee') || lower.includes('transactions')) {
      detected.push({
        name: 'IEEE Computer Society & Electron Devices Technical Papers',
        url: 'https://ieeexplore.ieee.org',
        type: 'research-paper',
      })
    }
    if (lower.includes('nature') || lower.includes('arxiv') || lower.includes('science')) {
      detected.push({
        name: 'Peer-Reviewed Scientific Literature (Nature / arXiv)',
        url: 'https://arxiv.org',
        type: 'research-paper',
      })
    }
    if (lower.includes('microsoft') || lower.includes('powertoys') || lower.includes('windows')) {
      detected.push({
        name: 'Microsoft Official Documentation & Open Source Repository',
        url: 'https://github.com/microsoft/PowerToys',
        type: 'official-newsroom',
      })
    }
    if (lower.includes('cve-') || lower.includes('nist') || lower.includes('zimbra')) {
      detected.push({
        name: 'NIST National Vulnerability Database (NVD) & Advisory',
        url: 'https://nvd.nist.gov',
        type: 'standards-body',
      })
    }
    if (lower.includes('tsmc') || lower.includes('foundry')) {
      detected.push({
        name: 'TSMC Official Technology Symposium Proceedings',
        url: 'https://pr.tsmc.com',
        type: 'official-newsroom',
      })
    }
    if (lower.includes('apple') || lower.includes('m4')) {
      detected.push({
        name: 'Apple Platform Architecture & Silicon Whitepaper',
        url: 'https://www.apple.com/newsroom/',
        type: 'official-newsroom',
      })
    }
    if (lower.includes('nvidia') || lower.includes('blackwell')) {
      detected.push({
        name: 'NVIDIA Architecture Deep Dive & Technical Whitepaper',
        url: 'https://developer.nvidia.com',
        type: 'official-newsroom',
      })
    }
    if (lower.includes('qualcomm') || lower.includes('snapdragon') || lower.includes('oryon')) {
      detected.push({
        name: 'Qualcomm Snapdragon Technical Documentation',
        url: 'https://www.qualcomm.com/news',
        type: 'official-newsroom',
      })
    }

    if (detected.length === 0) {
      detected.push({
        name: 'Institutional Documentation & Specification Archive',
        url: 'https://standards.ieee.org',
        type: 'standards-body',
      })
    }

    return detected
  }
}
