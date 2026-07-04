# Project-Scoped Rules

## Next.js HMR Cache Conflict Resolution

- Setiap kali Anda menjalankan kompilasi/build produksi (`npm run build` atau `next build`), Anda **HARUS** segera:
  1. Menghentikan Next.js development server yang sedang berjalan (jika ada).
  2. Menghapus folder cache `.next/` secara total menggunakan perintah `Remove-Item -Recurse -Force .next` (di Windows PowerShell) atau `rm -rf .next` (di UNIX/bash).
  3. Menjalankan ulang development server (`npm run dev`) setelah cache dibersihkan.
- Langkah ini wajib dilakukan untuk mencegah crash memori webpack dev server dengan error `MODULE_NOT_FOUND` atau `Internal Server Error` setelah build selesai.

## Perintah Menjalankan Server Lokal (Local Servers Start Command)

- Jika pengguna meminta untuk menjalankan/menyalakan server lokal (misalnya dengan kalimat: _"Jalankan kedua server lokal"_, _"Nyalakan dev server website dan CMS"_, dll.), Anda **HARUS** segera menjalankan dua perintah latar belakang berikut secara paralel:
  1. **Next.js Dev Server:** Bersihkan `.next` terlebih dahulu lalu jalankan dev server dengan perintah `Remove-Item -Recurse -Force .next; npm.cmd run dev` (di Windows PowerShell).
  2. **Decap CMS File System Proxy Server:** Jalankan server proxy lokal dengan perintah `npx.cmd decap-server` (di Windows).
