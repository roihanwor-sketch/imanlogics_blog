import fs from 'fs';
import path from 'path';
import { runAutonomousEditorialPipeline } from './auto-publisher-cron';
import { sendWhatsAppNotification, NotificationPayload, getLocalSystemTimeInfo } from './wa-notifier';

const LOCK_FILE = path.join(process.cwd(), 'data', '.scheduler.lock');

/**
 * Calculates milliseconds until the next 05:00 or 17:00 in current local system clock
 */
export function getNextScheduleSlot(): { nextTargetDate: Date; delayMs: number; targetLabel: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  const slotMorning = new Date(year, month, date, 5, 0, 0, 0); // 05:00 today
  const slotEvening = new Date(year, month, date, 17, 0, 0, 0); // 17:00 today
  const slotTomorrowMorning = new Date(year, month, date + 1, 5, 0, 0, 0); // 05:00 tomorrow

  let nextTarget: Date;
  let targetLabel: string;

  if (now.getTime() < slotMorning.getTime()) {
    nextTarget = slotMorning;
    targetLabel = '05:00 (Pagi Ini)';
  } else if (now.getTime() < slotEvening.getTime()) {
    nextTarget = slotEvening;
    targetLabel = '17:00 (Sore Ini)';
  } else {
    nextTarget = slotTomorrowMorning;
    targetLabel = '05:00 (Besok Pagi)';
  }

  const delayMs = nextTarget.getTime() - now.getTime();
  return { nextTargetDate: nextTarget, delayMs, targetLabel };
}

/**
 * Ensures singleton execution (no duplicate scheduler daemons)
 */
function acquireLock(): boolean {
  if (fs.existsSync(LOCK_FILE)) {
    try {
      const lockData = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf-8'));
      // Check if process is still alive on Windows
      try {
        process.kill(lockData.pid, 0);
        console.log(`ℹ️ [Scheduler Daemon] Another instance is already running (PID: ${lockData.pid}, Started: ${lockData.startedAt}). Exiting to prevent duplication.`);
        return false;
      } catch {
        // Stale lock file
        console.log(`🧹 [Scheduler Daemon] Removing stale lock file from PID ${lockData.pid}.`);
      }
    } catch {
      // Invalid lock file
    }
  }

  const lockContent = {
    pid: process.pid,
    startedAt: new Date().toISOString(),
  };
  fs.writeFileSync(LOCK_FILE, JSON.stringify(lockContent, null, 2), 'utf-8');
  return true;
}

function releaseLock() {
  if (fs.existsSync(LOCK_FILE)) {
    try {
      fs.unlinkSync(LOCK_FILE);
    } catch {}
  }
}

/**
 * Main Scheduler Loop
 */
export async function startSchedulerDaemon(runImmediately = true) {
  console.log(`\n===============================================================`);
  console.log(`⏰ [Autonomous Scheduler Daemon] Initializing...`);
  console.log(`===============================================================`);

  if (!acquireLock()) {
    return;
  }

  process.on('SIGINT', () => {
    console.log('\n🛑 [Scheduler Daemon] Shutting down gracefully...');
    releaseLock();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    releaseLock();
    process.exit(0);
  });

  const tz = getLocalSystemTimeInfo();
  console.log(`🕒 System Clock: ${tz.formattedDate}, ${tz.formattedTime} (${tz.timeZone} / ${tz.offsetStr})`);
  console.log(`📅 Target Schedule Slots: Daily at 05:00 & 17:00 (Dynamic Local Time)`);

  const executeCycle = async () => {
    const nextSlot = getNextScheduleSlot();
    const nextTimeStr = `${nextSlot.targetLabel} — ${nextSlot.nextTargetDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;

    try {
      console.log(`\n🚀 [Scheduler Daemon] Executing Autonomous Editorial Pipeline...`);
      const report = await runAutonomousEditorialPipeline({ gitPush: true });

      const payload: NotificationPayload = {
        status: report.status,
        articlesPublished: report.articlesPublished,
        publishedStories: report.publishedStoryDetails,
        techArticlesCount: report.publishedStoryDetails.filter(s => s.category === 'tech-ai').length,
        islamicArticlesCount: report.publishedStoryDetails.filter(s => s.category === 'islamic-logic').length,
        totalTrilingualArticles: report.articlesPublished.length,
        qcAverageScore: 100,
        gitPushStatus: report.status === 'SUCCESS' ? '✅ Ter-push ke branch main' : 'ℹ️ Tidak ada commit baru',
        nextCycleTime: nextTimeStr,
      };

      // Send WhatsApp Notification via D:\KULIAH\AGENT integration
      await sendWhatsAppNotification(payload);

    } catch (err: any) {
      console.error(`❌ [Scheduler Error] Pipeline encountered an exception:`, err.message);
      const errorPayload: NotificationPayload = {
        status: 'ERROR',
        articlesPublished: [],
        techArticlesCount: 0,
        islamicArticlesCount: 0,
        totalTrilingualArticles: 0,
        qcAverageScore: 0,
        gitPushStatus: '❌ Gagal',
        nextCycleTime: nextTimeStr,
        errorMessage: err.message,
      };
      await sendWhatsAppNotification(errorPayload);
    }

    // Schedule next run
    const updatedSlot = getNextScheduleSlot();
    const hours = (updatedSlot.delayMs / (1000 * 60 * 60)).toFixed(2);
    console.log(`\n⏳ [Scheduler Daemon] Next cycle scheduled in ${hours} hours at ${updatedSlot.targetLabel}. Waiting...`);

    setTimeout(async () => {
      await executeCycle();
    }, updatedSlot.delayMs);
  };

  if (runImmediately) {
    await executeCycle();
  } else {
    const slot = getNextScheduleSlot();
    console.log(`⏳ Waiting for next schedule slot at ${slot.targetLabel}...`);
    setTimeout(async () => {
      await executeCycle();
    }, slot.delayMs);
  }
}

if (require.main === module) {
  startSchedulerDaemon(true).catch(console.error);
}
