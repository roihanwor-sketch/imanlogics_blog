import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export interface NotificationPayload {
  status: 'SUCCESS' | 'NO_PUBLISHABLE_STORY' | 'PARTIAL_SUCCESS' | 'WARNING' | 'ERROR';
  articlesPublished: string[];
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
 * Formats WhatsApp notification report text
 */
export function formatWhatsAppReport(payload: NotificationPayload): string {
  const tz = getLocalSystemTimeInfo();
  const statusEmoji = payload.status === 'SUCCESS' ? '🟢' : (payload.status === 'NO_PUBLISHABLE_STORY' ? '🟡' : '🔴');

  let report = `*📊 [IMAN LOGICS BLOG — AUTONOMOUS EDITORIAL REPORT]*\n`;
  report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  report += `📅 *Waktu Lokal PC:* ${tz.formattedDate}, ${tz.formattedTime} (${tz.timeZone} / ${tz.offsetStr})\n`;
  report += `⚙️ *Status Sistem:* ${statusEmoji} ${payload.status}\n`;
  report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (payload.status === 'SUCCESS') {
    report += `📰 *Publikasi Konten Baru:* Terbit ${payload.totalTrilingualArticles} artikel (ID, EN, AR)\n`;
    report += `  ├ 💻 Tech & AI News: ${payload.techArticlesCount} topik\n`;
    report += `  └ 📜 Islamic Logic & History: ${payload.islamicArticlesCount} topik\n`;
    report += `📊 *Rata-rata Skor QC:* ${payload.qcAverageScore}/100 (PASSED)\n`;
    report += `🚀 *Git Sync GitHub:* ${payload.gitPushStatus}\n`;
  } else if (payload.status === 'NO_PUBLISHABLE_STORY') {
    report += `ℹ️ *Laporan Editorial:* Tidak ada berita baru yang memenuhi standar news hook / lolos anti-duplicate pada siklus ini. Sistem tidak membuat artikel filler.\n`;
    report += `🛡️ *Standar Mutu:* Terjaga (0 artikel sampah diterbitkan).\n`;
  } else {
    report += `⚠️ *Catatan Gangguan:* ${payload.errorMessage || 'Terdeteksi peringatan pada pipeline'}\n`;
  }

  report += `\n⏰ *Siklus Otomasi Berikutnya:* ${payload.nextCycleTime}\n`;
  report += `🌐 *Live Blog:* https://blog.imanlogics.web.id\n`;
  report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  report += `_Laporan otomatis ditenagai oleh Antigravity Editorial Agent._`;

  return report;
}

/**
 * Dispatches WhatsApp notification via existing D:\KULIAH\AGENT integration
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

  // Construct Python script invocation that imports and runs send_whatsapp_message from D:\KULIAH\AGENT
  const pythonCmd = `python -c "import sys, asyncio; sys.path.insert(0, r'${path.join(AGENT_KULIAH_DIR, 'src')}'); from wa_dispatcher import send_whatsapp_message; asyncio.run(send_whatsapp_message(sys.argv[1], sys.argv[2]))" "${phoneNumber}" "${messageText.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;

  return new Promise((resolve) => {
    exec(pythonCmd, { cwd: AGENT_KULIAH_DIR }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ [WhatsApp Error] Failed to dispatch via D:\\KULIAH\\AGENT:`, error.message);
        if (stderr) console.error(stderr);
        resolve(false);
      } else {
        console.log(`✅ [WhatsApp Success] Notification dispatched to ${phoneNumber}`);
        if (stdout) console.log(stdout.trim());
        resolve(true);
      }
    });
  });
}
