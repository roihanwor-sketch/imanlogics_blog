import { calculateRecencyScore, TechNewsStory } from '../tech-researcher';
import { discoverSafeImagesForTopic } from '../image-researcher';
import { runMultidimensionalQC, buildTechMdxArticles, MdxArticle } from '../article-builder-qc';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failedTests++;
  }
}

async function runTestSuite() {
  console.log('🧪 ========================================================');
  console.log('🧪 Starting Autonomous Editorial Pipeline Test Suite');
  console.log('🧪 ========================================================\n');

  // --- TEST 1: Recency Filter & Scoring ---
  console.log('📌 Test 1: Recency Scoring Matrix');
  assert(calculateRecencyScore(2) === 25, 'Published 2h ago yields highest priority (25 pts)');
  assert(calculateRecencyScore(12) === 20, 'Published 12h ago yields very high priority (20 pts)');
  assert(calculateRecencyScore(48) === 15, 'Published 48h ago yields high priority (15 pts)');
  assert(calculateRecencyScore(200) === 2, 'Published >7d ago yields minimum priority (2 pts)');

  // --- TEST 2: Image Intelligence & Licensing ---
  console.log('\n📌 Test 2: Copyright-Safe Image Sourcing & Licensing');
  const imageResult = await discoverSafeImagesForTopic(['hardware', 'chip', 'processor'], 'tech-ai', 2, 3);
  assert(imageResult.images.length >= 2, 'Discovered at least 2 safe images for tech hardware');
  assert(imageResult.allLicensed, 'All discovered images have verified licenses and authors');
  assert(!!imageResult.images[0].altText.id, 'Image includes Indonesian alt text');
  assert(!!imageResult.images[0].altText.en, 'Image includes English alt text');
  assert(!!imageResult.images[0].altText.ar, 'Image includes Arabic alt text');

  // --- TEST 3: Multidimensional QC Gatekeeper (Passing Case) ---
  console.log('\n📌 Test 3: Multidimensional QC Gatekeeper');
  const sampleStory: TechNewsStory = {
    id: 'test-silicon-breakthrough',
    title: 'Test Silicon Milestone',
    titles: {
      id: 'Pengujian Inovasi Semikonduktor 2nm: Peningkatan Efisiensi Energi',
      en: '2nm Semiconductor Milestone Testing: Energy Efficiency Breakthrough',
      ar: 'اختبار قفزة أشباه الموصلات بدقة 2 نانومتر: كفاءة استثنائية في الطاقة',
    },
    eventDate: '2026-08-25',
    publishedHoursAgo: 5,
    recencyScore: 25,
    sourceQualityScore: 25,
    overallScore: 95,
    category: 'tech-ai',
    editorialAngle: 'Technical Deep Dive',
    isRumor: false,
    newsHook: 'Pengumuman resmi tape-out chip 2nm komersial pertama.',
    summary: {
      id: 'Uji coba fabrikasi semikonduktor 2nm berhasil meningkatkan performa komputasi NPU hingga 40%.',
      en: 'The 2nm semiconductor tape-out successfully achieved a 40% increase in NPU compute throughput.',
      ar: 'حققت اختبارات تصنيع أشباه الموصلات بدقة 2 نانومتر زيادة بنسبة 40% في أداء معالجة الذكاء الاصطناعي.',
    },
    keyFacts: {
      id: ['Fabrikasi GAA (Gate-All-Around) memangkas kebocoran arus listrik.', 'Kepadatan transistor meningkat 1.5 kali lipat.'],
      en: ['Gate-All-Around (GAA) architecture cuts current leakage.', 'Transistor density increased by 1.5x.'],
      ar: ['بنية البوابات الشاملة (GAA) تحد من تسريب التيار الكهربائي.', 'زيادة كثافة الترانزستور بمقدار 1.5 ضعف.'],
    },
    technicalDeepDive: {
      id: 'Teknologi nanosheet memungkinkan kontrol arus yang lebih presisi pada tegangan sub-volt.',
      en: 'Nanosheet technology enables precise electrostatic control at sub-volt operating levels.',
      ar: 'تتيح تقنية الصفائح النانوية تحكماً إلكتروستاتيكياً فائق الدقة عند مستويات جهد منخفضة.',
    },
    sources: [
      { name: 'IEEE Solid-State Circuits Society', url: 'https://sscs.ieee.org', tier: 1, type: 'Academic Paper' },
      { name: 'Ars Technica Science & Hardware', url: 'https://arstechnica.com', tier: 2, type: 'Journalism' },
    ],
    keywords: ['semiconductor', 'chip', '2nm', 'hardware', 'transistor'],
  };

  const { articles, qcResults } = await buildTechMdxArticles(sampleStory);
  assert(articles.length === 3, 'Generated 3 localized language versions (ID, EN, AR)');
  assert(qcResults.id.passed, `Indonesian article passed QC (Score: ${qcResults.id.score}/100)`);
  assert(qcResults.en.passed, `English article passed QC (Score: ${qcResults.en.score}/100)`);
  assert(qcResults.ar.passed, `Arabic article passed QC (Score: ${qcResults.ar.score}/100)`);

  // --- TEST 4: Anti-Hallucination & Zero-Filler Hard-Fail Protection ---
  console.log('\n📌 Test 4: Zero-Filler Hard-Fail Gatekeeper');
  const dirtyArticle: MdxArticle = {
    filename: 'dirty-filler-test.mdx',
    filepath: 'data/blog/dirty-filler-test.mdx',
    language: 'id',
    frontmatter: {
      title: 'Artikel dengan Filler',
      date: '2026-08-25',
      tags: ['ai'],
      draft: false,
      summary: 'Ringkasan artikel',
      images: ['https://images.unsplash.com/photo-1518770660439-4636190af475'],
      authors: ['default'],
      language: 'id',
      translation_group: 'tg-dirty',
      original_language: 'id',
      articleType: 'Explainer',
      category: 'tech-ai',
      sources: [
        { name: 'Source 1', url: 'https://example.com', tier: 1 },
        { name: 'Source 2', url: 'https://example2.com', tier: 2 },
      ],
      imageCredits: [{ author: 'Author', license: 'Unsplash License', source: 'Unsplash', url: 'https://unsplash.com' }],
    },
    content: `---
title: "Artikel dengan Filler"
---
## Pendahuluan
Di era digital yang semakin berkembang, teknologi terus berkembang pesat. Mari kita simak penjelasan mendalam berikut ini.
`,
  };

  const dirtyQc = runMultidimensionalQC(dirtyArticle);
  assert(!dirtyQc.passed, 'QC correctly rejected article with AI filler phrases');
  // --- TEST 5: Islamic Academic & Intellectual Storytelling Architecture ---
  console.log('\n📌 Test 5: Islamic Academic & Intellectual Storytelling Architecture');
  const { getFreshIslamicAcademicCandidates } = await import('../islamic-logic-researcher');
  const { buildIslamicAcademicMdxArticles } = await import('../article-builder-qc');
  const academicStories = getFreshIslamicAcademicCandidates('2026-08-25');
  assert(academicStories.length > 0, 'Discovered valid Islamic academic story candidates');

  const firstStory = academicStories[0];
  assert(!!firstStory.readerHook.id, 'Includes compelling reader curiosity hook');
  assert(!!firstStory.universalQuestion.id, 'Includes universal human question');
  assert(!!firstStory.whatThisDoesAndDoesntProve.id, 'Includes honest epistemological boundaries');

  const { articles: academicArticles, qcResults: academicQc } = await buildIslamicAcademicMdxArticles(firstStory);
  assert(academicArticles.length === 3, 'Generated 3 localized storytelling articles (ID, EN, AR)');
  assert(academicQc.id.passed, `ID Storytelling article passed QC (Score: ${academicQc.id.score}/100)`);
  assert(academicArticles[0].content.includes('Pertanyaan Awal'), 'ID article contains "Pertanyaan Awal" section');
  assert(academicArticles[0].content.includes('Batasan Intelektual'), 'ID article contains "Batasan Intelektual" section');
  assert(academicArticles[1].content.includes('The Core Question'), 'EN article contains "The Core Question" section');
  assert(academicArticles[2].content.includes('السؤال الجوهري'), 'AR article contains Arabic core question section');

  console.log('\n========================================================');
  console.log(`📊 Test Results: ${passedTests} Passed, ${failedTests} Failed.`);
  console.log('========================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
