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

export interface PublishCycleOptions {
  gitPush?: boolean
  maxArticles?: number
  dryRun?: boolean
}

export class EditorialOrchestrator {
  /**
   * Executes the full unified pipeline:
   * Discover -> Dual-Tier Verify -> Trilingual Build -> Safe Image Sourcing -> 100-pt QC -> File Publish -> Git Push -> State Persistence
   */
  static async runEditorialPipeline(options: PublishCycleOptions = {}): Promise<AuditCycleReport> {
    const cycleTimestamp = new Date().toISOString()
    Logger.header(`ImanLogics Editorial Pipeline Started [${cycleTimestamp}]`)

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

    // 1. Discover Tech News Candidates
    const techStories = await TechResearchEngine.discoverVerifiedStories()
    // 2. Discover Islamic Academic Candidates
    const islamicStories = await IslamicResearchEngine.discoverVerifiedStories()

    report.candidatesDiscovered = techStories.length + islamicStories.length
    report.sourcesScanned =
      techStories.reduce((acc, s) => acc + s.sources.length, 0) +
      islamicStories.reduce((acc, s) => acc + s.sources.length, 0)

    Logger.info(
      'Orchestrator',
      `Discovered ${report.candidatesDiscovered} candidate story/stories across ${report.sourcesScanned} primary/secondary sources.`
    )

    const selectedTech = techStories.slice(0, 2)
    const selectedIslamic = islamicStories.slice(0, 2)
    const totalSelected = selectedTech.length + selectedIslamic.length

    if (totalSelected === 0) {
      Logger.info(
        'Orchestrator',
        'NO_PUBLISHABLE_STORY — No fresh stories met strict news hook or anti-duplicate criteria.'
      )
      report.status = 'NO_PUBLISHABLE_STORY'
      StateStore.saveReport(report)
      return report
    }

    const passedArticles: MdxArticle[] = []

    // 3. Process Tech Stories
    for (const story of selectedTech) {
      report.storiesEvaluated++
      const articles = await TechArticleBuilder.buildTrilingualArticles(story)

      const qcResults = {
        id: EditorialQCEngine.evaluateArticle(articles[0]),
        en: EditorialQCEngine.evaluateArticle(articles[1]),
        ar: EditorialQCEngine.evaluateArticle(articles[2]),
      }

      const allPassed = qcResults.id.passed && qcResults.en.passed && qcResults.ar.passed
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
      } else {
        const reason = `Rejected tech story "${story.title}" due to QC failure (ID: ${qcResults.id.score}, EN: ${qcResults.en.score}, AR: ${qcResults.ar.score})`
        report.rejectionReasons.push(reason)
        Logger.warn('Orchestrator', reason)
      }
    }

    // 4. Process Islamic Stories
    for (const story of selectedIslamic) {
      report.storiesEvaluated++
      const articles = await IslamicArticleBuilder.buildTrilingualArticles(story)

      const qcResults = {
        id: EditorialQCEngine.evaluateArticle(articles[0]),
        en: EditorialQCEngine.evaluateArticle(articles[1]),
        ar: EditorialQCEngine.evaluateArticle(articles[2]),
      }

      const allPassed = qcResults.id.passed && qcResults.en.passed && qcResults.ar.passed
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
      } else {
        const reason = `Rejected islamic story "${story.titles.id}" due to QC failure (ID: ${qcResults.id.score}, EN: ${qcResults.en.score}, AR: ${qcResults.ar.score})`
        report.rejectionReasons.push(reason)
        Logger.warn('Orchestrator', reason)
      }
    }

    // 5. Final Evaluation & Git Push
    if (passedArticles.length > 0) {
      report.status = 'SUCCESS'
      Logger.success(
        'Orchestrator',
        `Successfully published ${passedArticles.length} production-grade trilingual articles!`
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
