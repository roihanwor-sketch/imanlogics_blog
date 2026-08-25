import { ProseCleaner } from '../editorial/prose-cleaner'

export const BANNED_ARABIC_LEAK_PATTERNS = [
  {
    pattern:
      /\b(sekitar|abad ke|yang|dengan|pada|adalah|yaitu|sebagai|terhadap|menurut|antara|sumber visual|terbit|foto oleh)\b/i,
    reason: 'Indonesian word leakage detected in Arabic article',
  },
  {
    pattern: /\bQS\.\s+[A-Za-z-]+\b/,
    reason: 'Indonesian/English Qur\'an citation format (QS.) in Arabic text; use "سورة ..."',
  },
  {
    pattern:
      /\b(Photo by|Visual Credit|Visual Source|Estimated Date|c\.\s*\d+\s*BCE|1st century|2nd century|Published:)\b/i,
    reason: 'English template boilerplate leakage detected in Arabic article',
  },
  {
    pattern: /[\u0600-\u06FF]{2,}[a-z]{2,}/,
    reason: 'Corrupted mixed Arabic-Latin word (e.g. "قمرan") detected in Arabic article',
  },
]

export const BANNED_ENGLISH_LEAK_PATTERNS = [
  {
    pattern:
      /\b(sekitar|abad ke|yang|dengan|pada|adalah|yaitu|sebagai|terhadap|menurut|antara|sumber visual|terbit|foto oleh)\b/i,
    reason: 'Indonesian word leakage detected in English article',
  },
  {
    pattern: /\bQS\.\s+[A-Za-z-]+\b/,
    reason: 'Indonesian Qur\'an citation format (QS.) in English text; use "Qur\'an ..."',
  },
  {
    pattern: /\b(مصدر الصورة|التقدير الزمني|المستوى|تاريخ النشر)\b/,
    reason: 'Arabic template boilerplate leakage detected in English article',
  },
]

export const BANNED_INDONESIAN_LEAK_PATTERNS = [
  {
    pattern: /\b(Visual Credit|Visual Source|Estimated Date|Published:)\b/i,
    reason: 'English template boilerplate leakage detected in Indonesian article',
  },
  {
    pattern: /\b(مصدر الصورة|التقدير الزمني|المستوى|تاريخ النشر)\b/,
    reason: 'Arabic template boilerplate leakage detected in Indonesian article',
  },
]

export class LeakDetector {
  static checkLanguagePurity(
    content: string,
    language: 'id' | 'en' | 'ar',
    filename?: string
  ): { failed: boolean; reason?: string } {
    const prose = ProseCleaner.extractCleanProseForAudit(content)

    if (language === 'ar' || filename?.endsWith('.ar.mdx')) {
      for (const rule of BANNED_ARABIC_LEAK_PATTERNS) {
        const match = prose.match(rule.pattern)
        if (match) {
          return {
            failed: true,
            reason: `Language Purity Gate Failed (Arabic): ${rule.reason} -> "${match[0]}"`,
          }
        }
      }
    } else if (language === 'en' || filename?.endsWith('.en.mdx')) {
      for (const rule of BANNED_ENGLISH_LEAK_PATTERNS) {
        const match = prose.match(rule.pattern)
        if (match) {
          return {
            failed: true,
            reason: `Language Purity Gate Failed (English): ${rule.reason} -> "${match[0]}"`,
          }
        }
      }
    } else {
      for (const rule of BANNED_INDONESIAN_LEAK_PATTERNS) {
        const match = prose.match(rule.pattern)
        if (match) {
          return {
            failed: true,
            reason: `Language Purity Gate Failed (Indonesian): ${rule.reason} -> "${match[0]}"`,
          }
        }
      }
    }

    return { failed: false }
  }
}
