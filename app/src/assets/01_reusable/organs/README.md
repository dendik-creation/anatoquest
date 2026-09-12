# AnatoQuest — Organ Reusable Content v1

Paket PNG transparan untuk SC-04 sampai SC-08. Seluruh aset memakai gaya **clean 2D educational vector** AnatoQuest: bentuk sederhana, outline cyan/putih tipis, gradien lembut, highlight terkontrol, dan tanpa teks pada gambar.

## Spesifikasi

- Jumlah aset: **42 PNG individual**
- Kanvas setiap aset: **1024 × 1024 px**
- Latar: **transparan RGBA**
- Font tidak tertanam karena aset organ tidak memuat label
- Warna sistem mengikuti design system AnatoQuest dan tetap membutuhkan legenda/label teks di UI

## Struktur folder

| Folder | Sistem |
|---|---|
| `01_pernapasan` | Pernapasan |
| `02_sirkulasi_limfatik` | Jantung, pembuluh darah, limfatik |
| `03_pencernaan` | Pencernaan |
| `04_persarafan` | Persarafan |
| `05_perkemihan` | Perkemihan |
| `06_reproduksi` | Reproduksi |
| `07_otot_tulang` | Otot dan tulang |
| `08_indra` | Indra |
| `09_endokrin` | Endokrin |

## Penggunaan di aplikasi

Gunakan PNG sebagai `img`, sprite, atau reusable content. Untuk interaksi organ, jangan mengandalkan warna saja: sertakan nama organ, lokasi, fungsi, state selected/focus, dan alternatif kontrol teks sesuai pedoman aksesibilitas.

`preview_organ_atlas.png` adalah preview cepat seluruh aset dan bukan sumber utama untuk implementasi.
`manifest.csv` berisi nama Indonesia/Inggris, sistem, aksen warna, dan asal aset.
