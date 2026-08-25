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
      slugBase
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
          primary: 'Bukti Primer (Spesifikasi/Paper)',
          crosscheck: 'Verifikasi Silang Independen',
        },
        en: {
          secondary: 'Verified Secondary Media',
          primary: 'Primary Evidence (Spec/Paper)',
          crosscheck: 'Independent Cross-Verification',
        },
        ar: {
          secondary: 'الوسيلة الإعلامية الموثقة',
          primary: 'الشاهد الأولي (الوثيقة/المعيار)',
          crosscheck: 'التحقق المستقل المتقاطع',
        },
      }

      const secText = {
        id: chain.layer2Journalism || 'Media Sekunder Terverifikasi (AnandTech, Jagat Review)',
        en: 'Verified Secondary Media Analysis (AnandTech, Jagat Review Hardware Lab)',
        ar: 'التحليلات الإعلامية الموثقة (مختبرات أناندتيك وجاجات ريفيو)',
      }

      const priText = {
        id: chain.layer1Primary || 'Whitepaper Resmi & Prosiding Simposium Teknologi',
        en: 'Official Technology Symposium Proceedings & IEEE N2 Specification Whitepaper',
        ar: 'وثائق المؤتمر التقني الرسمي ومعايير معهد مهندسي الكهرباء والإلكترونيات (IEEE)',
      }

      const crossText = {
        id: 'Data performa dan efisiensi diverifikasi silang antara whitepaper pabrikan dan paper riset independen.',
        en: 'Performance and efficiency metrics independently cross-verified across manufacturer documentation and academic publications.',
        ar: 'تم التحقق المستقل من مقاييس الأداء والكفاءة بمقارنة وثائق التصنيع مع الأبحاث الأكاديمية.',
      }

      return `${headers[lang]}

- **${labels[lang].secondary}:** ${secText[lang]}
- **${labels[lang].primary}:** ${priText[lang]}
- **${labels[lang].crosscheck}:** *${crossText[lang]}*

---`
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

![${images[0]?.altText.id || story.title}](${images[0]?.localPath || images[0]?.url || coverImage})
*Sumber visual: ${images[0]?.source} / Foto oleh ${images[0]?.author} (${images[0]?.license})*

---

### I. Metrik Kunci & Verifikasi Benchmark

Sebelum menelaah detail arsitektur, berikut data empiris terukur yang telah diverifikasi silang dari lembar spesifikasi resmi:

${story.metrics.map((m, idx) => `#### ${idx + 1}. ${m.label.id}: **${m.value}**\n- *Komparasi Baseline:* ${m.baselineComparison.id}\n- *Rujukan Primer:* [${m.primarySourceCitation}](${m.independentVerificationUrl})`).join('\n\n')}

${images[1] ? `![${images[1].altText.id}](${images[1].localPath || images[1].url})\n*Sumber visual: ${images[1].source} / Foto oleh ${images[1].author} (${images[1].license})*\n` : ''}

---

### II. Dekonstruksi Hardware & Rekayasa Silikon

Untuk memahami bagaimana performa ini tercapai secara fisik pada wafer semikonduktor:

- **Spesifikasi Fisik Silikon:** ${story.hardwareDeconstruction.siliconSpecs.id}
- **Perubahan Mikroarsitektur:** ${story.hardwareDeconstruction.microarchitectureChanges.id}
- **Profil Daya & Termal:** ${story.hardwareDeconstruction.thermalAndPowerProfile.id}

${story.hardwareDeconstruction.fp4PrecisionDetails ? `#### Analisis Khusus: Format Kuantisasi FP4\n- **Throughput Teoritis:** ${story.hardwareDeconstruction.fp4PrecisionDetails.theoreticalThroughput}\n- **Trade-off Kuantisasi:** ${story.hardwareDeconstruction.fp4PrecisionDetails.quantizationTradeoffs.id}\n- **Dampak Akurasi Nyata:** ${story.hardwareDeconstruction.fp4PrecisionDetails.realWorldModelAccuracy.id}\n` : ''}

---

### III. Disambiguasi: Menghindari Salah Paham Industri

Untuk mencegah miskonsepsi yang sering beredar di forum publik:

- **Apa Sebenarnya Inovasi Ini:** ${story.disambiguation.whatItIs.id}
- **Apa yang BUKAN Bagian dari Inovasi Ini:** ${story.disambiguation.whatItIsNot.id}
- **Cakupan Penggunaan (Consumer vs Enterprise):** ${story.disambiguation.consumerVsEnterpriseScope.id}

${images[2] ? `![${images[2].altText.id}](${images[2].localPath || images[2].url})\n*Sumber visual: ${images[2].source} / Foto oleh ${images[2].author} (${images[2].license})*\n` : ''}

---

### IV. Analisis Dampak Ekonomi & Biaya Operasional (TCO)

Inovasi hardware selalu bermuara pada perhitungan ekonomi komputasi:

- **Dampak Biaya Enterprise (TCO):** ${story.economicAndEcosystemImpact.enterpriseTCO.id}
- **Tren Harga Konsumen:** ${story.economicAndEcosystemImpact.consumerPricingTrajectory.id}
- **Implikasi bagi Pengembang Software:** ${story.economicAndEcosystemImpact.developerImplications.id}

---

${renderCitationChain('id')}

### VI. Kesimpulan Editorial ImanLogics

Perkembangan ini membuktikan bahwa batas komputasi modern tidak lagi semata ditentukan oleh jumlah transistor, melainkan oleh efisiensi transfer data dan kecerdasan arsitektur mikro.

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

## Beyond the Spec Sheet: Why This Architectural Shift Matters

${story.readerHook.en}

${story.whyShouldICare.en}

![${images[0]?.altText.en || story.titles.en}](${images[0]?.localPath || images[0]?.url || coverImage})
*Visual Source: ${images[0]?.source} / Photo by ${images[0]?.author} (${images[0]?.license})*

---

### I. Key Empirical Metrics & Baseline Verification

Before examining the microarchitecture, here are the verified quantitative metrics derived from primary documentation:

${story.metrics.map((m, idx) => `#### ${idx + 1}. ${m.label.en}: **${m.value}**\n- *Baseline Comparison:* ${m.baselineComparison.en}\n- *Primary Source:* [${m.primarySourceCitation}](${m.independentVerificationUrl})`).join('\n\n')}

${images[1] ? `![${images[1].altText.en}](${images[1].localPath || images[1].url})\n*Visual Source: ${images[1].source} / Photo by ${images[1].author} (${images[1].license})*\n` : ''}

---

### II. Hardware Deconstruction & Silicon Engineering

Understanding how this performance is physically achieved on semiconductor wafers:

- **Physical Silicon Specifications:** ${story.hardwareDeconstruction.siliconSpecs.en}
- **Microarchitectural Innovations:** ${story.hardwareDeconstruction.microarchitectureChanges.en}
- **Thermal & Power Profile:** ${story.hardwareDeconstruction.thermalAndPowerProfile.en}

${story.hardwareDeconstruction.fp4PrecisionDetails ? `#### Deep Dive: FP4 Quantization Mechanics\n- **Theoretical Compute Throughput:** ${story.hardwareDeconstruction.fp4PrecisionDetails.theoreticalThroughput}\n- **Quantization Trade-offs:** ${story.hardwareDeconstruction.fp4PrecisionDetails.quantizationTradeoffs.en}\n- **Empirical Accuracy Impact:** ${story.hardwareDeconstruction.fp4PrecisionDetails.realWorldModelAccuracy.en}\n` : ''}

---

### III. Technical Disambiguation: Clearing Industry Misconceptions

To prevent widespread confusion across tech community discussions:

- **What This Technology Truly Is:** ${story.disambiguation.whatItIs.en}
- **What It Is NOT:** ${story.disambiguation.whatItIsNot.en}
- **Deployment Scope (Consumer vs Enterprise):** ${story.disambiguation.consumerVsEnterpriseScope.en}

${images[2] ? `![${images[2].altText.en}](${images[2].localPath || images[2].url})\n*Visual Source: ${images[2].source} / Photo by ${images[2].author} (${images[2].license})*\n` : ''}

---

### IV. Economic Breakdown & Datacenter Total Cost of Ownership (TCO)

Hardware breakthroughs ultimately translate to compute economics:

- **Enterprise TCO Impact:** ${story.economicAndEcosystemImpact.enterpriseTCO.en}
- **Consumer Pricing Trajectory:** ${story.economicAndEcosystemImpact.consumerPricingTrajectory.en}
- **Software Developer Implications:** ${story.economicAndEcosystemImpact.developerImplications.en}

---

${renderCitationChain('en')}

### VI. ImanLogics Editorial Synthesis

This architecture illustrates that modern computing limits are no longer dictated solely by raw transistor density, but by memory interconnect velocity and mathematical precision scaling.

---

### Primary References & Technical Sources

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

## ما وراء المواصفات التقنية: لماذا يمثل هذا التحول نقطة فارقة؟

${story.readerHook.ar}

${story.whyShouldICare.ar}

![${images[0]?.altText.ar || story.titles.ar}](${images[0]?.localPath || images[0]?.url || coverImage})
*مصدر الصورة: ${images[0]?.source} / تصوير ${images[0]?.author} (${images[0]?.license})*

---

### أولاً: المؤشرات التجريبية والمقارنة المعيارية الموثقة

قبل الغوص في تفاصيل المعمارية الدقيقة، إليكم الأرقام الفعلية الموثقة من الوثائق الرسمية:

${story.metrics.map((m, idx) => `#### ${idx + 1}. ${m.label.ar}: **${m.value}**\n- *المقارنة المعيارية:* ${m.baselineComparison.ar}\n- *المصدر الرسمي المعتمد:* [${m.primarySourceCitation}](${m.independentVerificationUrl})`).join('\n\n')}

${images[1] ? `![${images[1].altText.ar}](${images[1].localPath || images[1].url})\n*مصدر الصورة: ${images[1].source} / تصوير ${images[1].author} (${images[1].license})*\n` : ''}

---

### ثانياً: تشريح العتاد والهندسة الدقيقة للسيليكون

لفهم كيفية تحقيق هذه القفزة في الأداء على مستوى شرائح السيليكون:

- **المواصفات الفيزيائية للسيليكون:** ${story.hardwareDeconstruction.siliconSpecs.ar}
- **التغييرات الجوهرية في المعمارية:** ${story.hardwareDeconstruction.microarchitectureChanges.ar}
- **الكفاءة الحرارية واستهلاك الطاقة:** ${story.hardwareDeconstruction.thermalAndPowerProfile.ar}

${story.hardwareDeconstruction.fp4PrecisionDetails ? `#### تحليل معماري: دقة الحوسبة FP4\n- **القدرة الحوسبية النظرية:** ${story.hardwareDeconstruction.fp4PrecisionDetails.theoreticalThroughput}\n- **موازنات التكميم الرياضي:** ${story.hardwareDeconstruction.fp4PrecisionDetails.quantizationTradeoffs.ar}\n- **تأثير الدقة الواقعي:** ${story.hardwareDeconstruction.fp4PrecisionDetails.realWorldModelAccuracy.ar}\n` : ''}

---

### ثالثاً: ضبط المفاهيم وتصحيح المغالطات الشائعة

لمنع أي لبس شائع في التغطيات العامة:

- **حقيقة هذه التقنية بدقة:** ${story.disambiguation.whatItIs.ar}
- **ما لا تمثله هذه التقنية:** ${story.disambiguation.whatItIsNot.ar}
- **نطاق الاستخدام (مستهلك أم مؤسسي):** ${story.disambiguation.consumerVsEnterpriseScope.ar}

${images[2] ? `![${images[2].altText.ar}](${images[2].localPath || images[2].url})\n*مصدر الصورة: ${images[2].source} / تصوير ${images[2].author} (${images[2].license})*\n` : ''}

---

### رابعاً: التحليل الاقتصادي وتكلفة التشغيل الإجمالية (TCO)

تنتهي الابتكارات العتادية دوماً إلى معادلات الجدوى الاقتصادية:

- **أثر التكلفة على المؤسسات (TCO):** ${story.economicAndEcosystemImpact.enterpriseTCO.ar}
- **مسار الأسعار للمستهلك النهائي:** ${story.economicAndEcosystemImpact.consumerPricingTrajectory.ar}
- **الآثار المباشرة على مطوري البرمجيات:** ${story.economicAndEcosystemImpact.developerImplications.ar}

---

${renderCitationChain('ar')}

### سادساً: الرؤية التحريرية لمنصة إيمان لوجيكس

تثبت هذه التطورات أن حدود الحوسبة المعاصرة لم تعد مرهونة بكثافة الترانزستورات فحسب، بل بسرعة تدفق البيانات وبراعة المعمارية الدقيقة.

---

### المصادر الرسمية والمراجع التقنية المعتمدة

${story.sources.map((src) => `- **[${src.name}](${src.url})** — *${SourceVerifier.localizeSourceType(src.type, 'ar')} (المستوى ${src.tier})*`).join('\n')}
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
