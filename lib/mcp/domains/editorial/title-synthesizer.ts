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
      // 1. Mobile & Smartphones (iPhone, Android, Samsung, Xiaomi, etc.)
      if (
        lower.includes('iphone') ||
        lower.includes('apple') ||
        lower.includes('samsung') ||
        lower.includes('galaxy') ||
        lower.includes('xiaomi') ||
        lower.includes('pixel') ||
        lower.includes('smartphone') ||
        lower.includes('phone')
      ) {
        return {
          id: `${rawTitle}: Tinjauan Fitur, Performa Harian, dan Dampaknya bagi Pengguna`,
          en: `${rawTitle}: Feature Breakdown, Real-World Performance, and User Takeaways`,
          ar: `${rawTitle}: نظرة شاملة على الميزات، الأداء العملي، وتأثيره على المستخدمين`,
        }
      }

      // 2. Apps, Software & Operating Systems (Windows, macOS, Linux, Android, WhatsApp, Telegram, Google, etc.)
      if (
        lower.includes('app') ||
        lower.includes('update') ||
        lower.includes('windows') ||
        lower.includes('mac') ||
        lower.includes('android') ||
        lower.includes('whatsapp') ||
        lower.includes('google') ||
        lower.includes('browser') ||
        lower.includes('chrome') ||
        lower.includes('software')
      ) {
        return {
          id: `${rawTitle}: Analisis Pembaruan Fitur Baru dan Peningkatan Pengalaman Pengguna`,
          en: `${rawTitle}: Exploring New Capabilities, Usability Upgrades, and Practical Impact`,
          ar: `${rawTitle}: استكشاف الميزات الجديدة، ترقيات تجربة الاستخدام، والتأثير العملي`,
        }
      }

      // 3. AI Tools & Assistants (ChatGPT, Claude, Gemini, Agentic AI, AI Apps)
      if (
        lower.includes('ai') ||
        lower.includes('chatgpt') ||
        lower.includes('claude') ||
        lower.includes('gemini') ||
        lower.includes('openai') ||
        lower.includes('deepseek') ||
        lower.includes('model')
      ) {
        return {
          id: `${rawTitle}: Inovasi Kecerdasan Buatan Terkini dan Penerapan Praktisnya`,
          en: `${rawTitle}: Latest Artificial Intelligence Breakthroughs and Everyday Applications`,
          ar: `${rawTitle}: أحدث ابتكارات الذكاء الاصطناعي وتطبيقاته اليومية للمستخدمين`,
        }
      }

      // 4. Cybersecurity & Consumer Privacy
      if (
        lower.includes('security') ||
        lower.includes('privacy') ||
        lower.includes('hack') ||
        lower.includes('leak') ||
        lower.includes('patch') ||
        lower.includes('scam') ||
        lower.includes('vulnerability')
      ) {
        return {
          id: `${rawTitle}: Waspada Ancaman Keamanan Digital dan Langkah Perlindungan Praktis`,
          en: `${rawTitle}: Digital Security Insights and Essential Protective Measures for Users`,
          ar: `${rawTitle}: إرشادات الأمان الرقمي وتدابير الحماية الأساسية للمستخدمين`,
        }
      }

      // 5. General Tech News Fallback
      return {
        id: `${rawTitle}: Kabar Teknologi Terkini, Ringkasan Fitur, dan Implikasi Digital`,
        en: `${rawTitle}: Tech News Briefing, Key Highlights, and Digital Ecosystem Insights`,
        ar: `${rawTitle}: موجز الأخبار التقنية، أبرز الميزات، ورؤى المنظومة الرقمية`,
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

      // 6. Hikmah, Inner Peace, Character & Meaning of Life
      if (
        lower.includes('hikmah') ||
        lower.includes('peace') ||
        lower.includes('purpose') ||
        lower.includes('meaning') ||
        lower.includes('wisdom') ||
        lower.includes('character') ||
        lower.includes('soul') ||
        lower.includes('heart')
      ) {
        return {
          id: `${rawTitle}: Menemukan Ketenangan Batin, Hikmah Kehidupan, dan Kejernihan Akal Manusia`,
          en: `${rawTitle}: Discovering Inner Peace, Spiritual Wisdom, and the Clarity of Human Reason`,
          ar: `${rawTitle}: في طلب السكينة، حكمة الحياة، وبصيرة العقل الإنساني`,
        }
      }

      // 7. General Islamic Logic Fallback
      return {
        id: `${rawTitle}: Harmoni antara Akal Sehat, Realitas Objektif, dan Epistemologi Wahyu`,
        en: `${rawTitle}: Rational Harmony Between Human Reason, Objective Reality, and Divine Revelation`,
        ar: `${rawTitle}: التكامل بين صريح المعقول والواقع الموضوعي وبصائر الوحي الإلهي`,
      }
    }
  }
}
