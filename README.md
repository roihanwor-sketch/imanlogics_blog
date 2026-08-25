<div align="center">

# 🌐 ImanLogics Blog

### *Autonomous Editorial, Tech News Intelligence & Islamic Rationality System*

[![Live Website](https://img.shields.io/badge/Live-blog.imanlogics.web.id-0ea5e9?style=for-the-badge&logo=google-chrome&logoColor=white)](https://blog.imanlogics.web.id)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Contentlayer2](https://img.shields.io/badge/Contentlayer-2-purple?style=for-the-badge)](https://contentlayer.dev/)
[![Decap CMS](https://img.shields.io/badge/Decap_CMS-v3-orange?style=for-the-badge&logo=netlify&logoColor=white)](https://decapcms.org/)
[![WhatsApp Notifier](https://img.shields.io/badge/WhatsApp-Integrated-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://whatsapp.com)

<p align="center">
  <b>ImanLogics Blog</b> adalah platform publikasi digital trilingual (Indonesia, English, العربية) berstandar jurnalisme teknologi modern dan kajian rasionalitas Islam yang digerakkan oleh pipeline editorial otonom (<b>Antigravity Autonomous Engine</b>).
</p>

---

</div>

## 📌 Fitur Unggulan Sistem

```
                                  [ AUTONOMOUS NEWS & ACADEMIC DISCOVERY ]
                 ┌──────────────────────────────────┴──────────────────────────────────┐
                 ▼                                                                     ▼
    [ Tech News Intelligence ]                                            [ Islamic Logic & History ]
    • Breaking News & 24h Recency Score                                   • Intellectual Storytelling (Non-Preachy)
    • Tier 1 & Tier 2 Dual-Source Hierarchy                               • Ancient Manuscripts & Radiocarbon Evidence
    • Entity & Semantic Anti-Duplicate                                    • Epistemological Boundaries
                 └──────────────────────────────────┬──────────────────────────────────┘
                                                    ▼
                                  [ COPYRIGHT-SAFE IMAGE INTELLIGENCE ]
                                  • Wikimedia Commons / Unsplash Verified / Public Domain
                                  • Trilingual Alt-Text (ID / EN / AR) & Photographer Credits
                                                    ▼
                                  [ TRILINGUAL EDITORIAL LOCALIZATION ]
                                  • 🇮🇩 Bahasa Indonesia  (Jurnalistik Modern)
                                  • 🇬🇧 English           (Native Long-Form Tech Journalism)
                                  • 🇸🇦 العربية          (العربية الفصحى الحديثة)
                                                    ▼
                                  [ MULTIDIMENSIONAL QC GATEKEEPER ]
                                  • Nilai Kelulusan: >= 85/100
                                  • Zero-Filler Policy (Anti-Klise AI) & Anti-Hallucination
                                                    ▼
                                  [ FAIL-SAFE PUBLISHER & SYNC ]
                   ┌────────────────────────────────┴────────────────────────────────┐
                   ▼                                                                 ▼
          [ QC PASS (>= 85) ]                                            [ NO VALID STORY ]
          • Save MDX into data/blog/                                     • Status: NO_PUBLISHABLE_STORY
          • Git Auto Commit & Push                                       • 0 Artikel Sampah / Filler
                   └────────────────────────────────┬────────────────────────────────┘
                                                    ▼
                                  [ DYNAMIC WHATSAPP NOTIFIER ]
                                  • Jadwal: 05:00 & 17:00 Waktu Lokal PC (Dynamic Timezone)
                                  • Kirim Ringkasan & Tautan Langsung ke 085335329341
```

---

## 🛠️ Rangkaian Tools Otomasi (`scripts/`)

| File / Modul | Deskripsi & Fungsi Utama |
| :--- | :--- |
| **[`scripts/tech-researcher.ts`](scripts/tech-researcher.ts)** | **Tech News Intelligence Engine:** Memindai pengumuman resmi teknologi terkini (Semikonduktor, AI Model, Hardware, Chipset) dari Tier 1 (Official Newsroom/JEDEC) dan Tier 2 (Reuters/The Verge/Ars Technica) dengan skor resensi dinamis (0–6 jam, 24 jam). |
| **[`scripts/islamic-logic-researcher.ts`](scripts/islamic-logic-researcher.ts)** | **Islamic Academic & Storytelling Engine:** Meneliti temuan arkeologi naskah kuno (Birmingham, Dead Sea Scrolls), penanggalan ilmiah, dan kajian rasionalitas wahyu dengan gaya narasi memikat yang ramah bagi non-Muslim, skeptis, dan Muslim awam. |
| **[`scripts/image-researcher.ts`](scripts/image-researcher.ts)** | **Image Intelligence Module:** Menemukan 2–4 gambar beresolusi tinggi per artikel dengan verifikasi lisensi legal (Unsplash, Wikimedia CC-BY, Public Domain), atribusi fotografer lengkap, dan alt-text trilingual. |
| **[`scripts/article-builder-qc.ts`](scripts/article-builder-qc.ts)** | **Editorial MDX Builder & QC Gatekeeper:** Menghasilkan artikel trilingual terstruktur (Piramida Terbalik), menerapkan *Zero-Filler Policy*, dan menguji mutu artikel (skor minimal 85/100). |
| **[`scripts/scheduler-daemon.ts`](scripts/scheduler-daemon.ts)** | **Autonomous Scheduler Daemon:** Menjalankan pipeline otomatis setiap pukul **05:00** dan **17:00** waktu lokal PC dengan deteksi zona waktu Windows dinamis dan proteksi anti-duplikasi proses (*singleton lock*). |
| **[`scripts/wa-notifier.ts`](scripts/wa-notifier.ts)** | **WhatsApp Dispatcher Bridge:** Terhubung ke engine `D:\KULIAH\AGENT\src\wa_dispatcher.py` untuk mengirimkan laporan operasional dan tautan live artikel ke **085335329341** menggunakan enkripsi transport Base64. |
| **[`scripts/tests/pipeline.test.ts`](scripts/tests/pipeline.test.ts)** | **Automated Test Suite:** Pengujian unit dan integrasi untuk seluruh modul pipeline (Recency, Lisensi Gambar, Multidimensional QC, Zero-Filler, dan Storytelling Architecture). |

---

## 🚀 Universal Start Trigger ("Jalankan")

Sistem telah distandarisasi pada [`.agents/AGENTS.md`](.agents/AGENTS.md). Cukup berikan perintah:

> **"jalankan"** *(atau "jalankan otomasi", "nyalakan server dan CMS")*

Sistem Antigravity akan secara otomatis:
1. Membersihkan cache `.next` dan menyalakan **Next.js Dev Server** di `http://localhost:3000`.
2. Menyalakan **Decap CMS Proxy Server** di `http://localhost:8081` (Admin UI di `http://localhost:3000/admin`).
3. Mengaktifkan **Autonomous Scheduler Daemon** di latar belakang.
4. Mengeksekusi pipeline riset, verifikasi, generasi MDX trilingual, pengujian QC, dan auto-push Git ke GitHub.
5. Mengirimkan notifikasi ringkasan lengkap ke WhatsApp pribadi Anda.

---

## 💻 Panduan Perintah CLI (NPM Scripts)

```bash
# 1. Jalankan development server lokal
npm run dev

# 2. Jalankan Decap CMS proxy lokal
npm run cms:proxy

# 3. Jalankan pipeline publikasi otonom 1x siklus
npm run auto:publish

# 4. Jalankan daemon penjadwal (05:00 & 17:00 lokal)
npm run scheduler

# 5. Jalankan automated test suite (24 assertions)
npm run test:pipeline

# 6. Kompilasi build produksi Next.js
npm run build
```

---

## 📁 Struktur Direktori Proyek

```text
imanlogics_blog/
├── .agents/
│   └── AGENTS.md                  # Standarisasi aturan agen & universal trigger "jalankan"
├── .github/
│   └── workflows/
│       ├── pages.yml              # GitHub Actions deploy ke blog.imanlogics.web.id
│       └── auto-blog-cron.yml     # Standalone cron runner pipeline
├── app/                           # Next.js App Router (Layouts, Pages, Tag Routes)
├── components/                    # UI Components (Header, Footer, Card, MDXComponents)
├── data/
│   ├── blog/                      # Konten artikel MDX trilingual (.mdx, .en.mdx, .ar.mdx)
│   ├── authors/                   # Profil penulis (default.mdx)
│   ├── global.json                # Pengaturan tema, brand, dan footer navigasi
│   └── siteMetadata.js            # Konfigurasi metadata blog & SEO
├── layouts/                       # Layout template (PostLayout, ListLayout, AuthorLayout)
├── public/
│   ├── admin/                     # Decap CMS Admin UI (index.html, config.yml)
│   └── static/images/             # Aset gambar statis, logo, dan social banners
├── scripts/                       # Rangkaian modul otomasi & backend editorial
│   ├── tech-researcher.ts         # Tech News Intelligence
│   ├── islamic-logic-researcher.ts# Islamic Academic & Storytelling Engine
│   ├── image-researcher.ts        # Copyright-Safe Image Intelligence
│   ├── article-builder-qc.ts      # Trilingual Builder & Multidimensional QC
│   ├── auto-publisher-cron.ts     # Orchestrator & Git Sync
│   ├── scheduler-daemon.ts        # Scheduler 05:00 & 17:00 dinamis
│   ├── wa-notifier.ts             # WhatsApp Notification Bridge
│   └── tests/
│       └── pipeline.test.ts       # Test suite otomatis
├── contentlayer.config.ts         # Skema Contentlayer2 (Blog & Authors)
├── package.json                   # Konfigurasi paket & scripts
└── tsconfig.json                  # Konfigurasi TypeScript
```

---

## 📱 Format Laporan Notifikasi WhatsApp

Setiap kali siklus otomasi selesai, laporan dikirimkan secara otomatis dalam format yang rapi:

```text
*📊 [IMAN LOGICS BLOG — AUTONOMOUS REPORT]*
━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 *Waktu Lokal PC:* Selasa, 25 Agustus 2026, 14.06.02
🌐 *Zona Waktu:* Asia/Jakarta (UTC+7)
⚙️ *Status Sistem:* 🟢 SUCCESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━

📰 *ARTIKEL BARU DITERBITKAN:*
Total 12 versi artikel (ID, EN, AR) lolos QC 100/100:

💻 *Tech & AI Intelligence:*
*1. Samsung Resmi Luncurkan Memori LPDDR6 untuk AI On-Device*
  🇮🇩 ID: https://blog.imanlogics.web.id/blog/samsung-lpddr6-on-device-ai
  🇬🇧 EN: https://blog.imanlogics.web.id/blog/samsung-lpddr6-on-device-ai.en
  🇸🇦 AR: https://blog.imanlogics.web.id/blog/samsung-lpddr6-on-device-ai.ar

📜 *Islamic Logic & Academic:*
*1. Mengapa Manuskrip Kuno Ini Membuat Sejarah Al-Qur'an Semakin Menarik?*
  🇮🇩 ID: https://blog.imanlogics.web.id/blog/birmingham-quran-radiocarbon-analysis
  🇬🇧 EN: https://blog.imanlogics.web.id/blog/birmingham-quran-radiocarbon-analysis.en
  🇸🇦 AR: https://blog.imanlogics.web.id/blog/birmingham-quran-radiocarbon-analysis.ar

🚀 *Status Git Sync:* ✅ Ter-push ke branch main (origin/main)

⏰ *Siklus Otomasi Berikutnya:* 17:00 (Sore Ini)
🌐 *Website Utama:* https://blog.imanlogics.web.id
━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Laporan otomatis ditenagai oleh Antigravity Autonomous Engine._
```

---

## 🌐 Lisensi & Hak Cipta

© 2026 **Iman Logics**. All rights reserved.  
Dikelola sebagai *Digital Garden* dan diterbitkan melalui domain [blog.imanlogics.web.id](https://blog.imanlogics.web.id).
