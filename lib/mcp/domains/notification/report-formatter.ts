import { NotificationPayload } from '../../core/types'
import { MCP_CONFIG } from '../../config/env'
import { StateStore } from '../../core/state-store'

export class ReportFormatter {
  static getLocalSystemTimeInfo() {
    const now = new Date()
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local'
    const offsetMinutes = -now.getTimezoneOffset()
    const offsetHours = offsetMinutes / 60
    const sign = offsetHours >= 0 ? '+' : ''
    const offsetStr = `UTC${sign}${offsetHours}`

    const formattedDate = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const formattedTime = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })

    return {
      now,
      timeZone,
      offsetStr,
      formattedDate,
      formattedTime,
    }
  }

  /**
   * Formats a comprehensive 12-hour aggregated report for WhatsApp dispatch (05:00 / 17:00)
   */
  static formatWhatsAppReport(payload: NotificationPayload): string {
    const tz = this.getLocalSystemTimeInfo()
    const statusEmoji =
      payload.status === 'SUCCESS' ? '🟢' : payload.status === 'NO_PUBLISHABLE_STORY' ? '🟡' : '🔴'

    // Pull last 12 hours of cycle history
    const recentCycles = StateStore.getReportsInTimeWindow(12)
    const totalCyclesRun = recentCycles.length || 1
    const allRejections: string[] = []
    recentCycles.forEach((c) => {
      if (c.rejectionReasons) allRejections.push(...c.rejectionReasons)
    })

    const lines: string[] = []

    lines.push(`*📊 [IMAN LOGICS — LAPORAN OTOMASI 12 JAM]*`)
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    lines.push(`📅 *Waktu Lokal PC:* ${tz.formattedDate}, ${tz.formattedTime}`)
    lines.push(`🌐 *Zona Waktu:* ${tz.timeZone} (${tz.offsetStr})`)
    lines.push(`⚙️ *Status Sistem:* ${statusEmoji} ${payload.status}`)
    lines.push(`🔄 *Siklus Riset 12 Jam:* ${totalCyclesRun} kali siklus (Interval 3 Jam)`)
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    lines.push(``)

    if (
      payload.status === 'SUCCESS' ||
      (payload.publishedStories && payload.publishedStories.length > 0)
    ) {
      lines.push(`📰 *ARTIKEL BARU DITERBITKAN:*`)
      lines.push(
        `Total ${payload.totalTrilingualArticles} versi artikel (ID, EN, AR) lolos QC ${payload.qcAverageScore}/100:`
      )
      lines.push(``)

      const stories = payload.publishedStories || []
      const techStories = stories.filter((s) => s.category === 'tech-ai')
      const islamicStories = stories.filter((s) => s.category === 'islamic-logic')

      if (techStories.length > 0) {
        lines.push(`💻 *Tech & AI Intelligence:*`)
        techStories.forEach((s, idx) => {
          lines.push(`*${idx + 1}. ${s.title}*`)
          lines.push(`  🇮🇩 ID: ${MCP_CONFIG.blogBaseUrl}/blog/${s.slug}`)
          lines.push(`  🇬🇧 EN: ${MCP_CONFIG.blogBaseUrl}/blog/${s.slug}.en`)
          lines.push(`  🇸🇦 AR: ${MCP_CONFIG.blogBaseUrl}/blog/${s.slug}.ar`)
          lines.push(``)
        })
      }

      if (islamicStories.length > 0) {
        lines.push(`📜 *Islamic Logic & Academic:*`)
        islamicStories.forEach((s, idx) => {
          lines.push(`*${idx + 1}. ${s.title}*`)
          lines.push(`  🇮🇩 ID: ${MCP_CONFIG.blogBaseUrl}/blog/${s.slug}`)
          lines.push(`  🇬🇧 EN: ${MCP_CONFIG.blogBaseUrl}/blog/${s.slug}.en`)
          lines.push(`  🇸🇦 AR: ${MCP_CONFIG.blogBaseUrl}/blog/${s.slug}.ar`)
          lines.push(``)
        })
      }

      lines.push(`🚀 *Status Git Sync:* ${payload.gitPushStatus}`)
    } else if (payload.status === 'NO_PUBLISHABLE_STORY') {
      lines.push(`ℹ️ *Status Konten 12 Jam:*`)
      lines.push(`- Riset otomatis web berjalan lancar setiap 3 jam.`)
      lines.push(
        `- Tidak ada kandidat yang memenuhi ambang batas kualitas (News Hook / Anti-Duplicate).`
      )
      lines.push(`🛡️ *Standar Mutu:* 0 artikel sampah/filler diterbitkan (Kualitas > Kuantitas).`)
    } else {
      lines.push(
        `⚠️ *Catatan Kendala:* ${payload.errorMessage || 'Terjadi peringatan pada alur otomasi'}`
      )
    }

    if (allRejections.length > 0) {
      lines.push(``)
      lines.push(`🔍 *Catatan Filter QC & Gatekeeper:*`)
      // Display unique top 3 rejection reasons
      const uniqueRejections = Array.from(new Set(allRejections)).slice(0, 3)
      uniqueRejections.forEach((rej, idx) => {
        lines.push(`  ${idx + 1}. ${rej}`)
      })
    }

    lines.push(``)
    lines.push(`⏰ *Siklus Laporan WA Berikutnya:* 05:00 / 17:00 WIB`)
    lines.push(`🌐 *Website Utama:* ${MCP_CONFIG.blogBaseUrl}`)
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    lines.push(`_Laporan otomatis ditenagai oleh ImanLogics MCP Server._`)

    return lines.join('\n')
  }
}
