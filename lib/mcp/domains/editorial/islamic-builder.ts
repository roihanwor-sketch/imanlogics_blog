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
    const today = story.eventDate || new Date().toISOString().split('T')[0]
    const blogDir = MCP_CONFIG.blogDataDir

    const imageResult = await AssetDownloader.discoverAndDownloadSafeImages(
      story.keywords,
      'islamic-logic',
      2,
      3,
      slugBase
    )
    const images = imageResult.images
    const coverImage =
      images[0]?.localPath ||
      images[0]?.url ||
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80'

    const imageCredits = CreditBuilder.buildImageCredits(images, slugBase, today)

    // Helper for formatting Epistemological Matrix
    const renderEpistemology = (lang: 'id' | 'en' | 'ar') => {
      const points = story.epistemologicalMatrix || []
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
articleType: '${story.editorialAngle}'
category: 'islamic-logic'
sources: ${JSON.stringify(story.sources)}
imageCredits: ${JSON.stringify(imageCredits)}
---

## Menelusuri Jejak Sejarah & Titik Temu Intelektual

${story.narrativeHook.id}

${story.readerHook.id}

${story.universalQuestion.id}

Di balik debu sejarah dan dialog keagamaan antar-zaman, telaah kritis terhadap naskah dan logika ibadah memberikan perspektif berharga tentang bagaimana manusia memahami hakikat ketundukan kepada Sang Pencipta.

![${images[0]?.altText.id || story.titles.id}](${images[0]?.localPath || images[0]?.url || coverImage})
*Sumber visual: ${images[0]?.source} / Foto oleh ${images[0]?.author} (${images[0]?.license})*

---

### I. Rekonstruksi Historis & Data Naskah Primer

${story.archaeologicalDetails.discoveryNarrative.id}

${story.archaeologicalDetails.caveAndManuscriptCount.id}

${story.archaeologicalDetails.radiocarbonAndPaleographyDating.id}

${images[1] ? `![${images[1].altText.id}](${images[1].localPath || images[1].url})\n*Sumber visual: ${images[1].source} / Foto oleh ${images[1].author} (${images[1].license})*\n` : ''}

---

### II. Teks Kunci & Lanskap Transmisi Naskah

${story.archaeologicalDetails.keyTexts.map((text, idx) => `#### ${idx + 1}. ${text.name.id} (${text.siglum})\n\n*Estimasi Tarikh:* ${text.dateEstimate.id}\n\n${text.description.id}`).join('\n\n')}

${story.archaeologicalDetails.textualLandscape.id}

---

### III. Perdebatan Akademik & Sanggahan (Counterarguments)

${story.scholarlyDebate.esseneHypothesis.id}

${story.scholarlyDebate.alternativeTheories.id}

${story.scholarlyDebate.scholarlyConsensusOrDispute.id}

${images[2] ? `![${images[2].altText.id}](${images[2].localPath || images[2].url})\n*Sumber visual: ${images[2].source} / Foto oleh ${images[2].author} (${images[2].license})*\n` : ''}

---

### IV. Presisi Konseptual: Monoteisme, Nubuat, dan Ibadah

${story.definitionalDistinction.monotheismVsTawhid.id}

${story.definitionalDistinction.messianicExpectationsVsPropheticLineage.id}

${story.definitionalDistinction.halakhicLegalismVsShariaFiqh.id}

---

${renderEpistemology('id')}

### VI. Sudut Pandang Epistemologi Islam & Kesinambungan Risalah

${story.islamicReasoningWalkthrough.revelationContinuity.id}

${story.islamicReasoningWalkthrough.scripturalTransmissionHistory.id}

Dalam **${story.islamicReasoningWalkthrough.quranicPerspective.surahReference.id}**, Al-Qur'an mengabadikan prinsip ini secara gamblang:

> **"${story.islamicReasoningWalkthrough.quranicPerspective.arabicText}"**
> 
> *Artinya: "${story.islamicReasoningWalkthrough.quranicPerspective.translation.id}"*

${story.islamicReasoningWalkthrough.quranicPerspective.exegesis.id}

${story.islamicReasoningWalkthrough.theologicalSynthesis.id}

---

### VII. Batasan Intelektual: Apa yang Terbukti—dan Apa yang Tidak

Sebuah telaah yang bermartabat harus berani menarik batas tegas antara data empiris dan kesimpulan iman:

${story.whatThisDoesAndDoesntProve.id}

---

### VIII. Pertanyaan untuk Dipikirkan Bersama

${story.reflectiveQuestion.id}

---

### Rujukan Akademik & Sumber Otoritatif

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
articleType: '${story.editorialAngle}'
category: 'islamic-logic'
sources: ${JSON.stringify(story.sources)}
imageCredits: ${JSON.stringify(imageCredits)}
---

## Unsealing Historical Witnesses: Faith, Logic, and Textual Transmission

${story.narrativeHook.en}

${story.readerHook.en}

${story.universalQuestion.en}

Beneath the sands of historical inquiry and interfaith dialogue, rigorous investigation into ancient manuscripts and theological logic provides invaluable insight into how humanity conceptualizes total surrender to the Creator.

![${images[0]?.altText.en || story.titles.en}](${images[0]?.localPath || images[0]?.url || coverImage})
*Visual Source: ${images[0]?.source} / Photo by ${images[0]?.author} (${images[0]?.license})*

---

### I. Historical Reconstruction & Primary Documentary Evidence

${story.archaeologicalDetails.discoveryNarrative.en}

${story.archaeologicalDetails.caveAndManuscriptCount.en}

${story.archaeologicalDetails.radiocarbonAndPaleographyDating.en}

${images[1] ? `![${images[1].altText.en}](${images[1].localPath || images[1].url})\n*Visual Source: ${images[1].source} / Photo by ${images[1].author} (${images[1].license})*\n` : ''}

---

### II. Core Manuscript Witnesses & The Scribal Landscape

${story.archaeologicalDetails.keyTexts.map((text, idx) => `#### ${idx + 1}. ${text.name.en} (${text.siglum})\n\n*Estimated Date:* ${text.dateEstimate.en}\n\n${text.description.en}`).join('\n\n')}

${story.archaeologicalDetails.textualLandscape.en}

---

### III. Scholarly Debates, Counterarguments & Opposing Views

${story.scholarlyDebate.esseneHypothesis.en}

${story.scholarlyDebate.alternativeTheories.en}

${story.scholarlyDebate.scholarlyConsensusOrDispute.en}

${images[2] ? `![${images[2].altText.en}](${images[2].localPath || images[2].url})\n*Visual Source: ${images[2].source} / Photo by ${images[2].author} (${images[2].license})*\n` : ''}

---

### IV. Conceptual Precision: Monotheism, Prophecy, and Worship

${story.definitionalDistinction.monotheismVsTawhid.en}

${story.definitionalDistinction.messianicExpectationsVsPropheticLineage.en}

${story.definitionalDistinction.halakhicLegalismVsShariaFiqh.en}

---

${renderEpistemology('en')}

### VI. The Islamic Epistemological Framework: Revelation Continuity & Transmission

${story.islamicReasoningWalkthrough.revelationContinuity.en}

${story.islamicReasoningWalkthrough.scripturalTransmissionHistory.en}

In **${story.islamicReasoningWalkthrough.quranicPerspective.surahReference.en}**, sacred scripture articulates this foundational principle:

> **"${story.islamicReasoningWalkthrough.quranicPerspective.arabicText}"**
> 
> *Translation: "${story.islamicReasoningWalkthrough.quranicPerspective.translation.en}"*

${story.islamicReasoningWalkthrough.quranicPerspective.exegesis.en}

${story.islamicReasoningWalkthrough.theologicalSynthesis.en}

---

### VII. Intellectual Boundaries: What This Does—and Doesn't—Prove

A rigorous inquiry must maintain strict demarcation between empirical data and theological interpretation:

${story.whatThisDoesAndDoesntProve.en}

---

### VIII. A Question Worth Contemplating

${story.reflectiveQuestion.en}

---

### Primary References & Scholarly Sources

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
articleType: '${story.editorialAngle}'
category: 'islamic-logic'
sources: ${JSON.stringify(story.sources)}
imageCredits: ${JSON.stringify(imageCredits)}
---

## قراءة نقدية في الشواهد التاريخية ومنطق التوحيد الخالص

${story.narrativeHook.ar}

${story.readerHook.ar}

${story.universalQuestion.ar}

بين طيات الوثائق التاريخية وسكون المخطوطات القديمة، تقدم الدراسات المقارنة رؤية رصينة تكشف كيف أدرك الإنسان جوهر العبودية والانقياد للخالق سبحانه وتعالى.

![${images[0]?.altText.ar || story.titles.ar}](${images[0]?.localPath || images[0]?.url || coverImage})
*مصدر الصورة: ${images[0]?.source} / تصوير ${images[0]?.author} (${images[0]?.license})*

---

### أولاً: التحقيق التاريخي والشواهد الوثائقية المادية

${story.archaeologicalDetails.discoveryNarrative.ar}

${story.archaeologicalDetails.caveAndManuscriptCount.ar}

${story.archaeologicalDetails.radiocarbonAndPaleographyDating.ar}

${images[1] ? `![${images[1].altText.ar}](${images[1].localPath || images[1].url})\n*مصدر الصورة: ${images[1].source} / تصوير ${images[1].author} (${images[1].license})*\n` : ''}

---

### ثانياً: النصوص المحورية ومسار انتقال المخطوطات القديمة

${story.archaeologicalDetails.keyTexts.map((text, idx) => `#### ${idx + 1}. ${text.name.ar} (${text.siglum})\n\n*التقدير الزمني:* ${text.dateEstimate.ar}\n\n${text.description.ar}`).join('\n\n')}

${story.archaeologicalDetails.textualLandscape.ar}

---

### ثالثاً: السجال الأكاديمي والآراء المعارضة (الأطروحات المضادة)

${story.scholarlyDebate.esseneHypothesis.ar}

${story.scholarlyDebate.alternativeTheories.ar}

${story.scholarlyDebate.scholarlyConsensusOrDispute.ar}

${images[2] ? `![${images[2].altText.ar}](${images[2].localPath || images[2].url})\n*مصدر الصورة: ${images[2].source} / تصوير ${images[2].author} (${images[2].license})*\n` : ''}

---

### رابعاً: الانضباط المفاهيمي: التوحيد، النبوة، والعبادة

${story.definitionalDistinction.monotheismVsTawhid.ar}

${story.definitionalDistinction.messianicExpectationsVsPropheticLineage.ar}

${story.definitionalDistinction.halakhicLegalismVsShariaFiqh.ar}

---

${renderEpistemology('ar')}

### سادساً: المنظور المعرفي الإسلامي: اتصال الوحي وطبيعة التدوين البشري

${story.islamicReasoningWalkthrough.revelationContinuity.ar}

${story.islamicReasoningWalkthrough.scripturalTransmissionHistory.ar}

في **${story.islamicReasoningWalkthrough.quranicPerspective.surahReference.ar}**، يقرر القرآن الكريم هذا المبدأ الكلي:

> **"${story.islamicReasoningWalkthrough.quranicPerspective.arabicText}"**
> 
> *البيان والتفسير: "${story.islamicReasoningWalkthrough.quranicPerspective.exegesis.ar}"*

${story.islamicReasoningWalkthrough.theologicalSynthesis.ar}

---

### سابعاً: الحدود المعرفية: ما يثبته الكشف وما لا يدعيه

${story.whatThisDoesAndDoesntProve.ar}

---

### ثامناً: سؤال يستحق التأمل والتفكر

${story.reflectiveQuestion.ar}

---

### المصادر والمراجع الأكاديمية المعتمدة

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
        articleType: story.editorialAngle,
        category: 'islamic-logic',
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
        articleType: story.editorialAngle,
        category: 'islamic-logic',
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
        articleType: story.editorialAngle,
        category: 'islamic-logic',
        sources: story.sources,
        imageCredits,
      },
      content: arContent,
    }

    return [idArticle, enArticle, arArticle]
  }
}
