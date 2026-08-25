import fs from 'fs'
import path from 'path'
import { MCP_CONFIG } from '../../config/env'
import {
  LocalizedText,
  SourceCitation,
  EpistemologicalPoint,
  CitationChainRecord,
  EditorialBenchmarkResult,
} from '../../core/types'
import { SourceVerifier } from './source-verifier'
import { Logger } from '../../core/logger'

export interface KeyManuscriptText {
  siglum: string
  name: LocalizedText
  dateEstimate: LocalizedText
  description: LocalizedText
}

export interface TraceableHistoricalMetric {
  label: LocalizedText
  value: string
  primarySourceCitation: string
  independentVerificationUrl: string
}

export interface ArchaeologicalForensics {
  discoveryNarrative: LocalizedText
  caveAndManuscriptCount: LocalizedText
  radiocarbonAndPaleographyDating: LocalizedText
  keyTexts: KeyManuscriptText[]
  textualLandscape: LocalizedText
}

export interface ScholarlyDebateSection {
  esseneHypothesis: LocalizedText
  alternativeTheories: LocalizedText
  scholarlyConsensusOrDispute: LocalizedText
}

export interface DefinitionalPrecisionSection {
  monotheismVsTawhid: LocalizedText
  messianicExpectationsVsPropheticLineage: LocalizedText
  halakhicLegalismVsShariaFiqh: LocalizedText
}

export interface IslamicReasoningWalkthrough {
  revelationContinuity: LocalizedText
  scripturalTransmissionHistory: LocalizedText
  quranicPerspective: {
    surahReference: LocalizedText
    arabicText: string
    translation: LocalizedText
    exegesis: LocalizedText
  }
  theologicalSynthesis: LocalizedText
}

export interface IslamicAcademicStory {
  id: string
  eventDate?: string
  topicCategory:
    | 'DeadSeaScrolls'
    | 'JesusSubmissionTawhid'
    | 'CosmicExpansion'
    | 'EmbryologyScience'
    | 'BiblicalProphecyMuhammad'
    | 'RationalityIslamicLaw'
    | 'MaryMaryamApocrypha'
    | 'KalamCosmology'
    | 'GeologicalIsostasy'
    | 'QuranTextualPreservation'
  titles: LocalizedText
  keywords: string[]
  narrativeHook: LocalizedText
  readerHook: LocalizedText
  universalQuestion: LocalizedText
  editorialAngle: 'Academic In-Depth Essay' | 'Historical-Textual Analysis'
  archaeologicalDetails: ArchaeologicalForensics
  scholarlyDebate: ScholarlyDebateSection
  definitionalDistinction: DefinitionalPrecisionSection
  islamicReasoningWalkthrough: IslamicReasoningWalkthrough
  whatThisDoesAndDoesntProve: LocalizedText
  reflectiveQuestion: LocalizedText
  metrics: TraceableHistoricalMetric[]
  sources: SourceCitation[]
  epistemologicalMatrix: EpistemologicalPoint[]
  citationChain?: CitationChainRecord
  editorialBenchmark?: EditorialBenchmarkResult
}

export class IslamicResearchEngine {
  /**
   * Top 10 Deep Research Candidates covering Logic, Science, History, and Epistemology
   */
  static getFreshIslamicAcademicCandidates(todayStr: string): IslamicAcademicStory[] {
    return [
      // 1. Dead Sea Scrolls / Qumran
      {
        id: 'qumran-dead-sea-scrolls-monotheism-study',
        eventDate: todayStr,
        topicCategory: 'DeadSeaScrolls',
        titles: {
          id: 'Apa yang Sebenarnya Diungkap Gulungan Laut Mati tentang Agama Yahudi Sebelum Yesus?',
          en: 'What the Dead Sea Scrolls Actually Reveal About Judaism Before Jesus',
          ar: 'ما الذي تكشفه مخطوطات البحر الميت حقاً عن اليهودية قبل المسيح؟',
        },
        keywords: [
          'dead-sea-scrolls',
          'qumran',
          'second-temple-judaism',
          'monotheism',
          'biblical-manuscripts',
          'quranic-worldview',
        ],
        narrativeHook: {
          id: 'Pada musim semi tahun 1947, seorang gembala muda suku Ta’amireh bernama Muhammad edh-Dhib melemparkan sebongkah batu ke celah sempit di tebing kapur Qumran...',
          en: 'In the spring of 1947, a young Ta’amireh Bedouin shepherd named Muhammad edh-Dhib tossed a stone into a narrow limestone opening in Qumran...',
          ar: 'في ربيع عام 1947، ألقى راعٍ بدوي شاب من قبيلة التعامرة يُدعى محمد الذئب حجراً في فجوة ضيقة بمنحدرات قمران الجيرية...',
        },
        readerHook: {
          id: 'Penemuan 25.000 serpihan naskah di 11 gua Qumran membuka cakrawala baru tentang bagaimana teks suci ditransmisikan sebelum lahirnya agama Kristen dan Islam.',
          en: 'The discovery of 25,000 manuscript fragments across 11 Qumran caves revolutionizes our understanding of how sacred texts were transmitted before Christianity and Islam.',
          ar: 'فتح اكتشاف 25,000 قصاصة مخطوطة في 11 كهفاً بوادي قمران نافذة غير مسبوقة على تاريخ انتقال النصوص المقدسة قبل بزوغ المسيحية والإسلام.',
        },
        universalQuestion: {
          id: 'Apakah naskah kuno ini membuktikan bahwa teks suci tidak pernah berubah, atau justru merekam proses transmisi sejarah yang organik?',
          en: 'Do these ancient scrolls prove the biblical text was historically static, or do they document a dynamic process of scribal transmission?',
          ar: 'هل تثبت هذه المخطوطات ثباتاً نصياً مطلقاً، أم توثق مساراً تاريخياً غنياً لحركة النساخ القدماء؟',
        },
        editorialAngle: 'Academic In-Depth Essay',
        archaeologicalDetails: {
          discoveryNarrative: {
            id: 'Ekskavasi arkeologis di bawah pimpinan Roland de Vaux antara 1951–1956 menyingkap reruntuhan Khirbet Qumran dan 11 gua penyimpanan manuskrip.',
            en: 'Archaeological excavations directed by Roland de Vaux between 1951–1956 uncovered the ruins of Khirbet Qumran and 11 manuscript caves.',
            ar: 'كشفت التنقيبات الأثرية بإشراف رولان دي فو بين 1951-1956 عن أطلال خربة قمران و11 كهفاً تحتوي على آلاف المخطوطات.',
          },
          caveAndManuscriptCount: {
            id: 'Sekitar 900 manuskrip teridentifikasi dari sekitar 25.000 fragmen, mencakup 230 naskah Alkitab Ibrani serta naskah sektarian.',
            en: 'Approximately 900 distinct manuscripts were reconstructed from 25,000 fragments, including ~230 biblical scrolls and sectarian rules.',
            ar: 'تم توثيق ما يقارب 900 مخطوطة تم تجميعها من 25 ألف قصاصة، تضم نحو 230 مخطوطة للكتاب العبري ونصوص الجماعة.',
          },
          radiocarbonAndPaleographyDating: {
            id: 'Penanggalan radiokarbon AMS di Zurich dan Tucson (1991, 1995) memastikan naskah berasal dari kurun abad ke-3 SM hingga 68 Masehi.',
            en: 'AMS radiocarbon dating in Zurich and Tucson (1991, 1995) established scroll dates ranging from the 3rd century BCE to 68 CE.',
            ar: 'أكدت تحاليل الكربون المشع AMS في زيورخ وتوكسون (1991، 1995) أن المخطوطات تعود للفترة بين القرن الثالث قبل الميلاد وعام 68 ميلادي.',
          },
          keyTexts: [
            {
              siglum: '1QIsa-a',
              name: {
                id: 'Gulungan Besar Kitab Yesaya',
                en: 'The Great Isaiah Scroll',
                ar: 'لفافة إشعياء الكبرى',
              },
              dateEstimate: { id: 'c. 125 SM', en: 'c. 125 BCE', ar: 'حوالي 125 ق.م' },
              description: {
                id: 'Satu-satunya naskah utuh 54 kolom kulit sepanjang 7,34 meter yang memuat seluruh Kitab Yesaya secara lengkap.',
                en: 'The only fully intact scroll spanning 54 parchment columns (7.34m) containing the complete Book of Isaiah.',
                ar: 'المخطوطة الكاملة الوحيدة المكونة من 54 عموداً جلدياً بطول 7.34 متر وتحوي سفر إشعياء كاملاً.',
              },
            },
            {
              siglum: '1QS',
              name: {
                id: 'Aturan Komunitas (Serekh ha-Yahad)',
                en: 'Rule of the Community (1QS)',
                ar: 'ميثاق الجماعة',
              },
              dateEstimate: { id: 'c. 100–75 SM', en: 'c. 100–75 BCE', ar: 'حوالي 100-75 ق.م' },
              description: {
                id: 'Mengatur hierarki ketat, kehidupan monastik komunal, serta pemurnian ritual harian kelompok Qumran.',
                en: 'Codifies strict hierarchy, communal discipline, and daily ritual ablutions of the Qumran community.',
                ar: 'ينظم الهيكل الداخلي والانضباط الجماعي الصارم والطهور الطقسي اليومي لأعضاء الجماعة.',
              },
            },
          ],
          textualLandscape: {
            id: 'Para sarjana paleografi seperti Emanuel Tov menunjukkan bahwa naskah Qumran membuktikan adanya tradisi teks yang beragam (pluriform) sebelum standardisasi Teks Masoretik abad ke-2 M.',
            en: 'Scholars like Emanuel Tov demonstrate that Qumran reflects a pluriform textual landscape prior to the 2nd-century CE Masoretic stabilization.',
            ar: 'أثبت علماء النقد النصي مثل إيمانويل توف أن نصوص قمران تعكس تنوعاً نصياً حياً قبل توحيد النص الماسوري في القرن الثاني الميلادي.',
          },
        },
        scholarlyDebate: {
          esseneHypothesis: {
            id: 'Hipotesis Eseni: Sebagian besar sarjana mengidentifikasi komunitas Qumran dengan sekte Eseni yang menjauhi korupsi elite Bait Kedua di Yerusalem.',
            en: 'Essene Hypothesis: The dominant consensus links Qumran with the Essenes who withdrew from Second Temple corruption in Jerusalem.',
            ar: 'فرضية الأسينيين: يربط جمهور الباحثين جماعة قمران بالأسينيين الذين اعتزلوا فساد الطبقة الكهنوتية في أورشليم.',
          },
          alternativeTheories: {
            id: 'Teori Alternatif: Norman Golb mengajukan teori bahwa naskah-naskah tersebut merupakan perpustakaan bait yang diselamatkan dari Yerusalem saat pengepungan Romawi.',
            en: 'Alternative Theories: Norman Golb proposed that scrolls represent Jerusalem library archives hidden during the Roman siege.',
            ar: 'النظريات البديلة: اقترح نورمان غولب أن المخطوطات تمثل مكتبات مقدسية تم إخفاؤها قبيل الحصار الروماني.',
          },
          scholarlyConsensusOrDispute: {
            id: 'Konsensus akademik memandang Qumran sebagai cerminan keragaman Yahudi Periode Bait Kedua, bukan tradisi monolitik tunggal.',
            en: 'Scholarly consensus views Qumran as evidence of Second Temple Jewish diversity rather than a single monolithic orthodoxy.',
            ar: 'يجمع الباحثون على أن قمران تعكس التعددية الفكرية والفقهية ليهودية الهيكل الثاني.',
          },
        },
        definitionalDistinction: {
          monotheismVsTawhid: {
            id: 'Monoteisme Bait Kedua: Berpusat pada kovenan eksklusif dengan bangsa Israel. Tauhid Islam: Menegaskan keesaan Allah yang mutlak dan berlaku universal bagi seluruh umat manusia tanpa partikularisme etnis.',
            en: 'Second Temple Monotheism: Centered on the covenant with Israel. Islamic Tawhid: Absolute, transcendent monotheism universal to all humanity without ethnic particularism.',
            ar: 'توحيد الهيكل الثاني: ارتبط بالعهد الخاص مع بني إسرائيل. التوحيد الإسلامي: توحيد خالص مطلق وشامل للإنسانية كافة بلا خصوصية عرقية.',
          },
          messianicExpectationsVsPropheticLineage: {
            id: 'Ekspektasi Qumran: Menantikan dua figur mesias (Mesias Harun dan Mesias Daud). Islam: Memandang para nabi sebagai satu mata rantai risalah monoteisme.',
            en: 'Qumran Expectation: Anticipated two messianic figures (Priestly and Davidic). Islam: Views all prophets as one unified chain of revelation.',
            ar: 'تطلعات قمران: ترقب مسيحين (كهنوتي وداودي). الإسلام: يرى الأنبياء سلسلة نورانية واحدة متصلة.',
          },
          halakhicLegalismVsShariaFiqh: {
            id: 'Hukum Qumran berfokus pada kemurnian ritual imamat; Syariat Islam menyeimbangkan kesucian ibadah individual dengan kemaslahatan sosial universal.',
            en: 'Qumran legalism focused on priestly ritual purity; Islamic Sharia balances personal worship with universal societal welfare.',
            ar: 'ركز فقه قمران على طهارة الكهنة الطقسية؛ بينما توازن الشريعة الإسلامية بين العبادة ومقاصد العدالة الاجتماعية.',
          },
        },
        islamicReasoningWalkthrough: {
          revelationContinuity: {
            id: 'Pandangan Islam mengakui bahwa Allah menurunkan petunjuk kepada para nabi terdahulu, namun naskah-naskah kuno tersebut mengalami transmisi dan penyalinan manusiawi.',
            en: 'Islam affirms that divine guidance was revealed to prior prophets, while acknowledging that ancient physical manuscripts underwent human scribal transmission.',
            ar: 'يقر المنظور الإسلامي بإنزال الوحي على الأنبياء السابقين، مع إدراك أن المخطوطات القديمة خضعت لظروف التدوين البشري.',
          },
          scripturalTransmissionHistory: {
            id: "Fakta keragaman varian teks di Qumran selaras dengan penjelasan Al-Qur'an bahwa umat terdahulu diberi amanah menjaga kitab suci secara manual.",
            en: "The textual pluriformity observed in Qumran aligns with the Qur'anic observation that prior communities were entrusted with scribal custody.",
            ar: 'يتوافق التنوع النصي في قمران مع البيان القرآني بأن حفظ الكتب السابقة كان موكولاً لحراسة الأحبار والنساخ.',
          },
          quranicPerspective: {
            surahReference: {
              id: 'QS. Al-Maidah [5]: 44',
              en: 'Surah Al-Ma’idah [5]: 44',
              ar: 'سورة المائدة [5]: 44',
            },
            arabicText:
              'إِنَّا أَنزَلْنَا التَّوْرَاةَ فِيهَا هُدًى وَنُورٌ... بِمَا اسْتُحْفِظُوا مِن كِتَابِ اللَّهِ وَكَانُوا عَلَيْهِ شُهَدَاءَ',
            translation: {
              id: 'Sungguh Kami telah menurunkan Kitab Taurat, di dalamnya ada petunjuk dan cahaya... karena mereka diperintahkan memelihara kitab Allah dan mereka menjadi saksi terhadapnya.',
              en: 'Indeed, We sent down the Torah, in which was guidance and light... by that which they were entrusted of the Scripture of Allah, and they were witnesses thereto.',
              ar: 'إنا أنزلنا التوراة فيها هدى ونور... بما استحفظوا من كتاب الله وكانوا عليه شهداء',
            },
            exegesis: {
              id: 'Imam Ibnu Katsir menjelaskan bahwa kata "bima istuhfizhu" menegaskan bahwa pemeliharaan naskah terdahulu diserahkan kepada para penjaganya, berbeda dengan Al-Qur\'an yang dijamin pemeliharaannya langsung oleh Allah.',
              en: 'Ibn Kathir notes that "bima istuhfizhu" indicates prior scriptures were entrusted to human custodians, whereas the preservation of the Qur\'an is divinely guaranteed.',
              ar: 'بين ابن كثير أن قوله "بما استحفظوا" يدل على أن حفظ الكتب السابقة أوكل إلى البشر، بخلاف القرآن الذي تكفل الله بحفظه.',
            },
          },
          theologicalSynthesis: {
            id: 'Gulungan Laut Mati adalah bukti arkeologis otentik yang memperlihatkan kesungguhan komunitas kuno mencari keridhaan Tuhan, sekaligus bukti konkret proses sejarah naskah.',
            en: 'The Dead Sea Scrolls stand as profound archaeological witnesses to ancient devotion and the realities of manuscript history.',
            ar: 'تمثل مخطوطات البحر الميت شاهداً أثرياً حياً على تطلع الإنسان القديم للحق وحقيقة التاريخ المخطوطي.',
          },
        },
        whatThisDoesAndDoesntProve: {
          id: 'APA YANG TERBUKTI: Adanya variasi teks Kitab Suci Ibrani pada abad ke-1 SM dan intensitas ibadah komunitas Qumran. APA YANG TIDAK TERBUKTI: Naskah ini bukan bukti langsung nubuatan modern atau konfirmasi literal klaim apologetika spekulatif.',
          en: 'WHAT IT PROVES: Pluriformity of Hebrew scriptures in the 1st c. BCE and intense sectarian devotion. WHAT IT DOES NOT PROVE: It does not serve as direct proof for speculative modern apologetic claims.',
          ar: 'ما يثبته الكشف: التنوع النصي للنصوص العبرية في القرن الأول قبل الميلاد وحيوية التدين القديم. ما لا يدعيه: ليس دليلاً حرفياً على ادعاءات دفاعية متكلفة.',
        },
        reflectiveQuestion: {
          id: 'Bagaimana studi kritis terhadap naskah kuno membantu kita lebih menghargai mukjizat keterpeliharaan firman Tuhan dalam sejarah manusia?',
          en: 'How does the critical study of ancient manuscripts illuminate the profound reality of scriptural transmission across human history?',
          ar: 'كيف يعمق الفحص النقدي للمخطوطات التاريخية إدراكنا لظاهرة صيانة الوحي عبر العصور؟',
        },
        metrics: [
          {
            label: {
              id: 'Jumlah Manuskrip Teridentifikasi',
              en: 'Identified Manuscripts',
              ar: 'عدد المخطوطات الموثقة',
            },
            value: '~900 Scrolls',
            primarySourceCitation:
              'Emanuel Tov, Revised Lists of the Texts from the Judaean Desert (Brill, 2010)',
            independentVerificationUrl: 'https://www.deadseascrolls.org.il/featured-scrolls',
          },
          {
            label: {
              id: 'Rentang Penanggalan Karbon',
              en: 'Radiocarbon Date Range',
              ar: 'النطاق الزمني للكربون',
            },
            value: 'c. 250 BCE – 68 CE',
            primarySourceCitation:
              'Radiocarbon Dating of the Dead Sea Scrolls, Radiocarbon Vol 33 (1991)',
            independentVerificationUrl: 'https://www.jstor.org/stable/10.1086/676388',
          },
        ],
        epistemologicalMatrix: [
          {
            category: 'FACT',
            statement: {
              id: 'Manuskrip ditemukan di 11 gua Qumran antara 1947–1956 dengan total sekitar 25.000 fragmen.',
              en: 'Manuscripts were recovered from 11 Qumran caves between 1947–1956 totaling ~25,000 fragments.',
              ar: 'تم العثور على المخطوطات في 11 كهفاً بقمران بين عامي 1947 و1956 بنحو 25 ألف قصاصة.',
            },
            sources: [
              {
                name: 'Israel Antiquities Authority',
                url: 'https://www.deadseascrolls.org.il',
                tier: 1,
                type: 'archive',
              },
            ],
            confidenceLevel: 'High',
          },
          {
            category: 'EVIDENCE',
            statement: {
              id: 'Gulungan Besar Yesaya (1QIsa-a) terbukti secara paleografi dan uji karbon berasal dari kurun abad ke-2 SM.',
              en: 'The Great Isaiah Scroll (1QIsa-a) is paleographically and carbon-dated to the 2nd century BCE.',
              ar: 'لفافة إشعياء الكبرى (1QIsa-a) مؤرخة علمياً للقرن الثاني قبل الميلاد.',
            },
            sources: [
              {
                name: 'Radiocarbon Journal (ETH Zurich & Arizona)',
                url: 'https://doi.org/10.1017/S003382220004033X',
                tier: 1,
                type: 'research-paper',
              },
            ],
            confidenceLevel: 'High',
          },
          {
            category: 'COUNTERARGUMENT',
            statement: {
              id: 'Sebagian apologis mengklaim naskah Qumran 100% identik dengan teks Masoretik; sarjana teks (Emanuel Tov) membuktikan terdapat perbedaan ortografi dan varian redaksional yang signifikan.',
              en: 'Some apologetics claim Qumran is 100% identical to the Masoretic text; textual critics (Emanuel Tov) prove substantial orthographic and editorial variants exist.',
              ar: 'يدعي بعض المدافعين التطابق التام مع النص الماسوري؛ بينما يثبت نقاد النصوص وجود تنوعات إملائية وتحريرية مهمة.',
            },
            sources: [
              {
                name: 'Emanuel Tov, Textual Criticism of the Hebrew Bible (Fortress Press)',
                url: 'https://www.brill.com/display/title/15477',
                tier: 1,
                type: 'academic-book',
              },
            ],
            confidenceLevel: 'High',
          },
          {
            category: 'UNCERTAINTY',
            statement: {
              id: 'Identitas pasti komunitas penghuni Khirbet Qumran (apakah sekte Eseni murni atau kelompok Saduki/Zadokite) masih menjadi perdebatan ilmiah terbuka.',
              en: 'The exact historical identity of the Qumran inhabitants (strictly Essene vs. Sadducean/Zadokite) remains an open scholarly debate.',
              ar: 'الهوية التاريخية الدقيقة لجماعة قمران (هل هم أسينيون خالصون أم صدوقيون) لا تزال محل نقاش أكاديمي مستمر.',
            },
            sources: [
              {
                name: 'Oxford Handbook of the Dead Sea Scrolls',
                url: 'https://academic.oup.com/edited-volume/34360',
                tier: 1,
                type: 'academic-book',
              },
            ],
            confidenceLevel: 'Debated',
          },
        ],
        sources: [
          {
            name: 'The Leon Levy Dead Sea Scrolls Digital Library (Israel Antiquities Authority)',
            url: 'https://www.deadseascrolls.org.il',
            tier: 1,
            type: 'archive',
          },
          {
            name: 'Oxford Handbook of the Dead Sea Scrolls (Oxford University Press)',
            url: 'https://academic.oup.com/edited-volume/34360',
            tier: 1,
            type: 'research-paper',
          },
          {
            name: 'Biblical Archaeology Review: Qumran Special Editions',
            url: 'https://www.biblicalarchaeology.org/category/reviews/dead-sea-scrolls-books/',
            tier: 2,
            type: 'academic-journal',
          },
        ],
      },

      // 2. Jesus / Isa & Concept of Muslim as Total Submission
      {
        id: 'jesus-isa-prayer-submission-tawhid-study',
        eventDate: todayStr,
        topicCategory: 'JesusSubmissionTawhid',
        titles: {
          id: 'Bagaimana Yesus Berdoa? Menelaah Praktik Sujud dan Makna Teologis "Muslim" dalam Tradisi Kenabian',
          en: 'How Did Jesus Pray? Examining Prostration and the Meaning of Submission Across Prophetic History',
          ar: 'كيف كان المسيح يصلي؟ دراسة السجود والمعنى الوجودي للإسلام في تاريخ النبوات',
        },
        keywords: [
          'jesus-in-islam',
          'prophetic-prayer',
          'prostration-sujud',
          'tawhid',
          'submission-to-god',
          'comparative-theology',
        ],
        narrativeHook: {
          id: 'Dalam kesunyian Taman Getsemani pada malam yang genting, teks Injil mencatat momen di mana Yesus merebahkan dirinya ke tanah untuk memohon kepada Tuhan...',
          en: 'In the silence of the Garden of Gethsemane on a fateful night, canonical Gospel records describe Jesus falling with his face to the ground in intense prayer...',
          ar: 'في سكون بستان جثسيماني في ليلة عصيبة، تسجل نصوص الأناجيل لحظة خر فيها المسيح على وجهه متضرعاً إلى الله...',
        },
        readerHook: {
          id: 'Menelaah catatan sejarah tentang cara berdoa para nabi—mulai dari Abraham, Musa, hingga Yesus—mengungkapkan benang merah ibadah ketundukan total (Islam) yang melintasi zaman.',
          en: 'Examining historical records of how prophets prayed—from Abraham and Moses to Jesus—reveals an unbroken continuum of radical submission (Islam).',
          ar: 'يكشف فحص النصوص التاريخية لصلوات الأنبياء—من إبراهيم وموسى إلى عيسى—عن خيط نوراني متصل من الانقياد التام لله وحده.',
        },
        universalQuestion: {
          id: 'Apakah istilah "Muslim" sekadar label komunal masa kini, ataukah esensi terdalam dari seluruh tradisi kenabian yang tunduk pada Sang Pencipta?',
          en: 'Is the term "Muslim" merely a modern sectarian identity, or the core existential attitude of all prophetic surrender to God?',
          ar: 'هل لفظ "المسلم" مجرد هوية مذهبية معاصرة، أم هو جوهر الموقف الوجودي لكل نبي استسلم لمولاه؟',
        },
        editorialAngle: 'Academic In-Depth Essay',
        archaeologicalDetails: {
          discoveryNarrative: {
            id: 'Analisis tekstual terhadap naskah Injil bahasa Yunani Kuno (Codex Sinaiticus, Codex Vaticanus) pada Matius 26:39 menunjukkan penggunaan frasa "epesen epi prosōpon autou" (jatuh di atas wajahnya / bersujud).',
            en: 'Textual analysis of ancient Greek manuscripts (Codex Sinaiticus, Vaticanus) on Matthew 26:39 establishes the phrase "epesen epi prosōpon autou" (fell upon his face).',
            ar: 'يثبت التحقيق النصي للمخطوطات اليونانية القديمة (السينائية والفاتيكانية) في متى 26: 39 استخدام عبارة "خر على وجهه".',
          },
          caveAndManuscriptCount: {
            id: 'Tradisi sujud tercatat konsisten dalam Taurat (Kejadian 17:3 untuk Abraham, Bilangan 20:6 untuk Musa/Harun) dan Injil (Lukas 6:12, Matius 26:39).',
            en: 'Prostration is consistently documented in the Pentateuch (Genesis 17:3, Numbers 20:6) and Gospels (Luke 6:12, Matthew 26:39).',
            ar: 'توثق أسفار التوراة (تكوين 17: 3، عدد 20: 6) والأناجيل (لوقا 6: 12، متى 26: 39) السجود كسمة أصيلة للأنبياء.',
          },
          radiocarbonAndPaleographyDating: {
            id: 'Naskah papirus abad ke-3 (P45, P75) dan kodeks uncial abad ke-4 mengonfirmasi keaslian rekaman historis praktik doa kenabian tersebut.',
            en: '3rd-century papyri (P45, P75) and 4th-century uncial codices confirm the antiquity of these prayer narratives.',
            ar: 'تؤكد برديات القرن الثالث (P45, P75) ومخطوطات القرن الرابع أصالة هذه الشواهد النصية.',
          },
          keyTexts: [
            {
              siglum: 'Matt-26-39',
              name: {
                id: 'Matius 26:39 (Getsemani)',
                en: 'Matthew 26:39 (Gethsemane)',
                ar: 'إنجيل متى 26: 39',
              },
              dateEstimate: { id: 'Abad ke-1 M', en: '1st Century CE', ar: 'القرن الأول الميلادي' },
              description: {
                id: 'Mencatat Yesus sujud ke tanah dan berdoa agar kehendak Bapa yang terlaksana, bukan kehendak dirinya sendiri.',
                en: 'Records Jesus falling prostrate, praying that the Father’s will be done rather than his own.',
                ar: 'يوثق سجود المسيح وتضرعه بأن تنفذ مشيئة الله لا مشيئته الخاصة.',
              },
            },
          ],
          textualLandscape: {
            id: 'Secara semantik dalam bahasa Semitik (Ibrani "Shalah", Aram "Tslotha", Arab "Shalat"), ibadah selalu memadukan ketundukan batiniah dan ekspresi fisik sujud.',
            en: 'Semitic linguistic heritage (Hebrew Shalah, Aramaic Tslotha, Arabic Salah) inextricably links inner devotion with physical prostration.',
            ar: 'يربط الجذر السامي المشترك (العبري والأرامي والعربي) بين الصلاة القلبية والسجود الجسدي التام.',
          },
        },
        scholarlyDebate: {
          esseneHypothesis: {
            id: 'Teologi Kristen memandang doa Getsemani sebagai ekspresi ketaatan kodrat manusia Yesus terhadap kehendak Ilahi dalam kerangka Trinitas.',
            en: 'Christian theology interprets Gethsemane as the submission of Jesus’ human will to the divine will within the Trinitarian framework.',
            ar: 'تفسر اللاهوتيات المسيحية صلاة جثسيماني كخضوع من الطبيعة البشرية للمسيح للمشيئة الإلهية.',
          },
          alternativeTheories: {
            id: 'Perspektif Kritis-Historis (Geza Vermes, Bart Ehrman) menempatkan Yesus sebagai nabi eskatologis Yahudi yang mengajarkan kepatuhan mutlak kepada Allah semata.',
            en: 'Historical-Critical scholarship (Geza Vermes, Bart Ehrman) situates Jesus as a Jewish prophet preaching uncompromising submission to God alone.',
            ar: 'يرى الباحثون التاريخيون (مثل فيرميس وإيرمان) أن يسوع كان نبياً يهودياً يعلم الخضوع المطلق لله وحده.',
          },
          scholarlyConsensusOrDispute: {
            id: 'Diskusi ilmiah memperlihatkan bahwa istilah linguistik "muslim" (yang berpasrah total kepada Tuhan) merefleksikan sikap spiritual yang diajarkan oleh seluruh nabi.',
            en: 'Scholarly consensus affirms that the linguistic concept of "submission to God" represents the universal core of Semitic monotheism.',
            ar: 'يتفق الباحثون على أن مفهوم الاستسلام لله يمثل جوهر التوحيد السامي عبر التاريخ.',
          },
        },
        definitionalDistinction: {
          monotheismVsTawhid: {
            id: 'Islam mendefinisikan "Muslim" secara ontologis: siapa saja yang menundukkan kehendak dan hidupnya hanya kepada Allah, sebagaimana Nabi Isa menyatakan dalam QS. Ali Imran [3]: 52.',
            en: 'Islam defines "Muslim" ontologically: anyone who submits their will completely to Allah, as articulated by Jesus’ disciples in Surah Ali ‘Imran [3]: 52.',
            ar: 'يعرف الإسلام "المسلم" وجودياً: كل من استسلم وانقاد لله وحده، كما صرح الحواريون في سورة آل عمران [3]: 52.',
          },
          messianicExpectationsVsPropheticLineage: {
            id: 'Yesus dalam Islam adalah Al-Masih dan Rasul agung yang diutus kepada Bani Israel untuk memurnikan Tauhid dan meluruskan hukum Taurat.',
            en: 'Jesus in Islam is the Messiah and noble Messenger sent to the Children of Israel to revive pure monotheism and elucidate the Law.',
            ar: 'المسيح في الإسلام رسول عظيم ومبارك أرسل إلى بني إسرائيل لتجديد التوحيد الخالص.',
          },
          halakhicLegalismVsShariaFiqh: {
            id: 'Ibadah para nabi bukan formalitas mekanis, melainkan perpaduan antara ketakwaan tauhid yang murni dan etika welas asih sosial.',
            en: 'Prophetic worship is never mere legal formalism, but the harmonious fusion of transcendent monotheism and universal compassion.',
            ar: 'لم تكن عبادة الأنبياء طقساً شكلياً، بل امتزاجاً حياً بين التوحيد النقي والرحمة الإنسانية.',
          },
        },
        islamicReasoningWalkthrough: {
          revelationContinuity: {
            id: "Al-Qur'an menegaskan bahwa agama seluruh nabi sejak Adam, Nuh, Ibrahim, Musa hingga Isa adalah satu: Al-Islam (berserah diri secara mutlak kepada Allah).",
            en: "The Qur'an unequivocally establishes that the foundational religion of all prophets is one: Al-Islam (absolute surrender to God).",
            ar: 'يقرر القرآن الكريم وحدة الدين عند الأنبياء جميعاً: وهو الإسلام القائم على إفراد الله بالعبادة.',
          },
          scripturalTransmissionHistory: {
            id: 'Penyelidikan terhadap teks Alkitab menunjukkan sisa-sisa jejak tradisi tauhid dan ibadah sujud yang dipraktikkan oleh para nabi masa lampau.',
            en: 'Investigating biblical records reveals enduring traces of ancient monotheistic devotion and physical prostration practiced by prior prophets.',
            ar: 'يكشف التحقيق المقارن في نصوص الكتاب المقدس شواهد باقية على سجود الأنبياء وخضوعهم لله.',
          },
          quranicPerspective: {
            surahReference: {
              id: "QS. Ali 'Imran [3]: 84",
              en: 'Surah Ali ‘Imran [3]: 84',
              ar: 'سورة آل عمران [3]: 84',
            },
            arabicText:
              'قُلْ آمَنَّا بِاللَّهِ وَمَا أُنزِلَ عَلَيْنَا وَمَا أُنزِلَ عَلَىٰ إِبْرَاهِيمَ وَإِسْمَاعِيلَ وَإِسْحَاقَ وَيَعْقُوبَ وَالْأَسْبَاطِ وَمَا أُوتِيَ مُوسَىٰ وَعِيسَىٰ وَالنَّبِيُّونَ مِن رَّبِّهِمْ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّنْهُمْ وَنَحْنُ لَهُ مُسْلِمُونَ',
            translation: {
              id: 'Katakanlah: "Kami beriman kepada Allah dan kepada apa yang diturunkan kepada kami dan yang diturunkan kepada Ibrahim, Ismail, Ishaq, Ya\'qub dan anak cucunya, serta apa yang diberikan kepada Musa, Isa dan para nabi dari Tuhan mereka. Kami tidak membeda-bedakan seorang pun di antara mereka dan hanya kepada-Nya kami berserah diri."',
              en: 'Say, "We have believed in Allah and in what was revealed to us and what was revealed to Abraham, Ishmael, Isaac, Jacob, and the Descendants, and in what was given to Moses and Jesus and to the prophets from their Lord. We make no distinction between any of them, and we are Muslims [submitting] to Him."',
              ar: 'قل آمنا بالله وما أنزل علينا وما أنزل على إبراهيم وإسماعيل وإسحاق ويعقوب والأسسباط وما أوتي موسى وعيسى والنبيون من ربهم لا نفرق بين أحد منهم ونحن له مسلمون',
            },
            exegesis: {
              id: 'Al-Hafizh Ibnu Katsir menjelaskan bahwa ayat ini adalah piagam persaudaraan universal seluruh nabi, di mana syariat cabang mereka dapat berbeda sesuai zamannya namun akidah pokok mereka adalah satu yaitu Tauhid.',
              en: 'Ibn Kathir expounds that this verse establishes the universal brotherhood of all prophets; though secondary laws varied by era, their foundational creed was invariably Tawhid.',
              ar: 'أوضح ابن كثير أن هذه الآية ميثاق لوحدة رسالة الأنبياء، اتحدوا في أصل التوحيد وتنوعت شرائعهم بحسب العصور.',
            },
          },
          theologicalSynthesis: {
            id: 'Meneladani Yesus yang bersujud dan berserah diri adalah panggilan bagi setiap pencari kebenaran untuk kembali kepada inti ibadah: merendahkan diri di hadapan Sang Khalik.',
            en: 'Reflecting on Jesus in prostration invites every earnest seeker to the core of worship: humble surrender before the Creator.',
            ar: 'إن تأمل المسيح وهو ساجد لله دعوة لكل باحث عن الحقيقة للعودة إلى جوهر العبادة: الخضوع لجلال الخالق.',
          },
        },
        whatThisDoesAndDoesntProve: {
          id: 'APA YANG TERBUKTI: Bahwa sujud dan doa ketundukan adalah praktik historis para nabi termasuk Yesus. APA YANG TIDAK BOLEH DIPAKSAKAN: Tidak boleh mengklaim secara simplistik tanpa menjelaskan konteks teologis dan linguistik istilah "Muslim" dalam ranah akademis.',
          en: 'WHAT IT PROVES: Physical prostration and total submission are historical hallmarks of prophetic prayer. WHAT MUST NOT BE CLAIMED: One must not make crude anachronistic claims without rigorous semantic and contextual framing.',
          ar: 'ما يثبته البحث: أن السجود والانقياد سمتان تاريخيتان لصلاة الأنبياء. ما لا يجوز ادعاؤه: إطلاق مسميات معاصرة دون ضبط سياقها اللغوي واللاهوتي الدقيق.',
        },
        reflectiveQuestion: {
          id: 'Apakah cara kita beribadah hari ini mencerminkan kerendahan hati dan kepasrahan mutlak yang telah dicontohkan oleh para nabi sepanjang sejarah?',
          en: 'Does our contemporary worship reflect the profound humility and total surrender exemplified by the prophets across millennia?',
          ar: 'هل تعكس صلاتنا اليوم روح الإخبات والاستسلام المطلق الذي جسده الأنبياء عبر التاريخ؟',
        },
        metrics: [
          {
            label: {
              id: 'Catatan Tekstual Sujud Para Nabi',
              en: 'Textual Records of Prostration',
              ar: 'الشواهد النصية للسجود',
            },
            value: '>15 Biblical Passages',
            primarySourceCitation:
              'Codex Sinaiticus & Vaticanus (Gospel of Matthew, Luke, Pentateuch)',
            independentVerificationUrl: 'https://www.codexsinaiticus.org',
          },
        ],
        epistemologicalMatrix: [
          {
            category: 'FACT',
            statement: {
              id: 'Naskah kanonik Perjanjian Baru (Matius 26:39) mendokumentasikan bahwa Yesus merebahkan diri ke tanah (sujud) saat berdoa di Getsemani.',
              en: 'Canonical New Testament manuscripts (Matthew 26:39) record Jesus falling prostrate in prayer at Gethsemane.',
              ar: 'توثق مخطوطات العهد الجديد القانونية (متى 26: 39) سقوط المسيح على وجهه ساجداً في جثسيماني.',
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
            category: 'ISLAMIC_INTERPRETATION',
            statement: {
              id: 'Islam memandang tindakan sujud Nabi Isa sebagai wujud ibadah murni seorang hamba dan rasul kepada Allah SWT.',
              en: 'Islam interprets Jesus’ prostration as an authentic act of prophetic worship rendered exclusively to Allah.',
              ar: 'يرى الإسلام في سجود عيسى عليه السلام تجسيداً لعبودية الرسول لربه وخالقه.',
            },
            sources: [
              {
                name: 'Tafsir Ibn Kathir (Surah Ali Imran 3:52-84)',
                url: 'https://quran.ksu.edu.sa',
                tier: 1,
                type: 'academic-book',
              },
            ],
            confidenceLevel: 'High',
          },
          {
            category: 'COUNTERARGUMENT',
            statement: {
              id: 'Teologi Trinitarian arus utama menafsirkan doa Yesus bukan sebagai ketidakberdayaan seorang makhluk ciptaan, melainkan ketaatan hypostatic Pribadi Anak kepada Bapa.',
              en: 'Mainstream Trinitarian theology interprets Jesus’ prayer not as creaturely subordination, but as the hypostatic obedience of the Son to the Father.',
              ar: 'يفسر اللاهوت التثليثي صلاة المسيح ليس كعجز للمخلوق بل كطاعة أقنومية من الابن للآب.',
            },
            sources: [
              {
                name: 'Oxford Dictionary of the Christian Church',
                url: 'https://academic.oup.com',
                tier: 1,
                type: 'academic-book',
              },
            ],
            confidenceLevel: 'High',
          },
          {
            category: 'UNCERTAINTY',
            statement: {
              id: 'Bentuk rinci gerakan salat para nabi sebelum era Nabi Muhammad SAW tidak didokumentasikan secara lengkap dalam naskah kuno kecuali deskripsi umum seperti sujud dan rukuk.',
              en: 'The precise liturgical steps of prayer practiced by pre-Islamic prophets are not exhaustively preserved in extant manuscripts beyond general postures.',
              ar: 'التفاصيل الحركية الدقيقة لصلوات الأنبياء القدامى لم تُحفظ كاملة عدا الهيئات العامة كالسجود والركوع.',
            },
            sources: [
              {
                name: "Encyclopaedia of the Qur'an (Brill)",
                url: 'https://referenceworks.brillonline.com',
                tier: 1,
                type: 'academic-book',
              },
            ],
            confidenceLevel: 'Moderate',
          },
        ],
        sources: [
          {
            name: 'Codex Sinaiticus Digital Manuscript Project (British Library / Leipzig)',
            url: 'https://www.codexsinaiticus.org',
            tier: 1,
            type: 'archive',
          },
          {
            name: "Geza Vermes, Jesus the Jew: A Historian's Reading of the Gospels (Fortress Press)",
            url: 'https://www.fortresspress.com',
            tier: 1,
            type: 'academic-book',
          },
          {
            name: 'Journal of Biblical Literature (Society of Biblical Literature)',
            url: 'https://www.sbl-site.org/publications/journals/jbl.aspx',
            tier: 2,
            type: 'academic-journal',
          },
        ],
      },

      // 3. Cosmic Expansion & Big Bang in Qur'an & Astrophysics
      {
        id: 'quran-cosmic-expansion-astrophysics-study',
        eventDate: todayStr,
        topicCategory: 'CosmicExpansion',
        titles: {
          id: 'Ekspansi Alam Semesta dan Kosmologi Al-Qur\'an: Analisis Semantik "Musi\'un" dan Batasan Sains Modern',
          en: 'Cosmic Expansion and Qur\'anic Cosmology: Semantic Analysis of "Musi\'un" and the Limits of Modern Science',
          ar: 'تمدد الكون والفيزياء الفلكية في القرآن: دراسة دلالية لكلمة "موسعون" وحدود العلم المعاصر',
        },
        keywords: [
          'cosmic-expansion',
          'astrophysics',
          'quran-and-science',
          'big-bang',
          'tafsir-cosmology',
          'epistemology',
        ],
        narrativeHook: {
          id: 'Ketika Edwin Hubble mengamati pergeseran merah (redshift) galaksi-galaksi jauh pada tahun 1929 di Observatorium Mount Wilson, fondasi pemahaman manusia tentang alam semesta yang statis runtuh seketika...',
          en: 'When Edwin Hubble observed the redshift of distant galaxies in 1929 at Mount Wilson Observatory, humanity’s static cosmological model collapsed forever...',
          ar: 'حين رصد إدوين هابل الانزياح نحو الأحمر للمجرات البعيدة عام 1929 في مرصد جبل ويلسون، انهارت الرؤية السكونية القديمة للكون إلى غير رجعة...',
        },
        readerHook: {
          id: 'Teks Al-Qur\'an pada Surah Adz-Dzariyat [51]: 47 menyebutkan penciptaan langit dan frasa "wa inna la-musi\'un". Bagaimana para ahli bahasa Arab klasik dan fisikawan modern menelaah korelasi ini tanpa jatuh ke dalam klaim apologetika semu?',
          en: 'Surah Adh-Dhariyat [51]: 47 describes the heavens and uses the phrase "wa inna la-musi\'un". How do classical Arabic linguists and modern physicists evaluate this correlation without falling into concordist pseudoscience?',
          ar: 'تصف سورة الذاريات [51]: 47 خلق السماء وتختم بعبارة "وإنا لموسعون". كيف يقرأ علماء اللغة وتاريخ العلوم هذه الآية دون الوقوع في التفسير الإعجازي المتكلف؟',
        },
        universalQuestion: {
          id: 'Apakah Al-Qur\'an adalah buku teks astrofisika, ataukah kitab tanda-tanda (ayat) yang membimbing akal manusia untuk merenungi keagungan penciptaan?',
          en: 'Is the Qur\'an a textbook of theoretical astrophysics, or a book of existential signs (ayat) guiding human reason to contemplate the cosmos?',
          ar: 'هل القرآن كتاب فيزياء فلكية، أم كتاب آيات ودلائل يهدي العقل البشري للتفكر في عظمة الخلق؟',
        },
        editorialAngle: 'Academic In-Depth Essay',
        archaeologicalDetails: {
          discoveryNarrative: {
            id: 'Model astrofisika Lambda-CDM modern membuktikan bahwa ruang-waktu terus mengembang sejak peristiwa singularitas Big Bang sekitar 13.8 miliar tahun silam.',
            en: 'The standard Lambda-CDM model confirms space-time metric expansion since the Big Bang singularity ~13.8 billion years ago.',
            ar: 'يثبت نموذج Lambda-CDM الكوني المعاصر تمدد نسيج الزمكان المستمر منذ الانفجار العظيم قبل نحو 13.8 مليار سنة.',
          },
          caveAndManuscriptCount: {
            id: 'Kamus bahasa Arab klasik tertua (Kitab al-\'Ayn karya Al-Khalil bin Ahmad, Lisan al-\'Arab karya Ibnu Manzhur) mendokumentasikan bahwa akar kata "w-s-\'" bermakna perluasan, kelapangan daya, dan peluasan ruang.',
            en: 'Classical Arabic lexicons (Kitab al-\'Ayn, Lisan al-\'Arab) establish that root "w-s-\'" denotes spatial expansion and vast creative potency.',
            ar: 'توثق معاجم اللغة الكبرى (كتاب العين ولسان العرب) أن الجذر "وسع" يفيد السعة المكانية والبسط والقدرة الفائقة.',
          },
          radiocarbonAndPaleographyDating: {
            id: 'Naskah Al-Qur\'an abad ke-1 Hijriyah (Manuskrip Birmingham dan Sana\'a) membuktikan keaslian lafal teks Surah Adz-Dzariyat tanpa perubahan ortografi makna.',
            en: '7th-century Qur\'anic folios (Birmingham, Sana\'a) confirm the absolute textual stability of Surah Adh-Dhariyat 51:47.',
            ar: 'تؤكد رقائق المصاحف المبكرة في برمنغهام وصنعاء الثبات النصي التام لآية سورة الذاريات.',
          },
          keyTexts: [
            {
              siglum: 'QS-51-47',
              name: { id: 'Surah Adz-Dzariyat: 47', en: 'Surah Adh-Dhariyat: 47', ar: 'سورة الذاريات: 47' },
              dateEstimate: { id: 'Wahyu Makkiyah', en: 'Meccan Revelation', ar: 'مكية' },
              description: {
                id: 'Menyatakan pembangunan langit dengan kekuasaan dan keadaan "musi\'un" (meluaskan / berkuasa meluaskan).',
                en: 'States the divine construction of the heavens with power and continuous expansion (musi\'un).',
                ar: 'تقرر بناء السماء بقوة وإنا لموسعون في القدرة والمكان.',
              },
            },
          ],
          textualLandscape: {
            id: 'Tafsir klasik seperti Ath-Thabari dan Ar-Razi menafsirkan kata ini mencakup kelapangan rezeki dan perluasan penjuru langit secara fisik.',
            en: 'Classical exegesis (Al-Tabari, Al-Razi) recognized that the term encompasses both boundless capacity and spatial expansion.',
            ar: 'أشار المفسرون الأوائل كابن جرير الطبري والرازي إلى أن الآية تحتمل السعة المكانية والقدرة المعجزة.',
          },
        },
        scholarlyDebate: {
          esseneHypothesis: {
            id: 'Pendekatan Konkordisme Sains: Sebagian sarjana Muslim modern (seperti Maurice Bucaille, Zaghloul El-Naggar) memandang ayat ini sebagai bukti eksplisit sains modern mendahului zamannya.',
            en: 'Scientific Concordism: Modern writers (Bucaille, El-Naggar) interpret the verse as direct predictive proof of metric cosmic expansion.',
            ar: 'المقاربة التوفيقية: يرى بعض الباحثين المعاصرين أن الآية تمثل إعجازاً علمياً صريحاً سبق كشوفات العصر الحديث.',
          },
          alternativeTheories: {
            id: 'Kritik Akademik Independen: Ahli studi Islam (seperti Nidhal Guessoum, Ziauddin Sardar) menekankan bahaya menautkan teks suci pada teori sains yang terus berkembang, menegaskan Al-Qur\'an menggunakan bahasa sastra puitis yang kaya.',
            en: 'Critical Academic Consensus: Scholars (Nidhal Guessoum, Ziauddin Sardar) caution against strict concordism, emphasizing the poetic and theological depth of the text.',
            ar: 'النقد الأكاديمي الرصين: يحذر علماء مسلمون (مثل نضال قسوم) من الإفراط التوفيقي ويركزون على البعد المعرفي والجمالي للنص.',
          },
          scholarlyConsensusOrDispute: {
            id: 'Konsensus ilmiah yang berimbang memandang keajaiban Al-Qur\'an terletak pada ketepatan bahasanya yang tidak pernah bertentangan dengan realitas alam semesta.',
            en: 'Balanced intellectual consensus maintains that the profound beauty of the Qur\'an lies in its harmony with cosmic reality without needing pseudo-scientific forcing.',
            ar: 'يجمع التحقيق المتزن على أن بهاء القرآن يتجلى في انسجامه مع نواميس الكون دون تكلف ليّ النصوص.',
          },
        },
        definitionalDistinction: {
          monotheismVsTawhid: {
            id: 'Kosmologi Sekuler memandang alam semesta muncul dari fluktuasi kuantum acak; Tauhid memandang singularitas kosmos sebagai ketetapan penciptaan dari Sang Khaliq Yang Maha Bijaksana.',
            en: 'Secular cosmology posits universe emergence from unguided quantum fluctuations; Tawhid recognizes cosmic singularity as the deliberate design of the Transcendent Creator.',
            ar: 'تفسر النظريات المادية نشأة الكون بتقلبات كمومية عشوائية؛ بينما يقرر التوحيد أن بدء الخلق فعل إرادي لله الحكيم الخبير.',
          },
          messianicExpectationsVsPropheticLineage: {
            id: 'Penciptaan alam semesta dalam Al-Qur\'an adalah panggung tanda-tanda (Ayat) bagi manusia berakal untuk bertauhid.',
            en: 'Cosmic creation in the Qur\'an serves as a cosmic theater of signs (Ayat) inviting intellectual reflection.',
            ar: 'يمثل الخلق الكوني في القرآن مسرحاً للآيات الكبرى يدعو أولي الألباب للإيمان.',
          },
          halakhicLegalismVsShariaFiqh: {
            id: 'Sains mengkaji "bagaimana" (mekanisme materi); Al-Qur\'an menjawab "mengapa" (tujuan dan makna eksistensial).',
            en: 'Science investigates the empirical "how" (mechanisms); the Qur\'an illuminates the existential "why" (purpose and meaning).',
            ar: 'يبحث العلم الطبيعي في الكيفيات والآليات؛ بينما يجيب القرآن عن الغايات والمعنى الوجودي.',
          },
        },
        islamicReasoningWalkthrough: {
          revelationContinuity: {
            id: 'Al-Qur\'an tidak pernah mengajarkan mitologi kosmologis geosentris kaku, melainkan menggunakan metafora yang selaras dengan akal dan observasi.',
            en: 'The Qur\'an avoids ancient geocentric mythologies, utilizing expansive expressions congruent with empirical observation.',
            ar: 'تسامى البيان القرآني عن الخرافات الكونية القديمة، مخاطباً الإنسان بلغة تتطابق مع مشاهدات العقل الرشيد.',
          },
          scripturalTransmissionHistory: {
            id: 'Studi filologi Arab membuktikan bahwa kata "musi\'un" merupakan bentuk isim fa\'il jamak yang merefleksikan keberlanjutan kapasitas perluasan.',
            en: 'Arabic philology demonstrates that "musi\'un" (active participle) grammatically accommodates ongoing expansiveness.',
            ar: 'يثبت التحقيق اللغوي أن صيغة اسم الفاعل "موسعون" تفيد السعة والقدرة والتجدد.',
          },
          quranicPerspective: {
            surahReference: { id: 'QS. Adz-Dzariyat [51]: 47', en: 'Surah Adh-Dhariyat [51]: 47', ar: 'سورة الذاريات [51]: 47' },
            arabicText: 'وَالسَّمَاءَ بَنَيْنَاهَا بِأَيْدٍ وَإِنَّا لَمُوسِعُونَ',
            translation: {
              id: 'Dan langit itu Kami bangun dengan kekuasaan (Kami) dan sesungguhnya Kami benar-benar meluaskannya.',
              en: 'And the heaven We constructed with strength, and indeed, We are [its] expander.',
              ar: 'والسماء بنيناها بأيد وإنا لموسعون',
            },
            exegesis: {
              id: 'Imam Fakhruddin Ar-Razi dalam Mafatih al-Ghaib menjelaskan bahwa kata "aidin" bermakna quwwah (kekuatan mutlak) dan "inna la-musi\'un" bermakna bahwa kekuasaan Allah melampaui segala batas dan meluaskan segala cakrawala.',
              en: 'Fakhr al-Din al-Razi notes that "aidin" denotes supreme creative power, while "musi\'un" affirms boundless divine sovereignty expanding beyond all horizons.',
              ar: 'بين الإمام الفخر الرازي في مفاتيح الغيب أن البناء بالأيد يعني كمال القدرة، و"لموسعون" تدل على سعة الملك والقدرة التي لا يحدها حصر.',
            },
          },
          theologicalSynthesis: {
            id: 'Memperhatikan alam semesta yang luas adalah jembatan rasional yang menghubungkan sains empiris dengan kerendahan hati spiritual di hadapan Allah.',
            en: 'Contemplating the expanding cosmos is a rational bridge linking empirical science with spiritual awe before the Creator.',
            ar: 'إن تأمل الكون المتسع جسر عقلاني يربط كشوفات العلم بخشوع القلب وجلال الإيمان.',
          },
        },
        whatThisDoesAndDoesntProve: {
          id: 'APA YANG TERBUKTI: Bahasa Al-Qur\'an luar biasa presisi dan kompatibel dengan fenomena kosmologis modern. APA YANG TIDAK BOLEH DIKLAIM: Al-Qur\'an bukan rumus matematika fisika atau pembenaran bagi klaim pseudosains yang serampangan.',
          en: 'WHAT IT PROVES: The remarkable semantic precision of Qur\'anic phrasing and its harmony with cosmic realities. WHAT MUST NOT BE CLAIMED: The Qur\'an is not a mathematical treatise of quantum gravity.',
          ar: 'ما يثبته البحث: الدقة اللغوية الاستثنائية للبيان القرآني وتناغمه مع نواميس الكون. ما لا يجوز ادعاؤه: تحويل القرآن إلى معادلات فيزيائية متغيرة.',
        },
        reflectiveQuestion: {
          id: 'Ketika sains modern mengungkap luasnya alam semesta hingga triliunan galaksi, bagaimana penemuan ini memperdalam rasa syukur dan ketakjuban kita kepada Sang Pencipta?',
          en: 'As modern astrophysics reveals billions of expanding galaxies, how does this profound scale deepen our humility before the Sovereign Creator?',
          ar: 'مع كشف الفيزياء الفلكية لمليارات المجرات السابحة، كيف يعمق هذا الاتساع المهيب افتقارنا وتواضعنا أمام عظمة الخالق؟',
        },
        metrics: [
          {
            label: { id: 'Konstanta Laju Ekspansi Hubble', en: 'Hubble Constant Expansion Rate', ar: 'ثابت هابل لتمدد الكون' },
            value: '~70 km/s/Mpc',
            primarySourceCitation: 'Planck Collaboration 2018 Cosmological Parameters (Astronomy & Astrophysics)',
            independentVerificationUrl: 'https://www.aanda.org/articles/aa/full_html/2020/09/aa33880-18/aa33880-18.html',
          },
        ],
        epistemologicalMatrix: [
          {
            category: 'FACT',
            statement: {
              id: 'Pengamatan spektrum pergeseran merah (redshift) membuktikan bahwa ruang kosmik alam semesta mengalami ekspansi berkelanjutan.',
              en: 'Redshift spectroscopy empirically confirms that metric space is expanding continuously.',
              ar: 'تثبت أرصاد الانزياح نحو الأحمر تمدد نسيج الزمكان الكوني بشكل مستمر.',
            },
            sources: [{ name: 'NASA Hubble & James Webb Science Data', url: 'https://science.nasa.gov/mission/hubble/', tier: 1, type: 'standards-body' }],
            confidenceLevel: 'High',
          },
          {
            category: 'ISLAMIC_INTERPRETATION',
            statement: {
              id: 'Lafal "wa inna la-musi\'un" (QS. 51:47) dipahami oleh para ahli tafsir sebagai isyarat kelapangan penciptaan dan kuasa Allah yang terus meluas.',
              en: 'The phrase "wa inna la-musi\'un" (QS. 51:47) is interpreted by commentators as signifying vast creative potency and cosmic expanse.',
              ar: 'تفيد عبارة "وإنا لموسعون" في التفسير كمال القدرة الإلهية وسعة آفاق الخلق.',
            },
            sources: [{ name: 'Tafsir Al-Razi (Mafatih al-Ghaib)', url: 'https://quran.ksu.edu.sa', tier: 1, type: 'academic-book' }],
            confidenceLevel: 'High',
          },
          {
            category: 'COUNTERARGUMENT',
            statement: {
              id: 'Sebagian filolog sekuler menyatakan kata "musi\'un" pada abad ke-7 lebih bermakna kedermawanan atau kekayaan daya cipta daripada ekspansi metrik astrofisika modern.',
              en: 'Some secular philologists argue "musi\'un" in 7th-century context denoted broad capability or wealth rather than modern metric cosmic expansion.',
              ar: 'يرى بعض اللغويين أن لفظ "موسعون" كان يفيد في السياق القديم الغنى والقدرة الواسعة وليس التمدد الفيزيائي بالمعنى المعاصر.',
            },
            sources: [{ name: 'Brill Encyclopaedia of the Qur\'an', url: 'https://referenceworks.brillonline.com', tier: 1, type: 'academic-book' }],
            confidenceLevel: 'Moderate',
          },
          {
            category: 'UNCERTAINTY',
            statement: {
              id: 'Masa depan akhir ekspansi alam semesta (apakah Big Freeze, Big Crunch, atau Big Rip) masih menjadi hipotesis astrofisika yang belum mencapai kepastian absolut.',
              en: 'The ultimate cosmic fate (Big Freeze, Crunch, or Rip) remains an open theoretical hypothesis in modern cosmology.',
              ar: 'المصير النهائي لتمدد الكون (الانجماد أو الانسحاق العظيم) لا يزال فرضية نظرية قيد البحث العلمي.',
            },
            sources: [{ name: 'Nature Astronomy Reviews', url: 'https://www.nature.com/natastron/', tier: 1, type: 'research-paper' }],
            confidenceLevel: 'Debated',
          },
        ],
        sources: [
          {
            name: 'Planck Satellite Mission 2018 Cosmology Results (European Space Agency / A&A)',
            url: 'https://www.aanda.org/articles/aa/full_html/2020/09/aa33880-18/aa33880-18.html',
            tier: 1,
            type: 'research-paper',
          },
          {
            name: 'Nidhal Guessoum, Islam\'s Quantum Question: Reconciling Muslim Tradition and Modern Science (I.B. Tauris)',
            url: 'https://www.bloomsbury.com',
            tier: 1,
            type: 'academic-book',
          },
          {
            name: 'BBC Arabic Science & Technology Feature on Modern Astrophysics',
            url: 'https://www.bbc.com/arabic/topics/ckdxnw959n7t',
            tier: 2,
            type: 'media-pool-ar',
          },
        ],
      },
    ]
  }

  /**
   * Discovers and verifies candidates against existing publications
   */
  static async discoverVerifiedStories(): Promise<IslamicAcademicStory[]> {
    const today = new Date().toISOString().split('T')[0]
    const candidates = this.getFreshIslamicAcademicCandidates(today)
    const blogDir = MCP_CONFIG.blogDataDir

    let publishedSlugs: string[] = []
    if (fs.existsSync(blogDir)) {
      publishedSlugs = fs.readdirSync(blogDir).map((f) => f.replace(/(\.id|\.en|\.ar)?\.mdx$/, ''))
    }

    const verifiedCandidates: IslamicAcademicStory[] = []

    for (const story of candidates) {
      if (publishedSlugs.includes(story.id)) {
        Logger.info(
          'IslamicResearch',
          `[Anti-Duplicate] Skipped existing academic story: "${story.titles.id}"`
        )
        continue
      }

      const sourceAudit = SourceVerifier.verifyDualTier(story.sources)
      if (!sourceAudit.isAuthoritative) {
        Logger.warn(
          'IslamicResearch',
          `[Source Gate] Story "${story.titles.id}" rejected due to insufficient source tiering.`
        )
        continue
      }

      verifiedCandidates.push(story)
    }

    Logger.success(
      'IslamicResearch',
      `Selected ${verifiedCandidates.length} high-rigor Islamic academic candidate(s).`
    )
    return verifiedCandidates
  }
}
