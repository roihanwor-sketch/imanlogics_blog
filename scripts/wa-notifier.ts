import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export interface PublishedStorySummary {
  title: string;
  slug: string;
  category: string;
  languages: string[];
}

export interface NotificationPayload {
  status: 'SUCCESS' | 'NO_PUBLISHABLE_STORY' | 'PARTIAL_SUCCESS' | 'WARNING' | 'ERROR';
  articlesPublished: string[];
  publishedStories?: PublishedStorySummary[];
  techArticlesCount: number;
  islamicArticlesCount: number;
  totalTrilingualArticles: number;
  qcAverageScore: number;
  gitPushStatus: string;
  nextCycleTime: string;
  errorMessage?: string;
}

const AGENT_KULIAH_DIR = 'D:\\KULIAH\\AGENT';
const WA_DISPATCHER_PATH = path.join(AGENT_KULIAH_DIR, 'src', 'wa_dispatcher.py');
const TARGET_PHONE_NUMBER = '6285335329341';
const BLOG_BASE_URL = 'https://blog.imanlogics.web.id';

/**
 * Detects active dynamic system timezone and formatted time
 */
export function getLocalSystemTimeInfo() {
  const now = new Date();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
  const offsetMinutes = -now.getTimezoneOffset();
  const offsetHours = offsetMinutes / 60;
  const sign = offsetHours >= 0 ? '+' : '';
  const offsetStr = `UTC${sign}${offsetHours}`;

  const formattedDate = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return {
    now,
    timeZone,
    offsetStr,
    formattedDate,
    formattedTime,
  };
}

/**
 * Formats WhatsApp notification report text with clean Markdown and direct online links
 */
export function formatWhatsAppReport(payload: NotificationPayload): string {
  const tz = getLocalSystemTimeInfo();
  const statusEmoji = payload.status === 'SUCCESS' ? '🟢' : (payload.status === 'NO_PUBLISHABLE_STORY' ? '🟡' : '🔴');

  const lines: string[] = [];

  lines.push(`*📊 [IMAN LOGICS BLOG — AUTONOMOUS REPORT]*`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`📅 *Waktu Lokal PC:* ${tz.formattedDate}, ${tz.formattedTime}`);
  lines.push(`🌐 *Zona Waktu:* ${tz.timeZone} (${tz.offsetStr})`);
  lines.push(`⚙️ *Status Sistem:* ${statusEmoji} ${payload.status}`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(``);

  if (payload.status === 'SUCCESS' || (payload.publishedStories && payload.publishedStories.length > 0)) {
    lines.push(`📰 *ARTIKEL BARU DITERBITKAN:*`);
    lines.push(`Total ${payload.totalTrilingualArticles} versi artikel (ID, EN, AR) lolos QC ${payload.qcAverageScore}/100:`);
    lines.push(``);

    const stories = payload.publishedStories || [];
    const techStories = stories.filter(s => s.category === 'tech-ai');
    const islamicStories = stories.filter(s => s.category === 'islamic-logic');

    if (techStories.length > 0) {
      lines.push(`💻 *Tech & AI Intelligence:*`);
      techStories.forEach((s, idx) => {
        lines.push(`*${idx + 1}. ${s.title}*`);
        lines.push(`  🇮🇩 ID: ${BLOG_BASE_URL}/blog/${s.slug}`);
        lines.push(`  🇬🇧 EN: ${BLOG_BASE_URL}/blog/${s.slug}.en`);
        lines.push(`  🇸🇦 AR: ${BLOG_BASE_URL}/blog/${s.slug}.ar`);
        lines.push(``);
      });
    }

    if (islamicStories.length > 0) {
      lines.push(`📜 *Islamic Logic & Academic:*`);
      islamicStories.forEach((s, idx) => {
        lines.push(`*${idx + 1}. ${s.title}*`);
        lines.push(`  🇮🇩 ID: ${BLOG_BASE_URL}/blog/${s.slug}`);
        lines.push(`  🇬🇧 EN: ${BLOG_BASE_URL}/blog/${s.slug}.en`);
        lines.push(`  🇸🇦 AR: ${BLOG_BASE_URL}/blog/${s.slug}.ar`);
        lines.push(``);
      });
    }

    lines.push(`🚀 *Status Git Sync:* ${payload.gitPushStatus}`);
  } else if (payload.status === 'NO_PUBLISHABLE_STORY') {
    lines.push(`ℹ️ *Status Konten:* Tidak ada berita baru yang memenuhi kriteria news hook / lolos anti-duplicate pada siklus ini.`);
    lines.push(`🛡️ *Standar Mutu:* 0 artikel sampah/filler diterbitkan.`);
  } else {
    lines.push(`⚠️ *Catatan Kendala:* ${payload.errorMessage || 'Terjadi peringatan pada alur otomasi'}`);
  }

  lines.push(``);
  lines.push(`⏰ *Siklus Otomasi Berikutnya:* ${payload.nextCycleTime}`);
  lines.push(`🌐 *Website Utama:* ${BLOG_BASE_URL}`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`_Laporan otomatis ditenagai oleh Antigravity Autonomous Engine._`);

  return lines.join('\n');
}

/**
 * Dispatches WhatsApp notification via existing D:\KULIAH\AGENT integration using Base64 transport
 */
export async function sendWhatsAppNotification(
  payload: NotificationPayload,
  phoneNumber = TARGET_PHONE_NUMBER
): Promise<boolean> {
  const messageText = formatWhatsAppReport(payload);
  console.log(`\n📱 [WhatsApp Dispatcher] Preparing notification for ${phoneNumber}...`);
  console.log(`---------------------------------------------------------------`);
  console.log(messageText);
  console.log(`---------------------------------------------------------------\n`);

  if (!fs.existsSync(WA_DISPATCHER_PATH)) {
    console.warn(`⚠️ [WhatsApp Dispatcher] D:\\KULIAH\\AGENT\\src\\wa_dispatcher.py not found at path: ${WA_DISPATCHER_PATH}`);
    return false;
  }

  // Use Base64 encoding to preserve exact newlines, formatting, bolding, and emojis without escaping issues
  const base64Msg = Buffer.from(messageText, 'utf-8').toString('base64');
  const pythonCmd = `python -c "import sys, base64, asyncio; sys.path.insert(0, r'${path.join(AGENT_KULIAH_DIR, 'src')}'); from wa_dispatcher import send_whatsapp_message; msg = base64.b64decode(sys.argv[2]).decode('utf-8'); asyncio.run(send_whatsapp_message(sys.argv[1], msg))" "${phoneNumber}" "${base64Msg}"`;

  return new Promise((resolve) => {
    exec(pythonCmd, { cwd: AGENT_KULIAH_DIR }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ [WhatsApp Error] Failed to dispatch via D:\\KULIAH\\AGENT:`, error.message);
        if (stderr) console.error(stderr);
        resolve(false);
      } else {
        console.log(`✅ [WhatsApp Success] Notification dispatched cleanly to ${phoneNumber}`);
        if (stdout) console.log(stdout.trim());
        resolve(true);
      }
    });
  });
}
