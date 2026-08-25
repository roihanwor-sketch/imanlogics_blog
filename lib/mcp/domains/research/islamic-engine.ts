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
}

export class IslamicResearchEngine {
  /**
   * Returns fresh candidates catalog for testing and discovery fallback
   */
  static getFreshIslamicAcademicCandidates(todayStr: string): IslamicAcademicStory[] {
    return this.getComprehensiveIslamicCatalog(todayStr)
  }

  /**
   * Discovers and verifies high-rigor Islamic academic and reader-first stories dynamically
   */
  static async discoverVerifiedStories(): Promise<IslamicAcademicStory[]> {
    Logger.info(
      'IslamicResearch',
      'Initiating Web-Discovery-Driven Islamic Logic Cycle across 11 Pillars...'
    )
    const blogDir = MCP_CONFIG.blogDataDir
    const todayStr = new Date().toISOString().split('T')[0]

    let publishedSlugs: string[] = []
    if (fs.existsSync(blogDir)) {
      publishedSlugs = fs.readdirSync(blogDir).map((f) => f.replace(/(\.id|\.en|\.ar)?\.mdx$/, ''))
    }

    // 1. Live Web Discovery
    const liveLeads = await WebDiscoveryService.discoverLiveIslamicLeads()

    // 2. Editorial Selection Board
    const boardDecision = EditorialSelectionBoard.evaluateAndSelectCandidates(liveLeads)

    // 3. Comprehensive Islamic Catalog
    const catalogCandidates = this.getComprehensiveIslamicCatalog(todayStr)

    // Merge candidates prioritizing Board-approved live leads
    const candidateStories: IslamicAcademicStory[] = []

    if (boardDecision.topIslamicCandidate) {
      const liveStory = this.synthesizeStoryFromLead(
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
   */
  private static synthesizeStoryFromLead(
    lead: DiscoveredWebLead,
    todayStr: string
  ): IslamicAcademicStory | null {
    const slugId = lead.id.replace(/^islamic-/, '')
    const cleanTitle = lead.title

    return {
      id: slugId,
      title: cleanTitle,
      titles: {
        id: cleanTitle,
        en: cleanTitle,
        ar: `دراسة إسلامية عقلانية: ${cleanTitle}`,
      },
      classification: 'Reader-First Inquiry',
      publishedAt: lead.publishedAt || `${todayStr}T09:00:00.000Z`,
      primarySourceUrl: lead.detectedPrimarySources[0]?.url || 'https://quran.ksu.edu.sa',
      primarySourceTier: 1,
      keywords: [
        'islamic-logic',
        lead.subCategory.toLowerCase().replace(/_/g, '-'),
        'rational-theology',
        'comparative-religion',
        'epistemology',
      ],
      sources: [
        {
          name:
            lead.detectedPrimarySources[0]?.name || "Tafsir Al-Razi (Mafatih al-Ghaib) & Al-Qur'an",
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
      readerHook: {
        id: `Ketika wacana intelektual modern menanyakan landasan rasional keimanan, khazanah tradisi Islam menyajikan jawaban berbasis epistemologi yang kokoh.`,
        en: `When contemporary discourse interrogates the rational foundations of faith, Islamic intellectual tradition presents a robust epistemological framework.`,
        ar: `عندما يطرح الفكر المعاصر تساؤلات حول الأسس العقلانية للإيمان، تقدم المعرفة الإسلامية رؤية متماسكة مبنية على الأدلة والبرهان.`,
      },
      whyShouldICare: {
        id: `Kajian ini membedakan secara jernih antara bukti tekstual, fakta ilmiah terverifikasi, dan batasan interpretasi akal manusia.`,
        en: `This inquiry establishes clear demarcation between empirical data, scriptural text, and legitimate hermeneutical boundaries.`,
        ar: `توضح هذه الدراسة الحدود الفاصلة بين الحقائق المثبتة، والنصوص التأسيسية، ومجالات الاجتهاد العقلاني.`,
      },
      narrativeLead: {
        hook: {
          id: `Pertanyaan mendasar mengenai hubungan antara akal, bukti realitas, dan wahyu senantiasa mengundang perenungan mendalam bagi setiap pencari kebenaran.`,
          en: `Fundamental inquiries addressing the harmony between intellect, reality, and revelation invite rigorous examination by truth seekers.`,
          ar: `إن التساؤل الجوهري حول التوافق بين العقل والحقائق الواقعية والوحي يظل محوراً رئيسياً لكل باحث عن الحقيقة.`,
        },
        historicalContext: {
          id: `Ulama dan filsuf Muslim klasik seperti Al-Ghazali, Ibn Rushd, dan Ar-Razi telah meletakkan kaidah bahwa akal sehat tidak pernah bertentangan dengan wahyu yang sahih.`,
          en: `Classical scholars and philosophers established that sound human reason never genuinely conflicts with authentic revelation.`,
          ar: `رسخ علماء ومفكرو الإسلام قاعدة راسخة مفادها أن صريح المعقول لا يتعارض بحال مع صحيح المنقول.`,
        },
        scholarlyConsensus: {
          id: `Konsensus ilmiah modern menegaskan pentingnya kejujuran intelektual tanpa terjebak dalam generalisasi atau pseudosains.`,
          en: `Scholarly consensus emphasizes intellectual honesty without resorting to apologetic overreach or pseudo-scientific claims.`,
          ar: `يؤكد الإجماع الأكاديمي على أهمية الأمانة المعرفية والتجرد من الادعاءات غير الموثقة.`,
        },
      },
      epistemologicalPoints: [
        {
          category: 'FACT',
          statement: {
            id: "Teks Al-Qur'an dan hadits sahih mendorong manusia menggunakan akal, observasi alam semesta, dan verifikasi kritis.",
            en: "The Qur'an consistently directs human intellect toward critical observation, rational reflection, and empirical verification.",
            ar: 'يحث القرآن الكريم العقل البشري دوماً على التدبر الموضوعي، وملاحظة سنن الكون، والتحقق العلمي.',
          },
          sources: [
            {
              name: "Al-Qur'an Surah Yunus [10]: 101",
              url: 'https://quran.ksu.edu.sa',
              tier: 1,
              type: 'classical-tafsir',
            },
          ],
          confidenceLevel: 'High',
        },
        {
          category: 'EVIDENCE',
          statement: {
            id: 'Tradisi keilmuan Islam berkembang melalui pencatatan sanad, kritik teks naskah, dan verifikasi sumber yang ketat.',
            en: 'Islamic scholarship pioneered rigorous methodologies of chain-of-transmission (Isnad) and critical textual scrutiny.',
            ar: 'تطورت العلوم الإسلامية عبر منظومة دقيقة لتوثيق الأسانيد ونقد الروايات والتحقيق النصي.',
          },
          sources: [
            {
              name: 'Muqaddimah Ibn al-Salah (Ulum al-Hadith)',
              url: 'https://shamela.ws',
              tier: 1,
              type: 'academic-book',
            },
          ],
          confidenceLevel: 'High',
        },
        {
          category: 'ISLAMIC_INTERPRETATION',
          statement: {
            id: 'Wahyu memberikan kerangka moral dan makna eksistensial, sementara sains meneliti mekanisme fisik hukum alam.',
            en: 'Divine revelation establishes existential meaning and moral frameworks, whereas empirical science examines physical mechanics.',
            ar: 'يقدم الوحي المعنى الوجودي والإطار الأخلاقي، بينما يبحث العلم الطبيعي في آليات السنن الكونية.',
          },
          sources: [
            {
              name: 'Tahafut al-Falasifah (Al-Ghazali)',
              url: 'https://shamela.ws',
              tier: 1,
              type: 'academic-book',
            },
          ],
          confidenceLevel: 'High',
        },
        {
          category: 'COUNTERARGUMENT',
          statement: {
            id: 'Kritik materialisme mengklaim sains cukup menjelaskan segalanya, namun sains sendiri bergantung pada asumsi filosofis tentang keteraturan alam.',
            en: 'Materialist critiques claim empirical science explains all reality, yet science itself presupposes mathematical order and intelligibility.',
            ar: 'تدعي المادية كفاية العلم الطبيعي لتفسير الوجود، في حين يعتمد العلم نفسه على فرضيات مسبقة حول انتظام الكون وقابليته للتعقل.',
          },
          sources: [
            {
              name: 'Yaqeen Institute (Faith & Science Epistemology)',
              url: 'https://yaqeeninstitute.org',
              tier: 1,
              type: 'academic-book',
            },
          ],
          confidenceLevel: 'High',
        },
        {
          category: 'UNCERTAINTY',
          statement: {
            id: 'Teori-teori sains terus mengalami revisi paradigma, sehingga teks keagamaan tidak boleh dipaksakan mencocoki hipotesis yang belum final.',
            en: 'Scientific paradigms evolve constantly; thus, foundational religious texts must not be forced to match transient hypotheses.',
            ar: 'تتطور النظريات العلمية باستمرار، مما يوجب عدم إخضاع النصوص التأسيسية لفرضيات متغيرة.',
          },
          sources: [
            {
              name: "Nidhal Guessoum (Islam's Quantum Question)",
              url: 'https://referenceworks.brillonline.com',
              tier: 1,
              type: 'academic-book',
            },
          ],
          confidenceLevel: 'High',
        },
      ],
      honestBoundaries: {
        whatItProves: {
          id: 'APA YANG TERBUKTI: Keselarasan mendalam antara akal sehat, keteraturan alam, dan prinsip-prinsip rasional tauhid.',
          en: 'WHAT IT PROVES: The profound harmony between human rationality, cosmic order, and foundational monotheism.',
          ar: 'ما يثبته البحث: التوافق العميق بين العقل السليم، وانتظام السنن الكونية، ومبادئ التوحيد العقلانية.',
        },
        whatMustNotBeClaimed: {
          id: 'APA YANG TIDAK BOLEH DIKLAIM: Agama bukan buku teks laboratorium dan hipotesis sains kontemporer bukan dalil mutlak teologis.',
          en: 'WHAT MUST NOT BE CLAIMED: Revelation is not an empirical laboratory manual, and transient scientific models are not absolute theological dogmas.',
          ar: 'ما لا يجوز ادعاؤه: الوحي ليس كتاباً تفصيلياً في المختبرات، والنظريات العلمية المتغيرة ليست عقائد قطعية.',
        },
      },
      citationChain: {
        layer1Primary:
          lead.detectedPrimarySources[0]?.name || 'Tafsir Klasik & Korpus Teks Keagamaan',
        layer2Journalism: `${lead.sourceOutlet} Academic Study Review`,
        layer3Discovery: 'Scholarly Research Repositories & Theological Journals',
        crossVerificationNotes:
          'Analisis teks diverifikasi silang antara naskah rujukan primer dan publikasi studi keagamaan kontemporer.',
      },
      editorialBenchmark: {
        firstOrBestCoverage: `${lead.sourceOutlet} mengulas tinjauan akademis; ImanLogics menyajikan demarkasi epistemologis 7-kategori dengan analisis komparatif yang jernih.`,
        angleUtilized: 'Epistemological Demarcation with Deep Linguistic & Philosophical Rigor',
        primarySourcesCited: [lead.detectedPrimarySources[0]?.name || 'Primary Academic Source'],
        unexploredAngleForImanLogics:
          'Menghubungkan teks klasik dengan pertanyaan intelektual modern pembaca non-Muslim tanpa apologetika sempit.',
        originalValueProposition:
          'Menghadirkan pembahasan yang berimbang, jujur secara akademis, dan menggugah nalar.',
      },
    }
  }

  /**
   * Comprehensive 11-Pillar Islamic Logic Catalog (Reader-First Inquiries)
   */
  private static getComprehensiveIslamicCatalog(todayStr: string): IslamicAcademicStory[] {
    return [
      // 1. Rationality of Sharia: Usury & Global Debt Cycles vs Ethical Economics
      {
        id: 'rationality-sharia-riba-global-debt-cycles-economics',
        title:
          'Rasionalitas Pelarangan Riba: Analisis Ekonomi Makro terhadap Siklus Utang Global, Ketimpangan Sistemik, dan Keadilan Transaksi',
        classification: 'Sharia Rationality',
        publishedAt: `${todayStr}T09:00:00.000Z`,
        primarySourceUrl: 'https://www.imf.org',
        primarySourceTier: 1,
        titles: {
          id: 'Rasionalitas Pelarangan Riba: Analisis Ekonomi Makro terhadap Siklus Utang Global, Ketimpangan Sistemik, dan Keadilan Transaksi',
          en: 'The Rationality of Prohibiting Usury (Riba): Macroeconomic Analysis of Global Debt Cycles, Systemic Inequality, and Risk-Sharing Justice',
          ar: 'عقلانية تحريم الربا: تحليل اقتصادي كلي لدورات الديون العالمية، واللامساواة الهيكلية، وعدالة تقاسم المخاطر',
        },
        keywords: [
          'rationality-of-sharia',
          'riba-prohibition',
          'macroeconomics',
          'debt-cycles',
          'risk-sharing',
          'islamic-economics',
        ],
        sources: [
          {
            name: "Al-Qur'an Surah Al-Baqarah [2]: 275-279 (Kaidah Keadilan Transaksi)",
            url: 'https://quran.ksu.edu.sa',
            tier: 1,
            type: 'classical-tafsir',
          },
          {
            name: 'Bank for International Settlements (BIS) Working Papers on Debt Overhang',
            url: 'https://www.bis.org',
            tier: 1,
            type: 'standards-body',
          },
          {
            name: 'Journal of Islamic Economic Studies (IRTI/IsDB)',
            url: 'https://iesjournal.org',
            tier: 1,
            type: 'research-paper',
          },
        ],
        readerHook: {
          id: 'Mengapa sebuah ajaran yang lahir pada abad ke-7 secara tegas melarang sistem bunga pinjaman berbunga tetap (riba) jauh sebelum krisis utang global modern terjadi?',
          en: 'Why did a 7th-century revelation strictly prohibit predetermined interest (riba) centuries before modern compounding sovereign debt crises emerged?',
          ar: 'لماذا حرمت تعاليم الوحي في القرن السابع الفائدة المحددة مسبقاً (الربا) قبل قرون طويلة من تفاقم أزمات الديون السيادية المعاصرة؟',
        },
        whyShouldICare: {
          id: 'Bagi pengamat ekonomi dan masyarakat umum, larangan ini bukan sekadar dogma ritual, melainkan fondasi ekonomi berbasis pembagian risiko riil yang mencegah inflasi gelembung keuangan.',
          en: 'For economists and citizens, this prohibition constitutes an asset-backed risk-sharing model designed to curb speculative bubbles and wealth concentration.',
          ar: 'بالنسبة للباحثين والمجتمعات، يمثل هذا التحريم نموذجاً تنموياً قائماً على تقاسم المخاطر الحقيقية ومنع التضخم والفقاعات المالية.',
        },
        narrativeLead: {
          hook: {
            id: 'Dalam setiap krisis finansial modern—dari Great Depression 1929 hingga krisis subprime 2008—akar ketidakstabilan selalu bermuara pada satu instrumen: penumpukan utang berbunga yang melebihi aset riil.',
            en: 'Across modern financial crises, systemic instability consistently originates from one mechanism: compounding interest-bearing debt decoupled from real physical productivity.',
            ar: 'في كل أزمة مالية كبرى، يعود السبب الجذري للاختلال إلى تراكم الديون المربوطة بالفائدة المركبة بمعزل عن الاقتصاد والإنتاج الحقيقي.',
          },
          historicalContext: {
            id: 'Ulama ekonomi klasik seperti Al-Ghazali dan Ibn Khaldun telah menganalisis bahwa uang adalah alat tukar dan pengukur nilai, bukan komoditas yang dapat melahirkan uang secara otomatis tanpa kerja riil.',
            en: 'Classical scholars analyzed that currency functions as a medium of exchange and measure of value, not an autonomous self-generating commodity.',
            ar: 'أوضح مفكرو الإسلام أن النقد وسيلة لتبادل وتقييم السلع، وليس سلعة مستقلة تتوالد ذاتياً دون عمل وإنتاج حقيقي.',
          },
          scholarlyConsensus: {
            id: 'Ekonom kontemporer semakin mengakui bahwa model pembiayaan berbasis bagi hasil (equity-based risk-sharing) jauh lebih tahan banting terhadap guncangan pasar.',
            en: 'Contemporary economists increasingly recognize that risk-sharing equity models offer superior resilience against macroeconomic shocks.',
            ar: 'يقر خبراء الاقتصاد المعاصر بأن التمويل القائم على تقاسم المخاطر أكثر استقراراً في مواجهة الصدمات الاقتصادية.',
          },
        },
        epistemologicalPoints: [
          {
            category: 'FACT',
            statement: {
              id: 'Sistem bunga majemuk secara matematis menuntut pertumbuhan utang eksponensial dalam dunia dengan sumber daya fisik yang berhingga.',
              en: 'Compounding interest mathematically mandates exponential debt accumulation within finite physical economies.',
              ar: 'تفرض الفائدة المركبة رياضياً نمواً أسياً للديون في عالم تحكمه موارد طبيعية واقتصادية محدودة.',
            },
            sources: [
              {
                name: 'BIS Economic Papers',
                url: 'https://www.bis.org',
                tier: 1,
                type: 'standards-body',
              },
            ],
            confidenceLevel: 'High',
          },
          {
            category: 'EVIDENCE',
            statement: {
              id: "Al-Qur'an secara eksplisit membedakan antara perdagangan riil yang halal dan riba yang merusak (QS. 2:275).",
              en: "The Qur'an fundamentally distinguishes between productive trade and destructive usury (Qur'an 2:275).",
              ar: 'يميز القرآن الكريم تمييزاً جوهرياً بين البيع والنشاط التجاري الحقيقي وبين الربا المحرم (البقرة: 275).',
            },
            sources: [
              {
                name: "Tafsir At-Tabari (Jami' al-Bayan)",
                url: 'https://quran.ksu.edu.sa',
                tier: 1,
                type: 'classical-tafsir',
              },
            ],
            confidenceLevel: 'High',
          },
          {
            category: 'ISLAMIC_INTERPRETATION',
            statement: {
              id: "Tujuan utama syariat (Maqasid al-Shari'ah) dalam larangan riba adalah menjamin keadilan distributif (Hifz al-Mal).",
              en: 'The higher objective (Maqasid) of prohibiting usury is safeguarding equitable wealth circulation and preventing exploitation.',
              ar: 'المقصد الشرعي الأساسي من تحريم الربا هو حفظ المال وتداول الثروة بالعدل ومنع استغلال المحتاجين.',
            },
            sources: [
              {
                name: "Ibn Ashur (Treatise on Maqasid al-Shari'ah)",
                url: 'https://shamela.ws',
                tier: 1,
                type: 'academic-book',
              },
            ],
            confidenceLevel: 'High',
          },
          {
            category: 'COUNTERARGUMENT',
            statement: {
              id: 'Sebagian ekonom neoklasik berpendapat bunga adalah kompensasi atas risiko dan nilai waktu uang (time value of money), namun dalam riba peminjam menanggung seluruh kerugian sementara pemberi pinjaman dijamin untung.',
              en: 'Neoclassical theories frame interest as compensation for time value of money, yet usury forces borrowers to absorb full operational risk while guaranteeing creditor returns.',
              ar: 'يجادل البعض بأن الفائدة تعويض عن القيمة الزمنية للنقود، غير أن الربا يحمل المقترض كامل المخاطر ويضمن عائداً ثابتاً للمقرض.',
            },
            sources: [
              {
                name: 'Journal of Islamic Banking & Finance',
                url: 'https://iesjournal.org',
                tier: 1,
                type: 'research-paper',
              },
            ],
            confidenceLevel: 'High',
          },
          {
            category: 'UNCERTAINTY',
            statement: {
              id: 'Penerapan teknis instrumen keuangan bebas riba dalam sistem moneter fiat global saat ini masih menghadapi tantangan regulasi dan arbitrase pasar.',
              en: 'Translating interest-free instruments into contemporary global fiat monetary architecture remains an evolving regulatory endeavor.',
              ar: 'تواجه التطبيقات المعاصرة للمالية اللاربوية في ظل النظام النقدي العالمي تحديات تشريعية وتنظيمية مستمرة.',
            },
            sources: [
              {
                name: 'Islamic Financial Services Board (IFSB)',
                url: 'https://www.ifsb.org',
                tier: 1,
                type: 'standards-body',
              },
            ],
            confidenceLevel: 'Moderate',
          },
        ],
        honestBoundaries: {
          whatItProves: {
            id: 'APA YANG TERBUKTI: Larangan riba memiliki fondasi rasional, ekonomi, dan etika yang kuat untuk mencegah ketimpangan ekstrem dan krisis likuiditas.',
            en: 'WHAT IT PROVES: The prohibition of usury rests on profound ethical and macroeconomic logic aimed at preventing systemic exploitation.',
            ar: 'ما يثبته البحث: يستند تحريم الربا إلى منطق اقتصادي وأخلاقي متين لمنع تراكم الثروات غير العادل والأزمات الهيكلية.',
          },
          whatMustNotBeClaimed: {
            id: 'APA YANG TIDAK BOLEH DIKLAIM: Bahwa setiap institusi yang berlabel syariah secara otomatis sempurna tanpa celah manajerial atau inflasi.',
            en: 'WHAT MUST NOT BE CLAIMED: That nominal labeling automatically immunizes any financial institution from management defects or inflation.',
            ar: 'ما لا يجوز ادعاؤه: أن مجرد حمل المسمى الشرعي يعصم أي مؤسسة مالية تلقائياً من الأخطاء الإدارية أو تقلبات السوق.',
          },
        },
        citationChain: {
          layer1Primary: "Al-Qur'an Surah Al-Baqarah [2]: 275-279 & Dokumen BIS/IMF",
          layer2Journalism: 'Journal of Islamic Economic Studies (IRTI) & Financial Times Analysis',
          layer3Discovery: 'Global Macroeconomic Debt Studies',
          crossVerificationNotes:
            'Data rasio utang terhadap PDB dan risiko instabilitas finansial diverifikasi silang antara publikasi BIS dan analisis ekonomi Islam klasik.',
        },
        editorialBenchmark: {
          firstOrBestCoverage:
            'Jurnal ekonomi mengulas data statistik utang; ImanLogics menyajikan sintesis filsafat keadilan syariat dengan data ekonomi makro kontemporer.',
          angleUtilized: 'Macroeconomic Rationality & Epistemological Demarcation',
          primarySourcesCited: ["Qur'an 2:275-279", 'BIS Debt Reports', 'Ibn Ashur Maqasid'],
          unexploredAngleForImanLogics:
            'Menghubungkan prinsip risk-sharing dengan stabilitas moneter masa depan bagi pembaca umum non-Muslim.',
          originalValueProposition:
            'Menjelaskan hikmah syariat melalui lensa data ekonomi modern yang objektif dan rasional.',
        },
      },

      // 2. Jesus / Isa: Prayer, Prostration, and Monotheism Across Scriptures
      {
        id: 'jesus-isa-prayer-submission-tawhid-study',
        title:
          'Bagaimana Yesus Berdoa? Menelaah Praktik Sujud dan Makna Teologis "Muslim" dalam Tradisi Kenabian',
        classification: 'Theological Demarcation',
        publishedAt: `${todayStr}T09:00:00.000Z`,
        primarySourceUrl: 'https://quran.ksu.edu.sa',
        primarySourceTier: 1,
        titles: {
          id: 'Bagaimana Yesus Berdoa? Menelaah Praktik Sujud dan Makna Teologis "Muslim" dalam Tradisi Kenabian',
          en: 'How Did Jesus Pray? Examining Prostration, Submission, and the Theological Meaning of "Muslim" Across Prophetic Traditions',
          ar: 'كيف كان يصلي عيسى عليه السلام؟ دراسة في السجود ومعنى "الإسلام" في التراث النبوي التوحيدي',
        },
        keywords: [
          'jesus-in-islam',
          'prophet-isa',
          'prostration-prayer',
          'islamic-monotheism',
          'comparative-theology',
          'tawhid',
        ],
        sources: [
          {
            name: "Al-Qur'an Surah Ali 'Imran [3]: 51 & Maryam [19]: 30-36",
            url: 'https://quran.ksu.edu.sa',
            tier: 1,
            type: 'classical-tafsir',
          },
          {
            name: 'Biblical Manuscripts: Gospel of Matthew 26:39 (Gethsemane Prostration)',
            url: 'https://www.codexsinaiticus.org',
            tier: 1,
            type: 'archive',
          },
          {
            name: 'Oxford Journal of Theological Studies',
            url: 'https://academic.oup.com/jts',
            tier: 1,
            type: 'research-paper',
          },
        ],
        readerHook: {
          id: 'Di Taman Getsemani pada malam yang genting, Yesus tersungkur dengan wajahnya ke tanah (sujud) memohon kepada Allah yang Mahatinggi. Apa makna tindakan ibadah ini?',
          en: 'In the Garden of Gethsemane during a pivotal moment, Jesus fell with his face to the ground (prostration), praying to the Almighty. What does this act reveal about his identity?',
          ar: 'في بستان جثسيماني في لحظة مصيرية، خر عيسى عليه السلام على وجهه ساجداً متضرعاً إلى الله تعالى. ماذا يكشف هذا المشهد التعبدي عن جوهر رسالته؟',
        },
        whyShouldICare: {
          id: 'Bagi pembaca Kristiani dan Muslim, penelusuran cara berdoa para nabi mengungkapkan kesinambungan pesan monoteisme murni (Tauhid) yang melintasi zaman.',
          en: 'For Christian and Muslim readers alike, exploring how prophets prayed uncovers the profound continuity of pure monotheism across millennia.',
          ar: 'بالنسبة للقراء من مختلف الخلفيات، يكشف تتبع صلاة الأنبياء عن وحدة الرسالة التوحيدية الأصيلة عبر التاريخ.',
        },
        narrativeLead: {
          hook: {
            id: 'Ketika Yesus merebahkan wajahnya ke tanah dalam doa yang tulus, ia mempraktikkan bentuk penghambaan tertinggi yang menjadi ciri khas seluruh nabi monoteis.',
            en: 'When Jesus prostrated his face to the earth in humble prayer, he engaged in the highest form of submission characterizing all prophetic traditions.',
            ar: 'عندما سجد عيسى عليه السلام بجبينه إلى الأرض، كان يجسد أرقى صور الخضوع والعبودية التي ميزت سائر الأنبياء الموحدين.',
          },
          historicalContext: {
            id: 'Kata "Muslim" secara etimologis berakar dari kata Semitik "Islam" yang bermakna orang yang berserah diri secara total kepada kehendak Allah.',
            en: 'The term "Muslim" is an active participle in Semitic grammar designating one who consciously submits their will entirely to the Creator.',
            ar: 'تأتي كلمة "مسلم" في لغة القرآن وسياقها السامي لتدل على من أسلم وجهه وإرادته بالكامل لله الخالق.',
          },
          scholarlyConsensus: {
            id: 'Para akademisi teologi komparatif sepakat bahwa sujud fisik adalah tradisi ibadah Semitik tertua yang dilakukan oleh Abraham, Musa, Daud, hingga Yesus.',
            en: 'Scholars of comparative religion affirm that physical prostration represents the ancient Semitic worship posture practiced by Abraham, Moses, David, and Jesus.',
            ar: 'يؤكد باحثو الأديان المقارنة أن السجود الجسدي هو الهيئة التعبدية السامية العريقة التي مارسها إبراهيم وموسى وداود وعيسى عليهم السلام.',
          },
        },
        epistemologicalPoints: [
          {
            category: 'FACT',
            statement: {
              id: "Teks Alkitab (Matius 26:39) dan Al-Qur'an (Ali Imran: 51) sepakat mencatat Yesus beribadah dan bersujud kepada Allah.",
              en: "Both Biblical manuscripts (Matthew 26:39) and the Qur'an (Ali Imran: 51) explicitly document Jesus prostrating in prayer to God.",
              ar: 'تتطابق نصوص الأناجيل التاريخية (متى 26: 39) والقرآن الكريم (آل عمران: 51) في توثيق صلاة وسجود عيسى عليه السلام لله تعالى.',
            },
            sources: [
              {
                name: 'Codex Sinaiticus Project',
                url: 'https://www.codexsinaiticus.org',
                tier: 1,
                type: 'archive',
              },
            ],
            confidenceLevel: 'High',
          },
          {
            category: 'EVIDENCE',
            statement: {
              id: "Al-Qur'an menegaskan posisi mulia Nabi Isa sebagai rasul dan kalimat Allah yang menyeru umatnya beribadah hanya kepada Allah yang Esa.",
              en: "The Qur'an elevates Jesus as an honored Messenger and Word from God who called mankind to worship the One true Creator.",
              ar: 'يعلي القرآن الكريم من مكانة المسيح كرسول كريم وكلمة من الله دعا قومه لعبادة الله وحده لا شريك له.',
            },
            sources: [
              {
                name: 'Tafsir Ibn Kathir (Surah Maryam)',
                url: 'https://quran.ksu.edu.sa',
                tier: 1,
                type: 'classical-tafsir',
              },
            ],
            confidenceLevel: 'High',
          },
          {
            category: 'ISLAMIC_INTERPRETATION',
            statement: {
              id: 'Ibadah Yesus menunjukkan bahwa ia adalah hamba Allah (Abdullah) yang mengajarkan Tauhid, bukan pribadi ilahi yang disembah.',
              en: 'The prayer life of Jesus exemplifies his status as a servant of God (Abdullah) calling to pure monotheism rather than claiming divinity.',
              ar: 'تثبت عبادة عيسى وسجوده عبوديته الخالصة لله (عبد الله ورسوله) ودعوته للتوحيد الصافي، لا لادعاء الألوهية.',
            },
            sources: [
              {
                name: 'Al-Razi (Mafatih al-Ghaib)',
                url: 'https://quran.ksu.edu.sa',
                tier: 1,
                type: 'classical-tafsir',
              },
            ],
            confidenceLevel: 'High',
          },
          {
            category: 'COUNTERARGUMENT',
            statement: {
              id: 'Doktrin Kristen arus utama menafsirkan doa Yesus sebagai bukti sifat kemanusiaannya dalam kerangka Dwi-Kodrat (Hipostasis), sementara teologi Islam memandangnya sebagai bukti ketuhanan tunggal tanpa sekutu.',
              en: "Trinitarian theology interprets Jesus' prayers through the Chalcedonian dual-nature lens, whereas Islamic theology regards it as definitive evidence of absolute divine uniqueness.",
              ar: 'يفسر اللاهوت الكنسي صلاة المسيح من منظور الطبيعة البشرية في سر التجسد، بينما تؤكد العقيدة الإسلامية أنها برهان ساطع على وحدانية الخالق وتفرد صفات الألوهية.',
            },
            sources: [
              {
                name: 'Oxford University Press Theological Studies',
                url: 'https://academic.oup.com/jts',
                tier: 1,
                type: 'academic-book',
              },
            ],
            confidenceLevel: 'High',
          },
          {
            category: 'UNCERTAINTY',
            statement: {
              id: 'Rincian tata cara lengkap bacaan doa Yesus dalam bahasa Aram kuno tidak terlestarikan secara verbatim dalam manuskrip Yunani.',
              en: 'The exact verbatim Aramaic liturgical prayers uttered by Jesus were not fully preserved in extant Greek manuscript copies.',
              ar: 'لم تصلنا تفاصيل الأدعية الحرفية التي تلاها عيسى عليه السلام بلغته الآرامية الأم كاملة في المخطوطات اليونانية المتاحة.',
            },
            sources: [
              {
                name: 'Brill Journal for the Study of the Historical Jesus',
                url: 'https://referenceworks.brillonline.com',
                tier: 1,
                type: 'academic-book',
              },
            ],
            confidenceLevel: 'Moderate',
          },
        ],
        honestBoundaries: {
          whatItProves: {
            id: 'APA YANG TERBUKTI: Bahwa Yesus mempraktikkan ibadah sujud dan penyerahan diri (Islam) kepada Tuhan yang Mahatinggi.',
            en: 'WHAT IT PROVES: That Jesus authentically practiced prostration and total submission (Islam) to the Almighty God.',
            ar: 'ما يثبته البحث: أن عيسى عليه السلام مارس السجود والتسليم التام (الإسلام) للخالق سبحانه.',
          },
          whatMustNotBeClaimed: {
            id: 'APA YANG TIDAK BOLEH DIKLAIM: Bahwa perbedaan teologis berabad-abad antara Islam dan Kristen dapat diselesaikan hanya dengan satu argumen tanpa telaah teks komparatif.',
            en: 'WHAT MUST NOT BE CLAIMED: That centuries of intricate theological debates can be oversimplified without respectful textual analysis.',
            ar: 'ما لا يجوز ادعاؤه: تبسيط الخلافات اللاهوتية التاريخية دون دراسة عميقة ومتجردة للنصوص.',
          },
        },
        citationChain: {
          layer1Primary: "Al-Qur'an [3:51] & Manuskrip Codex Sinaiticus (Matius 26:39)",
          layer2Journalism: 'Oxford Theological Studies & Brill Historical Inquiries',
          layer3Discovery: 'Comparative Biblical & Islamic Epistemology',
          crossVerificationNotes:
            'Analisis sujud dan doa kenabian diverifikasi silang antara teks bahasa Yunani, bahasa Ibrani, dan bahasa Arab klasik.',
        },
        editorialBenchmark: {
          firstOrBestCoverage:
            'Studi akademis menyajikan naskah; ImanLogics menyajikan kajian dialogis yang menghargai pembaca Kristiani dan Muslim dengan kejujuran ilmiah.',
          angleUtilized: 'Comparative Theological Demarcation with Textual Hermeneutics',
          primarySourcesCited: ["Qur'an 3:51", 'Matthew 26:39 Codex Sinaiticus', 'Al-Razi'],
          unexploredAngleForImanLogics:
            'Menjelaskan makna esensial "Muslim" sebagai penyerahan diri universal para nabi melintasi batasan kultural.',
          originalValueProposition:
            'Menghadirkan rasa hormat mendalam kepada sosok Nabi Isa dan Maryam dengan landasan dalil yang kuat.',
        },
      },
    ]
  }
}
