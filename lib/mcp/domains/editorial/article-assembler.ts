import { MdxArticle, SourceCitation, ImageCreditRecord } from '../../core/types'
import { MCP_CONFIG } from '../../config/env'
import path from 'path'

export interface RawArticleInput {
  slug: string
  title: string
  summary: string
  content: string
  language: 'id' | 'en' | 'ar'
  translation_group: string
  category: 'tech-ai' | 'islamic-logic'
  keywords?: string[]
  images?: string[]
  sources?: SourceCitation[]
  imageCredits?: ImageCreditRecord[]
  date?: string
  authors?: string[]
  articleType?: string
}

export class ArticleAssembler {
  static assembleMdx(input: RawArticleInput): MdxArticle {
    const today = input.date || new Date().toISOString().split('T')[0]
    const filename =
      input.language === 'id' ? `${input.slug}.mdx` : `${input.slug}.${input.language}.mdx`
    const filepath = path.join(MCP_CONFIG.blogDataDir, filename)

    const frontmatterObj = {
      title: input.title,
      date: today,
      tags: input.keywords && input.keywords.length > 0 ? input.keywords : [input.category],
      draft: false,
      summary: input.summary,
      images: input.images || [],
      authors: input.authors || ['default'],
      language: input.language,
      translation_group: input.translation_group,
      original_language: 'id' as const,
      articleType: input.articleType || (input.category === 'tech-ai' ? 'Analysis' : 'Essay'),
      category: input.category,
      sources: input.sources || [],
      imageCredits: input.imageCredits || [],
    }

    const frontmatterYaml = [
      '---',
      `title: ${JSON.stringify(frontmatterObj.title)}`,
      `date: '${frontmatterObj.date}'`,
      `tags: ${JSON.stringify(frontmatterObj.tags)}`,
      `draft: false`,
      `summary: ${JSON.stringify(frontmatterObj.summary)}`,
      `images: ${JSON.stringify(frontmatterObj.images)}`,
      `authors: ${JSON.stringify(frontmatterObj.authors)}`,
      `language: '${frontmatterObj.language}'`,
      `translation_group: '${frontmatterObj.translation_group}'`,
      `original_language: 'id'`,
      `articleType: '${frontmatterObj.articleType}'`,
      `category: '${frontmatterObj.category}'`,
      `sources: ${JSON.stringify(frontmatterObj.sources)}`,
      `imageCredits: ${JSON.stringify(frontmatterObj.imageCredits)}`,
      '---',
      '',
    ].join('\n')

    const cleanBody = input.content.replace(/^---[\s\S]*?---\s*/, '').trim()
    const fullContent = `${frontmatterYaml}${cleanBody}\n`

    return {
      filename,
      filepath,
      language: input.language,
      frontmatter: frontmatterObj,
      content: fullContent,
    }
  }
}
