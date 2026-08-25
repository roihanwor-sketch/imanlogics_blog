import { ReportFormatter } from '../lib/mcp/domains/notification/report-formatter'
import { WhatsAppService } from '../lib/mcp/domains/notification/wa-service'
import { NotificationPayload } from '../lib/mcp/core/types'

export type { NotificationPayload }

export interface PublishedStorySummary {
  title: string
  slug: string
  category: string
  languages: string[]
}

export const getLocalSystemTimeInfo = ReportFormatter.getLocalSystemTimeInfo.bind(ReportFormatter)
export const formatWhatsAppReport = ReportFormatter.formatWhatsAppReport.bind(ReportFormatter)
export const sendWhatsAppNotification = WhatsAppService.sendNotification.bind(WhatsAppService)
