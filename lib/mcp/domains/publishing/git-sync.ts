import { execSync } from 'child_process'
import { Logger } from '../../core/logger'

export class GitSyncService {
  static syncToOrigin(articleCount: number): {
    success: boolean
    commitHash?: string
    message: string
  } {
    try {
      Logger.info('GitSync', 'Executing isolated Git commit and push to origin main...')

      // Set local config within repository
      execSync('git config user.name "Iman Logics Editorial Bot"', { stdio: 'pipe' })
      execSync('git config user.email "bot@imanlogics.web.id"', { stdio: 'pipe' })

      // Stage all newly created/modified blog files and editorial images
      execSync('git add data/blog/ public/static/images/editorial/ data/.cycle-history.json', {
        stdio: 'pipe',
      })

      // Check if there are staged changes
      const stagedChanges = execSync('git status --porcelain', { stdio: 'pipe' }).toString().trim()
      if (!stagedChanges) {
        Logger.info('GitSync', 'Working tree clean, no new files to commit.')
        const currentHash = execSync('git rev-parse --short HEAD', { stdio: 'pipe' })
          .toString()
          .trim()
        return {
          success: true,
          commitHash: currentHash,
          message: `ℹ️ State bersih / Sinkron dengan commit ${currentHash}`,
        }
      }

      const commitMsg = `feat(blog): autonomous publication of ${articleCount} trilingual articles [QC >= 85]`
      execSync(`git commit -m "${commitMsg}"`, { stdio: 'pipe' })

      const commitHash = execSync('git rev-parse --short HEAD', { stdio: 'pipe' }).toString().trim()

      // Fetch and rebase with remote to avoid reject collisions
      try {
        execSync('git pull --rebase origin main', { stdio: 'pipe' })
      } catch {
        Logger.warn('GitSync', 'Rebase skipped or branch is up to date.')
      }

      // Push to GitHub origin main
      execSync('git push origin main', { stdio: 'pipe' })

      Logger.success('GitSync', `Git Push completed successfully! (Commit: ${commitHash})`)
      return {
        success: true,
        commitHash,
        message: `Ter-push ke origin/main (Commit: ${commitHash})`,
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      Logger.error('GitSync', `Git sync failed: ${errorMsg}`)
      return { success: false, message: `❌ Gagal push ke GitHub: ${errorMsg}` }
    }
  }
}
