import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'
import { MCP_CONFIG } from '../../config/env'
import { NotificationPayload } from '../../core/types'
import { ReportFormatter } from './report-formatter'
import { Logger } from '../../core/logger'

export class WhatsAppService {
  /**
   * Checks if current local PC time is within the designated WhatsApp reporting slot (05:00 or 17:00)
   */
  static isWhatsAppReportingSlot(now = new Date()): boolean {
    const hours = now.getHours()
    const minutes = now.getMinutes()
    // Window persiapan & pengiriman: 04:45-05:30 WIB dan 16:45-17:30 WIB
    const isMorningWindow = (hours === 4 && minutes >= 45) || (hours === 5 && minutes <= 30)
    const isEveningWindow = (hours === 16 && minutes >= 45) || (hours === 17 && minutes <= 30)
    return isMorningWindow || isEveningWindow
  }

  /**
   * Dispatches WhatsApp notification via D:\KULIAH\AGENT integration with Base64 payload & collision retry
   */
  static async sendNotification(
    payload: NotificationPayload,
    phoneNumber = MCP_CONFIG.targetWhatsAppNumber,
    maxRetries = 3
  ): Promise<boolean> {
    const messageText = ReportFormatter.formatWhatsAppReport(payload)
    Logger.info('WhatsAppService', `Preparing notification dispatch for ${phoneNumber}...`)

    if (!fs.existsSync(MCP_CONFIG.waDispatcherPath)) {
      Logger.warn('WhatsAppService', `Dispatcher not found at path: ${MCP_CONFIG.waDispatcherPath}`)
      return false
    }

    const base64Msg = Buffer.from(messageText, 'utf-8').toString('base64')
    const pythonCmd = `python -c "import sys, base64, asyncio; sys.path.insert(0, r'${path.join(MCP_CONFIG.agentKuliahDir, 'src')}'); from wa_dispatcher import send_whatsapp_message; msg = base64.b64decode(sys.argv[2]).decode('utf-8'); asyncio.run(send_whatsapp_message(sys.argv[1], msg))" "${phoneNumber}" "${base64Msg}"`

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const success = await new Promise<boolean>((resolve) => {
        exec(pythonCmd, { cwd: MCP_CONFIG.agentKuliahDir }, (error, stdout, stderr) => {
          const outStr = (stdout || '') + (stderr || '')
          if (
            outStr.includes('Failed to create a ProcessSingleton') ||
            outStr.includes('being used by another process')
          ) {
            Logger.warn(
              'WhatsAppService',
              `Profile in use by D:\\KULIAH\\AGENT (Attempt ${attempt}/${maxRetries}). Waiting before retry...`
            )
            resolve(false)
            return
          }

          if (error) {
            Logger.error('WhatsAppService', `Dispatch attempt ${attempt} failed: ${error.message}`)
            resolve(false)
          } else {
            Logger.success('WhatsAppService', `Notification dispatched cleanly to ${phoneNumber}`)
            resolve(true)
          }
        })
      })

      if (success) return true

      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 8000))
      }
    }

    return false
  }
}
