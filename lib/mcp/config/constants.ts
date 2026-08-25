export const EDITORIAL_QC_CONFIG = {
  minPassingScore: 85,
  preferredScore: 90,
  maxBreakingNewsAgeHours: 48,
  minWordCount: 500,
  minVerifiedSources: 2,
  minVisualCount: 1,
  researchIntervalHours: 3, // Main autonomous daemon runs every 3 hours
  waReportSlots: [
    { hour: 5, minute: 0, label: '05:00 (Pagi)' },
    { hour: 17, minute: 0, label: '17:00 (Sore)' },
  ],
}

export const RESEARCH_SCHEDULE_HOURS = [0, 3, 6, 9, 12, 15, 18, 21]
