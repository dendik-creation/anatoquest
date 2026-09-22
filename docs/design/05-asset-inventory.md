# Asset Inventory

## Planning assumptions

This is a production inventory, not a statement that assets exist. Every record is `PROPOSED` unless its name/purpose is explicitly storyboarded; the final medical content and licences remain `TBD`. Resolution is a recommended delivery target, not source evidence. Prefer WebP/AVIF with PNG fallback for opaque/raster illustrations, SVG for UI/vector diagrams, GLB for 3D, KTX2/Basis-compressed textures where supported, WebM/MP4 for video, and OGG/AAC for audio. Every visual record is also governed by the system-level art direction and AI-prompt rule in [04-game-visual-language.md](04-game-visual-language.md).

| Asset ID | Asset name | Category | Used by | Purpose | Format | Resolution / budget | Animation | Priority | Production status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BR-01 | AnatoQuest wordmark | Brand | SC-01, 02, 10 | App identity | SVG | Vector | None | P0 | Not produced |
| BR-02 | Human Body Explorer lockup | Brand | SC-01, 02 | Official material title | SVG | Vector | None | P0 | Not produced |
| UI-01 | Icon set | UI/Icons | All React UI | Navigation/actions/status | SVG sprite | 24 px grid | None | P0 | Not produced |
| UI-02 | UI state icons | UI/Icons | Feedback/assessment | Correct, incorrect, info, warning, focus | SVG | 24–32 px | None | P0 | Not produced |
| UI-03 | Loading marks | Loading | SC-01/deferred scenes | Progress and retry visual | SVG/CSS | Vector | Optional | P0 | Not produced |
| OG-01 | Rotate-device illustration | Orientation Guard | AppShell | Portrait block message | SVG | 160 px artboard | Optional | P0 | Not produced |
| ~~IL-01~~ | ~~Virtual instructor~~ | Superseded | — | No longer needed: SC-03 guidance screen replaced by cross-scene help overlay (`DD-14`) | — | — | — | — | Superseded, not produced |
| BG-01 | `bg_splash_humanbody` | Background | SC-01 | Opening atmosphere | AVIF/WebP | 1920×1080 max | Separate subtle layers | P1 | Not produced |
| BG-02 | `bg_home_anatomi` | Background | SC-02 | Home atmosphere | AVIF/WebP | 1920×1080 max | Separate subtle layers | P1 | Not produced |
| ~~BG-03~~ | ~~`bg_instruction`~~ | Superseded | — | No longer needed: SC-03 guidance screen replaced by cross-scene help overlay (`DD-14`) | — | — | — | — | Superseded, not produced |
| BG-04 | `bg_case` | Background | SC-04 | Educational case setting | AVIF/WebP | 1920×1080 max | None | P1 | Not produced |
| BG-05 | `bg_material_core` | Background | SC-05 | Fundamentals atmosphere | AVIF/WebP | 1920×1080 max | None | P1 | Not produced |
| BG-06 | `bg_system_group_a` | Background | SC-06 | Respiratory/circulatory/lymphatic | AVIF/WebP | 1920×1080 max | None | P1 | Not produced |
| BG-07 | `bg_system_group_b` | Background | SC-07 | Digestive/nervous/urinary | AVIF/WebP | 1920×1080 max | None | P1 | Not produced |
| BG-08 | `bg_system_group_c` | Background | SC-08 | Reproductive/musculoskeletal/sensory/endocrine | AVIF/WebP | 1920×1080 max | None | P1 | Not produced |
| BG-09 | `bg_evaluation` | Background | SC-09 | Evaluation atmosphere | AVIF/WebP | 1920×1080 max | None | P1 | Not produced |
| BG-10 | `bg_finish` | Background | SC-10 | Completion atmosphere | AVIF/WebP | 1920×1080 max | None | P1 | Not produced |
| AN-01 | Base anatomical body model | Anatomy | SC-02, 05–08 | Rotatable neutral body | GLB | ≤100k triangles; LOD | Idle rotate | P0 | Not produced |
| AN-02 | Core organ selection layer | Anatomy | SC-02, 05 | Brain/lungs/heart/liver/stomach/kidneys/intestine/bones/muscles | GLB + atlas | Shared with AN-01 | Highlight states | P0 | Not produced |
| AN-03 | Respiratory layer | Organ system | SC-06 | Airway/lung exploration | GLB/2D overlay | Shared base; 2K atlas max | Breath/process | P0 | Not produced |
| AN-04 | Heart & blood-vessel layer | Organ system | SC-06 | Heart/blood flow exploration | GLB/2D overlay | Shared base; 2K atlas max | Beat/flow | P0 | Not produced |
| AN-05 | Lymphatic layer | Organ system | SC-06 | Lymphatic pathway | GLB/2D overlay | Shared base; 2K atlas max | Flow | P1 | Not produced |
| AN-06 | Digestive layer | Organ system | SC-07 | Food journey | GLB/2D overlay | Shared base; 2K atlas max | Pathway | P0 | Not produced |
| AN-07 | Nervous layer | Organ system | SC-07 | Impulse pathway | GLB/2D overlay | Shared base; 2K atlas max | Pathway | P0 | Not produced |
| AN-08 | Urinary layer | Organ system | SC-07 | Filtration/urine formation | GLB/2D overlay | Shared base; 2K atlas max | Pathway | P0 | Not produced |
| AN-09 | Reproductive layer | Organ system | SC-08 | Educational structure/function | GLB/2D overlay | Shared base; 2K atlas max | Optional process | P1 | Not produced |
| AN-10 | Musculoskeletal layer | Organ system | SC-08 | Bone/muscle relation | GLB/2D overlay | Shared base; 2K atlas max | Contraction | P0 | Not produced |
| AN-11 | Sensory layer | Organ system | SC-08 | Sense organs/stimuli | SVG/GLB overlay | 2K atlas max | Signal | P1 | Not produced |
| AN-12 | Endocrine layer | Organ system | SC-08 | Glands/hormone release | SVG/GLB overlay | 2K atlas max | Signal | P1 | Not produced |
| DI-01 | Body organisation infographic | Educational diagram | SC-05/pre-learning | Cell→tissue→organ→system | SVG | Vector | Optional staged reveal | P0 | Not produced |
| DI-02 | Structure/function diagram set | Educational diagram | SC-05–08 | Explain linked concepts | SVG | Vector | None | P0 | Not produced |
| DI-03 | Pathway diagram set | Educational diagram | SC-06–09 | Air, blood, food, impulse, urine sequences | SVG | Vector | Animated overlays optional | P0 | Not produced |
| GM-01 | Activity card/token atlas | Interactive objects | SC-04–09 | Organs, labels, symptoms, sequence pieces | SVG atlas | 1–2K atlas | Drag/select states | P0 | Not produced |
| GM-02 | Puzzle tiles | Interactive objects | SC-08–09 | Anatomy puzzle | PNG/WebP atlas | 1–2K atlas | None | P1 | Not produced |
| GM-03 | Case patient/evidence illustration | Case study | SC-04 | Non-diagnostic scenario visual | SVG/PNG | 1280 px max | None | P0 | Not produced |
| RW-01 | Badge family | Reward | SC-02, 09, 10 | Progress/achievement reward | SVG | Vector | Reveal | P1 | Not produced |
| RW-02 | Certificate frame | Reward | SC-10 | Certificate template | SVG/HTML | A4 print layout | None | P1 | Not produced |
| VD-01 | Introductory video | Video | Pre-learning / SC-05 | Anatomy/physiology introduction | WebM+MP4 | 1080p source, adaptive delivery | Video | P0 | Not produced |
| VD-02 | Physiology clips | Video/animation | SC-05–08 | Optional process explanation | WebM+MP4 | 720p recommended | Video | P1 | Not produced |
| AU-01 | UI SFX pack | Audio | All | Click, drop, correct/incorrect, achievement | OGG/AAC | ≤96 kbps | One-shot | P1 | Not produced |
| AU-02 | Scene music loops | Audio | SC-01–10 | Opening, learn, evaluation, result | OGG/AAC | ≤128 kbps | Loop | P2 | Not produced |
| AU-03 | Low ambience loops | Audio | SC-01–08,10 | Subtle scene atmosphere | OGG/AAC | ≤96 kbps | Loop | P2 | Not produced |
| AU-04 | Narration recordings | Audio | `TBD` scenes | Optional supplied dialogue playback | OGG/AAC + transcript | ≤96 kbps | None | TBD | Not produced |
| FX-01 | Highlight/halo shader sprites | Effects | Phaser scenes | Selection and pathway emphasis | Atlas | 512–1K | Controlled pulse | P1 | Not produced |
| FX-02 | Result confetti | Effects | SC-10 | One-time success flourish | Atlas/CSS | 512 px atlas | One burst | P2 | Not produced |

### Asset acceptance gates

1. `P0` labels, answers, pathways, and anatomy hierarchy pass SME review and version tracking before integration.
2. Every third-party model/font/audio file has recorded licence, source, attribution requirement, derivative-use permission, and delivery owner (`TBD`, PRD MISSING-010).
3. Raster assets have responsive crops; do not ship all 1920×1080 backgrounds to an initial route.
4. Each video has captions, transcript, poster, duration, and a no-video alternative (`PROPOSED`).
5. Every visual asset passes the shared 2D educational vector art-direction checklist: compatible shape/outline/gradient/lighting/detail treatment, approved palette, intended-size readability, and no photorealistic/dashboard/foreign-asset-pack treatment.
6. Every generated asset stores its source prompt, generation model/version where available, reference assets used, and the human art-direction approval result. `PROPOSED` for production traceability.
