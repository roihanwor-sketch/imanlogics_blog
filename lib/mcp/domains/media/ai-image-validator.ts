import { Logger } from '../../core/logger'
import { LiveImageSearchResult } from './live-image-searcher'

export interface ImageValidationResult {
  isValid: boolean
  confidenceScore: number
  relevanceReason: string
}

export class AISemanticImageValidator {
  /**
   * Evaluates if an image candidate is a genuine, authentic match for the article topic
   */
  static validateImageCandidate(
    candidate: LiveImageSearchResult,
    topicTitle: string,
    category: 'tech-ai' | 'islamic-logic',
    keywords: string[] = []
  ): ImageValidationResult {
    const textCorpus =
      `${candidate.title} ${candidate.description} ${candidate.sourceUrl}`.toLowerCase()
    const topicLower = topicTitle.toLowerCase()
    const allKeywords = [...keywords.map((k) => k.toLowerCase()), ...topicLower.split(/\s+/)]

    // Filter out common irrelevant graphics and scanned book archives
    const bannedPatterns = [
      /\bflag\b/i,
      /\bmap of\b/i,
      /\bblank\b/i,
      /\bicon\b/i,
      /\btemplate\b/i,
      /\blogo of government\b/i,
      /\bwikiproject\b/i,
      /internet archive book images/i,
      /identifier:\s*\w+/i,
      /the american florist/i,
      /art in california/i,
      /survey of american art/i,
      /digitizing sponsor/i,
      /contributing library/i,
      /text appearing before image/i,
      /plate no\.\s*\d+/i,
      /\.djvu$/i,
      /\bmilitary\b/i,
      /\bsoldier\b/i,
      /\barmy\b/i,
      /\binfantry\b/i,
      /\bnational guard\b/i,
      /\bcommand post\b/i,
      /\bsergeant\b/i,
      /\bcommander\b/i,
      /\bwar simulator\b/i,
    ]

    for (const pattern of bannedPatterns) {
      if (
        pattern.test(candidate.title) ||
        pattern.test(candidate.description) ||
        pattern.test(candidate.author)
      ) {
        return {
          isValid: false,
          confidenceScore: 0,
          relevanceReason: `Rejected scanned book/irrelevant archive: "${candidate.title}"`,
        }
      }
    }

    // 1. Check direct keyword and entity matches
    let matchCount = 0
    for (const kw of allKeywords) {
      if (kw.length > 2 && textCorpus.includes(kw)) {
        matchCount++
      }
    }

    // 2. Domain-specific contextual verification
    if (category === 'tech-ai') {
      const isSmartphone =
        /phone|smartphone|mobile|xperia|galaxy|iphone|pixel|poco|oneplus|redmi/i.test(topicLower)
      const isProcessor =
        /chip|silicon|processor|die|ucie|semiconductor|wafer|intel|amd|nvidia|qualcomm|arm|snapdragon/i.test(
          topicLower
        )
      const isAI = /ai|llm|neural|model|inference|gpt|deepseek|claude|gemini|transformer/i.test(
        topicLower
      )

      if (isSmartphone) {
        const hasMobileVisual =
          /phone|smartphone|mobile|device|screen|display|camera|back|front|handset|sony|xperia|galaxy|poco/i.test(
            textCorpus
          )
        if (hasMobileVisual || matchCount >= 1) {
          return {
            isValid: true,
            confidenceScore: 95,
            relevanceReason: `Visual candidate accurately portrays smartphone hardware: "${candidate.title}"`,
          }
        }
      }

      if (isProcessor) {
        const hasProcessorVisual =
          /processor|chip|die|silicon|wafer|cpu|gpu|integrated circuit|circuit|microarchitecture|transistor|hardware|semiconductor|server|motherboard|socket/i.test(
            textCorpus
          )
        if (hasProcessorVisual) {
          return {
            isValid: true,
            confidenceScore: 95,
            relevanceReason: `Visual candidate accurately portrays semiconductor processor/die: "${candidate.title}"`,
          }
        }
        return {
          isValid: false,
          confidenceScore: 0,
          relevanceReason: `Rejected non-processor visual for semiconductor topic: "${candidate.title}"`,
        }
      }

      if (isAI) {
        const hasAIVisual =
          /neural|network|ai|artificial|compute|datacenter|server|algorithm|intelligence/i.test(
            textCorpus
          )
        if (hasAIVisual || matchCount >= 1) {
          return {
            isValid: true,
            confidenceScore: 90,
            relevanceReason: `Visual candidate accurately portrays AI architecture/compute: "${candidate.title}"`,
          }
        }
      }
    } else {
      // Islamic Logic / Academic
      const isManuscript = /manuscript|quran|bible|scroll|qumran|birmingham|folio|text|codex/i.test(
        topicLower
      )
      const isHistory = /history|prayer|isa|jesus|mosque|archaeology|prophet|monotheism/i.test(
        topicLower
      )

      if (isManuscript) {
        const hasManuscriptVisual =
          /manuscript|folio|quran|bible|codex|scroll|text|arabic|hebrew|greek|parchment/i.test(
            textCorpus
          )
        if (hasManuscriptVisual || matchCount >= 1) {
          return {
            isValid: true,
            confidenceScore: 95,
            relevanceReason: `Visual candidate accurately portrays historical manuscript: "${candidate.title}"`,
          }
        }
      }

      if (isHistory) {
        const hasHistoryVisual =
          /manuscript|architecture|mosque|history|archaeology|monument|prayer|scripture/i.test(
            textCorpus
          )
        if (hasHistoryVisual || matchCount >= 1) {
          return {
            isValid: true,
            confidenceScore: 90,
            relevanceReason: `Visual candidate accurately portrays historical/theological context: "${candidate.title}"`,
          }
        }
      }
    }

    // Generic match threshold
    if (matchCount >= 2) {
      return {
        isValid: true,
        confidenceScore: 85,
        relevanceReason: `Candidate satisfies multi-keyword entity match (${matchCount} matches): "${candidate.title}"`,
      }
    }

    return {
      isValid: matchCount >= 1,
      confidenceScore: matchCount >= 1 ? 75 : 30,
      relevanceReason: `Candidate visual context matched with confidence ${matchCount >= 1 ? '75%' : '30%'}`,
    }
  }
}
