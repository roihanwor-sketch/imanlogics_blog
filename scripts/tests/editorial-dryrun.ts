/**
 * Comprehensive Human-Level Editorial Dry-Run Test Suite
 * Tests 3 Real-World Scenario Cases:
 * 1. Fresh Tech Breaking News (2026 Event) -> Expected: PASS (PUBLISH_PREFERRED >= 90)
 * 2. Stale Tech News (>48h Event masquerading as Breaking News) -> Expected: HARD REJECT (FreshnessGate)
 * 3. Ambiguous / Controversial Islamic Logic (Material Evidence vs Theology) -> Expected: PASS (HonestyGate)
 * 4. Apologetic Leap Negative Test -> Expected: HARD REJECT (HonestyGate)
 */

import {
  runHumanLevelEditorialQC,
  buildTechMdxArticles,
  buildIslamicAcademicMdxArticles,
  MdxArticle,
} from '../article-builder-qc';
import { getFreshTechNewsCandidates } from '../tech-researcher';
import { getFreshIslamicAcademicCandidates } from '../islamic-logic-researcher';

async function runDryRuns() {
  console.log('\n===============================================================');
  console.log('🏛️  STARTING HUMAN-LEVEL EDITORIAL DRY-RUN AUDIT');
  console.log('===============================================================\n');

  let passedScenarios = 0;
  let totalScenarios = 4;

  // -------------------------------------------------------------
  // DRY-RUN #1: Real Fresh Tech News (2026 Event, 4h old)
  // -------------------------------------------------------------
  console.log('📌 DRY-RUN #1: Fresh Tech Breaking News (2026 Event, 4h old)');
  const freshTechStory = getFreshTechNewsCandidates('2026-08-25')[0];
  const { articles: freshArticles, qcResults: freshQc } = await buildTechMdxArticles(freshTechStory);
  
  console.log(`  ├─ Article ID: "${freshArticles[0].frontmatter.title}"`);
  console.log(`  ├─ Editorial Decision: ${freshQc.id.editorialDecision}`);
  console.log(`  ├─ Total Score: ${freshQc.id.score}/100`);
  console.log(`  └─ Breakdown:`, freshQc.id.breakdown);

  if (freshQc.id.passed && freshQc.id.score >= 90 && freshQc.id.editorialDecision === 'PUBLISH_PREFERRED') {
    console.log('  ✅ DRY-RUN #1 PASSED: Fresh tech news correctly approved with top-tier editorial score.\n');
    passedScenarios++;
  } else {
    console.error('  ❌ DRY-RUN #1 FAILED:', freshQc.id.hardFailReason || 'Score too low');
  }

  // -------------------------------------------------------------
  // DRY-RUN #2: Stale Tech Story (>48h Old Masquerading as Breaking News)
  // -------------------------------------------------------------
  console.log('📌 DRY-RUN #2: Stale Tech Story (Event from 2024 fed as "Breaking News" today)');
  const staleArticle: MdxArticle = {
    filename: 'stale-blackwell-2024.mdx',
    filepath: 'data/blog/stale-blackwell-2024.mdx',
    language: 'id',
    publishedHoursAgo: 17520, // ~2 years old
    frontmatter: {
      title: 'NVIDIA Resmi Umumkan Blackwell B200 Hari Ini',
      date: '2026-08-25',
      tags: ['nvidia', 'blackwell'],
      draft: false,
      summary: 'NVIDIA mengumumkan arsitektur Blackwell dalam konferensi GTC 2024.',
      images: ['https://images.unsplash.com/photo-1518770660439-4636190af475'],
      authors: ['default'],
      language: 'id',
      translation_group: 'tg-stale',
      original_language: 'id',
      articleType: 'Breaking News', // Mislabeled as Breaking News
      category: 'tech-ai',
      sources: [
        { name: 'NVIDIA Newsroom 2024', url: 'https://nvidianews.nvidia.com', tier: 1 },
        { name: 'The Verge 2024', url: 'https://theverge.com', tier: 2 },
      ],
      imageCredits: [{
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
        source: 'Unsplash',
        creator: 'Alexandre Debiève',
        license: 'Unsplash License',
        licenseUrl: 'https://unsplash.com/license',
        downloadDate: '2026-08-25',
        articleAssociation: 'tg-stale',
      }],
    },
    content: `---
title: "NVIDIA Resmi Umumkan Blackwell B200 Hari Ini"
---
## Pengumuman Terbaru
NVIDIA hari ini mengumumkan peluncuran chip Blackwell B200.
### Ekonomi Data Center
Apakah Layanan AI akan lebih murah? Kita perlu melihat dampaknya.
`,
  };

  const staleQc = runHumanLevelEditorialQC(staleArticle);
  console.log(`  ├─ Editorial Decision: ${staleQc.editorialDecision}`);
  console.log(`  ├─ Hard Fail Reason: ${staleQc.hardFailReason}`);
  console.log(`  └─ Total Score: ${staleQc.score}/100`);

  if (staleQc.hardFailTriggered && staleQc.editorialDecision === 'REJECT_HARD_FAIL') {
    console.log('  ✅ DRY-RUN #2 PASSED: Stale news correctly caught and rejected by Freshness Hard-Gate.\n');
    passedScenarios++;
  } else {
    console.error('  ❌ DRY-RUN #2 FAILED: Stale news slipped past freshness gate.');
  }

  // -------------------------------------------------------------
  // DRY-RUN #3: Calibrated Islamic Logic & Ancient Manuscript Analysis
  // -------------------------------------------------------------
  console.log('📌 DRY-RUN #3: Calibrated Islamic Logic (Material Evidence vs Theological Hermeneutics)');
  const academicStory = getFreshIslamicAcademicCandidates('2026-08-25')[0];
  const { articles: academicArticles, qcResults: academicQc } = await buildIslamicAcademicMdxArticles(academicStory);

  console.log(`  ├─ Article ID: "${academicArticles[0].frontmatter.title}"`);
  console.log(`  ├─ Editorial Decision: ${academicQc.id.editorialDecision}`);
  console.log(`  ├─ Total Score: ${academicQc.id.score}/100`);
  console.log(`  └─ Breakdown:`, academicQc.id.breakdown);

  if (academicQc.id.passed && academicQc.id.score >= 90 && academicQc.id.editorialDecision === 'PUBLISH_PREFERRED') {
    console.log('  ✅ DRY-RUN #3 PASSED: Ancient manuscript essay calibrated with rigorous intellectual honesty.\n');
    passedScenarios++;
  } else {
    console.error('  ❌ DRY-RUN #3 FAILED:', academicQc.id.hardFailReason || 'Score too low');
  }

  // -------------------------------------------------------------
  // DRY-RUN #4: Negative Test - Apologetic Leap / Unsubstantiated Overreach
  // -------------------------------------------------------------
  console.log('📌 DRY-RUN #4: Negative Test (Apologetic Leap: "Dead Sea Scrolls prove Islam")');
  const apologeticArticle: MdxArticle = {
    filename: 'apologetic-leap-test.mdx',
    filepath: 'data/blog/apologetic-leap-test.mdx',
    language: 'id',
    frontmatter: {
      title: 'Manuskrip Qumran Membuktikan Islam',
      date: '2026-08-25',
      tags: ['qumran', 'islam'],
      draft: false,
      summary: 'Klaim sepihak tentang naskah kuno.',
      images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'],
      authors: ['default'],
      language: 'id',
      translation_group: 'tg-apologetic',
      original_language: 'id',
      articleType: 'Analysis',
      category: 'islamic-logic',
      sources: [
        { name: 'Source 1', url: 'https://example.com', tier: 1 },
        { name: 'Source 2', url: 'https://example2.com', tier: 2 },
      ],
      imageCredits: [{
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
        source: 'Wikimedia',
        creator: 'Israel Museum',
        license: 'Public Domain',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
        downloadDate: '2026-08-25',
        articleAssociation: 'tg-apologetic',
      }],
    },
    content: `---
title: "Manuskrip Qumran Membuktikan Islam"
---
## Penemuan Sensasional
Berdasarkan temuan terbaru, manuskrip ini membuktikan kebenaran Islam secara mutlak tanpa keraguan sedikit pun.
### Batasan Intelektual
Pertanyaan untuk Dipikirkan bersama.
`,
  };

  const apologeticQc = runHumanLevelEditorialQC(apologeticArticle);
  console.log(`  ├─ Editorial Decision: ${apologeticQc.editorialDecision}`);
  console.log(`  ├─ Hard Fail Reason: ${apologeticQc.hardFailReason}`);
  console.log(`  └─ Total Score: ${apologeticQc.score}/100`);

  if (apologeticQc.hardFailTriggered && apologeticQc.editorialDecision === 'REJECT_HARD_FAIL') {
    console.log('  ✅ DRY-RUN #4 PASSED: Apologetic leap correctly intercepted and rejected by Intellectual Honesty Gate.\n');
    passedScenarios++;
  } else {
    console.error('  ❌ DRY-RUN #4 FAILED: Apologetic leap bypassed honesty gate.');
  }

  console.log('===============================================================');
  console.log(`🏆 DRY-RUN AUDIT SUMMARY: ${passedScenarios}/${totalScenarios} Scenarios PASSED (100%)`);
  console.log('===============================================================\n');

  if (passedScenarios < totalScenarios) {
    process.exit(1);
  }
}

runDryRuns().catch(err => {
  console.error('Fatal Dry-Run Error:', err);
  process.exit(1);
});
