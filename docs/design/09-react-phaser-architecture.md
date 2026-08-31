# React + Vite + Phaser Architecture

## Decision

`PROPOSED`, required technology direction: use **React + Vite + Phaser**. React is application-first; Phaser is a contained rendering/mechanics runtime. The design inspection began with an empty `app/` directory and no source files. The setup phase now establishes the Bun-managed React + Vite + TypeScript package in `app/`, including Phaser 3, ESLint, a minimal lazy canvas host, and an empty bootstrap scene. Routing, global state, tokens, orientation guard, anatomy assets, and product scenes remain unimplemented. This remains a greenfield target architecture, not a recommendation to replace an existing system.

## Target responsibilities

```text
Vite build / route-level dynamic imports
└── React application
    ├── AppShell, orientation guard, routes and navigation
    ├── semantic learning content, video, assessment, result and settings
    ├── global session/progress/settings store boundary
    └── AnatomyCanvasHost (one active Phaser runtime per mounted host)
        └── Phaser
            ├── AnatomyExplorerScene
            ├── PathwayVisualisationScene
            ├── SpatialActivityScene (only where needed)
            └── shared texture/audio/object-pool lifecycle
```

`PROPOSED`: do not create a Phaser scene for Splash, Home navigation, instructions, reading, MCQ, results, dialogs, top bar, or settings. A Home anatomy preview may use `AnatomyExplorerScene` only if the approved body model needs interactive rotation; otherwise it uses an image/video fallback.

## Conceptual file structure for implementation

This is a future target, not a change to the repository.

```text
app/
├── src/
│   ├── app/
│   │   ├── App.tsx             # AppShell + guard + route outlet
│   │   ├── routes.tsx          # lazy SC-* route modules
│   │   ├── providers/          # settings, session, error boundary
│   │   └── state/              # framework-neutral reducers/selectors
│   ├── features/
│   │   ├── home/ instructions/ case-study/ learning/ assessment/ results/
│   │   ├── anatomy/            # React host/info panel + scene bridge types
│   │   └── settings/
│   ├── game/
│   │   ├── createGame.ts       # Phaser creation/destruction only
│   │   ├── scenes/             # anatomy/pathway/spatial activity
│   │   ├── assets/             # manifests/loader helpers; no content copy
│   │   └── bridge/             # typed commands/events
│   ├── content/                # reviewed data: systems, activities, questions
│   ├── components/             # design-system primitives
│   ├── styles/                 # token CSS and global a11y styles
│   └── assets/                 # packaged P0 UI/brand only; large media external/lazy
├── package.json
└── bun.lock
```

The tree above is a target structure under `app/src/`; current setup provides `App.tsx`, `components/PhaserCanvasHost.tsx`, and `game/createPhaserGame.ts` only. Do not interpret the remaining folders as already implemented.

## State architecture

| State domain | Owner | Persistence / URL | Notes |
| --- | --- | --- | --- |
| Route / scene ID | React router | URL | `PROPOSED`: route IDs map to SC-01…10; content deep-link policy is `TBD`. |
| Orientation / viewport | AppShell React | Ephemeral | Drives OrientationGuard and Phaser pause/resize. |
| Settings (audio, captions, motion, quality) | React global store | `TBD` local persistence | Keep out of canvas and apply through bridge commands. |
| Progress / completed modules / badges | React global store | `TBD` | Source requires display, not save/resume/account. |
| Assessment run / active answer / score | React feature/global state | Session; durable storage `TBD` | Content-configured rules; no hidden Phaser scoring. |
| Organ selection shared with UI | React scene state | Ephemeral | Bridge event produces stable `organId`; React owns info panel. |
| Camera, drag positions, animation time, pooled objects | Phaser scene | Ephemeral | Never mirror frame-by-frame in React. |
| Educational content, questions, case data | Versioned content manifest | Bundled/lazy data | Requires SME approval/version; no medical facts in component code. |

`PROPOSED`: start with React context + reducer or a small external-store abstraction only if cross-route update profiling demonstrates Context fan-out. Do not choose a state library before the real update graph demands it.

## React ↔ Phaser bridge

### Contract

The React host creates one typed bridge per mounted canvas. It passes immutable scene configuration at activation and sends discrete commands only. Phaser emits domain events; it does not import React state or manipulate DOM outside its canvas.

```text
React host -- activate({ moduleId, assetManifest, initialSelection, quality }) --> Phaser
React host -- command({ type: 'select-organ' | 'pause' | 'resume' | 'reset' | 'set-quality' }) --> Phaser

Phaser -- event({ type: 'organ-selected', organId }) --> React host
Phaser -- event({ type: 'activity-progress', activityId, value }) --> React host
Phaser -- event({ type: 'activity-complete', activityId, outcome }) --> React host
Phaser -- event({ type: 'asset-error', assetId, recoverable }) --> React host
Phaser -- event({ type: 'ready' | 'scene-error' }) --> React host
```

### Lifecycle

1. React lazy-loads the route and its small content manifest.
2. `AnatomyCanvasHost` measures its visible container through `ResizeObserver`; it creates Phaser only after non-zero dimensions and user/route need.
3. Host invokes `activate`; Phaser loads only the scene asset bundle and signals `ready`.
4. React sends selection/settings/orientation commands; Phaser emits meaningful events, never per-frame updates.
5. On route change, guard activation, host unmount, or error, host sends `pause`/`shutdown`, unsubscribes bridge listeners, removes resize observer, destroys the game/scene, and explicitly releases scene-owned textures/audio/objects when no other scene needs them.
6. React error boundary presents retry/back. Retry must create a clean bridge rather than reuse partially destroyed Phaser objects.

### Data and error safeguards

- Validate incoming configuration against a small discriminated TypeScript schema before scene activation. `PROPOSED`.
- Map source asset failure to a user-safe fallback (static diagram/list) where pedagogically possible; otherwise show retry and do not award completion. `PROPOSED`.
- Phaser handles spatial completion signals but React/calculation service applies approved score/KKM rules. This keeps evaluation auditable. `PROPOSED`.
- Never transmit user data, analytics, or certificate data through this bridge; policy is `TBD`.

## Content-driven module shape

```ts
type LearningModule = {
  id: string; systemIds: string[]; sections: ContentSection[];
  visualisation?: { scene: 'anatomy' | 'pathway'; assetBundle: string };
  activities: ActivityDefinition[]; bossChallenge?: ActivityDefinition;
};
```

This is illustrative only. It enables SC-06–08 to reuse one module template with different approved content/assets. It does **not** prescribe the missing scoring rules, KKM, cases, question bank, or persistence policy.

## Accessibility implementation boundary

React owns accessible names/instructions, keyboard alternatives, focus return, forms, captions/transcripts, and all feedback copy. Phaser publishes selection/task state and provides pointer affordances, but each canvas activity has React-visible task instructions and an alternative completion mode. `PROPOSED`, addressing PRD MISSING-007.
