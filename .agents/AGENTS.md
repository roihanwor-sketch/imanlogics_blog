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
  2. **Aktifkan Scheduler & Pipeline Otomasi Konten:**
     - Jalankan scheduler otonom / engine MCP: `npx.cmd tsx scripts/scheduler-daemon.ts` (atau `npm.cmd run auto:publish`) di background task untuk memantau siklus otonom 3 jam.
     - **Riset Otonom Berjalan Setiap 3 Jam** (00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00) mengikuti jam dan timezone sistem Windows secara dinamis via core `lib/mcp/orchestrator.ts`.
     - **Strategi Sumber 3 Lapisan:** Layer 1 (Primer: Whitepaper, Standar JEDEC/IEEE, Arsip Manuskrip), Layer 2 (Sekunder: Pool 75 Media ID/EN/AR permanen di `lib/mcp/config/media-pool.ts`), Layer 3 (Discovery: Media Sosial/Forum).
     - Melakukan sinkronisasi: **Discover → Research → 3-Layer Citation Chain Verify → Trilingual MDX Build (ID/EN/AR) → Copyright-Safe Image Sourcing → Multi-dimensional QC (>=85) → Git Commit & Push**.
     - Jika artikel lolos QC: Otomatis melakukan `git add`, `git commit`, dan `git push origin main`.
     - Jika tidak ada berita aktual atau QC gagal: Mengeluarkan status `NO_PUBLISHABLE_STORY` (tanpa membuat artikel filler atau push kosong).
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

