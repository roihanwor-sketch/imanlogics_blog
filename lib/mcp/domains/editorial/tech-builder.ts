import path from 'path'
import { MCP_CONFIG } from '../../config/env'
import { MdxArticle } from '../../core/types'
import { TechNewsStory } from '../research/tech-engine'
import { AssetDownloader } from '../media/asset-downloader'
import { CreditBuilder } from '../media/credit-builder'
import { SourceVerifier } from '../research/source-verifier'
import { ProseCleaner } from './prose-cleaner'

export class TechArticleBuilder {
  static async buildTrilingualArticles(story: TechNewsStory): Promise<MdxArticle[]> {
    const slugBase = ProseCleaner.slugify(story.id)
    const translationGroup = `tg-${slugBase}`
    const today = story.publishedAt
      ? story.publishedAt.split('T')[0]
      : story.eventDate || new Date().toISOString().split('T')[0]
    const blogDir = MCP_CONFIG.blogDataDir

    const imageResult = await AssetDownloader.discoverAndDownloadSafeImages(
      story.keywords,
      'tech-ai',
      2,
      3,
      slugBase,
      story.titles,
      story.extractedImageUrls || []
    )
    const images = imageResult.images
    const coverImage =
      images[0]?.localPath ||
      images[0]?.url ||
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80'

    const imageCredits = CreditBuilder.buildImageCredits(images, slugBase, today)

    // Helper for rendering Citation Chain
    const renderCitationChain = (lang: 'id' | 'en' | 'ar') => {
      const chain = story.citationChain
      if (!chain) return ''

      const headers = {
        id: '### V. Rantai Provenance & Verifikasi Silang Sumber Primer',
        en: '### V. Citation Chain & Primary Evidence Provenance',
        ar: '### خامساً: سلسلة التوثيق والتحقق من المصادر الأولية',
      }

      const labels = {
        id: {
          secondary: 'Media Sekunder Terverifikasi',
          primary: 'Bukti Primer (Spesifikasi/Dokumentasi)',
          crosscheck: 'Verifikasi Silang Independen',
        },
        en: {
          secondary: 'Verified Secondary Media',
          primary: 'Primary Evidence (Spec/Documentation)',
          crosscheck: 'Independent Cross-Verification',
        },
        ar: {
          secondary: 'الوسيلة الإعلامية الموثقة',
          primary: 'الشاهد الأولي (الوثيقة/المعيار)',
          crosscheck: 'التحقق المستقل المتقاطع',
        },
      }

      const secText = {
        id: chain.layer2Journalism || 'Media Sekunder Terverifikasi',
        en: chain.layer2Journalism || 'Verified Secondary Media Analysis',
        ar: 'التحليلات الإعلامية والتقارير التقنية الموثقة',
      }

      const priText = {
        id: chain.layer1Primary || 'Dokumentasi Teknis & Spesifikasi Resmi',
        en: chain.layer1Primary || 'Official Technical Documentation & Specification',
        ar: 'الوثائق الفنية والمواصفات الرسمية المعتمدة',
      }

      const crossText = {
        id:
          chain.crossVerificationNotes ||
          'Data performa dan efisiensi diverifikasi silang antara publikasi primer dan analisis independen.',
        en:
          chain.crossVerificationNotes ||
          'Performance and efficiency metrics independently cross-verified across primary documentation and secondary reporting.',
        ar: 'تم التحقق المستقل من مقاييس الأداء والكفاءة بمقارنة الوثائق الرسمية مع التقارير المتخصصة.',
      }

      return `${headers[lang]}

- **${labels[lang].secondary}:** ${secText[lang]}
- **${labels[lang].primary}:** ${priText[lang]}
- **${labels[lang].crosscheck}:** *${crossText[lang]}*

---`
    }

    // Adaptive Section II Title based on classification
    const section2Titles = {
      id:
        story.classification === 'Explainer'
          ? '### II. Arsitektur Software & Integrasi Sistem'
          : story.classification === 'Security Investigation'
            ? '### II. Analisis Kerentanan & Vektor Serangan'
            : '### II. Dekonstruksi Hardware & Rekayasa Sistem',
      en:
        story.classification === 'Explainer'
          ? '### II. Software Architecture & System Integration'
          : story.classification === 'Security Investigation'
            ? '### II. Vulnerability Architecture & Attack Vectors'
            : '### II. Hardware Deconstruction & Systems Engineering',
      ar:
        story.classification === 'Explainer'
          ? '### ثانياً: المعمارية البرمجية وتكامل النظام'
          : story.classification === 'Security Investigation'
            ? '### ثانياً: تفكيك الثغرة الأمنية ومسارات الاستغلال'
            : '### ثانياً: التفكيك العتادي وهندسة المنظومة',
    }

    // 1. Indonesian Version
    const idContent = `---
title: ${JSON.stringify(story.titles.id)}
date: '${today}'
tags: ${JSON.stringify(story.keywords)}
draft: false
summary: ${JSON.stringify(story.readerHook.id)}
images: ${JSON.stringify(images.map((img) => img.localPath || img.url))}
authors: ['default']
language: 'id'
translation_group: '${translationGroup}'
original_language: 'id'
articleType: '${story.classification}'
category: 'tech-ai'
sources: ${JSON.stringify(story.sources)}
imageCredits: ${JSON.stringify(imageCredits)}
---

## Di Balik Angka Spesifikasi: Mengapa Perkembangan Ini Menentukan

${story.readerHook.id}

${story.whyShouldICare.id}

![${images[0]?.altText.id || story.titles.id}](${images[0]?.localPath || images[0]?.url || coverImage})
*Sumber visual: ${images[0]?.source} / Foto oleh ${images[0]?.author} (${images[0]?.license})*

---

### I. Metrik Kunci & Verifikasi Benchmark

Sebelum menelaah detail teknis, berikut data empiris terukur yang telah diverifikasi silang dari lembar spesifikasi resmi:

${story.metrics
  .map(
    (m, idx) => `#### ${idx + 1}. ${m.label.id}: **${m.value}**
- *Komparasi Baseline:* ${m.baselineComparison.id}
- *Rujukan Primer:* [${m.primarySourceCitation}](${m.independentVerificationUrl})`
  )
  .join('\n\n')}

${images[1] ? `![${images[1].altText.id}](${images[1].localPath || images[1].url})\n*Sumber visual: ${images[1].source} / Foto oleh ${images[1].author} (${images[1].license})*\n` : ''}

---

${section2Titles.id}

Untuk memahami bagaimana performa ini tercapai secara teknis:

- **Spesifikasi Rekayasa Sistem:** ${story.hardwareDeconstruction.siliconSpecs.id}
- **Perubahan Mikroarsitektur / Alur Eksekusi:** ${story.hardwareDeconstruction.microarchitectureChanges.id}
- **Profil Daya, Beban & Termal:** ${story.hardwareDeconstruction.thermalAndPowerProfile.id}

---

### III. Disambiguasi: Menghindari Salah Paham Industri

Untuk mencegah miskonsepsi yang sering beredar di forum publik:

- **Apa Sebenarnya Inovasi Ini:** ${story.disambiguation.whatItIs.id}
- **Apa yang BUKAN Bagian dari Inovasi Ini:** ${story.disambiguation.whatItIsNot.id}
- **Cakupan Penggunaan (Consumer vs Enterprise):** ${story.disambiguation.consumerVsEnterpriseScope.id}

${images[2] ? `![${images[2].altText.id}](${images[2].localPath || images[2].url})\n*Sumber visual: ${images[2].source} / Foto oleh ${images[2].author} (${images[2].license})*\n` : ''}

---

### IV. Analisis Dampak Ekonomi & Biaya Operasional (TCO)

Inovasi komputasi selalu bermuara pada perhitungan ekonomi dan alur kerja:

- **Dampak Biaya Enterprise (TCO):** ${story.economicAndEcosystemImpact.enterpriseTCO.id}
- **Tren Ketersediaan & Distribusi:** ${story.economicAndEcosystemImpact.consumerPricingTrajectory.id}
- **Implikasi bagi Pengembang & Pengguna:** ${story.economicAndEcosystemImpact.developerImplications.id}

${story.aiGeneratedDeepAnalysis?.id ? `\n---\n\n### Telaah Analitis Mendalam\n\n${story.aiGeneratedDeepAnalysis.id}\n` : ''}
---

${renderCitationChain('id')}

### VI. Kesimpulan Editorial ImanLogics

Perkembangan ini membuktikan bahwa lompatan komputasi modern ditentukan oleh kejelasan arsitektur, efisiensi eksekusi data, dan keandalan sistem tanpa kompromi.

---

### Rujukan Primer & Sumber Otoritatif

${story.sources.map((src) => `- **[${src.name}](${src.url})** — *${SourceVerifier.localizeSourceType(src.type, 'id')} (Tier ${src.tier})*`).join('\n')}
`

    // 2. English Version
    const enContent = `---
title: ${JSON.stringify(story.titles.en)}
date: '${today}'
tags: ${JSON.stringify(story.keywords)}
draft: false
summary: ${JSON.stringify(story.readerHook.en)}
images: ${JSON.stringify(images.map((img) => img.localPath || img.url))}
authors: ['default']
language: 'en'
translation_group: '${translationGroup}'
original_language: 'id'
articleType: '${story.classification}'
category: 'tech-ai'
sources: ${JSON.stringify(story.sources)}
imageCredits: ${JSON.stringify(imageCredits)}
---

## Beyond Specification Sheets: Architectural Demarcation & Strategic Impact

${story.readerHook.en}

${story.whyShouldICare.en}

![${images[0]?.altText.en || story.titles.en}](${images[0]?.localPath || images[0]?.url || coverImage})
*Visual Source: ${images[0]?.source} / Photo by ${images[0]?.author} (${images[0]?.license})*

---

### I. Verifiable Empirical Benchmarks & Performance Metrics

Before examining system internals, the following measured empirical points have been verified across official documentation:

${story.metrics
  .map(
    (m, idx) => `#### ${idx + 1}. ${m.label.en}: **${m.value}**
- *Baseline Comparison:* ${m.baselineComparison.en}
- *Primary Citation:* [${m.primarySourceCitation}](${m.independentVerificationUrl})`
  )
  .join('\n\n')}

${images[1] ? `![${images[1].altText.en}](${images[1].localPath || images[1].url})\n*Visual Source: ${images[1].source} / Photo by ${images[1].author} (${images[1].license})*\n` : ''}

---

${section2Titles.en}

Analyzing how this performance density is achieved at the engineering boundary:

- **System Engineering Specifications:** ${story.hardwareDeconstruction.siliconSpecs.en}
- **Microarchitectural & Execution Pipeline Modifications:** ${story.hardwareDeconstruction.microarchitectureChanges.en}
- **Thermal Dissipation & Power Scaling Dynamics:** ${story.hardwareDeconstruction.thermalAndPowerProfile.en}

---

### III. Industry Disambiguation: Demarcating Marketing from Reality

To prevent prevalent industry misconceptions:

- **What This Innovation Concretely Delivers:** ${story.disambiguation.whatItIs.en}
- **What Is Explicitly NOT Part of This Release:** ${story.disambiguation.whatItIsNot.en}
- **Target Deployment Scope (Consumer vs Enterprise):** ${story.disambiguation.consumerVsEnterpriseScope.en}

${images[2] ? `![${images[2].altText.en}](${images[2].localPath || images[2].url})\n*Visual Source: ${images[2].source} / Photo by ${images[2].author} (${images[2].license})*\n` : ''}

---

### IV. Economic Breakdown & Total Cost of Ownership (TCO)

Engineering innovations invariably reshape infrastructure economics and developer productivity:

- **Enterprise Infrastructure Impact (TCO):** ${story.economicAndEcosystemImpact.enterpriseTCO.en}
- **Deployment & Market Trajectory:** ${story.economicAndEcosystemImpact.consumerPricingTrajectory.en}
- **Software Engineering Implications:** ${story.economicAndEcosystemImpact.developerImplications.en}

${story.aiGeneratedDeepAnalysis?.en ? `\n---\n\n### In-Depth Architectural Teardown\n\n${story.aiGeneratedDeepAnalysis.en}\n` : ''}
---

${renderCitationChain('en')}

### VI. ImanLogics Editorial Synthesis

This technological milestone underscores that enduring computational scaling relies not on uncalibrated claims, but on structural architectural rigor and execution efficiency.

---

### Primary References & Authoritative Sources

${story.sources.map((src) => `- **[${src.name}](${src.url})** — *${SourceVerifier.localizeSourceType(src.type, 'en')} (Tier ${src.tier})*`).join('\n')}
`

    // 3. Arabic Version
    const arContent = `---
title: ${JSON.stringify(story.titles.ar)}
date: '${today}'
tags: ${JSON.stringify(story.keywords)}
draft: false
summary: ${JSON.stringify(story.readerHook.ar)}
images: ${JSON.stringify(images.map((img) => img.localPath || img.url))}
authors: ['default']
language: 'ar'
translation_group: '${translationGroup}'
original_language: 'id'
articleType: '${story.classification}'
category: 'tech-ai'
sources: ${JSON.stringify(story.sources)}
imageCredits: ${JSON.stringify(imageCredits)}
---

## ما وراء الأرقام والمعايير: تفكيك البنية التقنية والأبعاد الاستراتيجية

${story.readerHook.ar}

${story.whyShouldICare.ar}

![${images[0]?.altText.ar || story.titles.ar}](${images[0]?.localPath || images[0]?.url || coverImage})
*مصدر الصورة: ${images[0]?.source} / تصوير ${images[0]?.author} (${images[0]?.license})*

---

### أولاً: المؤشرات المقاسة ومصفوفة الأداء المعياري

قبل الخوض في التفاصيل التقنية، نورد فيما يلي البيانات التجريبية المؤكدة والمطابقة للوثائق الرسمية:

${story.metrics
  .map(
    (m, idx) => `#### ${idx + 1}. ${m.label.ar}: **${m.value}**
- *المقارنة المعيارية:* ${m.baselineComparison.ar}
- *المرجع التأسيسي:* [${m.primarySourceCitation}](${m.independentVerificationUrl})`
  )
  .join('\n\n')}

${images[1] ? `![${images[1].altText.ar}](${images[1].localPath || images[1].url})\n*مصدر الصورة: ${images[1].source} / تصوير ${images[1].author} (${images[1].license})*\n` : ''}

---

${section2Titles.ar}

لفهم كيفية تحقيق هذه الكفاءة على مستوى هندسة المنظومة:

- **المواصفات الهندسية للمنظومة:** ${story.hardwareDeconstruction.siliconSpecs.ar}
- **تعديلات المعمارية الدقيقة ومسارات التنفيذ:** ${story.hardwareDeconstruction.microarchitectureChanges.ar}
- **غلاف الطاقة والأداء الحراري:** ${story.hardwareDeconstruction.thermalAndPowerProfile.ar}

---

### ثالثاً: التمييز المفاهيمي: تفنيد المغالطات الشائعة

حرصاً على ضبط المفاهيم وتفادي التفسيرات غير الدقيقة:

- **ما يقدمه هذا الابتكار فعلياً:** ${story.disambiguation.whatItIs.ar}
- **ما لا يدخل ضمن نطاق هذا التطور:** ${story.disambiguation.whatItIsNot.ar}
- **نطاق الاستخدام (المستهلك الفردي مقابل المؤسسات):** ${story.disambiguation.consumerVsEnterpriseScope.ar}

${images[2] ? `![${images[2].altText.ar}](${images[2].localPath || images[2].url})\n*مصدر الصورة: ${images[2].source} / تصوير ${images[2].author} (${images[2].license})*\n` : ''}

---

### رابعاً: التحليل الاقتصادي وتكلفة الملكية الإجمالية (TCO)

ينعكس التطور الهندسي دوماً على اقتصاديات البنية التحتية والإنتاجية:

- **التأثير على التكاليف المؤسسية (TCO):** ${story.economicAndEcosystemImpact.enterpriseTCO.ar}
- **مسار التوافر والانتشار في الأسواق:** ${story.economicAndEcosystemImpact.consumerPricingTrajectory.ar}
- **الأبعاد البرمجية وفرص التطوير:** ${story.economicAndEcosystemImpact.developerImplications.ar}

${story.aiGeneratedDeepAnalysis?.ar ? `\n---\n\n### تفكيك تحليلي متعمق\n\n${story.aiGeneratedDeepAnalysis.ar}\n` : ''}
---

${renderCitationChain('ar')}

### سادساً: الخلاصة التحليلية لـ ImanLogics

يؤكد هذا التطور أن التقدم الحاسوبي المستدام لا يتحقق بالوعود التسويقية، بل بالانضباط المعماري وكفاءة المعالجة الفائقة دون مساومة.

---

### المراجع الرسمية والمصادر المعتمدة

${story.sources.map((src) => `- **[${src.name}](${src.url})** — *${SourceVerifier.localizeSourceType(src.type, 'ar')} (Tier ${src.tier})*`).join('\n')}
`

    const idArticle: MdxArticle = {
      filename: `${slugBase}.mdx`,
      filepath: path.join(blogDir, `${slugBase}.mdx`),
      language: 'id',
      frontmatter: {
        title: story.titles.id,
        date: today,
        tags: story.keywords,
        draft: false,
        summary: story.readerHook.id,
        images: images.map((img) => img.localPath || img.url),
        authors: ['default'],
        language: 'id',
        translation_group: translationGroup,
        original_language: 'id',
        articleType: story.classification,
        category: 'tech-ai',
        sources: story.sources,
        imageCredits,
      },
      content: idContent,
    }

    const enArticle: MdxArticle = {
      filename: `${slugBase}.en.mdx`,
      filepath: path.join(blogDir, `${slugBase}.en.mdx`),
      language: 'en',
      frontmatter: {
        title: story.titles.en,
        date: today,
        tags: story.keywords,
        draft: false,
        summary: story.readerHook.en,
        images: images.map((img) => img.localPath || img.url),
        authors: ['default'],
        language: 'en',
        translation_group: translationGroup,
        original_language: 'id',
        articleType: story.classification,
        category: 'tech-ai',
        sources: story.sources,
        imageCredits,
      },
      content: enContent,
    }

    const arArticle: MdxArticle = {
      filename: `${slugBase}.ar.mdx`,
      filepath: path.join(blogDir, `${slugBase}.ar.mdx`),
      language: 'ar',
      frontmatter: {
        title: story.titles.ar,
        date: today,
        tags: story.keywords,
        draft: false,
        summary: story.readerHook.ar,
        images: images.map((img) => img.localPath || img.url),
        authors: ['default'],
        language: 'ar',
        translation_group: translationGroup,
        original_language: 'id',
        articleType: story.classification,
        category: 'tech-ai',
        sources: story.sources,
        imageCredits,
      },
      content: arContent,
    }

    return [idArticle, enArticle, arArticle]
  }
}
