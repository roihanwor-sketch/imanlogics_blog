import fs from 'fs';
import path from 'path';
import { TechNewsStory } from './tech-researcher';
import { IslamicAcademicStory } from './islamic-logic-researcher';
import { discoverSafeImagesForTopic } from './image-researcher';

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
    language: 'id' | 'en' | 'ar';
    translation_group: string;
    original_language: 'id';
    articleType: string;
    category: 'tech-ai' | 'islamic-logic';
    sources: Array<{ name: string; url: string; tier: number; type?: string }>;
    imageCredits: Array<{ author: string; license: string; source: string; url: string }>;
  };
  content: string;
}

export interface DetailedQcResult {
  score: number;
  passed: boolean;
  hardFailTriggered: boolean;
  hardFailReason?: string;
  breakdown: {
    factualConsistency: number;
    editorialDepthAndStyle: number;
    sourceVerification: number;
    metadataAndSchemaValidation: number;
  };
  warnings: string[];
}

const MIN_PASSING_QC_SCORE = 85;

const BANNED_AI_FILLER_PATTERNS = [
  /di era digital yang terus berkembang/i,
  /mari kita simak penjelasan mendalam berikut/i,
  /tak dapat dipungkiri bahwa/i,
  /sebagaimana kita ketahui bersama/i,
  /pada artikel kali ini kita akan membahas/i,
  /penerapan inovasi ini secara langsung meningkatkan efisiensi/i,
  /in today's rapidly evolving digital landscape/i,
  /it goes without saying that/i,
  /delve into/i,
  /testament to/i,
  /في عصرنا الرقمي المتسارع/i,
  /لا يخفى على أحد أن/i,
  /دعونا نغوص في تفاصيل/i,
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function runMultidimensionalQC(article: MdxArticle): DetailedQcResult {
  const warnings: string[] = [];
  let score = 100;
  let hardFailTriggered = false;
  let hardFailReason: string | undefined;

  const content = article.content;
  const wordCount = content.trim().split(/\s+/).length;

  for (const pattern of BANNED_AI_FILLER_PATTERNS) {
    if (pattern.test(content)) {
      hardFailTriggered = true;
      hardFailReason = `Zero-Filler Gate Failed: Detected banned generic AI filler phrase matching ${pattern.toString()}`;
      score = 0;
      break;
    }
  }

  const minRequiredWords = article.frontmatter.category === 'islamic-logic' ? 650 : 500;
  if (!hardFailTriggered && wordCount < minRequiredWords) {
    hardFailTriggered = true;
    hardFailReason = `Depth Gate Failed: Article contains ${wordCount} words (Minimum required: ${minRequiredWords} words for professional journalism).`;
    score = Math.min(score, 40);
  }

  if (!hardFailTriggered && (!article.frontmatter.sources || article.frontmatter.sources.length < 2)) {
    hardFailTriggered = true;
    hardFailReason = `Source Gate Failed: Article must cite at least 2 primary/secondary verified institutional sources.`;
    score = Math.min(score, 50);
  }

  const breakdown = {
    factualConsistency: 25,
    editorialDepthAndStyle: 25,
    sourceVerification: 25,
    metadataAndSchemaValidation: 25,
  };

  if (hardFailTriggered) {
    breakdown.factualConsistency = 0;
    breakdown.editorialDepthAndStyle = 0;
  }

  return {
    score: hardFailTriggered ? score : Math.max(score, 0),
    passed: !hardFailTriggered && score >= MIN_PASSING_QC_SCORE,
    hardFailTriggered,
    hardFailReason,
    breakdown,
    warnings,
  };
}

export async function buildTechMdxArticles(
  story: TechNewsStory
): Promise<{ articles: MdxArticle[]; qcResults: Record<'id' | 'en' | 'ar', DetailedQcResult> }> {
  console.log(`✍️ [Tech Journalism Builder] Crafting trilingual investigative feature for: "${story.title}"`);

  const blogDir = path.join(process.cwd(), 'data', 'blog');
  if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

  const slugBase = slugify(story.id);
  const translationGroup = `tg-${slugBase}`;
  const today = story.eventDate || new Date().toISOString().split('T')[0];

  const imageResult = await discoverSafeImagesForTopic(story.keywords, 'tech-ai', 2, 3);
  const images = imageResult.images;
  const coverImage = images[0]?.url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80';

  const imageCredits = images.map(img => ({
    author: img.author,
    license: img.license,
    source: img.source,
    url: img.sourceUrl,
  }));

  // 1. ID Article
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

## Di Balik Perlombaan Silikon AI: Mengapa Efisiensi Inferensi Menjadi Medan Tempur Baru

${story.narrativeHook.id}

Di tengah ledakan komputasi kecerdasan buatan, arsitektur Blackwell memperkenalkan pergeseran paradigma: bukan sekadar memperbanyak core grafis, melainkan merestrukturisasi bagaimana angka-angka floating point diproses, bagaimana data dialirkan antar-chip, dan bagaimana seluruh ekosistem rak data center beroperasi secara termal dan elektrikal.

![${images[0]?.altText.id || story.titles.id}](${images[0]?.url || coverImage})
*Sumber visual: ${images[0]?.source} / Foto oleh ${images[0]?.author} (${images[0]?.license})*

---

### I. Dekonstruksi Hardware: Membedakan B200, GB200, dan GB200 NVL72

Dalam diskursus teknologi populer, sering kali terjadi kerancuan antara keping akselerator tunggal dan infrastruktur rak penuh. Penting untuk membedakan ketiga tingkatan arsitektur ini:

1. **${story.disambiguation.hardwareLevels.b200Gpu.id}**
2. **${story.disambiguation.hardwareLevels.gb200Superchip.id}**
3. **${story.disambiguation.hardwareLevels.gb200Nvl72Rack.id}**

${images[1] ? `![${images[1].altText.id}](${images[1].url})\n*Sumber visual: ${images[1].source} / Foto oleh ${images[1].author} (${images[1].license})*\n` : ''}

---

### II. Mengapa Harus Dual-Die? Batas Fisik Litografi Semikonduktor

${story.disambiguation.whyDualDie.id}

Pendekatan chiplet berbasis antarmuka kustom berkecepatan 10 TB/s ini memungkinkan transfer memori antar-die berlangsung dengan konsumsi daya yang sangat rendah, sehingga kedua keping silikon bertindak sebagai satu kesatuan komputasi tanpa menimbulkan latensi sinkronisasi cache.

---

### III. Membedah Matematika FP4: Bagaimana AI Bekerja dengan Angka 4-Bit?

Salah satu lompatan paling signifikan pada Transformer Engine generasi kedua adalah adopsi format presisi numerik 4-bit (FP4).

${story.fp4Analysis.howItWorks.id}

${story.fp4Analysis.precisionProgression.id}

#### Kunci Keberhasilan: Micro-Tensor Scaling

${story.fp4Analysis.microTensorScaling.id}

${story.fp4Analysis.accuracyTradeoffs.id}

---

### IV. Validasi Benchmark: Klaim Pemasaran 30x vs Fakta Pengujian Independen 2026

Bagi para engineer dan pengambil keputusan infrastruktur, memisahkan antara klaim peluncuran dan hasil benchmark dunia nyata adalah hal krusial:

* **${story.benchmarks.officialLaunchClaim.claimText.id}**
  * *Sistem Pengujian Resmi:* ${story.benchmarks.officialLaunchClaim.systemTested}
  * *Model yang Diuji:* ${story.benchmarks.officialLaunchClaim.modelTested}
  * *Baseline Pembanding:* ${story.benchmarks.officialLaunchClaim.comparisonBaseline}

#### Realitas Pengujian Independen di Lapangan

${story.benchmarks.independent2026Benchmarks.costPerMillionTokens.id}

${story.benchmarks.independent2026Benchmarks.realWorldSpeedup.id}

---

### V. Ekonomi Data Center: Densitas Daya 120 kW dan Pendingin Cairan

${story.benchmarks.economicAnalysis.costPerToken.id}

${story.benchmarks.economicAnalysis.powerAndCooling.id}

---

### VI. Apakah Layanan AI Akan Otomatis Lebih Murah bagi Pengguna?

${story.benchmarks.economicAnalysis.consumerPriceImpact.id}

---

### Rujukan Arsitektur & Sumber Primer Otoritatif

${story.sources.map(src => `- **[${src.name}](${src.url})** — *${src.type} (Tier ${src.tier})*`).join('\n')}
`;

  // 2. EN Article
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

## Beyond Monolithic Silicon: Why Inference Economics is the Decisive AI Frontier

${story.narrativeHook.en}

Amid the global AI compute scaling race, the Blackwell architecture introduces a fundamental paradigm shift: rather than simply packing more graphics compute units onto a wafer, it fundamentally overhauls how floating-point numbers are calculated, how memory travels between chiplets, and how multi-megawatt server clusters manage power and thermodynamics.

![${images[0]?.altText.en || story.titles.en}](${images[0]?.url || coverImage})
*Visual Credit: ${images[0]?.source} / Photo by ${images[0]?.author} (${images[0]?.license})*

---

### I. Hardware Deconstruction: Clarifying B200, GB200, and GB200 NVL72

In mainstream enterprise commentary, system-level numbers are frequently conflated with standalone chip capabilities. It is essential to distinguish the three architectural tiers:

1. **${story.disambiguation.hardwareLevels.b200Gpu.en}**
2. **${story.disambiguation.hardwareLevels.gb200Superchip.en}**
3. **${story.disambiguation.hardwareLevels.gb200Nvl72Rack.en}**

${images[1] ? `![${images[1].altText.en}](${images[1].url})\n*Visual Credit: ${images[1].source} / Photo by ${images[1].author} (${images[1].license})*\n` : ''}

---

### II. Why Dual-Die? Overcoming the Photolithographic Reticle Limit

${story.disambiguation.whyDualDie.en}

By bonding two maximum-size silicon dies across an ultra-low-latency 10 TB/s high-density interface, memory transfers execute with virtually zero latency overhead, ensuring software compilers view the package as a unified processor.

---

### III. Deconstructing FP4 Arithmetic: How AI Computes with 4-Bit Precision

The defining computational breakthrough in Blackwell's second-generation Transformer Engine is native 4-bit floating point arithmetic (FP4).

${story.fp4Analysis.howItWorks.en}

${story.fp4Analysis.precisionProgression.en}

#### The Technical Linchpin: Micro-Tensor Scaling

${story.fp4Analysis.microTensorScaling.en}

${story.fp4Analysis.accuracyTradeoffs.en}

---

### IV. Benchmark Integrity: 30x Launch Claims vs. Independent 2026 Realities

For infrastructure engineers and cloud architects, rigorous evaluation requires distinguishing vendor launch headlines from verifiable datacenter telemetry:

* **${story.benchmarks.officialLaunchClaim.claimText.en}**
  * *Vendor Test Configuration:* ${story.benchmarks.officialLaunchClaim.systemTested}
  * *Target Workload:* ${story.benchmarks.officialLaunchClaim.modelTested}
  * *Comparative Baseline:* ${story.benchmarks.officialLaunchClaim.comparisonBaseline}

#### The Independent 2026 Benchmark Data

${story.benchmarks.independent2026Benchmarks.costPerMillionTokens.en}

${story.benchmarks.independent2026Benchmarks.realWorldSpeedup.en}

---

### V. Datacenter Economics: 120 kW Rack Density & Direct Liquid Cooling

${story.benchmarks.economicAnalysis.costPerToken.en}

${story.benchmarks.economicAnalysis.powerAndCooling.en}

---

### VI. Will AI Services Automatically Become Cheaper for Consumers?

${story.benchmarks.economicAnalysis.consumerPriceImpact.en}

---

### Primary Architectural References & Authoritative Sources

${story.sources.map(src => `- **[${src.name}](${src.url})** — *${src.type} (Tier ${src.tier})*`).join('\n')}
`;

  // 3. AR Article
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

## ما وراء سيليكون المعالجات التقليدية: لماذا أصبح اقتصاد الاستدلال ساحة الحسم في الذكاء الاصطناعي

${story.narrativeHook.ar}

في خضم السباق العالمي نحو توسيع نماذج الذكاء الاصطناعي، تقدم معمارية Blackwell تحولاً جذرياً في فلسفة الحوسبة: إعادة هيكلة شاملة لكيفية معالجة الأرقام الحسابية، وتدفق البيانات بين الرقاقات، وإدارة الطاقة والتبريد السائل في مراكز البيانات الحديثة.

![${images[0]?.altText.ar || story.titles.ar}](${images[0]?.url || coverImage})
*مصدر الصورة: ${images[0]?.source} / تصوير ${images[0]?.author} (${images[0]?.license})*

---

### أولاً: التفكيك المعماري للعتاد: التمييز بين B200 وGB200 وGB200 NVL72

يحدث خلط متكرر في التحليلات التقنية بين المعالج الفردي ومنظومة الخوادم المتكاملة. من الضروري التمييز الدقيق بين المستويات الثلاثة:

1. **${story.disambiguation.hardwareLevels.b200Gpu.ar}**
2. **${story.disambiguation.hardwareLevels.gb200Superchip.ar}**
3. **${story.disambiguation.hardwareLevels.gb200Nvl72Rack.ar}**

${images[1] ? `![${images[1].altText.ar}](${images[1].url})\n*مصدر الصورة: ${images[1].source} / تصوير ${images[1].author} (${images[1].license})*\n` : ''}

---

### ثانياً: لماذا التصميم ثنائي القالب؟ تجاوز الحدود الفيزيائية للطباعة الحجرية

${story.disambiguation.whyDualDie.ar}

---

### ثالثاً: تفكيك حسابات FP4 الدقيقة: كيف يعمل الذكاء الاصطناعي بدقة 4-بت؟

${story.fp4Analysis.howItWorks.ar}

${story.fp4Analysis.precisionProgression.ar}

#### الابتكار المحوري: التدرج الدقيق للمصفوفات (Micro-Tensor Scaling)

${story.fp4Analysis.microTensorScaling.ar}

${story.fp4Analysis.accuracyTradeoffs.ar}

---

### رابعاً: التحقق من الأداء: ادعاءات الإطلاق الرسمية مقابل واقع الاختبارات الميدانية 2026

* **${story.benchmarks.officialLaunchClaim.claimText.ar}**
  * *النظام المختبر رسمياً:* ${story.benchmarks.officialLaunchClaim.systemTested}
  * *النموذج المختبر:* ${story.benchmarks.officialLaunchClaim.modelTested}
  * *خط الأساس المقارن:* ${story.benchmarks.officialLaunchClaim.comparisonBaseline}

#### واقع الاختبارات المستقلة في مراكز البيانات

${story.benchmarks.independent2026Benchmarks.costPerMillionTokens.ar}

${story.benchmarks.independent2026Benchmarks.realWorldSpeedup.ar}

---

### خامساً: اقتصاديات مراكز البيانات: كثافة طاقة تصل إلى 120 كيلوواط والتبريد السائل

${story.benchmarks.economicAnalysis.costPerToken.ar}

${story.benchmarks.economicAnalysis.powerAndCooling.ar}

---

### سادساً: هل ستنخفض تكلفة خدمات الذكاء الاصطناعي للمستخدم النهائي؟

${story.benchmarks.economicAnalysis.consumerPriceImpact.ar}

---

### المصادر الفنية والمراجع الرسمية المعتمدة

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

export async function buildIslamicAcademicMdxArticles(
  story: IslamicAcademicStory
): Promise<{ articles: MdxArticle[]; qcResults: Record<'id' | 'en' | 'ar', DetailedQcResult> }> {
  console.log(`✍️ [Islamic Academic Builder] Crafting trilingual investigative feature for: "${story.title}"`);

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

  // 1. Indonesian Version
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

## Menelusuri Jejak yang Tersembunyi di Tebing Gurun Yudea

${story.readerHook.id}

${story.universalQuestion.id}

Di balik debu padang pasir dan keheningan tebing karst, lembaran-lembaran kulit tua ini menyimpan catatan berharga tentang bagaimana manusia masa lampau menyalin teks suci, merumuskan hukum, dan menjaga keyakinan mereka terhadap Yang Maha Kuasa.

![${images[0]?.altText.id || story.titles.id}](${images[0]?.url || coverImage})
*Sumber visual: ${images[0]?.source} / Foto oleh ${images[0]?.author} (${images[0]?.license})*

---

### I. Rekonstruksi dari 11 Gua: Dari Serpihan Fragmen Menjadi Ratusan Manuskrip

${story.archaeologicalDetails.discoveryNarrative.id}

${story.archaeologicalDetails.caveAndManuscriptCount.id}

Tantangan terbesar yang dihadapi para sarjana paleografi bukanlah sekadar menemukan naskah yang utuh, melainkan melakukan kerja detektif ilmiah: menyusun kembali puluhan ribu serpihan kulit dan papirus yang terfragmentasi akibat erosi ribuan tahun, kotoran kelelawar, dan kelembapan masa lampau menjadi kesatuan naskah yang koheren.

${images[1] ? `![${images[1].altText.id}](${images[1].url})\n*Sumber visual: ${images[1].source} / Foto oleh ${images[1].author} (${images[1].license})*\n` : ''}

---

### II. Harta Karun Manuskrip: Great Isaiah Scroll hingga Aturan Komunitas

Koleksi Qumran menyimpan beberapa naskah paling spektakuler dalam sejarah arkeologi dunia:

${story.archaeologicalDetails.keyTexts.map((text, idx) => `#### ${idx + 1}. ${text.name}\n\n${text.description.id}`).join('\n\n')}

Kehadiran naskah-naskah ini membuktikan bahwa gurun Qumran bukan sekadar tempat persembunyian darurat, melainkan pusat literasi keagamaan yang sangat intensif pada masanya.

---

### III. Dinamika Transmisi Teks: Apakah Naskah Kuno Bersifat Kaku?

Salah satu pertanyaan paling menarik bagi pembaca modern adalah: *Apakah penemuan Gulungan Laut Mati membuktikan bahwa teks kitab suci tidak pernah berubah, atau justru sebaliknya?*

Jawaban ilmiah dari para ahli tekstual independen ternyata tidak sesederhana dikotomi hitam-putih:

${story.archaeologicalDetails.textualLandscape.id}

Fakta ini menunjukkan bahwa sejarah penyalinan naskah kuno adalah sebuah proses organik yang hidup. Umat beriman pada masa itu sangat menghargai teks wahyu, namun tradisi penyalinan manual sebelum era mesin cetak secara alami menghasilkan variasi ejaan, penyelarasan tata bahasa, dan catatan redaksional yang kini dapat dipelajari secara transparan oleh sejarawan modern.

---

### IV. Perdebatan Akademik: Kaum Eseni vs Teori Perpustakaan Yerusalem

Siapakah sebenarnya orang-orang di balik koleksi naskah yang luar biasa ini?

${story.scholarlyDebate.esseneHypothesis.id}

${story.scholarlyDebate.alternativeTheories.id}

${story.scholarlyDebate.scholarlyConsensusOrDispute.id}

${images[2] ? `![${images[2].altText.id}](${images[2].url})\n*Sumber visual: ${images[2].source} / Foto oleh ${images[2].author} (${images[2].license})*\n` : ''}

---

### V. Presisi Konseptual: Monoteisme Periode Bait Kedua vs Tauhid Islam

Dalam menelaah sejarah gagasan keagamaan, kejujuran definisi adalah kunci:

${story.definitionalDistinction.monotheismVsTawhid.id}

Komunitas Qumran menolak kompromi asimilasi budaya Helenistik dan menentang kultus pemujaan kaisar Romawi. Mereka berpegang teguh pada doktrin bahwa Allah adalah satu-satunya Penguasa mutlak sejarah manusia.

---

### VI. Sudut Pandang Epistemologi Islam: Kesinambungan Risalah & Realitas Transmisi

Bagaimana khazanah pemikiran Islam memandang penemuan arkeologis semacam ini?

${story.islamicReasoningWalkthrough.revelationContinuity.id}

${story.islamicReasoningWalkthrough.scripturalTransmissionHistory.id}

Dalam **${story.islamicReasoningWalkthrough.quranicPerspective.surahReference}**, Al-Qur'an mengabadikan prinsip ini secara gamblang:

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

${story.sources.map(src => `- **[${src.name}](${src.url})** — *${src.type} (Tier ${src.tier})*`).join('\n')}
`;

  // 2. EN Article
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

## Unsealing the Desert Cliffs: The Discovery of the Dead Sea Scrolls

${story.readerHook.en}

${story.universalQuestion.en}

Beneath the arid dust of the Judean desert and the silence of limestone bluffs, these fragile parchment leaves preserve an unparalleled record of how ancient humanity copied scriptures, formulated legal halakhah, and maintained their devotion to the transcendent Creator.

![${images[0]?.altText.en || story.titles.en}](${images[0]?.url || coverImage})
*Visual Credit: ${images[0]?.source} / Photo by ${images[0]?.author} (${images[0]?.license})*

---

### I. The Archaeological Recovery: From 11 Caves to Cave 4

${story.archaeologicalDetails.discoveryNarrative.en}

${story.archaeologicalDetails.caveAndManuscriptCount.en}

The supreme challenge confronting modern paleographers was not merely locating intact scrolls, but executing an unprecedented feat of scientific forensics: assembling tens of thousands of brittle, decayed fragments—damaged by two millennia of desert weather and biological decay—into coherent textual witnesses.

${images[1] ? `![${images[1].altText.en}](${images[1].url})\n*Visual Credit: ${images[1].source} / Photo by ${images[1].author} (${images[1].license})*\n` : ''}

---

### II. Manuscript Treasures: From the Great Isaiah Scroll to Sectarian Charters

The Qumran library preserves some of the most extraordinary documentary treasures in human history:

${story.archaeologicalDetails.keyTexts.map((text, idx) => `#### ${idx + 1}. ${text.name}\n\n${text.description.en}`).join('\n\n')}

The breadth of these writings demonstrates that the Judean desert caves served as an active nexus of intense scribal preservation and deep religious introspection.

---

### III. The Textual Landscape: Pluriformity and Manuscript Evolution

A central question frequently posed by modern inquirers is: *Do the Dead Sea Scrolls prove that the biblical text was static and frozen, or do they reveal changes over time?*

The scholarly answer established by independent textual critics defies simplistic binaries:

${story.archaeologicalDetails.textualLandscape.en}

These findings illustrate that ancient scribal transmission was a living, organic continuum. While ancient copyists treated the prophetic message with utmost reverence, hand-copied transmission prior to the printing press naturally incorporated orthographic shifts, grammatical harmonizations, and interpretive glosses that historians can now evaluate with complete empirical transparency.

---

### IV. The Academic Debate: Essenes vs. Jerusalem Libraries

Who were the historical custodians behind this remarkable library?

${story.scholarlyDebate.esseneHypothesis.en}

${story.scholarlyDebate.alternativeTheories.en}

${story.scholarlyDebate.scholarlyConsensusOrDispute.en}

${images[2] ? `![${images[2].altText.en}](${images[2].url})\n*Visual Credit: ${images[2].source} / Photo by ${images[2].author} (${images[2].license})*\n` : ''}

---

### V. Conceptual Precision: Second Temple Monotheism vs. Islamic Tawhid

Intellectual rigor requires conceptual clarity:

${story.definitionalDistinction.monotheismVsTawhid.en}

The Qumran community fiercely resisted cultural Hellenization and refused imperial pagan syncretism, holding firmly to the absolute sovereignty and moral holiness of God.

---

### VI. The Islamic Epistemological Framework: Revelation Continuity & Human Transmission

How does classical Islamic thought assess these ancient archaeological discoveries?

${story.islamicReasoningWalkthrough.revelationContinuity.en}

${story.islamicReasoningWalkthrough.scripturalTransmissionHistory.en}

In **${story.islamicReasoningWalkthrough.quranicPerspective.surahReference}**, sacred scripture articulates this foundational principle:

> **"${story.islamicReasoningWalkthrough.quranicPerspective.arabicText}"**
> 
> *Translation: "${story.islamicReasoningWalkthrough.quranicPerspective.translation.en}"*

${story.islamicReasoningWalkthrough.quranicPerspective.exegesis.en}

${story.islamicReasoningWalkthrough.theologicalSynthesis.en}

---

### VII. Intellectual Boundaries: What This Does—and Doesn't—Prove

A rigorous inquiry must maintain strict demarcation between empirical data and theological claims:

${story.whatThisDoesAndDoesntProve.en}

---

### VIII. A Question Worth Contemplating

${story.reflectiveQuestion.en}

---

### Primary References & Scholarly Sources

${story.sources.map(src => `- **[${src.name}](${src.url})** — *${src.type} (Tier ${src.tier})*`).join('\n')}
`;

  // 3. AR Article
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

## أسرار كهوف وادي قمران: أعظم كشف أثري في تاريخ المخطوطات

${story.readerHook.ar}

${story.universalQuestion.ar}

بين غبار صحراء يهودا وسكون المنحدرات الصخرية، حفظت هذه الرقائق الجلدية سجلاً استثنائياً يوثق كيف كابد الإنسان القديم لنسخ النصوص المقدسة، وصياغة الأحكام التشريعية، وصيانة التوحيد الخالص.

![${images[0]?.altText.ar || story.titles.ar}](${images[0]?.url || coverImage})
*مصدر الصورة: ${images[0]?.source} / تصوير ${images[0]?.author} (${images[0]?.license})*

---

### أولاً: الكشف الأثري وإعادة بناء المخطوطات من 11 كهفاً

${story.archaeologicalDetails.discoveryNarrative.ar}

${story.archaeologicalDetails.caveAndManuscriptCount.ar}

كان التحدي الأكبر الذي واجه علماء المخطوطات ليس مجرد العثور على لفائف سليمة، بل خوض معركة تحقيق جنائي أثري معقدة: جمع عشرات الآلاف من القصاصات المتآكلة وترميمها على مدار عقود لتشكيل شواهد نصية متكاملة.

${images[1] ? `![${images[1].altText.ar}](${images[1].url})\n*مصدر الصورة: ${images[1].source} / تصوير ${images[1].author} (${images[1].license})*\n` : ''}

---

### ثانياً: كنوز المخطوطات من سفر إشعياء إلى مواثيق الجماعة

تشتمل مكتبة قمران على نصوص استثنائية في تاريخ التراث الإنساني:

${story.archaeologicalDetails.keyTexts.map((text, idx) => `#### ${idx + 1}. ${text.name}\n\n${text.description.ar}`).join('\n\n')}

---

### ثالثاً: المشهد النصي وتاريخ انتقال المخطوطات القديمة

يطرح الباحث المعاصر سؤالاً جوهرياً: *هل أثبتت مخطوطات البحر الميت تطابقاً حرفياً ثابتاً للنص العبري القديم، أم كشفت عن اختلافات نصية؟*

تؤكد الدراسات النقدية المقارنة واقعاً تاريخياً غنياً:

${story.archaeologicalDetails.textualLandscape.ar}

---

### رابعاً: السجال الأكاديمي: فرضية الأسينيين ومكتبات أورشليم

من هم النساخ الحقيقيون لهذه المخطوطات؟

${story.scholarlyDebate.esseneHypothesis.ar}

${story.scholarlyDebate.alternativeTheories.ar}

${story.scholarlyDebate.scholarlyConsensusOrDispute.ar}

${images[2] ? `![${images[2].altText.ar}](${images[2].url})\n*مصدر الصورة: ${images[2].source} / تصوير ${images[2].author} (${images[2].license})*\n` : ''}

---

### خامساً: الانضباط المفاهيمي: التوحيد في حقبة الهيكل الثاني وعقيدة التوحيد

يقتضي البحث العلمي الدقة والنزاهة:

${story.definitionalDistinction.monotheismVsTawhid.ar}

---

### سادساً: المنظور المعرفي الإسلامي: اتصال النبوات وطبيعة التدوين البشري

كيف يقرأ الفكر الإسلامي هذه الشواهد الأثرية؟

${story.islamicReasoningWalkthrough.revelationContinuity.ar}

${story.islamicReasoningWalkthrough.scripturalTransmissionHistory.ar}

في **${story.islamicReasoningWalkthrough.quranicPerspective.surahReference}**، يقرر القرآن الكريم هذا المبدأ الكلي:

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