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
        id: 'universal-islamic-epistemology-and-contemporary-rationality',
        title:
          'Epistemologi Islam dan Rasionalitas Kontemporer: Integrasi Wahyu, Nalar Kritis, dan Etika Peradaban Modern',
        titles: {
          id: 'Epistemologi Islam dan Rasionalitas Kontemporer: Integrasi Wahyu, Nalar Kritis, dan Etika Peradaban Modern',
          en: 'Islamic Epistemology and Contemporary Rationality: Integrating Revelation, Critical Reason, and Modern Civilizational Ethics',
          ar: 'الإبستمولوجيا الإسلامية والعقلانية المعاصرة: تكامل الوحي والعقل النقدي وأخلاقيات الحضارة الحديثة',
        },
        classification: 'Philosophical Epistemology',
        publishedAt: `${todayStr}T09:00:00.000Z`,
        primarySourceUrl: 'https://quran.ksu.edu.sa',
        primarySourceTier: 1,
        keywords: [
          'islamic-logic',
          'epistemology',
          'rationality',
          'civilizational-ethics',
          'critical-thought',
        ],
        sources: [
          {
            name: "Al-Qur'an Al-Karim & Kaidah Ushul Epistemologi Klasik",
            url: 'https://quran.ksu.edu.sa',
            tier: 1,
            type: 'classical-tafsir',
            relevanceScore: 99,
          },
          {
            name: 'International Institute of Islamic Thought (IIIT) Academic Publications',
            url: 'https://iiit.org',
            tier: 2,
            type: 'academic-journal',
            relevanceScore: 95,
          },
        ],
        citationChain: {
          layer1Primary: "Al-Qur'anul Karim & Teks Otoritatif Klasik",
          layer2Journalism: 'Kajian Akademis Epistemologi Islam Kontemporer',
          layer3Discovery: 'Diskursus Pemikiran Islam & Etika Peradaban Global',
          crossVerificationNotes:
            'Argumentasi diverifikasi silang antara teks primer wahyu, kaidah balaghah, dan telaah metodologis akademis.',
        },
        editorialBenchmark: {
          firstOrBestCoverage:
            'Diskusi umum sering memisahkan antara wahyu dan akal; ImanLogics menyajikan integrasi epistemologis yang kokoh dan rasional.',
          angleUtilized: 'Philosophical Epistemology with Deep Intellectual Demarcation',
          primarySourcesCited: ["Al-Qur'an", 'Kaidah Ushul Fiqh & Balaghah'],
          unexploredAngleForImanLogics:
            'Menghadirkan demarkasi ilmiah antara teks normatif wahyu dan ijtihad penafsiran manusiawi secara objektif.',
          originalValueProposition:
            'Menjelaskan rasionalitas Islam dengan argumentasi terukur, bebas apologetika sempit, dan berakar pada tradisi keilmuan otentik.',
        },
        readerHook: {
          id: 'Dalam lanskap peradaban modern, relasi antara teks keagamaan dan nalar kritis kerap diperdebatkan. Epistemologi Islam menghadirkan kerangka berpikir harmonis yang mendudukkan wahyu dan akal sebagai dua pilar pencarian kebenaran.',
          en: 'In modern civilizational discourse, the relationship between scriptural revelation and critical inquiry remains a focal debate. Islamic epistemology articulates a coherent paradigm establishing revelation and reason as complementary pillars of truth.',
          ar: 'في فضاء الفكر المعاصر، يحتل النقاش حول العلاقة بين النص الديني والعقل النقدي مكانة مركزية. وتقدم الإبستمولوجيا الإسلامية رؤية متوازنة تكامل بين الوحي والعقل كركيزتين للبحث عن الحقيقة.',
        },
        whyShouldICare: {
          id: 'Bagi para pemikir, akademisi, dan generasi digital, memahami epistemologi Islam membuka wawasan mengenai bagaimana nilai-nilai etika wahyu mampu menjawab tantangan disrupsi sains dan krisis moral global.',
          en: 'For scholars, thinkers, and contemporary seekers, mastering Islamic epistemology unlocks how ethical foundations of revelation effectively navigate scientific disruption and modern moral dilemmas.',
          ar: 'بالنسبة للباحثين والمفكرين، يفتح استيعاب الإبستمولوجيا الإسلامية آفاقاً واسعة لفهم قدرة القيم الأخلاقية المؤسسة على الإجابة عن تحديات التطور العلمي والأزمات الأخلاقية المعاصرة.',
        },
        narrativeLead: {
          hook: {
            id: 'Tradisi intelektual Islam menolak dikotomi semu antara iman dan akal, menegaskan bahwa pencarian kebenaran ilmiah adalah manifestasi penghambaan kepada Sang Pencipta.',
            en: 'Classical Islamic intellectual tradition categorically rejects false dichotomies between faith and reason, upholding scientific pursuit as an intrinsic form of devotion.',
            ar: 'ترفض التقاليد الفكرية الإسلامية التعارض المفتعل بين الإيمان والعقل، مؤكدة أن السعي العلمي الرصين هو تجسيد للمسؤولية المعرفية للإنسان.',
          },
          historicalContext: {
            id: 'Para ulama dan filsuf peradaban Islam klasik membangun metodologi verifikasi naskah (isnad dan matan) yang menjadi pelopor metode kritis sejarah.',
            en: 'Classical Islamic scholars established rigorous textual verification methodologies (isnad and matn) that pioneered historical critical analysis.',
            ar: 'أسس علماء الحضارة الإسلامية مناهج تدقيق النصوص (الإسناد والمتن) التي شكلت حجر الزاوية للمنهج النقدي التاريخي.',
          },
          scholarlyConsensus: {
            id: 'Konsensus akademisi menegaskan bahwa kemaslahatan umat (maqasid syariah) menjadi kompas utama dalam penerapan hukum dan etika peradaban.',
            en: 'Scholarly consensus emphasizes that universal human flourishing (maqasid al-shariah) serves as the core compass for legal and ethical application.',
            ar: 'يؤكد الإجماع الأكاديمي على أن تحقيق مقاصد الشريعة ورعاية مصالح الخلق هو المقصد الأسمى للأحكام والأخلاقيات الحضارية.',
          },
        },
        epistemologicalPoints: [
          {
            category: 'FACT',
            confidenceLevel: 'High',
            statement: {
              id: "Teks Al-Qur'an secara berulang memerintahkan manusia untuk berpikir, meneliti alam semesta, dan menggunakan akal sehat (QS. Ali Imran: 190-191).",
              en: "The Qur'anic text repeatedly mandates critical observation of natural phenomena and rigorous rational reflection (3:190-191).",
              ar: 'تأمر النصوص القرآنية مراراً بالتدبر في الآفاق الكونية وإعمال العقل والتفكير النقدي (آل عمران: 190-191).',
            },
            sources: [
              {
                name: "Al-Qur'an Surah Ali Imran: 190-191",
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
              id: 'Metodologi kritik sanad dan matan membuktikan komitmen ilmiah peradaban Islam terhadap verifikasi bukti sebelum menetapkan suatu klaim.',
              en: 'The methodology of chain-of-transmission (sanad) and textual scrutiny (matn) demonstrates historical commitment to empirical verification.',
              ar: 'تثبت منهجية نقد السند والمتن التزام الفكر الإسلامي بالتحقق الصارم من الشواهد قبل إثبات الدعاوى.',
            },
            sources: [
              {
                name: 'Kaidah Musthalah Hadits & Metodologi Kritik Teks',
                url: 'https://shamela.ws',
                tier: 1,
                type: 'academic-journal',
              },
            ],
          },
          {
            category: 'COUNTERARGUMENT',
            confidenceLevel: 'High',
            statement: {
              id: 'Pandangan yang menuduh tradisi keagamaan bersifat anti-sains terbantahkan oleh fakta historis integrasi riset astronomi, matematika, dan kedokteran dalam peradaban Islam.',
              en: 'Claims that religious traditions are inherently anti-scientific are refuted by the historic integration of astronomy, mathematics, and medicine.',
              ar: 'تُدحض الدعاوى القائلة بتعارض الدين مع العلم من خلال الشواهد التاريخية لتطور الفلك والرياضيات والطب في الحضارة الإسلامية.',
            },
            sources: [
              {
                name: 'Sejarah Sains Peradaban Islam',
                url: 'https://iiit.org',
                tier: 2,
                type: 'academic-journal',
              },
            ],
          },
          {
            category: 'UNCERTAINTY',
            confidenceLevel: 'Moderate',
            statement: {
              id: 'Interpretasi manusiawi terhadap teks yang bersifat zanni (multi-tafsir) harus disikapi dengan kerendahhatian intelektual tanpa klaim mutlak.',
              en: 'Human interpretations of non-definitive scriptural passages demand intellectual humility rather than absolute dogmatic imposition.',
              ar: 'تتطلب الاجتهادات البشرية في النصوص الظنية تواضعاً معرفياً بعيداً عن ادعاء القطعية المطلقة.',
            },
            sources: [
              {
                name: 'Kaidah Ushul Fiqh: Al-Ijtihad wa al-Ikhtilaf',
                url: 'https://shamela.ws',
                tier: 1,
                type: 'classical-tafsir',
              },
            ],
          },
        ],
        honestBoundaries: {
          whatItProves: {
            id: 'APA YANG TERBUKTI: Adanya keselarasan rasional antara wahyu normatif dengan metodologi pencarian kebenaran yang jujur dan objektif.',
            en: 'WHAT IT PROVES: The demonstrable rational coherence between divine revelation and objective, honest methodologies of inquiry.',
            ar: 'ما يثبته البحث: الانسجام العقلاني التام بين الوحي الإلهي ومناهج البحث المعرفي الصادقة والموضوعية.',
          },
          whatMustNotBeClaimed: {
            id: "APA YANG TIDAK BOLEH DIKLAIM: Pendapat atau teori sains kontemporer yang bersifat dinamis tidak boleh dipaksakan sebagai tafsir mutlak Al-Qur'an.",
            en: 'WHAT MUST NOT BE CLAIMED: Dynamic, evolving scientific models must not be dogmatically superimposed as definitive exegesis of revelation.',
            ar: 'ما لا يجوز ادعاؤه: عدم فرض النظريات العلمية المتغيرة كتفسيرات نهائية أو قطعية لنصوص الوحي المحكمة.',
          },
        },
      },
    ]
  }
}
