# Screen / Scene Inventory

**Parent:** [00-product-requirements.md](00-product-requirements.md). The source mock-ups and storyboard define the following 10 scenes. The term *scene* is retained because it is the proposal's terminology.

**Route note:** SC-03 "Petunjuk Penggunaan" is not implemented as its own screen. The route is SC-02 (Home) → SC-04 (Apersepsi) directly.

| ID | Screen / Scene | Purpose | User actions | Entry | Exit | Type |
| --- | --- | --- | --- | --- | --- | --- |
| SC-01 | Splash / Halaman Pembuka | Brand, loading, system initialisation, start learning. | Hover/click Mulai Pembelajaran. | App launch. | Home. | Application UI scene |
| SC-02 | Halaman Beranda | Main navigation, current progress/level/badges, 3D anatomy preview. | Select one of eight menus; hover; swipe on touch; select organ. | Splash. | Selected destination. | Application UI screen |
| SC-03 | ~~Petunjuk Penggunaan~~ — superseded, see note below `[DD-14]` | — | — | — | — | — |
| SC-04 | Apersepsi dan Studi Kasus | Elicit initial symptom/system hypothesis. | Inspect/select organ; drag symptom to organ; swipe info. | Guidance. | Scene 5. | Learning/case scene |
| SC-05 | Materi 1: Fundamentals | Teach anatomy, physiology, organisation, homeostasis, structure/function. | Rotate/select body/organ, swipe submaterial, grouping drag/drop. | Sequential route. | Scene 6. | Learning scene |
| SC-06 | Materi 2: Respiratory, heart/blood vessels, lymphatic | Teach systems with model/animation and pathway/matching activity. | Select/hover organs, swipe, sequence/match. | Scene 5. | Scene 7. | Learning scene |
| SC-07 | Materi 3: Digestive, nervous, urinary | Teach systems with model/animation and process activity. | Select/hover organs, swipe, sequence/drag. | Scene 6. | Scene 8. | Learning scene |
| SC-08 | Materi 4: Reproductive, musculoskeletal, sensory, endocrine | Teach systems with visualisation and practice. | Select/hover organs, swipe, classify/match/puzzle. | Scene 7. | Scene 9. | Learning scene |
| SC-09 | Mini Game dan Kuis Evaluasi | Evaluate understanding. | Select answer, Periksa Jawaban, swipe/Berikutnya, drag/drop game tasks. | Scene 8. | Scene 10 or repeat route. | Assessment/game scene |
| SC-10 | Hasil Belajar, Rangkuman, Glosarium, Penutup | Show outcome and closure. | Open summary/glossary, Unduh Sertifikat, Ulangi Materi, Kembali ke Beranda, Selesai, swipe. | Pass/complete evaluation. | Retry, Home, or finish. | Result/closure scene |

## Named Home destinations whose independent screens are not defined

| Menu | Status |
| --- | --- |
| Mulai Pembelajaran | Sequential route is explicit. |
| Materi | Covered by SC-05–SC-08; deep-link behaviour unspecified. |
| Simulasi Organ | Simulation content is explicit; dedicated screen/entry point unspecified. |
| Mini Game | Scene 9 explicit; separate entry/locking unspecified. |
| Kuis | Scene 9 explicit; separate entry/locking unspecified. |
| Glosarium | Scene 10 explicit; dedicated screen/entry point unspecified. |
| Profil | Listed only; purpose/data/screen unspecified. |
| Petunjuk | No longer a screen. |

## Visual direction that is explicit, not a technical implementation decision

The storyboard names background assets and designs with Poppins, blue/white/cyan dominant palettes (plus scene accent colours), holographic anatomy/digital panels, cards, fade/glow/zoom/pulse states, and result confetti. These are design inputs. They do not prescribe a rendering engine, component system, 3D file format, or asset pipeline.
