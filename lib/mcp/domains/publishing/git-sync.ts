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

      // Set local config within repository instead of global
      execSync('git config user.name "Iman Logics Editorial Bot"')
      execSync('git config user.email "bot@imanlogics.web.id"')

      execSync('git add data/blog/*.mdx public/static/images/editorial/*')

      const commitMsg = `feat(blog): autonomous publication of ${articleCount} trilingual articles [QC >= 85]`
      execSync(`git commit -m "${commitMsg}"`)

      const commitHash = execSync('git rev-parse --short HEAD').toString().trim()
      execSync('git push origin main')

      Logger.success('GitSync', `Git Push completed successfully! (Commit: ${commitHash})`)
      return {
        success: true,
        commitHash,
        message: `Ter-push ke origin/main (Commit: ${commitHash})`,
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      Logger.warn('GitSync', `Git sync skipped or clean state: ${errorMsg}`)
      return { success: false, message: 'ℹ️ Tidak ada commit baru atau push dilewati' }
    }
  }
}
