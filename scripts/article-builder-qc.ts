import { TechArticleBuilder } from '../lib/mcp/domains/editorial/tech-builder'
import { IslamicArticleBuilder } from '../lib/mcp/domains/editorial/islamic-builder'
import { EditorialQCEngine } from '../lib/mcp/domains/qc/qc-engine'
import { ProseCleaner } from '../lib/mcp/domains/editorial/prose-cleaner'
import { SourceVerifier } from '../lib/mcp/domains/research/source-verifier'
import {
  BANNED_ARABIC_LEAK_PATTERNS,
  BANNED_ENGLISH_LEAK_PATTERNS,
  BANNED_INDONESIAN_LEAK_PATTERNS,
} from '../lib/mcp/domains/qc/leak-detector'
import { MIN_EDITORIAL_PASSING_SCORE } from '../lib/mcp/domains/qc/rules-matrix'
import { MdxArticle, HumanEditorialScoreResult } from '../lib/mcp/core/types'
import { TechNewsStory } from '../lib/mcp/domains/research/tech-engine'
import { IslamicAcademicStory } from '../lib/mcp/domains/research/islamic-engine'

export type { MdxArticle, HumanEditorialScoreResult }

export {
  BANNED_ARABIC_LEAK_PATTERNS,
  BANNED_ENGLISH_LEAK_PATTERNS,
  BANNED_INDONESIAN_LEAK_PATTERNS,
  MIN_EDITORIAL_PASSING_SCORE,
}

export const extractCleanProseForAudit = ProseCleaner.extractCleanProseForAudit
export const localizeSourceType = SourceVerifier.localizeSourceType

export const runHumanLevelEditorialQC = EditorialQCEngine.evaluateArticle.bind(EditorialQCEngine)
export const runMultidimensionalQC = runHumanLevelEditorialQC

export async function buildTechMdxArticles(story: TechNewsStory): Promise<{
  articles: MdxArticle[]
  qcResults: Record<'id' | 'en' | 'ar', HumanEditorialScoreResult>
}> {
  const articles = await TechArticleBuilder.buildTrilingualArticles(story)
  const qcResults = {
    id: EditorialQCEngine.evaluateArticle(articles[0]),
    en: EditorialQCEngine.evaluateArticle(articles[1]),
    ar: EditorialQCEngine.evaluateArticle(articles[2]),
  }
  return { articles, qcResults }
}

export async function buildIslamicAcademicMdxArticles(story: IslamicAcademicStory): Promise<{
  articles: MdxArticle[]
  qcResults: Record<'id' | 'en' | 'ar', HumanEditorialScoreResult>
}> {
  const articles = await IslamicArticleBuilder.buildTrilingualArticles(story)
  const qcResults = {
    id: EditorialQCEngine.evaluateArticle(articles[0]),
    en: EditorialQCEngine.evaluateArticle(articles[1]),
    ar: EditorialQCEngine.evaluateArticle(articles[2]),
  }
  return { articles, qcResults }
}
