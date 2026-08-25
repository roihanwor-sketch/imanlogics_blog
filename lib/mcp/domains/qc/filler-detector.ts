export const BANNED_AI_FILLER_PATTERNS = [
  /di era digital yang terus berkembang/i,
  /mari kita simak penjelasan mendalam berikut/i,
  /tak dapat dipungkiri bahwa/i,
  /sebagaimana kita ketahui bersama/i,
  /pada artikel kali ini kita akan membahas/i,
  /penerapan inovasi ini secara langsung meningkatkan efisiensi/i,
  /in today's rapidly evolving digital landscape/i,
  /it goes without saying that/i,
  /delve into/i,
  /testament to/i,
  /في عصرنا الرقمي المتسارع/i,
  /لا يخفى على أحد أن/i,
  /دعونا نغوص في تفاصيل/i,
]

export const BANNED_APOLOGETIC_LEAP_PATTERNS = [
  /manuskrip ini membuktikan kebenaran islam secara mutlak/i,
  /dead sea scrolls prove islam/i,
  /penemuan ini membuktikan ramalan al-quran secara langsung/i,
  /tidak ada keraguan lagi bahwa para ahli sepakat dengan/i,
]

export class FillerDetector {
  static checkAIFiller(content: string): { failed: boolean; reason?: string } {
    for (const pattern of BANNED_AI_FILLER_PATTERNS) {
      if (pattern.test(content)) {
        return {
          failed: true,
          reason: `Zero-Filler Gate Failed: Detected banned generic AI filler phrase matching ${pattern.toString()}`,
        }
      }
    }
    return { failed: false }
  }

  static checkApologeticLeaps(content: string): { failed: boolean; reason?: string } {
    for (const pattern of BANNED_APOLOGETIC_LEAP_PATTERNS) {
      if (pattern.test(content)) {
        return {
          failed: true,
          reason: `Intellectual Honesty Gate Failed: Uncalibrated apologetic leap detected (${pattern.toString()}). Material evidence must be delineated from theological interpretation.`,
        }
      }
    }
    return { failed: false }
  }
}
