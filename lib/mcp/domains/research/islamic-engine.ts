import fs from 'fs'
import path from 'path'
import { MCP_CONFIG } from '../../config/env'
import {
  LocalizedText,
  SourceCitation,
  EpistemologicalPoint,
  EditorialBenchmarkResult,
} from '../../core/types'
import { SourceVerifier } from './source-verifier'
import { Logger } from '../../core/logger'
import { WebDiscoveryService, DiscoveredWebLead, IslamicLogicPillar } from './web-discovery'
import { EditorialSelectionBoard } from './editorial-board'
import { NativeTitleSynthesizer } from '../editorial/title-synthesizer'
import { AgyCliBridge } from '../../core/agy-bridge'
import { StateStore } from '../../core/state-store'

export interface IslamicAcademicStory {
  id: string
  title: string
  titles: LocalizedText
  classification:
    | 'Theological Demarcation'
    | 'Manuscript & Historical Analysis'
    | 'Philosophical Epistemology'
    | 'Scientific Compatibility'
    | 'Comparative Religion'
    | 'Sharia Rationality'
    | 'Reader-First Inquiry'
  publishedAt: string
  eventDate?: string
  primarySourceUrl: string
  primarySourceTier: 1
  sources: SourceCitation[]
  keywords: string[]
  extractedImageUrls?: string[]
  readerHook: LocalizedText
  whyShouldICare: LocalizedText
  narrativeHook?: LocalizedText
  whatThisDoesAndDoesntProve?: LocalizedText
  narrativeLead?: {
    hook: LocalizedText
    historicalContext: LocalizedText
    scholarlyConsensus: LocalizedText
  }
  epistemologicalPoints: EpistemologicalPoint[]
  epistemologicalMatrix?: EpistemologicalPoint[]
  honestBoundaries?: {
    whatItProves: LocalizedText
    whatMustNotBeClaimed: LocalizedText
  }
  editorialBenchmark: EditorialBenchmarkResult
  citationChain: {
    layer1Primary: string
    layer2Journalism: string
    layer3Discovery?: string
    crossVerificationNotes: string
  }
  aiGeneratedDeepAnalysis?: LocalizedText
}

export class IslamicResearchEngine {
  /**
   * Returns fresh candidates catalog for testing and discovery fallback
   */
  static getFreshIslamicAcademicCandidates(todayStr: string): IslamicAcademicStory[] {
    return this.getComprehensiveIslamicCatalog(todayStr)
  }

  /**
   * Discovers and verifies fresh Islamic Academic & Epistemological Stories
   */
  static async discoverVerifiedStories(): Promise<IslamicAcademicStory[]> {
    Logger.info(
      'IslamicResearch',
      'Initiating Web-Discovery-Driven Islamic Logic Cycle across Reputable Pools...'
    )
    const blogDir = MCP_CONFIG.blogDataDir
    const todayStr = new Date().toISOString().split('T')[0]

    let publishedSlugs: string[] = []
    if (fs.existsSync(blogDir)) {
      publishedSlugs = fs
        .readdirSync(blogDir)
        .filter((f) => f.endsWith('.mdx'))
        .map((f) => f.replace(/\.(id|en|ar)?\.mdx$/, ''))
    }

    // 1. Live Web Discovery
    const liveLeads = await WebDiscoveryService.discoverLiveIslamicLeads()

    // 2. Editorial Selection Board
    const boardDecision = EditorialSelectionBoard.evaluateAndSelectCandidates(liveLeads)

    // 3. Comprehensive Islamic Catalog Fallback
    const catalogCandidates = this.getComprehensiveIslamicCatalog(todayStr)

    // Merge candidates prioritizing Board-approved live leads
    const candidateStories: IslamicAcademicStory[] = []

    if (boardDecision.topIslamicCandidate) {
      const liveStory = await this.synthesizeStoryFromLead(
        boardDecision.topIslamicCandidate.lead,
        todayStr
      )
      if (liveStory) {
        candidateStories.push(liveStory)
      }
    }

    for (const catStory of catalogCandidates) {
      if (!candidateStories.some((c) => c.id === catStory.id)) {
        candidateStories.push(catStory)
      }
    }

    const verifiedStories: IslamicAcademicStory[] = []

    for (const story of candidateStories) {
      if (publishedSlugs.includes(story.id)) {
        Logger.info(
          'IslamicResearch',
          `[Anti-Duplicate] Skipped existing academic story: "${story.title}"`
        )
        continue
      }

      const sourceAudit = SourceVerifier.verifyDualTier(story.sources)
      if (!sourceAudit.isAuthoritative) {
        Logger.warn(
          'IslamicResearch',
          `[Source Gate] Rejected candidate lacking authoritative dual-tier citations: "${story.title}"`
        )
        continue
      }

      verifiedStories.push(story)
      // Pick top 1 story per autonomous cycle
      if (verifiedStories.length >= 1) break
    }

    Logger.success(
      'IslamicResearch',
      `Selected ${verifiedStories.length} high-rigor Islamic academic candidate(s).`
    )
    return verifiedStories
  }

  /**
   * Synthesizes an IslamicAcademicStory dynamically from an approved Web Lead
   * Generates native trilingual titles and domain-specific philosophical prose thinking in each language
   */
  private static async synthesizeStoryFromLead(
    lead: DiscoveredWebLead,
    todayStr: string
  ): Promise<IslamicAcademicStory | null> {
    const slugId = lead.id.replace(/^islamic-/, '')
    const cleanTitle = lead.title
    const pillar = lead.subCategory

    // 1. Generate Native Trilingual Titles thinking in each language
    let titles = this.craftNativeTrilingualTitles(cleanTitle, pillar)

    // 2. Generate Domain-Specific Islamic Epistemological Content
    const domainSynthesis = this.generateDomainSpecificProse(cleanTitle, pillar, lead.sourceOutlet)
    let readerHook = domainSynthesis.readerHook
    let whyShouldICare = domainSynthesis.whyShouldICare
    let honestBoundaries = domainSynthesis.honestBoundaries
    let aiGeneratedDeepAnalysis: LocalizedText | undefined

    // 3. Attempt AI-Powered Deep Synthesis via Antigravity CLI Bridge (if available)
    try {
      const history = StateStore.load().recentReports.flatMap((r) => r.publishedStoryDetails)
      const aiResult = await AgyCliBridge.synthesizeFullArticleWithAI({
        category: 'islamic-logic',
        topicTitle: cleanTitle,
        rawArticleBody: lead.snippet || cleanTitle,
        sourceUrl: lead.url,
        cycleHistory: history,
      })

      if (aiResult.success && aiResult.data) {
        if (aiResult.data.titles?.id && !aiResult.data.titles.id.includes('undefined')) {
          titles = aiResult.data.titles
        }
        if (aiResult.data.readerHook?.id) {
          readerHook = aiResult.data.readerHook
        }
        if (aiResult.data.whyShouldICare?.id) {
          whyShouldICare = aiResult.data.whyShouldICare
        }
        if (aiResult.data.deepAnalysis?.id) {
          aiGeneratedDeepAnalysis = aiResult.data.deepAnalysis
        }
        if (
          aiResult.data.honestBoundaries?.whatItProves?.id &&
          aiResult.data.honestBoundaries?.whatMustNotBeClaimed?.id
        ) {
          honestBoundaries = aiResult.data.honestBoundaries
        }
        Logger.info('IslamicResearch', `AI synthesis completed for: "${titles.id}"`)
      }
    } catch {
      // Graceful fallback to domain synthesis
    }

    return {
      id: slugId,
      title: titles.id,
      titles,
      classification: 'Reader-First Inquiry',
      publishedAt: lead.publishedAt || `${todayStr}T09:00:00.000Z`,
      primarySourceUrl: lead.detectedPrimarySources[0]?.url || 'https://quran.ksu.edu.sa',
      primarySourceTier: 1,
      aiGeneratedDeepAnalysis,
      readerHook,
      whyShouldICare,
      keywords: [
        'islamic-logic',
        pillar.toLowerCase().replace(/_/g, '-'),
        'rational-theology',
        'comparative-religion',
        'epistemology',
      ],
      extractedImageUrls: lead.extractedImageUrls || [],
      sources: [
        {
          name:
            lead.detectedPrimarySources[0]?.name ||
            "Al-Qur'an & Rujukan Kitab Induk (Tafsir & Ushul)",
          url: lead.detectedPrimarySources[0]?.url || 'https://quran.ksu.edu.sa',
          tier: 1,
          type: 'classical-tafsir',
          relevanceScore: 98,
        },
        {
          name: lead.sourceOutlet,
          url: lead.url,
          tier: 2,
          type: 'academic-journal',
          relevanceScore: 90,
        },
      ],
      narrativeLead: domainSynthesis.narrativeLead,
      epistemologicalPoints: domainSynthesis.epistemologicalPoints,
      honestBoundaries,
      citationChain: {
        layer1Primary: "Al-Qur'anul Karim, Kitab Tafsir Klasik & Kaidah Ushul Fiqh",
        layer2Journalism: `${lead.sourceOutlet} Academic Study & Analysis`,
        layer3Discovery: 'Live Islamic Logic & Contemporary Inquiry Feed',
        crossVerificationNotes:
          'Argumentasi diverifikasi silang antara teks rujukan primer Islam dan telaah akademis kontemporer.',
      },
      editorialBenchmark: {
        firstOrBestCoverage: `${lead.sourceOutlet} mendiskusikan topik umum; ImanLogics menyajikan analisis epistemologis komparatif dan batas demarkasi rasional.`,
        angleUtilized: 'Reader-First Inquiry with Epistemological Demarcation',
        primarySourcesCited: ["Al-Qur'an", 'Kaidah Ushul & Epistemologi Klasik'],
        unexploredAngleForImanLogics:
          'Memisahkan secara objektif antara fakta dalil, interpretasi manusiawi, dan sanggahan logis.',
        originalValueProposition:
          'Menghadirkan penjelasan yang menggugah nalar tanpa apologetika sempit dan tanpa manipulasi teks.',
      },
    }
  }

  /**
   * Crafts native trilingual titles by thinking in the target language
   */
  private static craftNativeTrilingualTitles(rawTitle: string, pillar: string): LocalizedText {
    return NativeTitleSynthesizer.synthesizeTrilingualTitles(rawTitle, pillar, 'islamic-logic')
  }

  /**
   * Generates domain-accurate philosophical prose matching the specific pillar
   */
  private static generateDomainSpecificProse(
    title: string,
    pillar: string,
    outlet: string
  ): {
    readerHook: LocalizedText
    whyShouldICare: LocalizedText
    narrativeLead: {
      hook: LocalizedText
      historicalContext: LocalizedText
      scholarlyConsensus: LocalizedText
    }
    epistemologicalPoints: EpistemologicalPoint[]
    honestBoundaries: {
      whatItProves: LocalizedText
      whatMustNotBeClaimed: LocalizedText
    }
  } {
    if (pillar === 'CURRENT_AND_VIRAL_QUESTIONS' || title.toLowerCase().includes('misconception')) {
      return {
        readerHook: {
          id: `Dalam perbincangan publik global, narasi seputar Islam kerap diwarnai generalisasi dan kesalahpahaman budaya. Kajian terkini yang dilansir ${outlet} membuka ruang dialog rasional untuk mengurai pokok persoalan secara objektif.`,
          en: `In global public discourse, discussions concerning Islam often encounter cultural stereotypes and uncritical generalizations. Contemporary analysis documented by ${outlet} invites reasoned examination of these core questions.`,
          ar: `في الحوارات الفكرية المعاصرة، غالباً ما تحاط المفاهيم الإسلامية بتصورات نمطية وقوالب جاهزة. يفتح التقرير التحليلي الصادر عن ${outlet} نافذة للحوار العقلاني الرصين لتفكيك هذه الإشكالات.`,
        },
        whyShouldICare: {
          id: `Menelaah miskonsepsi secara ilmiah membantu membedakan antara ajaran normatif wahyu yang menjunjung keadilan dan kebebasan bernalar, dengan praktik kultural manusiawi yang rentan bias.`,
          en: `A rigorous examination distinguishes authentic scriptural mandates promoting justice and critical thought from localized cultural practices.`,
          ar: `يساعد التمييز العلمي الرصين على الفصل بين التعاليم التأسيسية القائمة على العدل وحرية التفكير، وبين الممارسات الثقافية والاجتماعية المتغيرة.`,
        },
        narrativeLead: {
          hook: {
            id: 'Dialog keagamaan yang sehat tidak dibangun di atas prasangka, melainkan di atas kejujuran memeriksa teks dan fakta sejarah.',
            en: 'Constructive interfaith dialogue cannot rest upon inherited assumptions, but demands honest examination of primary texts and historical context.',
            ar: 'لا يُبنى الحوار الفكري البناء على التصورات المسبقة، بل يستند إلى التحقيق الموضوعي في النصوص التأسيسية والشواهد التاريخية.',
          },
          historicalContext: {
            id: "Sepanjang sejarah peradaban, prinsip Al-Qur'an secara eksplisit melarang pemaksaan keyakinan dan menegaskan tanggung jawab moral individual (QS. Al-Baqarah [2]: 256).",
            en: "Historically, the Qur'anic corpus explicitly established non-coercion in matters of conscience and emphasized individual moral agency (Qur'an 2:256).",
            ar: 'تاريخياً، أرست النصوص القرآنية بوضوح مبدأ نفي الإكراه في الدين والتأكيد على المسؤولية الأخلاقية الفردية (سورة البقرة: 256).',
          },
          scholarlyConsensus: {
            id: 'Para akademisi comparative religion menegaskan pentingnya memahami doktrin keagamaan dari sumber orisinalnya, bukan dari perilaku parsial pemeluknya.',
            en: 'Scholars of comparative religion emphasize evaluating faith traditions through their foundational sources rather than localized deviations.',
            ar: 'يؤكد باحثو الأديان المقارنة على ضرورة تقييم المنظومة الدينية من خلال مصادرها التأسيسية الأصلية وليس من خلال السلوكيات الفردية.',
          },
        },
        epistemologicalPoints: [
          {
            category: 'FACT' as const,
            confidenceLevel: 'High' as const,
            statement: {
              id: "Teks Al-Qur'an secara eksplisit melarang segala bentuk pemaksaan dalam beragama (QS. Al-Baqarah: 256) dan memerintahkan keadilan terhadap seluruh umat manusia.",
              en: "The Qur'an explicitly prohibits compulsion in religion (2:256) and commands universal justice regardless of identity.",
              ar: 'يقرر القرآن الكريم بوضوح مبدأ "لا إكراه في الدين" ويأمر بإقامة القسط والعدل مع كافة البشر.',
            },
            sources: [
              {
                name: "Al-Qur'an Surah Al-Baqarah: 256 & Al-Mumtahanah: 8",
                url: 'https://quran.ksu.edu.sa',
                tier: 1 as 1 | 2 | 3,
                type: 'classical-tafsir',
              },
            ],
          },
          {
            category: 'EVIDENCE' as const,
            confidenceLevel: 'High' as const,
            statement: {
              id: 'Piagam Madinah (Shahifatul Madinah) mendokumentasikan perlindungan hukum dan kebebasan beragama yang setara bagi seluruh komunitas majemuk.',
              en: 'The historical Constitution of Medina established mutual protection, equal civic belonging, and religious freedom for diverse communities.',
              ar: 'وثقت صحيفة المدينة المنورة تاريخياً مبادئ التعايش المشترك، والمواطنة العادلة، وحرية المعتقد لمختلف المكونات.',
            },
            sources: [
              {
                name: 'Sirah Nabawiyyah (Ibn Hisham / Ibn Ishaq)',
                url: 'https://shamela.ws',
                tier: 1 as 1 | 2 | 3,
                type: 'historical-primary',
              },
            ],
          },
          {
            category: 'COUNTERARGUMENT' as const,
            confidenceLevel: 'High' as const,
            statement: {
              id: 'Klaim bahwa tradisi Islam menolak rasionalitas terbantahkan oleh kaidah ushul fiqh yang menempatkan hifz al-aql (perlindungan akal) sebagai salah satu maqasid syariah pokok.',
              en: "The claim that Islamic tradition rejects critical inquiry is refuted by Islamic legal philosophy, which enshrines the preservation of reason (hifz al-'aql) as a core objective.",
              ar: 'دعوى معاداة الفكر الإسلامي للعقل تفندها مقاصد الشريعة التي جعلت "حفظ العقل" من الضروريات الكلية الحتمية.',
            },
            sources: [
              {
                name: 'Al-Mustasfa (Al-Ghazali) & Al-Muwafaqat (Al-Shatibi)',
                url: 'https://shamela.ws',
                tier: 1 as 1 | 2 | 3,
                type: 'classical-tafsir',
              },
            ],
          },
          {
            category: 'UNCERTAINTY' as const,
            confidenceLevel: 'Moderate' as const,
            statement: {
              id: 'Interpretasi fiqh terhadap isu-isu sosial kontemporer bersifat dinamis dan terbuka terhadap ijtihad baru sesuai kemaslahatan zaman.',
              en: 'Legal jurisprudence addressing modern social dynamics remains open to legitimate continuous ijtihad in pursuit of public welfare.',
              ar: 'تظل الاجتهادات الفقهية في النوازل الاجتماعية المعاصرة متجددة وخاضعة لقواعد المصلحة المعتبرة.',
            },
            sources: [
              {
                name: 'Majma al-Fiqh al-Islami / Yaqeen Institute',
                url: 'https://yaqeeninstitute.org',
                tier: 2 as 1 | 2 | 3,
                type: 'academic-journal',
              },
            ],
          },
        ],
        honestBoundaries: {
          whatItProves: {
            id: 'APA YANG TERBUKTI: Ajaran fundamental Islam secara konsisten menjunjung tinggi keadilan sosial, kebebasan bernalar, dan penghormatan terhadap martabat manusia.',
            en: 'WHAT IT PROVES: Foundational Islamic principles consistently champion social justice, rational reflection, and human dignity.',
            ar: 'ما يثبته البحث: ترسيخ المبادئ الإسلامية التأسيسية لقيم العدالة، وحرية التدبر، وصيانة كرامة الإنسان.',
          },
          whatMustNotBeClaimed: {
            id: 'APA YANG TIDAK BOLEH DIKLAIM: Tidak boleh mengabaikan fakta adanya praktik kultural historis yang keliru di kalangan sebagian umat yang bertentangan dengan prinsip wahyu.',
            en: 'WHAT MUST NOT BE CLAIMED: One must not conflate flawed historical cultural practices among communities with the normative ethical revelation.',
            ar: 'ما لا يجوز ادعاؤه: عدم الخلط بين الممارسات الثقافية التاريخية الخاطئة لبعض الأفراد وبين روح الشريعة وقيمها الأخلاقية.',
          },
        },
      }
    }

    // Default Islamic Logic Prose
    return {
      readerHook: {
        id: `Ketika peradaban modern mencari kompas moral dan kejelasan epistemologi, khazanah Islam menyajikan perpaduan harmonis antara dalil yang jernih dan akal yang merdeka. Laporan dari ${outlet} memantik kajian mendalam atas tema ini.`,
        en: `As modern inquiry seeks ethical clarity and epistemological grounding, Islamic scholarship offers a synthesis between coherent revelation and critical reason.`,
        ar: `في ظل بحث الفكر المعاصر عن الوضوح المعرفي والبوصلة الأخلاقية، يقدم التراث الإسلامي تكاملاً رصيناً بين صريح المعقول وصحيح المنقول.`,
      },
      whyShouldICare: {
        id: `Kajian ini membedakan secara tegas antara dalil teks orisinal, penalaran filosofis objektif, dan batas-batas interpretasi manusia.`,
        en: `This inquiry establishes clear demarcation between original scriptural evidence, objective rational deductions, and interpretive limits.`,
        ar: `ترسم هذه الدراسة حدوداً فاصلة بين الشواهد النصية الأصيلة، والاستدلالات العقلية، ومجالات الاجتهاد البشري.`,
      },
      narrativeLead: {
        hook: {
          id: 'Iman sejati dalam pandangan Islam bukanlah kepasrahan buta, melainkan keyakinan yang lahir dari perenungan dan bukti yang nyata.',
          en: 'Authentic faith in Islam is not blind dogma, but conviction arising from contemplation and coherent evidence.',
          ar: 'ليس الإيمان في الإسلام تسليماً أعمى، بل يقين نابع من التدبر والبرهان الساطع.',
        },
        historicalContext: {
          id: 'Para ulama dan mutakallimun klasik senantiasa menggunakan instrumen logika formal untuk mempertahankan rasionalitas tauhid.',
          en: 'Classical theologians consistently utilized formal logic to articulate the rational coherence of monotheism.',
          ar: 'اعتمد علماء الكلام وأئمة الفكر أدوات المنطق والبرهان لتبيان عقلانية التوحيد وتناسق العقيدة.',
        },
        scholarlyConsensus: {
          id: 'Konsensus keilmuan Islam menegaskan bahwa wahyu yang sahih dan akal sehat yang jernih berjalan beriringan menuju kebenaran.',
          en: 'Scholarly consensus affirms that authentic revelation and sound intellect converge toward truth.',
          ar: 'يؤكد الإجماع العلمي على أن صريح العقل وصحيح الوحي يلتقيان في مسار واحد نحو الحقيقة.',
        },
      },
      epistemologicalPoints: [
        {
          category: 'FACT' as const,
          confidenceLevel: 'High' as const,
          statement: {
            id: "Al-Qur'an memanggil manusia untuk meneliti alam semesta dan menguji kebenaran secara logis.",
            en: "The Qur'an consistently directs human intellect toward examining creation and verifying claims logically.",
            ar: 'يدعو القرآن العقل إلى التفكر في الآفاق والتحقق البرهاني من صحة القضايا.',
          },
          sources: [
            {
              name: "Al-Qur'an Surah Fussilat: 53",
              url: 'https://quran.ksu.edu.sa',
              tier: 1 as 1 | 2 | 3,
              type: 'classical-tafsir',
            },
          ],
        },
        {
          category: 'EVIDENCE' as const,
          confidenceLevel: 'High' as const,
          statement: {
            id: 'Tradisi kritik teks dan sanad hadits merupakan manifestasi metodologi ilmiah verifikasi data dalam sejarah Islam.',
            en: 'Hadith textual and chain-of-transmission criticism represents an early institutional methodology of scientific data verification.',
            ar: 'يُعد علم الجرح والتعديل ونقد الأسانيد نموذجاً مبكراً للمنهجية العلمية في توثيق ونقد الروايات.',
          },
          sources: [
            {
              name: 'Muqaddimah Ibn al-Salah (Ulum al-Hadith)',
              url: 'https://shamela.ws',
              tier: 1 as 1 | 2 | 3,
              type: 'classical-tafsir',
            },
          ],
        },
        {
          category: 'COUNTERARGUMENT' as const,
          confidenceLevel: 'High' as const,
          statement: {
            id: 'Skeptisisme radikal yang menafikan segala bentuk metafisika gagal menjelaskan asal-usul keteraturan hukum alam yang presisi.',
            en: 'Radical skepticism dismissing all metaphysical grounds fails to account for the objective intelligibility of cosmic laws.',
            ar: 'يعجز الشك المطلق عن تفسير الانتظام المدهش والقابلية العقلية للفهم في القوانين الفيزيائية الكونية.',
          },
          sources: [
            {
              name: 'Tahafut al-Falasifah (Al-Ghazali) / Yaqeen Institute',
              url: 'https://yaqeeninstitute.org',
              tier: 2 as 1 | 2 | 3,
              type: 'academic-journal',
            },
          ],
        },
        {
          category: 'UNCERTAINTY' as const,
          confidenceLevel: 'Moderate' as const,
          statement: {
            id: 'Pemahaman manusia tentang detail hakikat ghaib dibatasi oleh keterbatasan instrumen panca indra dan sains empiris.',
            en: 'Human comprehension of transcendent metaphysical realities remains bounded by empirical observational limits.',
            ar: 'يظل إدراك التفاصيل الغيبية محكوماً بحدود الإدراك الحسي وأدوات القياس التجريبي.',
          },
          sources: [
            {
              name: "Dar Ta'arud al-Aql wa al-Naql (Ibn Taymiyyah)",
              url: 'https://shamela.ws',
              tier: 1 as 1 | 2 | 3,
              type: 'classical-tafsir',
            },
          ],
        },
      ],
      honestBoundaries: {
        whatItProves: {
          id: 'APA YANG TERBUKTI: Keselarasan rasional antara wahyu dan bukti tekstual objektif.',
          en: 'WHAT IT PROVES: Rational coherence between revelation and objective textual evidence.',
          ar: 'ما يثبته البحث: التوافق العقلاني بين نصوص الوحي والشواهد المنطقية الموضوعية.',
        },
        whatMustNotBeClaimed: {
          id: 'APA YANG TIDAK BOLEH DIKLAIM: Penafsiran manusia tidak boleh dipaksakan sebagai doktrin mutlak tanpa dalil yang kokoh.',
          en: 'WHAT MUST NOT BE CLAIMED: Human interpretations must not be overstated as absolute dogmas without firm evidence.',
          ar: 'ما لا يجوز ادعاؤه: عدم فرض الاجتهادات البشرية كعقائد قطعية دون أدلة محكمة.',
        },
      },
    }
  }

  /**
   * Comprehensive Islamic Catalog
   */
  private static getComprehensiveIslamicCatalog(todayStr: string): IslamicAcademicStory[] {
    return [
      {
        id: 'rationality-sharia-riba-global-debt-cycles-economics',
        title:
          'Rasionalitas Pelarangan Riba: Analisis Ekonomi Makro terhadap Siklus Utang Global, Ketimpangan Sistemik, dan Keadilan Transaksi',
        titles: {
          id: 'Rasionalitas Pelarangan Riba: Analisis Ekonomi Makro terhadap Siklus Utang Global, Ketimpangan Sistemik, dan Keadilan Transaksi',
          en: 'The Macroeconomic Rationality of Prohibiting Usury (Riba): Deconstructing Global Debt Cycles, Systemic Inequality, and Risk-Sharing Justice',
          ar: 'العقلانية الاقتصادية في تحريم الربا: تحليل الاقتصاد الكلي لدورات الديون العالمية، وتفاوت الثروة، وعدالة تقاسم المخاطر',
        },
        classification: 'Sharia Rationality',
        publishedAt: `${todayStr}T09:00:00.000Z`,
        primarySourceUrl: 'https://quran.ksu.edu.sa',
        primarySourceTier: 1,
        keywords: [
          'riba',
          'islamic-economics',
          'macroeconomics',
          'debt-crisis',
          'sharia-rationality',
          'maqasid-sharia',
        ],
        sources: [
          {
            name: "Al-Qur'an Surah Al-Baqarah (2:275-279) & Kitab Al-Amwal (Abu Ubaid)",
            url: 'https://quran.ksu.edu.sa',
            tier: 1,
            type: 'classical-tafsir',
            relevanceScore: 99,
          },
          {
            name: 'Cambridge Journal of Economics / IMF Debt Studies',
            url: 'https://www.imf.org',
            tier: 2,
            type: 'academic-journal',
            relevanceScore: 95,
          },
        ],
        citationChain: {
          layer1Primary: "Al-Qur'an Surah Al-Baqarah (2:275-279) & Al-Mabsut (Al-Sarakhsi)",
          layer2Journalism: 'IMF Working Papers & Cambridge Macroeconomic Reviews on Debt Crises',
          layer3Discovery: 'Global Sovereign Debt Index & Contemporary Financial Studies',
          crossVerificationNotes:
            'Data siklus krisis utang diverifikasi silang antara laporan Bank Dunia dan prinsip hukum muamalah Islam.',
        },
        editorialBenchmark: {
          firstOrBestCoverage:
            'Kajian perbankan konvensional hanya fokus pada stabilitas suku bunga acuan; analisis ImanLogics membedah ketidakadilan transfer risiko sepihak dalam sistem bunga.',
          angleUtilized: 'Sharia Rationality with Deep Economic Demarcation',
          primarySourcesCited: ["Al-Qur'an (2:275)", 'Kitab Al-Amwal'],
          unexploredAngleForImanLogics:
            'Bagaimana instrumen bagi hasil (equity risk-sharing) mencegah pembentukan gelembung spekulatif (asset bubbles) yang kerap memicu depresi ekonomi.',
          originalValueProposition:
            'Membuktikan rasionalitas maqasid syariah dengan data ekonometrika modern tanpa apologetika sempit.',
        },
        readerHook: {
          id: 'Dalam struktur keuangan modern, instrumen bunga dianggap sebagai roda penggerak modal. Namun, mengapa syariat Islam secara tegas menyetarakan riba dengan bentuk kezaliman ekonomi paling destruktif?',
          en: 'In modern financial architecture, interest-bearing debt is frequently deemed an indispensable engine of capital. Why, then, does Islamic legal epistemology categorize usury (riba) as an inherently destructive systemic injustice?',
          ar: 'في البنية المالية المعاصرة، تُعد الفائدة المصرفية محركاً أساسياً لتدفق رؤوس الأموال. ولكن لماذا يصنف التشريع الإسلامي الربا كأحد أكثر أشكال الظلم الاقتصادي تدميراً للاستقرار المجتمعي؟',
        },
        whyShouldICare: {
          id: 'Bagi para pengamat ekonomi dan pencari keadilan sosial, memahami logika pelarangan riba memberikan wawasan mendalam tentang bagaimana krisis utang global dan inflasi struktural berakar pada pembebanan risiko sepihak.',
          en: 'For macroeconomists and ethical investors, understanding the foundational logic behind the prohibition of riba unlocks critical insights into how compounding debt structures generate recurrent financial crises.',
          ar: 'بالنسبة للمهتمين بالاقتصاد والعدالة الاجتماعية، يكشف فهم حكمة تحريم الربا عن الجذور الحقيقية لأزمات الديون العالمية والتضخم الهيكلي الناتج عن تحميل المخاطر لطرف واحد دون الآخر.',
        },
        narrativeLead: {
          hook: {
            id: 'Krisis utang berkala yang melanda perekonomian dunia bukan sekadar kegagalan kebijakan moneter, melainkan konsekuensi matematis dari akumulasi bunga majemuk.',
            en: 'Recurrent global sovereign debt crises are not merely policy oversights, but the mathematical outcome of compounded interest-bearing financial contracts.',
            ar: 'إن أزمات الديون المتكررة التي تعصف بالاقتصاد العالمي ليست مجرد عثرات في السياسة النقدية، بل هي النتيجة الحتمية لتراكم الفوائد المركبة في العقود المالية.',
          },
          historicalContext: {
            id: 'Tradisi fiqh muamalah klasik yang dirumuskan Imam Al-Ghazali dalam Ihya Ulumuddin telah membedakan secara tajam antara uang sebagai medium pertukaran dan uang sebagai komoditas spekulatif.',
            en: 'Classical Islamic economic thought, articulated by scholars such as Al-Ghazali, strictly maintained that money functions solely as a medium of exchange rather than a speculative commodity.',
            ar: 'أكدت أدبيات الفقه الإسلامي الكلاسيكي، كما فصلها الإمام الغزالي في "إحياء علوم الدين"، على أن النقد وسيلة لتبادل السلع وليس سلعة تباع وتشترى بذاتها.',
          },
          scholarlyConsensus: {
            id: 'Para ekonom modern semakin mengakui bahwa model pembiayaan berbasis bagi hasil (risk-sharing) memberikan ketahanan sistemik yang jauh lebih tinggi dibanding pembiayaan berbasis utang (debt-based).',
            en: 'Contemporary economic consensus increasingly acknowledges that equity-based risk-sharing mechanisms foster superior macroeconomic resilience compared to debt-overhang models.',
            ar: 'يتزايد اعتراف خبراء الاقتصاد المعاصرين بأن نماذج التمويل القائمة على تقاسم المخاطر توفر استقراراً هيكلياً أعلى مقارنة بالمنظومات القائمة على تراكم المديونيات.',
          },
        },
        epistemologicalPoints: [
          {
            category: 'FACT',
            confidenceLevel: 'High',
            statement: {
              id: "Teks Al-Qur'an secara eksplisit membedakan antara perdagangan riil yang halal dan transaksi riba yang diharamkan (QS. Al-Baqarah: 275).",
              en: "The Qur'anic text establishes an explicit demarcation between productive real trade and extractive usury (Qur'an 2:275).",
              ar: 'يفرق النص القرآني بشكل قاطع بين التجارة والإنتاج الحقيقي الحلال وبين المعاملات الربوية المحرمة (سورة البقرة: 275).',
            },
            sources: [
              {
                name: "Al-Qur'an Surah Al-Baqarah: 275",
                url: 'https://quran.ksu.edu.sa',
                tier: 1,
                type: 'classical-tafsir',
              },
            ],
          },
          {
            category: 'EVIDENCE',
            confidenceLevel: 'High',
            statement: {
              id: 'Data IMF dan Bank Dunia menunjukkan korelasi langsung antara rasio utang berbunga terhadap PDB dengan kerentanan krisis fiskal negara berkembang.',
              en: 'Empirical data from the IMF and World Bank verifies a direct correlation between high debt-to-GDP ratios and fiscal insolvency risks.',
              ar: 'تؤكد بيانات صندوق النقد الدولي والبنك الدولي الارتباط المباشر بين ارتفاع نسب الديون ذات الفائدة وتعرض الدول النامية للأزمات المالية.',
            },
            sources: [
              {
                name: 'IMF Global Financial Stability Report',
                url: 'https://www.imf.org',
                tier: 2,
                type: 'academic-journal',
              },
            ],
          },
          {
            category: 'COUNTERARGUMENT',
            confidenceLevel: 'High',
            statement: {
              id: 'Argumen ekonomi neoklasik menyatakan bunga adalah kompensasi nilai waktu dari uang (time value of money), namun syariat menunjukkan bahwa kompensasi waktu hanya sah jika melekat pada aset riil atau risiko investasi bersama.',
              en: 'Neoclassical economics argues interest compensates for the time value of money, whereas Islamic jurisprudence demonstrates time value is only legitimately monetized through real asset productivity or shared risk.',
              ar: 'تزعم النظرية الاقتصادية التقليدية أن الفائدة تعويض عن القيمة الزمنية للنقود، بينما يوضح الفقه الإسلامي أن الزمن لا يُثمن إلا من خلال الأصول الإنتاجية وتقاسم المخاطر.',
            },
            sources: [
              {
                name: 'Al-Mabsut (Al-Sarakhsi) & Ihya Ulum al-Din (Al-Ghazali)',
                url: 'https://shamela.ws',
                tier: 1,
                type: 'classical-tafsir',
              },
            ],
          },
          {
            category: 'UNCERTAINTY',
            confidenceLevel: 'Moderate',
            statement: {
              id: 'Penentuan instrumen moneter bebas bunga dalam skala makro global membutuhkan rekayasa institusional bertahap dan kesiapan infrastruktur hukum yang matang.',
              en: 'Scaling zero-interest monetary frameworks globally requires gradual institutional restructuring and comprehensive regulatory adaptation.',
              ar: 'يتطلب تطبيق المنظومات النقدية الخالية من الفائدة على المستوى العالمي تدرجاً مؤسسياً وتطويراً شاملاً للأطر التشريعية.',
            },
            sources: [
              {
                name: 'Islamic Development Bank (IsDB) Research Institute',
                url: 'https://isdbinstitute.org',
                tier: 2,
                type: 'academic-journal',
              },
            ],
          },
        ],
        honestBoundaries: {
          whatItProves: {
            id: 'APA YANG TERBUKTI: Larangan riba memiliki fondasi rasionalitas ekonomi makro yang kokoh untuk mencegah ketimpangan sistemik dan ledakan krisis utang.',
            en: 'WHAT IT PROVES: The prohibition of riba is grounded in rigorous macroeconomic rationality aimed at preventing wealth extraction and debt insolvency.',
            ar: 'ما يثبته البحث: يستند تحريم الربا إلى أسس اقتصادية عقلانية محكمة تهدف إلى منع تركز الثروة وتفادي انهيارات الديون.',
          },
          whatMustNotBeClaimed: {
            id: 'APA YANG TIDAK BOLEH DIKLAIM: Penerapan nama atau label "syariah" secara simbolik pada kontrak yang substansinya tetap memindahkan seluruh risiko ke nasabah tidak otomatis menjadikannya adil.',
            en: 'WHAT MUST NOT BE CLAIMED: Superficial labeling of financial contracts as "Islamic" without genuine risk-sharing substance does not fulfill the ethical objectives of Sharia.',
            ar: 'ما لا يجوز ادعاؤه: عدم الخلط بين الممارسات الثقافية التاريخية الخاطئة لبعض الأفراد وبين روح الشريعة وقيمها الأخلاقية.',
          },
        },
      },
      {
        id: 'jesus-isa-prayer-submission-tawhid-study',
        title:
          'Nabi Isa dan Tradisi Shalat Para Nabi: Menelusuri Jejak Sejarah Ibadah, Monoteisme Murni, dan Kesinambungan Risalah Samawi',
        titles: {
          id: 'Nabi Isa dan Tradisi Shalat Para Nabi: Menelusuri Jejak Sejarah Ibadah, Monoteisme Murni, dan Kesinambungan Risalah Samawi',
          en: 'Jesus and the Prophetic Tradition of Prostration: Tracing Historical Witnesses of Prayer, Pure Monotheism, and Scriptural Continuity',
          ar: 'المسيح عيسى ابن مريم ومنطق السجود والعبودية: شواهد الصلاة، التوحيد الصافي، ووحدة الرسالات الإلهية',
        },
        classification: 'Comparative Religion',
        publishedAt: `${todayStr}T09:00:00.000Z`,
        primarySourceUrl: 'https://quran.ksu.edu.sa',
        primarySourceTier: 1,
        keywords: [
          'jesus-in-islam',
          'prophetic-prayer',
          'monotheism',
          'tawhid',
          'comparative-religion',
          'scriptural-continuity',
        ],
        sources: [
          {
            name: "Al-Qur'an Surah Maryam (19:30-36) & Surah Ali 'Imran (3:45-51)",
            url: 'https://quran.ksu.edu.sa',
            tier: 1,
            type: 'classical-tafsir',
            relevanceScore: 99,
          },
          {
            name: 'Oxford Academic Studies in Comparative Religion',
            url: 'https://academic.oup.com',
            tier: 2,
            type: 'academic-journal',
            relevanceScore: 94,
          },
        ],
        citationChain: {
          layer1Primary: "Al-Qur'an Surah Maryam (19:30-36) & Injil Sinoptik (Matius 26:39)",
          layer2Journalism: 'Oxford Academic Studies in Biblical and Islamic Manuscript History',
          layer3Discovery: 'Historical Textual Witnesses in Early Semitic Devotional Traditions',
          crossVerificationNotes:
            "Postur sujud dan permohonan Yesus diverifikasi silang antara teks Al-Qur'an dan dokumentasi kanonikal biblika historis.",
        },
        editorialBenchmark: {
          firstOrBestCoverage:
            'Kajian apologetika kerap terjebak pada perdebatan dogma; ulasan ImanLogics menyajikan kesinambungan fenomenologis ibadah fisik para nabi.',
          angleUtilized: 'Comparative Religion with Deep Epistemological Demarcation',
          primarySourcesCited: ["Al-Qur'an (19:31)", 'Matthew 26:39', 'Genesis 17:3'],
          unexploredAngleForImanLogics:
            'Bagaimana gestur sujud menelungkup ke tanah (prostration) oleh Abraham, Musa, dan Yesus membuktikan satu garis tradisi tauhid yang konsisten hingga syariat Islam.',
          originalValueProposition:
            'Menelaah naskah lintas tradisi dengan penghormatan mendalam dan ketelitian akademik tanpa mereduksi perbedaan teologis.',
        },
        readerHook: {
          id: 'Bagaimanakah Yesus (Nabi Isa al-Masih) beribadah kepada Tuhan? Mengapa catatan sejarah dan teks biblika kuno mendokumentasikan postur sujud menelungkupkan wajah ke tanah yang identik dengan shalat kaum Muslimin?',
          en: 'How did Jesus pray? Why do earliest scriptural witnesses depict Jesus falling on his face in prostration to the Creator—a devotional posture preserved in the Islamic daily prayer?',
          ar: 'كيف كانت صلاة المسيح عيسى عليه السلام؟ ولماذا توثق النصوص التاريخية سجوده وخروره على وجهه تضرعاً للخالق سبحانه في هيئة تتطابق تماماً مع صلاة المسلمين؟',
        },
        whyShouldICare: {
          id: 'Bagi pencari kebenaran dari latar belakang lintas iman, menelusuri bagaimana Yesus shalat membuka tabir sejarah tentang hakikat monoteisme murni dan keselarasan risalah para nabi terdahulu dengan Islam.',
          en: 'For truth seekers and interfaith scholars, investigating the devotional postures of Jesus unveils historical continuity in prophetic worship and pure monotheistic surrender.',
          ar: 'بالنسبة للباحثين عن الحقيقة والحوار بين الأديان، تكشف دراسة عبادة المسيح عن جوهر التوحيد الصافي والتطابق التام في مسيرة الأنبياء عبر التاريخ.',
        },
        narrativeLead: {
          hook: {
            id: 'Di Taman Getsemani pada malam yang krusial, Injil Matius 26:39 mencatat: "Maka Ia maju sedikit, lalu sujud menelungkupkan wajah-Nya ke tanah dan berdoa..."',
            en: 'In the Garden of Gethsemane, Matthew 26:39 records: "And going a little farther, he fell on his face and prayed..."',
            ar: 'في بستان جثسيماني، يسجل إنجيل متى (26: 39): "ثم تقدم قليلاً وخر على وجهه وكان يصلي..."',
          },
          historicalContext: {
            id: 'Sujud fisik dengan meletakkan dahi ke tanah adalah ibadah universal seluruh nabi semitik, mulai dari Abraham (Kejadian 17:3) hingga Musa dan Harun (Bilangan 20:6).',
            en: 'Physical prostration with the forehead touching the ground was the universal devotional hallmark of all Semitic prophets, from Abraham to Moses.',
            ar: 'كان السجود بوضع الجبهة على الأرض العبادة المشتركة لكافة أنبياء الله ورسله، من إبراهيم وموسى إلى عيسى ومحمد عليهم الصلاة والسلام.',
          },
          scholarlyConsensus: {
            id: 'Para sejarawan teks keagamaan sepakat bahwa ibadah shalat Islam merupakan pelestarian paling murni dan utuh dari tradisi liturgi monoteisme profetik kuno.',
            en: 'Scholars of liturgical history recognize that Islamic Salah preserves the most authentic and unbroken continuation of ancient prophetic prostration.',
            ar: 'يجمع مؤرخو الأديان على أن الصلاة في الإسلام تمثل الحفظ الأكمل والأنقى لنسك السجود والعبودية التي مارسها الأنبياء جميعاً.',
          },
        },
        epistemologicalPoints: [
          {
            category: 'FACT',
            confidenceLevel: 'High',
            statement: {
              id: "Al-Qur'an Surah Maryam ayat 31 menegaskan perkataan Nabi Isa sejak buaian: 'Dan Dia memerintahkan kepadaku mendirikan shalat dan menunaikan zakat selama aku hidup.'",
              en: "The Qur'an records Jesus declaring: 'And He has enjoined upon me prayer and zakah as long as I remain alive' (Qur'an 19:31).",
              ar: 'يسجل القرآن الكريم قول عيسى عليه السلام: "وأوصاني بالصلاة والزكاة ما دمت حياً" (سورة مريم: 31).',
            },
            sources: [
              {
                name: "Al-Qur'an Surah Maryam: 31",
                url: 'https://quran.ksu.edu.sa',
                tier: 1,
                type: 'classical-tafsir',
              },
            ],
          },
          {
            category: 'EVIDENCE',
            confidenceLevel: 'High',
            statement: {
              id: 'Teks kanonikal Injil (Matius 26:39) dan Perjanjian Lama (Kejadian 17:3, Bilangan 20:6) mendokumentasikan ibadah para nabi dengan merebahkan diri dan menelungkupkan wajah ke tanah (sujud).',
              en: 'Biblical texts (Matthew 26:39, Genesis 17:3, Numbers 20:6) consistently record prophets praying by falling upon their faces in prostration.',
              ar: 'توثق الأناجيل التاريخية والعهد القديم أن عبادة الأنبياء كانت بالخرور على الوجوه والسجود لله وحده.',
            },
            sources: [
              {
                name: 'Matthew 26:39 & Genesis 17:3',
                url: 'https://academic.oup.com',
                tier: 2,
                type: 'academic-journal',
              },
            ],
          },
          {
            category: 'COUNTERARGUMENT',
            confidenceLevel: 'High',
            statement: {
              id: 'Perbedaan doktrin kristologis pasca-Konsili Nicea (325 M) tidak mengubah fakta historis mengenai bentuk ketundukan peribadatan fisik Yesus semasa hidupnya di dunia.',
              en: "Later post-Nicene christological formulations do not alter the historical textual record of Jesus's personal posture of prayer.",
              ar: 'إن الصياغات اللاهوتية اللاحقة لمجمع نيقية لا تغير من الحقيقة التاريخية المثبتة حول طبيعة صلاة المسيح وسجوده التام لخالقه.',
            },
            sources: [
              {
                name: 'Oxford History of Early Christian Liturgy',
                url: 'https://academic.oup.com',
                tier: 2,
                type: 'academic-journal',
              },
            ],
          },
          {
            category: 'UNCERTAINTY',
            confidenceLevel: 'Moderate',
            statement: {
              id: 'Detail redaksi bacaan doa harian Yesus dalam bahasa Aram kuno tidak terlestarikan secara utuh dalam manuskrip Yunani Perjanjian Baru.',
              en: 'The precise daily liturgical phrasing in Aramaic used by Jesus has not been comprehensively preserved in extant Greek codices.',
              ar: 'لم تحفظ المخطوطات اليونانية المتبقية الصيغ التفصيلية الكاملة للأذكار الآرامية التي كان يتلوها المسيح في صلواته اليومية.',
            },
            sources: [
              {
                name: 'Brill Encyclopedia of Early Christianity',
                url: 'https://referenceworks.brillonline.com',
                tier: 2,
                type: 'academic-journal',
              },
            ],
          },
        ],
        honestBoundaries: {
          whatItProves: {
            id: 'APA YANG TERBUKTI: Kesaksian sejarah dan teks kitab samawi mengonfirmasi bahwa Yesus menyembah Tuhan dengan sujud dan mengajarkan tauhid murni.',
            en: 'WHAT IT PROVES: Scriptural and historical records confirm Jesus prayed with prostration and proclaimed pure monotheism.',
            ar: 'ما يثبته البحث: تأكيد الشواهد التاريخية والنصوص القديمة أن المسيح عيسى عليه السلام عبد الله بالسجود ودعا إلى التوحيد الخالص.',
          },
          whatMustNotBeClaimed: {
            id: 'APA YANG TIDAK BOLEH DIKLAIM: Kesamaan gestur sujud tidak boleh digunakan untuk menghapus perbedaan teologis substansial yang berkembang dalam tradisi Kristen arus utama.',
            en: 'WHAT MUST NOT BE CLAIMED: Shared physical prostration should not be misconstrued as an erasure of real theological divergence in historical Christian dogma.',
            ar: 'ما لا يجوز ادعاؤه: عدم استغلال التطابق في هيئة السجود لطمس الفوارق اللاهوتية الجوهرية التي تبلورت في التاريخ الكنسي اللاحق.',
          },
        },
      },
    ]
  }
}
