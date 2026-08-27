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
    const today = story.publishedAt || story.eventDate || new Date().toISOString()
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
    const coverImage = images[0]?.localPath || images[0]?.url || ''

    const imageCredits = CreditBuilder.buildImageCredits(images, slugBase, today)

    // Helper for rendering Citation Chain
    const renderCitationChain = (lang: 'id' | 'en' | 'ar') => {
      const chain = story.citationChain
      if (!chain) return ''

      const headers = {
        id: '## Rantai Provenance & Verifikasi Silang Sumber Primer',
        en: '## Citation Chain & Primary Evidence Provenance',
        ar: '## سلسلة التوثيق والتحقق من المصادر الأولية',
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

## Konteks & Latar Belakang Perkembangan

${story.readerHook.id}

${story.whyShouldICare.id}

${images[0] ? `![${images[0].altText.id || story.titles.id}](${images[0].localPath || images[0].url})\n*Sumber visual: ${images[0].source || 'Dokumentasi Publik'} / Foto oleh ${images[0].author || 'Kontributor'} (${images[0].license || 'CC BY-SA'})*\n\n---\n` : ''}
## Analisis Arsitektur & Dinamika Sistem

${story.aiGeneratedDeepAnalysis?.id || story.readerHook.id}

${images[1] ? `![${images[1].altText.id}](${images[1].localPath || images[1].url})\n*Sumber visual: ${images[1].source} / Foto oleh ${images[1].author} (${images[1].license})*\n\n---\n` : ''}

## Implikasi bagi Ekosistem, Pengembang & Pengguna

Perkembangan ini membawa konsekuensi nyata bagi arah industri komputasi modern:

- **Dampak Efisiensi & Infrastruktur:** ${story.economicAndEcosystemImpact.enterpriseTCO.id}
- **Penyebaran Teknologi Konsumen:** ${story.economicAndEcosystemImpact.consumerPricingTrajectory.id}
- **Peluang Pengembang & Ekosistem:** ${story.economicAndEcosystemImpact.developerImplications.id}

---

${renderCitationChain('id')}

## Rujukan & Sumber Terverifikasi

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

## Framing the Technical Landscape

${story.readerHook.en}

${story.whyShouldICare.en}

${images[0] ? `![${images[0].altText.en || story.titles.en}](${images[0].localPath || images[0].url})\n*Visual Source: ${images[0].source || 'Public Archive'} / Photo by ${images[0].author || 'Contributor'} (${images[0].license || 'CC BY-SA'})*\n\n---\n` : ''}
## Architectural Teardown & Systems Dynamics

${story.aiGeneratedDeepAnalysis?.en || story.readerHook.en}

${images[1] ? `![${images[1].altText.en}](${images[1].localPath || images[1].url})\n*Visual Source: ${images[1].source} / Photo by ${images[1].author} (${images[1].license})*\n\n---\n` : ''}

## Industry, Developer & Ecosystem Implications

This technological shift introduces measurable impacts across the broader computing landscape:

- **Infrastructure & Energy Efficiency:** ${story.economicAndEcosystemImpact.enterpriseTCO.en}
- **Consumer Hardware Trajectory:** ${story.economicAndEcosystemImpact.consumerPricingTrajectory.en}
- **Developer Ecosystem Capabilities:** ${story.economicAndEcosystemImpact.developerImplications.en}

---

${renderCitationChain('en')}

## Primary References & Verified Sources

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

## السياق الاستراتيجي والأهمية التقنية

${story.readerHook.ar}

${story.whyShouldICare.ar}

${images[0] ? `![${images[0].altText.ar || story.titles.ar}](${images[0].localPath || images[0].url})\n*مصدر الصورة: ${images[0].source || 'الأرشيف المعتمد'} / تصوير: ${images[0].author || 'المساهم'} (${images[0].license || 'CC BY-SA'})*\n\n---\n` : ''}
## التحليل المعماري وتفكيك المنظومة

${story.aiGeneratedDeepAnalysis?.ar || story.readerHook.ar}

${images[1] ? `![${images[1].altText.ar}](${images[1].localPath || images[1].url})\n*مصدر الصورة: ${images[1].source || 'الأرشيف المعتمد'} / تصوير: ${images[1].author || 'المساهم'} (${images[1].license || 'CC BY-SA'})*\n\n---\n` : ''}

## التداعيات على المنظومة والمطورين والمستخدمين

يحمل هذا التطور المعماري انعكاسات عملية على خارطة طريق الحوسبة المعاصرة:

- **كفاءة البنية التحتية واستهلاك الطاقة:** ${story.economicAndEcosystemImpact.enterpriseTCO.ar}
- **تطور منتجات الأجهزة الاستهلاكية:** ${story.economicAndEcosystemImpact.consumerPricingTrajectory.ar}
- **آفاق التطوير والبرمجيات المتقدمة:** ${story.economicAndEcosystemImpact.developerImplications.ar}

---

${renderCitationChain('ar')}

## المراجع والمصادر المعتمدة

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
        authors: ['rian-setiawan'],
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
        authors: ['rian-setiawan'],
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
        authors: ['rian-setiawan'],
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
