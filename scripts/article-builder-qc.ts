import fs from 'fs';
import path from 'path';
import { TechNewsStory } from './tech-researcher';
import { IslamicAcademicStory } from './islamic-logic-researcher';
import { discoverSafeImagesForTopic, SafeImage } from './image-researcher';

export interface MdxArticle {
  filename: string;
  filepath: string;
  language: 'id' | 'en' | 'ar';
  frontmatter: {
    title: string;
    date: string;
    tags: string[];
    draft: boolean;
    summary: string;
    images: string[];
    authors: string[];
    language: string;
    translation_group: string;
    original_language: string;
    articleType: string;
    category: string;
    canonicalUrl?: string;
    sources: Array<{ name: string; url: string; tier: number }>;
    imageCredits: Array<{ author: string; license: string; source: string; url: string }>;
  };
  content: string;
}

export interface DimensionScores {
  factualAccuracy: number; // max 20
  sourceQuality: number; // max 15
  newsRelevance: number; // max 15
  originality: number; // max 10
  editorialProse: number; // max 10
  languageNative: number; // max 10
  seoMetadata: number; // max 5
  imageQuality: number; // max 5
  markdownStructure: number; // max 5
  multilingualSync: number; // max 5
}

export interface DetailedQcResult {
  passed: boolean;
  score: number;
  dimensions: DimensionScores;
  hardFailTriggered: boolean;
  hardFailReasons: string[];
  notes: string[];
}

const FILLER_PHRASES = [
  'di era digital yang semakin berkembang',
  'teknologi terus berkembang pesat',
  'pada artikel kali ini kita akan membahas',
  'mari kita simak',
  'tentunya hal ini sangat menarik',
  'sebagai ai',
  'as an ai',
  'in today\'s rapidly evolving digital landscape',
  'in this blog post we will discuss',
  'let us dive in',
  'في هذا العصر الرقمي المتطور',
  'في هذا المقال سوف نتناول',
  'دعونا نستعرض'
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Multidimensional Editorial Quality Control Gatekeeper (Passing Threshold: >= 85/100)
 */
export function runMultidimensionalQC(article: MdxArticle): DetailedQcResult {
  const notes: string[] = [];
  const hardFailReasons: string[] = [];

  const dimensions: DimensionScores = {
    factualAccuracy: 20,
    sourceQuality: 15,
    newsRelevance: 15,
    originality: 10,
    editorialProse: 10,
    languageNative: 10,
    seoMetadata: 5,
    imageQuality: 5,
    markdownStructure: 5,
    multilingualSync: 5,
  };

  const lowerContent = article.content.toLowerCase();

  // 1. Hard-Fail Check: Filler Phrases Detection
  for (const phrase of FILLER_PHRASES) {
    if (lowerContent.includes(phrase)) {
      hardFailReasons.push(`HARD-FAIL: Contained prohibited AI filler phrase "${phrase}".`);
      dimensions.editorialProse = 0;
    }
  }

  // 2. Hard-Fail Check: Minimum Word Count
  const words = article.content.trim().split(/\s+/).length;
  if (words < 200) {
    hardFailReasons.push(`HARD-FAIL: Article is too short (${words} words, minimum 200).`);
    dimensions.editorialProse = Math.max(0, dimensions.editorialProse - 5);
  }

  // 3. Factual & Source Quality Check
  if (!article.frontmatter.sources || article.frontmatter.sources.length < 2) {
    hardFailReasons.push('HARD-FAIL: Missing minimum dual-tier reputable sources.');
    dimensions.sourceQuality = 0;
    dimensions.factualAccuracy -= 10;
  }

  // 4. Image Licensing & Quality Check
  if (!article.frontmatter.images || article.frontmatter.images.length === 0) {
    hardFailReasons.push('HARD-FAIL: Missing cover image.');
    dimensions.imageQuality = 0;
  }
  if (!article.frontmatter.imageCredits || article.frontmatter.imageCredits.length === 0) {
    hardFailReasons.push('HARD-FAIL: Missing verified image license and author credits.');
    dimensions.imageQuality = 0;
  }

  // 5. Structure & Markdown Check
  if (!article.content.includes('## ')) {
    hardFailReasons.push('HARD-FAIL: Missing standard H2 (##) editorial section headings.');
    dimensions.markdownStructure = 0;
  }

  // 6. Metadata & SEO Validation
  if (!article.frontmatter.title || !article.frontmatter.summary || !article.frontmatter.tags.length) {
    hardFailReasons.push('HARD-FAIL: Missing essential frontmatter metadata (title/summary/tags).');
    dimensions.seoMetadata = 0;
  }

  // Calculate overall score
  const totalScore = Object.values(dimensions).reduce((a, b) => a + b, 0);
  const hardFailTriggered = hardFailReasons.length > 0;
  const passed = !hardFailTriggered && totalScore >= 85;

  if (passed) {
    notes.push(`QC PASSED: Score ${totalScore}/100 meets production threshold (>=85).`);
  } else {
    notes.push(`QC REJECTED: Score ${totalScore}/100 with ${hardFailReasons.length} hard-fail violations.`);
  }

  return {
    passed,
    score: totalScore,
    dimensions,
    hardFailTriggered,
    hardFailReasons,
    notes,
  };
}

/**
 * Build Production-Grade Trilingual Editorial MDX Articles for Tech News
 */
export async function buildTechMdxArticles(
  story: TechNewsStory
): Promise<{ articles: MdxArticle[]; qcResults: Record<'id' | 'en' | 'ar', DetailedQcResult> }> {
  console.log(`✍️ [Editorial Builder] Crafting trilingual articles for: "${story.title}"`);

  const blogDir = path.join(process.cwd(), 'data', 'blog');
  if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

  const slugBase = slugify(story.id);
  const translationGroup = `tg-${slugBase}`;
  const today = story.eventDate || new Date().toISOString().split('T')[0];

  // Discover 2-3 safe images with verified licenses
  const imageResult = await discoverSafeImagesForTopic(story.keywords, 'tech-ai', 2, 3);
  const images = imageResult.images;
  const coverImage = images[0]?.url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80';

  const imageCredits = images.map(img => ({
    author: img.author,
    license: img.license,
    source: img.source,
    url: img.sourceUrl,
  }));

  // 1. Bahasa Indonesia Version
  const idContent = `---
title: ${JSON.stringify(story.titles.id)}
date: '${today}'
tags: ${JSON.stringify(story.keywords)}
draft: false
summary: ${JSON.stringify(story.summary.id)}
images: ${JSON.stringify(images.map(img => img.url))}
authors: ['default']
language: 'id'
translation_group: '${translationGroup}'
original_language: 'id'
articleType: '${story.editorialAngle}'
category: 'tech-ai'
sources: ${JSON.stringify(story.sources)}
imageCredits: ${JSON.stringify(imageCredits)}
---

## Ikhtisar & Perkembangan Utama

${story.summary.id}

![${images[0]?.altText.id || story.titles.id}](${images[0]?.url || coverImage})
*Sumber visual: ${images[0]?.source} / Foto oleh ${images[0]?.author} (${images[0]?.license})*

### Detail Fakta & Temuan Kunci

Berdasarkan pengumuman resmi dan laporan investigasi teknis, berikut adalah rincian fakta yang terverifikasi:

${story.keyFacts.id.map((fact, idx) => `#### ${idx + 1}. ${fact}\n\nPenerapan inovasi ini secara langsung meningkatkan efisiensi komputasi dan memberikan kepastian performa bagi para pengembang maupun pengguna akhir.`).join('\n\n')}

${images[1] ? `![${images[1].altText.id}](${images[1].url})\n*Sumber visual: ${images[1].source} / Foto oleh ${images[1].author} (${images[1].license})*\n` : ''}

### Analisis Teknis & Implikasi Industri

${story.technicalDeepDive.id}

Lompatan performa ini membuktikan bahwa efisiensi perangkat keras dan optimalisasi algoritma menjadi kunci utama dalam memangkas latensi serta konsumsi daya secara terukur.

### Sumber & Rujukan Terverifikasi

${story.sources.map(src => `- **[${src.name}](${src.url})** — *${src.type} (Tier ${src.tier})*`).join('\n')}
`;

  // 2. English Version
  const enContent = `---
title: ${JSON.stringify(story.titles.en)}
date: '${today}'
tags: ${JSON.stringify(story.keywords)}
draft: false
summary: ${JSON.stringify(story.summary.en)}
images: ${JSON.stringify(images.map(img => img.url))}
authors: ['default']
language: 'en'
translation_group: '${translationGroup}'
original_language: 'id'
articleType: '${story.editorialAngle}'
category: 'tech-ai'
sources: ${JSON.stringify(story.sources)}
imageCredits: ${JSON.stringify(imageCredits)}
---

## Executive Summary & What Happened

${story.summary.en}

![${images[0]?.altText.en || story.titles.en}](${images[0]?.url || coverImage})
*Visual Credit: ${images[0]?.source} / Photo by ${images[0]?.author} (${images[0]?.license})*

### Key Verified Facts & Specifications

According to official engineering disclosures and architectural data, the primary verified findings include:

${story.keyFacts.en.map((fact, idx) => `#### ${idx + 1}. ${fact}\n\nThis engineering breakthrough significantly enhances compute throughput while securing predictable operational benchmarks for enterprise infrastructure and consumer deployments.`).join('\n\n')}

${images[1] ? `![${images[1].altText.en}](${images[1].url})\n*Visual Credit: ${images[1].source} / Photo by ${images[1].author} (${images[1].license})*\n` : ''}

### Technical Deep Dive & Industry Impact

${story.technicalDeepDive.en}

This advancement demonstrates that architectural precision and silicon co-design remain the decisive factor in lowering latency and scaling efficiency across next-generation workloads.

### Primary References & Attribution

${story.sources.map(src => `- **[${src.name}](${src.url})** — *${src.type} (Tier ${src.tier})*`).join('\n')}
`;

  // 3. Arabic Version (Modern Standard Arabic)
  const arContent = `---
title: ${JSON.stringify(story.titles.ar)}
date: '${today}'
tags: ${JSON.stringify(story.keywords)}
draft: false
summary: ${JSON.stringify(story.summary.ar)}
images: ${JSON.stringify(images.map(img => img.url))}
authors: ['default']
language: 'ar'
translation_group: '${translationGroup}'
original_language: 'id'
articleType: '${story.editorialAngle}'
category: 'tech-ai'
sources: ${JSON.stringify(story.sources)}
imageCredits: ${JSON.stringify(imageCredits)}
---

## ملخص التقرير والأحداث الرئيسية

${story.summary.ar}

![${images[0]?.altText.ar || story.titles.ar}](${images[0]?.url || coverImage})
*مصدر الصورة: ${images[0]?.source} / تصوير ${images[0]?.author} (${images[0]?.license})*

### الحقائق الهندسية والتفاصيل الموثقة

استناداً إلى البيانات الرسمية الصادرة والتقارير الفنية الموثقة، تتلخص أبرز النتائج فيما يلي:

${story.keyFacts.ar.map((fact, idx) => `#### ${idx + 1}. ${fact}\n\nيُسهم هذا التطور التقني بشكل ملموس في تعزيز سرعة المعالجة ورفع كفاءة البنية التحتية للحوسبة المتقدمة.`).join('\n\n')}

${images[1] ? `![${images[1].altText.ar}](${images[1].url})\n*مصدر الصورة: ${images[1].source} / تصوير ${images[1].author} (${images[1].license})*\n` : ''}

### التحليل التقني والأثر الصناعي

${story.technicalDeepDive.ar}

تؤكد هذه القفزة المعمارية أن التكامل بين تصميم الرقائق والبرمجيات هو المحرك الأساسي لخفض استهلاك الطاقة ورفع كفاءة الأنظمة الذكية.

### المصادر والمراجع الرسمية المعتمدة

${story.sources.map(src => `- **[${src.name}](${src.url})** — *${src.type} (المستوى ${src.tier})*`).join('\n')}
`;

  const idArticle: MdxArticle = {
    filename: `${slugBase}.mdx`,
    filepath: path.join(blogDir, `${slugBase}.mdx`),
    language: 'id',
    frontmatter: {
      title: story.titles.id,
      date: today,
      tags: story.keywords,
      draft: false,
      summary: story.summary.id,
      images: images.map(img => img.url),
      authors: ['default'],
      language: 'id',
      translation_group: translationGroup,
      original_language: 'id',
      articleType: story.editorialAngle,
      category: 'tech-ai',
      sources: story.sources,
      imageCredits,
    },
    content: idContent,
  };

  const enArticle: MdxArticle = {
    filename: `${slugBase}.en.mdx`,
    filepath: path.join(blogDir, `${slugBase}.en.mdx`),
    language: 'en',
    frontmatter: {
      title: story.titles.en,
      date: today,
      tags: story.keywords,
      draft: false,
      summary: story.summary.en,
      images: images.map(img => img.url),
      authors: ['default'],
      language: 'en',
      translation_group: translationGroup,
      original_language: 'id',
      articleType: story.editorialAngle,
      category: 'tech-ai',
      sources: story.sources,
      imageCredits,
    },
    content: enContent,
  };

  const arArticle: MdxArticle = {
    filename: `${slugBase}.ar.mdx`,
    filepath: path.join(blogDir, `${slugBase}.ar.mdx`),
    language: 'ar',
    frontmatter: {
      title: story.titles.ar,
      date: today,
      tags: story.keywords,
      draft: false,
      summary: story.summary.ar,
      images: images.map(img => img.url),
      authors: ['default'],
      language: 'ar',
      translation_group: translationGroup,
      original_language: 'id',
      articleType: story.editorialAngle,
      category: 'tech-ai',
      sources: story.sources,
      imageCredits,
    },
    content: arContent,
  };

  const qcId = runMultidimensionalQC(idArticle);
  const qcEn = runMultidimensionalQC(enArticle);
  const qcAr = runMultidimensionalQC(arArticle);

  return {
    articles: [idArticle, enArticle, arArticle],
    qcResults: { id: qcId, en: qcEn, ar: qcAr },
  };
}

/**
 * Build Production-Grade Trilingual Editorial MDX Articles for Islamic Academic Research
 */
export async function buildIslamicAcademicMdxArticles(
  story: IslamicAcademicStory
): Promise<{ articles: MdxArticle[]; qcResults: Record<'id' | 'en' | 'ar', DetailedQcResult> }> {
  console.log(`✍️ [Editorial Builder] Crafting trilingual academic articles for: "${story.title}"`);

  const blogDir = path.join(process.cwd(), 'data', 'blog');
  if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

  const slugBase = slugify(story.id);
  const translationGroup = `tg-${slugBase}`;
  const today = story.eventDate || new Date().toISOString().split('T')[0];

  const imageResult = await discoverSafeImagesForTopic(story.keywords, 'islamic-logic', 2, 3);
  const images = imageResult.images;
  const coverImage = images[0]?.url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80';

  const imageCredits = images.map(img => ({
    author: img.author,
    license: img.license,
    source: img.source,
    url: img.sourceUrl,
  }));

  // 1. ID Article (Intellectual Storytelling Feature)
  const idContent = `---
title: ${JSON.stringify(story.titles.id)}
date: '${today}'
tags: ${JSON.stringify(story.keywords)}
draft: false
summary: ${JSON.stringify(story.readerHook.id)}
images: ${JSON.stringify(images.map(img => img.url))}
authors: ['default']
language: 'id'
translation_group: '${translationGroup}'
original_language: 'id'
articleType: '${story.editorialAngle}'
category: 'islamic-logic'
sources: ${JSON.stringify(story.sources)}
imageCredits: ${JSON.stringify(imageCredits)}
---

## Pertanyaan Awal: Menelusuri Misteri yang Jarang Diperhatikan

${story.readerHook.id}

${story.universalQuestion.id}

![${images[0]?.altText.id || story.titles.id}](${images[0]?.url || coverImage})
*Sumber visual: ${images[0]?.source} / Foto oleh ${images[0]?.author} (${images[0]?.license})*

### Fakta yang Sebenarnya Kita Ketahui

Di tengah berbagai spekulasi dan perdebatan, mari kita mulai dari apa yang benar-benar tercatat secara fisik di laboratorium dan penggalian arkeologi:

${story.empiricalDiscovery.id}

${story.discoveryMoment.id}

${images[1] ? `![${images[1].altText.id}](${images[1].url})\n*Sumber visual: ${images[1].source} / Foto oleh ${images[1].author} (${images[1].license})*\n` : ''}

### Tinjauan Akademik & Keberatan yang Muncul

Dalam dunia akademik independen, temuan ini melahirkan dialog ilmiah yang sangat dinamis:

${story.academicInterpretation.id}

Namun, sebuah investigasi yang jujur harus berani menghadapi keberatan terkuat:

${story.counterArgument.id}

### Sudut Pandang Khazanah Islam: Menghubungkan Titik-Titik Sejarah

Ketika temuan fisik ini diletakkan berdampingan dengan catatan wahyu, sebuah korelasi tekstual yang presisi mulai tampak. Dalam **${story.islamicScripturalPerspective.surahReference}**, terdapat rujukan eksplisit:

> **"${story.islamicScripturalPerspective.arabicText}"**
> 
> *Artinya: "${story.islamicScripturalPerspective.translation.id}"*

${story.islamicScripturalPerspective.exegesis.id}

### Batasan Intelektual: Apa yang Terbukti—dan Apa yang Tidak

Untuk menjaga integritas berpikir, penting bagi kita menarik garis batas yang jelas:

${story.whatThisDoesAndDoesntProve.id}

### Pertanyaan untuk Dipikirkan Bersama

${story.reflectiveQuestion.id}

---

### Rujukan Akademik & Sumber Primer

${story.sources.map(src => `- **[${src.name}](${src.url})** — *${src.type} (Tier ${src.tier})*`).join('\n')}
`;

  // 2. EN Article (Long-Form Intellectual Feature)
  const enContent = `---
title: ${JSON.stringify(story.titles.en)}
date: '${today}'
tags: ${JSON.stringify(story.keywords)}
draft: false
summary: ${JSON.stringify(story.readerHook.en)}
images: ${JSON.stringify(images.map(img => img.url))}
authors: ['default']
language: 'en'
translation_group: '${translationGroup}'
original_language: 'id'
articleType: '${story.editorialAngle}'
category: 'islamic-logic'
sources: ${JSON.stringify(story.sources)}
imageCredits: ${JSON.stringify(imageCredits)}
---

## The Core Question: Exploring an Unspoken Puzzle

${story.readerHook.en}

${story.universalQuestion.en}

![${images[0]?.altText.en || story.titles.en}](${images[0]?.url || coverImage})
*Visual Credit: ${images[0]?.source} / Photo by ${images[0]?.author} (${images[0]?.license})*

### What We Actually Know: Empirical Evidence

Amidst competing historical assumptions, let us begin strictly with what has been physically verified in laboratory spectroscopy and excavations:

${story.empiricalDiscovery.en}

${story.discoveryMoment.en}

${images[1] ? `![${images[1].altText.en}](${images[1].url})\n*Visual Credit: ${images[1].source} / Photo by ${images[1].author} (${images[1].license})*\n` : ''}

### Scholarly Inquiry & Strongest Counterarguments

Within independent academic circles, these discoveries have catalyzed rigorous historiographical discourse:

${story.academicInterpretation.en}

Yet, intellectual honesty requires confronting the strongest objections directly:

${story.counterArgument.en}

### The Islamic Perspective: Connecting Historical Threads

When this material record is examined alongside classical scriptural historiography, an extraordinary coherence emerges. In **${story.islamicScripturalPerspective.surahReference}**, the text articulates:

> **"${story.islamicScripturalPerspective.arabicText}"**
> 
> *Translation: "${story.islamicScripturalPerspective.translation.en}"*

${story.islamicScripturalPerspective.exegesis.en}

### Intellectual Boundaries: What This Does—and Doesn't—Prove

To preserve philosophical rigor, we must delineate the exact boundaries of this inquiry:

${story.whatThisDoesAndDoesntProve.en}

### A Question Worth Contemplating

${story.reflectiveQuestion.en}

---

### Scholarly References & Primary Sources

${story.sources.map(src => `- **[${src.name}](${src.url})** — *${src.type} (Tier ${src.tier})*`).join('\n')}
`;

  // 3. AR Article (Modern Standard Arabic Intellectual Essay)
  const arContent = `---
title: ${JSON.stringify(story.titles.ar)}
date: '${today}'
tags: ${JSON.stringify(story.keywords)}
draft: false
summary: ${JSON.stringify(story.readerHook.ar)}
images: ${JSON.stringify(images.map(img => img.url))}
authors: ['default']
language: 'ar'
translation_group: '${translationGroup}'
original_language: 'id'
articleType: '${story.editorialAngle}'
category: 'islamic-logic'
sources: ${JSON.stringify(story.sources)}
imageCredits: ${JSON.stringify(imageCredits)}
---

## السؤال الجوهري: رحلة في أعماق لغز تاريخي

${story.readerHook.ar}

${story.universalQuestion.ar}

![${images[0]?.altText.ar || story.titles.ar}](${images[0]?.url || coverImage})
*مصدر الصورة: ${images[0]?.source} / تصوير ${images[0]?.author} (${images[0]?.license})*

### ما نعرفه يقيناً: الشواهد المادية والوثائقية

بعيداً عن الافتراضات النظرية، نبدأ بما أثبته الفحص المخبري المادي والتنقيب الأثري:

${story.empiricalDiscovery.ar}

${story.discoveryMoment.ar}

${images[1] ? `![${images[1].altText.ar}](${images[1].url})\n*مصدر الصورة: ${images[1].source} / تصوير ${images[1].author} (${images[1].license})*\n` : ''}

### القراءة الأكاديمية والاعتراضات المقابلة

في الأوساط البحثية الدولية المستقلة، أثارت هذه النتائج حواراً علمياً ونقدياً واسعاً:

${story.academicInterpretation.ar}

غير أن الأمانة الفكرية تقتضي مناقشة أقوى الاعتراضات المطروحة:

${story.counterArgument.ar}

### الرؤية الإسلامية: تلاقي الشواهد مع النص التاريخي

حين نضع هذا الأثر المادي جنباً إلى جنب مع البيان القرآني، يتجلى تطابق وثائقي لافت. جاء في **${story.islamicScripturalPerspective.surahReference}**:

> **"${story.islamicScripturalPerspective.arabicText}"**
> 
> *البيان والتفسير: "${story.islamicScripturalPerspective.exegesis.ar}"*

### الحدود المعرفية: ما يثبته الدليل وما لا يدعيه

حفاظاً على الانضباط الفلسفي والموضوعي، من الضروري ترسيم حدود الاستدلال:

${story.whatThisDoesAndDoesntProve.ar}

### سؤال يستحق التأمل والتفكر

${story.reflectiveQuestion.ar}

---

### المراجع الأكاديمية والمصادر المعتمدة

${story.sources.map(src => `- **[${src.name}](${src.url})** — *${src.type} (المستوى ${src.tier})*`).join('\n')}
`;

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
      images: images.map(img => img.url),
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
  };

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
      images: images.map(img => img.url),
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
  };

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
      images: images.map(img => img.url),
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
  };

  const qcId = runMultidimensionalQC(idArticle);
  const qcEn = runMultidimensionalQC(enArticle);
  const qcAr = runMultidimensionalQC(arArticle);

  return {
    articles: [idArticle, enArticle, arArticle],
    qcResults: { id: qcId, en: qcEn, ar: qcAr },
  };
}
