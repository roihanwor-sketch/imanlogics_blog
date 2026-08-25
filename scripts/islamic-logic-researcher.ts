import {
  IslamicResearchEngine,
  IslamicAcademicStory,
} from '../lib/mcp/domains/research/islamic-engine'
import {
  SourceCitation,
  SourceClassification,
  LocalizedText,
  EpistemologicalPoint,
  EditorialBenchmarkResult,
} from '../lib/mcp/core/types'

export type {
  IslamicAcademicStory,
  EpistemologicalPoint,
  EditorialBenchmarkResult,
  SourceCitation,
  SourceClassification,
  LocalizedText,
}

export const getFreshIslamicAcademicCandidates =
  IslamicResearchEngine.getFreshIslamicAcademicCandidates.bind(IslamicResearchEngine)
export const researchIslamicAcademicIntelligence =
  IslamicResearchEngine.discoverVerifiedStories.bind(IslamicResearchEngine)
