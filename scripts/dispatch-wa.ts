import { sendWhatsAppNotification } from './wa-notifier'

async function main() {
  console.log('📱 Dispatching WhatsApp notification with updated multi-story report...')
  const success = await sendWhatsAppNotification({
    status: 'SUCCESS',
    articlesPublished: [
      'data/blog/samsung-lpddr6-on-device-ai.mdx',
      'data/blog/nvidia-blackwell-b200-datacenter-benchmarks.mdx',
      'data/blog/qumran-dead-sea-scrolls-monotheism-study.mdx',
    ],
    publishedStories: [
      {
        category: 'tech-ai',
        title:
          'Samsung dan JEDEC Finalisasi Standar LPDDR6: Bandwidth 12.8 Gbps Mengakselerasi AI On-Device Tanpa Latensi Cloud',
        slug: 'samsung-lpddr6-on-device-ai',
        languages: ['id', 'en', 'ar'],
      },
      {
        category: 'tech-ai',
        title:
          'Mengapa NVIDIA Blackwell Bisa Mencapai 30x Performa Inferensi? Membongkar B200, FP4, dan GB200 NVL72',
        slug: 'nvidia-blackwell-b200-datacenter-benchmarks',
        languages: ['id', 'en', 'ar'],
      },
      {
        category: 'islamic-logic',
        title:
          'Apa yang Sebenarnya Diungkap Gulungan Laut Mati tentang Agama Yahudi Sebelum Yesus?',
        slug: 'qumran-dead-sea-scrolls-monotheism-study',
        languages: ['id', 'en', 'ar'],
      },
    ],
    techArticlesCount: 2,
    islamicArticlesCount: 1,
    totalTrilingualArticles: 9,
    qcAverageScore: 98,
    gitPushStatus: 'Ter-push ke origin/main (Commit: 9870cb0)',
    nextCycleTime: '17:00 (Sore Ini)',
  })

  console.log('WhatsApp Dispatch Result:', success ? 'SUCCESS (Delivered)' : 'FAILED')
}

main().catch((err) => {
  console.error('WA Dispatch Error:', err)
  process.exit(1)
})
