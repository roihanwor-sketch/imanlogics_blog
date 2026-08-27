import path from 'path'
import { MCP_CONFIG } from '../../config/env'
import { MdxArticle } from '../../core/types'
import { IslamicAcademicStory } from '../research/islamic-engine'
import { AssetDownloader } from '../media/asset-downloader'
import { CreditBuilder } from '../media/credit-builder'
import { SourceVerifier } from '../research/source-verifier'
import { ProseCleaner } from './prose-cleaner'

export class IslamicArticleBuilder {
  static async buildTrilingualArticles(story: IslamicAcademicStory): Promise<MdxArticle[]> {
    const slugBase = ProseCleaner.slugify(story.id)
    const translationGroup = `tg-${slugBase}`
    const today = story.publishedAt || story.eventDate || new Date().toISOString()
    const blogDir = MCP_CONFIG.blogDataDir

    const imageResult = await AssetDownloader.discoverAndDownloadSafeImages(
      story.keywords,
      'islamic-logic',
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
      '/static/images/editorial/birmingham-quran-radiocarbon-analysis/figure-1.jpg'

    const imageCredits = CreditBuilder.buildImageCredits(images, slugBase, today)

    // Helper for formatting Epistemological Matrix
    const renderEpistemology = (lang: 'id' | 'en' | 'ar') => {
      const points = story.epistemologicalPoints || story.epistemologicalMatrix || []
      if (points.length === 0) return ''

      const headers = {
        id: '### V. Matriks Bukti & Batasan Epistemologis (Demarkasi Ilmiah)',
        en: '### V. Evidence Matrix & Epistemological Demarcation',
        ar: '### خامساً: مصفوفة الشواهد والحدود المعرفية (الفرز الإبستمولوجي)',
      }

      const srcLabels = {
        id: 'Sumber',
        en: 'Source',
        ar: 'المصدر',
      }

      const rows = points
        .map((p) => {
          const categoryBadge = `**[${p.category}]**`
          const stmt = p.statement[lang]
          const srcList = p.sources.map((s) => `[${s.name}](${s.url})`).join(', ')
          return `- ${categoryBadge} ${stmt} *(${srcLabels[lang]}: ${srcList})*`
        })
        .join('\n\n')

      return `${headers[lang]}\n\n${rows}\n\n---`
    }

    // Helper for rendering Citation Chain
    const renderCitationChain = (lang: 'id' | 'en' | 'ar') => {
      const chain = story.citationChain
      if (!chain) return ''

      const headers = {
        id: '### VI. Rantai Provenance & Verifikasi Silang Sumber Primer',
        en: '### VI. Citation Chain & Primary Evidence Provenance',
        ar: '### سادساً: سلسلة التوثيق والتحقق من المصادر الأولية',
      }

      const labels = {
        id: {
          secondary: 'Kajian / Media Sekunder Terverifikasi',
          primary: 'Bukti Primer (Tafsir / Manuskrip / Naskah Teks)',
          crosscheck: 'Verifikasi Silang Independen',
        },
        en: {
          secondary: 'Verified Secondary Study / Media',
          primary: 'Primary Evidence (Tafsir / Manuscript / Textual Corpus)',
          crosscheck: 'Independent Cross-Verification',
        },
        ar: {
          secondary: 'الدراسة / الوسيلة الموثقة',
          primary: 'الشاهد الأولي (التفسير / المخطوط / النص الأصلي)',
          crosscheck: 'التحقق المستقل المتقاطع',
        },
      }

      const secText = {
        id: chain.layer2Journalism || 'Kajian Akademis & Rujukan Jurnal Berkala',
        en: 'Peer-Reviewed Journal & Academic Study Review',
        ar: 'المراجعات الأكاديمية والدوريات العلمية المحكمة',
      }

      const priText = {
        id: chain.layer1Primary || "Korpus Al-Qur'an, Tafsir Klasik & Naskah Manuskrip",
        en: "Qur'anic Corpus, Classical Exegesis & Ancient Manuscripts",
        ar: 'النصوص القرآنية والتفاسير المعتمدة والمخطوطات التأسيسية',
      }

      const crossText = {
        id: 'Analisis teks diverifikasi silang antara naskah rujukan primer dan publikasi ilmiah.',
        en: 'Textual analysis independently cross-verified across primary records and academic scholarship.',
        ar: 'تم التحقق من التحليل النصي بمقارنة الشواهد التأسيسية مع الأبحاث الأكاديمية.',
      }

      return `${headers[lang]}

- **${labels[lang].secondary}:** ${secText[lang]}
- **${labels[lang].primary}:** ${priText[lang]}
- **${labels[lang].crosscheck}:** *${crossText[lang]}*

---`
    }

    const narrativeHook = story.narrativeLead?.hook || story.narrativeHook || story.readerHook
    const historicalContext = story.narrativeLead?.historicalContext || story.whyShouldICare
    const scholarlyConsensus = story.narrativeLead?.scholarlyConsensus || story.whyShouldICare
    const whatItProves = story.honestBoundaries?.whatItProves ||
      story.whatThisDoesAndDoesntProve || {
        id: 'APA YANG TERBUKTI: Keselarasan rasional antara wahyu dan bukti tekstual objektif.',
        en: 'WHAT IT PROVES: Rational coherence between revelation and objective textual evidence.',
        ar: 'ما يثبته البحث: التوافق العقلاني بين الوحي والشواهد النصية الموضوعية.',
      }
    const whatMustNotBeClaimed = story.honestBoundaries?.whatMustNotBeClaimed || {
      id: 'APA YANG TIDAK BOLEH DIKLAIM: Penafsiran manusia tidak boleh dipaksakan sebagai doktrin mutlak tanpa dalil yang kokoh.',
      en: 'WHAT MUST NOT BE CLAIMED: Human interpretations must not be overstated as absolute dogmas without firm evidence.',
      ar: 'ما لا يجوز ادعاؤه: عدم فرض الاجتهادات البشرية كعقائد قطعية دون أدلة محكمة.',
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
articleType: '${story.classification || 'Reader-First Inquiry'}'
category: 'islamic-logic'
sources: ${JSON.stringify(story.sources)}
imageCredits: ${JSON.stringify(imageCredits)}
---

## Menelusuri Pokok Masalah & Relevansi Kontemporer

${narrativeHook.id}

${story.readerHook.id}

${story.whyShouldICare.id}

![${images[0]?.altText.id || story.titles.id}](${images[0]?.localPath || images[0]?.url || coverImage})
*Sumber visual: ${images[0]?.source || 'Arsip Otentik'} / Foto oleh ${images[0]?.author || 'Kontributor'} (${images[0]?.license || 'CC BY-SA'})*

---

## Rekonstruksi Historis & Konteks Dalil Primer

${historicalContext.id}

${images[1] ? `![${images[1].altText.id}](${images[1].localPath || images[1].url})\n*Sumber visual: ${images[1].source} / Foto oleh ${images[1].author} (${images[1].license})*\n` : ''}

---

## Konsensus Akademik & Telaah Kritis Multidimensi

${scholarlyConsensus.id}

${images[2] ? `![${images[2].altText.id}](${images[2].localPath || images[2].url})\n*Sumber visual: ${images[2].source} / Foto oleh ${images[2].author} (${images[2].license})*\n` : ''}

${story.aiGeneratedDeepAnalysis?.id ? `\n---\n\n## Telaah Analisis & Refleksi Filosofis Mendalam\n\n${story.aiGeneratedDeepAnalysis.id}\n` : ''}
---

${renderEpistemology('id')}

${renderCitationChain('id')}

## Batasan Intelektual: Apa yang Terbukti—dan Apa yang Tidak

Sebuah telaah yang bermartabat harus berani menarik batas tegas antara data empiris dan kesimpulan iman:

- **${whatItProves.id}**
- **${whatMustNotBeClaimed.id}**

---

## Rujukan Akademik & Sumber Otoritatif

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
articleType: '${story.classification || 'Reader-First Inquiry'}'
category: 'islamic-logic'
sources: ${JSON.stringify(story.sources)}
imageCredits: ${JSON.stringify(imageCredits)}
---

## Framing the Inquiry & Contemporary Relevance

${narrativeHook.en}

${story.readerHook.en}

${story.whyShouldICare.en}

![${images[0]?.altText.en || story.titles.en}](${images[0]?.localPath || images[0]?.url || coverImage})
*Visual Source: ${images[0]?.source || 'Authentic Archive'} / Photo by ${images[0]?.author || 'Contributor'} (${images[0]?.license || 'CC BY-SA'})*

---

## Textual Reconstruction & Primary Context

${historicalContext.en}

${images[1] ? `![${images[1].altText.en}](${images[1].localPath || images[1].url})\n*Visual Source: ${images[1].source} / Photo by ${images[1].author} (${images[1].license})*\n` : ''}

---

## Scholarly Consensus & Multidimensional Rigor

${scholarlyConsensus.en}

${images[2] ? `![${images[2].altText.en}](${images[2].localPath || images[2].url})\n*Visual Source: ${images[2].source} / Photo by ${images[2].author} (${images[2].license})*\n` : ''}

${story.aiGeneratedDeepAnalysis?.en ? `\n---\n\n## In-Depth Scholarly Teardown & Philosophical Reflection\n\n${story.aiGeneratedDeepAnalysis.en}\n` : ''}
---

${renderEpistemology('en')}

${renderCitationChain('en')}

## Intellectual Boundaries: What This Does—and Doesn't—Prove

A rigorous inquiry must maintain strict demarcation between empirical data and theological interpretation:

- **${whatItProves.en}**
- **${whatMustNotBeClaimed.en}**

---

## Primary References & Scholarly Sources

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
articleType: '${story.classification || 'Reader-First Inquiry'}'
category: 'islamic-logic'
sources: ${JSON.stringify(story.sources)}
imageCredits: ${JSON.stringify(imageCredits)}
---

## تأطير القضية والصلة المعاصرة

${narrativeHook.ar}

${story.readerHook.ar}

${story.whyShouldICare.ar}

![${images[0]?.altText.ar || story.titles.ar}](${images[0]?.localPath || images[0]?.url || coverImage})
*مصدر الصورة: ${images[0]?.source || 'الأرشيف المعتمد'} / تصوير: ${images[0]?.author || 'المساهم'} (${images[0]?.license || 'CC BY-SA'})*

---

## إعادة البناء التاريخي وسياق النصوص التأسيسية

${historicalContext.ar}

${images[1] ? `![${images[1].altText.ar}](${images[1].localPath || images[1].url})\n*مصدر الصورة: ${images[1].source} / تصوير: ${images[1].author} (${images[1].license})*\n` : ''}

---

## الإجماع العلمي والتحقيق المنهجي المتعدد الأبعاد

${scholarlyConsensus.ar}

${images[2] ? `![${images[2].altText.ar}](${images[2].localPath || images[2].url})\n*مصدر الصورة: ${images[2].source} / تصوير: ${images[2].author} (${images[2].license})*\n` : ''}

${story.aiGeneratedDeepAnalysis?.ar ? `\n---\n\n## التحليل المنهجي والتفكيك الفلسفي المعمق\n\n${story.aiGeneratedDeepAnalysis.ar}\n` : ''}
---

${renderEpistemology('ar')}

${renderCitationChain('ar')}

## الحدود المعرفية: ما يثبته البحث وما لا يجوز ادعاؤه

تقتضي الأمانة العلمية رسم حدود صارمة بين الشواهد المادية والمسلمات الإيمانية:

- **${whatItProves.ar}**
- **${whatMustNotBeClaimed.ar}**

---

## المراجع الأكاديمية والمصادر المعتمدة

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
        authors: ['fauzan-hakim'],
        language: 'id',
        translation_group: translationGroup,
        original_language: 'id',
        articleType: story.classification || 'Reader-First Inquiry',
        category: 'islamic-logic',
        sources: story.sources,
        imageCredits: imageCredits,
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
        authors: ['fauzan-hakim'],
        language: 'en',
        translation_group: translationGroup,
        original_language: 'id',
        articleType: story.classification || 'Reader-First Inquiry',
        category: 'islamic-logic',
        sources: story.sources,
        imageCredits: imageCredits,
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
        authors: ['fauzan-hakim'],
        language: 'ar',
        translation_group: translationGroup,
        original_language: 'id',
        articleType: story.classification || 'Reader-First Inquiry',
        category: 'islamic-logic',
        sources: story.sources,
        imageCredits: imageCredits,
      },
      content: arContent,
    }

    return [idArticle, enArticle, arArticle]
  }
}
