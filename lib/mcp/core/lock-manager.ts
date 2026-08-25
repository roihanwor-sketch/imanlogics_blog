import fs from 'fs'
import { MCP_CONFIG } from '../config/env'
import { Logger } from './logger'

export interface LockMetadata {
  pid: number
  startedAt: string
  lastHeartbeat: string
}

export class LockManager {
  private static lockFile = MCP_CONFIG.lockFilePath

  /**
   * Attempts to acquire singleton execution lock.
   * If existing lock PID is dead or timed out (>12h stale), lock is safely cleared.
   */
  static acquire(): boolean {
    if (fs.existsSync(this.lockFile)) {
      try {
        const raw = fs.readFileSync(this.lockFile, 'utf-8')
        const data: LockMetadata = JSON.parse(raw)

        const isAlive = this.checkProcessAlive(data.pid)
        const isStale =
          new Date().getTime() - new Date(data.lastHeartbeat || data.startedAt).getTime() >
          12 * 60 * 60 * 1000

        if (isAlive && !isStale) {
          Logger.warn(
            'LockManager',
            `Another active process is holding lock (PID: ${data.pid}, Started: ${data.startedAt}).`
          )
          return false
        } else {
          Logger.info(
            'LockManager',
            `Removing stale or dead lock file from PID ${data.pid} (Stale: ${isStale}).`
          )
          this.release()
        }
      } catch {
        this.release()
      }
    }

    const payload: LockMetadata = {
      pid: process.pid,
      startedAt: new Date().toISOString(),
      lastHeartbeat: new Date().toISOString(),
    }

    try {
      fs.writeFileSync(this.lockFile, JSON.stringify(payload, null, 2), 'utf-8')
      return true
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      Logger.error('LockManager', `Failed to write lock file: ${errorMsg}`)
      return false
    }
  }

  static heartbeat() {
    if (fs.existsSync(this.lockFile)) {
      try {
        const raw = fs.readFileSync(this.lockFile, 'utf-8')
        const data: LockMetadata = JSON.parse(raw)
        if (data.pid === process.pid) {
          data.lastHeartbeat = new Date().toISOString()
          fs.writeFileSync(this.lockFile, JSON.stringify(data, null, 2), 'utf-8')
        }
      } catch {
        // Ignored
      }
    }
  }

  static release() {
    if (fs.existsSync(this.lockFile)) {
      try {
        fs.unlinkSync(this.lockFile)
      } catch {
        // Ignored
      }
    }
  }

  static isLocked(): boolean {
    if (!fs.existsSync(this.lockFile)) return false
    try {
      const raw = fs.readFileSync(this.lockFile, 'utf-8')
      const data: LockMetadata = JSON.parse(raw)
      return this.checkProcessAlive(data.pid)
    } catch {
      return false
    }
  }

  private static checkProcessAlive(pid: number): boolean {
    try {
      process.kill(pid, 0)
      return true
    } catch (e: unknown) {
      return (e as { code?: string })?.code === 'EPERM'
    }
  }
}
