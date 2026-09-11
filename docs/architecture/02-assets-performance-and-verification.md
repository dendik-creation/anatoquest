# Aset, Performa, dan Verifikasi

## Status dan arah adopsi

Saat ini `app/src/assets/` hanya memiliki aset bootstrap kecil dan
`assetPreloader.ts` memuat seluruh aset yang terglob. Itu sesuai untuk bootstrap
yang kecil, tetapi bukan pola yang boleh diskalakan ke seluruh materi anatomi,
video, audio, atau model.

`PROPOSED`: asset pipeline per scene/modul, optimizer source-preserving, dan
manifest bertingkat diterapkan sebelum aset pembelajaran skala besar masuk.
Jangan mengklaim resolver WebP, optimizer, atau manifest per-stage telah aktif
sampai kode dan CI-nya benar-benar dibuat serta diverifikasi.

## Taksonomi dan kepemilikan aset

Kontrak tujuan di bawah menjaga reuse sekaligus memisahkan kepemilikan:

```text
app/src/assets/
  00_identity/                  # logo, favicon, maskot, identitas
  01_reusable/                  # ikon, kontrol, umpan balik pendek, UI bersama
  02_scenes/
    01_splash/
    02_home/
    <scene-or-module>/
      backgrounds/
      items/                     # cut-out untuk objek independen
      frames/                    # idle, selected, complete, dst.
```

Direktori bootstrap yang ada memakai `02_scene/` (tunggal). Jangan membuat dua
konvensi baru secara paralel. Saat batch aset berikutnya dimulai, pilih kontrak
di atas dan lakukan migrasi referensi secara atomik; tambahkan pemeriksaan CI
untuk ejaan `backgrounds`, collision nama export, dan path yang tidak sesuai.

Gunakan prefix `00_`, `01_`, dan `02_` sebagai informasi owner/reuse. Simpan
frame state dan cut-out yang dapat dipindahkan di dekat langkah yang memakainya.
Setiap asset harus memiliki inventory ID, deskripsi, tujuan scene, teks alternatif
atau caption bila perlu, lisensi, sumber/prompt generatif bila ada, ukuran
delivery, dan approval seni/SME sesuai `design/06-asset-production-plan.md`.

## Delivery dan optimasi yang aman

Pipeline target menjaga artwork sumber:

1. Scan raster source dan buat kandidat WebP/format modern pada direktori output
   generated yang diabaikan Git; jangan menulis ke source.
2. Cache fingerprint ukuran + mtime, normalisasi EXIF, pertahankan alpha, dan
   tulis ke temporary file sebelum replace atomik.
3. Gunakan hasil generated hanya bila lebih kecil; tangani GIF animasi, error,
   dan collision output secara eksplisit serta gagalkan CI pada error penting.
4. Resolver Vite memilih hasil optimal bila ada dan source fallback bila belum
   dihasilkan. Komponen tidak boleh memiliki cabang `if (webpExists)`.
5. Jalankan optimizer sebelum `bun run build` dalam CI dan dokumentasikan output
   manifestnya.

Pola ini memindahkan strategi, bukan setting kualitas atau angka ukuran dari
proyek lain. Nilai encoder, daftar format, dan budget final harus diukur terhadap
aset serta matriks perangkat AnatoQuest.

## Strategi loading

```text
awal: identitas + shell + Splash/Home pertama
masuk modul: manifest scene saat ini + fallback yang relevan
setelah progres: prefetch modul berikutnya hanya bila kebijakan jaringan mengizinkan
opsional: video, audio, dan media bonus atas permintaan pengguna
```

Preloader harus melaporkan progres yang benar, mendeduplikasi URL, dan tidak
deadlock bila aset dekoratif gagal; tampilkan fallback/retry yang sesuai. Namun
jangan preload seluruh manifest aplikasi pada splash ketika library bertumbuh.
Phaser loader menerima manifest modul yang sama dan melepaskan texture/audio
lokal saat host/scene dihentikan, kecuali aset bersama masih direferensikan.

## Pengujian dan release gate

Tambahkan Playwright untuk matriks lanskap dari ponsel kecil sampai desktop dan
kasus portrait blocker. Untuk screenshot atau bounding box layar art-directed,
tunggu animasi masuk yang terbatas selesai; abaikan pulse/loop tak terbatas agar
tes tidak rapuh.

Setiap fase memeriksa:

- keyboard, touch, focus, alternatif non-drag/non-hover, live feedback, dan
  reduced motion;
- portrait blocking dan pause/resume Phaser;
- loading, fallback, retry, dan pembersihan scene;
- ukuran bundle serta media pada cold/warm entry;
- FPS, input latency, dan memory pada aktivitas canvas yang benar-benar aktif;
- asset path, lisensi, approval medis, dan fallback optimized-source.

Jalankan perintah dari `app/` sesuai `package.json`:

```bash
bun run typecheck
bun run lint
bun run build
bun run test:e2e
```

Jika optimizer sudah diimplementasikan, tambah perintahnya sebelum build dalam
pipeline lokal/CI. Budget dan ambang kelulusan mengikuti
`../design/10-performance-strategy.md` sampai ada keputusan produk yang lebih
otoritatif.
