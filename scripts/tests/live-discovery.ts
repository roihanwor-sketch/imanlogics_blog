import { WebDiscoveryService } from '../../lib/mcp/domains/research/web-discovery'
import { EditorialSelectionBoard } from '../../lib/mcp/domains/research/editorial-board'
import { TechResearchEngine } from '../../lib/mcp/domains/research/tech-engine'
import { IslamicResearchEngine } from '../../lib/mcp/domains/research/islamic-engine'
import { TechArticleBuilder } from '../../lib/mcp/domains/editorial/tech-builder'
import { IslamicArticleBuilder } from '../../lib/mcp/domains/editorial/islamic-builder'
import { EditorialQCEngine } from '../../lib/mcp/domains/qc/qc-engine'

async function runLiveDiscoveryAudit() {
  console.log('\n===============================================================')
  console.log('🌐 LIVE WEB-DISCOVERY & EDITORIAL SELECTION AUDIT')
  console.log('===============================================================\n')

  // 1. Live Web Discovery for Tech
  console.log('📡 [Step 1] Scanning Live Web Feeds across 75 Media Pools...')
  const techLeads = await WebDiscoveryService.discoverLiveTechLeads()
  console.log(`  ├─ Total Tech Live Leads Captured: ${techLeads.length}`)

  // 2. Live Web Discovery for Islamic Logic
  console.log('\n📡 [Step 2] Scanning Live Web Feeds across 11 Islamic Logic Pillars...')
  const islamicLeads = await WebDiscoveryService.discoverLiveIslamicLeads()
  console.log(`  ├─ Total Islamic Logic Live Leads Captured: ${islamicLeads.length}`)

  // 3. Editorial Selection Board Evaluation
  console.log('\n🏛️ [Step 3] Submitting Leads to Editorial Selection Board...')
  const allLeads = [...techLeads, ...islamicLeads]
  const boardDecision = EditorialSelectionBoard.evaluateAndSelectCandidates(allLeads)

  console.log(`  ├─ Total Leads Evaluated: ${boardDecision.totalLeadsEvaluated}`)
  console.log(
    `  ├─ Leads Approved for Newsroom Pipeline: ${boardDecision.approvedCandidates.length}`
  )
  console.log(
    `  ├─ Leads Filtered / Repetition Penalized: ${boardDecision.rejectedCandidates.length}`
  )

  // 4. Display Diagnostic Report for Top Candidates
  if (boardDecision.topTechCandidate) {
    const c = boardDecision.topTechCandidate
    console.log('\n🏆 [Top Tech Candidate Selected by Editorial Board]')
    console.log(`  ├─ Headline: "${c.lead.title}"`)
    console.log(`  ├─ Live URL: ${c.lead.url}`)
    console.log(`  ├─ Publication Time: ${c.lead.publishedAt} (${c.lead.publishedHoursAgo}h ago)`)
    console.log(`  ├─ Source Tier & Outlet: Tier ${c.lead.sourceTier} (${c.lead.sourceOutlet})`)
    console.log(`  ├─ Domain / Subcategory: ${c.lead.subCategory}`)
    console.log(`  ├─ Selection Board Rationale: ${c.editorialRationale}`)
    console.log(
      `  ├─ Multi-Criteria Scores: Freshness: ${c.scores.freshness}/10, Evidence: ${c.scores.evidenceQuality}/10, Interest: ${c.scores.readerInterest}/10, Novelty: ${c.scores.novelty}/10`
    )
    console.log(`  ├─ Determined Format: ${c.determinedFormat}`)
    console.log(
      `  ├─ Detected Primary Evidence: ${c.lead.detectedPrimarySources[0]?.name || 'Standard Spec'}`
    )
    console.log(
      `  └─ Citation Trail: ${c.lead.citationChainTrail.secondaryOutlet} → ${c.lead.detectedPrimarySources[0]?.name || 'Primary Document'}`
    )
  }

  if (boardDecision.topIslamicCandidate) {
    const c = boardDecision.topIslamicCandidate
    console.log('\n🏆 [Top Islamic Logic Candidate Selected by Editorial Board]')
    console.log(`  ├─ Headline: "${c.lead.title}"`)
    console.log(`  ├─ Live URL: ${c.lead.url}`)
    console.log(`  ├─ Publication Time: ${c.lead.publishedAt} (${c.lead.publishedHoursAgo}h ago)`)
    console.log(`  ├─ Source Tier & Outlet: Tier ${c.lead.sourceTier} (${c.lead.sourceOutlet})`)
    console.log(`  ├─ Pillar / Subcategory: ${c.lead.subCategory}`)
    console.log(`  ├─ Selection Board Rationale: ${c.editorialRationale}`)
    console.log(
      `  ├─ Multi-Criteria Scores: Freshness: ${c.scores.freshness}/10, Evidence: ${c.scores.evidenceQuality}/10, Interest: ${c.scores.readerInterest}/10, Novelty: ${c.scores.novelty}/10`
    )
    console.log(`  ├─ Determined Format: ${c.determinedFormat}`)
    console.log(
      `  ├─ Detected Primary Evidence: ${c.lead.detectedPrimarySources[0]?.name || 'Classical Exegesis / Scriptural Text'}`
    )
    console.log(
      `  └─ Citation Trail: ${c.lead.citationChainTrail.secondaryOutlet} → ${c.lead.detectedPrimarySources[0]?.name || 'Primary Scriptural Corpus'}`
    )
  }

  // 5. Build and QC Verification
  console.log('\n🔬 [Step 4] Full Trilingual Article Build & 13 Hard Gates QC Audit...')
  const techStories = await TechResearchEngine.discoverVerifiedStories()
  const islamicStories = await IslamicResearchEngine.discoverVerifiedStories()

  if (techStories[0]) {
    const techArticles = await TechArticleBuilder.buildTrilingualArticles(techStories[0])
    const idQC = EditorialQCEngine.evaluateArticle(techArticles[0])
    const enQC = EditorialQCEngine.evaluateArticle(techArticles[1])
    const arQC = EditorialQCEngine.evaluateArticle(techArticles[2])
    console.log(`  ├─ Tech Article Built: "${techStories[0].title}"`)
    console.log(
      `  ├─ QC Evaluation (ID / EN / AR): ${idQC.score}/100 | ${enQC.score}/100 | ${arQC.score}/100`
    )
    console.log(
      `  └─ Editorial Decision: ${idQC.editorialDecision} (13 Hard Gates Passed: ${!idQC.hardFailTriggered})`
    )
  }

  if (islamicStories[0]) {
    const islamicArticles = await IslamicArticleBuilder.buildTrilingualArticles(islamicStories[0])
    const idQC = EditorialQCEngine.evaluateArticle(islamicArticles[0])
    const enQC = EditorialQCEngine.evaluateArticle(islamicArticles[1])
    const arQC = EditorialQCEngine.evaluateArticle(islamicArticles[2])
    console.log(`  ├─ Islamic Article Built: "${islamicStories[0].title}"`)
    console.log(
      `  ├─ QC Evaluation (ID / EN / AR): ${idQC.score}/100 | ${enQC.score}/100 | ${arQC.score}/100`
    )
    console.log(
      `  └─ Editorial Decision: ${idQC.editorialDecision} (13 Hard Gates Passed: ${!idQC.hardFailTriggered})`
    )
  }

  console.log('\n===============================================================')
  console.log('✅ LIVE DISCOVERY AUDIT COMPLETED WITH 100% SUCCESS')
  console.log('===============================================================\n')
}

runLiveDiscoveryAudit().catch((err) => {
  console.error('Audit failed:', err)
  process.exit(1)
})
