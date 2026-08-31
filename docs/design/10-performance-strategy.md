# Performance-First Strategy

## Principle and known risks

The proposal has no quantified load, frame-rate, browser, or memory requirement (`TBD`; PRD MISSING-006). It does require 3D anatomy, animations, video, audio, touch interaction, and 16:9 web delivery. The largest expected risks are combined body-system models/textures, video decode/download, oversized background art, and a React–Phaser integration that causes continuous cross-runtime updates.

All targets below are **`PROPOSED TARGET`**, not proposal commitments. Validate them on an approved low-end device/browser matrix before implementation.

## Performance budget

| Metric | Proposal | Proposed target | Measurement condition |
| --- | --- | --- | --- |
| Initial JS needed for shell/Home | No target | ≤350 KB gzip, excluding deferred Phaser/large media | Production build, cold cache. |
| Time to interactive shell | No target | ≤3.5 s on mid-tier 4G Android; ≤2.5 s desktop broadband | First input works; optional Home preview may still load. |
| Critical initial media | No target | ≤1.5 MB transfer before learner asks for learning visualisation | Brand/UI/background placeholder only. |
| Per learning-module asset bundle | No target | ≤8 MB compressed initial visual bundle; stream/lazy-load extras | Measured per SC-05–08 entry. |
| Video start | No target | first frame ≤2 s after explicit play on target network | Poster/captions available immediately. |
| Canvas frame rate | No target | 50–60 FPS target; ≥30 FPS minimum on validated low-end tier | Active animation only; not a constant home loop. |
| Input feedback | No target | visual acknowledgement ≤100 ms, response/feedback ≤300 ms excluding explicit network loading | Tap/click/drag completion. |
| Device pixel ratio | No target | Cap Phaser render DPR at 2; lower quality tier available | Avoid GPU fill-rate overload. |
| Scene memory | No target | Return close to pre-scene baseline after destroy; investigate sustained >20% growth across module switches | Browser performance/memory profiling. |

## Initial-load and code-splitting plan

1. `PROPOSED` Initial route loads React shell, critical CSS/tokens, brand SVG, orientation guard, Home card metadata, and a low-cost preview placeholder only.
2. `PROPOSED` Defer Phaser, GLB loaders, system anatomy layers, video players/codecs, evaluation spatial game, audio loops, certificate renderer, and all group backgrounds until route intent/entry.
3. `PROPOSED` Vite route-level `import()` boundaries: Home, Guidance/Case, Learning module shell, Phaser bridge/scenes, Assessment, Results. Do not split tiny shared buttons/icons into excessive network requests.
4. `PROPOSED` Preload the next content manifest only after the learner completes the current activity and network/save-data policy allows it. Never preload every 3D system or video at splash.

## React strategy

- Keep frame-rate state in Phaser. React receives only semantic events (selected organ, completed activity, error), avoiding render-per-frame bridge traffic.
- Memoise expensive lists/cards or stable callback boundaries only after profiling; avoid blanket `memo`, `useMemo`, and global-context updates. `PROPOSED`.
- Use selectors/split providers so score/progress updates do not rerender all scenes; unmount inactive routes/large media.
- Render text, forms, feedback, dialogs, and static diagrams in DOM. It is cheaper, searchable, selectable, and accessible than canvas.
- Avoid large CSS blur/backdrop filters and unbounded box shadows, especially on mobile. `PROPOSED`.

## Phaser strategy

- Instantiate Phaser only in an active `AnatomyCanvasHost`; one active game host is the default. Destroy it cleanly on inactive route/unmount.
- Bundle assets by scene/module. Track ref-counted shared base textures; remove module-only textures/audio after scene shutdown. Verify cache keys before loading to avoid duplicates.
- Use texture atlases for repeated cards/tokens/effects; use vector/DOM labels rather than hundreds of dynamic canvas text nodes.
- Use object pools only for repeatable, measured high-churn objects (pathway particles, drag tokens); do not pool one-off UI.
- Do not run an `update` loop for static content, paused scenes, hidden tabs, OrientationGuard, or reduced-motion model preview. Use event/tween completion and visibility APIs to pause.
- Prefer modest 2D/2.5D overlays or low-poly GLB with LOD over a fully detailed medical model on every system. Compress texture assets (KTX2/Basis where viable) and cap maximum texture dimension after target testing.

## Media and delivery

| Media | Strategy |
| --- | --- |
| Backgrounds/illustrations | Export AVIF/WebP variants, responsive `srcset`/CSS image-set, crop decorative parts; lazy load by route. |
| Anatomy | Shared base geometry; separate system layers; compressed GLB; avoid duplicate baked texture packs. Test fallback static diagram. |
| Video | Explicit play; poster; captions/transcript; adaptive WebM/MP4 sources; load metadata first and release/stop on route exit. |
| Audio | User-controlled; lazy load only current-scene cues; short SFX atlas/sprite where appropriate; loop low bitrate. |
| Fonts | Subset Poppins/variable font; `font-display: swap`; use compatible fallback metrics to prevent layout shifts. |

## Mobile resilience

- Detect capability/quality conservatively (DPR, reduced motion, texture budget, measured first scene); offer a `TBD` settings quality mode that lowers DPR, disables decorative effects, and uses diagram fallback before a crash.
- Account for touch hit targets, browser chrome viewport changes, safe-area insets, low-power mode, and background-tab suspension.
- Never depend on hover; use tap selection. Avoid drag-only learning tasks and require no precision-only gesture.
- Treat orientation change as a scene pause and resize event; destroy/recreate only if recovery fails.

## Measurement and release gates

`PROPOSED`: record Vite bundle analysis, Lighthouse/Web Vitals, Chrome/Android memory timeline, FPS/frame-time trace during each activity, and device-network matrix results. Test at least cold/warm cache, first entry to every module, five repeated scene changes, video playback, orientation toggle, reduced motion, and low-quality mode. Optimise only a measured bottleneck; do not reduce educational fidelity blindly.
