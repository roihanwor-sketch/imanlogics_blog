import fs from 'fs';
import path from 'path';
import { ResearchTopic } from './tech-researcher';

/**
 * Tool 2: Penyelam Artikel Logic Islam (Islamic Rationality Engine) for BLOG (D:\Projects\BLOG)
 * Researches Islamic rationality topics: miracles of Quran & science, Isa AS in Islam, Dead Sea Scrolls,
 * prophecies of Prophet Muhammad in ancient texts/Bible, rational justification of Islamic rulings.
 */
export async function researchIslamicLogicTopics(): Promise<ResearchTopic[]> {
  console.log('🔍 [Tool 2] Researching fresh Islamic Logic topics for BLOG...');

  const blogDir = path.join(process.cwd(), 'data', 'blog');
  const existingFiles = fs.existsSync(blogDir) ? fs.readdirSync(blogDir) : [];

  const topicCandidates: ResearchTopic[] = [
    {
      title: 'Gulungan Laut Mati (Dead Sea Scrolls) dan Pembenaran Otentisitas Teks Kitab Suci dalam Perspektif Islam',
      summary: 'Mengkaji bagaimana penemuan manuskrip Laut Mati mengonfirmasi narasi Al-Qur\'an mengenai sejarah kenabian dan otentisitas firman Allah.',
      category: 'islamic-logic',
      keyPoints: [
        'Sejarah penemuan manuskrip di Gua Qumran dan korelasinya dengan klaim sejarah',
        'Perspektif Al-Qur\'an tentang penyelarasan nubuat kenabian sebelumnya',
        'Analisis logika historis dan tekstual mengenai transisi pesan tauhid',
      ],
      isViralOrTrending: true,
    },
    {
      title: 'Mukjizat Al-Qur\'an tentang Embriologi Manusia: Bukti Sains Modern & Presisi Linguistik',
      summary: 'Analisis mendalam penjelasan tahapan perkembangan janin dalam Al-Qur\'an Surat Al-Mu\'minun yang selaras dengan temuan medis abad ke-21.',
      category: 'islamic-logic',
      keyPoints: [
        'Istilah *Nutfah*, *\'Alaqah*, dan *Mudghah* dari segi definisi biologi dan bahasa Arab',
        'Tinjauan pakar anatomi modern terhadap presisi istilah Al-Qur\'an',
        'Logika iman: Mengapa penjelasan ini tidak mungkin berasal dari manusia abad ke-7',
      ],
      isViralOrTrending: false,
    },
    {
      title: 'Sosok Nabi Isa AS (Yesus) dalam Al-Qur\'an: Jembatan Logika Antara Kitab-Kitab Samawi',
      summary: 'Membedah konsep tauhid, posisi Nabi Isa AS sebagai rasul agung, dan penyelarasan ajaran moral dalam kitab-kitab terdahulu.',
      category: 'islamic-logic',
      keyPoints: [
        'Konsep mukjizat kelahiran dan kenabian Nabi Isa AS menurut Al-Qur\'an',
        'Pemurnian ajaran monoteisme murni (*Hanif*) tanpa distorsi doktrin',
        'Logika historis mengenai nubuat kedatangan *Ahmad/Muhammad* dalam naskah kuno',
      ],
      isViralOrTrending: true,
    }
  ];

  const filteredTopics = topicCandidates.filter(candidate => {
    const candidateKeywords = candidate.title.toLowerCase().split(' ');
    const isDuplicate = existingFiles.some(file => 
      candidateKeywords.filter(kw => kw.length > 4).some(kw => file.toLowerCase().includes(kw))
    );

    if (isDuplicate && !candidate.isViralOrTrending) {
      console.log(`  └─ Skipping duplicate candidate: "${candidate.title}"`);
      return false;
    }
    return true;
  });

  console.log(`✅ [Tool 2] Found ${filteredTopics.length} fresh Islamic Logic topic(s).`);
  return filteredTopics;
}

if (require.main === module) {
  researchIslamicLogicTopics().then(topics => console.log(JSON.stringify(topics, null, 2)));
}
