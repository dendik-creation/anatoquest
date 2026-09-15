# Fondasi Implementasi dan Reuse

## Tujuan dan batas bukti

Dokumen ini menerjemahkan pola implementasi yang dapat dipakai ulang ke
AnatoQuest. Ia menjadi landasan untuk pekerjaan React, Phaser, layout, dan
komponen setelah dibaca bersama dokumen desain yang relevan.

Status saat ini harus dibaca secara tepat:

- `IMPLEMENTED`: `app/` adalah bootstrap React + Vite + TypeScript dengan
  Splash, host Phaser yang diimpor secara lazy, dan `BootstrapScene`.
- `PLANNED/PROPOSED`: AppShell, navigasi in-memory lengkap, OrientationGuard,
  Stage, bridge bertipe, shell aktivitas, dan scene pembelajaran belum ada.
- `NOT A TRANSFER`: palet, nilai warna, font, teks, aset, atau konten dari
  proyek rujukan. AnatoQuest tetap memakai token, arah seni, dan konten yang
  disetujui dalam `docs/design/` dan `docs/prd/`.

Jangan menyebut mekanik yang belum dibangun sebagai simulasi Phaser hanya karena
arsitektur ini menyiapkannya.

## Prinsip renderer: React terlebih dahulu, Phaser bila perlu

```text
Browser viewport
  -> React AppShell
     -> navigasi internal, guard orientasi, preferensi, aksesibilitas
     -> narasi, menu, kartu, evaluasi, feedback, dan UI prosedur
     -> host aktivitas
        -> workspace DOM (default untuk teks/kartu/hotspot/form)
        -> Phaser (hanya visual atau mekanik spasial yang terus dirender)
```

Gunakan DOM/React untuk teks yang harus terbaca, diterjemahkan, diseleksi,
dites, atau memiliki pola form. Gunakan Phaser untuk eksplorasi anatomi,
animasi lintasan, drag spasial yang padat, objek bergerak, partikel, atau efek
canvas yang memberi nilai belajar nyata. React tetap memiliki chrome, status
semantik, instruksi, skor, dan alternatif aksesibel.

Tidak boleh ada scene Phaser per langkah konten yang sederhana. Satu scene atau
adapter aktivitas bersama menerima konfigurasi `stageId`/`activityId`; data
menentukan langkah dan mekanik yang sedang aktif.

## Konvensi Stage 16:9 yang aman

AnatoQuest membutuhkan lanskap dan memiliki banyak layar yang diarahkan oleh
artwork. Terapkan komponen `Stage` sebelum memperbanyak halaman art-directed.
Konvensi targetnya dua lapis yang konsentris dengan `aspect-ratio: 16 / 9`:

| Lapisan | Ukuran | Isi yang diperbolehkan |
| --- | --- | --- |
| Background dekoratif | `cover` | Atmosfer, bleed, dan ilustrasi yang aman bila terpotong. |
| Safe layer | `contain` | Teks, tombol, label, kartu, hotspot, dan target interaksi. |

Safe layer memakai `container-type: inline-size` agar ukuran mengikuti stage
yang benar-benar terlihat, bukan tinggi/lebar viewport yang berubah. Letakkan
interaksi yang harus tepat di atas ilustrasi bersama artwork tajamnya pada safe
layer yang sama. Jangan menyamakan koordinat lapisan `cover` dengan `contain`
pada viewport non-16:9.

### Koordinat artwork

`PROPOSED`: gunakan frame authoring 1920 x 1080 untuk artwork interaktif baru.
Simpan geometri sebagai data, lalu konversi dengan helper berikut:

```ts
export const S = (px: number) => `${(px / 1920) * 100}cqw`
export const T = (px: number, floorPx: number) =>
  `max(${floorPx}px, ${(px / 1920) * 100}cqw)`

export type FrameRect = { x: number; y: number; width: number; height: number }
export const rectStyle = ({ x, y, width, height }: FrameRect) => ({
  position: 'absolute' as const,
  left: S(x), top: S(y), width: S(width), height: S(height),
})
```

Gunakan `S()` untuk geometri dan `T()`/`max()` untuk teks serta garis tipis agar
tetap dapat digunakan pada layar lanskap kecil. Bila informasi terlalu padat,
sembunyikan dekorasi sekunder atau gunakan panel kontekstual; jangan mengecilkan
target di bawah 44 x 44 CSS px. Frame 1920 x 1080 adalah konvensi geometri,
bukan ukuran file, ukuran canvas Phaser, atau alasan untuk memaksa konten DOM
menjadi koordinat absolut.

## Shell, token, dan aksesibilitas

Bangun shell aktivitas yang memegang navigasi, progres, audio, transisi,
pengumuman `aria-live`, dan penyelesaian. Workspace mekanik hanya memegang state
sementara dan memanggil callback seperti `setFeedback`, `setVisualState`, atau
`complete`. Key workspace dengan ID aktivitas agar state sementara ter-reset
saat langkah berganti.

```text
AppShell -> OrientationGuard -> scene internal
  -> ActivityFrame / ProcedureStageShell
     -> header + progress + instructions
     -> DOM workspace atau PhaserCanvasHost
     -> feedback ilmiah + CTA lanjut + aria-live
```

Sebelum membuat fitur, pusatkan token semantik untuk warna, permukaan, teks,
status, fokus, radius, motion, dan target sentuh. Referensi token dan nilai
AnatoQuest yang berwenang adalah `docs/design/00-design-system.md` serta
`docs/design/01-color-and-typography.md`; feature tidak boleh membawa palet
mentah sendiri. Nilai yang tampak pada contoh proyek lain tidak boleh disalin.

Setiap primitive interaktif memakai elemen semantik (`button`, input, atau
link), nama aksesibel, fokus yang terlihat, dan target minimal 44 px. Orientasi
portrait harus mengunci input/fokus di bawahnya, memberi pesan teks yang dapat
diumumkan, serta mem-pause aktivitas canvas. Motion harus mematuhi reduced
motion; feedback tidak boleh hanya berupa warna atau animasi.

## Cara menerapkan per fase

1. Tambahkan AppShell dan `OrientationGuard` sebelum scene pembelajaran baru.
2. Tambahkan `Stage` hanya pada layar yang memang memakai artwork fixed-frame;
   gunakan grid responsif biasa untuk reading/form layout.
3. Bangun primitive yang kecil dan aksesibel (`Button`, `IconButton`, `Panel`,
   `FeedbackPanel`, `ActivityFrame`) sebelum variasi halaman.
4. Pilih renderer per mekanik dengan tabel ownership di
   `../design/03-component-system.md`.
5. Gunakan kontrak data pada dokumen berikutnya untuk semua aktivitas baru.

## Rujukan terkait

- Layout dan guard: `../design/02-layout-and-responsive.md`
- Komponen: `../design/03-component-system.md`
- React--Phaser: `../design/09-react-phaser-architecture.md`
- Performa: `../design/10-performance-strategy.md`
- Kontrak data: `01-interaction-and-content-contracts.md`
