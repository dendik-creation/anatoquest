# Colour and Typography

## Visual direction

`EXPLICIT` The storyboard calls for Poppins and a deep-blue / pale-blue / white / cyan futuristic-anatomy direction, with green, orange, purple, red, and gold used as scene accents. The palette below turns that direction into a small semantic system. Values and accessibility thresholds are `PROPOSED`; they are not stated source colours unless noted.

### Core colour tokens

| Token / name | HEX | RGB | Use and contrast note |
| --- | --- | --- | --- |
| `color.brand.primary` — Anatomy Navy | `#12355B` | 18, 53, 91 | Brand field, dark hero areas, inverse text background. White text ≈ 12.0:1. `EXPLICIT` source value. |
| `color.brand.secondary` — Clinical Blue | `#2463A5` | 36, 99, 165 | Links, secondary emphasis, selected informational controls. White text ≈ 6.0:1. `PROPOSED`. |
| `color.brand.accent` — Discovery Cyan | `#0B91C7` | 11, 145, 199 | Focused interactive anatomy / info accents. Use navy text, not white, for small text. `PROPOSED`; source cyan `#38BDF8` is illustration-only. |
| `surface.canvas` — Mist Blue | `#F4F9FC` | 244, 249, 252 | Main application background. `PROPOSED`. |
| `surface.default` — White | `#FFFFFF` | 255, 255, 255 | Cards, reading surfaces. `EXPLICIT` source direction. |
| `surface.elevated` — Ice | `#EAF6FF` | 234, 246, 255 | Selected/secondary panels, anatomy info backing. `EXPLICIT` source value. |
| `surface.overlay` — Ink veil | `rgb(4 24 43 / .78)` | — | Modal/orientation guard backdrop; preserve context without interaction. `PROPOSED`. |
| `text.primary` — Ink Navy | `#102A43` | 16, 42, 67 | Long-form content; ≈ 14:1 on white. `PROPOSED`. |
| `text.secondary` — Slate Blue | `#486581` | 72, 101, 129 | Supporting descriptions; ≈ 5.8:1 on white. `PROPOSED`. |
| `text.muted` — Quiet Slate | `#627D98` | 98, 125, 152 | Metadata only, not essential instructions. `PROPOSED`. |
| `text.disabled` | `#9FB3C8` | 159, 179, 200 | Disabled controls with disabled affordance. `PROPOSED`. |
| `text.inverse` | `#FFFFFF` | 255, 255, 255 | On navy and semantic dark fills. `EXPLICIT` direction. |

### Actions, semantic states, and game semantics

| Token | HEX | Usage |
| --- | --- | --- |
| `action.primary` | `#117151` | Main progress action, including “Mulai Pembelajaran”; white text ≈ 5.8:1. `PROPOSED`; source green `#48BB78` is too light for white text. |
| `action.hover` / `active` | `#0D5C42` / `#094A35` | Pointer and pressed state; do not signal state by this colour alone. `PROPOSED`. |
| `action.focus` | `#0B91C7` | Outer focus ring with navy inner outline. `PROPOSED`. |
| `state.success` / `game.correct` | `#117151` | Correct response, successful completion. Pair with icon and explanation. `PROPOSED`. |
| `state.warning` | `#B45309` | Caution/unfinished state, not failure. `PROPOSED`. |
| `state.error` / `game.incorrect` | `#B42318` | Incorrect response/system error; pair with text. `PROPOSED`. |
| `state.info` / `game.objective` | `#2463A5` | Neutral educational instruction/current objective. `PROPOSED`. |
| `game.xp` / `game.progress` | `#0B91C7` / `#2463A5` | Motivational points and progress. `PROPOSED`; never imply assessed correctness. |
| `game.reward` | `#B7791F` | Badge/certificate accent; dark text or large-text white only. `PROPOSED`; source gold `#F6C344` remains decorative. |
| `game.interactive` | `#6E4AB5` | Clickable anatomy hotspot/callout; a thin outline, not a large organ recolour. `PROPOSED`. |

### Anatomy colour rules

`PROPOSED`: neutral body silhouette is `#B8C9D6` at controlled opacity. An active organ gets a translucent system overlay plus `game.interactive` outline, label, and a non-colour highlight treatment (halo/pulse only if motion is allowed). Use one approved colour per system in diagrams; never imply physiological facts merely through arbitrary colour. A legend is required whenever more than one system colour appears. Use standard red/blue only in carefully reviewed circulation diagrams and label oxygenation explicitly.

## Typography

`EXPLICIT`: Poppins is the primary storyboard typeface. `PROPOSED`: use a locally licensed/subsetted Poppins variable font with `system-ui, sans-serif` fallback; no secondary display typeface is needed. Numeric scores use Poppins tabular numerals where available.

| Token | Family / weight | Size / line height | Tracking | Use |
| --- | --- | --- | --- | --- |
| `type.display` | Poppins 700 | clamp(30px, 3.1vw, 48px) / 1.12 | -0.02em | Splash/result statement. |
| `type.h1` | Poppins 700 | clamp(26px, 2.5vw, 40px) / 1.18 | -0.015em | Screen title. |
| `type.h2` | Poppins 700 | clamp(22px, 2vw, 32px) / 1.25 | -0.01em | Panel/topic title. |
| `type.h3` | Poppins 600 | 20px / 1.3 | 0 | Card/subsection heading. |
| `type.body-lg` | Poppins 400 | 18px / 1.55 | 0 | Introductory explanation. |
| `type.body` | Poppins 400 | 16px / 1.55 | 0 | Standard educational text. |
| `type.body-sm` | Poppins 400 | 14px / 1.5 | 0 | Supporting copy. |
| `type.caption` | Poppins 400 | 12px / 1.4 | 0.01em | Source/status metadata only. |
| `type.button` | Poppins 600 | 14–16px / 1.2 | 0.01em | Controls; never all caps by default. |
| `type.label` | Poppins 600 | 12–14px / 1.3 | 0.03em | Chips, model labels, form labels. |
| `type.score` | Poppins 700, tabular nums | 28–48px / 1 | Score/progress number. |

Readability rules (`PROPOSED`): paragraph measure 45–75 characters; never shrink instructional body below 14 px; avoid centre-aligning multi-line teaching text; labels at anatomy hotspot scale must have a companion information panel.
