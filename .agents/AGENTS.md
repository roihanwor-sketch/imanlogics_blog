# Project-Scoped Rules

## Next.js HMR Cache Conflict Resolution

- Setiap kali Anda menjalankan kompilasi/build produksi (`npm run build` atau `next build`), Anda **HARUS** segera:
  1. Menghentikan Next.js development server yang sedang berjalan (jika ada).
  2. Menghapus folder cache `.next/` secara total menggunakan perintah `Remove-Item -Recurse -Force .next` (di Windows PowerShell) atau `rm -rf .next` (di UNIX/bash).
  3. Menjalankan ulang development server (`npm run dev`) setelah cache dibersihkan.
- Langkah ini wajib dilakukan untuk mencegah crash memori webpack dev server dengan error `MODULE_NOT_FOUND` atau `Internal Server Error` setelah build selesai.

## Standarisasi Eksekusi Otomasi & Server Lokal (Universal Trigger: "Jalankan")

- Jika pengguna memberikan perintah yang mengandung kata **"jalankan"** (misalnya: _"jalankan"_, _"jalankan sekarang"_, _"jalankan otomasi"_, _"jalankan kedua server"_, _"nyalakan dev server dan CMS"_, dll.), Anda **HARUS** segera:
  1. **Nyalakan Server Lokal (Paralel di Background Task):**
     - **Next.js Dev Server:** Bersihkan cache `.next` terlebih dahulu lalu jalankan: `Remove-Item -Recurse -Force .next; npm.cmd run dev` (di Windows PowerShell).
     - **Decap CMS Proxy Server:** Jalankan: `npx.cmd decap-server` (di Windows).
  2. **Eksekusi Pipeline Otomasi Konten:**
     - Jalankan pipeline autonomous publisher: `npm.cmd run auto:publish` (atau `npx.cmd tsx scripts/auto-publisher-cron.ts`).
     - Pastikan seluruh proses berjalan tanpa dependensi API eksternal (murni standalone / ditenagai reasoning Antigravity Agent).
  3. **Laporkan Status:**
     - Berikan konfirmasi status aktif dev server (`http://localhost:3000`), CMS admin (`http://localhost:3000/admin`), dan ringkasan artikel yang diproses oleh pipeline QC.
