import { AuditCycleReport, MdxArticle } from './core/types'
import { TechResearchEngine } from './domains/research/tech-engine'
import { IslamicResearchEngine } from './domains/research/islamic-engine'
import { TechArticleBuilder } from './domains/editorial/tech-builder'
import { IslamicArticleBuilder } from './domains/editorial/islamic-builder'
import { EditorialQCEngine } from './domains/qc/qc-engine'
import { FilePublisher } from './domains/publishing/file-publisher'
import { GitSyncService } from './domains/publishing/git-sync'
import { StateStore } from './core/state-store'
import { Logger } from './core/logger'
import { AntigravitySessionDetector } from './core/session-detector'

export interface PublishCycleOptions {
  gitPush?: boolean
  maxArticles?: number
  dryRun?: boolean
}

export class EditorialOrchestrator {
  /**
   * Executes the full unified pipeline with Single Active Orchestrator & Strict Stage-by-Stage QC:
   * Discovery -> Editorial Selection -> Dual-Tier Verify -> Trilingual Native Synthesis -> Asset Download -> 15 Hard Gates QC -> File Publish -> Git Push -> State Persistence
   */
  static async runEditorialPipeline(options: PublishCycleOptions = {}): Promise<AuditCycleReport> {
    const cycleTimestamp = new Date().toISOString()
    Logger.header(`ImanLogics Editorial Pipeline Started [${cycleTimestamp}]`)

    // 0. Resolve Single Active Orchestrator Mode
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
    // STAGE 1 & 2: Dynamic Discovery & Editorial Board Selection
    // -------------------------------------------------------------
    Logger.info(
      'Orchestrator',
      'STAGE 1 & 2: Running Discovery & Editorial Board across 75 Media Pools...'
    )
    const techStories = await TechResearchEngine.discoverVerifiedStories()
    const islamicStories = await IslamicResearchEngine.discoverVerifiedStories()

    report.candidatesDiscovered = techStories.length + islamicStories.length
    report.sourcesScanned =
      techStories.reduce((acc, s) => acc + s.sources.length, 0) +
      islamicStories.reduce((acc, s) => acc + s.sources.length, 0)

    Logger.info(
      'Orchestrator',
      `Discovered ${report.candidatesDiscovered} verified candidate story/stories across ${report.sourcesScanned} primary/secondary sources.`
    )

    const selectedTech = techStories.slice(0, 1)
    const selectedIslamic = islamicStories.slice(0, 1)
    const totalSelected = selectedTech.length + selectedIslamic.length

    if (totalSelected === 0) {
      Logger.info(
        'Orchestrator',
        'NO_PUBLISHABLE_STORY — No fresh stories met strict news hook, freshness, or anti-duplicate criteria.'
      )
      report.status = 'NO_PUBLISHABLE_STORY'
      StateStore.saveReport(report)
      return report
    }

    const passedArticles: MdxArticle[] = []

    // -------------------------------------------------------------
    // STAGE 3-7: Tech Story Synthesis, Assembly & Strict 15 Hard Gates QC
    // -------------------------------------------------------------
    for (const story of selectedTech) {
      report.storiesEvaluated++
      Logger.info('Orchestrator', `STAGE 3-7: Processing Tech Story "${story.title}"...`)

      let articles = await TechArticleBuilder.buildTrilingualArticles(story)
      let qcResults = {
        id: EditorialQCEngine.evaluateArticle(articles[0]),
        en: EditorialQCEngine.evaluateArticle(articles[1]),
        ar: EditorialQCEngine.evaluateArticle(articles[2]),
      }

      let allPassed = qcResults.id.passed && qcResults.en.passed && qcResults.ar.passed

      // Self-Correction Retry Loop (Attempt 2 if QC failed)
      if (!allPassed) {
        Logger.warn(
          'Orchestrator',
          `QC failed on initial pass (ID: ${qcResults.id.score}, EN: ${qcResults.en.score}, AR: ${qcResults.ar.score}). Triggering Stage Self-Correction Retry...`
        )
        articles = await TechArticleBuilder.buildTrilingualArticles(story)
        qcResults = {
          id: EditorialQCEngine.evaluateArticle(articles[0]),
          en: EditorialQCEngine.evaluateArticle(articles[1]),
          ar: EditorialQCEngine.evaluateArticle(articles[2]),
        }
        allPassed = qcResults.id.passed && qcResults.en.passed && qcResults.ar.passed
      }

      if (allPassed) {
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
        Logger.success('Orchestrator', `Tech Story "${story.title}" PASSED all 15 Hard Gates!`)
      } else {
        const reason = `Rejected tech story "${story.title}" due to unresolvable QC failure (ID: ${qcResults.id.score}, EN: ${qcResults.en.score}, AR: ${qcResults.ar.score})`
        report.rejectionReasons.push(reason)
        Logger.warn('Orchestrator', reason)
      }
    }

    // -------------------------------------------------------------
    // STAGE 3-7: Islamic Story Synthesis, Assembly & Strict 15 Hard Gates QC
    // -------------------------------------------------------------
    for (const story of selectedIslamic) {
      report.storiesEvaluated++
      Logger.info('Orchestrator', `STAGE 3-7: Processing Islamic Story "${story.titles.id}"...`)

      let articles = await IslamicArticleBuilder.buildTrilingualArticles(story)
      let qcResults = {
        id: EditorialQCEngine.evaluateArticle(articles[0]),
        en: EditorialQCEngine.evaluateArticle(articles[1]),
        ar: EditorialQCEngine.evaluateArticle(articles[2]),
      }

      let allPassed = qcResults.id.passed && qcResults.en.passed && qcResults.ar.passed

      // Self-Correction Retry Loop (Attempt 2 if QC failed)
      if (!allPassed) {
        Logger.warn(
          'Orchestrator',
          `QC failed on initial pass (ID: ${qcResults.id.score}, EN: ${qcResults.en.score}, AR: ${qcResults.ar.score}). Triggering Stage Self-Correction Retry...`
        )
        articles = await IslamicArticleBuilder.buildTrilingualArticles(story)
        qcResults = {
          id: EditorialQCEngine.evaluateArticle(articles[0]),
          en: EditorialQCEngine.evaluateArticle(articles[1]),
          ar: EditorialQCEngine.evaluateArticle(articles[2]),
        }
        allPassed = qcResults.id.passed && qcResults.en.passed && qcResults.ar.passed
      }

      if (allPassed) {
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
        Logger.success(
          'Orchestrator',
          `Islamic Story "${story.titles.id}" PASSED all 15 Hard Gates!`
        )
      } else {
        const reason = `Rejected islamic story "${story.titles.id}" due to unresolvable QC failure (ID: ${qcResults.id.score}, EN: ${qcResults.en.score}, AR: ${qcResults.ar.score})`
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
        `Successfully validated and published ${passedArticles.length} production-grade trilingual articles!`
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
