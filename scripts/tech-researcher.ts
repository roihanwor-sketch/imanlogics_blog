import {
  TechResearchEngine,
  TechNewsStory,
  TraceableMetric,
  ArticleClassification,
  EditorialAngle,
  TechDisambiguationSection,
  Fp4DeepDive,
} from '../lib/mcp/domains/research/tech-engine'
import { SourceCitation, SourceClassification, LocalizedText } from '../lib/mcp/core/types'

export type {
  TechNewsStory,
  TraceableMetric,
  ArticleClassification,
  EditorialAngle,
  TechDisambiguationSection,
  Fp4DeepDive,
  SourceCitation,
  SourceClassification,
  LocalizedText,
}

export const calculateRecencyScore =
  TechResearchEngine.calculateRecencyScore.bind(TechResearchEngine)
export const getFreshTechNewsCandidates =
  TechResearchEngine.getFreshTechNewsCandidates.bind(TechResearchEngine)
export const researchTechNewsIntelligence =
  TechResearchEngine.discoverVerifiedStories.bind(TechResearchEngine)
