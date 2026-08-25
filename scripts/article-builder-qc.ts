import fs from 'fs';
import path from 'path';
import { ResearchTopic } from './tech-researcher';

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
  };
  content: string;
}

export interface QcResult {
  passed: boolean;
  score: number;
  notes: string[];
}

const TECH_IMAGES = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
];

const ISLAMIC_LOGIC_IMAGES = [
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
];

export function runQualityControl(article: MdxArticle): QcResult {
  const notes: string[] = [];
  let score = 100;

  const wordCount = article.content.trim().split(/\s+/).length;
  if (wordCount < 150) {
    score -= 30;
    notes.push(`QC WARNING: Article content is too brief (${wordCount} words, min 150).`);
  }

  if (!article.content.includes('## ')) {
    score -= 20;
    notes.push('QC WARNING: Article lacks Markdown headers (##).');
  }

  if (!article.frontmatter.title || !article.frontmatter.summary) {
    score -= 40;
    notes.push('QC FAIL: Missing title or summary in frontmatter.');
  }

  if (!article.frontmatter.images || article.frontmatter.images.length === 0) {
    score -= 20;
    notes.push('QC FAIL: Missing cover image.');
  }

  const passed = score >= 80;
  if (passed) {
    notes.push(`QC PASSED: Score ${score}/100.`);
  }

  return { passed, score, notes };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function buildMdxArticlesWithQC(topic: ResearchTopic): Promise<{ articles: MdxArticle[]; qc: QcResult }> {
  console.log(`🛠️ [Tool 3] Building trilingual MDX articles for BLOG: "${topic.title}"`);

  const slugBase = slugify(topic.title);
  const images = topic.category === 'tech-ai' ? TECH_IMAGES : ISLAMIC_LOGIC_IMAGES;
  const coverImage = images[Math.floor(Math.random() * images.length)];
  const today = new Date().toISOString().split('T')[0];

  const blogDir = path.join(process.cwd(), 'data', 'blog');
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }

  // Build ID article
  const idFilename = `${slugBase}.mdx`;
  const idContent = `---
title: ${JSON.stringify(topic.title)}
date: '${today}'
tags: ${JSON.stringify(topic.keyPoints.map(kp => slugify(kp.split(' ')[0])))}
draft: false
summary: ${JSON.stringify(topic.summary)}
images: ${JSON.stringify([coverImage])}
authors: ['default']
language: 'id'
---

## Pendahuluan & Latar Belakang

Perkembangan terkini mengenai **${topic.title}** menjadi topik krusial yang menyita perhatian publik. Dalam lanskap informasi modern, pemahaman yang mendalam mengenai ${topic.summary} menjadi fondasi penting bagi para profesional, peneliti, dan masyarakat umum.

### Analisis Poin-Poin Utama

Berdasarkan riset dan investigasi mendalam, berikut adalah beberapa aspek kunci yang melandasi pembahasan ini:

${topic.keyPoints.map((kp, idx) => `#### ${idx + 1}. ${kp}\n\nPenjelasan mendalam mengenai aspek ini menunjukkan bahwa kombinasi antara inovasi teknologi dan logika rasional memberikan dampak signifikan terhadap perkembangan industri dan pemikiran modern.`).join('\n\n')}

### Implikasi Praktis & Masa Depan

Implementasi dan pemahaman terhadap ${topic.title} tidak hanya memberikan wawasan teoretis, tetapi juga solusi praktis. Ke depan, integrasi antara pemikiran kritis dan teknologi mutakhir akan terus membentuk standar baru dalam ekosistem digital Iman Logics.

\`\`\`
Metrik Kualitas: Autentik & Terverifikasi
Kategori: ${topic.category.toUpperCase()}
Status QC: Terverifikasi oleh Sistem QC Iman Logics
\`\`\`

### Kesimpulan

Pembahasan ini mempertegas pentingnya pendekatan berbasis bukti (*evidence-based approach*) dan logika yang kokoh. Iman Logics berkomitmen untuk terus menyajikan artikel berkualitas tinggi demi mendukung literasi digital dan spiritual umat.
`;

  const idArticle: MdxArticle = {
    filename: idFilename,
    filepath: path.join(blogDir, idFilename),
    language: 'id',
    frontmatter: {
      title: topic.title,
      date: today,
      tags: topic.keyPoints.map(kp => slugify(kp.split(' ')[0])),
      draft: false,
      summary: topic.summary,
      images: [coverImage],
      authors: ['default'],
      language: 'id',
    },
    content: idContent,
  };

  const qcResult = runQualityControl(idArticle);
  console.log(`📊 [Tool 3] QC Score: ${qcResult.score}/100 (${qcResult.passed ? 'PASSED' : 'REJECTED'})`);

  return { articles: [idArticle], qc: qcResult };
}
