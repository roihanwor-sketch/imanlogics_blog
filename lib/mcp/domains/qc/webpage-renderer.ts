import fs from 'fs'
import path from 'path'
import { MdxArticle } from '../../core/types'
import { MCP_CONFIG } from '../../config/env'

export class WebpageRenderer {
  static renderToHtml(article: MdxArticle): string {
    const fm = article.frontmatter
    const title = fm.title || 'Untitled Article'
    const summary = fm.summary || ''
    const category = fm.category || 'tech-ai'
    const language = fm.language || article.language || 'id'
    const date = fm.date || new Date().toISOString()
    const sources = fm.sources || []
    const imageCredits = fm.imageCredits || []

    const bodyHtml = article.content
      .replace(/^---[\s\S]*?---\s*/, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/^### (.*$)/gim, '<h3 class="editorial-h3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="editorial-h2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="editorial-h1">$1</h1>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(
        /!\[(.*?)\]\((.*?)\)/gim,
        '<figure class="article-figure"><img src="$2" alt="$1" style="max-width:100%; height:auto;" /><figcaption>$1</figcaption></figure>'
      )
      .replace(
        /\[(.*?)\]\((.*?)\)/gim,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .split(/\n\n+/)
      .map((p) => {
        const trimmed = p.trim()
        if (
          trimmed.startsWith('<h') ||
          trimmed.startsWith('<figure') ||
          trimmed.startsWith('<blockquote>') ||
          trimmed.startsWith('<li>')
        ) {
          return trimmed
        }
        return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`
      })
      .join('\n')

    return `<!DOCTYPE html>
<html lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title} | ImanLogics Editorial Proof</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.7; color: #1e293b; background: #f8fafc; padding: 2rem; max-width: 900px; margin: 0 auto; }
    header { border-bottom: 2px solid #e2e8f0; padding-bottom: 1.5rem; margin-bottom: 2rem; }
    h1 { font-size: 2.2rem; line-height: 1.25; color: #0f172a; margin-bottom: 0.5rem; }
    .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; background: #e0e7ff; color: #3730a3; margin-right: 0.5rem; }
    .meta { font-size: 0.9rem; color: #64748b; margin-top: 0.5rem; }
    .summary-box { background: #f1f5f9; border-left: 4px solid #3b82f6; padding: 1rem 1.25rem; font-size: 1.1rem; color: #334155; margin: 1.5rem 0; }
    .article-figure { margin: 2rem 0; text-align: center; }
    .article-figure img { border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    figcaption { font-size: 0.85rem; color: #64748b; margin-top: 0.5rem; font-style: italic; }
    .sources-box, .credits-box { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem 1.25rem; margin-top: 2rem; }
  </style>
</head>
<body>
  <header>
    <div>
      <span class="badge">${category.toUpperCase()}</span>
      <span class="badge">LANG: ${language.toUpperCase()}</span>
      <span class="badge">${article.frontmatter.articleType || 'Article'}</span>
    </div>
    <h1>${title}</h1>
    <div class="meta">
      Published: <strong>${date}</strong> | Filename: <code>${article.filename}</code> | Group: <code>${fm.translation_group || 'none'}</code>
    </div>
  </header>

  <div class="summary-box">
    <strong>Executive Summary:</strong> ${summary}
  </div>

  <main class="article-body">
    ${bodyHtml}
  </main>

  <section class="sources-box">
    <h4>Verified Primary & Secondary Sources</h4>
    <ul>
      ${sources.map((s) => `<li><strong><a href="${s.url}">${s.name}</a></strong> (Tier ${s.tier}${'type' in s && s.type ? ` - ${s.type}` : ''})</li>`).join('\n')}
    </ul>
  </section>

  <section class="credits-box">
    <h4>Visual Assets & Provenance Records</h4>
    <ul>
      ${imageCredits.map((c) => `<li><strong>${c.localPath}</strong>: ${c.attributionText} (License: ${c.license}) - Source: ${c.url}</li>`).join('\n')}
    </ul>
  </section>
</body>
</html>`
  }

  static saveTemporaryPreview(article: MdxArticle): string {
    const previewDir = path.join(MCP_CONFIG.blogRootDir, '.temp_editorial_previews')
    if (!fs.existsSync(previewDir)) {
      fs.mkdirSync(previewDir, { recursive: true })
    }

    const cleanFilename = article.filename.replace(/\.mdx$/, '.html')
    const targetPath = path.join(previewDir, cleanFilename)
    const html = this.renderToHtml(article)
    fs.writeFileSync(targetPath, html, 'utf8')
    return targetPath
  }
}
