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
<html lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}" class="dark">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title} | Iman Logics Blog</title>
  <style>
    :root {
      --bg-color: #0B0F19;
      --card-bg: rgba(255, 255, 255, 0.03);
      --text-main: #F1F5F9;
      --text-muted: #94A3B8;
      --border-color: rgba(255, 255, 255, 0.08);
      --accent-cyan: #22D3EE;
      --accent-emerald: #10B981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.8; color: var(--text-main); background: var(--bg-color); }
    .navbar { position: sticky; top: 0; z-index: 50; width: 100%; border-bottom: 1px solid var(--border-color); background: rgba(11, 15, 25, 0.75); backdrop-filter: blur(20px); padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; }
    .nav-brand { font-size: 1.25rem; font-weight: bold; color: #fff; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; }
    .nav-brand span { color: var(--accent-cyan); }
    .nav-links { display: flex; gap: 1.5rem; list-style: none; font-size: 0.9rem; }
    .nav-links a { color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
    .nav-links a:hover { color: var(--accent-cyan); }
    .container { max-width: 860px; margin: 0 auto; padding: 3rem 1.5rem; }
    .article-header { border-bottom: 1px solid var(--border-color); padding-bottom: 2rem; margin-bottom: 2.5rem; text-align: center; }
    .badge-bar { display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 1.25rem; }
    .badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(34, 211, 238, 0.1); color: var(--accent-cyan); border: 1px solid rgba(34, 211, 238, 0.2); }
    h1 { font-size: 2.25rem; line-height: 1.3; color: #FFFFFF; margin-bottom: 1rem; font-weight: 800; letter-spacing: -0.02em; }
    .meta-bar { font-size: 0.85rem; color: var(--text-muted); display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
    .summary-card { background: var(--card-bg); border: 1px solid var(--border-color); border-left: 4px solid var(--accent-cyan); border-radius: 8px; padding: 1.25rem 1.5rem; font-size: 1.1rem; color: #E2E8F0; margin-bottom: 2.5rem; line-height: 1.6; }
    .article-body { font-size: 1.05rem; }
    .article-body p { margin-bottom: 1.75rem; }
    .article-body h2 { font-size: 1.6rem; color: #FFFFFF; margin-top: 2.5rem; margin-bottom: 1rem; font-weight: 700; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; }
    .article-body h3 { font-size: 1.3rem; color: #E2E8F0; margin-top: 2rem; margin-bottom: 0.75rem; font-weight: 600; }
    .article-figure { margin: 2.5rem 0; text-align: center; }
    .article-figure img { max-width: 100%; height: auto; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); }
    figcaption { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.75rem; font-style: italic; }
    blockquote { border-left: 3px solid var(--accent-emerald); padding-left: 1.25rem; margin: 1.5rem 0; color: #CBD5E1; font-style: italic; }
    ul, ol { margin-left: 1.5rem; margin-bottom: 1.75rem; color: #CBD5E1; }
    li { margin-bottom: 0.5rem; }
    a { color: var(--accent-cyan); text-decoration: none; }
    a:hover { text-decoration: underline; }
    hr { border: 0; height: 1px; background: var(--border-color); margin: 3rem 0; }
    .sources-panel, .credits-panel { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; margin-top: 2rem; }
    .sources-panel h4, .credits-panel h4 { font-size: 1rem; color: #FFFFFF; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .footer { border-top: 1px solid var(--border-color); padding: 3rem 1.5rem; text-align: center; font-size: 0.85rem; color: var(--text-muted); margin-top: 4rem; }
  </style>
</head>
<body>
  <nav class="navbar">
    <a href="https://imanlogics.web.id" class="nav-brand">Iman <span>Logics</span></a>
    <ul class="nav-links">
      <li><a href="https://imanlogics.web.id/#beranda">Beranda</a></li>
      <li><a href="https://imanlogics.web.id/portfolio/">Portofolio</a></li>
      <li><a href="https://blog.imanlogics.web.id">Blog</a></li>
      <li><a href="https://imanlogics.web.id/products/">Produk</a></li>
    </ul>
  </nav>

  <div class="container">
    <header class="article-header">
      <div class="badge-bar">
        <span class="badge">${category}</span>
        <span class="badge">Bahasa: ${language.toUpperCase()}</span>
        <span class="badge">${article.frontmatter.articleType || 'Analysis'}</span>
      </div>
      <h1>${title}</h1>
      <div class="meta-bar">
        <span>🗓️ Terbit: ${date.split('T')[0]}</span>
        <span>✍️ Redaksi: ${article.frontmatter.authors ? article.frontmatter.authors.join(', ') : 'Iman Logics'}</span>
        <span>📁 File: <code>${article.filename}</code></span>
      </div>
    </header>

    <div class="summary-card">
      <strong>Intisari Editorial:</strong> ${summary}
    </div>

    <main class="article-body">
      ${bodyHtml}
    </main>

    <section class="sources-panel">
      <h4>Rantai Sumber Otoritatif (Dual-Tier Verification)</h4>
      <ul>
        ${sources.map((s) => `<li><strong><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name}</a></strong> — <em>Tier ${s.tier}${'type' in s && s.type ? ` (${s.type})` : ''}</em></li>`).join('\n')}
      </ul>
    </section>

    <section class="credits-panel">
      <h4>Atribusi Hak Cipta & Lisensi Aset Visual</h4>
      <ul>
        ${imageCredits.map((c) => `<li><code>${c.localPath}</code>: ${c.attributionText} — <em>Lisensi: ${c.license}</em></li>`).join('\n')}
      </ul>
    </section>
  </div>

  <footer class="footer">
    <p>© 2026 Iman Logics. Hak Cipta Dilindungi Undang-Undang.</p>
    <p style="margin-top: 0.5rem; font-size: 0.75rem;">ImanLogics Autonomous Editorial Proof Renderer • 15 Hard Gates Compliant</p>
  </footer>
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
