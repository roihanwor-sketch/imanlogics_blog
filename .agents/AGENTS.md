# Project-Scoped Rules

## Next.js HMR Cache Conflict Resolution

- Setiap kali Anda menjalankan kompilasi/build produksi (`npm run build` atau `next build`), Anda **HARUS** segera:
  1. Menghentikan Next.js development server yang sedang berjalan (jika ada).
  2. Menghapus folder cache `.next/` secara total menggunakan perintah `Remove-Item -Recurse -Force .next` (di Windows PowerShell) atau `rm -rf .next` (di UNIX/bash).
  3. Menjalankan ulang development server (`npm run dev`) setelah cache dibersihkan (hanya jika server sebelumnya sedang aktif atau diminta pengguna).
- Langkah ini wajib dilakukan untuk mencegah crash memori webpack dev server dengan error `MODULE_NOT_FOUND` atau `Internal Server Error` setelah build selesai.

## Standarisasi Eksekusi Otomasi Konten & Pipeline Otonom (Universal Trigger: "Jalankan")

- Jika pengguna memberikan perintah yang mengandung kata **"jalankan"** (misalnya: _"jalankan"_, _"jalankan sekarang"_, _"jalankan otomasi"_, _"jalankan pipeline"_, dll.):

  1. **JANGAN Menyalakan Server Lokal Secara Otomatis:**
     - Karena hasil artikel yang diterbitkan langsung di-push ke GitHub (`origin main`), **TIDAK PERLU** menyalakan Next.js Dev Server maupun Decap CMS Proxy Server.
     - Server lokal **HANYA dinyalakan jika pengguna secara eksplisit meminta**: _"nyalakan server"_, _"jalankan dev server"_, _"start server"_, atau _"nyalakan CMS"_.

  2. **Dual-Mode Autonomous Operation (Eksklusif Sesuai Kondisi Jendela):**
     - **MODE 1 (Live Session - Saat Jendela Antigravity Terbuka & Aktif):**
       - **Menggunakan Native Cron Antigravity (`schedule` tool)**:
         1. **Cron Riset & Editorial 3-Jam**: Pada interval T-15 menit (`45 2,5,8,11,14,17,20,23 * * *`).
         2. **Cron Diseminasi WhatsApp 12-Jam**: Tepat pada pukul 05:00 & 17:00 WIB (`0 5,17 * * *`).
       - **JANGAN menyalakan `scheduler-daemon.ts` di OS background secara bersamaan** untuk mencegah redundansi proses dan konflik file lock.
       - AI Antigravity di jendela ini bertindak sebagai **Editor-in-Chief, Gatekeeper, Guardrail, dan Validator** kognitif utama.
       - Setiap kali terbangun (*Reactive Wakeup*), AI Antigravity mengeksekusi 8 Tahap Editorial secara sadar di jendela ini:
         1. **Tahap 1:** Memanggil `imanlogics_discover_stories` untuk mendapatkan kandidat berita dari 75 Media Pool & Arsip Primer.
         2. **Tahap 2:** Menelaah dan menyetujui topik/angle artikel (**Gate 1 & Gate 2**: Novelty & Anti-Duplikasi).
         3. **Tahap 3:** Memanggil `imanlogics_verify_sources` dan melakukan audit kognitif bukti (**Gate 3**: Dual-Tier Citations & Epistemological Rigor).
         4. **Tahap 4:** Menyusun nalar artikel trilingual (ID, EN, AR) dengan *Native Thinking* dan kedalaman analisis (**Gate 4**: Purity & Zero Leaks).
         5. **Tahap 5 (Unduh & Validasi VLM Nyata):** Skrip mengunduh aset visual fisik ke disk. AI Antigravity **WAJIB membuka file biner gambar (`view_file`) dan melihat langsung piksel visualnya secara VLM** untuk memastikan gambar benar-benar sesuai dengan subjek artikel (menolak tegas gambar vintage/anachronistic, scan usang, atau logo yang tidak relevan) beserta atribusi lisensinya (**Gate 5**: VLM Visual Relevance & Physical Assets).
         6. **Tahap 6:** Memvalidasi skema frontmatter, metadata taksonomi, dan grup terjemahan (**Gate 6**: Schema Integrity).
         7. **Tahap 7 (Render & Audit Webpage Nyata):** Skrip me-render file `.html` pratinjau utuh (Full DOM Webpage Proof: Navbar, Header Glassmorphism, Konten MDX, Matriks Bukti, Footer). AI Antigravity **WAJIB mengaudit file HTML utuh tersebut dari header hingga footer** untuk memastikan 0% teks placeholder `25%`, 0% nomor romawi `### I.`, dan 15 Hard Gates lolos sempurna (**Gate 7**: Skor QC $\ge 85$).
         8. **Tahap 8:** Menulis file MDX final ke `data/blog/`, memanggil `imanlogics_sync_git` untuk melakukan `git add`, `git commit`, dan `git push origin main`.
         9. **Tahap 9 (Diseminasi WhatsApp):** Jika waktu berada di slot **05:00** atau **17:00 WIB**, memanggil `imanlogics_dispatch_notification` untuk mengirim ringkasan ke nomor **085335329341**.
     - **MODE 2 (Headless CLI - HANYA Saat Jendela Antigravity Ditutup/Standalone):**
       - Scheduler daemon Node.js (`scripts/scheduler-daemon.ts`) memantau ritme 3 jam di latar belakang OS.
       - Eksekusi penalaran kognitif didelegasikan ke `agy.exe -p` (Antigravity CLI Bridge) dengan evaluasi kognitif pada Gate 3 (Sitasi), Gate 4 (Nalar), Gate 5 (VLM Visual-Semantic), Gate 6 (Skema), dan Gate 7 (15 Hard Gates $\ge 85$) sehingga mutunya 100% identik dengan Mode 1.

  3. **Diseminasi Notifikasi WhatsApp (Hanya 05:00 & 17:00 WIB):**
     - Notifikasi WhatsApp **TIDAK dikirim setiap 3 jam**, melainkan mengagregasi seluruh aktivitas riset 12 jam terakhir dan dikirimkan khusus pada pukul **05:00** dan **17:00** ke nomor pribadi **085335329341** menggunakan integrasi WhatsApp yang tersedia di `D:\KULIAH\AGENT\src\wa_dispatcher.py` melalui bridge Base64 anti-collision.

  4. **Laporkan Status Komprehensif:**
     - Berikan konfirmasi status kesiapan ImanLogics MCP Server & Scheduler, ringkasan artikel trilingual yang diproses QC, status Git push ke GitHub, serta jadwal siklus berikutnya.

## Eksekusi Server Lokal (Hanya Saat Diminta Eksplisit: "Nyalakan Server")

- Jika pengguna secara eksplisit meminta untuk menyalakan server lokal (misalnya: _"nyalakan server"_, _"jalankan kedua server"_, _"nyalakan dev server dan CMS"_, _"start web server"_):
  1. **Next.js Dev Server:** Bersihkan cache `.next` terlebih dahulu lalu jalankan di background task: `Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue; npm.cmd run dev` (`http://localhost:3000`).
  2. **Decap CMS Proxy Server:** Jalankan di background task: `npx.cmd decap-server` (`http://localhost:3000/admin`).
  3. Laporkan URL akses lokal dev server dan CMS admin kepada pengguna.

## Protokol Interaksi, Audit & Analisis: Jawab dan Laporkan Terlebih Dahulu (Strict Report-First)

- **Jawab Pertanyaan & Sajikan Laporan Terlebih Dahulu:**
  - Setiap kali pengguna bertanya sesuatu, meminta audit, atau meminta analisis: AI **WAJIB** menjawab pertanyaan secara langsung dan memberikan laporan analisis temuan secara transparan terlebih dahulu.
- **Larangan Modifikasi Kode & Build Sebelum Persetujuan:**
  - AI **DILARANG KERAS** menyentuh kode, mengedit berkas, atau menjalankan perintah build (`npm run build`, `next build`, dll.) sebelum memberikan laporan lengkap kepada pengguna dan mendapatkan persetujuan/instruksi eksplisit.
- **Mode Analisis Read-Only:**
  - Selama fase audit dan analisis, seluruh proses inspeksi berkas, perayapan data, dan pengecekan logika harus dilakukan dalam mode *read-only* (hanya membaca data tanpa mengubah berkas proyek).

