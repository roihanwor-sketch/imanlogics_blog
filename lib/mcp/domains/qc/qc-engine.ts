import { MdxArticle, HumanEditorialScoreResult } from '../../core/types'
import { FillerDetector } from './filler-detector'
import { LeakDetector } from './leak-detector'
import {
  QC_SCORING_WEIGHTS,
  MIN_EDITORIAL_PASSING_SCORE,
  PREFERRED_EDITORIAL_PASSING_SCORE,
} from './rules-matrix'

export class EditorialQCEngine {
  static evaluateArticle(article: MdxArticle): HumanEditorialScoreResult {
    const warnings: string[] = []
    let hardFailTriggered = false
    let hardFailReason: string | undefined

    const content = article.content
    const wordCount = content.trim().split(/\s+/).length

    // 1. HARD-FAIL: Zero AI Filler Gate
    const fillerRes = FillerDetector.checkAIFiller(content)
    if (fillerRes.failed) {
      hardFailTriggered = true
      hardFailReason = fillerRes.reason
    }

    // 2. HARD-FAIL: Intellectual Honesty / Apologetic Leap Gate
    if (!hardFailTriggered) {
      const apolRes = FillerDetector.checkApologeticLeaps(content)
      if (apolRes.failed) {
        hardFailTriggered = true
        hardFailReason = apolRes.reason
      }
    }

    // 3. HARD-FAIL: Language Purity & Leakage Gate
    if (!hardFailTriggered) {
      const lang = article.language || article.frontmatter.language || 'id'
      const leakRes = LeakDetector.checkLanguagePurity(content, lang, article.filename)
      if (leakRes.failed) {
        hardFailTriggered = true
        hardFailReason = leakRes.reason
      }
    }

    // 4. HARD-FAIL: Freshness Gate for Breaking News
    if (
      !hardFailTriggered &&
      (article.frontmatter.articleType === 'Breaking News' ||
        article.frontmatter.articleType === 'NEWS')
    ) {
      const hours = article.publishedHoursAgo ?? 0
      if (hours > 48) {
        hardFailTriggered = true
        hardFailReason = `Freshness Gate Failed: Story event is ${hours}h old (>48h). Stale events cannot be published as "Breaking News" today.`
      }
    }

    // 5. HARD-FAIL: Mandatory "Why Should I Care?" / Universal Inquiry Section
    if (!hardFailTriggered) {
      const hasTechCareSection =
        /Apakah Layanan AI|Ekonomi Data Center|Will AI Services|Datacenter Economics|اقتصاديات|هل ستنخفض|Dampak Ekonomi|Economic Breakdown|التحليل الاقتصادي|TCO/i.test(
          content
        )
      const hasIslamicCareSection =
        /Pertanyaan untuk Dipikirkan|Batasan Intelektual|A Question Worth|Intellectual Boundaries|سؤال يستحق|الحدود المعرفية|Demarkasi Ilmiah|Evidence Matrix|مصفوفة الشواهد/i.test(
          content
        )

      if (article.frontmatter.category === 'tech-ai' && !hasTechCareSection) {
        hardFailTriggered = true
        hardFailReason = `"Why Should I Care" Gate Failed: Tech article lacks explicit stakeholder impact & economic analysis section.`
      } else if (article.frontmatter.category === 'islamic-logic' && !hasIslamicCareSection) {
        hardFailTriggered = true
        hardFailReason = `"Why Should I Care" Gate Failed: Islamic logic essay lacks explicit universal inquiry & epistemological boundary section.`
      }
    }

    // 6. HARD-FAIL: Source Verification (Min 2 Verified Sources)
    if (
      !hardFailTriggered &&
      (!article.frontmatter.sources || article.frontmatter.sources.length < 2)
    ) {
      hardFailTriggered = true
      hardFailReason = `Source Gate Failed: Article must cite at least 2 verified institutional Tier 1/Tier 2 sources.`
    }

    // 7. HARD-FAIL: Image Provenance & Licensing Metadata
    if (
      !hardFailTriggered &&
      (!article.frontmatter.imageCredits || article.frontmatter.imageCredits.length === 0)
    ) {
      hardFailTriggered = true
      hardFailReason = `Visual Provenance Gate Failed: Article must include verified image licensing and copyright provenance records.`
    }

    // 8. 100-Point Editorial Breakdown Scoring
    const breakdown = { ...QC_SCORING_WEIGHTS }

    if (hardFailTriggered) {
      breakdown.freshnessAndTiming = 0
      breakdown.factualAccuracyAndRigor = 0
      breakdown.intellectualHonestyAndNuance = 0
      breakdown.informationDensityAndDepth = 0
    } else {
      if (wordCount < 500) {
        breakdown.informationDensityAndDepth = 10
        warnings.push(`Article word count is relatively compact (${wordCount} words).`)
      }
    }

    const totalScore = hardFailTriggered
      ? 0
      : Object.values(breakdown).reduce((sum, val) => sum + val, 0)

    let editorialDecision: HumanEditorialScoreResult['editorialDecision'] = 'REJECT_HARD_FAIL'
    if (!hardFailTriggered) {
      if (totalScore >= PREFERRED_EDITORIAL_PASSING_SCORE) editorialDecision = 'PUBLISH_PREFERRED'
      else if (totalScore >= MIN_EDITORIAL_PASSING_SCORE) editorialDecision = 'PUBLISH_CONDITIONAL'
      else editorialDecision = 'REJECT_LOW_SCORE'
    }

    return {
      score: totalScore,
      passed: !hardFailTriggered && totalScore >= MIN_EDITORIAL_PASSING_SCORE,
      editorialDecision,
      hardFailTriggered,
      hardFailReason,
      breakdown,
      warnings,
    }
  }
}
