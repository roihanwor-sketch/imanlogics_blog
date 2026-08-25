import { EditorialOrchestrator } from '../lib/mcp/orchestrator'
import { AuditCycleReport, PublishedStoryMeta } from '../lib/mcp/core/types'

export type { AuditCycleReport, PublishedStoryMeta }

/**
 * Autonomous Editorial & News Intelligence Publisher Cron (Delegates to ImanLogics MCP Core)
 */
export async function runAutonomousEditorialPipeline(
  options: { gitPush?: boolean; dryRun?: boolean } = {}
): Promise<AuditCycleReport> {
  return await EditorialOrchestrator.runEditorialPipeline(options)
}

if (require.main === module) {
  runAutonomousEditorialPipeline({ gitPush: false }).catch(console.error)
}
