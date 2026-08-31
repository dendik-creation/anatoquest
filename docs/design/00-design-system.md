# AnatoQuest Design System

## Scope and evidence

This is the implementation bridge for **AnatoQuest — Human Body Explorer**. It was derived from the proposal at `docs/raw/bismilah Gim Lkes7.docx` and the existing PRD in `docs/prd/`. The proposal is authoritative; the PRD is an extracted, traceable interpretation. No application code is prescribed or changed here.

### Decision labels

| Label | Meaning |
| --- | --- |
| `EXPLICIT` | Directly required by proposal/PRD evidence. |
| `INFERRED` | Necessary reading of an explicit requirement. |
| `PROPOSED` | Recommended implementation/design decision; needs approval where it changes scope. |
| `TBD` | Source does not determine the answer. |

### Source constraints

- `EXPLICIT` Web SPA, 16:9 learning experience for Grade X Layanan Kesehatan (Fase E).
- `EXPLICIT` Anatomy/physiology exploration, video, simulations/visualisations, cases, activities, immediate feedback, evaluation, badges/certificate, summary, glossary, and reflection.
- `EXPLICIT` Storyboard direction: Poppins; deep/navy blue, pale blue, white, cyan; holographic anatomy; rounded cards; restrained fade, glow, zoom and pulse.
- `EXPLICIT` The product is an educational game/interactive multimedia application, **not** a virtual laboratory, diagnostic aid, or treatment workflow.
- `PROPOSED` Treat the “digital laboratory” imagery only as a quiet futuristic anatomy-learning atmosphere; never put lab apparatus or clinical monitoring in the foreground of a learning task.
- `EXPLICIT — project directive` Visual consistency is a system-level requirement. Backgrounds, UI, icons, illustrations, anatomy, game objects, characters, diagrams, and generated assets are one 2D educational game illustration system—not unrelated individual designs. The authoritative rules are in [04-game-visual-language.md](04-game-visual-language.md).

## Design principles

1. **Structure and function together** — every organ visual pairs identity/location with function or process. `EXPLICIT` learning objective.
2. **Explore before test** — learners inspect, compare, and simulate before evaluated recall. `EXPLICIT` learning route; `PROPOSED` ordering principle.
3. **One task, one focal plane** — text, model, and activity have clear roles; avoid dashboard-like information density. `PROPOSED`.
4. **Scientifically calm, not clinically sterile** — credible labels, diagrams, and pathways are more important than ornamental “medical” UI. `INFERRED` from audience/scope.
5. **Feedback teaches** — correctness feedback always includes a concise concept explanation, not colour or score alone. `EXPLICIT`.
6. **Game energy supports learning** — badges, progress, and Boss Challenges celebrate mastery without timers, lives, or decorative competition unless approved. `EXPLICIT` rewards; `PROPOSED` guardrail.
7. **Landscape is intentional** — wide space supports a model, content, and activity together; portrait blocks interaction rather than collapsing to another product. `PROPOSED` in response to the hard task requirement.
8. **Spend pixels and bytes deliberately** — a static React surface is preferred to a continuously rendered canvas; reuse anatomy assets and animate only meaningfully. `PROPOSED`.
9. **One illustrated world, many asset types** — consistency of shape language, outline, palette, lighting, and detail density takes priority over asset-level realism or spectacle. `EXPLICIT — project directive`.

## Foundations

### Token naming

Use semantic CSS custom properties later, not raw colour literals in components. The conceptual namespace is:

```text
color.brand.{primary,secondary,accent}
surface.{canvas,default,elevated,overlay}
text.{primary,secondary,muted,disabled,inverse}
action.{primary,hover,active,focus,disabled}
state.{success,warning,error,info}
game.{xp,progress,reward,objective,interactive,correct,incorrect}
space.{1..10}
radius.{sm,md,lg,xl,full}
elevation.{none,subtle,card,floating,modal}
motion.{fast,base,slow}
```

Authoring rule: a component may consume semantic tokens only. Illustration and anatomy files may use their approved system colour map, but labels/controls still use semantic UI tokens.

### Spacing, radius, elevation and motion

| Tokens | Value | Intended use |
| --- | ---: | --- |
| `space.1–10` | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 px | All layout gaps, padding, and page rhythm. `PROPOSED` |
| `radius.sm/md/lg/xl/full` | 8, 12, 16, 24, 999 px | Controls; compact cards; standard cards; dialogs/feature panels; pills. `PROPOSED` |
| `elevation.none/subtle/card/floating/modal` | none; 0 1px 2px rgb(15 23 42 / .08); 0 8px 24px rgb(15 23 42 / .12); 0 16px 40px rgb(15 23 42 / .18); 0 24px 64px rgb(2 6 23 / .32) | Use sparingly; borders define surfaces first. `PROPOSED` |
| `motion.fast/base/slow` | 120 / 180 / 280 ms | State, panel, and scene transitions. `PROPOSED`; `prefers-reduced-motion` reduces to 0–80 ms. |

## Global interaction rules

- `EXPLICIT` Hover, click/hit, swipe, show, and drag/drop occur where storyboarded.
- `PROPOSED` Every hover affordance must have an equivalent focus and tap/click state. Drag/drop must offer a select-then-place equivalent.
- `PROPOSED` Minimum interactive target is 44 × 44 CSS px; primary learning choices are at least 48 px tall.
- `PROPOSED` Focus uses the focus token with a 3 px outer ring and never relies on colour alone.
- `PROPOSED` Animate opacity/transform where possible; never make the only feedback a flashing anatomical asset. Respect reduced-motion and mute preferences.

## Design validation checklist

| Lens | Pass condition |
| --- | --- |
| Educational | A learner can name the current system, task objective, and relationship between structure/function without decoding decorative UI. |
| Game | Objective, active state, feedback, and next action are visible; score never obscures learning feedback. |
| Accessibility | Text/action contrast is at least WCAG AA; keyboard/tap alternative, captions/transcripts, focus, and reduced motion are specified. |
| Performance | Static surfaces stay in React; system visuals share base assets; motion is interruptible; scene asset ownership is defined. |
| Consistency | React panels, Phaser visualisation, diagrams, video, evaluation, and result rewards use the same typography, colour semantics, labels, and feedback vocabulary. |

See [01-color-and-typography.md](01-color-and-typography.md), [02-layout-and-responsive.md](02-layout-and-responsive.md), and [11-design-decisions.md](11-design-decisions.md).
