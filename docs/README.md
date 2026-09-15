# Dokumentasi AnatoQuest

Dokumentasi ini adalah titik masuk untuk implementasi AnatoQuest. Baca dokumen
yang sesuai dengan perubahan yang akan dilakukan, bukan seluruh dokumen secara
membabi buta.

## Urutan otoritas

1. `raw/` - proposal asli dan bukti sumber.
2. `prd/` - kebutuhan produk dan traceability.
3. `design/` - keputusan desain, arsitektur produk, dan batas pengalaman.
4. `architecture/` - konvensi implementasi dan reuse yang disesuaikan untuk
   proyek ini.
5. Kode yang benar-benar ada di `app/` - bukti status runtime saat ini.
6. Rekomendasi baru yang diberi label `PROPOSED`.

Dokumen pada `architecture/` tidak dapat mengesampingkan keputusan produk,
validasi medis, atau desain yang telah disetujui. Khususnya, dokumen tersebut
memindahkan pola kerja, bukan identitas visual atau isi pembelajaran dari
referensi lain.

## Peta cepat

| Kebutuhan kerja | Dokumen utama |
| --- | --- |
| Memahami tujuan, cakupan, dan kebutuhan | `prd/00-product-requirements.md`, `prd/07-requirement-traceability.md` |
| Membuat UI, layout, atau orientasi | `design/00-design-system.md`, `design/02-layout-and-responsive.md`, `design/03-component-system.md`, `architecture/00-implementation-foundation.md` |
| Membuat mekanik belajar atau integrasi Phaser | `design/09-react-phaser-architecture.md`, `architecture/01-interaction-and-content-contracts.md` |
| Menambah aset, loading, atau optimasi | `design/05-asset-inventory.md`, `design/06-asset-production-plan.md`, `design/10-performance-strategy.md`, `architecture/02-assets-performance-and-verification.md` |
| Menentukan apa yang boleh dikerjakan | `design/11-design-decisions.md`, `TASKS.md`, `CLAUDE.md` |

## Status dokumentasi arsitektur

| Dokumen | Peran | Status |
| --- | --- | --- |
| `architecture/00-implementation-foundation.md` | Batas renderer, Stage 16:9 aman, token, dan shell | Konvensi target (`PROPOSED`) dengan status implementasi eksplisit. |
| `architecture/01-interaction-and-content-contracts.md` | Kontrak data, registry mekanik, state, feedback, bridge | Konvensi target (`PROPOSED`). |
| `architecture/02-assets-performance-and-verification.md` | Taksonomi aset, delivery, loading, pengujian | Rencana adopsi; jangan mengklaim pipeline belum dibuat sebagai runtime aktif. |

## Kaitan dengan `CLAUDE.md`

`CLAUDE.md` adalah working agreement untuk agen dan implementer. Bagian
**Documentation map** di sana memetakan tipe perubahan ke dokumen ini. Saat
instruksi `CLAUDE.md` dan dokumen turunan berbeda, ikuti urutan otoritas di atas
dan catat konflik sebagai `TBD` atau keputusan baru; jangan menyelesaikannya
diam-diam.
