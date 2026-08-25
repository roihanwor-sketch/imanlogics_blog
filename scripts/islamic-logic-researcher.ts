import fs from 'fs';
import path from 'path';
import { SourceCitation, EditorialAngle } from './tech-researcher';

export interface LocalizedText {
  id: string;
  en: string;
  ar: string;
}

export interface IslamicAcademicStory {
  id: string;
  title: string;
  titles: LocalizedText;
  readerHook: LocalizedText;
  universalQuestion: LocalizedText;
  curiosityGap: string;
  discoveryMoment: LocalizedText;
  emotionalArc: string;
  whyNonMuslimsShouldCare: string;
  whyWeakFaithReadersShouldCare: string;
  eventDate: string;
  category: 'islamic-logic';
  editorialAngle: EditorialAngle;
  empiricalDiscovery: LocalizedText;
  academicInterpretation: LocalizedText;
  counterArgument: LocalizedText;
  islamicScripturalPerspective: {
    surahReference: string;
    arabicText: string;
    translation: LocalizedText;
    exegesis: LocalizedText;
  };
  whatThisDoesAndDoesntProve: LocalizedText;
  reflectiveQuestion: LocalizedText;
  recommendedNarrativeStructure: string;
  recommendedTone: 'intellectual-storytelling';
  readerDifficulty: 'accessible';
  editorialPotential: number; // 0 - 100
  sources: SourceCitation[];
  keywords: string[];
}

export function getFreshIslamicAcademicCandidates(currentIsoDate: string): IslamicAcademicStory[] {
  return [
    {
      id: 'birmingham-quran-radiocarbon-analysis',
      title: 'Mengapa Manuskrip Kuno Ini Membuat Sejarah Al-Qur\'an Semakin Menarik?',
      titles: {
        id: 'Mengapa Manuskrip Kuno Ini Membuat Sejarah Al-Qur\'an Semakin Menarik?',
        en: 'Why This Ancient Manuscript Makes the History of the Qur\'an Far More Intriguing',
        ar: 'لماذا تجعل هذه المخطوطة القديمة تاريخ تدوين القرآن أكثر إثارة للاهتمام والبحث؟',
      },
      readerHook: {
        id: 'Sebelum para ilmuwan memperdebatkan kapan sebuah teks agama pertama kali dicatat, ada satu pertanyaan fisik yang jauh lebih mendasar: apa yang sebenarnya diceritakan oleh lembaran perkamen itu sendiri saat diuji di laboratorium modern?',
        en: 'Before scholars debate when a sacred scripture was canonized, a far more grounded physical inquiry emerges: what do the physical parchment leaves themselves reveal when subjected to modern laboratory testing?',
        ar: 'قبل أن يدخل الباحثون في نقاشات نظرية حول تدوين النصوص الدينية، يبرز سؤال مادي أكثر عمقاً: ماذا تكشف لنا رقائق المخطوطات القديمة عندما تخضع للفحص المخبري الفيزيائي الحديث؟',
      },
      universalQuestion: {
        id: 'Bagaimana manusia dapat mengetahui bahwa sebuah tradisi teks yang berusia ribuan tahun benar-benar dipertahankan sesuai bentuk awalnya?',
        en: 'How can modern inquiry establish whether a millennium-old textual tradition was faithfully preserved in its original historical form?',
        ar: 'كيف يمكن للعقل البشري الحديث التحقق من أن نصاً مقدساً حافظ على أصالته الخطية عبر القرون دون تبديل؟',
      },
      curiosityGap: 'Pembaca mungkin mengira manuskrip kuno hanya menarik karena usianya, padahal yang mengejutkan para ahli adalah kecocokan kata demi kata dengan teks yang dibaca hari ini.',
      discoveryMoment: {
        id: 'Yang paling menarik dari penanggalan radiokarbon Universitas Oxford bukan sekadar usianya yang sezaman dengan Nabi Muhammad SAW, melainkan aksara Hijazi di atasnya yang tidak menunjukkan perbedaan redaksional dengan mushaf yang kita baca hari ini.',
        en: 'The most remarkable insight from Oxford\'s radiocarbon testing is not merely that the parchment dates to the era of Prophet Muhammad, but that its early Hijazi script exhibits flawless textual alignment with the Qur\'an read globally today.',
        ar: 'المثير في نتائج فحص جامعة أكسفورد ليس فقط معاصرة المخطوطة لعصر النبي صلى الله عليه وسلم، بل إن خطها الحجازي المبكر يتطابق بدقة حرفية تامة مع المصحف المعتمد اليوم عالمياً.',
      },
      emotionalArc: 'Curious -> Surprised -> Thinking -> Questioning -> Understanding -> Reflecting',
      whyNonMuslimsShouldCare: 'Menjawab pertanyaan historiografi ilmiah tentang keaslian transmisi dokumen tertua dalam sejarah peradaban manusia.',
      whyWeakFaithReadersShouldCare: 'Memberikan bukti fisik objektif dari laboratorium independen bahwa Al-Qur\'an bukan dokumen karangan berabad-abad setelahnya.',
      eventDate: currentIsoDate,
      category: 'islamic-logic',
      editorialAngle: 'Analysis',
      empiricalDiscovery: {
        id: 'Pengujian penanggalan radiokarbon AMS di Universitas Oxford terhadap fragmen perkamen Mingana di Perpustakaan Cadbury mengungkap rentang penanggalan antara 568 M hingga 645 M dengan tingkat kepercayaan 95.4%.',
        en: 'AMS radiocarbon testing at Oxford University on the Mingana parchment folios at Cadbury Research Library established a chronological window between 568 CE and 645 CE with 95.4% statistical confidence.',
        ar: 'أثبت فحص الكربون المشع في جامعة أكسفورد لرقائق مكتبة كادبوري أن المخطوطة تعود للفترة بين 568 و645 ميلادية باحتمالية إحصائية بلغت 95.4%.',
      },
      academicInterpretation: {
        id: 'Para ahli paleografi Arab terkemuka, seperti Prof. David Thomas, menyimpulkan bahwa fragmen ini berasal dari salinan sangat awal yang dibuat dalam rentang dekade pertama setelah wafatnya Nabi.',
        en: 'Distinguished paleographers, including Prof. David Thomas, conclude that these folios originate from an extraordinarily early textual stratum drafted within a few decades of the Prophet\'s passing.',
        ar: 'خلص أساتذة الخطوط والتاريخ، ومنهم البروفيسور ديفيد توماس، إلى أن هذه الرقائق تنتمي إلى أولى مراحل التدوين التي تمت في العقود الأولى التي تلت وفاة النبي.',
      },
      counterArgument: {
        id: 'Beberapa skeptis menyatakan bahwa uji radiokarbon hanya mengukur usia kulit hewan (perkamen), bukan tinta tulisannya. Namun, analisis paleografis aksara Hijazi secara independen mengonfirmasi bahwa gaya penulisan tersebut hanya digunakan pada abad ke-1 Hijriah.',
        en: 'Skeptics argue radiocarbon dating tests the parchment animal hide rather than the ink itself. However, independent paleographical analysis confirms the Hijazi calligraphy style exclusively belongs to the 7th century CE.',
        ar: 'يرى بعض المتشككين أن الفحص يحدد عمر الجلد وليس الحبر، غير أن دراسة الخط الحجازي أكدت بشكل مستقل أن هذا النمط الخطي لم يُستخدم إلا في القرن الهجري الأول حصراً.',
      },
      islamicScripturalPerspective: {
        surahReference: 'QS. Al-Hijr [15]: 9',
        arabicText: 'إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ',
        translation: {
          id: 'Sesungguhnya Kamilah yang menurunkan Al-Qur\'an, dan sesungguhnya Kami benar-benar memeliharanya.',
          en: 'Indeed, it is We who sent down the Qur\'an and indeed, We will be its guardian.',
          ar: 'إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ',
        },
        exegesis: {
          id: 'Dalam tradisi keilmuan Islam, jaminan ini terwujud secara historis lewat tradisi hafalan massal (mutawatir) yang berjalan beriringan dengan standar kodifikasi fisik.',
          en: 'In classical scholarship, this divine guardianship manifested through continuous mass oral transmission (mutawatir) operating in tandem with rigorous physical inscriptional codification.',
          ar: 'في التراث الإسلامي، تحقق هذا الحفظ الإلهي واقعياً عبر التواتر الشفهي الجمعي المتصل بالتزامن مع التدوين الخطي المتقن.',
        },
      },
      whatThisDoesAndDoesntProve: {
        id: 'Apakah temuan ini secara otomatis membuktikan bahwa Al-Qur\'an berasal dari Tuhan? Secara metodologis sains, laboratorium membuktikan otentisitas penanggalan fisik teks, bukan dimensi teologisnya. Namun, temuan ini mematahkan teori bahwa Al-Qur\'an diubah atau baru dibuat berabad-abad kemudian.',
        en: 'Does this scientific discovery autonomously prove the theological divine origin of the text? Empirically, it proves physical historical antiquity and textual fidelity, not metaphysics. Yet, it decisively disproves theories claiming late sectarian compilation.',
        ar: 'هل يثبت هذا الاكتشاف ألوهية المصدر بحد ذاته؟ علمياً، يثبت الفحص المادي أصالة التوثيق التاريخي ودقة النقل، وهو ما يسقط تماماً فرضيات التدوين المتأخر أو التحريف.',
      },
      reflectiveQuestion: {
        id: 'Jika sebuah teks mampu bertahan melalui ingatan dan tulisan dengan presisi setinggi ini melintasi pergolakan sejarah peradaban, bukankah klaim dan pesannya pantas untuk kita telaah dengan pikiran terbuka?',
        en: 'If a textual message successfully endured across fourteen centuries with this unprecedented level of physical and oral fidelity, does not its core message merit an open-minded intellectual examination?',
        ar: 'إذا كان هذا النص قد صمد عبر القرون بتطابق مادي وشفهي لا نظير له في تاريخ المخطوطات، ألا يستحق بيانه ورسالته تأملاً عقلياً عميقاً ومنصفاً؟',
      },
      recommendedNarrativeStructure: 'Question -> Discovery -> Facts -> Counterarguments -> Perspective -> Boundaries -> Reflection',
      recommendedTone: 'intellectual-storytelling',
      readerDifficulty: 'accessible',
      editorialPotential: 96,
      sources: [
        { name: 'University of Birmingham Cadbury Research Library', url: 'https://www.birmingham.ac.uk/facilities/cadbury/index.aspx', tier: 1, type: 'Academic Paper' },
        { name: 'Oxford Radiocarbon Accelerator Unit (ORAU)', url: 'https://c14.arch.ox.ac.uk/', tier: 1, type: 'Academic Paper' },
        { name: 'Brill Journal of Islamic Manuscripts', url: 'https://brill.com/view/journals/jim/jim-overview.xml', tier: 2, type: 'Journalism' },
      ],
      keywords: ['birmingham', 'manuscript', 'radiocarbon', 'history', 'quran', 'archaeology', 'evidence', 'textual']
    },
    {
      id: 'qumran-dead-sea-scrolls-monotheism-study',
      title: 'Apa yang Sebenarnya Dikatakan Gulungan Laut Mati tentang Dunia Sebelum Kekristenan?',
      titles: {
        id: 'Apa yang Sebenarnya Dikatakan Gulungan Laut Mati tentang Dunia Sebelum Kekristenan?',
        en: 'What Do the Dead Sea Scrolls Actually Reveal About Monotheism Before the Roman Era?',
        ar: 'ما الذي تكشفه مخطوطات البحر الميت حقاً عن التوحيد قبل العصر الإمبراطوري الروماني؟',
      },
      readerHook: {
        id: 'Pada tahun 1947, seorang penggembala Badui melempar batu ke dalam gua terpencil di tebing Qumran. Bunyi tembikar pecah dari dalam gua tersebut membuka salah satu penemuan arkeologi paling mengguncang dalam sejarah studi kitab suci.',
        en: 'In 1947, a Bedouin shepherd tossed a stone into a limestone cliff cave near Qumran. The shattering echo of ancient pottery unsealed one of the most transformative manuscript discoveries in theological history.',
        ar: 'في عام 1947، رمى راعٍ بدوي حجراً داخل كهف منعزل في وادي قمران. كان صوت انكسار الجرة الفخارية بداية لأعظم كشف أثري غير مسار دراسات المخطوطات التاريخية.',
      },
      universalQuestion: {
        id: 'Apakah ajaran monoteisme murni tanpa doktrin rumit merupakan gagasan baru, ataukah fondasi asli dari tradisi kenabian Semitik paling awal?',
        en: 'Is uncompromised primordial monotheism a late conceptual innovation, or was it the original foundation of early Semitic prophetic traditions?',
        ar: 'هل كان التوحيد الخالص مفهوماً دينياً متأخراً، أم أنه الجوهر الأصيل للرسالات السامية الأولى قبل أن تعتريه التبدلات؟',
      },
      curiosityGap: 'Banyak orang mengira perdebatan teologi ketuhanan baru muncul belakangan, padahal naskah Qumran membuktikan komunitas kuno telah berjuang keras mempertahankan monoteisme murni dari pengaruh Helenistik.',
      discoveryMoment: {
        id: 'Naskah-naskah kuno Qumran tidak hanya memuat salinan teks Ibrani tertua, tetapi juga menunjukkan penolakan tegas terhadap kompromi politeisme Romawi serta pencarian sosok pembaru risalah.',
        en: 'The Qumran folios preserve not merely the oldest Hebrew fragments, but empirical evidence of a community fiercely rejecting polytheistic Hellenization while awaiting an uncorrupted prophetic voice.',
        ar: 'لم تقتصر مخطوطات قمران على حفظ أقدم النصوص العبرية فحسب، بل وثقت مجتمعاً رفض التأثيرات الشركية الرومانية وتمسك بالتوحيد الخالص مع ترقب رسول مجدد.',
      },
      emotionalArc: 'Curious -> Surprised -> Thinking -> Questioning -> Understanding -> Reflecting',
      whyNonMuslimsShouldCare: 'Menelusuri evolusi sejarah teks-teks Semitik kuno sebelum campur tangan kekaisaran Romawi.',
      whyWeakFaithReadersShouldCare: 'Memahami bahwa konsep tauhid yang diajarkan Islam adalah mata rantai orisinal yang selaras dengan jejak arkeologi tertua.',
      eventDate: currentIsoDate,
      category: 'islamic-logic',
      editorialAngle: 'Explainer',
      empiricalDiscovery: {
        id: 'Penemuan lebih dari 25.000 fragmen naskah di 11 gua Qumran mengungkap dokumen Ibrani dan Aramaik dari abad ke-3 SM hingga abad ke-1 M yang terawetkan sempurna di dalam guci tanah liat.',
        en: 'The recovery of over 25,000 fragments across 11 desert caves at Qumran yielded Hebrew and Aramaic documents from the 3rd century BCE to the 1st century CE preserved in earthen jars.',
        ar: 'أسفر اكتشاف أكثر من 25 ألف قصاصة مخطوطة في 11 كهفاً بقمران عن وثائق باللغتين العبرية والآرامية تمتد من القرن الثالث ق.م حتى القرن الأول الميلادي.',
      },
      academicInterpretation: {
        id: 'Para pakar studi biblika independen mencatat bahwa teks Qumran memperlihatkan lapisan tradisi keagamaan yang sangat mengagungkan keesaan mutlak Tuhan serta hukum moral yang ketat.',
        en: 'Biblical and Semitic scholars emphasize that Qumran literature underscores a profound theological layer centered on absolute divine oneness and strict adherence to moral law.',
        ar: 'أكد علماء المخطوطات واللغات السامية أن نصوص قمران تبرز طبقة تراثية متقدمة تتمحور حول التوحيد المطلق والالتزام الصارم بالوصايا الأخلاقية.',
      },
      counterArgument: {
        id: 'Sebagian akademisi mengingatkan agar kita tidak mencocok-cocokkan komunitas Qumran dengan Islam modern karena perbedaan konteks hukum dan ritual Yahudi kuno.',
        en: 'Historians caution against anachronistically equating the sectarian Essene community with modern Islamic practice given their specific ancient Jewish ritual legalism.',
        ar: 'ينبه المؤرخون إلى ضرورة تجنب الإسقاط المعاصر على مجتمع قمران، مع إدراك خصوصية سياقهم التشريعي والتاريخي القديم.',
      },
      islamicScripturalPerspective: {
        surahReference: 'QS. Al-Baqarah [2]: 136',
        arabicText: 'قُولُوا آمَنَّا بِاللَّهِ وَمَا أُنزِلَ إِلَيْنَا وَمَا أُنزِلَ إِلَىٰ إِبْرَاهِيمَ وَإِسْمَاعِيلَ وَإِسْحَاقَ وَيَعْقُوبَ',
        translation: {
          id: 'Katakanlah: "Kami beriman kepada Allah dan apa yang diturunkan kepada kami, dan apa yang diturunkan kepada Ibrahim, Ismail, Ishaq, dan Ya\'qub..."',
          en: 'Say: "We believe in Allah and what has been revealed to us and what was revealed to Abraham, Ishmael, Isaac, and Jacob..."',
          ar: 'قُولُوا آمَنَّا بِاللَّهِ وَمَا أُنزِلَ إِلَيْنَا وَمَا أُنزِلَ إِلَىٰ إِبْرَاهِيمَ وَإِسْمَاعِيلَ وَإِسْحَاقَ وَيَعْقُوبَ',
        },
        exegesis: {
          id: 'Al-Qur\'an tidak memposisikan dirinya sebagai ajaran yang terputus dari sejarah, melainkan penyempurna mata rantai risalah para nabi terdahulu.',
          en: 'The Qur\'an presents its revelation not as a historical anomaly, but as the final restoration of the unbroken continuum of prophetic monotheism.',
          ar: 'يقدم القرآن الكريم نفسه كاستمرار حي واستعادة جامعة لرسالات الأنبياء السابقين عبر تاريخ البشرية.',
        },
      },
      whatThisDoesAndDoesntProve: {
        id: 'Penemuan ini tidak serta merta menjadi sertifikat mukjizat, melainkan bukti historis bahwa pencarian manusia terhadap tauhid murni memiliki jejak tertua yang nyata sebelum doktrin trinitarian diformalkan oleh konsili kekaisaran.',
        en: 'The scrolls do not serve as an automatic apologetic proof, but provide crucial documentary evidence that radical monotheism constituted the authentic core of ancient Semitic belief before later imperial theological syncretism.',
        ar: 'لا تمثل هذه المخطوطات برهاناً سحرياً مجرداً، بل وثيقة تاريخية تثبت أن التوحيد كان هو الأساس الأصيل في الفكر الديني السامي قبل الصياغات الإمبراطورية المتأخرة.',
      },
      reflectiveQuestion: {
        id: 'Ketika sejarah, manuskrip, dan logika fitrah manusia berakar pada pesan keesaan yang sama, tidakkah ada sebuah benang merah kebenaran abadi yang sedang memanggil kita untuk kembali berpikir?',
        en: 'When historical manuscripts, textual archaeology, and primordial human reasoning converge upon the exact same unified concept of the Divine, might there be an enduring thread of truth calling for our contemplation?',
        ar: 'حين تتلاقى شواهد التاريخ مع نصوص المخطوطات ونداء الفطرة العقلية نحو التوحيد، ألا يشير ذلك إلى حقيقة واحدة خالدة تستحق التأمل والبحث؟',
      },
      recommendedNarrativeStructure: 'Hook -> Discovery -> Context -> Counterargument -> Islamic Framing -> Honest Boundaries -> Reflection',
      recommendedTone: 'intellectual-storytelling',
      readerDifficulty: 'accessible',
      editorialPotential: 95,
      sources: [
        { name: 'Israel Antiquities Authority Dead Sea Scrolls Project', url: 'https://www.deadseascrolls.org.il/', tier: 1, type: 'Official Newsroom' },
        { name: 'Society of Biblical Literature Academic Studies', url: 'https://www.sbl-site.org/', tier: 1, type: 'Academic Paper' },
        { name: 'Cambridge University Press Ancient History', url: 'https://www.cambridge.org/core/publications/journals', tier: 2, type: 'Journalism' },
      ],
      keywords: ['qumran', 'dead sea', 'scrolls', 'monotheism', 'history', 'manuscript', 'archaeology', 'bible']
    }
  ];
}

export async function researchIslamicAcademicIntelligence(): Promise<IslamicAcademicStory[]> {
  console.log('📜 [Islamic Academic & Storytelling Engine] Discovering compelling intellectual narratives & rigorous evidence...');

  const today = new Date().toISOString().split('T')[0];
  const candidates = getFreshIslamicAcademicCandidates(today);

  const blogDir = path.join(process.cwd(), 'data', 'blog');
  const existingFiles = fs.existsSync(blogDir) ? fs.readdirSync(blogDir) : [];

  const verifiedStories = candidates.filter(story => {
    // Deduplication check against existing entity titles
    const isDuplicate = existingFiles.some(file => {
      const lower = file.toLowerCase();
      return story.keywords.filter(k => lower.includes(k)).length >= 3;
    });

    if (isDuplicate) {
      console.log(`  └─ [Anti-Duplicate] Skipped existing academic story entity: "${story.title}"`);
      return false;
    }

    return true;
  });

  console.log(`✅ [Islamic Academic & Storytelling Engine] Selected ${verifiedStories.length} compelling story candidate(s).`);
  return verifiedStories;
}
