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
  /**
   * Generates a precise ISO timestamp in Western Indonesia Time (WIB / UTC+7)
   */
  static getLocalWibTimestamp(date = new Date()): string {
    const pad = (n: number) => String(n).padStart(2, '0')
    const localWib = new Date(date.getTime() + (7 * 60 + date.getTimezoneOffset()) * 60000)
    const yyyy = localWib.getFullYear()
    const mm = pad(localWib.getMonth() + 1)
    const dd = pad(localWib.getDate())
    const hh = pad(localWib.getHours())
    const min = pad(localWib.getMinutes())
    const ss = pad(localWib.getSeconds())
    return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}+07:00`
  }

  /**
   * Resolves specialized editorial author persona based on article category
   */
  static resolveDefaultAuthor(
    category: 'tech-ai' | 'islamic-logic',
    explicitAuthors?: string[]
  ): string[] {
    if (explicitAuthors && explicitAuthors.length > 0) return explicitAuthors
    if (category === 'tech-ai') return ['rian-setiawan']
    if (category === 'islamic-logic') return ['fauzan-hakim']
    return ['default']
  }

  static assembleMdx(input: RawArticleInput): MdxArticle {
    const today = input.date || this.getLocalWibTimestamp()
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
      authors: this.resolveDefaultAuthor(input.category, input.authors),
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
