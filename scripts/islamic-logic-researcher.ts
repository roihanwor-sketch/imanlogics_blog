import {
  IslamicResearchEngine,
  IslamicAcademicStory,
  TraceableHistoricalMetric,
  KeyManuscriptText,
  ArchaeologicalForensics,
  ScholarlyDebateSection,
  DefinitionalPrecisionSection,
  IslamicReasoningWalkthrough,
} from '../lib/mcp/domains/research/islamic-engine'
import { SourceCitation, SourceClassification, LocalizedText } from '../lib/mcp/core/types'

export type {
  IslamicAcademicStory,
  TraceableHistoricalMetric,
  KeyManuscriptText,
  ArchaeologicalForensics,
  ScholarlyDebateSection,
  DefinitionalPrecisionSection,
  IslamicReasoningWalkthrough,
  SourceCitation,
  SourceClassification,
  LocalizedText,
}

export const getFreshIslamicAcademicCandidates =
  IslamicResearchEngine.getFreshIslamicAcademicCandidates.bind(IslamicResearchEngine)
export const researchIslamicAcademicIntelligence =
  IslamicResearchEngine.discoverVerifiedStories.bind(IslamicResearchEngine)
