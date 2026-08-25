import fs from 'fs'
import path from 'path'
import { getFreshTechNewsCandidates } from './tech-researcher'
import { getFreshIslamicAcademicCandidates } from './islamic-logic-researcher'
import { buildTechMdxArticles, buildIslamicAcademicMdxArticles } from './article-builder-qc'

async function main() {
  console.log('Writing updated production MDX files...')
  const blogDir = path.join(process.cwd(), 'data', 'blog')
  if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true })

  const techCandidates = getFreshTechNewsCandidates('2026-08-25')
  for (const story of techCandidates) {
    const { articles, qcResults } = await buildTechMdxArticles(story)
    for (const art of articles) {
      fs.writeFileSync(art.filepath, art.content, 'utf-8')
      console.log(`  💾 [Tech] Saved ${art.filename} [QC: ${qcResults[art.language].score}/100]`)
    }
  }

  const islamicCandidates = getFreshIslamicAcademicCandidates('2026-08-25')
  for (const story of islamicCandidates) {
    const { articles, qcResults } = await buildIslamicAcademicMdxArticles(story)
    for (const art of articles) {
      fs.writeFileSync(art.filepath, art.content, 'utf-8')
      console.log(`  💾 [Islamic] Saved ${art.filename} [QC: ${qcResults[art.language].score}/100]`)
    }
  }

  console.log('\n✅ All production MDX files generated successfully.')
}

main().catch((err) => {
  console.error('Generation Error:', err)
  process.exit(1)
})
