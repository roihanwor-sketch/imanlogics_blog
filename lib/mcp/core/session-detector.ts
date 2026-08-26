import { execSync } from 'child_process'
import { Logger } from './logger'

export type AntigravityExecutionMode = 'LIVE_SESSION' | 'HEADLESS_CLI'

export class AntigravitySessionDetector {
  /**
   * Mendeteksi apakah jendela/proses aplikasi Antigravity IDE saat ini sedang terbuka dan aktif di Windows
   */
  static isWindowActive(): boolean {
    try {
      // Periksa keberadaan proses Antigravity di sistem operasi Windows
      const cmd =
        'powershell.exe -NoProfile -NonInteractive -Command "Get-Process Antigravity -ErrorAction SilentlyContinue | Measure-Object | Select-Object -ExpandProperty Count"'
      const output = execSync(cmd, { stdio: 'pipe', timeout: 5000 }).toString().trim()
      const count = parseInt(output, 10)
      return !isNaN(count) && count > 0
    } catch {
      return false
    }
  }

  /**
   * Menentukan mode eksekusi secara dinamis:
   * - LIVE_SESSION (Mode 1): Jika jendela Antigravity IDE terbuka
   * - HEADLESS_CLI (Mode 2): Jika jendela Antigravity IDE ditutup
   */
  static getDynamicExecutionMode(): {
    mode: AntigravityExecutionMode
    details: string
  } {
    const isLive = this.isWindowActive()
    if (isLive) {
      Logger.info(
        'SessionDetector',
        '🟢 Jendela Antigravity IDE terdeteksi AKTIF & TERBUKA -> Mengaktifkan MODE 1 (Live Session)'
      )
      return {
        mode: 'LIVE_SESSION',
        details: 'Antigravity IDE Window is active. Mode 1 (Live Session) prioritized.',
      }
    } else {
      Logger.info(
        'SessionDetector',
        '🟡 Jendela Antigravity IDE terdeteksi TERTUTUP -> Mengalihkan otomatis ke MODE 2 (Headless Agy CLI Bridge)'
      )
      return {
        mode: 'HEADLESS_CLI',
        details: 'Antigravity IDE Window is closed. Mode 2 (Agy CLI Bridge) activated.',
      }
    }
  }
}
