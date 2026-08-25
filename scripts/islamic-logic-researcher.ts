import fs from 'fs'
import path from 'path'

export type SourceClassification =
  | 'Primary Archaeological Source'
  | 'Academic University Press'
  | 'Critical Textual Edition'
  | 'Peer-Reviewed Journal'
  | 'Museum Catalog'
  | 'Classical Scriptural Corpus'

export interface SourceCitation {
  name: string
  url: string
  tier: 1 | 2
  type: SourceClassification
}

export interface LocalizedText {
  id: string
  en: string
  ar: string
}

export interface TraceableHistoricalMetric {
  claim: string
  exactValue: string
  unit: string
  baseline: string
  context: string
  source: string
  sourceType: SourceClassification
  scholarlyConsensusLevel:
    'Established Physical Consensus' | 'Active Scholarly Debate' | 'Minority Scholarly Theory'
  attributionText: string
}

export interface KeyManuscriptText {
  name: string
  siglum: string
  dateEstimate: string
  description: LocalizedText
}

export interface ArchaeologicalForensics {
  discoveryNarrative: LocalizedText
  caveAndManuscriptCount: LocalizedText
  keyTexts: KeyManuscriptText[]
  textualLandscape: LocalizedText // Proto-Masoretic, Septuagint Vorlage, Pre-Samaritan, Non-Aligned
}

export interface ScholarlyDebateSection {
  esseneHypothesis: LocalizedText
  alternativeTheories: LocalizedText // Norman Golb (Jerusalem Library), Yizhar Hirschfeld (Fortified Villa)
  scholarlyConsensusOrDispute: LocalizedText
}

export interface DefinitionalPrecisionSection {
  monotheismVsTawhid: LocalizedText // Distinguishing Second Temple Jewish aniconic monotheism from systematic Islamic Tawhid
}

export interface IslamicReasoningWalkthrough {
  revelationContinuity: LocalizedText
  scripturalTransmissionHistory: LocalizedText
  quranicPerspective: {
    surahReference: string
    arabicText: string
    translation: LocalizedText
    exegesis: LocalizedText
  }
  theologicalSynthesis: LocalizedText
}

export interface IslamicAcademicStory {
  id: string
  title: string
  titles: {
    id: string
    en: string
    ar: string
  }
  eventDate: string
  overallScore: number
  category: 'islamic-logic'
  editorialAngle: 'Intellectual Essay'
  narrativeHook: LocalizedText
  readerHook: LocalizedText
  universalQuestion: LocalizedText
  traceableMetrics: TraceableHistoricalMetric[]
  archaeologicalDetails: ArchaeologicalForensics
  scholarlyDebate: ScholarlyDebateSection
  definitionalDistinction: DefinitionalPrecisionSection
  islamicReasoningWalkthrough: IslamicReasoningWalkthrough
  whatThisDoesAndDoesntProve: LocalizedText // Honest boundaries: What is proven vs what is NOT proven
  reflectiveQuestion: LocalizedText
  sources: SourceCitation[]
  keywords: string[]
}

export function getFreshIslamicAcademicCandidates(currentIsoDate: string): IslamicAcademicStory[] {
  return [
    {
      id: 'qumran-dead-sea-scrolls-monotheism-study',
      title: 'Apa yang Sebenarnya Diungkap Gulungan Laut Mati tentang Agama Yahudi Sebelum Yesus?',
      titles: {
        id: 'Apa yang Sebenarnya Diungkap Gulungan Laut Mati tentang Agama Yahudi Sebelum Yesus?',
        en: 'What the Dead Sea Scrolls Actually Reveal About Judaism Before Jesus—and Why It Matters for Islamic Thought',
        ar: 'ما الذي تكشفه مخطوطات البحر الميت فعلاً عن اليهودية قبل المسيح؟ وما دلالتها في الفكر الإسلامي؟',
      },
      eventDate: currentIsoDate,
      overallScore: 98,
      category: 'islamic-logic',
      editorialAngle: 'Intellectual Essay',
      narrativeHook: {
        id: 'Pada 1947, seorang penggembala Badui melemparkan sebutir batu ke dalam celah gua kapur di tebing terjal gurun Yudea. Ia tidak sedang menelusuri lorong waktu sejarah kuno; ia hanya sedang mencari kambingnya yang tersesat. Namun gema suara tembikar yang pecah dari kegelapan gua tersebut mengantarkan umat manusia pada penemuan arsip naskah paling revolusioner dalam sejarah arkeologi Timur Dekat.',
        en: "In 1947, a young Bedouin shepherd tossed a stone into a limestone fissure along the barren cliffs of the Judean desert. He was not searching for ancient history; he was merely tracking a stray goat. Yet the shattering sound of brittle clay echoing from the cave's interior unlocked what would become the most consequential manuscript discovery in the history of Near Eastern archaeology.",
        ar: 'في عام 1947، ألقى راعٍ بدوي شاب حجراً داخل شق صخري في جروف صحراء يهودا الوعرة المطلة على البحر الميت. لم يكن يبحث عن آثار تاريخية، بل كان يقتفي أثر شاة ضلت طريقها. غير أن صوت انكسار جرة فخارية في عتمة الكهف فتح الباب أمام أعظم كشف للمخطوطات في تاريخ علم الآثار الحديث.',
      },
      readerHook: {
        id: 'Gulungan Laut Mati tidak membuktikan bahwa teks kitab suci tidak pernah berubah sama sekali, namun juga tidak menunjukkan bahwa teks tersebut berubah total. Yang mereka singkapkan jauh lebih kaya: sebuah lanskap keberagaman tradisi naskah dan keteguhan monoteisme pra-Kristen yang membuka babak baru dalam memahami sejarah wahyu.',
        en: 'The Dead Sea Scrolls do not demonstrate that the biblical text was frozen in absolute immutability, nor do they suggest it was wholly corrupted. What they unveil is vastly more profound: a dynamic pluriformity of scribal traditions and uncompromising Second Temple monotheism that sheds light on the history of prophetic transmission.',
        ar: 'لم تثبت مخطوطات البحر الميت تطابقاً حرفياً جامداً لكامل النص العبري القديم، كما أنها لم تدل على انقطاع تام؛ بل كشفت عن مشهد تاريخي ثري من التعددية النصية والتمسك بالتوحيد قبل ظهور المسيحية، مما يلقي ضوءاً كاشفاً على تاريخ انتقال الوحي الإلهي.',
      },
      universalQuestion: {
        id: 'Jika naskah-naskah kuno ini membuktikan adanya variasi dalam tradisi penyalinan manusiawi, apa yang sebenarnya dapat kita ketahui secara ilmiah mengenai kemurnian doktrin tauhid para nabi terdahulu?',
        en: 'If these ancient parchment witnesses reveal an organic human scribal continuum, what can we objectively deduce regarding the continuity of pristine prophetic monotheism across history?',
        ar: 'إذا كانت هذه الرقائق القديمة توثق تفاعلاً بشرياً حياً في حركة التدوين، فما الذي نستخلصه علمياً وتاريخياً حول اتصال رسالة التوحيد الخالص بين الأنبياء؟',
      },
      traceableMetrics: [
        {
          claim: 'Total reconstructed manuscripts across Qumran caves',
          exactValue: '900',
          unit: 'manuscripts',
          baseline: 'Zero Second Temple Hebrew manuscripts known prior to 1947',
          context: '11 caves near Khirbet Qumran (1947–1956)',
          source: 'Israel Antiquities Authority (IAA) Official Dead Sea Scrolls Inventory',
          sourceType: 'Academic University Press',
          scholarlyConsensusLevel: 'Established Physical Consensus',
          attributionText: 'Katalog resmi Israel Antiquities Authority & Oxford University Press',
        },
        {
          claim: 'Fragment count in Cave 4 alone',
          exactValue: '15000',
          unit: 'fragments (~500 manuscripts)',
          baseline: 'Represents approximately 75% of all recovered textual material',
          context: 'Qumran Cave 4 artificial karst chambers',
          source: 'Discoveries in the Judaean Desert (DJD) Series, Oxford University Press',
          sourceType: 'Critical Textual Edition',
          scholarlyConsensusLevel: 'Established Physical Consensus',
          attributionText: 'Seri rujukan Discoveries in the Judaean Desert (DJD Vol. I–XL)',
        },
        {
          claim: 'Great Isaiah Scroll age relative to Aleppo/Leningrad Codices',
          exactValue: '1000',
          unit: 'years older',
          baseline: 'Leningrad Codex (1008 CE) & Aleppo Codex (c. 920 CE)',
          context: '1QIsaᵃ dated to c. 125 BCE',
          source: 'The Israel Museum Shrine of the Book Paleographical Catalog',
          sourceType: 'Museum Catalog',
          scholarlyConsensusLevel: 'Established Physical Consensus',
          attributionText: 'Fasilitas Shrine of the Book, Museum Israel Yerusalem',
        },
      ],
      archaeologicalDetails: {
        discoveryNarrative: {
          id: 'Antara tahun 1947 hingga 1956, eksplorasi arkeologis di tebing karst barat laut Laut Mati menemukan 11 gua yang menyimpan ribuan lembaran kulit, papirus, dan satu gulungan tembaga (Copper Scroll). Penemuan ini memundurkan dokumentasi fisik teks Ibrani kuno hingga lebih dari seribu tahun ke belakang.',
          en: 'Between 1947 and 1956, systematic excavations across 11 limestone caves on the northwestern shore of the Dead Sea uncovered thousands of parchment leaves, papyri, and a unique inscribed copper scroll, pushing back our earliest physical manuscript witnesses of Hebrew scriptures by over a millennium.',
          ar: 'بين عامي 1947 و1956، أسفرت أعمال التنقيب الأثري في 11 كهفاً شمال غرب البحر الميت عن استخراج آلاف الرقائق الجلدية ولفافة برونزية فريدة، مما أعاد أقدم الشواهد المادية للنصوص العبرية القديمة أكثر من ألف عام إلى الوراء.',
        },
        caveAndManuscriptCount: {
          id: 'Alih-alih naskah yang rapi di rak perpustakaan, para arkeolog menemukan sekitar 900 manuskrip individual yang hancur menjadi lebih dari 25.000 fragmen kecil. Gua 4 sendiri menyumbang proporsi terbesar: sekitar 15.000 fragmen dari 500 naskah yang berhasil direkonstruksi melalui analisis paleografi dan pencitraan multispektral modern.',
          en: 'Rather than pristine codices, scholars recovered approximately 900 distinct manuscripts shattered into more than 25,000 brittle fragments. Cave 4 alone yielded the vast majority—roughly 15,000 fragments representing over 500 distinct works meticulously reconstructed via advanced multispectral imaging.',
          ar: 'لم تكن المخطوطات كتباً سليمة، بل ضمت ما يقارب 900 مخطوطة تفتتت إلى أكثر من 25 ألف شظية؛ حيث كان للكهف الرابع النصيب الأكبر بنحو 15 ألف شظية تمثل أكثر من 500 نص تم ترميمها بالتحليل الطيفي الحديث.',
        },
        keyTexts: [
          {
            name: 'Great Isaiah Scroll (1QIsaᵃ)',
            siglum: '1QIsaᵃ',
            dateEstimate: 'Sekitar 125 SM',
            description: {
              id: 'Satu-satunya naskah utuh berukuran panjang 7.34 meter yang memuat 66 pasal Kitab Yesaya lengkap. Naskah ini bertarikh sekitar seribu tahun lebih tua daripada Kodeks Leningrad (1008 M).',
              en: 'A virtually complete 7.34-meter parchment scroll containing all 66 chapters of Isaiah, dating approximately one millennium earlier than the standard medieval Leningrad Codex.',
              ar: 'لفافة جلدية شبه مكتملة بطول 7.34 متر تضم سفر إشعياء كاملاً بفصوله الـ 66، وتسبق أقدم مخطوطة ماسورتية كاملة (مخطوطة لينينغراد 1008 م) بألف عام.',
            },
          },
          {
            name: 'Community Rule (1QS / Serekh ha-Yahad)',
            siglum: '1QS',
            dateEstimate: 'Sekitar 100–75 SM',
            description: {
              id: 'Piagam tata tertib komunitas yang mengatur disiplin ibadah, kepemilikan harta bersama, kesucian ritual air, dan penolakan keras terhadap kultus paganisme Romawi.',
              en: 'The constitutional charter governing communal discipline, shared property, ritual water purifications, and fierce resistance against Hellenistic-Roman pagan syncretism.',
              ar: 'الميثاق الدستوري للجماعة الذي ينظم الطهارة المائية بالوضوء، والملكية المشتركة، والرفض الصارم للوثنية الرومانية.',
            },
          },
          {
            name: 'Temple Scroll (11QT) & Copper Scroll (3Q15)',
            siglum: '11QT & 3Q15',
            dateEstimate: 'Abad ke-1 SM – Abad ke-1 M',
            description: {
              id: 'Temple Scroll memuat regulasi hukum ibadah Bait Suci, sedangkan Copper Scroll adalah naskah unik dari lempengan tembaga yang memuat daftar 64 lokasi persembunyian harta emas dan perak.',
              en: 'The Temple Scroll details elaborate architectural and ritual legislation, while the enigmatic Copper Scroll records 64 hidden caches of gold and silver treasures.',
              ar: 'تتضمن لفافة الهيكل تشريعات العبادة والطقوس، بينما تسجل اللفافة النحاسية الفريدة 64 موقعاً لكنوز الذهب والفضة المخبأة.',
            },
          },
        ],
        textualLandscape: {
          id: 'Berdasarkan penelitian mendalam ahli tekstual terkemuka Emanuel Tov (Hebrew University of Jerusalem), koleksi Alkitab Qumran tidak seragam, melainkan mencerminkan tradisi teks yang hidup: sekitar 44–47% berafiliasi dengan teks Proto-Masoretik, 5% mencerminkan Vorlage Septuaginta (Yunani Kuno), 5% Pra-Samaria, dan 45% merupakan varian teks non-aligned (independen).',
          en: 'As demonstrated by preeminent textual scholar Emanuel Tov, the Qumran biblical manuscripts demonstrate a vibrant pluriformity: roughly 44–47% align with the Proto-Masoretic tradition, 5% reflect the Hebrew Vorlage of the Greek Septuagint, 5% mirror Pre-Samaritan texts, and approximately 45% represent non-aligned textual variants.',
          ar: 'وفقاً لأبحاث أستاذ النقد النصي إيمانويل توف، عكست المخطوطات تنوعاً نصياً حياً: نحو 45% تتبع النص الماسورتي المبكر، و5% تمثل الأصل العبري للترجمة السبعينية، و5% للنص السامري، و45% تمثل تنويعات نصية مستقلة.',
        },
      },
      scholarlyDebate: {
        esseneHypothesis: {
          id: 'Hipotesis Qumran-Eseni (Roland de Vaux & Eleazar Sukenik): Teori dominan yang menyatakan bahwa naskah-naskah ini ditulis dan disimpan oleh sekte Yahudi asketis Eseni yang mengasingkan diri ke gurun untuk menjaga kemurnian hukum Taurat dari korupsi politik Yerusalem.',
          en: 'The Qumran-Essene Hypothesis (Roland de Vaux & Eleazar Sukenik): The long-standing consensus arguing that the scrolls were authored and preserved by an ascetic sectarian Jewish movement that withdrew to the desert to maintain ritual purity away from Jerusalem.',
          ar: 'فرضية قمران والأسينيين (رولان دي فو وسوكينيك): الفرضية التاريخية الأبرز التي ترى أن المخطوطات كُتبت وحُفظت على يد جماعة الأسينيين الزاهدة التي اعتزلت في الصحراء حفاظاً على نقاء الشريعة.',
        },
        alternativeTheories: {
          id: 'Teori Alternatif (Prof. Norman Golb & Yizhar Hirschfeld): Teori alternatif dari University of Chicago menyatakan bahwa gua-gua Qumran adalah tempat penyimpanan darurat perpustakaan-perpustakaan dari Yerusalem saat dikepung tentara Romawi (68–70 M), sedangkan situs Khirbet Qumran adalah benteng pertahanan atau vila pedesaan Yudea.',
          en: 'Alternative Scholarly Perspectives (Prof. Norman Golb & Yizhar Hirschfeld): Norman Golb (University of Chicago) challenged the Essene model, arguing the scrolls represent diverse libraries evacuated from Jerusalem during the Roman siege (68–70 CE), while Hirschfeld interpreted Khirbet Qumran as a fortified agricultural estate.',
          ar: 'الرؤى الأكاديمية البديلة (البروفيسور نورمان غولب وهيرشفيلد): يرى غولب (جامعة شيكاغو) أن المخطوطات تمثل مكتبات متنوعة أُجليت من أورشليم أثناء الحصار الروماني، بينما اعتبر هيرشفيلد الموقع حصناً زراعياً.',
        },
        scholarlyConsensusOrDispute: {
          id: 'Meskipun perdebatan identitas komunitas tetap dinamis, para sejarawan sepakat bahwa koleksi Qumran menyajikan potret paling otentik tentang keberagaman intelektual dan keteguhan monoteisme Yahudi pada era Bait Kedua.',
          en: 'While debates over the exact community profile persist, modern historiography universally agrees that Qumran provides an unprecedented lens into the intellectual vitality and monotheistic depth of Second Temple Judaism.',
          ar: 'رغم استمرار النقاش الأكاديمي، يجمع المؤرخون على أن قمران تقدم الصورة الأكثر أصالة عن الحيوية الفكرية والعمق التوحيدي في حقبة الهيكل الثاني.',
        },
      },
      definitionalDistinction: {
        monotheismVsTawhid: {
          id: 'Pembedaan Konseptual: Monoteisme Bait Kedua di Qumran adalah penolakan radikal terhadap politeisme pagan Helenistik dan pemujaan patung. Namun secara teologis, monoteisme ini tetap beroperasi dalam kerangka partikularistik kovenan bani Israel, yang berbeda dengan doktrin Tauhid Islam yang menegaskan keesaan Allah yang absolut, universal bagi seluruh alam, dan tidak beranak maupun diperanakkan.',
          en: 'Conceptual Demarcation: Second Temple monotheism at Qumran was an uncompromising rejection of Hellenistic pagan polytheism and imperial cults. However, it operated primarily within a covenantal Jewish framework, whereas Islamic Tawhid articulates an absolute, transcendent, and universally accessible ontological oneness that encompasses all humanity.',
          ar: 'الانضباط المفاهيمي: تمثل التوحيدية في قمران رفضاً قاطعاً للشرك الوثني اليوناني والروماني. إلا أنها عملت ضمن الإطار العهدي لبني إسرائيل، بينما يقرر التوحيد الإسلامي وحدانية إلهية مطلقة، متعالية، وشاملة لكل البشرية.',
        },
      },
      islamicReasoningWalkthrough: {
        revelationContinuity: {
          id: 'Sudut Pandang Kesinambungan Risalah: Bagi pemikir Islam, naskah Qumran sangat menarik bukan karena menjadi bukti langsung kebenaran Islam, melainkan karena naskah-naskah ini menjadi saksi sejarah independen atas kesinambungan ajaran monoteisme tauhid yang selalu dibawa oleh para nabi terdahulu.',
          en: 'The Continuity of Revelation: For Islamic thought, the Qumran manuscripts are compelling not as direct proof of Islam, but because they provide independent material confirmation of the unbroken thread of prophetic monotheism taught by preceding prophets.',
          ar: 'اتصال الرسالات الإلهية: يكمن اهتمام الفكر الإسلامي بهذه المخطوطات ليس باعتبارها دليلاً مادياً مباشراً على الإسلام، بل لشواهدها التاريخية المستقلة على تواتر دعوة الأنبياء إلى عبادة الله وحده.',
        },
        scripturalTransmissionHistory: {
          id: "Realitas Transmisi Manusiawi: Khazanah Islam membedakan antara firman wahyu murni dan catatan penyalinan manusiawi (bima istuhfidzu min kitabillah). Fakta adanya variasi ejaan dan catatan redaksional di Qumran selaras dengan penjelasan Al-Qur'an bahwa kitab-kitab terdahulu diamanahkan pemeliharaannya kepada para ulama dan rahib mereka.",
          en: "Human Scribal Transmission: Classical Islamic theology explicitly delineates between pristine divine revelation and historical human copyist transmission. The textual fluidity observed at Qumran harmonizes with the Qur'anic insight that earlier scriptures were entrusted to human scribal custodianship.",
          ar: 'طبيعة التدوين البشري: يفرق المنظور الإسلامي بين الوحي الإلهي المُنزل وتاريخ التدوين البشري؛ حيث يتطابق التنوع النصي في قمرan مع التقرير القرآني بأن الكتب السابقة استُحفظ عليها الأحبار والنساخ.',
        },
        quranicPerspective: {
          surahReference: 'QS. Al-Baqarah [2]: 136',
          arabicText:
            'قُولُوا آمَنَّا بِاللَّهِ وَمَا أُنزِلَ إِلَيْنَا وَمَا أُنزِلَ إِلَىٰ إِبْرَاهِيمَ وَإِسْمَاعِيلَ وَإِسْحَاقَ وَيَعْقُوبَ وَالْأَسْبَاطِ وَمَا أُوتِيَ مُوسَىٰ وَعِيسَىٰ وَمَا أُوتِيَ النَّبِيُّونَ مِن رَّبِّهِمْ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّنْهُمْ وَنَحْنُ لَهُ مُسْلِمُونَ',
          translation: {
            id: 'Katakanlah: "Kami beriman kepada Allah dan kepada apa yang diturunkan kepada kami, dan kepada apa yang diturunkan kepada Ibrahim, Ismail, Ishaq, Ya\'qub dan anak cucunya, dan kepada apa yang diberikan kepada Musa dan Isa serta apa yang diberikan kepada nabi-nabi dari Tuhannya. Kami tidak membeda-bedakan seorang pun di antara mereka dan kami berserah diri kepada-Nya."',
            en: 'Say: "We believe in Allah and what has been revealed to us, and what was revealed to Abraham, Ishmael, Isaac, Jacob, and the tribes, and what was given to Moses and Jesus, and what was given to the prophets from their Lord. We make no distinction between any of them, and to Him we submit."',
            ar: 'قولوا آمنا بالله وما أنزل إلينا وما أنزل إلى إبراهيم وإسماعيل وإسحاق ويعقوب والأسباط وما أوتي موسى وعيسى وما أوتي النبيون من ربهم لا نفرق بين أحد منهم ونحن له مسلمون',
          },
          exegesis: {
            id: 'Ayat ini menegaskan bahwa iman Islam berdiri di atas pengakuan tulus terhadap seluruh risalah kenabian sebelumnya, memandang sejarah peradaban sebagai mata rantai dakwah tauhid yang bersambung.',
            en: 'This verse establishes that Islamic theology is rooted in the recognition of all preceding prophetic messages, viewing human history as an interconnected continuum of divine monotheism.',
            ar: 'تؤسس هذه الآية الكريمة لمنطلقات الإيمان الإسلامي القائم على التصديق بجميع النبوات السابقة واعتبار التاريخ الإنساني حلقة متصلة من دعوات التوحيد.',
          },
        },
        theologicalSynthesis: {
          id: 'Sintesis Akademik: Gulungan Laut Mati membuktikan secara arkeologis bahwa ratusan tahun sebelum era masehi, terdapat komunitas-komunitas yang menolak asimilasi politeisme dan memegang teguh ibadah kepada Allah yang Maha Kuasa.',
          en: 'Scholarly Synthesis: The Dead Sea Scrolls empirically verify that centuries prior to the Common Era, dedicated communities resisted polytheistic assimilation and preserved devout obedience to the Sovereign Creator.',
          ar: 'الخلاصة المعرفية: تؤكد مخطوطات البحر الميت مادياً وتاريخياً وجود مجتمعات مؤمنة تمسكت بعبادة الخالق ورفضت الشرك الوثني قبل قرون من البعثة المحمدية.',
        },
      },
      whatThisDoesAndDoesntProve: {
        id: 'Apa yang Terbukti vs Apa yang Tidak: Penemuan Qumran TIDAK menjadi bukti material langsung atas kebenaran doktrin Islam secara partikular. Yang dibuktikannya adalah fakta sejarah bahwa tradisi monoteisme kuno memiliki akar dokumenter yang nyata di tanah Timur Dekat, menyediakan latar belakang historis independen yang memperkaya dialog perbandingan agama.',
        en: 'What Is Proven vs What Is NOT Proven: The Qumran discovery does NOT constitute a direct empirical proof of Islam. What it conclusively demonstrates is that ancient prophetic monotheism possessed profound historical and scribal roots in the Near East, offering an invaluable evidentiary baseline for interfaith comparative theology.',
        ar: 'الحدود المنهجية: لا تمثل كشوفات قمران دليلاً مادياً مباشراً على الإسلام بذاته؛ وإنما تثبت تاريخياً وعلمياً أن عقيدة التوحيد امتلكت جذوراً وثائقية ضاربة في القدم، مما يثري الحوار الفكري والمقارن بحقائق راسخة.',
      },
      reflectiveQuestion: {
        id: 'Jika manusia masa lampau rela mengorbankan kenyamanan hidup di kota demi mengasingkan diri ke gua gurun demi menjaga teks dan keyakinan tauhid mereka, bagaimana kita hari ini memaknai nilai kebenaran di tengah banjir informasi modern?',
        en: 'If ancient scribes chose the harsh solitude of desert caves to preserve sacred texts and devotion to the Creator, how do we in our digital age assess the enduring weight of truth amidst boundless distraction?',
        ar: 'إذا كان أسلافنا قد اعتزلوا إلى وعورة الكهوف الصحراوية صيانة لنصوص التوحيد وكتبهم المقدسة، فكيف نقدر نحن اليوم قيمة البحث الصادق عن الحقيقة في عصر الطوفان الرقمي؟',
      },
      sources: [
        {
          name: 'Discoveries in the Judaean Desert (DJD Series, Vol. I–XL, Oxford University Press)',
          url: 'https://global.oup.com/academic/content/series/d/discoveries-in-the-judaean-desert-djd/',
          tier: 1,
          type: 'Critical Textual Edition',
        },
        {
          name: 'The Dead Sea Scrolls: A New Translation (Wise, Abegg, Cook / HarperOne)',
          url: 'https://www.harpercollins.com/products/the-dead-sea-scrolls-michael-wise',
          tier: 1,
          type: 'Academic University Press',
        },
        {
          name: 'The Israel Museum: The Digital Dead Sea Scrolls Project',
          url: 'https://www.imj.org.il/en/wings/shrine-book/dead-sea-scrolls',
          tier: 1,
          type: 'Museum Catalog',
        },
        {
          name: 'Emanuel Tov: Textual Criticism of the Hebrew Bible (Fortress Press)',
          url: 'https://www.fortresspress.com/',
          tier: 1,
          type: 'Academic University Press',
        },
      ],
      keywords: [
        'qumran',
        'dead sea scrolls',
        'monotheism',
        'archaeology',
        'isaiah',
        'manuscript',
        'second temple',
        'hebrew',
        'tawhid',
        'epistemology',
      ],
    },
  ]
}

export async function researchIslamicAcademicIntelligence(): Promise<IslamicAcademicStory[]> {
  console.log(
    '📜 [Islamic Academic & Storytelling Engine] Discovering compelling intellectual narratives & rigorous evidence...'
  )

  const today = new Date().toISOString().split('T')[0]
  const candidates = getFreshIslamicAcademicCandidates(today)

  const blogDir = path.join(process.cwd(), 'data', 'blog')
  const existingFiles = fs.existsSync(blogDir) ? fs.readdirSync(blogDir) : []

  const verifiedStories = candidates.filter((story) => {
    const storyKeywords = story.keywords
    const isDuplicate = existingFiles.some((file) => {
      const lowerFile = file.toLowerCase()
      const matchCount = storyKeywords.filter((k) => lowerFile.includes(k)).length
      return matchCount >= 3
    })

    if (isDuplicate) {
      console.log(`  └─ [Anti-Duplicate] Skipped existing academic story entity: "${story.title}"`)
      return false
    }

    if (!story.sources || story.sources.length < 2) {
      console.log(
        `  └─ [Source Gate] Rejected academic story lacking multi-source citations: "${story.title}"`
      )
      return false
    }

    return true
  })

  console.log(
    `✅ [Islamic Academic & Storytelling Engine] Selected ${verifiedStories.length} compelling story candidate(s).`
  )
  return verifiedStories
}
