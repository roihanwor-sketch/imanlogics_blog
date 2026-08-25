import fs from 'fs';
import path from 'path';
import { SourceCitation, EditorialAngle } from './tech-researcher';

export interface LocalizedText {
  id: string;
  en: string;
  ar: string;
}

export interface DeepNarrativeSection {
  title: LocalizedText;
  paragraphs: LocalizedText[];
}

export interface IslamicAcademicStory {
  id: string;
  title: string;
  titles: LocalizedText;
  readerHook: LocalizedText;
  universalQuestion: LocalizedText;
  curiosityGap: string;
  historicalScene: LocalizedText;
  archaeologicalDetails: {
    discoveryNarrative: LocalizedText;
    caveAndManuscriptCount: LocalizedText;
    keyTexts: Array<{ name: string; description: LocalizedText }>;
    textualLandscape: LocalizedText; // Proto-Masoretic, Septuagint, etc.
  };
  scholarlyDebate: {
    esseneHypothesis: LocalizedText;
    alternativeTheories: LocalizedText; // Norman Golb, Hirschfeld
    scholarlyConsensusOrDispute: LocalizedText;
  };
  definitionalDistinction: {
    monotheismVsTawhid: LocalizedText;
  };
  islamicReasoningWalkthrough: {
    revelationContinuity: LocalizedText;
    scripturalTransmissionHistory: LocalizedText;
    quranicPerspective: {
      surahReference: string;
      arabicText: string;
      translation: LocalizedText;
      exegesis: LocalizedText;
    };
    theologicalSynthesis: LocalizedText;
  };
  whatThisDoesAndDoesntProve: LocalizedText;
  reflectiveQuestion: LocalizedText;
  eventDate: string;
  category: 'islamic-logic';
  editorialAngle: EditorialAngle;
  sources: SourceCitation[];
  keywords: string[];
}

export function getFreshIslamicAcademicCandidates(currentIsoDate: string): IslamicAcademicStory[] {
  return [
    {
      id: 'qumran-dead-sea-scrolls-monotheism-study',
      title: 'Apa yang Sebenarnya Diungkap Gulungan Laut Mati tentang Agama Yahudi Sebelum Yesus?',
      titles: {
        id: 'Apa yang Sebenarnya Diungkap Gulungan Laut Mati tentang Agama Yahudi Sebelum Yesus?',
        en: 'What the Dead Sea Scrolls Actually Reveal About Judaism Before Jesus',
        ar: 'ما الذي تكشفه مخطوطات البحر الميت حقاً عن اليهودية قبل عصر المسيح؟',
      },
      readerHook: {
        id: 'Pada akhir musim semi tahun 1947, seorang penggembala muda suku Badui Ta\'amireh melemparkan batu ke dalam lubang gelap di tebing terjal Qumran, dekat pantai barat laut Laut Mati. Bunyi gema tembikar pecah dari kedalaman gua tersebut bukan sekadar suara bejana kuno yang retak—melainkan awal dari penemuan arkeologi paling transformatif dalam sejarah studi kitab suci manusia.',
        en: 'In late spring of 1947, a young Bedouin shepherd from the Ta\'amireh tribe casually tossed a stone into a dark crevice on the arid limestone cliffs of Qumran, near the northwestern shore of the Dead Sea. The hollow shattering of ancient pottery echoing from the cave’s depths was not merely the sound of a broken jar—it heralded the most transformative archaeological discovery in the history of scriptural scholarship.',
        ar: 'في أواخر ربيع عام 1947، رمى راعٍ فتي من قبيلة التعامرة البدوية حجراً في فجوة مظلمة بين المنحدرات الصخرية الوعرة لوادي قمران قرب البحر الميت. لم يكن صدى انكسار الفخار القديم المنبعث من ظلمة الكهف مجرد جرة مكسورة، بل كان إيذاناً بأعظم كشف أثري غير جذرياً مسار دراسات تاريخ الكتب المقدسة.',
      },
      universalQuestion: {
        id: 'Seperti apa sebenarnya keyakinan tentang Tuhan, hukum wahyu, kemurnian ibadah, dan akhir zaman di dunia Yahudi Periode Bait Kedua sebelum era Yesus dan bangkitnya tradisi monoteisme modern?',
        en: 'What did Jewish communities of the Second Temple period actually believe about God, divine law, ritual purity, and the end of days before the rise of Christianity and later Islamic monotheism?',
        ar: 'كيف كانت طبيعة الإيمان بالله والتشريع الإلهي والطهارة واليوم الآخر في العالم اليهودي خلال فترة الهيكل الثاني قبل ميلاد المسيح وبزوغ الرسالات اللاحقة؟',
      },
      curiosityGap: 'Publik sering terjebak dalam dikotomi sempit: apakah naskah kuno membuktikan Alkitab 100% identik atau 100% berubah? Penemuan Qumran menunjukkan kenyataan yang jauh lebih kaya dan kompleks: sebuah jendela langsung ke proses transmisi teks dan dinamika monoteisme kuno.',
      historicalScene: {
        id: 'Di tengah teriknya gurun Yudea yang membakar, ribuan lembaran perkamen dan papirus tersimpan selama lebih dari dua milenium di dalam guci tanah liat, terlindung dari kelembapan udara hingga akhirnya ditemukan kembali oleh dunia modern.',
        en: 'Amid the scorching Judean desert heat, thousands of parchment and papyrus leaves lay sealed inside earthen jars for over two millennia, shielded from humidity until the modern world unsealed their secrets.',
        ar: 'في قلب صحراء يهودا اللاهبة، رقدت آلاف الرقائق الجلدية ولفائف البردي محفوظة داخل جرار فخارية لأكثر من ألفي عام، بمنأى عن رطوبة الهواء حتى أعاد العالم الحديث اكتشافها.',
      },
      archaeologicalDetails: {
        discoveryNarrative: {
          id: 'Antara tahun 1947 hingga 1956, para arkeolog dan warga lokal menyisir 11 gua di sekitar situs Khirbet Qumran. Dari ribuan potongan kulit dan papirus yang rapuh, para ahli paleografi berhasil merekonstruksi sekitar 900 manuskrip individual. Cave 4 sendiri menyumbang lebih dari 75% material, menghasilkan sekitar 15.000 fragmen dari 500 naskah berbeda.',
          en: 'Between 1947 and 1956, systematic excavations across 11 caves around Khirbet Qumran yielded tens of thousands of brittle fragments, painstakingly reconstructed into roughly 900 distinct manuscripts. Cave 4 alone accounted for over 75% of all recovered material, yielding roughly 15,000 fragments representing 500 separate codices and scrolls.',
          ar: 'بين عامي 1947 و1956، أسفر التنقيب الأثري في 11 كهفاً حول خربة قمران عن استخراج عشرات الآلاف من القصاصات الهشة التي تم تجميعها لتشكل حوالي 900 مخطوطة متميزة. ساهم الكهف الرابع وحده بأكثر من 75% من إجمالي المادة المكتشفة، بما يقارب 15 ألف شظية لنحو 500 نص مختلف.',
        },
        caveAndManuscriptCount: {
          id: 'Koleksi ini terbagi menjadi dua kelompok besar: sekitar 230 manuskrip Kitab Suci Ibrani (Alkitab), dan sisanya adalah teks-teks non-Alkitab yang memuat aturan komunitas, doa, tafsir (pesharim), karya apokaliptik, serta hukum keagamaan.',
          en: 'The corpus divides broadly into two categories: approximately 230 biblical manuscripts of the Hebrew Bible, and hundreds of non-biblical sectarian texts encompassing community rules, liturgical prayers, biblical commentaries (pesharim), apocalyptic revelations, and legal halakhah.',
          ar: 'تنقسم المجموعة إلى فئتين رئيسيتين: نحو 230 مخطوطة من أسفار الكتاب المقدس العبري، ومئات النصوص غير التوراتية التي تتضمن قوانين الجماعة، والصلوات، والتفاسير (بيشاريم)، والنصوص الأخروية والتشريعات الدينية.',
        },
        keyTexts: [
          {
            name: 'Great Isaiah Scroll (1QIsaᵃ)',
            description: {
              id: 'Gulungan utuh Kitab Yesaya sepanjang 7,34 meter dari abad ke-2 SM—seribu tahun lebih tua daripada Naskah Masoretik Aleppo dan Leningrad yang sebelumnya menjadi rujukan tertua dunia.',
              en: 'The complete 7.34-meter scroll of Isaiah dating to the 2nd century BCE—over 1,000 years older than the Aleppo and Leningrad Codices which previously served as humanity\'s earliest Hebrew witnesses.',
              ar: 'لفافة سفر إشعياء الكاملة بطول 7.34 متراً وتعود للقرن الثاني قبل الميلاد—أقدم بأكثر من ألف عام من مخطوطتي حلب ولينينغراد الماسوريتين.',
            }
          },
          {
            name: 'Community Rule (1QS) & Damascus Document (CD)',
            description: {
              id: 'Pedoman hidup asketis komunitas yang menekankan pemisahan diri dari korupsi politik Yerusalem, kepatuhan moral mutlak, dan ritual bersuci berkala menggunakan air.',
              en: 'Sectarian charters establishing strict ascetic life, ritual immersion, absolute moral discipline, and radical separation from the perceived corrupt Jerusalem priesthood.',
              ar: 'مواثيق مجتمعية تحدد حياة نسكية صارمة، والتطهر بالماء، والالتزام الأخلاقي الحازم، والانفصال عن كهنوت أورشليم الذي اعتبروه فاسداً.',
            }
          },
          {
            name: 'Temple Scroll (11QT) & Copper Scroll (3Q15)',
            description: {
              id: 'Naskah hukum bangunan Bait Suci ideal serta gulungan tembaga unik yang memuat daftar 64 lokasi persembunyian emas dan perak di tanah Yudea.',
              en: 'A comprehensive blueprint for an ideal Temple sanctuary alongside a mysterious copper sheet listing 64 underground caches of gold and silver treasures across Judea.',
              ar: 'مخطوطة تفصيلية لهيكل مقدس مثالي إلى جانب لفافة نحاسية فريدة تحصر 64 موقعاً لكنوز سرية من الذهب والفضة في ربوع يهودا.',
            }
          }
        ],
        textualLandscape: {
          id: 'Penemuan Qumran mematahkan anggapan bahwa teks Alkitab Ibrani pada masa itu sudah bersifat kaku dan tunggal. Para ahli (seperti Emanuel Tov dari Hebrew University) menemukan realitas transmisi yang dinamis: naskah-naskah Qumran mencerminkan tradisi proto-Masoretik, tradisi yang mendasari terjemahan Septuaginta Yunani, teks pra-Samaria, dan varian-varian unik yang tidak terafiliasi.',
          en: 'The Qumran discoveries dismantled simplistic assumptions of a static, monolithic biblical text in antiquity. As leading textual scholar Emanuel Tov demonstrates, Qumran exhibits a vibrant pluriform landscape: proto-Masoretic witnesses, manuscripts reflecting the Hebrew Vorlage of the Greek Septuagint, pre-Samaritan texts, and independent non-aligned variants.',
          ar: 'دحضت مخطوطات قمران الفرضيات السطحية التي تدعي ثبات النص العبري القديم وتطابقه المطلق. كما أوضح البروفيسور إيمانويل توف، عكست المخطوطات مشهداً نصياً متنوعاً: نصوص بروتو-ماسورتية، وشواهد عبرية توافق الترجمة السبعينية اليونانية، ونصوص سامرية مبكرة، وقراءات مستقلة.',
        }
      },
      scholarlyDebate: {
        esseneHypothesis: {
          id: 'Teori klasik yang diajukan oleh Roland de Vaux dan Eleazar Sukenik mengidentifikasi komunitas Khirbet Qumran sebagai kaum Eseni (Essenes)—sebuah sekte Yahudi asketis yang menarik diri ke padang pasir sebagaimana digambarkan oleh Flavius Josephus dan Philo.',
          en: 'The classic hypothesis pioneered by Roland de Vaux and Eleazar Sukenik identified the inhabitants of Khirbet Qumran as the Essenes—an ascetic Jewish sect described by Flavius Josephus and Philo that withdrew into the wilderness to preserve ritual purity.',
          ar: 'الفرضية الكلاسيكية التي صاغها رولان دي فو وإليعازر سوكينيك نسبت المخطوطات إلى جماعة الأسينيين—وهي فرقة يهودية نسكية اعتزلت في البرية حفاظاً على الطهارة كما وصفها يوسيفوس وفيلو.',
        },
        alternativeTheories: {
          id: 'Namun, penelitian arkeologi modern menghadirkan perdebatan sengit. Prof. Norman Golb (University of Chicago) berargumen bahwa naskah-naskah ini bukan karya satu sekte padang pasir, melainkan perpustakaan-perpustakaan dari Yerusalem yang diselamatkan ke gua-gua saat tentara Romawi mengepung kota pada Perang Yahudi Pertama (66–70 M). Teori lain (seperti Yizhar Hirschfeld) memandang Khirbet Qumran sebagai benteng militer atau perkebunan bangsawan.',
          en: 'However, contemporary scholarship vigorously debates this consensus. Prof. Norman Golb (University of Chicago) contends the scrolls represent diverse libraries from Jerusalem hidden in desert caves by refugees fleeing the Roman siege during the First Jewish Revolt (66–70 CE). Other scholars, such as Yizhar Hirschfeld, propose Khirbet Qumran was a fortified manor or agricultural estate.',
          ar: 'غير أن البحث الأكاديمي المعاصر شهد نقاشات حادة؛ إذ يرى البروفيسور نورمان غولب (جامعة شيكاغو) أن المخطوطات ليست نتاج فرقة واحدة، بل تمثل مكتبات مقدسية نُقلت إلى الكهوف لإنقاذها أثناء الحصار الروماني لأورشليم (66–70م). بينما اعتبر باحثون آخرون الموقع حصناً عسكرياً أو ضيعة زراعية.',
        },
        scholarlyConsensusOrDispute: {
          id: 'Konsensus akademik saat ini bergerak lebih hati-hati: terlepas dari siapa penulis persisnya, naskah Qumran mencerminkan keragaman teologis dan intelektual dunia Yahudi Periode Bait Kedua yang jauh lebih dinamis daripada sekadar satu aliran tunggal.',
          en: 'Modern academic consensus approaches the material with nuanced caution: regardless of the exact identity of the scribes, the Dead Sea Scrolls offer an irreplaceable cross-section of Second Temple Jewish thought, proving that ancient Jewish monotheism was lively, diverse, and deeply engaged with questions of divine justice.',
          ar: 'يتعامل الإجماع الأكاديمي اليوم بحذر منهجي؛ فبغض النظر عن هوية النساخ الدقيقة، تمثل مخطوطات البحر الميت سجلاً تاريخياً لا يُقدّر بثمن يثبت حيوية وتنوع الفكر الديني في حقبة الهيكل الثاني.',
        }
      },
      definitionalDistinction: {
        monotheismVsTawhid: {
          id: 'Penting untuk membuat distingsi konseptual yang jujur: monoteisme Yahudi Periode Bait Kedua adalah penolakan terhadap politeisme berhala dan penegasan bahwa Yahweh adalah satu-satunya Pencipta alam semesta. Namun, ini tidak otomatis identik dengan tauhid Islam dalam rincian teologi sistematik kalam. Yang ditunjukkan oleh Qumran adalah komitmen radikal terhadap keesaan Allah di tengah kepungan pengaruh paganisme Yunani-Romawi.',
          en: 'An intellectually honest inquiry must distinguish concepts rigorously: Second Temple Jewish monotheism centered on rejecting pagan idols and affirming Yahweh as the sole Creator. While this is not inherently identical to the systematic scholastic definitions of Islamic Kalam, it demonstrates a radical historical devotion to the transcendent Oneness of God amid pervasive Greco-Roman polytheism.',
          ar: 'يقتضي الإنصاف الأكاديمي التمييز بين المفاهيم: كان التوحيد اليهودي في فترة الهيكل الثاني قائماً على رفض عبادة الأوثان وإفراد الخالق بالعبودية. ورغم أنه لا يتطابق بالضرورة مع التفريعات الكلامية اللاحقة، إلا أنه يوثق تمسكاً صارماً بوحدانية الله في مواجهة الشرك الروماني الهلنستي.',
        }
      },
      islamicReasoningWalkthrough: {
        revelationContinuity: {
          id: 'Dalam epistemologi Islam, risalah para nabi tidak dipandang sebagai titik-titik diskret yang saling terpisah, melainkan sebuah mata rantai wahyu yang berkesinambungan. Ketika Al-Qur\'an berbicara tentang Taurat, Zabur, dan ajaran para nabi Bani Israil, Islam mengakui bahwa inti teologis dari seluruh pesan kenabian tersebut bertumpu pada satu poros: menyembah Tuhan Yang Maha Esa.',
          en: 'Within Islamic epistemology, the prophetic messages are not viewed as isolated historical anomalies, but as an unbroken continuum of divine revelation. When the Qur\'an references the Torah, Psalms, and the prophetic lineage of the Children of Israel, it affirms that the essential core of every divine mission anchored upon a single truth: worshiping the One True Creator.',
          ar: 'في المنظور المعرفي الإسلامي، لا تُعد رسالات الأنبياء حوادث تاريخية منقطعة، بل حلقات متصلة في موكب الوحي الإلهي. وحين يذكر القرآن التوراة والزبور ورسالات أنبياء بني إسرائيل، فإنه يؤكد أن الجوهر العقدي لكافة النبوات ارتكز على محور واحد: إفراد الخالق بالعبادة.',
        },
        scripturalTransmissionHistory: {
          id: 'Di sisi lain, Islam juga memiliki pandangan historis yang sangat realistis mengenai keterbatasan transmisi manuskrip kuno. Al-Qur\'an menegaskan bahwa teks-teks terdahulu dipercayakan pemeliharaannya kepada manusia (bima istuhfidzu min kitabillah), sehingga secara wajar mengalami proses penyalinan, variasi redaksional, dan perbedaan interpretasi seiring berjalannya abad.',
          en: 'Concurrently, Islamic historiography maintains a realistic assessment of manuscript transmission. The Qur\'an articulates that prior scriptures were entrusted to human custodianship (QS. Al-Ma\'idah: 44), naturally encountering scribal variations, editorial redactions, and shifting transmission dynamics over centuries.',
          ar: 'وفي الوقت ذاته، يمتلك الفكر الإسلامي رؤية تاريخية واقعية لطبيعة انتقال المخطوطات القديمة؛ فالقرآن يقرر أن الكتب السابقة استحفظ عليها البشر (بِمَا اسْتُحْفِظُوا مِن كِتَابِ اللَّهِ)، مما جعلها عرضة طبيعية للتباينات الخطية وتعدد الروايات عبر الأجيال.',
        },
        quranicPerspective: {
          surahReference: 'QS. Al-Baqarah [2]: 136',
          arabicText: 'قُولُوا آمَنَّا بِاللَّهِ وَمَا أُنزِلَ إِلَيْنَا وَمَا أُنزِلَ إِلَىٰ إِبْرَاهِيمَ وَإِسْمَاعِيلَ وَإِسْحَاقَ وَيَعْقُوبَ وَالْأَسْبَاطِ وَمَا أُوتِيَ مُوسَىٰ وَعِيسَىٰ وَمَا أُوتِيَ النَّبِيُّونَ مِن رَّبِّهِمْ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّنْهُمْ وَنَحْنُ لَهُ مُسْلِمُونَ',
          translation: {
            id: 'Katakanlah: "Kami beriman kepada Allah dan apa yang diturunkan kepada kami, dan apa yang diturunkan kepada Ibrahim, Ismail, Ishaq, Ya\'qub, dan anak cucunya, dan apa yang diberikan kepada Musa dan Isa serta apa yang diberikan kepada nabi-nabi dari Tuhannya. Kami tidak membeda-bedakan seorang pun di antara mereka dan kami hanya berserah diri kepada-Nya."',
            en: 'Say: "We believe in Allah and what has been revealed to us and what was revealed to Abraham, Ishmael, Isaac, Jacob, and the Descendants, and what was given to Moses and Jesus and what was given to the prophets from their Lord. We make no distinction between any of them, and to Him we submit."',
            ar: 'قُولُوا آمَنَّا بِاللَّهِ وَمَا أُنزِلَ إِلَيْنَا وَمَا أُنزِلَ إِلَىٰ إِبْرَاهِيمَ وَإِسْمَاعِيلَ وَإِسْحَاقَ وَيَعْقُوبَ وَالْأَسْبَاطِ وَمَا أُوتِيَ مُوسَىٰ وَعِيسَىٰ وَمَا أُوتِيَ النَّبِيُّونَ مِن رَّبِّهِمْ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّنْهُمْ وَنَحْنُ لَهُ مُسْلِمُونَ',
          },
          exegesis: {
            id: 'Ayat ini menegaskan prinsip epistemologis universal: pengakuan terhadap akar ilahi dari pesan-pesan monoteistik masa lampau tanpa memaksakan bahwa setiap catatan manusia dari masa tersebut harus identik kata demi kata.',
            en: 'This passage encapsulates a universal epistemological principle: affirming the authentic divine origin of ancient monotheistic revelations while acknowledging that historical human records reflect the organic reality of scribal transmission.',
            ar: 'تؤسس هذه الآية لقاعدة معرفية جامعة: الإقرار بالأصل الإلهي لرسالات التوحيد التاريخية، مع إدراك أن التوثيق البشري التاريخي يظل محكوماً بطبائع النقل والتدوين.',
          }
        },
        theologicalSynthesis: {
          id: 'Dengan demikian, ketika seorang peneliti membaca naskah Qumran, ia tidak sedang melihat sebuah "dokumen Islam kuno", melainkan sedang menyaksikan bukti empiris arkeologis bahwa peradaban Semitik sebelum masehi memang berpusat pada penegasan keesaan Tuhan dan ekspektasi pembaruan moral—sebuah lanskap historis yang sangat selaras dengan narasi Al-Qur\'an mengenai sejarah peradaban kenabian.',
          en: 'Thus, examining the Dead Sea Scrolls does not reveal an anachronistic "ancient Islamic document," but rather tangible material evidence that pre-Christian Semitic civilization was passionately preoccupied with the transcendent Oneness of God and moral accountability—a historical landscape remarkably congruent with the Qur\'anic narrative of prophetic history.',
          ar: 'وعليه، حين يتأمل الباحث مخطوطات قمران، فهو لا يقرأ "وثيقة إسلامية قديمة"، بل يشهد برهاناً أثرياً ملموساً على أن الحضارة السامية قبل الميلاد كانت متجذرة في إفراد الله بالوحدانية والترقب الأخلاقي—وهو مشهد تاريخي يتناغم بعمق مع الرؤية القرآنية لتاريخ النبوات.',
        }
      },
      whatThisDoesAndDoesntProve: {
        id: 'Apa yang terbukti: Gulungan Laut Mati membuktikan secara tak terbantahkan bahwa tradisi penyalinan teks kitab suci Ibrani berusia jauh lebih tua daripada yang diketahui sebelumnya, memperlihatkan keragaman tradisi tekstual pada abad ke-2 SM, serta mendokumentasikan komunitas Yahudi yang menolak keras berhala kekaisaran. Apa yang TIDAK terbukti: Naskah Qumran tidak membuktikan Alkitab sepenuhnya beku tanpa variasi, tidak membuktikan bahwa komunitas Qumran mempraktikkan syariat Islam modern, dan tidak dapat digunakan sebagai klaim apologetika simplistis untuk "membuktikan seluruh ajaran Islam". Menghargai batasan data empiris adalah syarat mutlak integritas ilmiah.',
        en: 'What this proves: The Dead Sea Scrolls indisputably demonstrate that Hebrew scriptural transmission predates medieval codices by over a millennium, document a vibrant textual plurality in the 2nd century BCE, and attest to ancient communities fiercely dedicated to divine sovereignty against imperial paganism. What this DOES NOT prove: The scrolls do not prove a single static biblical archetype, do not prove that Qumran sectarians practiced modern Islamic ritual law, and cannot serve as simplistic apologetic proof for an entire theological system. Respecting evidentiary boundaries is the bedrock of intellectual honesty.',
        ar: 'ما يثبته الكشف: تثبت مخطوطات قمران بشكل قاطع أن تاريخ تدوين النصوص العبرية يسبق المخطوطات القروسطية بأكثر من ألف عام، وتوثق تنوعاً نصياً حياً في القرن الثاني ق.م، وتؤكد وجود مجتمعات تمسكت بالتوحيد ونبذت الشرك الإمبراطوري. ما لا يثبته الكشف: لا تثبت المخطوطات تطابقاً حرفياً جامداً لكافة الأسفار، ولا تدعي أن مجتمع قمران طبق الشريعة الإسلامية المعاصرة، ولا تصح كأداة تبسيطية لإثبات منظومة عقائدية كاملة بضربة واحدة. إن احترام حدود الشاهد التاريخي هو جوهر الأمانة العلمية.',
      },
      reflectiveQuestion: {
        id: 'Ketika kita melihat bagaimana manusia selama ribuan tahun berjuang menyalin, menjaga, dan menyembunyikan lembaran-lembaran perkamen ini di dalam gua demi mempertahankan pesan keesaan Tuhan, pertanyaan apa yang sebenarnya sedang diajukan sejarah kepada hati nurani kita hari ini?',
        en: 'When we observe how human beings across millennia sacrificed and labored to copy, protect, and conceal these fragile parchment leaves inside desert caves to preserve the memory of God\'s Oneness, what question is history truly posing to our modern conscience?',
        ar: 'حين نرى كيف كابد البشر عبر آلاف السنين لحفظ هذه الرقائق ونسخها وإخفائها في كهوف البرية صيانةً لذكرى وحدانية الله، ما هو السؤال الحقيقي الذي يطرحه هذا التاريخ العريق على عقولنا وضمائرنا اليوم؟',
      },
      eventDate: currentIsoDate,
      category: 'islamic-logic',
      editorialAngle: 'Analysis',
      sources: [
        { name: 'The Leon Levy Dead Sea Scrolls Digital Library (Israel Antiquities Authority)', url: 'https://www.deadseascrolls.org.il/', tier: 1, type: 'Official Newsroom' },
        { name: 'The Israel Museum, Jerusalem (Shrine of the Book)', url: 'https://www.imj.org.il/en/wings/shrine-book', tier: 1, type: 'Official Newsroom' },
        { name: 'Emanuel Tov, Textual Criticism of the Hebrew Bible (Fortress Press / Brill)', url: 'https://brill.com/display/title/21175', tier: 1, type: 'Academic Paper' },
        { name: 'Norman Golb, Who Wrote the Dead Sea Scrolls? (Scribner / University of Chicago)', url: 'https://press.uchicago.edu/', tier: 1, type: 'Academic Paper' },
        { name: 'Oxford Center for Hebrew and Jewish Studies', url: 'https://www.ochjs.ac.uk/', tier: 2, type: 'Academic Paper' },
      ],
      keywords: ['qumran', 'dead sea', 'scrolls', 'isaiah', 'monotheism', 'history', 'manuscript', 'archaeology', 'bible', 'second temple']
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
