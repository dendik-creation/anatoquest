# Asset Production Plan

## Production approach

`PROPOSED`: produce the reusable anatomy foundation and content-verified diagrams before high-polish environments, music, or reward effects. This avoids ten duplicate body models and prevents visual production from outpacing medical/content approval. Counts are inventory line items, not final file counts. Every batch must use the single 2D educational vector art direction in [04-game-visual-language.md](04-game-visual-language.md); individual batch aesthetics cannot override it.

| Batch | Goal / asset count | Priority | Dependencies | Recommended order and reusable output | Technical constraints |
| --- | --- | --- | --- | --- | --- |
| 01 — Brand & UI | BR-01–02, UI-01–03, OG-01 (6) | P0 | Official metadata/name approval | Establish tokens, icon grid, wordmark, loading, orientation icon first | SVG optimisation, no text baked into UI art; font licence/subset. |
| 02 — Learning diagrams & content cards | DI-01–03, GM-01, GM-03 (5 families) | P0 | SME-approved labels, answers, pathways, cases | Create SVG master + semantic export rules; feeds React and Phaser tasks | Diagram source files must be editable; no medical facts invented by illustrators. |
| 03 — Anatomy core | AN-01–02 (2) | P0 | Anatomical reference + approved organ list | Make base body, named selectable organs, LODs and hotspots; reused by Home and all modules | Validate GLB size, texture compression, anatomical scale; separate geometry/layers. |
| 04 — Systems group A | AN-03–05 (3) | P0/P1 | Batch 03; LC-02–04 validation | Respiratory, heart/blood vessels, lymphatic paths | Reuse base rig/materials/atlas; do not embed long label text. |
| 05 — Systems group B | AN-06–08 (3) | P0 | Batch 03; LC-05–07 validation | Digestive, nervous, urinary paths | Same shared model/material contract. |
| 06 — Systems group C | AN-09–12, GM-02 (5) | P0/P1 | Batch 03; LC-08–11 approval | Reproductive, musculoskeletal, sensory, endocrine and puzzle assets | Age-appropriate reproductive presentation; shared layer package. |
| 07 — Environments & instructor | IL-01, BG-01–10 (11) | P1 | Confirm non-lab visual treatment; page layout | Produce a modular background kit, then crops by scene | Decorative only; low contrast; deliver AVIF/WebP variants; lazy load. |
| 08 — Video & motion | VD-01–02, FX-01–02 (4 families) | P0/P1 | Final scripts, diagrams, anatomy assets, captions | Intro video first; then process clips and small reusable effects | Transcode variants/posters/captions; no autoplay sound; test mobile decoding. |
| 09 — Audio | AU-01–04 (4 families) | P1/TBD | Interaction inventory, narration policy | SFX first, then loops, then optional narration | User control/mute; compressed loop points; transcripts/licences. |
| 10 — Reward output | RW-01–02 (2) | P1 | Approved badge criteria, KKM, certificate issuer/content | Badge family then certificate template | Certificate identity/download policy is unresolved; do not finalise personalised artefacts. |

## Asset reuse map

```text
AN-01 Base body + camera/hotspot convention
├── AN-02 Core organs (Home + Fundamentals)
├── AN-03 / 04 / 05 — group A overlays and pathways
├── AN-06 / 07 / 08 — group B overlays and pathways
└── AN-09 / 10 / 11 / 12 — group C overlays and pathways

DI-03 pathway primitives (nodes, arrows, line styles)
├── learning visualisations
├── sequencing activities
└── evaluation items

UI-01/UI-02 tokens and SVG icon family
├── React components
└── Phaser host overlays / scene event labels
```

`PROPOSED`: store the body base, each system layer, hotspot definition, camera presets, and animation clips independently. A module requests only its layer and clips. Do not create “complete body” copies per scene. Keep system colours in material parameters/overlay data where feasible, not duplicated textures.

## Definition of ready

An asset is ready only when it has: asset ID/version; source file; web delivery export; description and intended scene; accessibility text/caption if applicable; licence record; compression/weight record; medical SME approval for anatomy/case/process content; art-direction review against the shared consistency checklist; source AI prompt/model/reference record when generated; and a low-end-device smoke test for P0 runtime assets. `PROPOSED`.

## Production risks

- `TBD` Asset ownership/licensing and medical source review can block all anatomy/media production.
- 3D model complexity, 10 system layers, video, and audio can exceed mobile memory if batches are shipped as a single pack.
- `TBD` A certificate cannot be finalised until learner identity, issuer, and download/persistence requirements are decided.
