import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { researchTechTopics, ResearchTopic } from './tech-researcher';
import { researchIslamicLogicTopics } from './islamic-logic-researcher';
import { buildMdxArticlesWithQC, MdxArticle } from './article-builder-qc';

/**
 * Tool 4: Auto-Publisher & Orchestrator Cron Daemon for BLOG (D:\Projects\BLOG)
 * Evaluates news density (3-5 articles/cycle), orchestrates Tool 1, 2, 3, saves MDX files into data/blog/,
 * and auto-pushes updates to GitHub repository.
 */
export async function runAutoPublisherPipeline(options: { gitPush?: boolean } = {}) {
  console.log('🚀 [Tool 4] Launching Iman Logics Autonomous Blog Pipeline for D:\\Projects\\BLOG...');

  // 1. Fetch topics from Tool 1 & Tool 2
  const techTopics = await researchTechTopics();
  const islamicTopics = await researchIslamicLogicTopics();

  // 2. Dynamic Volume Evaluation (3 to 5 articles based on news density)
  const totalAvailable = techTopics.length + islamicTopics.length;
  let targetCount = 3;
  if (totalAvailable >= 5) {
    targetCount = 5;
  } else if (totalAvailable >= 4) {
    targetCount = 4;
  }

  console.log(`📊 [Tool 4] News Density Evaluation: ${totalAvailable} topic(s) available. Target output: ${targetCount} article(s).`);

  const selectedTopics: ResearchTopic[] = [];
  if (islamicTopics.length > 0) {
    selectedTopics.push(...islamicTopics.slice(0, 2));
  }
  const remainingSlots = targetCount - selectedTopics.length;
  if (techTopics.length > 0) {
    selectedTopics.push(...techTopics.slice(0, remainingSlots));
  }

  // 3. Build MDX articles with Tool 3 & QC Gatekeeper
  const publishedArticles: MdxArticle[] = [];
  for (const topic of selectedTopics) {
    const { articles, qc } = await buildMdxArticlesWithQC(topic);
    if (qc.passed) {
      for (const article of articles) {
        fs.writeFileSync(article.filepath, article.content, 'utf-8');
        publishedArticles.push(article);
        console.log(`💾 Saved MDX article: data/blog/${article.filename}`);
      }
    } else {
      console.log(`❌ Skipping topic "${topic.title}" due to QC failure.`);
    }
  }

  if (publishedArticles.length === 0) {
    console.log('ℹ️ No new articles passed QC criteria in this run.');
    return;
  }

  // 4. Git Commit & Push (if enabled or running in CI/CD)
  if (options.gitPush || process.env.CI) {
    try {
      console.log('📦 Executing Git Commit & Push to GitHub repository...');
      execSync('git config --global user.name "Iman Logics Bot"');
      execSync('git config --global user.email "bot@imanlogics.web.id"');
      execSync('git add data/blog/*.mdx');
      execSync(`git commit -m "feat(blog): auto publish ${publishedArticles.length} new MDX articles [QC passed]"`);
      execSync('git push origin main');
      console.log('✅ Git Push completed successfully!');
    } catch (gitErr: any) {
      console.error('⚠️ Git Push encountered an error or no changes to commit:', gitErr.message);
    }
  }

  console.log('🎉 [Tool 4] Pipeline run completed successfully for D:\\Projects\\BLOG!');
}

if (require.main === module) {
  runAutoPublisherPipeline({ gitPush: false }).catch(console.error);
}
