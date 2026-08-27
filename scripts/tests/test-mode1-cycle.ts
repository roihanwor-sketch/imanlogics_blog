import { EditorialOrchestrator } from '../../lib/mcp/orchestrator'

async function runMode1Cycle() {
  console.log('========================================================')
  console.log('🚀 EXECUTING MODE 1 AUTONOMOUS EDITORIAL CYCLE TEST')
  console.log('========================================================')

  const report = await EditorialOrchestrator.runEditorialPipeline({
    dryRun: false,
    gitPush: false,
  })

  console.log('Cycle Execution Completed!')
  console.log('Status:', report.status)
  console.log('Articles Evaluated:', report.storiesEvaluated)
  console.log('Articles Published:', report.articlesPublished)
  console.log('Published Details:', JSON.stringify(report.publishedStoryDetails, null, 2))
  if (report.rejectionReasons.length > 0) {
    console.log('Rejection Reasons:', report.rejectionReasons)
  }
}

runMode1Cycle()
