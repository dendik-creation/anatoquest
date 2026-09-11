# AnatoQuest Delivery Breakdown

## Status legend

- `[ ]` Not started
- `[-]` Blocked by a decision/dependency
- `[~]` In progress
- `[x]` Complete and verified

The phases below map to product scenes where possible. A phase is complete only after its definition of done is met; do not advance merely because a screen appears visually complete. Requirements marked `TBD` in the PRD/design documents must be resolved or deliberately deferred with product-owner approval.

## Phase 00 — Decisions, governance, and delivery foundation

**Status:** `[-]` — product decisions required before implementation.

**Goal:** turn the documented blueprint into an approved implementation contract.

- [x] Establish the global 2D educational vector game art direction, asset consistency checklist, and mandatory AI-generation prompt language across PRD/design/asset documentation.
- [ ] Confirm the canonical 10-scene or 12-level route and map every required Boss Challenge.
- [ ] Confirm official displayed material code and naming.
- [ ] Confirm whether the 55-year-old and 18-year-old cases are separate; approve answer keys, safe framing, and scoring treatment.
- [ ] Define KKM, score weights, partial credit, attempts, retries, backtracking, quiz feedback timing, and question bank scope.
- [ ] Define Home deep links, locking, resume/back navigation, and the purpose of `Profil`.
- [ ] Approve device/browser matrix, minimum landscape viewport, network/offline expectation, and performance acceptance targets.
- [ ] Approve accessibility standard; caption/transcript, audio, reduced-motion, keyboard/tap, and language policy.
- [ ] Establish anatomy/physiology SME review, medical source/version record, and asset/font/audio/model licence ownership.
- [ ] Decide persistence, identity, privacy/consent, certificate issuer/download, analytics, and teacher-reporting scope.

**Definition of done:** each unresolved choice is either approved in a decision log or explicitly excluded from MVP; every content-producing task has an assigned reviewer and source/asset ownership path.

---

## Phase 01 / SC-01 — Application foundation and Splash

**Status:** `[~]` — technical bootstrap complete; product-shell work remains.

**Goal:** create a fast React/Vite shell that safely reaches Home without loading the entire game.

- [x] Create Bun-managed React + Vite + TypeScript package in `app/`; install Phaser 3 and generate `bun.lock`.
- [x] Add TypeScript, ESLint, `typecheck`, `lint`, and production `build` scripts.
- [x] Add a lazy `PhaserCanvasHost` and empty `BootstrapScene` with ready/error state and React-unmount teardown.
- [x] Verify setup: `bun install`, `bun run typecheck`, `bun run lint`, and `bun run build` pass. Initial shell measured 61.35 kB gzip; lazy Phaser chunk measured 319.16 kB gzip (baseline only, not final budget acceptance).
- [ ] Add token CSS, Poppins loading/fallback, global reset, landmarks, error boundary, route shell, and accessibility utilities.
- [ ] Implement runtime `OrientationGuard`: viewport + media-query detection, focus/input lock, auto-clear, and bridge pause command.
- [ ] Implement SC-01 branding/loading/start action with retry/error state; load only P0 shell assets. The current bootstrap is not SC-01.
- [ ] Establish lazy route/module boundary and initial bundle reporting. Phaser engine import is already lazy at the host boundary.
- [ ] Add preference model for motion/audio/captions/quality; persistence only if Phase 00 approves it.

**Dependencies:** Phase 00 minimum viewport/orientation/accessibility decisions; BR-01/BR-02/UI-03/OG-01 or approved placeholders.

**Definition of done:** cold launch enters an accessible, landscape-only shell; portrait blocks interaction and returns automatically; Splash does not preload anatomy/video; loading failure has recovery; initial bundle is measured against the proposed budget.

---

## Phase 02 / SC-02 — Home / Beranda

**Status:** `[~]` — Figma "Home" frame sliced and shipped; progress/anatomy preview and the two missing menus remain open.

**Goal:** provide the navigation hub and lightweight progress/anatomy preview.

- [-] Build Home with the eight explicit menus: Mulai Pembelajaran, Materi, Simulasi Organ, Mini Game, Kuis, Glosarium, Profil, Petunjuk. The approved Figma "Home" frame (node `16:2`) only renders six; `Profil` and `Petunjuk` are absent pending source conflict #4. Implemented: `app/src/scenes/home/HomeScene.tsx`.
- [ ] Apply approved direct-link/locking state and explanatory disabled/unavailable treatment where needed. All six shipped cards are currently plain enabled buttons calling an unwired `onSelectMenu` hook; no destination scenes exist yet (Phase 03+).
- [ ] Render progress percentage, level, badge count from session state; do not imply persistence before approval. Not present in the approved Home frame; not built.
- [ ] Implement the lazy, pauseable anatomy preview or approved static fallback; selected organs expose name/location/function. Not present in the approved Home frame; not built.
- [x] Implement reduced-motion, keyboard/touch/focus interactions and compact landscape layout. Every non-background element enters/exits with a staggered bubble+fade transition (suppressed to a simultaneous plain fade under `prefers-reduced-motion`); all controls are native, keyboard-reachable buttons with visible focus; stage uses the same cover/safe-box scale as Splash down to mobile landscape. Verified in `app/e2e/home.spec.ts` across desktop/laptop/mobile-landscape viewports.
- [x] Added (not originally scoped, requested alongside this phase): "Keluar" opens an own-designed Ya/Tidak confirm dialog before calling `window.close()`; a "Tentang" info dialog was added for the previously unused info icon. See `docs/design/12-home-design-system-reference.md`.
- [x] Added (follow-up request): every clickable Home element (cards, icon buttons, exit button, dialog buttons) scales up on hover and down while pressed (`ease-out`, disabled under `prefers-reduced-motion`); SC-01 Splash's "Ketuk Dimana Saja" action now also requests fullscreen (best-effort, silently ignored if the browser denies it). Verified in `app/e2e/home.spec.ts`.

**Dependencies:** Phase 01; Home navigation and `Profil` decision; AN-01/AN-02 or fallback; progress rules.

**Definition of done:** all eight menu labels are visible and have approved destinations/states; no background canvas runs while hidden/portrait/reduced-motion; Home is readable from mobile landscape to widescreen. **Not yet met** — blocked on source conflict #4 (`Profil`/`Petunjuk`) and on the progress/anatomy-preview requirements above.

---

## Phase 03 / SC-03 — Petunjuk Penggunaan

**Status:** `[ ]`

**Goal:** explain the learning route and interaction vocabulary before the case.

- [ ] Author/approve six instruction-card content items and their detail copy.
- [ ] Build card list/detail dialog with explicit next/previous controls and optional swipe.
- [ ] Include instructions for exploration, tap alternative to drag/drop, feedback, progress, audio/captions, and landscape requirement.
- [ ] Route `Lanjut` to SC-04 and support contextual return to Home.

**Dependencies:** Phase 01; approved interaction/accessibility policy; IL-01/UI-01 optional.

**Definition of done:** six cards, accessible detail, explicit navigation, keyboard/touch operation, and SC-04 transition work without relying on swipe or hover.

---

## Phase 04 / SC-04 — Apersepsi and Case Study

**Status:** `[-]` — two supplied cases require confirmation.

**Goal:** introduce an educational symptom-to-system exploration without diagnostic claims.

- [ ] Confirm/author in-app case, patient illustration, four symptoms, response mapping, feedback, and initial-score policy.
- [ ] Build React case prompt/evidence board with educational disclaimer/wording.
- [ ] Implement selectable or spatial symptom-to-organ mapping with a select-then-place alternative.
- [ ] Highlight selected organs and show short feedback plus the approved concept explanation after completion.
- [ ] Persist only session activity state unless privacy/persistence is approved.

**Dependencies:** Phase 00 case/answer-key/SME decision; GM-01/GM-03/AN-02; Phase 01–03.

**Definition of done:** all case content is SME-approved; learners can complete without drag/hover; feedback does not diagnose or prescribe; complete state routes to SC-05.

---

## Phase 05 / SC-05 — Fundamentals: Anatomy and Physiology

**Status:** `[ ]`

**Goal:** teach anatomy, physiology, homeostasis, body organisation, and structure/function relation.

- [ ] Author reviewed fundamental content and glossary links.
- [ ] Deliver `cell → tissue → organ → organ system` infographic and structure/function diagrams.
- [ ] Implement reusable anatomy explorer host: 360° rotation, stable selected-organ ID, name/location/basic function, reset view, and non-canvas text equivalent.
- [ ] Build anatomy-vs-physiology grouping activity with feedback/explanation and alternate input.
- [ ] Implement approved Boss Challenge or leave it explicitly pending Phase 00 decision.

**Dependencies:** Phase 01–04; AN-01/AN-02; DI-01/DI-02; reviewed learning/feedback content.

**Definition of done:** nine named major organs are selectable; all required concepts/activity work with immediate explanatory feedback; body model is lazy loaded and cleaned up on exit.

---

## Phase 06 / SC-06 — Organ Systems Group A

**Status:** `[ ]`

**Scope:** Sistem pernafasan; sistem jantung; sistem pembuluh darah dan limfatik.

- [ ] Author/SME-review structure, function, process, labels, paths, and explanations for all three systems.
- [ ] Implement data-driven module tabs/pages sharing one learning layout and anatomy visualisation host.
- [ ] Add respiratory inspiration/expiration and gas exchange; heartbeat/blood flow; lymphatic circulation visualisations.
- [ ] Implement air/blood sequencing and structure-function matching with immediate feedback.
- [ ] Add approved level-completion/Boss Challenge state.

**Dependencies:** Phase 05 reusable host; AN-03–05; DI-02–03; approved activity policy.

**Definition of done:** all three domains and stated processes are accessible, medically reviewed, lazy-loaded by module, and usable with keyboard/tap/reduced motion.

---

## Phase 07 / SC-07 — Organ Systems Group B

**Status:** `[ ]`

**Scope:** Sistem pencernaan; sistem persarafan; sistem perkemihan.

- [ ] Author/SME-review content, labels, processes, answers, and feedback.
- [ ] Reuse module shell/visualisation contract; do not duplicate base anatomy assets.
- [ ] Add food-journey, neural-impulse, and urine-formation visualisations with static diagram fallback.
- [ ] Implement sequencing, placement, or matching activities from approved content configuration.
- [ ] Add approved Boss Challenge and completion state.

**Dependencies:** Phase 06 architecture patterns; AN-06–08; DI-02–03.

**Definition of done:** three system domains meet the same content, interaction, loading, error, and performance standards as Group A.

---

## Phase 08 / SC-08 — Organ Systems Group C

**Status:** `[ ]`

**Scope:** Sistem reproduksi; sistem otot dan tulang; sistem indra; sistem endokrin.

- [ ] Author/SME-review age-appropriate reproductive content and the remaining system content.
- [ ] Reuse module shell with reviewed system colours/legend and accessible labels.
- [ ] Add muscle contraction, sensory-stimulus, hormone-release, and approved reproductive-function visualisations.
- [ ] Implement classification, matching, and approved anatomy-puzzle activity with non-drag alternative.
- [ ] Add approved Boss Challenge and completion state.

**Dependencies:** Phase 06–07; AN-09–12; GM-02; DI-02–03; curriculum/SME review.

**Definition of done:** all ten required organ-system domains are present across SC-06–08, medically reviewed, and use shared asset/runtime patterns without duplicate models.

---

## Phase 09 / SC-09 — Mini Game and Evaluation

**Status:** `[-]` — assessment policy/content is required.

**Goal:** provide automatic, auditable evaluation after core learning.

- [ ] Finalise item bank, answer keys, explanation copy, weights, KKM, partial credit, randomisation, attempts, backtracking, and feedback policy.
- [ ] Create content manifest for Organ Puzzle, Organ–Function Matching, Drag and Drop Sistem Organ, MCQ, true/false, and evaluation case study.
- [ ] Implement React `QuestionCard`, `AnswerOption`, `Periksa Jawaban`, feedback, `Berikutnya`, and progress state.
- [ ] Use Phaser only for approved spatial puzzle/placement mechanics; React owns score calculation and KKM comparison.
- [ ] Add robust incomplete/retry/error states and prevent accidental answer loss under approved navigation policy.

**Dependencies:** Phase 00 assessment policy; all required content/assets; Phase 05–08 learning completion state.

**Definition of done:** every explicit evaluation format is represented; answers are processed automatically; feedback is explanatory; a configured test KKM exercises pass and repeat branches; no score rule is hard-coded in a visual component.

---

## Phase 10 / SC-10 — Result, Summary, Glossary, Reflection and Closure

**Status:** `[-]` — certificate and persistence policy is required for final output.

**Goal:** make learning outcome and next steps understandable and respectful.

- [ ] Build pass/repeat outcome model based on configured KKM.
- [ ] Show final score, completion/progress, badge outcome, concise learning recommendations, and approved retry route.
- [ ] Build summary/mind-map and searchable/browsable glossary using reviewed content.
- [ ] Implement reflection prompt; persistence/reporting only if approved.
- [ ] Implement certificate eligibility/display/download only after issuer, learner identity, template, file type, and privacy policy are confirmed.
- [ ] Add one-time, motion-safe result reveal; never load a full anatomy scene for decoration.

**Dependencies:** Phase 09; RW-01; RW-02 only after policy approval; reviewed summary/glossary/reflection content.

**Definition of done:** pass and below-KKM routes are clear, non-colour-only, keyboard/touch accessible, and route to approved retry/Home/finish actions. Certificate is not shown as earned without the required policy and KKM pass.

---

## Phase 11 — Cross-scene hardening and release readiness

**Status:** `[ ]`

**Goal:** verify the complete experience, performance, and content integrity on approved targets.

- [ ] Perform requirement traceability review against `docs/prd/07-requirement-traceability.md`.
- [ ] Run anatomy/physiology SME sign-off for all labels, pathways, feedback, questions, cases, glossary, and certificate copy.
- [ ] Verify all scene transitions, loading/retry/back behaviour, KKM branches, and orientation changes.
- [ ] Test desktop/laptop/tablet/mobile landscape on approved browser/device matrix, touch, keyboard, and screen reader paths.
- [ ] Test captions/transcripts, audio controls, reduced motion, contrast, focus, non-drag alternatives, and no-hover workflows.
- [ ] Measure proposed bundle, TTI, video, FPS, input latency, and repeated scene-switch memory behaviour; fix measured bottlenecks.
- [ ] Validate asset sizes/licences/attributions and lazy-loading/unloading behaviour.
- [ ] Complete classroom usability review for individual and 3–4 learner group use.

**Dependencies:** Phases 01–10 and all decisions/assets/content approvals.

**Definition of done:** every approved requirement is traceable to a verified implementation; no unresolved high-severity medical, accessibility, performance, privacy, or licensing issue remains; release scope and known limitations are documented.

## Operating rule

When a task encounters a `TBD` that materially changes learning, scoring, privacy, scope, or medical accuracy, mark it `[-]`, link the relevant decision ID from `docs/design/11-design-decisions.md`, and request direction. Do not turn a proposal into an implicit requirement.
