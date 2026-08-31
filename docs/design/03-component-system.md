# React Component System

## Ownership rule

`PROPOSED`: React owns application UI, semantic content, navigation, assessment, forms, accessibility, and overlays. Phaser owns only high-frequency visual/game surfaces. A Phaser scene never recreates a standard button, modal, text-heavy card, or assessment form.

| Component / capability | React | Phaser | Reason |
| --- | :---: | :---: | --- |
| AppShell, route outlet, TopBar, navigation | Yes | No | Semantic navigation, focus, responsive shell. |
| OrientationGuard, dialogs, toast/error states | Yes | No | Must block and announce application-wide state. |
| Buttons, cards, tabs, progress, badges | Yes | No | Standard accessible UI; minimal redraw cost. |
| Learning prose, glossary, summary, reflection | Yes | No | Text-heavy/accessible content. |
| VideoPlayer and caption controls | Yes | No | Native media/accessibility controls. |
| MCQ, true/false, case reading/answer form, result | Yes | No | Form semantics and predictable feedback. |
| 3D/2D anatomy exploration surface | Host/overlay | Yes | React sizes/controls; Phaser draws and hit-tests. |
| Animated pathways, anatomy puzzle, spatial drag board | Host/feedback | Yes | Canvas mechanics benefit from high-frequency render/input. |
| Simple matching / ordering | Preferred | Optional | Use React when cards/text dominate; Phaser only if spatial animation is integral. |
| Scene HUD data | Yes | No | React displays score/objective/progress; Phaser emits events. |
| Particle-only visual flourish | No | Optional | Only low-cost, reduced-motion-safe and scene-local. |

## Component catalogue

| Component | Purpose / variants | Conceptual API | States and accessibility | Responsive / owner |
| --- | --- | --- | --- | --- |
| `AppShell` | Persistent landscape shell; `immersive`, `learning`, `assessment` | `route`, `progress`, `children` | Landmarks: header/main; supplies live region | React; adjusts grid pattern. |
| `OrientationGuard` | Portrait/min-size blocker | `isBlocked`, `returnFocusRef` | Modal semantics, inert background, static/motion-safe illustration | React; fixed viewport. |
| `TopBar` | Context, back, module, progress, settings | `title`, `back`, `progress`, `actions` | Keyboard-first actions, non-colour progress label | React; condensed on mobile landscape. |
| `Navigation` | Home’s eight declared destinations; contextual back path | `items`, `availability`, `onNavigate` | Disabled/locked reason exposed in text | React; grid/scroll rail as needed. |
| `Button` / `IconButton` | Action controls: `primary`, `secondary`, `quiet`, `danger`; sizes | `variant`, `loading`, `disabled`, `icon`, `children` | hover/focus/pressed/disabled; accessible name | React; 44 px min target. |
| `Card` / `Panel` | Standard content container; `default`, `selected`, `interactive`, `feedback` | `heading`, `actions`, `tone` | Never make a generic div clickable without button/link semantics | React; stack/tabs in compact mode. |
| `Badge` / `Achievement` | Progress tag and awarded achievement | `status`, `label`, `icon`, `earnedAt` | Text equivalent; rewards do not convey assessment result alone | React. |
| `ProgressBar` / `ProgressRing` | Completion/level / score overview | `value`, `label`, `max` | `progressbar` semantics and textual percentage | React; bar on compact, ring only when space permits. |
| `Tabs` / `Accordion` | Switch content, visual, activity; glossary detail | `items`, `activeId`, `onChange` | WAI-ARIA patterns; preserve state | React; tabs may become accordion. |
| `Modal` / `Dialog` / `Tooltip` | Confirmation, instruction detail, concise definition | `open`, `title`, `onClose` | Focus trap and Escape except OrientationGuard | React. |
| `InstructionCard` | One of six usage cards | `icon`, `title`, `detail`, `onOpen` | Card button, ordered 1–6 | React; carousel only with explicit controls. |
| `CaseStudyCard` | Case prompt/evidence/symptoms | `case`, `symptoms`, `onSelect` | Educational-not-diagnostic framing; text equivalent to visual symptoms | React; case stays pinned. |
| `AnatomyCanvasHost` | Mount/sizes Phaser visualisation | `sceneKey`, `sceneData`, `onEvent` | Labels and controls outside canvas; fallback/error slot | React host + Phaser child. |
| `AnatomyInfoPanel` | Selected organ identity/location/function | `organ`, `system`, `sourceStatus` | Live update is politely announced; never hover-only | React. |
| `ActivityFrame` | Instructions, objective, canvas/React task, feedback | `activity`, `status`, `onRetry`, `children` | Step/order and input alternative stated | React host. |
| `AnswerOption` / `QuestionCard` | MCQ/true-false | `item`, `selected`, `checked`, `onSelect` | Native radio group where single-select; selected/correct/incorrect/explanation states | React; vertical choices. |
| `FeedbackPanel` | Immediate concept feedback | `tone`, `title`, `explanation`, `nextAction` | icon + text + polite live announcement after submission | React. |
| `VideoPlayer` | Intro/process video | `source`, `poster`, `captions`, `transcript` | Native controls, captions/transcript, no autoplay sound | React. |
| `MediaCard` / `TopicCard` | Learning/module navigation | `media`, `topic`, `progress` | image alt/label; action explicit | React. |
| `ScoreDisplay` / `ResultCard` | Score, KKM outcome, retry/continue | `score`, `kkm`, `outcome`, `actions` | Result wording cannot rely on green/red only | React. |
| `LoadingState`, `ErrorState`, `EmptyState` | Deferred media/scene recovery | `resource`, `retry` | Announce status; provide recovery/back action | React. |
| `SettingsPanel` | Audio, captions, motion, quality controls | `settings`, `onChange` | Stable labels and persistent preference policy `TBD` | React. |

## Component composition

```text
AppShell
├── OrientationGuard
├── TopBar
├── SceneRoute
│   ├── Home / Instruction / Case / Learning / Assessment / Result
│   ├── ActivityFrame
│   │   ├── AnatomyCanvasHost (optional Phaser)
│   │   └── AnatomyInfoPanel + FeedbackPanel
│   └── shared Dialog / Loading / Error states
└── SettingsPanel
```

### State boundaries

- Component-local: open accordion/dialog, selected tab, hover/focus, transient input.
- React scene state: selected answer, active content section, activity feedback and retry UI.
- Global app state: route, progress, completed modules, settings, active assessment run. Persistence remains `TBD`.
- Phaser-local: camera/model transform, pooled objects, animation progress, hit-testing, drag mechanics. It emits only meaningful outcomes/selection events.

`PROPOSED`: define each component’s variants in a component preview/documentation environment only when implementation begins; do not create a second visual system inside game scenes.
