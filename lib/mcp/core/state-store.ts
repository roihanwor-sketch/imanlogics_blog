import fs from 'fs'
import { MCP_CONFIG } from '../config/env'
import { AuditCycleReport } from './types'

export interface StateRecord {
  lastUpdated: string
  totalCyclesRun: number
  recentReports: AuditCycleReport[]
}

export class StateStore {
  private static filePath = MCP_CONFIG.historyFilePath

  static load(): StateRecord {
    if (!fs.existsSync(this.filePath)) {
      return {
        lastUpdated: new Date().toISOString(),
        totalCyclesRun: 0,
        recentReports: [],
      }
    }

    try {
      const raw = fs.readFileSync(this.filePath, 'utf-8')
      return JSON.parse(raw)
    } catch {
      return {
        lastUpdated: new Date().toISOString(),
        totalCyclesRun: 0,
        recentReports: [],
      }
    }
  }

  static saveReport(report: AuditCycleReport) {
    const state = this.load()
    state.lastUpdated = new Date().toISOString()
    state.totalCyclesRun++
    state.recentReports.unshift(report)

    // Keep latest 100 cycle reports for comprehensive aggregation
    if (state.recentReports.length > 100) {
      state.recentReports = state.recentReports.slice(0, 100)
    }

    try {
      fs.writeFileSync(this.filePath, JSON.stringify(state, null, 2), 'utf-8')
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error(`Failed to persist cycle report: ${errorMsg}`)
    }
  }

  static getLatestReport(): AuditCycleReport | null {
    const state = this.load()
    return state.recentReports[0] || null
  }

  /**
   * Retrieves all reports recorded in the last N hours for aggregated WhatsApp dispatches
   */
  static getReportsInTimeWindow(hours = 12): AuditCycleReport[] {
    const state = this.load()
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000
    return state.recentReports.filter((rep) => {
      const ts = new Date(rep.cycleTimestamp).getTime()
      return ts >= cutoffTime
    })
  }
}
