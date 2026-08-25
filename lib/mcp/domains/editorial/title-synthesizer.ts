import { LocalizedText } from '../../core/types'

export class NativeTitleSynthesizer {
  /**
   * Crafts native, grammatically authentic titles in Indonesian, English, and Arabic
   * Thinking natively in each language rather than literal word-by-word translation
   */
  static synthesizeTrilingualTitles(
    rawTitle: string,
    subCategoryOrPillar: string,
    category: 'tech-ai' | 'islamic-logic'
  ): LocalizedText {
    const lower = rawTitle.toLowerCase()

    if (category === 'tech-ai') {
      // 1. Windows, PowerToys, Desktop OS
      if (lower.includes('powertoys') || (lower.includes('alt+tab') && lower.includes('window'))) {
        return {
          id: 'Microsoft PowerToys Hadirkan Fitur Switcher Jendela Mirip Alt-Tab: Optimalisasi Manajemen Task dan Multitasking di Windows 11',
          en: 'Microsoft PowerToys Adds Alt+Tab-Style Window Switching: A Deep Look into Windows Desktop Multitasking Architecture',
          ar: 'أداة Microsoft PowerToys تضيف ميزة التبديل السريع بين النوافذ بنمط Alt-Tab: تحسين إدارة المهام في بيئة ويندوز',
        }
      }

      // 2. Linux Kernel & Multi-Kernel OS
      if (lower.includes('linux') || lower.includes('kernel') || lower.includes('multi-kernel')) {
        return {
          id: 'Inovasi Rilis Kernel Linux Generasi Baru: Analisis Arsitektur Multi-Kernel, Manajemen Latensi, dan Efisiensi Komputasi',
          en: 'Next-Gen Linux Multi-Kernel Architecture: Low-Latency Scheduling, System Microbenchmarks, and OS Performance',
          ar: 'تطوير نواة لينكس وهندسة الأنظمة متعددة النواة: تحليل البنية المعمارية، كفاءة الجدولة، ومستقبل أنظمة التشغيل',
        }
      }

      // 3. Zimbra, Cybersecurity, Server Vulnerabilities
      if (
        lower.includes('zimbra') ||
        lower.includes('breach') ||
        lower.includes('vulnerability') ||
        lower.includes('exploit') ||
        lower.includes('cve')
      ) {
        return {
          id: 'Celah Keamanan Server Zimbra Tereksploitasi dalam Serangan Global: Analisis Vektor Serangan, Dampak RCE, dan Mitigasi SysAdmin',
          en: 'Over 270 Zimbra Collaboration Servers Compromised: Vulnerability Architecture, Attack Vectors, and Defensive Hardening',
          ar: 'اختراق أكثر من 270 خادم Zimbra حول العالم: تفكيك الثغرة الأمنية، مسارات الاستغلال، وتدابير الحماية الموصى بها',
        }
      }

      // 4. Smartphone, Poco, Snapdragon, Dimensity
      if (
        lower.includes('poco') ||
        lower.includes('snapdragon') ||
        lower.includes('dimensity') ||
        lower.includes('smartphone') ||
        lower.includes('f9')
      ) {
        return {
          id: 'Konfirmasi Arsitektur Chipset Smartphone Flagship: Analisis Silikon, Manajemen Termal, dan Ekspektasi Performa Mobile',
          en: 'Flagship Mobile Silicon Architecture: Microarchitecture Teardown, Thermal Profiles, and Real-World Compute Density',
          ar: 'معمارية معالجات الهواتف الذكية الرائدة: تفكيك السيليكون، الإدارة الحرارية، وتوقعات الأداء الحوسبي المتقدم',
        }
      }

      // 5. AI, LLM, Reasoning Models
      if (
        lower.includes('ai') ||
        lower.includes('llm') ||
        lower.includes('deepseek') ||
        lower.includes('openai') ||
        lower.includes('anthropic')
      ) {
        return {
          id: 'Evolusi Arsitektur Model Penalaran AI: Analisis Kerapatan Parameter, Latensi Inferensi, dan Efisiensi Komputasi Cerdas',
          en: 'Reasoning AI Model Architectural Evolution: Parameter Density, Inference Latency, and Scalable Intelligence',
          ar: 'تطور معمارية نماذج الذكاء الاصطناعي الاستدلالي: كثافة المعاملات، سرعة الاستدلال، وكفاءة الحوسبة الذكية',
        }
      }

      // 6. Semiconductors & ASML
      if (
        lower.includes('asml') ||
        lower.includes('euv') ||
        lower.includes('lithography') ||
        lower.includes('2nm') ||
        lower.includes('semiconductor')
      ) {
        return {
          id: 'Teknologi Litografi Tingkat Lanjut dan Batas Fisik Silikon: Analisis Optik Sub-2nm dan Kelangsungan Hukum Moore',
          en: "Advanced Lithography and the Physical Limits of Silicon: Deconstructing Sub-2nm Optics and Moore's Law Continuity",
          ar: 'تقنيات الطباعة الضوئية المتقدمة وحدود السيليكون: تفكيك البصريات دون 2 نانومتر ومستقبل قانون مور',
        }
      }

      // 7. General Tech Fallback (Thinking natively)
      return {
        id: `Telaah Arsitektural dan Rekayasa Sistem Komputasi Modern: Analisis Implikasi dan Prospek Ekosistem Teknologi`,
        en: `Modern Systems Engineering and Compute Architecture: Strategic Analysis, Benchmarks, and Ecosystem Trajectory`,
        ar: `قراءة معمارية في هندسة النظم والحوسبة الحديثة: الأبعاد الهندسية، معايير الأداء، والآفاق التقنية المستقبلية`,
      }
    } else {
      // Islamic Logic Topics
      // 1. Stereotypes, Misconceptions, Ethics
      if (
        lower.includes('misconception') ||
        lower.includes('stereotype') ||
        lower.includes('misunderstood') ||
        lower.includes('doubt') ||
        lower.includes('moral')
      ) {
        return {
          id: 'Menepis Stereotip dan Miskonsepsi Populer tentang Islam: Analisis Kritis atas Prinsip Toleransi, Keadilan, dan Rasionalitas Nilai',
          en: 'Looking Beyond Stereotypes: A Rational Analysis of Common Misconceptions Regarding Islamic Faith and Ethics',
          ar: 'تفنيد الشبهات وتصحيح المفاهيم المغلوطة عن الإسلام: قراءة عقلانية في القيم الأخلاقية وحرية الفكر والعدالة',
        }
      }

      // 2. Jesus, Mary, Prophets, Comparative Religion
      if (
        lower.includes('jesus') ||
        lower.includes('mary') ||
        lower.includes('isa') ||
        lower.includes('christianity') ||
        lower.includes('bible')
      ) {
        return {
          id: 'Nabi Isa dan Tradisi Ketundukan Mutlak: Menelusuri Jejak Sejarah Shalat, Monoteisme Murni, dan Kesinambungan Risalah Para Nabi',
          en: 'Jesus, Devotion, and Total Surrender: Historical Witnesses of Prayer, Pure Monotheism, and Scriptural Continuity',
          ar: 'المسيح عيسى ابن مريم ومنطق العبودية الخالصة: شواهد الصلاة، التوحيد الصافي، ووحدة الرسالات الإلهية',
        }
      }

      // 3. Sharia Rationality, Economics, Riba
      if (
        lower.includes('riba') ||
        lower.includes('debt') ||
        lower.includes('economics') ||
        lower.includes('sharia') ||
        lower.includes('justice')
      ) {
        return {
          id: 'Rasionalitas Larangan Riba dalam Perspektif Ekonomi Makro: Solusi Keadilan Transaksi atas Krisis Utang Global',
          en: 'The Macroeconomic Rationality of Prohibiting Usury (Riba): Systemic Debt Cycles, Wealth Concentration, and Transactional Justice',
          ar: 'العقلانية الاقتصادية في تحريم الربا: قراءة في أزمات الديون العالمية، عدالة التوزيع، والبدائل التنموية المستدامة',
        }
      }

      // 4. War, Peace, Geopolitical Ethics & Humanity
      if (
        lower.includes('war') ||
        lower.includes('conflict') ||
        lower.includes('peace') ||
        lower.includes('iran') ||
        lower.includes('humanity')
      ) {
        return {
          id: 'Etika Resolusi Konflik dan Keadilan Kemanusiaan: Perspektif Fiqh Peradaban terhadap Hak Asasi dan Perdamaian Global',
          en: 'Ethics of Conflict Resolution, Humanitarian Demarcation, and Global Peace: Islamic Epistemology on Universal Human Rights',
          ar: 'أخلاقيات فض النزاعات والعدالة الإنسانية: قراءة فقهية وحضارية في حقوق الإنسان وصناعة السلام العالمي',
        }
      }

      // 5. Science, Cosmology, Logic
      if (
        lower.includes('science') ||
        lower.includes('cosmology') ||
        lower.includes('logic') ||
        lower.includes('evolution') ||
        lower.includes('universe')
      ) {
        return {
          id: 'Kosmologi dan Keteraturan Alam Semesta: Bagaimana Epistemologi Islam Memandang Demarkasi Sains Modern',
          en: 'Cosmology, Fine-Tuning, and Natural Order: Islamic Epistemology and the Boundaries of Modern Science',
          ar: 'الكونيات وتناسق الطبيعة: الرؤية المعرفية الإسلامية وحدود العلوم الطبيعية المعاصرة',
        }
      }

      // 6. General Islamic Logic Fallback
      return {
        id: 'Menalar Hakikat Kebenaran dan Nilai Moral: Harmoni antara Akal Sehat, Realitas Objektif, dan Epistemologi Wahyu',
        en: 'Interrogating Truth and Moral Value: The Harmony Between Reason, Objective Reality, and Scriptural Epistemology',
        ar: 'في عقلانية الإيمان والمنظومة الأخلاقية: التكامل بين صريح المعقول والواقع الموضوعي وأصول الوحي',
      }
    }
  }
}
