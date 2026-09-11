# Kontrak Interaksi, Konten, dan State

## Aturan utama

Aktivitas AnatoQuest harus data-driven. Konten, aset, geometri, nama aksesibel,
target semantik, jawaban, dan copy feedback tinggal dalam manifest konten;
komponen React atau scene Phaser hanya merender dan menjalankan mekanik.
Konten anatomi, jawaban, serta penjelasan ilmiah wajib melalui jalur review yang
ditetapkan dalam PRD dan `TASKS.md`.

`PROPOSED`: satu langkah memiliki ID stabil dan `kind` diskriminatif. Registry
menghubungkan ID/kind tersebut ke renderer, bukan ke posisi di dalam array.

```ts
type ActivityStep =
  | { id: 'respiratory-sequence'; kind: 'sequence'; targets: Target[] }
  | { id: 'organ-placement'; kind: 'placement'; targets: Target[] }
  | { id: 'anatomy-physiology-sort'; kind: 'classification'; targets: Target[] }

type Target = {
  id: string
  accessibleName: string
  frame: FrameRect
}

const WORKSPACES: Record<ActivityStep['kind'], ActivityRenderer> = {
  sequence: SequenceWorkspace,
  placement: PlacementWorkspace,
  classification: ClassificationWorkspace,
}
```

Kode di atas adalah bentuk kontrak, bukan konten siap pakai. Nama ID, target,
dan data ilmiah final harus berasal dari manifest AnatoQuest yang direview.

## Alur render dan kebenaran

```text
manifest langkah (id stabil + kind + target semantik + geometri)
  -> registry renderer bertipe
  -> DOM workspace atau adapter Phaser
  -> callback feedback/completion ke shell React
  -> shell menampilkan status, penjelasan, progres, dan aksi berikutnya
```

- Reordering manifest tidak boleh mengganti renderer secara diam-diam.
- Menambah langkah yang memakai mekanik lama seharusnya dominan perubahan data.
- Menambah mekanik baru adalah perubahan komponen/adapter yang disengaja.
- Validasi memeriksa ID semantik, misalnya `droppedItem.category === bin.id`,
  bukan posisi sprite, indeks DOM, atau koordinat tampilan.
- Geometri hanya mengatur presentasi/hit area. Ia tidak pernah menjadi kebijakan
  penilaian, KKM, atau sumber fakta medis.

## Batas state dan bridge

Simpan state pembelajaran yang portabel di luar renderer: `currentStep`, pilihan
yang tervalidasi, status selesai, skor yang dihitung dari kebijakan konten, dan
feedback. Simpan kamera, posisi sprite, tween, sorotan, partikel, dan drag
sementara sebagai state lokal Phaser.

```text
React control -> typed command -> bridge/adapter -> Phaser scene
Phaser action -> typed domain event -> React state -> DOM feedback
```

Command harus diskret (`activate`, `select-organ`, `pause`, `resume`, `reset`,
`set-quality`), dan event harus bermakna (`organ-selected`,
`activity-progress`, `activity-complete`, `invalid-action`, `asset-error`).
Jangan menyinkronkan state per frame ke React, mutasi objek Phaser langsung dari
komponen React, atau membaca DOM arbitrer dari scene Phaser.

## Urutan feedback dan aksesibilitas

Semua aktivitas mengikuti urutan berikut:

```text
aksi pengguna -> perubahan visual langsung -> instruksi/status singkat
              -> pengumuman aria-live -> feedback ilmiah -> CTA lanjut
```

Respons benar maupun salah harus menyebut status dan penjelasan konsep singkat.
Tawarkan alternatif tap/pilih-lalu-tempatkan atau input teks untuk interaksi
drag, hover, audio, atau motion-dependent. Canvas harus memiliki instruksi dan
kontrol DOM yang setara, bukan hanya tooltip di canvas.

Gunakan motion `prefers-reduced-motion` untuk delayed reveal/tween, dan
`useLayoutEffect` hanya bila frame visual DOM memang harus berubah sebelum paint
sebagai feedback penerimaan aksi. Jangan gunakan mekanisme ini untuk state
aplikasi umum.

## Persistensi dan kebijakan

Progress sederhana, preferensi audio, atau kualitas dapat dibungkus modul
renderer-independent. Jika penyimpanan diizinkan, gunakan schema version,
validasi/clamping data, fallback memory bila storage gagal, serta migrasi
eksplisit untuk bentuk session yang berubah.

Saat ini, kebijakan KKM, retry, skor, resume, identitas, dan persistensi adalah
`TBD`; jangan menjadikannya default tersembunyi. Lihat
`../design/11-design-decisions.md` dan fase terkait di `../../TASKS.md`.
