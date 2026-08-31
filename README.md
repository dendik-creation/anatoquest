# AnatoQuest — Human Body Explorer

AnatoQuest is a planned web-based educational game and interactive multimedia learning experience for **Murid kelas X konsentrasi keahlian Layanan Kesehatan, Fase E**. It helps learners explore human anatomy and physiology, connect structure with function, and practise through visualisation, simulation, case studies, activities, and evaluation.

> Product boundary: this is not a virtual laboratory, clinical diagnosis tool, or treatment workflow.

## Status

This repository is in the **foundation setup phase**. The PRD and design blueprint are complete, and a React + Vite + Phaser 3 technical bootstrap now lives in `app/`. No learning scene or production asset has been implemented yet.

The intended implementation stack is **React + Vite + Phaser**, with React owning application UI and Phaser reserved for anatomy visualisations and spatial interactive mechanics.

## Learning journey

The current planning baseline follows the fully storyboarded ten-scene route:

```text
Splash
→ Home
→ Instructions
→ Apersepsi & Case Study
→ Fundamentals
→ Respiratory / Heart / Vessels & Lymphatic
→ Digestive / Nervous / Urinary
→ Reproductive / Musculoskeletal / Sensory / Endocrine
→ Mini-game & Evaluation
→ KKM outcome
→ Results, Summary, Glossary & Reflection
```

The proposal also mentions Scene 02–12, which conflicts with the ten storyboard scenes. The route above is a planning recommendation until the product owner confirms the canonical map.

## Documentation map

| Location | Purpose |
| --- | --- |
| `docs/raw/bismilah Gim Lkes7.docx` | Original project proposal; primary source of truth. |
| `docs/prd/` | Extracted requirements, learning content, flows, mechanics, traceability, and open questions. |
| `docs/design/00-design-system.md` | Foundations, tokens, interaction rules, validation. |
| `docs/design/01-color-and-typography.md` | Semantic palette, contrast guidance, typography scale. |
| `docs/design/02-layout-and-responsive.md` | Landscape layouts, safe areas, runtime portrait guard. |
| `docs/design/03-component-system.md` | Component API concepts and React/Phaser ownership. |
| `docs/design/04-game-visual-language.md` | Global 2D educational vector game art direction, anatomy/UI/game-object rules, asset consistency checklist, and mandatory AI prompt pattern. |
| `docs/design/05-asset-inventory.md` | Asset IDs, formats, priorities, production status. |
| `docs/design/06-asset-production-plan.md` | Asset batches, dependencies, reuse, readiness gates. |
| `docs/design/07-scene-architecture.md` | Scene inventory and module-to-feature mapping. |
| `docs/design/08-scene-flow.md` | Learner flow, feature trace, scene-to-asset map. |
| `docs/design/09-react-phaser-architecture.md` | Target source layout, state and typed bridge contract. |
| `docs/design/10-performance-strategy.md` | Lazy-load/unload plan, proposed performance budgets, test gates. |
| `docs/design/11-design-decisions.md` | Repository analysis, traceable decisions, risks, and open questions. |
| `TASKS.md` | Phase-by-phase implementation breakdown and definition of done. |
| `CLAUDE.md` | Working agreement and constraints for implementation agents. |

## Design direction

- Mature, exploratory, scientific, and visually memorable for vocational high-school learners.
- Futuristic anatomy field-guide atmosphere: deep navy, pale blue, white, cyan, restrained system accents, holographic body layers, and readable cards.
- Poppins is the primary typeface.
- Landscape-only, with a runtime orientation guard in portrait.
- Immediate feedback teaches the concept; rewards support mastery rather than competition.

## Architecture at a glance

```text
React + Vite
├── App shell, navigation, orientation guard, settings
├── Learning content, video, cases, MCQ, results, progress
└── AnatomyCanvasHost
    └── Phaser: anatomy exploration, animated pathways, spatial activities
```

React and Phaser communicate through discrete typed events/commands, not shared frame-by-frame state. Large anatomy, video, audio, and scene assets are lazy-loaded by module and released on scene shutdown.

## Run the application

The application package is intentionally isolated in `app/`; project documentation remains at the repository root.

```bash
cd app
bun install
bun dev
```

Quality checks:

```bash
bun run typecheck
bun run lint
bun run build
```

The current screen verifies the React shell and lazy Phaser 3 lifecycle only. It is not an approved learning scene or final UI.

## Before implementation begins

The following decisions need confirmation:

1. Canonical scene/level count and Boss Challenge map.
2. KKM, scoring, retries, question bank, and evaluation policy.
3. The relationship of the two supplied case studies.
4. Home-menu access/locking and the purpose of `Profil`.
5. Devices, browsers, minimum landscape viewport, offline expectations, and performance acceptance criteria.
6. Medical SME/content review, asset licences, accessibility standard, language/narration policy, persistence/privacy, and certificate rules.

Do not install packages or start UI/game implementation until the relevant phase in `TASKS.md` is unblocked or an explicit decision is documented.
