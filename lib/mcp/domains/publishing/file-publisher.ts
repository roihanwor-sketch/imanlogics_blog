import fs from 'fs'
import path from 'path'
import { MCP_CONFIG } from '../../config/env'
import { MdxArticle } from '../../core/types'
import { Logger } from '../../core/logger'

export class FilePublisher {
  static writeArticle(article: MdxArticle): { success: boolean; filePath: string } {
    const blogDir = MCP_CONFIG.blogDataDir
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true })
    }

    const targetPath = path.join(blogDir, article.filename)
    try {
      fs.writeFileSync(targetPath, article.content, 'utf-8')
      Logger.success('FilePublisher', `Written MDX: ${article.filename}`)
      return { success: true, filePath: targetPath }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      Logger.error('FilePublisher', `Failed to write ${article.filename}: ${errorMsg}`)
      return { success: false, filePath: targetPath }
    }
  }

  static writeBatch(articles: MdxArticle[]): string[] {
    const published: string[] = []
    for (const art of articles) {
      const res = this.writeArticle(art)
      if (res.success) {
        published.push(`data/blog/${art.filename}`)
      }
    }
    return published
  }
}
