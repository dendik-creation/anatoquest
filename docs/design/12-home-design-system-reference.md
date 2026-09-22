# Home Design System Reference

`PROPOSED` unless a row cites an `EXPLICIT`/decision source. This document
captures the concrete values SC-02 Home actually ships with, so later scenes
copy real tokens/patterns instead of re-deriving them from the Figma file.
It supplements — never overrides — `docs/design/00-design-system.md`,
`docs/design/01-color-and-typography.md`, and `docs/design/11-design-decisions.md`.
Source: Figma `AnatoQuest` file, node `16:2` ("Home"), 1920x1080.

## Typeface decision (deviation, confirmed)

`docs/design/01-color-and-typography.md` states Poppins is the `EXPLICIT`
storyboard typeface (DD-07). The shipped app (SC-01 Splash, commit `5339db1`)
instead loads **Plus Jakarta Sans Variable** via `@fontsource-variable/plus-jakarta-sans`,
with Poppins only as a fallback in the stack. When building SC-02 Home this was
raised to the product owner and **the deviation was confirmed to stand**:
Plus Jakarta Sans is the typeface baseline for this app going forward, not Poppins.

- Font stack (`--font-primary` in `src/index.css`): `'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', Poppins, ui-sans-serif, system-ui, sans-serif`.
- Do not reintroduce Poppins loading in new scenes without a matching decision update to DD-07; treat this file, not `01-color-and-typography.md`'s prose, as the current font source of truth until that doc is amended.
- Weights actually used: 800 (h1/card/dialog titles), 600 (buttons), 400 (body/subtitle).

## Colour tokens (`src/index.css`)

| Token | Value | Use on Home |
| --- | --- | --- |
| `--color-brand-primary` | `#12355b` | (reserved; not directly used on Home's light surface) |
| `--color-brand-secondary` | `#2463a5` | "Tidak" dialog button border/text |
| `--color-brand-accent` | `#0b91c7` | (reserved) |
| `--color-action-focus` | `#0b91c7` | All `:focus-visible` outlines |
| `--color-surface-canvas` | `#f4f9fc` | Scene backdrop behind the stage; dialog "Tidak" hover |
| `--color-surface-default` | `#ffffff` | Dialog panel background |
| `--color-surface-overlay` | `rgb(4 24 43 / 0.78)` | Dialog backdrop |
| `--color-text-primary` | `#102a43` | Titles (h1, dialog titles), logo alt semantics |
| `--color-text-secondary` | `#486581` | Subtitle, dialog body copy |
| `--color-text-inverse` | `#ffffff` | Text on the primary dialog button |
| `--color-action-primary` | `#117151` | Dialog primary button ("Ya", "Tutup") |
| `--color-action-primary-hover` | `#0d5c42` | Primary button hover |

These match `docs/design/01-color-and-typography.md`'s `text.primary`,
`text.secondary`, `action.primary` and `surface.overlay` rows exactly — the
palette direction was not deviated from, only the typeface was.

## Stage and layout convention

Reused unchanged from SC-01 Splash — copy this pattern for every future scene
that is a full-bleed illustrated frame:

- Author the scene at a fixed **1920x1080 design stage**, absolutely positioned
  children at literal Figma coordinates, then scale the whole stage with one
  `transform: scale(var(--stage-scale))`.
- Compute `--stage-scale` with `useStageCoverScale(designWidth, designHeight, safeWidth, safeHeight)`:
  covers the viewport, but never scales below what's needed to keep a "safe
  box" (the region holding every meaningful element) inside the viewport.
  Home's safe box is `1860x1046` — logo-to-mascot/exit-button span plus a
  slim margin.
- Background image is the only element excluded from entrance/exit motion and
  is not part of the safe-box calculation.

## Component patterns

- **Baked activity card** (`Materi`, `Simulasi Organ`, `Mini Game`, `Kuis`,
  `Glosarium`, `Mulai Pembelajaran`): the whole card — icon, title,
  description, chevron — ships as one PNG per `docs/architecture` asset
  ownership rules. Render it as `<button aria-label="<Title>"><img alt="" /></button>`:
  the accessible name lives on the button, the image is decorative because its
  text is already baked into pixels.
- **Circular icon button** (info, audio toggle): 93x93 hit target, transparent
  background, art fills it via `object-fit: contain`. Toggle buttons expose
  `aria-pressed` and swap `alt`-less art by state (see `bgm_on`/`bgm_off`).
  Per `DD-14`, this same circular-button pattern is reused for the new
  cross-scene help/`?` button (`UI-04`): clone `tentang_info.png`'s style,
  swap in a question-mark glyph, and reuse it on every scene (not just Home)
- **Primary/pill button with baked art** (Keluar): same pattern as the icon
  button, wider hit target, no separate text layer.
- **Modal/dialog** (own design, no Figma source — used for the exit-confirm
  and info dialogs): fixed-position backdrop button (`aria-label="Tutup dialog"`,
  click-to-dismiss) behind a centered `role="dialog"`/`role="alertdialog"`
  panel — `border-radius: 24px`, `surface.default` background, 32px padding,
  title (800 weight) + body copy (`text.secondary`) + a button row. Primary
  action uses `action.primary` green; the non-destructive/cancel action is an
  outlined "quiet" button in `brand.secondary`. Panel takes focus on mount,
  `Escape` closes and returns focus to the control that opened it. This is the
  reference modal shape for every future confirm/info dialog in the app —
  reuse it rather than inventing a second dialog visual language.

## Motion convention: staggered bubble in/out

Every non-background element enters with **bubble-out + fade-in** and leaves
with the exact reverse, **bubble-in + fade-out** — same two keyframes SC-01
Splash already defined, just re-declared per scene (`home-bubble-out` /
`home-bubble-in`) since nothing is shared cross-scene yet:

```css
@keyframes home-bubble-out { /* 0% opacity:0 scale:.55 → 62% opacity:1 scale:1.06 → 100% scale:1 */ }
@keyframes home-bubble-in  { /* 100% opacity:0 scale:.6, i.e. the reverse of the above */ }
```

- Timing function `cubic-bezier(0.22, 1.18, 0.36, 1)` (the same "pop" easing
  as Splash) for enter; `ease-in` for exit.
- **Staggering**: every animated element carries `className="<scene>__anim"`
  plus an inline `style={{ '--stagger': index }}`. The scene root's
  `data-phase` attribute selects the animation and multiplies the stagger
  index by a fixed step (`50ms` on Home) into `animation-delay`, so elements
  pop in one after another rather than together — reverse the index for the
  exit phase so the sequence visually undoes itself (last-in, first-out).
- `prefers-reduced-motion: reduce` drops scale entirely: swap to a plain
  `fade-in`/`fade-out` keyframe, short fixed duration (140ms on Home), **zero
  stagger delay** (`animation-delay: 0ms` for every element) — motion is
  reduced, not merely slowed.
- If a third scene needs this pattern, promote `*-bubble-out`/`*-bubble-in`
  and the stagger mechanics into a shared stylesheet/hook instead of a third
  copy-paste.

## Accessibility conventions carried forward

- Decorative/baked-text raster images: `alt=""` with `aria-hidden="true"`
  where the element is purely visual; interactive wrappers carry the real
  `aria-label`.
- `:focus-visible` outline is always `3px solid var(--color-action-focus)`
  with a small offset — never remove focus rings, only restyle them.
- Every hover/audio-toggle action has a keyboard/tap equivalent by
  construction (native `<button>`, no hover-only affordances).
- Dialogs: `aria-modal="true"`, `aria-labelledby`/`aria-describedby`, mount
  focus goes to the panel, `Escape` closes, and focus returns to the
  triggering button on close.

## Open items (do not silently resolve)

- Home's Figma frame renders six activity destinations. The PRD's declared
  Home menu set has eight (adds `Profil`, `Petunjuk`) — this is source
  conflict #4 in `CLAUDE.md`/`docs/design/11-design-decisions.md` and remains
  unresolved; this build does not add the missing two.
- The info ("Tentang") button opens a minimal about dialog using only text
  already approved for `index.html`'s meta description. Its real destination/content
  (Petunjuk? a settings panel?) is `TBD`.
- The audio toggle only swaps its own icon/`aria-pressed` state; no audio
  engine exists yet, so it does not (yet) mute anything real.
- "Keluar" always calls `window.close()` per explicit product instruction.
  Note the platform limitation: most browsers only allow script-driven
  `window.close()` on a tab/window that script itself opened; on a normal
  navigated tab this is a silent no-op. No confirmation-of-failure UI was
  requested, so none was added.
- The six activity cards call an optional `onSelectMenu` prop and are
  otherwise inert — none of their destination scenes exist yet
  (`TASKS.md` Phase 03+).
