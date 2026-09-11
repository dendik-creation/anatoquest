# AnatoQuest — Agent Working Agreement

## Product boundary

AnatoQuest — Human Body Explorer is a **web-based educational game / interactive multimedia learning application** for Grade X learners in the Layanan Kesehatan programme (Fase E). It teaches anatomy, physiology, and the relationship between structure and function across ten organ-system domains.

It is **not** a virtual laboratory, clinical diagnostic tool, treatment guide, patient-management workflow, or hospital dashboard.

## Source of truth

Follow this priority order; do not let a design preference override a higher source.

1. Original proposal: `docs/raw/bismilah Gim Lkes7.docx`
2. Existing PRD: `docs/prd/`
3. Design/architecture blueprint: `docs/design/`
4. Implementation foundation and reuse conventions: `docs/architecture/`
5. Existing implementation and repository constraints
6. Clearly labelled recommendations

The implementation-foundation documents transfer reusable engineering patterns
into AnatoQuest; they do not override approved product, curriculum, medical, or
visual-design decisions. In particular, do not copy another project's palette,
brand values, or subject-matter content into this project.

Use the source labels consistently:

- `EXPLICIT` — directly required by proposal/PRD.
- `INFERRED` — necessary reading of an explicit source.
- `PROPOSED` — recommendation, not a confirmed requirement.
- `TBD` — unresolved; do not silently decide it.

## Current project status

- Documentation and planning are complete in `docs/prd/` and `docs/design/`.
- The application package is `app/`: Bun-managed React + Vite + TypeScript with Phaser 3, ESLint, and a minimal lazy Phaser bootstrap host.
- The bootstrap verifies engine creation/destruction only; it is not a product scene, design-system implementation, router, orientation guard, or anatomy visualisation.
- Do not claim product features have been tested merely because the bootstrap builds.
- The canonical planning route currently uses ten scenes, but the source contains a 10-vs-12 scene/level conflict. Treat the ten-scene route as `PROPOSED` until approved.

## Required technology and ownership

The intended stack is React + Vite + Phaser, with React first.

- React owns AppShell, routing, navigation, landscape guard, menus, dialogs, learning prose, video UI, case reading, assessment forms, result UI, settings, progress display, and accessibility.
- Phaser owns only active anatomy visualisation, physiology/pathway animation, and spatial game mechanics where canvas rendering provides clear value.
- Never rebuild normal React UI (buttons, dialogs, cards, MCQ, headers, settings, text-heavy panels) in Phaser.
- Phaser must communicate through a typed bridge: discrete React commands in, meaningful domain events out. Never synchronise per-frame Phaser state into React.
- Load Phaser and large scene assets lazily; destroy inactive Phaser scenes and release scene-local resources.

Before implementing UI or game runtime work, read the relevant entries in the
documentation map below. At minimum, read
`docs/design/03-component-system.md`,
`docs/design/09-react-phaser-architecture.md`,
`docs/design/10-performance-strategy.md`, and
`docs/architecture/00-implementation-foundation.md`. Run Bun commands from
`app/`.

## Routing and navigation model

`EXPLICIT` (confirmed by the product owner, 2026-08-31):

- AnatoQuest is a single-page application with exactly one page, `/`. There is no second URL path.
- Scene changes are internal application state, not navigation. Moving from Splash to Home to a learning scene must never change the path, push a history entry, or trigger a document load.
- Do not introduce React Router, file-based routing, or any URL-driven scene selection. Scene routing is owned by in-app state held above the scene components.
- Scene transitions may still be deep — mount/unmount, lazy chunks, Phaser teardown — as long as the address stays `/`.

Still `TBD` and unchanged by this decision: Home deep links, scene locking, resume, and back-navigation semantics (source conflict 4). A back gesture has no browser history to fall back on, so in-app back behaviour must be designed explicitly.

## Non-negotiable UX rules

- The application is landscape-only. Implement a runtime-backed React `OrientationGuard`; CSS orientation queries are fallback only.
- Portrait must cover the app, block underlying input, announce its message accessibly, pause Phaser, and clear automatically in landscape.
- Preserve readable content on mobile landscape; do not create a portrait redesign.
- Every drag/drop, hover, or audio/motion-dependent action must have a keyboard/tap/text equivalent.
- Use Poppins as the primary typeface, semantic tokens rather than raw colour values, and the approved futuristic anatomy-exploration visual language.
- Treat visual consistency as a system requirement: all backgrounds, UI, icons, diagrams, illustrations, game objects, and generated assets must follow the single 2D educational vector game art direction in `docs/design/04-game-visual-language.md`.
- Every AI asset prompt must explicitly require: “Match the project’s established 2D educational vector game art direction and maintain visual consistency with existing approved assets.” Store the prompt and art-direction approval with the asset.
- Anatomy content requires medically reviewed labels, pathways, answer keys, and feedback. Do not invent medical facts.
- Immediate feedback needs correctness/status **and** a concise scientific explanation.
- Respect reduced motion, captions/transcripts, focus visibility, non-colour state cues, and user-controlled audio.

### Approved SC-01 Splash motion

`EXPLICIT` (confirmed by the product owner, 2026-08-31):

- `main_logo` carries a white glow.
- The `touch_anything` prompt runs a slow, continuous scale-down/scale-up loop.
- Both are decorative. They must be suppressed under `prefers-reduced-motion: reduce`, and neither may change an element's layout box.

## Performance rules

- Keep static UI in React/DOM; do not run a full-screen continuous Phaser loop for application UI.
- Initial load is shell-first. Defer Phaser, 3D layers, video, scene music, and non-current backgrounds.
- Reuse the base body and system overlays; do not create ten duplicate body models.
- Use scene-level asset manifests, texture/asset reuse, capped render DPR, pause inactive scenes, and profile before applying memoisation/pooling.
- Follow proposed budgets and measurement gates in `docs/design/10-performance-strategy.md`; they are targets, not source requirements.

## Content and assessment constraints

- Required learning scope: fundamentals plus respiratory; heart; blood vessels and lymphatic; digestive; nervous; urinary; reproductive; musculoskeletal; sensory; endocrine systems.
- Required activity families include grouping, matching, placement, pathway sequencing, labelling, puzzle, mini-game/Boss Challenge, case interaction, MCQ, true/false, and case evaluation.
- KKM value, weights, partial credit, question bank, retry rules, and answer-review rules are `TBD`. Keep them in content configuration; never hard-code policy values.
- Certificates, account/profile data, persistence, analytics, and teacher reporting are not approved requirements. Do not add them without a decision.

## Working process

1. Start at `docs/README.md`, then read the applicable PRD, design document,
   and architecture-foundation document before touching implementation.
2. Find the relevant phase in `TASKS.md`; complete its dependencies and definition of done.
3. State assumptions in the work output and label them. Raise a blocker for a material `TBD` instead of inventing product policy.
4. Keep content data separate from React/Phaser code. Make every asset reference use the inventory ID where possible.
5. For art-directed interactions, use the safe 16:9 stage convention and
   semantic IDs from `docs/architecture/00-implementation-foundation.md` and
   `docs/architecture/01-interaction-and-content-contracts.md`; never use
   display coordinates as answer/correctness logic.
6. For a new asset or scene, follow ownership, lazy-loading, source-preserving
   optimisation, and verification rules in
   `docs/architecture/02-assets-performance-and-verification.md`.
7. For each phase, verify keyboard/touch, landscape guard, reduced motion, loading/error behaviour, and performance impact proportionately.
8. Update `TASKS.md` task status only when its definition of done is actually satisfied.

## Documentation map

| When changing | Read first | Contract to preserve |
| --- | --- | --- |
| App shell, responsive scene, orientation, shared controls | `docs/design/02-layout-and-responsive.md`, `docs/design/03-component-system.md`, `docs/architecture/00-implementation-foundation.md` | React-first shell, landscape gate, safe 16:9 content layer, accessible controls. |
| Learning task, feedback, assessment, or Phaser mechanic | `docs/design/09-react-phaser-architecture.md`, `docs/architecture/01-interaction-and-content-contracts.md` | Data-driven semantic state; typed React--Phaser boundary; non-canvas alternative. |
| Asset import, image pipeline, preload, or performance work | `docs/design/06-asset-production-plan.md`, `docs/design/10-performance-strategy.md`, `docs/architecture/02-assets-performance-and-verification.md` | Owned asset paths, lazy scene loading, source preservation, measured release gates. |
| Theme, typography, illustration, generated asset | `docs/design/00-design-system.md`, `docs/design/01-color-and-typography.md`, `docs/design/04-game-visual-language.md` | AnatoQuest's approved semantic tokens and one art direction; never import another product's visual values. |
| Scope, medical content, score, persistence, or unresolved product policy | `docs/prd/`, `docs/design/11-design-decisions.md`, `TASKS.md` | Evidence labels and `TBD` boundaries. |

## Source conflicts requiring confirmation

Do not resolve these unilaterally:

1. Ten storyboard scenes vs. “Scene 02–12” in implementation plan.
2. Official material code `KES_LKES_7 No.196` vs. storyboard `LKS_AFTM_1/01`.
3. Pre-learning case (55-year-old) vs. in-app Scene 4 case (18-year-old): separate cases or alternate drafts.
4. Eight Home menus vs. sequential learning route: deep linking, locking, resume, and back navigation.
5. Meaning of Home menu `Profil`.
6. KKM/scoring/attempt/certificate policy; persistence/privacy/licensing; device/browser/offline matrix; accessibility standard; medical review owner.

See `docs/design/11-design-decisions.md` for the complete decision and risk register.
