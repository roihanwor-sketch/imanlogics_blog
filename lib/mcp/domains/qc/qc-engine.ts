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
    const title = article.frontmatter.title || ''
    const summary = article.frontmatter.summary || ''
    const lang = article.language || article.frontmatter.language || 'id'
    const wordCount = content.trim().split(/\s+/).length

    // 1. HARD GATE: Zero AI Filler & Cliché Gate
    const fillerRes = FillerDetector.checkAIFiller(content)
    if (fillerRes.failed) {
      hardFailTriggered = true
      hardFailReason = fillerRes.reason
    }

    // 2. HARD GATE: Intellectual Honesty / Apologetic Leap Gate
    if (!hardFailTriggered) {
      const apolRes = FillerDetector.checkApologeticLeaps(content)
      if (apolRes.failed) {
        hardFailTriggered = true
        hardFailReason = apolRes.reason
      }
    }

    // 3. HARD GATE: Body Language Purity & Translation Parity Gate
    if (!hardFailTriggered) {
      const leakRes = LeakDetector.checkLanguagePurity(content, lang, article.filename)
      if (leakRes.failed) {
        hardFailTriggered = true
        hardFailReason = leakRes.reason
      }
    }

    // 3B. HARD GATE: Frontmatter Title & Summary Language Purity Gate
    if (!hardFailTriggered) {
      const titleLeakRes = LeakDetector.checkTitleAndSummaryLanguage(
        title,
        summary,
        lang,
        article.filename
      )
      if (titleLeakRes.failed) {
        hardFailTriggered = true
        hardFailReason = titleLeakRes.reason
      }
    }

    // 4. HARD GATE: Universal Freshness Gate (Max 48h for Tech, Max 14d for Islamic Logic, No Year < 2026)
    if (!hardFailTriggered) {
      const hours = article.publishedHoursAgo ?? 0
      const articleDate = article.frontmatter.date || ''
      const articleYear = parseInt(articleDate.split('-')[0], 10)

      if (!isNaN(articleYear) && articleYear < 2026) {
        hardFailTriggered = true
        hardFailReason = `Universal Freshness Gate Failed: Publication date is from year ${articleYear} (< 2026). Stale historical articles cannot be published as current insights.`
      } else if (article.frontmatter.category === 'tech-ai' && hours > 48) {
        hardFailTriggered = true
        hardFailReason = `Freshness Gate Failed: Story event is ${hours}h old (>48h). Tech events must be fresh.`
      } else if (article.frontmatter.category === 'islamic-logic' && hours > 336) {
        hardFailTriggered = true
        hardFailReason = `Freshness Gate Failed: Article lead is ${hours}h old (>14 days). Contemporary inquiries must be fresh.`
      }
    }

    // 5. HARD GATE: Mandatory Stakeholder Impact / Epistemological Demarcation Gate
    if (!hardFailTriggered) {
      const hasTechCareSection =
        /Mengapa Ini Penting|Why Should I Care|لماذا يهمنا هذا|Telaah Analitis|In-Depth|تحليل|Dampak|Impact|الأثر|TCO|Efisiensi|Throughput|Arsitektur|Architecture|Sistem|System|Rekayasa|Engineering|Keamanan|Security|Workflow|Productivity|Inovasi|Innovation|Peningkatan/i.test(
          content
        )
      const hasIslamicCareSection =
        /Mengapa Ini Penting|Why Should I Care|لماذا يهمنا هذا|Pertanyaan untuk Dipikirkan|Batasan Intelektual|A Question Worth|Intellectual Boundaries|سؤال يستحق|الحدود المعرفية|Demarkasi Ilmiah|Evidence Matrix|مصفوفة الشواهد|Kaidah|Rasionalitas|Rationality|Epistemologi|Epistemology|الإبستمولوجيا|Hikmah|Miskonsepsi|Dialog/i.test(
          content
        )

      if (article.frontmatter.category === 'tech-ai' && !hasTechCareSection) {
        hardFailTriggered = true
        hardFailReason = `"Why Should I Care" Gate Failed: Tech article lacks explicit stakeholder impact & analytical depth section.`
      } else if (article.frontmatter.category === 'islamic-logic' && !hasIslamicCareSection) {
        hardFailTriggered = true
        hardFailReason = `"Why Should I Care" Gate Failed: Islamic logic essay lacks explicit universal inquiry & epistemological boundary section.`
      }
    }

    // 6. HARD GATE: Source Verification (Min 2 Verified Sources)
    if (
      !hardFailTriggered &&
      (!article.frontmatter.sources || article.frontmatter.sources.length < 2)
    ) {
      hardFailTriggered = true
      hardFailReason = `Source Gate Failed: Article must cite at least 2 verified institutional Tier 1/Tier 2 sources.`
    }

    // 7. HARD GATE: Image Provenance & Licensing Metadata Gate
    if (
      !hardFailTriggered &&
      (!article.frontmatter.imageCredits || article.frontmatter.imageCredits.length === 0)
    ) {
      hardFailTriggered = true
      hardFailReason = `Visual Provenance Gate Failed: Article must include verified image licensing and copyright provenance records.`
    }

    // 8. HARD GATE: Thin Content & Depth Threshold Gate
    if (!hardFailTriggered && wordCount < 300) {
      hardFailTriggered = true
      hardFailReason = `Thin Content Gate Failed: Article is too brief (${wordCount} words). Minimum rigorous depth is 300 words.`
    }

    // 9. HARD GATE: Translation Group Integrity Gate
    if (!hardFailTriggered && !article.frontmatter.translation_group) {
      hardFailTriggered = true
      hardFailReason = `Translation Group Gate Failed: Article missing required translation_group identifier.`
    }

    // 10. HARD GATE: Title Clickbait & Misleading Exaggeration Gate
    if (
      !hardFailTriggered &&
      (/GILA!|HEBOH!|SHOCKING!|YOU WON'T BELIEVE|صدمة|عاجل جدا/i.test(article.frontmatter.title) ||
        article.frontmatter.title.endsWith('!!!'))
    ) {
      hardFailTriggered = true
      hardFailReason = `Clickbait Gate Failed: Title contains sensationalized clickbait phrases or excessive punctuation.`
    }

    // 11. HARD GATE: Epistemological Boundaries Gate for Islamic Logic
    if (
      !hardFailTriggered &&
      article.frontmatter.category === 'islamic-logic' &&
      !/APA YANG TERBUKTI|WHAT IT PROVES|ما يثبته|Batasan|Demarkasi/i.test(content)
    ) {
      hardFailTriggered = true
      hardFailReason = `Epistemological Boundary Gate Failed: Islamic article must explicitly demarcate what is proven vs what must not be claimed.`
    }

    // 12. HARD GATE: Citation Chain & Footnote Provenance Gate
    if (
      !hardFailTriggered &&
      !/Rantai Provenance|Citation Chain|سلسلة التوثيق|Rujukan Primer|Primary Evidence|Media Sekunder|Verified Secondary/i.test(
        content
      )
    ) {
      hardFailTriggered = true
      hardFailReason = `Citation Provenance Gate Failed: Article must render an explicit primary/secondary citation trail.`
    }

    // 13. HARD GATE: Purity & No Corrupted HTML Tags in Markdown Gate
    if (!hardFailTriggered && /<script|<iframe|<style/i.test(content)) {
      hardFailTriggered = true
      hardFailReason = `Security Sanitization Gate Failed: Forbidden raw HTML script/iframe tags detected in markdown body.`
    }

    // 14. HARD GATE: Topic-Template Consistency Gate (No fake semiconductor boilerplate in software/security articles)
    if (!hardFailTriggered && article.frontmatter.category === 'tech-ai') {
      const isSoftwareOrSecurity =
        /powertoys|windows|linux|software|cve|zimbra|breach|exploit|patch/i.test(title)
      const hasSemiconductorBoilerplate =
        /wafer semikonduktor|litografi euv|gaafet|die size|transistor 2nm/i.test(content)

      if (isSoftwareOrSecurity && hasSemiconductorBoilerplate) {
        hardFailTriggered = true
        hardFailReason = `Topic Consistency Gate Failed: Software/Security article contains mismatched semiconductor wafer boilerplate.`
      }
    }

    // 15. HARD GATE: Visual Relevance & Context Gate
    if (!hardFailTriggered) {
      const isSoftware = /powertoys|software|windows|desktop/i.test(title)
      const hasLpddr6Alt = /lpddr6|smartphone modern/i.test(content)

      if (isSoftware && hasLpddr6Alt) {
        hardFailTriggered = true
        hardFailReason = `Visual Relevance Gate Failed: Software article contains mismatched mobile LPDDR6 image alt text.`
      }
    }

    // Multi-Dimensional Editorial Score Calculation (Scale 0-100)
    const breakdown = { ...QC_SCORING_WEIGHTS }

    if (hardFailTriggered) {
      breakdown.freshnessAndTiming = 0
      breakdown.factualAccuracyAndRigor = 0
      breakdown.intellectualHonestyAndNuance = 0
      breakdown.informationDensityAndDepth = 0
      breakdown.sourceQualityAndAttribution = 0
    } else {
      if (wordCount < 450) {
        breakdown.informationDensityAndDepth = 12
        warnings.push(`Article length is moderately compact (${wordCount} words).`)
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
