import { calculateRecencyScore } from '../../scripts/tech-researcher'
import { discoverSafeImagesForTopic } from '../../scripts/image-researcher'
import {
  buildTechMdxArticles,
  buildIslamicAcademicMdxArticles,
  runHumanLevelEditorialQC,
  MdxArticle,
} from '../../scripts/article-builder-qc'
import { TechResearchEngine } from '../../lib/mcp/domains/research/tech-engine'
import { IslamicResearchEngine } from '../../lib/mcp/domains/research/islamic-engine'
import { MEDIA_SOURCE_POOLS, PRIMARY_SOURCE_LAYERS } from '../../lib/mcp/config/media-pool'
import { WhatsAppService } from '../../lib/mcp/domains/notification/wa-service'
import { getNext3HourScheduleSlot, getNextWAScheduleSlot } from '../../scripts/scheduler-daemon'

async function runPipelineTests() {
  console.log('\n🧪 ========================================================')
  console.log('🧪 Starting Upgraded Autonomous Editorial Pipeline Test Suite')
  console.log('🧪 ========================================================\n')

  let passed = 0
  let failed = 0

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`)
      passed++
    } else {
      console.error(`  ❌ FAIL: ${message}`)
      failed++
    }
  }

  // -------------------------------------------------------------
  // Test 1: 3-Hour Research Scheduler & WhatsApp Gating
  // -------------------------------------------------------------
  console.log('📌 Test 1: 3-Hour Research Scheduler & WhatsApp Time Slots')
  const slot3h = getNext3HourScheduleSlot()
  assert(
    slot3h.delayMs > 0 && slot3h.delayMs <= 3 * 60 * 60 * 1000,
    'Next 3-hour cycle is within 3 hours interval'
  )
  assert(
    slot3h.targetLabel.includes('Siklus 3 Jam'),
    'Target label correctly indicates 3-hour rhythm'
  )

  const slotWA = getNextWAScheduleSlot()
  assert(slotWA.delayMs > 0, 'Next WhatsApp slot is strictly calculated')
  assert(
    slotWA.targetLabel.includes('05:00') || slotWA.targetLabel.includes('17:00'),
    'WhatsApp slots are strictly restricted to 05:00 and 17:00'
  )

  // Test WA suppression at intermediate hours (e.g. 14:00)
  const nonWASlotDate = new Date(2026, 7, 25, 14, 0, 0)
  assert(
    !WhatsAppService.isWhatsAppReportingSlot(nonWASlotDate),
    'WhatsApp dispatch is suppressed at intermediate 14:00 cycle'
  )

  const morningWASlotDate = new Date(2026, 7, 25, 5, 10, 0)
  assert(
    WhatsAppService.isWhatsAppReportingSlot(morningWASlotDate),
    'WhatsApp dispatch is activated at 05:00 cycle'
  )

  const eveningWASlotDate = new Date(2026, 7, 25, 17, 15, 0)
  assert(
    WhatsAppService.isWhatsAppReportingSlot(eveningWASlotDate),
    'WhatsApp dispatch is activated at 17:00 cycle'
  )

  // -------------------------------------------------------------
  // Test 2: Permanent 75 Media Source Pools
  // -------------------------------------------------------------
  console.log('\n📌 Test 2: Permanent 75 Media Source Pools & Primary Layers')
  assert(
    MEDIA_SOURCE_POOLS.indonesia.length === 25,
    'Contains exactly 25 Indonesian Tech Media outlets'
  )
  assert(
    MEDIA_SOURCE_POOLS.globalEnglish.length === 25,
    'Contains exactly 25 Global English Tech Media outlets'
  )
  assert(MEDIA_SOURCE_POOLS.arabic.length === 25, 'Contains exactly 25 Arabic Tech Media outlets')
  assert(
    Boolean(PRIMARY_SOURCE_LAYERS.STANDARDS_BODIES),
    'Primary standards bodies (JEDEC/IEEE) cataloged'
  )
  assert(
    Boolean(PRIMARY_SOURCE_LAYERS.HISTORICAL_ARCHIVES),
    'Historical manuscript archives cataloged'
  )

  // -------------------------------------------------------------
  // Test 3: Recency Scoring Matrix
  // -------------------------------------------------------------
  console.log('\n📌 Test 3: Recency Scoring Matrix')
  assert(calculateRecencyScore(2) === 25, 'Published 2h ago yields highest priority (25 pts)')
  assert(calculateRecencyScore(12) === 20, 'Published 12h ago yields very high priority (20 pts)')
  assert(calculateRecencyScore(48) === 15, 'Published 48h ago yields high priority (15 pts)')
  assert(calculateRecencyScore(200) === 2, 'Published >7d ago yields minimum priority (2 pts)')

  // -------------------------------------------------------------
  // Test 4: Islamic Logic Deep Research & Epistemological Demarcation
  // -------------------------------------------------------------
  console.log('\n📌 Test 4: Islamic Logic Deep Research & Epistemological Demarcation')
  const islamicStories = IslamicResearchEngine.getFreshIslamicAcademicCandidates('2026-08-25')
  assert(islamicStories.length >= 2, 'Discovered deep Islamic academic candidate stories')

  const shariaStory = islamicStories.find(
    (s) => s.id === 'rationality-sharia-riba-global-debt-cycles-economics'
  )
  assert(Boolean(shariaStory), 'Sharia Rationality (Riba & Macroeconomics) candidate is available')
  assert(
    Boolean(shariaStory?.epistemologicalPoints && shariaStory.epistemologicalPoints.length > 0),
    'Sharia Rationality contains explicit Epistemological Points'
  )

  const categories = shariaStory?.epistemologicalPoints.map((p) => p.category) || []
  assert(categories.includes('FACT'), 'Epistemological matrix contains empirical FACT')
  assert(categories.includes('EVIDENCE'), 'Epistemological matrix contains physical EVIDENCE')
  assert(
    categories.includes('COUNTERARGUMENT'),
    'Epistemological matrix contains scholarly COUNTERARGUMENT'
  )
  assert(
    categories.includes('UNCERTAINTY'),
    'Epistemological matrix acknowledges honest UNCERTAINTY'
  )

  const jesusStory = islamicStories.find((s) => s.id === 'jesus-isa-prayer-submission-tawhid-study')
  assert(Boolean(jesusStory), 'Jesus / Isa prayer and submission candidate is available')
  assert(
    jesusStory?.honestBoundaries.whatItProves.id.includes('APA YANG TERBUKTI'),
    'Jesus prayer essay contains clear honest boundaries (What it does and does not prove)'
  )

  // -------------------------------------------------------------
  // Test 5: Multilingual Article Build & QC Evaluation
  // -------------------------------------------------------------
  console.log('\n📌 Test 5: Multilingual Article Build & QC Evaluation')
  if (shariaStory) {
    const { articles, qcResults } = await buildIslamicAcademicMdxArticles(shariaStory)
    assert(articles.length === 3, 'Generated 3 localized language versions (ID, EN, AR)')
    assert(qcResults.id.passed, `Indonesian article passed QC (Score: ${qcResults.id.score}/100)`)
    assert(qcResults.en.passed, `English article passed QC (Score: ${qcResults.en.score}/100)`)
    assert(qcResults.ar.passed, `Arabic article passed QC (Score: ${qcResults.ar.score}/100)`)
    assert(
      articles[0].content.includes('Matriks Bukti') ||
        articles[0].content.includes('Demarkasi Ilmiah'),
      'ID article contains Epistemological Demarcation section'
    )
    assert(
      articles[1].content.includes('Evidence Matrix') ||
        articles[1].content.includes('Epistemological Demarcation'),
      'EN article contains Epistemological Demarcation section'
    )
    assert(
      articles[2].content.includes('مصفوفة الشواهد') ||
        articles[2].content.includes('الفرز الإبستمولوجي'),
      'AR article contains Arabic Epistemological section'
    )
  }

  // -------------------------------------------------------------
  // Test 6: Zero-Filler Hard-Fail Gatekeeper
  // -------------------------------------------------------------
  console.log('\n📌 Test 6: Zero-Filler & Language Purity Hard-Fail Gatekeepers')
  const dummyArticle: MdxArticle = {
    filename: 'dummy-test.mdx',
    filepath: 'data/blog/dummy-test.mdx',
    language: 'id',
    frontmatter: {
      title: 'Dummy Test Article',
      date: '2026-08-25',
      tags: ['test'],
      draft: false,
      summary: 'Test summary',
      images: ['/test.jpg'],
      authors: ['default'],
      language: 'id',
      translation_group: 'tg-dummy',
      original_language: 'id',
      articleType: 'Analysis',
      category: 'tech-ai',
      sources: [{ name: 'Test', url: 'https://test.com', tier: 1 }],
      imageCredits: [],
    },
    content: 'Di era digital yang terus berkembang ini, teknologi AI berkembang sangat cepat.',
  }

  const fillerQC = runHumanLevelEditorialQC(dummyArticle)
  assert(fillerQC.hardFailTriggered, 'QC correctly rejected article with AI filler phrases')
  assert(fillerQC.score === 0, 'Hard-fail score is 0/100')

  console.log('\n========================================================')
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed.`)
  console.log('========================================================\n')

  if (failed > 0) process.exit(1)
}

if (require.main === module) {
  runPipelineTests().catch(console.error)
}
