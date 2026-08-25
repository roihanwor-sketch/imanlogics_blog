import { SourceCitation, SupportedLanguage } from '../../core/types'
import {
  MEDIA_SOURCE_POOLS,
  ISLAMIC_SOURCE_POOLS,
  PRIMARY_SOURCE_LAYERS,
} from '../../config/media-pool'

export class SourceVerifier {
  static verifyDualTier(sources: SourceCitation[]): {
    tier1Count: number
    tier2Count: number
    tier3Count: number
    isAuthoritative: boolean
    reasons: string[]
  } {
    const reasons: string[] = []
    let tier1Count = 0
    let tier2Count = 0
    let tier3Count = 0

    if (!sources || sources.length === 0) {
      return {
        tier1Count: 0,
        tier2Count: 0,
        tier3Count: 0,
        isAuthoritative: false,
        reasons: ['No sources provided for verification.'],
      }
    }

    for (const source of sources) {
      if (source.tier === 1) {
        tier1Count++
      } else if (source.tier === 2) {
        tier2Count++
      } else {
        tier3Count++
      }
    }

    if (tier1Count === 0 && tier2Count < 2) {
      reasons.push(
        'Story must cite at least one Tier 1 Primary Source (Whitepaper/Spec/Archive/Tafsir) or two verified Tier 2 Reputable Journalism sources.'
      )
    }

    if (sources.length < 2) {
      reasons.push('Story must cite a minimum of 2 distinct verifiable sources.')
    }

    const isAuthoritative = reasons.length === 0 && (tier1Count >= 1 || tier2Count >= 2)

    return {
      tier1Count,
      tier2Count,
      tier3Count,
      isAuthoritative,
      reasons,
    }
  }

  static isRecognizedMediaOutlet(domain: string): boolean {
    const allOutlets = [
      ...MEDIA_SOURCE_POOLS.indonesia,
      ...MEDIA_SOURCE_POOLS.globalEnglish,
      ...MEDIA_SOURCE_POOLS.arabic,
    ]
    return allOutlets.some((m) => domain.toLowerCase().includes(m.domain.toLowerCase()))
  }

  static isSemanticallyDuplicate(
    candidateTitle: string,
    candidateKeywords: string[],
    existingArticles: { title: string; keywords?: string[]; slug: string }[]
  ): { isDuplicate: boolean; similarityReason?: string } {
    const normCandidate = candidateTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '')
    const candWords = new Set(normCandidate.split(/\s+/).filter((w) => w.length > 3))

    for (const existing of existingArticles) {
      const normExisting = existing.title.toLowerCase().replace(/[^a-z0-9\s]/g, '')
      const existWords = normExisting.split(/\s+/).filter((w) => w.length > 3)

      let overlapCount = 0
      for (const w of existWords) {
        if (candWords.has(w)) overlapCount++
      }

      const similarityRatio = overlapCount / Math.max(candWords.size, existWords.length || 1)

      // Strict duplicate if substance and key words overlap > 75%
      if (similarityRatio >= 0.75) {
        return {
          isDuplicate: true,
          similarityReason: `Substance overlaps (${Math.round(similarityRatio * 100)}%) with published article: "${existing.title}"`,
        }
      }
    }

    return { isDuplicate: false }
  }

  static localizeSourceType(type: string, lang: SupportedLanguage): string {
    const mapping: Record<string, Record<SupportedLanguage, string>> = {
      'standards-body': {
        id: 'Badan Standardisasi Resmi',
        en: 'Official Standards Body',
        ar: 'هيئة المعايير الرسمية',
      },
      'official-newsroom': {
        id: 'Pusat Berita Resmi Perusahaan',
        en: 'Official Corporate Newsroom',
        ar: 'المركز الإخباري الرسمي للشركة',
      },
      whitepaper: {
        id: 'Dokumen Teknis & Whitepaper',
        en: 'Technical Whitepaper',
        ar: 'الوثيقة التقنية الرسمية',
      },
      'research-paper': {
        id: 'Makalah Riset Akademik',
        en: 'Academic Research Paper',
        ar: 'بحث علمي محكّم',
      },
      archive: {
        id: 'Arsip Manuskrip Digital',
        en: 'Digital Manuscript Archive',
        ar: 'أرشيف المخطوطات الرقمي',
      },
      'academic-book': {
        id: 'Buku Referensi Akademik',
        en: 'Academic Reference Book',
        ar: 'مرجع أكاديمي موثق',
      },
      'academic-journal': {
        id: 'Jurnal Ilmiah Berkala',
        en: 'Peer-Reviewed Journal',
        ar: 'مجلة علمية محكّمة',
      },
      'classical-tafsir': {
        id: 'Kitab Tafsir & Rujukan Primer Islam',
        en: 'Classical Tafsir & Primary Scriptural Source',
        ar: 'كتب التفسير المعتمدة والمصادر التأسيسية',
      },
      'media-pool-id': {
        id: 'Media Teknologi Terverifikasi (ID)',
        en: 'Verified Tech Media (ID)',
        ar: 'وسيلة إعلامية تقنية موثقة (إندونيسيا)',
      },
      'media-pool-en': {
        id: 'Media Teknologi Terverifikasi (Global)',
        en: 'Verified Tech Media (Global)',
        ar: 'وسيلة إعلامية تقنية موثقة (عالمية)',
      },
      'media-pool-ar': {
        id: 'Media Teknologi Terverifikasi (Arab)',
        en: 'Verified Tech Media (Arabic)',
        ar: 'وسيلة إعلامية تقنية موثقة (عربية)',
      },
    }

    return mapping[type]?.[lang] || type
  }
}
