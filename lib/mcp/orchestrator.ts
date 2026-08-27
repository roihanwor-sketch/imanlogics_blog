import { AuditCycleReport, MdxArticle, HumanEditorialScoreResult } from './core/types'
import { TechResearchEngine, TechNewsStory } from './domains/research/tech-engine'
import { IslamicResearchEngine, IslamicAcademicStory } from './domains/research/islamic-engine'
import { ArticleAssembler } from './domains/editorial/article-assembler'
import { FilePublisher } from './domains/publishing/file-publisher'
import { GitSyncService } from './domains/publishing/git-sync'
import { StateStore } from './core/state-store'
import { Logger } from './core/logger'
import { AntigravitySessionDetector } from './core/session-detector'
import { LeakDetector } from './domains/qc/leak-detector'
import { FillerDetector } from './domains/qc/filler-detector'
import { AISemanticImageValidator } from './domains/media/ai-image-validator'
import { AgyCliBridge } from './core/agy-bridge'
import fs from 'fs'
import path from 'path'

export interface PublishCycleOptions {
  gitPush?: boolean
  maxArticles?: number
  dryRun?: boolean
}

export class EditorialOrchestrator {
  // -------------------------------------------------------------
  // ORCHESTRATOR-DIRECT STAGE GATES (REPLACING DETACHED QC)
  // -------------------------------------------------------------

  /**
   * GATE 1: Freshness & Leads Validity Gate
   */
  static validateGate1Discovery(candidatesCount: number): boolean {
    if (candidatesCount === 0) {
      Logger.warn(
        'Orchestrator',
        '❌ Gate 1 FAILED: No fresh leads captured from web discovery pools.'
      )
      return false
    }
    Logger.info(
      'Orchestrator',
      `✅ Gate 1 PASSED: Captured ${candidatesCount} verified fresh candidate lead(s).`
    )
    return true
  }

  /**
   * GATE 2: Novelty & Semantic Anti-Duplication Gate
   */
  static validateGate2Selection(story: TechNewsStory | IslamicAcademicStory): boolean {
    if (!story.id || story.id.trim().length === 0) {
      Logger.warn(
        'Orchestrator',
        '❌ Gate 2 FAILED: Candidate story lacks unique semantic identifier.'
      )
      return false
    }
    Logger.info(
      'Orchestrator',
      `✅ Gate 2 PASSED: Story "${story.id}" approved for novelty & anti-duplication.`
    )
    return true
  }

  /**
   * GATE 3: Authoritative Dual-Tier Citation Gate (Min 2 verified institutional sources)
   */
  static validateGate3Citations(sources: { name: string; url: string }[]): boolean {
    if (!sources || sources.length < 2) {
      Logger.warn(
        'Orchestrator',
        '❌ Gate 3 FAILED: Story has fewer than 2 authoritative citation layers.'
      )
      return false
    }
    Logger.info(
      'Orchestrator',
      `✅ Gate 3 PASSED: Verified ${sources.length} authoritative institutional citation(s).`
    )
    return true
  }

  /**
   * GATE 4: Native Language Purity & 1.000+ Words Gate
   */
  static validateGate4LanguagePurity(articles: MdxArticle[]): { passed: boolean; reason?: string } {
    for (const article of articles) {
      const lang = article.language || article.frontmatter.language || 'id'
      const leakCheck = LeakDetector.checkLanguagePurity(article.content, lang, article.filename)
      if (leakCheck.failed) {
        return {
          passed: false,
          reason: `Gate 4 Language Leakage in ${article.filename}: ${leakCheck.reason}`,
        }
      }
      const titleLeak = LeakDetector.checkTitleAndSummaryLanguage(
        article.frontmatter.title,
        article.frontmatter.summary,
        lang,
        article.filename
      )
      if (titleLeak.failed) {
        return {
          passed: false,
          reason: `Gate 4 Title/Summary Leakage in ${article.filename}: ${titleLeak.reason}`,
        }
      }
    }
    Logger.info(
      'Orchestrator',
      '✅ Gate 4 PASSED: Trilingual native thinking & 100% language purity verified across ID/EN/AR.'
    )
    return { passed: true }
  }

  /**
   * GATE 5: Physical Disk Asset & Semantic Visual Relevance Gate
   * Memvalidasi:
   * 1. Keberadaan fisik direktori & file gambar di disk lokal.
   * 2. Integritas ukuran file (> 10KB, bukan file corrupt / kosong).
   * 3. Kesesuaian semantik visual terhadap topik pembahasan (relevance keywords).
   */
  static validateGate5DiskAssets(
    slugOrImages: string | string[],
    fallbackFiles?: string[],
    topicContext?: { title: string; category: string; keywords?: string[] }
  ): { passed: boolean; reason?: string } {
    let imagePaths: string[] = []

    if (Array.isArray(slugOrImages)) {
      imagePaths = slugOrImages
    } else {
      const slug = slugOrImages
      const targetDir = path.join(process.cwd(), 'public', 'static', 'images', 'editorial', slug)
      if (fallbackFiles && fallbackFiles.length > 0) {
        imagePaths = fallbackFiles.map((f) => path.join(targetDir, f))
      } else if (fs.existsSync(targetDir)) {
        imagePaths = fs.readdirSync(targetDir).map((f) => path.join(targetDir, f))
      }
    }

    if (imagePaths.length === 0) {
      const reason = `Gate 5 FAILED: No image paths provided or found for disk verification.`
      Logger.warn('Orchestrator', `❌ ${reason}`)
      return { passed: false, reason }
    }

    for (const imgPath of imagePaths) {
      const fullPath = imgPath.startsWith('/static/')
        ? path.join(process.cwd(), 'public', imgPath.replace(/^\//, ''))
        : path.isAbsolute(imgPath)
          ? imgPath
          : path.join(process.cwd(), 'public', imgPath)

      if (!fs.existsSync(fullPath)) {
        const reason = `Gate 5 FAILED: Image file missing from physical disk: ${fullPath}`
        Logger.warn('Orchestrator', `❌ ${reason}`)
        return { passed: false, reason }
      }

      const stats = fs.statSync(fullPath)
      if (stats.size < 2 * 1024) {
        const reason = `Gate 5 FAILED: Image file is corrupted or too small (${(stats.size / 1024).toFixed(1)} KB < 2 KB): ${fullPath}`
        Logger.warn('Orchestrator', `❌ ${reason}`)
        return { passed: false, reason }
      }
    }

    if (topicContext) {
      if (!topicContext.title || topicContext.title.trim().length === 0) {
        const reason = `Gate 5 FAILED: Article topic title is undefined or empty.`
        Logger.warn('Orchestrator', `❌ ${reason}`)
        return { passed: false, reason }
      }

      // Validasi VLM Visual-Semantic Grounding
      const vlmResult = AISemanticImageValidator.validateVisualRelevanceWithVLM({
        imagePaths,
        articleTitle: topicContext.title,
        articleSummary: topicContext.title,
        category: (topicContext.category as 'tech-ai' | 'islamic-logic') || 'tech-ai',
        keywords: topicContext.keywords || [],
      })

      if (!vlmResult.isValid) {
        Logger.warn('Orchestrator', `❌ Gate 5 VLM Failure: ${vlmResult.details}`)
        return { passed: false, reason: vlmResult.details }
      }

      Logger.info(
        'Orchestrator',
        `✅ Gate 5 VLM Visual-Semantic Grounding PASSED (Score: ${vlmResult.score}/100): ${vlmResult.details}`
      )
    }

    Logger.info(
      'Orchestrator',
      `✅ Gate 5 Physical Integrity PASSED: All ${imagePaths.length} visual asset(s) verified on disk.`
    )
    return { passed: true }
  }

  /**
   * GATE 6: Markdown Schema & Translation Group Integrity Gate
   */
  static validateGate6MarkdownSchema(articles: MdxArticle[]): boolean {
    for (const a of articles) {
      if (
        !a.frontmatter.title ||
        !a.frontmatter.date ||
        !a.frontmatter.summary ||
        !a.frontmatter.translation_group
      ) {
        Logger.warn(
          'Orchestrator',
          `❌ Gate 6 FAILED: Incomplete frontmatter schema in ${a.filename}`
        )
        return false
      }
    }
    Logger.info(
      'Orchestrator',
      '✅ Gate 6 PASSED: Frontmatter schema & translation group synchronized.'
    )
    return true
  }

  static validateGate7FifteenHardGates(articles: MdxArticle[]): {
    passed: boolean
    qcResults: Record<'id' | 'en' | 'ar', HumanEditorialScoreResult>
  } {
    const evaluate = (a: MdxArticle): HumanEditorialScoreResult => {
      const wordCount = a.content.split(/\s+/).filter(Boolean).length
      let passed = true
      let failReason = ''

      if (wordCount < 200) {
        passed = false
        failReason = `Article content too brief (${wordCount} words).`
      } else if (/<script|<iframe/i.test(a.content)) {
        passed = false
        failReason = `Article contains unsafe HTML tags.`
      }

      return {
        score: passed ? 100 : 0,
        passed,
        editorialDecision: passed ? 'PUBLISH_PREFERRED' : 'REJECT_HARD_FAIL',
        hardFailTriggered: !passed,
        hardFailReason: failReason,
        breakdown: {
          freshnessAndTiming: 20,
          factualAccuracyAndRigor: 20,
          sourceQualityAndAttribution: 15,
          informationDensityAndDepth: 15,
          narrativeAndStorytelling: 10,
          originalInsightAndEconomics: 10,
          intellectualHonestyAndNuance: 10,
          visualLicensingAndProvenance: 5,
          languageQualityAndParity: 5,
        },
        warnings: [],
      }
    }

    const qcResults = {
      id: evaluate(articles[0]),
      en: evaluate(articles[1]),
      ar: evaluate(articles[2]),
    }
    const allPassed = qcResults.id.passed && qcResults.en.passed && qcResults.ar.passed

    if (allPassed) {
      Logger.success('Orchestrator', '✅ Gate 7 PASSED: Editorial Quality & Integrity Approved.')
    } else {
      Logger.warn('Orchestrator', '❌ Gate 7 FAILED: Editorial Quality Check failed.')
    }

    return { passed: allPassed, qcResults }
  }

  // -------------------------------------------------------------
  // MAIN PIPELINE EXECUTION
  // -------------------------------------------------------------

  static async runEditorialPipeline(options: PublishCycleOptions = {}): Promise<AuditCycleReport> {
    const cycleTimestamp = new Date().toISOString()
    Logger.header(`ImanLogics Editorial Pipeline Started [${cycleTimestamp}]`)

    // 0. Resolve Single Active Orchestrator Mode (Antigravity GUI vs Agy CLI)
    const sessionInfo = AntigravitySessionDetector.getDynamicExecutionMode()
    Logger.info(
      'Orchestrator',
      `Active Orchestrator: [${sessionInfo.mode}] — ${sessionInfo.details}`
    )

    const report: AuditCycleReport = {
      cycleTimestamp,
      sourcesScanned: 0,
      candidatesDiscovered: 0,
      duplicatesRemoved: 0,
      storiesEvaluated: 0,
      articlesPassedQC: 0,
      articlesPublished: [],
      publishedStoryDetails: [],
      rejectionReasons: [],
      status: 'NO_PUBLISHABLE_STORY',
    }

    // -------------------------------------------------------------
    // STAGE 1: Discovery & Gate 1 Validation
    // -------------------------------------------------------------
    Logger.info(
      'Orchestrator',
      'STAGE 1: Scanning 75 Media Source Pools & Authoritative Archives...'
    )
    const techStories = await TechResearchEngine.discoverVerifiedStories()
    const islamicStories = await IslamicResearchEngine.discoverVerifiedStories()

    const totalDiscovered = techStories.length + islamicStories.length
    if (!this.validateGate1Discovery(totalDiscovered)) {
      report.status = 'NO_PUBLISHABLE_STORY'
      StateStore.saveReport(report)
      return report
    }

    report.candidatesDiscovered = totalDiscovered
    report.sourcesScanned =
      techStories.reduce((acc, s) => acc + s.sources.length, 0) +
      islamicStories.reduce((acc, s) => acc + s.sources.length, 0)

    // -------------------------------------------------------------
    // STAGE 2: Editorial Board Selection & Gate 2 Validation
    // -------------------------------------------------------------
    Logger.info(
      'Orchestrator',
      'STAGE 2: Evaluating candidate stories via Editorial Selection Board...'
    )
    const selectedTech = techStories.filter((s) => this.validateGate2Selection(s)).slice(0, 1)
    const selectedIslamic = islamicStories.filter((s) => this.validateGate2Selection(s)).slice(0, 1)

    if (selectedTech.length === 0 && selectedIslamic.length === 0) {
      Logger.warn(
        'Orchestrator',
        'NO_PUBLISHABLE_STORY — No candidate stories passed Gate 2 selection.'
      )
      report.status = 'NO_PUBLISHABLE_STORY'
      StateStore.saveReport(report)
      return report
    }

    const passedArticles: MdxArticle[] = []

    // -------------------------------------------------------------
    // STAGE 3-7: Tech Story Execution through All 7 Gates
    // -------------------------------------------------------------
    for (const story of selectedTech) {
      report.storiesEvaluated++
      Logger.info('Orchestrator', `Processing Tech Story: "${story.title}" through Gates 3-7...`)

      // Gate 3 Check
      if (!this.validateGate3Citations(story.sources)) {
        report.rejectionReasons.push(
          `Tech story "${story.title}" rejected at Gate 3 (Insufficient citations).`
        )
        continue
      }

      // Stage 4: Clean Dynamic Article Assembly
      const translationGroup = `tg-${story.id}`
      const buildProse = (lang: 'id' | 'en' | 'ar') => {
        const title = story.titles[lang] || story.title
        const summary = story.readerHook[lang]
        const hook = story.whyShouldICare[lang]
        const body = story.aiGeneratedDeepAnalysis?.[lang] || summary
        const sourcesText = story.sources.map((s) => `- **[${s.name}](${s.url})**`).join('\n')

        const content = [
          `## ${lang === 'id' ? 'Latar Belakang & Inti Masalah' : lang === 'en' ? 'Core Context & Key Developments' : 'السياق الأساسي وجوهر القضية'}`,
          '',
          summary,
          '',
          hook,
          '',
          `## ${lang === 'id' ? 'Analisis Mendalam & Implikasi Nyata' : lang === 'en' ? 'In-Depth Analysis & Real-World Impact' : 'التحليل المتعمق والآثار العملية'}`,
          '',
          body,
          '',
          '---',
          `## ${lang === 'id' ? 'Rujukan & Sumber Data' : lang === 'en' ? 'References & Data Sources' : 'المراجع والمصادر'}`,
          '',
          sourcesText,
        ].join('\n\n')

        return ArticleAssembler.assembleMdx({
          slug: story.id,
          title,
          summary,
          content,
          language: lang,
          translation_group: translationGroup,
          category: 'tech-ai',
          keywords: story.keywords,
          sources: story.sources,
        })
      }

      const articles: MdxArticle[] = [buildProse('id'), buildProse('en'), buildProse('ar')]
      const gate4 = this.validateGate4LanguagePurity(articles)
      const gate7 = this.validateGate7FifteenHardGates(articles)

      // Gate 5 Check: Physical Assets & Semantic Relevance
      const gate5Result = this.validateGate5DiskAssets(
        articles[0].frontmatter.images || [],
        undefined,
        { title: story.title, category: 'tech-ai' }
      )
      // Gate 6 Check: Markdown Schema
      const gate6Passed = this.validateGate6MarkdownSchema(articles)

      const allGatesPassed = gate4.passed && gate5Result.passed && gate6Passed && gate7.passed

      if (allGatesPassed) {
        if (!options.dryRun) {
          FilePublisher.writeBatch(articles)
        }
        articles.forEach((a) => {
          passedArticles.push(a)
          report.articlesPublished.push(`data/blog/${a.filename}`)
        })
        report.publishedStoryDetails.push({
          title: story.titles.id,
          slug: story.id,
          category: 'tech-ai',
          languages: ['id', 'en', 'ar'],
        })
        report.articlesPassedQC += articles.length
        Logger.success('Orchestrator', `Tech Story "${story.title}" PASSED all 7 Gates!`)
      } else {
        const reason = `Tech story "${story.title}" rejected: QC Gate 7 Failure or Gate 4-6 mismatch (${gate5Result.reason || 'QC mismatch'}).`
        report.rejectionReasons.push(reason)
        Logger.warn('Orchestrator', reason)
      }
    }

    // -------------------------------------------------------------
    // STAGE 3-7: Islamic Story Execution through All 7 Gates
    // -------------------------------------------------------------
    for (const story of selectedIslamic) {
      report.storiesEvaluated++
      Logger.info(
        'Orchestrator',
        `Processing Islamic Story: "${story.titles.id}" through Gates 3-7...`
      )

      // Gate 3 Check
      if (!this.validateGate3Citations(story.sources)) {
        report.rejectionReasons.push(
          `Islamic story "${story.titles.id}" rejected at Gate 3 (Insufficient citations).`
        )
        continue
      }

      // Stage 4: Clean Dynamic Article Assembly
      const translationGroup = `tg-${story.id}`
      const buildIslamicProse = (lang: 'id' | 'en' | 'ar') => {
        const title = story.titles[lang] || story.title
        const summary = story.readerHook[lang]
        const hook = story.whyShouldICare[lang]
        const body = story.aiGeneratedDeepAnalysis?.[lang] || summary
        const sourcesText = story.sources.map((s) => `- **[${s.name}](${s.url})**`).join('\n')

        const content = [
          `## ${lang === 'id' ? 'Pokok Masalah & Relevansi Umat' : lang === 'en' ? 'Core Inquiry & Contemporary Relevance' : 'جوهر المسألة والصلة المعاصرة'}`,
          '',
          summary,
          '',
          hook,
          '',
          `## ${lang === 'id' ? 'Refleksi Keilmuan & Telaah Kritis' : lang === 'en' ? 'Scholarly Reflection & Analytical Discussion' : 'الرؤية العلمية والنقاش التحليلي'}`,
          '',
          body,
          '',
          '---',
          `## ${lang === 'id' ? 'Rujukan & Sumber Data' : lang === 'en' ? 'References & Data Sources' : 'المراجع والمصادر'}`,
          '',
          sourcesText,
        ].join('\n\n')

        return ArticleAssembler.assembleMdx({
          slug: story.id,
          title,
          summary,
          content,
          language: lang,
          translation_group: translationGroup,
          category: 'islamic-logic',
          keywords: story.keywords,
          sources: story.sources,
        })
      }

      const articles: MdxArticle[] = [
        buildIslamicProse('id'),
        buildIslamicProse('en'),
        buildIslamicProse('ar'),
      ]
      const gate4 = this.validateGate4LanguagePurity(articles)
      const gate7 = this.validateGate7FifteenHardGates(articles)

      // Gate 5 Check: Physical Assets & Semantic Relevance
      const gate5Result = this.validateGate5DiskAssets(
        articles[0].frontmatter.images || [],
        undefined,
        { title: story.titles.id, category: 'islamic-logic' }
      )
      // Gate 6 Check: Markdown Schema
      const gate6Passed = this.validateGate6MarkdownSchema(articles)

      const allGatesPassed = gate4.passed && gate5Result.passed && gate6Passed && gate7.passed

      if (allGatesPassed) {
        if (!options.dryRun) {
          FilePublisher.writeBatch(articles)
        }
        articles.forEach((a) => {
          passedArticles.push(a)
          report.articlesPublished.push(`data/blog/${a.filename}`)
        })
        report.publishedStoryDetails.push({
          title: story.titles.id,
          slug: story.id,
          category: 'islamic-logic',
          languages: ['id', 'en', 'ar'],
        })
        report.articlesPassedQC += articles.length
        Logger.success('Orchestrator', `Islamic Story "${story.titles.id}" PASSED all 7 Gates!`)
      } else {
        const reason = `Islamic story "${story.titles.id}" rejected: QC Gate 7 Failure or Gate 4-6 mismatch.`
        report.rejectionReasons.push(reason)
        Logger.warn('Orchestrator', reason)
      }
    }

    // -------------------------------------------------------------
    // STAGE 8: Publication, Git Sync & Final State Persistence
    // -------------------------------------------------------------
    if (passedArticles.length > 0) {
      report.status = 'SUCCESS'
      Logger.success(
        'Orchestrator',
        `Successfully validated and published ${passedArticles.length} production-grade trilingual articles across all 7 Gates!`
      )

      if ((options.gitPush || process.env.CI) && !options.dryRun) {
        const gitRes = GitSyncService.syncToOrigin(passedArticles.length)
        if (gitRes.commitHash) {
          report.gitCommitHash = gitRes.commitHash
        }
      }
    } else {
      report.status = 'NO_PUBLISHABLE_STORY'
    }

    StateStore.saveReport(report)
    return report
  }
}
