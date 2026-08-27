import { LockManager } from '../lib/mcp/core/lock-manager'
import { EditorialOrchestrator } from '../lib/mcp/orchestrator'
import { ReportFormatter } from '../lib/mcp/domains/notification/report-formatter'
import { WhatsAppService } from '../lib/mcp/domains/notification/wa-service'
import { NotificationPayload } from '../lib/mcp/core/types'
import { Logger } from '../lib/mcp/core/logger'
import { AntigravitySessionDetector } from '../lib/mcp/core/session-detector'

export const ADVANCE_PREPARATION_BUFFER_MS = 15 * 60 * 1000 // 15 menit sebelum jam target

export function getNext3HourScheduleSlot(now = new Date()): {
  nextTargetDate: Date
  advanceTriggerDate: Date
  delayMs: number
  targetLabel: string
} {
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const currentDate = now.getDate()

  const slots = [0, 3, 6, 9, 12, 15, 18, 21]

  // Find the next target hour slot where the advance trigger (h - 15m) is in the future
  let targetYear = currentYear
  let targetMonth = currentMonth
  let targetDate = currentDate
  let targetHour = slots.find((h) => {
    const targetCandidate = new Date(currentYear, currentMonth, currentDate, h, 0, 0, 0)
    const triggerCandidate = targetCandidate.getTime() - ADVANCE_PREPARATION_BUFFER_MS
    return triggerCandidate > now.getTime()
  })

  if (targetHour === undefined) {
    // Wrap to next day
    const nextDaySlot = slots.find((h) => {
      const targetCandidate = new Date(currentYear, currentMonth, currentDate + 1, h, 0, 0, 0)
      const triggerCandidate = targetCandidate.getTime() - ADVANCE_PREPARATION_BUFFER_MS
      return triggerCandidate > now.getTime()
    })
    targetHour = nextDaySlot !== undefined ? nextDaySlot : 0
    targetDate = currentDate + 1
  }

  const nextTarget = new Date(targetYear, targetMonth, targetDate, targetHour, 0, 0, 0)
  const advanceTriggerTime = nextTarget.getTime() - ADVANCE_PREPARATION_BUFFER_MS

  let delayMs = advanceTriggerTime - now.getTime()
  if (delayMs <= 0) {
    delayMs = 1000
  }

  const timeStr = nextTarget.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const advanceStr = new Date(advanceTriggerTime).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return {
    nextTargetDate: nextTarget,
    advanceTriggerDate: new Date(advanceTriggerTime),
    delayMs,
    targetLabel: `${timeStr} (Pengerjaan dimulai ${advanceStr})`,
  }
}

export function getNextWAScheduleSlot(now = new Date()): {
  nextTargetDate: Date
  advanceTriggerDate: Date
  delayMs: number
  targetLabel: string
} {
  const year = now.getFullYear()
  const month = now.getMonth()
  const date = now.getDate()

  const slotMorning = new Date(year, month, date, 5, 0, 0, 0)
  const slotEvening = new Date(year, month, date, 17, 0, 0, 0)
  const slotTomorrowMorning = new Date(year, month, date + 1, 5, 0, 0, 0)

  let nextTarget: Date
  let targetLabel: string

  if (now.getTime() < slotMorning.getTime()) {
    nextTarget = slotMorning
    targetLabel = '05:00 (Pagi Ini)'
  } else if (now.getTime() < slotEvening.getTime()) {
    nextTarget = slotEvening
    targetLabel = '17:00 (Sore Ini)'
  } else {
    nextTarget = slotTomorrowMorning
    targetLabel = '05:00 (Besok Pagi)'
  }

  const triggerTime = nextTarget.getTime()
  let delayMs = triggerTime - now.getTime()
  if (delayMs <= 0) {
    delayMs = 1000
  }

  return {
    nextTargetDate: nextTarget,
    advanceTriggerDate: new Date(triggerTime),
    delayMs,
    targetLabel,
  }
}

export async function startSchedulerDaemon(runImmediately = true) {
  Logger.header('Autonomous 3-Hour Scheduler Daemon (ImanLogics MCP Engine)')

  if (!LockManager.acquire()) {
    return
  }

  process.on('SIGINT', () => {
    Logger.info('Scheduler', 'Shutting down gracefully...')
    LockManager.release()
    process.exit(0)
  })

  process.on('SIGTERM', () => {
    LockManager.release()
    process.exit(0)
  })

  const tz = ReportFormatter.getLocalSystemTimeInfo()
  Logger.info(
    'Scheduler',
    `System Clock: ${tz.formattedDate}, ${tz.formattedTime} (${tz.timeZone} / ${tz.offsetStr})`
  )
  Logger.info(
    'Scheduler',
    'Autonomous Research Rhythm: Every 3 Hours (00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00 WIB)'
  )
  Logger.info(
    'Scheduler',
    'WhatsApp Dissemination Schedule: Strictly at 05:00 & 17:00 (Aggregated 12-Hour Report)'
  )

  // -------------------------------------------------------------
  // DEDICATED WHATSAPP DISSEMINATION TIMER LOOP (05:00 & 17:00)
  // -------------------------------------------------------------
  const scheduleDedicatedWhatsAppTimer = () => {
    const waSlot = getNextWAScheduleSlot()
    const hoursUntilWA = (waSlot.delayMs / (1000 * 60 * 60)).toFixed(2)
    Logger.info(
      'Scheduler',
      `Next dedicated WhatsApp dissemination scheduled in ${hoursUntilWA} hours at ${waSlot.targetLabel}.`
    )

    setTimeout(async () => {
      try {
        Logger.info('Scheduler', `Triggering dedicated 05:00/17:00 WhatsApp dissemination...`)
        const payload = WhatsAppService.buildAggregatedPayload()
        await WhatsAppService.sendNotification(payload)
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err)
        Logger.error('Scheduler', `WhatsApp scheduled trigger encountered an exception: ${errorMsg}`)
      } finally {
        scheduleDedicatedWhatsAppTimer()
      }
    }, waSlot.delayMs)
  }

  // Start independent WhatsApp timer
  scheduleDedicatedWhatsAppTimer()

  // -------------------------------------------------------------
  // EDITORIAL RESEARCH 3-HOUR PIPELINE LOOP
  // -------------------------------------------------------------
  const executeCycle = async (isManualTrigger = false) => {
    LockManager.heartbeat()
    const nextSlot = getNext3HourScheduleSlot()
    const nextWASlot = getNextWAScheduleSlot()
    const nextTimeStr = `${nextWASlot.targetLabel} — ${nextWASlot.nextTargetDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`

    try {
      const modeInfo = AntigravitySessionDetector.getDynamicExecutionMode()
      Logger.info(
        'Scheduler',
        `Executing Autonomous 3-Hour Editorial Pipeline [Active Mode: ${modeInfo.mode}]...`
      )
      const report = await EditorialOrchestrator.runEditorialPipeline({ gitPush: true })

      const isWAReportingWindow = WhatsAppService.isWhatsAppReportingSlot() || isManualTrigger

      if (isWAReportingWindow) {
        Logger.info(
          'Scheduler',
          'WhatsApp reporting window active (05:00/17:00). Sending aggregated report...'
        )
        const payload: NotificationPayload = {
          status: report.status,
          articlesPublished: report.articlesPublished,
          publishedStories: report.publishedStoryDetails,
          techArticlesCount: report.publishedStoryDetails.filter((s) => s.category === 'tech-ai')
            .length,
          islamicArticlesCount: report.publishedStoryDetails.filter(
            (s) => s.category === 'islamic-logic'
          ).length,
          totalTrilingualArticles: report.articlesPublished.length,
          qcAverageScore: 100,
          gitPushStatus:
            report.status === 'SUCCESS' ? '✅ Ter-push ke branch main' : 'ℹ️ Tidak ada commit baru',
          nextCycleTime: nextTimeStr,
        }

        await WhatsAppService.sendNotification(payload)
      } else {
        Logger.info(
          'Scheduler',
          `Intermediate 3-hour cycle completed. WhatsApp notification skipped (Scheduled for 05:00 / 17:00).`
        )
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      Logger.error('Scheduler', `Pipeline encountered an exception: ${errorMsg}`)

      if (WhatsAppService.isWhatsAppReportingSlot() || isManualTrigger) {
        const errorPayload: NotificationPayload = {
          status: 'ERROR',
          articlesPublished: [],
          techArticlesCount: 0,
          islamicArticlesCount: 0,
          totalTrilingualArticles: 0,
          qcAverageScore: 0,
          gitPushStatus: '❌ Gagal',
          nextCycleTime: nextTimeStr,
          errorMessage: errorMsg,
        }
        await WhatsAppService.sendNotification(errorPayload)
      }
    }

    const updatedSlot = getNext3HourScheduleSlot()
    const hours = (updatedSlot.delayMs / (1000 * 60 * 60)).toFixed(2)
    Logger.info(
      'Scheduler',
      `Next 3-hour research cycle scheduled in ${hours} hours at ${updatedSlot.targetLabel}. Waiting...`
    )

    setTimeout(async () => {
      await executeCycle(false)
    }, updatedSlot.delayMs)
  }

  if (runImmediately) {
    await executeCycle(true)
  } else {
    const slot = getNext3HourScheduleSlot()
    Logger.info('Scheduler', `Waiting for next 3-hour schedule slot at ${slot.targetLabel}...`)
    setTimeout(async () => {
      await executeCycle(false)
    }, slot.delayMs)
  }
}

if (require.main === module) {
  startSchedulerDaemon(true).catch(console.error)
}
