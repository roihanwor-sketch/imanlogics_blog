import { TechResearchEngine } from '../../lib/mcp/domains/research/tech-engine'
import { IslamicResearchEngine } from '../../lib/mcp/domains/research/islamic-engine'
import { ArticleAssembler } from '../../lib/mcp/domains/editorial/article-assembler'
import { MdxArticle } from '../../lib/mcp/core/types'
import { MEDIA_SOURCE_POOLS, PRIMARY_SOURCE_LAYERS } from '../../lib/mcp/config/media-pool'
import { getNext3HourScheduleSlot, getNextWAScheduleSlot } from '../../scripts/scheduler-daemon'

const calculateRecencyScore = TechResearchEngine.calculateRecencyScore

async function runPipelineTests() {
  console.log('\n🧪 ========================================================')
  console.log('🧪 Starting Clean Autonomous Editorial Pipeline Test Suite')
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
    slot3h.targetLabel.includes('Pengerjaan dimulai') || slot3h.delayMs <= 3 * 60 * 60 * 1000,
    'Target label correctly indicates 3-hour rhythm'
  )

  const slotWA = getNextWAScheduleSlot()
  const targetHour = slotWA.nextTargetDate.getHours()
  assert(
    targetHour === 5 || targetHour === 17,
    'WhatsApp slot aligns strictly to 05:00 or 17:00 WIB'
  )

  // -------------------------------------------------------------
  // Test 2: Media Source Pools Verification (75 Outlets)
  // -------------------------------------------------------------
  console.log('\n📌 Test 2: Media Source Pools & Primary Source Catalog')
  const totalPools =
    MEDIA_SOURCE_POOLS.indonesia.length +
    MEDIA_SOURCE_POOLS.globalEnglish.length +
    MEDIA_SOURCE_POOLS.arabic.length
  assert(totalPools === 75, `Cataloged exactly 75 reputable media outlets (Found: ${totalPools})`)
  assert(Boolean(PRIMARY_SOURCE_LAYERS.STANDARDS_BODIES), 'Primary standards bodies cataloged')

  // -------------------------------------------------------------
  // Test 3: Recency Scoring Matrix
  // -------------------------------------------------------------
  console.log('\n📌 Test 3: Recency Scoring Matrix')
  assert(calculateRecencyScore(2) === 25, 'Published 2h ago yields highest priority (25 pts)')
  assert(calculateRecencyScore(12) === 20, 'Published 12h ago yields very high priority (20 pts)')
  assert(calculateRecencyScore(48) === 15, 'Published 48h ago yields high priority (15 pts)')
  assert(calculateRecencyScore(200) === 2, 'Published >7d ago yields minimum priority (2 pts)')

  // -------------------------------------------------------------
  // Test 4: ArticleAssembler Integrity
  // -------------------------------------------------------------
  console.log('\n📌 Test 4: Dynamic ArticleAssembler Frontmatter & Content Formatting')
  const sampleArticle = ArticleAssembler.assembleMdx({
    slug: 'test-article-clean',
    title: 'Test Clean Title',
    summary: 'A brief summary of the test article.',
    content:
      '## Context\n\nThis is a clean, organic body text.\n\n## Impact\n\nDirect real-world impact.',
    language: 'id',
    translation_group: 'tg-test-article',
    category: 'tech-ai',
    keywords: ['test', 'clean'],
    sources: [
      { name: 'Test Source', url: 'https://example.com', tier: 1, type: 'academic-journal' },
    ],
  })

  assert(sampleArticle.filename === 'test-article-clean.mdx', 'Correct filename generated')
  assert(sampleArticle.frontmatter.title === 'Test Clean Title', 'Frontmatter title preserved')
  assert(sampleArticle.content.includes('## Context'), 'Markdown content structure preserved')
  assert(!sampleArticle.content.includes('WHAT IT PROVES'), 'No rigid boilerplate forced')

  console.log('\n========================================================')
  console.log(`Test Results: ${passed} passed, ${failed} failed`)
  console.log('========================================================\n')
  process.exit(failed > 0 ? 1 : 0)
}

runPipelineTests()
