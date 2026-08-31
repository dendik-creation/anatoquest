# Landscape Layout and Responsive Behaviour

## Requirement and support envelope

`EXPLICIT` The proposal requires 16:9 and includes touch/swipe for mobile/tablet. The task adds a hard **landscape-only** requirement. Exact devices, browser support, and breakpoints are `TBD` (PRD MISSING-006). This document proposes a safe baseline pending validation.

| Context | Proposed supported viewport | Layout behaviour |
| --- | --- | --- |
| Desktop/widescreen | 1280×720 through 2560×1440, 16:9 / 16:10 / 3:2 | Centred shell, max content 1600 px, backgrounds may bleed. |
| Laptop | 1024×640 and above | Full three-zone learning layout where practical. |
| Tablet landscape | 960×600 and above | Reduced outer gutters; adaptable two-zone content/model view. |
| Mobile landscape | 667×375 and above | Compact header, one contextual secondary panel at a time; no portrait alternative. |
| Below baseline | <667 CSS px wide or <375 CSS px high | `TBD`: show a minimum-size message in addition to orientation guard; content must not be silently unusable. |

The source’s 16:9 format is an authoring canvas, not a reason to letterbox all content. `PROPOSED`: preserve the task hierarchy, crop decorative backgrounds, and keep semantic React text at readable CSS sizes.

## Shell and grid

```text
┌ safe inset ────────────────────────────────────────────────────────────┐
│ TopBar: Back | module/objective/progress                       settings │
├────────────────────────────────────────────────────────────────────────┤
│ page heading / contextual breadcrumb                                     │
│ ┌──── content / controls ────┐  ┌── visualisation / media ───────────┐ │
│ │ 42–48%                     │  │ 52–58%                            │ │
│ │ cards, text, activity       │  │ Phaser canvas / video / diagram   │ │
│ └─────────────────────────────┘  └────────────────────────────────────┘ │
│ sticky task actions / feedback                                             │
└────────────────────────────────────────────────────────────────────────┘
```

- `PROPOSED` Desktop grid: 12 columns, 24 px gutters, outer padding 32–48 px.
- `PROPOSED` Tablet: 8 columns, 16 px gutters, 20–24 px outer padding.
- `PROPOSED` Mobile landscape: 4 columns, 12 px gutters, 16 px outer padding; content panel is switchable/toggleable beside the visualisation rather than becoming illegibly narrow.
- `PROPOSED` Top bar height: 64 px desktop/tablet, 52 px compact mobile landscape. Never hide the active task or exit/back affordance.
- `PROPOSED` Content width: headings/reading panels max 720 px; a page can use wider space for the visualisation, but not prose.
- `PROPOSED` Use `env(safe-area-inset-*)`; interactive controls stay outside mobile browser gesture edges.

## Scene layout patterns

| Pattern | Used by | Responsive rule |
| --- | --- | --- |
| Immersive hero | Splash, Home, Result | Centre the primary action/card; place metadata in corners; decorative hologram is background/low priority. |
| Guided reading + media | Instructions, Fundamentals, learning modules | Keep text and media parallel; compact mode uses tabbed “Materi / Visual / Aktivitas” panels while preserving reading size. |
| Evidence board | Case study | Patient/case prompt stays visible; symptoms and model stack into a two-column drag area on mobile landscape. |
| Task board | Practice, mini-game | Task instructions and feedback are persistent; canvas/board consumes remaining space. |
| Assessment focus | Evaluation | One question at a time; answer options vertically listed; fixed footer contains `Periksa Jawaban` then `Berikutnya`. |

## Orientation guard

### Detection and ownership

`PROPOSED`: React `OrientationGuard` owns this concern at the AppShell root. It derives `isPortrait` from both `matchMedia('(orientation: portrait)')` and `window.visualViewport` / `window.innerWidth < window.innerHeight`; it subscribes to `change`, `resize`, and `visualViewport.resize`, then cleans up listeners on unmount. CSS media queries provide visual fallback only. This satisfies the task requirement not to rely solely on CSS.

When active, the guard renders as a modal-like fixed layer with `inert` applied to the app root (or an equivalent focus/interactivity lock), `aria-modal="true"`, focus directed to its message, and Phaser receives a pause/deactivate command through the integration boundary. On returning to landscape it clears automatically, restores focus to the invoking/last focused element, and resumes only the previously active Phaser scene.

### Visual and accessibility specification

- Full viewport `surface.overlay`, opaque enough to prevent reading/operating the app below.
- Centre card: 280–420 px wide, `surface.default`, `radius.xl`, rotate-device SVG/illustration, title **“Putar perangkat Anda”**, message **“Aplikasi AnatoQuest dirancang untuk mode lanskap. Putar perangkat Anda untuk melanjutkan.”**
- `PROPOSED`: use a gentle 1.5 s rotate loop only when motion is allowed; otherwise static icon. Do not lock device orientation programmatically as the sole solution.
- The message is text, not image; no dismiss action while portrait. Announce once with `aria-live="polite"`; avoid repetitive announcements on resize.
- Desktop narrow windows where height exceeds width receive the same guard. Browser/device-specific orientation lock support is optional enhancement, `TBD`.

## Canvas scaling

`PROPOSED`: Phaser owns a bounded visualisation rectangle supplied by its React host, not the full browser window. Use `ResizeObserver` to pass CSS-pixel dimensions; choose Phaser FIT scaling and centre alignment; cap internal render resolution by device-pixel-ratio (normally `min(devicePixelRatio, 2)`, lower by validated performance tier). Preserve interaction hit areas after resize. Letterbox inside the canvas only when the visual is authored at 16:9; React controls remain outside it.

## Overflow, text, input

- Scroll only the reading/detail region; never put a drag target or a current assessment submit button below an unknown fold.
- Horizontal swipe is reserved for clearly paged cards/submaterial. It must not steal browser scrolling or drag gestures.
- Use truncation only for decorative metadata. Titles wrap; tab labels may shorten with an accessible full name.
- Pointer, keyboard, and touch controls share one responsive layout and state model.
