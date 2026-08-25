export type SupportedLanguage = 'id' | 'en' | 'ar'

export type ContentCategory = 'tech-ai' | 'islamic-logic'

export type SourceClassification = 'Tier1-Primary' | 'Tier2-ReputableJournalism' | 'Tier3-Discovery'

export interface SourceCitation {
  name: string
  url: string
  tier: 1 | 2 | 3
  type: string
  relevanceScore?: number
}

export interface CitationChainRecord {
  secondarySource?: {
    outletId?: string
    outletName: string
    articleUrl: string
    quotedClaim: string
  }
  primaryEvidence?: {
    sourceType?:
      | 'whitepaper'
      | 'research-paper'
      | 'official-newsroom'
      | 'standards-body'
      | 'benchmark-lab'
      | 'archive'
      | string
    title: string
    url: string
    provenanceDetails: string
  }
  crossCheckVerification?: {
    independentSource: string
    confirmed: boolean
    notes: string
  }
  layer1Primary?: string
  layer2Journalism?: string
  layer3Discovery?: string
  crossVerificationNotes?: string
}

export interface LocalizedText {
  id: string
  en: string
  ar: string
}

export type EpistemologicalCategory =
  | 'FACT'
  | 'EVIDENCE'
  | 'ISLAMIC_INTERPRETATION'
  | 'ACADEMIC_INTERPRETATION'
  | 'CLAIM'
  | 'COUNTERARGUMENT'
  | 'UNCERTAINTY'

export interface EpistemologicalPoint {
  category: EpistemologicalCategory
  statement: LocalizedText
  sources: SourceCitation[]
  confidenceLevel: 'High' | 'Moderate' | 'Debated'
}

export interface EditorialBenchmarkResult {
  firstOrBestCoverage: string
  angleUtilized: string
  primarySourcesCited: string[]
  unexploredAngleForImanLogics: string
  originalValueProposition: string
}

export interface SafeImage {
  id?: string
  url: string
  author: string
  source: string
  sourceUrl?: string
  license: string
  licenseUrl?: string
  aspectRatio?: string
  altText: LocalizedText
  placement?: string
  tags: string[]
  localPath?: string
  downloadSuccess?: boolean
  fileSizeBytes?: number
}

export interface ImageCreditRecord {
  url: string
  localPath: string
  sourceWebsite: string
  creator: string
  license: string
  licenseUrl?: string
  downloadDate: string
  articleAssociation: string
  attributionText: string
}

export interface FrontmatterSchema {
  title: string
  date: string
  tags: string[]
  draft: boolean
  summary: string
  images: string[]
  authors: string[]
  language: SupportedLanguage
  translation_group: string
  original_language: SupportedLanguage
  category: ContentCategory
  articleType: string
  sources: Array<{ name: string; url: string; tier: number }>
  imageCredits: ImageCreditRecord[]
}

export interface MdxArticle {
  filename: string
  filepath: string
  language: SupportedLanguage
  frontmatter: FrontmatterSchema
  content: string
  publishedHoursAgo?: number
}

export interface HumanEditorialScoreResult {
  score: number
  passed: boolean
  editorialDecision:
    'PUBLISH_PREFERRED' | 'PUBLISH_CONDITIONAL' | 'REJECT_HARD_FAIL' | 'REJECT_LOW_SCORE'
  hardFailTriggered: boolean
  hardFailReason?: string
  breakdown: {
    freshnessAndTiming: number
    factualAccuracyAndRigor: number
    sourceQualityAndAttribution: number
    informationDensityAndDepth: number
    narrativeAndStorytelling: number
    originalInsightAndEconomics: number
    intellectualHonestyAndNuance: number
    visualLicensingAndProvenance: number
    languageQualityAndParity: number
  }
  warnings: string[]
}

export interface PublishedStoryMeta {
  title: string
  slug: string
  category: ContentCategory
  languages: SupportedLanguage[]
}

export interface AuditCycleReport {
  cycleTimestamp: string
  sourcesScanned: number
  candidatesDiscovered: number
  duplicatesRemoved: number
  storiesEvaluated: number
  articlesPassedQC: number
  articlesPublished: string[]
  publishedStoryDetails: PublishedStoryMeta[]
  rejectionReasons: string[]
  gitCommitHash?: string
  status: 'SUCCESS' | 'NO_PUBLISHABLE_STORY' | 'QC_REJECTED' | 'ERROR'
  errorMessage?: string
}

export interface NotificationPayload {
  status: 'SUCCESS' | 'NO_PUBLISHABLE_STORY' | 'QC_REJECTED' | 'ERROR'
  articlesPublished: string[]
  publishedStories?: PublishedStoryMeta[]
  techArticlesCount: number
  islamicArticlesCount: number
  totalTrilingualArticles: number
  qcAverageScore: number
  gitPushStatus: string
  nextCycleTime: string
  errorMessage?: string
  // Aggregated 12-hour metrics
  aggregatedMetrics?: {
    cyclesRunCount: number
    totalCandidatesEvaluated: number
    totalRejectedCount: number
    rejectionsSummary: string[]
    timeWindowLabel: string
  }
}
