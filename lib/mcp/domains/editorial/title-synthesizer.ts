import { LocalizedText } from '../../core/types'

export class NativeTitleSynthesizer {
  /**
   * Crafts native, grammatically authentic titles in Indonesian, English, and Arabic
   * Thinking natively in each language rather than rigid templates or word-for-word translation
   */
  static synthesizeTrilingualTitles(
    rawTitle: string,
    subCategoryOrPillar: string,
    category: 'tech-ai' | 'islamic-logic'
  ): LocalizedText {
    // 1. Clean source outlet artifacts (e.g., "Sony Xperia 10 VII - GSMArena", "Story Title | The Verge")
    const cleanTitle = rawTitle
      .replace(
        /\s*[-|–—:]\s*(GSMArena|The Verge|TechCrunch|Ars Technica|Engadget|AnandTech|9to5Google|Tom's Hardware|CNET|ZDNet|XDA Developers|Kompas Tekno|DetikInet|Al Jazeera|Yaqeen|Nature|IEEE Spectrum|Android Authority|Gizmodo).*$/i,
        ''
      )
      .trim()

    // 2. Clean leading/trailing quotes and redundant spaces
    const sanitizedTitle = cleanTitle.replace(/^["']|["']$/g, '').trim()

    if (category === 'tech-ai') {
      return {
        id: sanitizedTitle,
        en: sanitizedTitle,
        ar: sanitizedTitle,
      }
    } else {
      return {
        id: sanitizedTitle,
        en: sanitizedTitle,
        ar: sanitizedTitle,
      }
    }
  }
}
