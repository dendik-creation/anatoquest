# Design and Implementation Decisions

## Repository analysis record

Inspection on 2026-08-31 found:

| Area | Finding | Decision / impact |
| --- | --- | --- |
| Framework / source | No `src/`, package manifest, or implementation source detected; `app/` is empty. | No architecture is being replaced. React+Vite+Phaser target is `PROPOSED` per requested technology direction. |
| Phaser / scenes | No Phaser integration or scene code detected. | Use contained, lazy Phaser hosts only; see [09](09-react-phaser-architecture.md). |
| Components / CSS / Tailwind | None detected. | Establish token-led CSS/component foundation at implementation; no Tailwind decision assumed. |
| Assets / fonts / tokens | No app asset structure or font files detected. | Inventory and production plan are planning inputs, not existing assets. |
| Routing / state / responsiveness | None detected. | Keep routing/state framework choices deliberately small until implementation. |
| Performance / technical debt | No application code to profile; no legacy technical debt identified. | Main risks are prospective media/3D weight and integration behaviour. |
| Version control | Workspace was not a Git worktree at inspection. | Documentation changes cannot be reported as a Git diff. |

### Setup delta — 2026-08-31

The historical inspection above predates application setup. The active application now lives in `app/` and is Bun-managed React + Vite + TypeScript with Phaser 3, ESLint, a lazy `PhaserCanvasHost`, and an empty bootstrap scene. This is infrastructure only: it does not satisfy any SC-01–SC-10 product-scene requirement. The initial production build measured a 61.35 kB gzip shell and a deferred 319.16 kB gzip Phaser chunk; use this as a profiling baseline, not a contractual performance result.

## Decisions and traceability

| ID | Decision | Status | Basis / consequence |
| --- | --- | --- | --- |
| DD-01 | Treat proposal and `docs/prd/` as source hierarchy; this design cites both and does not change application code. | `EXPLICIT` | User instruction. |
| DD-02 | Use `KES_LKES_7 No.196` as source metadata but do not render either code until branding conflict resolves. | `PROPOSED` | AQ-002 / existing PRD PD-002. |
| DD-03 | Planning route uses ten storyboard scenes, not the unexplained 02–12 statement. | `PROPOSED` | AQ-001; reversible via data-driven modules. |
| DD-04 | All ten systems are content data within four grouped learning modules, not ten Phaser applications/scenes. | `PROPOSED` | Explicit system coverage and storyboard groups; maintains performance. |
| DD-05 | React owns semantic application UI; Phaser is optional per visual/spatial interaction. | `PROPOSED` | User technology direction and performance requirement. |
| DD-06 | Landscape-only application with runtime-backed React OrientationGuard and canvas pause. | `EXPLICIT` requirement + `PROPOSED` implementation | Hard task requirement; source did not define orientation. |
| DD-07 | Poppins primary type, deep navy/pale blue/white/cyan core, semantic accessible derivations. | `EXPLICIT` direction + `PROPOSED` tokens | Storyboard names Poppins and colours; semantics/contrast are designed additions. |
| DD-08 | Visual “laboratory” is ambient anatomy imagery, never a virtual lab/clinical workflow. | `EXPLICIT` scope + `PROPOSED` interpretation | User boundary and PRD FR-020. |
| DD-09 | Content, activities, questions, feedback, KKM and scoring configuration are data-driven and medically reviewed. | `PROPOSED` | Missing rubric/content depth; improves auditability. |
| DD-10 | No accounts, cloud persistence, analytics, or personalised certificate implementation before policy approval. | `PROPOSED` | MISSING-004/005/009. |
| DD-11 | Accessibility equivalents, captions/transcripts, audio settings, focus and reduced motion are baseline recommendations. | `PROPOSED` | MISSING-007; needed for stated touch/drag/audio interactions. |
| DD-12 | Performance loads shell first, then route/module assets; actively unloads Phaser scene resources. | `PROPOSED` | Required performance-first direction. |
| DD-13 | One global modern 2D educational vector game art direction governs every visual asset, including generated imagery and Phaser objects. | `EXPLICIT — project directive` | Consistency is a system-level requirement; detailed enforcement is in 04. |
| DD-14 | SC-03 "Petunjuk Penggunaan" is **not** a dedicated scene. Every scene instead carries a reusable circular help/`?` icon button (same visual family as the existing `Tentang`/info button) that triggers a per-scene, driver.js-style guided-tour overlay: numbered element markers, step text, and next/previous controls. Six-card content, pop-up detail, and `Lanjut`-to-SC-04 routing described in the original SC-03 storyboard entry are superseded by this cross-scene pattern. | `EXPLICIT — product owner decision, 2026-09-11` | Confirmed by product owner; supersedes the SC-03 guidance-screen row in `docs/prd/06-screen-scene-inventory.md`, `docs/design/07-scene-architecture.md`, and `docs/design/08-scene-flow.md`. Each scene must define its own tour steps/copy as part of that scene's implementation, not as a shared script. Library choice (driver.js or an equivalent) and exact per-scene step content remain `TBD` at the implementation task level. |

## Identified source conflicts

| Conflict | Evidence | Resolution recommendation |
| --- | --- | --- |
| Ten scenes vs “Scene 02–12” | Proposal flow/storyboard vs implementation paragraph | Confirm canonical level/scene model. Use 10-scene baseline only until confirmed. |
| Official material code vs UI storyboard code | A. Identitas `KES_LKES_7 No.196` vs storyboard `LKS_AFTM_1/01` | Confirm official display code; avoid displaying unverified legacy value. |
| Two initial cases | Pre-learning 55-year-old case vs Scene 4 18-year-old case | Confirm whether both are intentional; identify score treatment and answer keys. |
| Open home menu vs sequential route | Home offers eight menus; core learning says sequential levels | Decide direct access, locking, back navigation, and resume rules. |
| “Profil” menu undefined | Home list only | Define learner profile vs credits vs removal. |
| Laboratory wording vs scope | Storyboard ambience versus project boundary | Confirm visual-only treatment; retain no procedure/diagnosis claims. |
| 2D global art direction vs. 360° 3D anatomy | Current project directive versus explicit proposal model requirement | Preserve 360° exploration and art-direct it as simplified low-poly/2.5D vector-like educational imagery; confirm final delivery technology. |

## Open questions before implementation

1. What is the canonical scene/level count and the exact end-of-level Boss Challenge map?
2. What is KKM, assessment weighting, partial credit, question bank, retry/skip/backtracking, randomisation, and feedback timing?
3. Are both initial cases used, and what content-review sources/answer keys govern them?
4. Which Home menus deep-link, which are locked, and what does `Profil` mean?
5. Must progress persist; if so, what identity, privacy, consent, retention, certificate issuer, and download policy apply?
6. Which devices/browsers, minimum landscape viewport, network conditions, offline/PWA expectations, and performance acceptance targets are approved?
7. What accessibility standard, Indonesian/UI language policy, narration/caption requirements, and audio controls are required?
8. Who owns/licences 3D models, images, music, font, video, and medical reference content; who is the reviewing SME?
9. Is a teacher reporting/dashboard/handoff feature required beyond facilitation?
10. What are the loading/error/offline/exit/recovery policies?

## Handoff order

1. Resolve the conflicts/open questions above and obtain content/medical review policy.
2. Approve design tokens, system colour map, responsive baseline, and asset style tests.
3. Produce P0 content/data manifests and P0 asset batches.
4. Build React shell/orientation/accessibility foundation and one end-to-end learning module proof.
5. Measure target devices before scaling the Phaser/anatomy/video pipeline to all systems.
