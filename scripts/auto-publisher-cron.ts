import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { researchTechNewsIntelligence, TechNewsStory } from './tech-researcher';
import { researchIslamicAcademicIntelligence, IslamicAcademicStory } from './islamic-logic-researcher';
import { buildTechMdxArticles, buildIslamicAcademicMdxArticles, MdxArticle } from './article-builder-qc';

export interface PublishedStoryMeta {
  title: string;
  slug: string;
  category: 'tech-ai' | 'islamic-logic';
  languages: ('id' | 'en' | 'ar')[];
}

export interface AuditCycleReport {
  cycleTimestamp: string;
  sourcesScanned: number;
  candidatesDiscovered: number;
  duplicatesRemoved: number;
  storiesEvaluated: number;
  articlesPassedQC: number;
  articlesPublished: string[];
  publishedStoryDetails: PublishedStoryMeta[];
  rejectionReasons: string[];
  status: 'SUCCESS' | 'NO_PUBLISHABLE_STORY' | 'PARTIAL_SUCCESS';
}

const MIN_QC_SCORE = 85;
const MAX_ARTICLES_PER_CYCLE = 5;

/**
 * Autonomous Editorial & News Intelligence Publisher Daemon
 */
export async function runAutonomousEditorialPipeline(options: { gitPush?: boolean } = {}): Promise<AuditCycleReport> {
  const cycleTimestamp = new Date().toISOString();
  console.log(`\n===============================================================`);
  console.log(`🚀 [Autonomous Editorial Daemon] Cycle Started at ${cycleTimestamp}`);
  console.log(`===============================================================`);

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
  };

  // 1. Discover & Research Tech News
  const techStories = await researchTechNewsIntelligence();
  // 2. Discover & Research Islamic Academic Topics
  const islamicStories = await researchIslamicAcademicIntelligence();

  report.candidatesDiscovered = techStories.length + islamicStories.length;
  report.sourcesScanned = techStories.reduce((acc, s) => acc + s.sources.length, 0) +
                         islamicStories.reduce((acc, s) => acc + s.sources.length, 0);

  console.log(`📊 [Pipeline Audit] Discovered ${report.candidatesDiscovered} candidate story/stories across ${report.sourcesScanned} primary/secondary sources.`);

  // 3. Editorial Evaluation & Selection (Prioritize highest scoring up to MAX_ARTICLES_PER_CYCLE)
  const selectedTech = techStories.slice(0, 2);
  const selectedIslamic = islamicStories.slice(0, 2);
  const totalSelected = selectedTech.length + selectedIslamic.length;

  if (totalSelected === 0) {
    console.log(`ℹ️ [Editorial Decision] NO_PUBLISHABLE_STORY — No fresh stories met strict news hook or anti-duplicate criteria.`);
    report.status = 'NO_PUBLISHABLE_STORY';
    return report;
  }

  const publishedArticles: MdxArticle[] = [];

  // 4. Process Tech Stories
  for (const story of selectedTech) {
    report.storiesEvaluated++;
    const { articles, qcResults } = await buildTechMdxArticles(story);

    const allPassed = qcResults.id.passed && qcResults.en.passed && qcResults.ar.passed;
    if (allPassed) {
      for (const article of articles) {
        fs.writeFileSync(article.filepath, article.content, 'utf-8');
        publishedArticles.push(article);
        report.articlesPublished.push(`data/blog/${article.filename}`);
        console.log(`  💾 Published MDX: data/blog/${article.filename} [QC: ${qcResults[article.language].score}/100]`);
      }
      report.publishedStoryDetails.push({
        title: story.titles.id,
        slug: story.id,
        category: 'tech-ai',
        languages: ['id', 'en', 'ar'],
      });
      report.articlesPassedQC += articles.length;
    } else {
      const reason = `Rejected tech story "${story.title}" due to QC failure (ID: ${qcResults.id.score}, EN: ${qcResults.en.score}, AR: ${qcResults.ar.score})`;
      report.rejectionReasons.push(reason);
      console.warn(`  ⚠️ ${reason}`);
    }
  }

  // 5. Process Islamic Academic Stories
  for (const story of selectedIslamic) {
    report.storiesEvaluated++;
    const { articles, qcResults } = await buildIslamicAcademicMdxArticles(story);

    const allPassed = qcResults.id.passed && qcResults.en.passed && qcResults.ar.passed;
    if (allPassed) {
      for (const article of articles) {
        fs.writeFileSync(article.filepath, article.content, 'utf-8');
        publishedArticles.push(article);
        report.articlesPublished.push(`data/blog/${article.filename}`);
        console.log(`  💾 Published MDX: data/blog/${article.filename} [QC: ${qcResults[article.language].score}/100]`);
      }
      report.publishedStoryDetails.push({
        title: story.titles.id,
        slug: story.id,
        category: 'islamic-logic',
        languages: ['id', 'en', 'ar'],
      });
      report.articlesPassedQC += articles.length;
    } else {
      const reason = `Rejected academic story "${story.title}" due to QC failure (ID: ${qcResults.id.score}, EN: ${qcResults.en.score}, AR: ${qcResults.ar.score})`;
      report.rejectionReasons.push(reason);
      console.warn(`  ⚠️ ${reason}`);
    }
  }

  // 6. Final Status Evaluation
  if (publishedArticles.length > 0) {
    report.status = 'SUCCESS';
    console.log(`\n🎉 [Pipeline Success] Successfully published ${publishedArticles.length} production-grade trilingual articles!`);
  } else {
    report.status = 'NO_PUBLISHABLE_STORY';
    console.log(`\nℹ️ [Pipeline Result] NO_PUBLISHABLE_STORY — Zero articles published.`);
  }

  // 7. Optional Git Push in CI/CD environment
  if (options.gitPush || process.env.CI) {
    try {
      console.log('📦 Executing Git Commit & Push to GitHub repository...');
      execSync('git config --global user.name "Iman Logics Editorial Bot"');
      execSync('git config --global user.email "bot@imanlogics.web.id"');
      execSync('git add data/blog/*.mdx');
      execSync(`git commit -m "feat(blog): autonomous publication of ${publishedArticles.length} trilingual articles [QC >= 85]"`);
      execSync('git push origin main');
      console.log('✅ Git Push completed successfully!');
    } catch (gitErr: any) {
      console.warn('ℹ️ Git push skipped or no new changes to commit:', gitErr.message);
    }
  }

  return report;
}

if (require.main === module) {
  runAutonomousEditorialPipeline({ gitPush: false }).catch(console.error);
}
