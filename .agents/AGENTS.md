# Project-Scoped Rules

## Next.js HMR Cache Conflict Resolution

- Setiap kali Anda menjalankan kompilasi/build produksi (`npm run build` atau `next build`), Anda **HARUS** segera:
  1. Menghentikan Next.js development server yang sedang berjalan (jika ada).
  2. Menghapus folder cache `.next/` secara total menggunakan perintah `Remove-Item -Recurse -Force .next` (di Windows PowerShell) atau `rm -rf .next` (di UNIX/bash).
  3. Menjalankan ulang development server (`npm run dev`) setelah cache dibersihkan.
- Langkah ini wajib dilakukan untuk mencegah crash memori webpack dev server dengan error `MODULE_NOT_FOUND` atau `Internal Server Error` setelah build selesai.

## Standarisasi Eksekusi Otomasi, Server Lokal & WhatsApp Notifier (Universal Trigger: "Jalankan")

- Jika pengguna memberikan perintah yang mengandung kata **"jalankan"** (misalnya: _"jalankan"_, _"jalankan sekarang"_, _"jalankan otomasi"_, _"jalankan kedua server"_, _"nyalakan dev server dan CMS"_, dll.), Anda **HARUS** segera:
  1. **Nyalakan Server Lokal (Paralel di Background Task jika belum aktif):**
     - **Next.js Dev Server:** Bersihkan cache `.next` terlebih dahulu lalu jalankan: `Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue; npm.cmd run dev` (di Windows PowerShell).
     - **Decap CMS Proxy Server:** Jalankan: `npx.cmd decap-server` (di Windows).
  2. **Aktifkan Scheduler & Pipeline Otomasi Konten:**
     - Jalankan scheduler otonom: `npx.cmd tsx scripts/scheduler-daemon.ts` di background task (atau eksekusi langsung `npm.cmd run auto:publish`).
     - Scheduler berjalan secara berkala setiap hari pada pukul **05:00** dan **17:00** mengikuti jam dan timezone sistem Windows secara dinamis.
     - Melakukan sinkronisasi: **Discover → Research → Dual-Tier Verify → Trilingual MDX Build (ID/EN/AR) → Copyright-Safe Image Sourcing → Multi-dimensional QC (>=85) → Git Commit & Push**.
     - Jika artikel lolos QC: Otomatis melakukan `git add`, `git commit`, dan `git push origin main`.
     - Jika tidak ada berita aktual atau QC gagal: Mengeluarkan status `NO_PUBLISHABLE_STORY` (tanpa membuat artikel filler atau push kosong).
  3. **Diseminasi Notifikasi WhatsApp:**
     - Mengirimkan ringkasan status operasional ke nomor pribadi **085335329341** menggunakan integrasi WhatsApp yang tersedia di `D:\KULIAH\AGENT\src\wa_dispatcher.py`.
  4. **Laporkan Status Komprehensif:**
     - Berikan konfirmasi status aktif dev server (`http://localhost:3000`), CMS admin (`http://localhost:3000/admin`), ringkasan artikel trilingual yang diproses QC, status Git push, serta jadwal siklus berikutnya.
