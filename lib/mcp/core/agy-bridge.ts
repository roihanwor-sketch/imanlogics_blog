import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import { MCP_CONFIG } from '../config/env'
import { PublishedStoryMeta } from './types'

export interface AgyBridgeExecutionResult {
  success: boolean
  output: string
  error?: string
  durationMs: number
}

export interface AISynthesisResponse {
  titles?: { id: string; en: string; ar: string }
  summary?: { id: string; en: string; ar: string }
  readerHook?: { id: string; en: string; ar: string }
  whyShouldICare?: { id: string; en: string; ar: string }
  deepAnalysis?: { id: string; en: string; ar: string }
  honestBoundaries?: {
    whatItProves: { id: string; en: string; ar: string }
    whatMustNotBeClaimed: { id: string; en: string; ar: string }
  }
}

export class AgyCliBridge {
  private static binaryPath: string | null = null

  /**
   * Mendapatkan lokasi executable agy.exe di sistem Windows
   */
  public static getBinaryPath(): string {
    if (this.binaryPath) return this.binaryPath

    const standardLocations = [
      path.join(process.env.LOCALAPPDATA || '', 'agy', 'bin', 'agy.exe'),
      path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Antigravity IDE', 'bin', 'agy.cmd'),
      'agy.exe',
      'agy',
    ]

    for (const loc of standardLocations) {
      if (fs.existsSync(loc)) {
        this.binaryPath = loc
        return loc
      }
    }

    this.binaryPath = 'agy.exe'
    return this.binaryPath
  }

  /**
   * Mengeksekusi prompt ke Antigravity CLI ('agy -p') dengan workspace D:\Projects\BLOG
   */
  public static async executePrompt(
    prompt: string,
    timeoutMs: number = 180000
  ): Promise<AgyBridgeExecutionResult> {
    const startTime = Date.now()
    const binary = this.getBinaryPath()
    const workspaceDir = MCP_CONFIG.blogRootDir

    return new Promise((resolve) => {
      let stdoutData = ''
      let stderrData = ''
      let isSettled = false

      const args = ['--add-dir', workspaceDir, '--dangerously-skip-permissions', '-p', prompt]

      const child = spawn(binary, args, {
        cwd: workspaceDir,
        stdio: ['pipe', 'pipe', 'pipe'],
        windowsHide: true,
        env: {
          ...process.env,
          PYTHONIOENCODING: 'utf-8',
          PYTHONUTF8: '1',
        },
      })

      const timer = setTimeout(() => {
        if (!isSettled) {
          isSettled = true
          try {
            child.kill('SIGTERM')
          } catch {
            // Process might have already exited
          }
          resolve({
            success: false,
            output: stdoutData,
            error: `Execution timed out after ${timeoutMs / 1000}s`,
            durationMs: Date.now() - startTime,
          })
        }
      }, timeoutMs)

      child.stdout.on('data', (chunk) => {
        stdoutData += chunk.toString()
      })

      child.stderr.on('data', (chunk) => {
        stderrData += chunk.toString()
      })

      child.on('error', (err) => {
        if (!isSettled) {
          isSettled = true
          clearTimeout(timer)
          resolve({
            success: false,
            output: stdoutData,
            error: `Failed to spawn agy.exe: ${err.message}`,
            durationMs: Date.now() - startTime,
          })
        }
      })

      child.on('close', (code) => {
        if (!isSettled) {
          isSettled = true
          clearTimeout(timer)
          resolve({
            success: code === 0,
            output: stdoutData.trim(),
            error: code !== 0 ? stderrData.trim() : undefined,
            durationMs: Date.now() - startTime,
          })
        }
      })
    })
  }

  /**
   * Menyusun prompt komprehensif yang berisi seluruh konteks riwayat dan instruksi editorial
   */
  public static buildEditorialPrompt(params: {
    category: 'tech-ai' | 'islamic-logic'
    topicTitle: string
    rawArticleBody: string
    sourceUrl: string
    cycleHistory: (PublishedStoryMeta | Record<string, unknown>)[]
  }): string {
    const historySummary = params.cycleHistory
      .slice(-5)
      .map(
        (h: PublishedStoryMeta | Record<string, unknown>, idx: number) =>
          `${idx + 1}. [${'category' in h ? (h.category as string) : 'Story'}] ${'title' in h ? (h.title as string) : 'Recent Story'} (${'slug' in h ? (h.slug as string) : 'Recent'})`
      )
      .join('\n')

    return `[MANDAT EDITORIAL IMANLOGICS - AUTONOMOUS 3-HOUR RESEARCH CYCLE]
Kategori: ${params.category.toUpperCase()}
Topik Ditemukan: "${params.topicTitle}"
Sumber Web Terverifikasi: ${params.sourceUrl}

RIWAYAT ARTIKEL TERAKHIR (AGAR TIDAK DUPLIKASI TOPIK/ANGLE):
${historySummary || 'Belum ada riwayat siklus sebelumnya.'}

ISI BODI ARTIKEL WEB HASIL SCRAPING:
"""
${params.rawArticleBody.slice(0, 3000)}
"""

TUGAS UTAMA ANTIGRAVITY AGENT:
Tulis artikel trilingual (ID, EN, AR) mendalam dengan penalaran asli (Native Thinking).
Keluarkan HANYA JSON valid dalam blok \`\`\`json ... \`\`\` dengan struktur berikut:
{
  "titles": {
    "id": "Judul Bahasa Indonesia baku dan elegan tanpa kata hubung bahasa Inggris",
    "en": "High-rigor technical / analytical headline in English",
    "ar": "عنوان باللغة العربية الفصحى الأكاديمية الرصينة"
  },
  "summary": {
    "id": "Ringkasan eksekutif 2-3 kalimat dalam Bahasa Indonesia",
    "en": "Executive summary in 2-3 sentences in English",
    "ar": "ملخص تنفيذي باللغة العربية الفصحى"
  },
  "readerHook": {
    "id": "Paragraf pembuka / hook naratif pembaca dalam Bahasa Indonesia",
    "en": "Engaging narrative hook paragraph in English",
    "ar": "فقرة تمهيدية استهلالية باللغة العربية"
  },
  "whyShouldICare": {
    "id": "Penjelasan mengapa topik ini krusial bagi pembaca dalam Bahasa Indonesia",
    "en": "Why this development matters to practitioners in English",
    "ar": "أهمية هذه القضية ودلالاتها باللغة العربية"
  },
  "deepAnalysis": {
    "id": "Ulasan teknis/epistemologis mendalam 3-4 paragraf dalam Bahasa Indonesia",
    "en": "Comprehensive deep technical / epistemological analysis (3-4 paragraphs) in English",
    "ar": "تحليل منهجي وتفكيك علمي رصين (3-4 فقرات) باللغة العربية"
  },
  "honestBoundaries": {
    "whatItProves": {
      "id": "APA YANG TERBUKTI: Bukti faktual yang sah dalam Bahasa Indonesia",
      "en": "WHAT IT PROVES: Legitimate empirical / textual evidence in English",
      "ar": "ما يثبته البحث: الحقائق والشواهد الثابتة باللغة العربية"
    },
    "whatMustNotBeClaimed": {
      "id": "APA YANG TIDAK BOLEH DIKLAIM: Batasan dan peringatan dalam Bahasa Indonesia",
      "en": "WHAT MUST NOT BE CLAIMED: Cautionary limitations in English",
      "ar": "ما لا يجوز ادعاؤه: المحاذير والحدود المنهجية باللغة العربية"
    }
  }
}
`
  }

  /**
   * Melakukan sintesis artikel lengkap via AI Antigravity CLI
   */
  public static async synthesizeFullArticleWithAI(params: {
    category: 'tech-ai' | 'islamic-logic'
    topicTitle: string
    rawArticleBody: string
    sourceUrl: string
    cycleHistory: (PublishedStoryMeta | Record<string, unknown>)[]
  }): Promise<{
    success: boolean
    data?: AISynthesisResponse
    error?: string
  }> {
    const prompt = this.buildEditorialPrompt(params)
    const execRes = await this.executePrompt(prompt, 120000)

    if (!execRes.success || !execRes.output) {
      return { success: false, error: execRes.error || 'Empty output from agy CLI' }
    }

    try {
      // Extract JSON block from output
      let jsonStr = execRes.output
      const jsonMatch = execRes.output.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1]
      } else {
        const firstBrace = execRes.output.indexOf('{')
        const lastBrace = execRes.output.lastIndexOf('}')
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          jsonStr = execRes.output.substring(firstBrace, lastBrace + 1)
        }
      }

      const parsed = JSON.parse(jsonStr)
      if (parsed.titles?.id && parsed.deepAnalysis?.id) {
        return { success: true, data: parsed }
      }
      return { success: false, error: 'JSON structure missing required editorial fields' }
    } catch (parseErr: unknown) {
      const errorMsg = parseErr instanceof Error ? parseErr.message : String(parseErr)
      return { success: false, error: `Failed to parse AI output: ${errorMsg}` }
    }
  }
}
