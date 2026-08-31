# Scene Architecture and Feature Mapping

## Canonical route recommendation

The fully storyboarded source defines ten scenes; an implementation paragraph says scenes 02–12. This is a documented source conflict (`AQ-001`). `PROPOSED`: use the following **10-scene route as the planning baseline only**, retaining data-driven submodules and Boss Challenges so an approved 12-level map can be introduced without reorganising the application.

| Scene ID | Scene name | Type | Purpose / learner objective | Entry → exit | Main interaction | React / Phaser | Primary assets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SC-01 | Splash / Halaman Pembuka | Application screen | Identify app; initialise only critical shell | Launch → Home | Start learning; loading/retry | React; no Phaser required | BR-01–02, UI-03, optional BG-01 |
| SC-02 | Beranda / Home | Application screen | Find route, progress, level, badges and anatomy preview | Splash/menu → destination | Eight declared menu choices; select preview organ | React + optional lazy Phaser preview | BG-02, AN-01–02, UI/RW |
| SC-03 | Petunjuk Penggunaan | Guidance screen | Learn controls/sequence | Home/Petunjuk → SC-04 | Six cards, detail, swipe, Lanjut | React | BG-03, IL-01, UI-01 |
| SC-04 | Apersepsi & Studi Kasus | Case/learning screen | Form initial system hypothesis from symptoms | Guided route → SC-05 | Select or map symptoms to organs; feedback | React case UI + Phaser spatial map only if needed | BG-04, GM-01/03, AN-02 |
| SC-05 | Materi 1: Fundamentals | Learning screen | Anatomy, physiology, organisation, homeostasis, structure/function | SC-04 → SC-06 | 360° organ explore; group anatomy vs physiology; Boss Challenge `TBD` | React + Phaser anatomy visual | BG-05, AN-01–02, DI-01–02, GM-01 |
| SC-06 | Materi 2: Respiratory / Heart / Vessels & Lymphatic | Learning module group | Explore group-A structures/functions/processes | SC-05 → SC-07 | System tabs, visualisation, sequencing/matching; Boss Challenge `TBD` | React + lazy Phaser visualisation | BG-06, AN-03–05, DI-02–03, GM-01 |
| SC-07 | Materi 3: Digestive / Nervous / Urinary | Learning module group | Explore group-B structures/functions/processes | SC-06 → SC-08 | System tabs, visualisation, sequence/placement; Boss Challenge `TBD` | React + lazy Phaser visualisation | BG-07, AN-06–08, DI-02–03, GM-01 |
| SC-08 | Materi 4: Reproductive / Musculoskeletal / Sensory / Endocrine | Learning module group | Explore group-C structures/functions/homeostasis relation | SC-07 → SC-09 | System tabs, visualisation, classification/matching/puzzle; Boss Challenge `TBD` | React + lazy Phaser visualisation | BG-08, AN-09–12, DI-02–03, GM-01–02 |
| SC-09 | Mini Game dan Kuis Evaluasi | Evaluation / game screen | Demonstrate learning and receive automatic score | SC-08 → result/repeat | Puzzle, matching, placement, MCQ, true/false, case, check/next | React assessment; Phaser only puzzle/spatial task | BG-09, DI-03, GM-01–02, UI-02 |
| SC-10 | Hasil Belajar, Rangkuman, Glosarium, Penutup | Result/closure screen | Understand outcome, consolidate, reflect, retry/finish | KKM branch → Home/finish/retry | Results, summary map, glossary, reflection, certificate action | React | BG-10, RW-01–02, FX-02, UI-02 |

## Module-to-feature map

| Learning group | Content / required process | Practice focus | Proposed delivery shape |
| --- | --- | --- | --- |
| SC-05 Fundamentals | Definitions, organisation cell→tissue→organ→system, homeostasis, structure-function | Anatomy vs physiology grouping | React prose/diagram + reusable Phaser body selection. |
| SC-06 A | Respiratory (breathing/gas exchange), heart/blood flow, vessels/lymphatic circulation | Air/blood path ordering, function matching | Three data-driven tabs sharing one visualisation host. |
| SC-07 B | Digestive food journey, neural impulse, filtration/urine formation | Sequence / drag placement / matching | Three data-driven tabs sharing one visualisation host. |
| SC-08 C | Reproductive, musculoskeletal contraction, sensory stimulus, endocrine hormone | Classification, matching, anatomy puzzle | Four data-driven tabs; Canvas only for visual/spatial need. |
| SC-09 Evaluation | Puzzle, matching, system drag/drop, MCQ, true/false, case | Automatic scored assessment | Assessment manifest defines item type/feedback/weight; exact policy `TBD`. |

### Scene implementation model

The term *scene* is product language, not a mandate that all ten are Phaser scenes. `PROPOSED`: each `SC-*` is a React route/screen boundary; an optional Phaser subscene mounts inside its `AnatomyCanvasHost`. The three organ-group scenes are data-driven React module pages, not ten separate Phaser boot cycles. The ten required systems remain explicit data entries.

## Scene-level requirements

### Splash (SC-01)

`EXPLICIT`: logo, loading/initialisation, opening atmosphere, start action. `PROPOSED`: preload app shell/font/critical SVG only; no artificial minimum display duration. If a first-route resource fails, show a short error with retry and Home-safe route; a user start action is never blocked by decorative background/media. Transition: 180 ms opacity crossfade after shell ready. Skip behaviour is `TBD`; recommended start action always takes the user to Home.

### Home (SC-02)

`EXPLICIT`: progress %, level, badge count, rotating selectable body preview, and eight named menus. `TBD`: direct-menu routing/locking, profile purpose. `PROPOSED`: use cards for all eight labels, but show an explicit “Belum tersedia” treatment only after approval; never invent a profile data model. Pause the preview when hidden, reduced-motion is enabled, tab is backgrounded, or OrientationGuard is active.

### Learning, case, and evaluation

Each learning stage must present objective → explanation/visualisation → activity → immediate concept feedback → completion/next action. `EXPLICIT` covers this loop broadly. The pre-learning 55-year-old case and in-app 18-year-old Scene 4 case conflict/relationship is `TBD`; this architecture keeps case content in data so either or both can be supplied. The evaluation sequence is `EXPLICIT`: introduction → item → selection → `Periksa Jawaban` → feedback → next → final score → KKM branch. Answer backtracking, immediate/deferred evaluation feedback, item count, randomisation, attempt limits and weights are `TBD`; implementation must not lock these in.

### Result (SC-10)

`EXPLICIT`: final score, badge/certificate after KKM pass, progress/completion, summary, glossary, reflection and Home/retry/finish actions. `PROPOSED`: failed KKM outcome has a respectful result panel with a clear repeat choice and learning recommendations; it must not show the pass certificate/badge. Achievement criteria beyond KKM stay `TBD`.

## Scene transitions and asset lifecycle

| Boundary | Transition | Loading / unload behaviour |
| --- | --- | --- |
| SC-01 → SC-02 | 180 ms crossfade | Shell already ready; Home preview begins only after host visible. |
| SC-02 → React-only screen | 180 ms slide/fade | Route code lazy-loads on intent; dispose Home preview if route memory pressure requires. |
| Learning groups | 180–220 ms fade with progress state preserved | Preload next group manifest after current activity; destroy prior Phaser scene and release group textures/clips. |
| Into evaluation | 180 ms fade | Load assessment data/only necessary spatial game assets. |
| Result | 220 ms staged React reveal | No full anatomy model load; optional one-time low-cost reward effect. |

All durations are `PROPOSED`; disable or reduce per motion preference. Loading uses a scene-local skeleton/progress message; no blocking global spinner after app shell is interactive.
