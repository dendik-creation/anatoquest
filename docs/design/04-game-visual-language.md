# Game and Anatomy Visual Language

## Direction

The experience should feel like entering an **anatomy exploration field guide**: deep-blue scientific space, translucent body layers, calm data-like light, and legible learning cards. `EXPLICIT` storyboard ingredients include futuristic digital anatomy, holograms, rounded/glass-like cards, organ highlights, cyan/blue/white palette, and restrained glow/pulse/fade. `PROPOSED`: use these as a visual vocabulary rather than literal hospital dashboards or a virtual laboratory.

## Global visual art direction — system requirement

`EXPLICIT — project directive`: all visual assets belong to **one consistent 2D educational game world**. A background, button, icon, panel, anatomy illustration, character, diagram, Phaser object, reward, and AI-generated asset must look designed by the same illustration system. Visual consistency has priority over realism, spectacle, or an individual asset’s isolated aesthetic.

The project’s global foundation is **modern educational vector game art**: clean 2D illustration; simplified flat shapes; crisp but subtle outlines; soft gradients; controlled transparency; gentle highlights; rounded approachable geometry where appropriate; layered depth without photorealism; and mature, trustworthy scientific/educational communication. It must feel premium and immersive for vocational high-school learners without becoming visually overwhelming, a medical application, hospital dashboard, laboratory simulator, or realistic scientific rendering.

### 360° anatomy reconciliation

There is a source conflict: the proposal explicitly requires a selectable 360° **3D** body/anatomy model, while this project directive establishes a shared 2D educational vector game world. `PROPOSED` resolution: retain the explicit 360° exploration requirement, but art-direct its body model, organ layers, lighting, labels, and animation as a simplified low-poly/2.5D vector-like educational illustration. It must use flat-to-soft-gradient materials, restrained outlines/highlights, the shared palette, and no photorealistic tissue, surgery, specimens, glossy render treatment, or cinematic lighting. `TBD`: confirm the final technical delivery as a true low-poly 3D model or a 2.5D rotational solution; either must satisfy this art direction.

### Reference hierarchy and approval question

Use this order whenever an asset is designed, bought, adapted, or generated:

1. Existing approved project visual system and assets.
2. This global art direction and the token system in [01-color-and-typography.md](01-color-and-typography.md).
3. Asset-category rules below.
4. Specific screen/gameplay requirement.
5. Individual asset aesthetics.

Before approval, ask: **“Does this asset look like it belongs to the same illustration system as the existing game?”** If not, redesign it. Do not compensate with CSS filters, overlays, glow, or effects.

### Non-negotiable shared traits

| Trait | Rule |
| --- | --- |
| Shape language | Simplified vector construction; rounded corners/ends where the object permits; avoid sharp ornamental complexity. |
| Outline | Crisp, subtle, consistent-weight outlines; no mixed hand-drawn, heavy comic, 3D bevel, or outline-free asset packs without normalisation. |
| Gradient / transparency | Soft, low-range gradients and controlled translucency establish depth; never use glossy plastic, hard bevels, or opaque noise for depth. |
| Lighting | One soft, diffuse lighting logic with gentle highlights and restrained shadows. Avoid bloom, specular shine, cinematic contrast, or neon saturation. |
| Detail density | Recognisable at the intended display size first; details support the lesson and do not create visual competition. |
| Palette | Deep anatomy navy `#12355B`, pale blue `#D6F0FF`, cyan `#38BDF8`, supporting blues/teals, and documented restrained warm anatomy emphasis only. New saturated colours require semantic/token approval. |
| Fidelity | Educational recognisability over photographic or biological realism; anatomy remains medically reviewed. |

## Asset category rules

### Backgrounds and environments

- Use layered 2D vector-style environments, soft gradients, simplified scientific/environmental elements, controlled transparency, and low-contrast atmospheric depth.
- Reserve intentional quiet/negative space for titles, body copy, controls, feedback, and accessibility overlays. Crop decorative art responsively instead of shrinking busy compositions.
- Backgrounds provide atmosphere; they must not compete with gameplay or UI. Keep decorative contrast below the reading surface hierarchy.
- Do not use photorealistic environments, 3D renders, stock imagery, cinematic photographic lighting, excessive particles/glow, or high-contrast detail behind text.

### Buttons, panels, and interactive UI

- Construct controls as part of the same vector world: consistent rounded geometry, subtle outline/border, soft gradient only where it reinforces hierarchy, restrained shadow, and gentle highlight.
- Keep hover, active, focus, selected, disabled, and loading states clear while preserving token semantics and accessibility. The outline/stroke, corner radius, and lighting direction must match illustrations and game objects.
- Do not use generic dashboard widgets, glass-heavy cards, glossy 3D buttons, or unrelated component-library styling that clashes with the illustrated environment.

### Icons

- Use simple geometric forms, a consistent stroke weight/cap/join, minimal detail, and recognition at 16–32 px.
- An external set is permitted only after its stroke, corner, colour, and optical size are normalised to this system.
- Do not mix realistic 3D, glossy, highly detailed medical, childish cartoon, or unrelated icon-library styles.

### Illustrations, anatomy, and educational diagrams

- Use simplified anatomical/scientific forms, clean vector shapes, controlled outlines, limited complexity, restrained gradients, and the approved palette.
- Anatomical assets prioritise educational recognisability over biological photorealism. Organs should be clearly identifiable and medically reviewed, not rendered as realistic tissue, surgery, or specimen imagery.
- Diagrams share the same line, node, arrow, callout, label, and system-colour treatment as illustrations; labels remain readable outside canvas at intended sizes.

### Phaser/game and interactive objects

- Tokens, puzzle pieces, draggable organs, hotspots, pathway nodes, effects, badges, and scene props use the same shape language, outline treatment, gradient range, lighting direction, highlight intensity, colour semantics, and detail density.
- A game object must never look imported from a separate game, asset pack, or UI kit. Reuse shared primitives/atlases before creating a visual variant.
- Effects clarify state only: a subtle halo or one-time pulse is acceptable; constant particles, excessive glow, and cinematic effects are not.

## AI asset-generation rule

Every project AI-image prompt **must explicitly state**: **“Match the project’s established 2D educational vector game art direction and maintain visual consistency with existing approved assets.”** Describe the visual language as well as the subject, and include the intended composition/negative space and exclusions when relevant.

```text
Required prompt pattern

Create [subject] for AnatoQuest. Match the project’s established 2D educational
vector game art direction and maintain visual consistency with existing approved
assets: clean simplified vector shapes, subtle consistent outlines, soft gradients,
controlled transparency, gentle highlights, layered depth without photorealism,
deep anatomy navy #12355B, pale blue #D6F0FF, cyan #38BDF8, and documented
semantic accent colours. [Describe educational purpose, composition, and size.]
Avoid photorealism, 3D render styling, generic dashboard UI, excessive neon/glow,
stock-photo lighting, text, logos, and watermarks.
```

The “avoid 3D render styling” instruction applies to ordinary 2D assets. For the explicitly required 360° anatomy model only, replace it with: “Render as a simplified low-poly/2.5D vector-like educational body model; preserve the same palette, outline, lighting, and non-photorealistic treatment as the 2D asset system.”

Example: “Create a simplified educational vector illustration of a human heart using the required AnatoQuest art direction; make it recognisable for a learning activity, not realistic biological tissue.” A request such as “Create a realistic human heart” is non-compliant.

## Consistency approval checklist

- [ ] Does it look like a 2D educational game asset from the same illustration system?
- [ ] Does it use the established palette and documented semantic/system accents?
- [ ] Are shape language, outline/stroke, detail density, gradients, highlights, and lighting consistent?
- [ ] Does it avoid unnecessary realism, spectacle, dashboard styling, and a separate-asset-pack appearance?
- [ ] Is it readable at its intended display size and does it preserve the needed UI negative space?
- [ ] Does it support the educational purpose, accessibility text/caption needs, and medical-review requirement where applicable?

Failing several checks requires redesign, not CSS compensation or excessive visual effects.

## Shared visual grammar

| Meaning | Visual treatment | Behaviour |
| --- | --- | --- |
| Exploration | Neutral anatomical figure against low-contrast ambient field; labelled hotspots | Select makes a crisp outline/halo and opens a React information panel. |
| Current objective | Blue information strip with numbered step and concise verb | Remains visible while task is active. |
| Discoverable object | Purple/cyan outline, label-on-focus, cursor/tap affordance | Uses glow only as supporting cue; focus/tap exposes same label. |
| Learning content | White reading surface with thin blue border, diagram/media adjacent | Limit one primary concept and one visual focus per panel. |
| Process/pathway | Numbered nodes and directional line; motion follows direction | Static arrows/numbering remain understandable with reduced motion. |
| Progress | Blue fill with percentage/level text | Not a medical vital sign or ambiguous chart. |
| Correct / incorrect | Green / red panel, check/cross icon, scientific explanation | Never use a celebratory effect for a wrong answer; retry remains calm. |
| Achievement | Gold edge/icon with navy typography | Reserved for awarded badge/certificate and major completion. |

## Anatomy visualisation specification

### Asset and fidelity rule

`EXPLICIT` The major organs are selectable and show name, location, and basic function; the model can rotate 360°. `PROPOSED`: use a medically reviewed simplified 3D/2.5D educational model—not photorealistic tissue or surgical imagery. Detail supports the stated lesson only and must be reviewed by an anatomy/physiology SME.

### Layers and interaction

1. Base body silhouette / skeletal orientation (`PROPOSED`, reusable).
2. System layer(s), rendered or loaded only as required for the active module.
3. Selected organ highlight and optional isolated focus view.
4. Label/callout layer with collision avoidance; labels have stable list/detail equivalents in React.
5. Physiology pathway/animation layer with play/pause/replay and textual explanation.

The camera defaults to a curriculum-approved anterior orientation. `PROPOSED`: rotate with mouse/touch drag, zoom with explicit +/- controls and pinch where supported; clamp zoom and provide “Reset view.” Interaction hotspots require a generous invisible hit region without concealing neighbouring organs.

### Organ-system colour map

`PROPOSED`; it is a learning legend, not a clinical standard. Use only in-context, show a legend, and retain label text.

| System | Accent | Notes |
| --- | --- | --- |
| Respiratory | `#117151` | Distinct from success by context/label. |
| Heart/circulatory | `#B42318` | Do not use red/blue alone to teach oxygenation. |
| Blood vessels & lymphatic | `#2463A5` | Separate sublayer/outlines if both appear. |
| Digestive | `#B45309` | Warm amber, restrained fill. |
| Nervous | `#6E4AB5` | Purple path/nodes. |
| Urinary | `#0B7285` | Teal. |
| Reproductive | `#A61E4D` | Age-appropriate, neutral presentation; no gendered decorative treatment. |
| Musculoskeletal | `#6B7280` | Neutral slate plus labelled muscle/bone distinction. |
| Sensory | `#C05621` | Orange accent. |
| Endocrine | `#8B5CF6` | Violet, distinct from nervous outline. |

## Activity and feedback language

- `EXPLICIT` activities include grouping, matching, placement, sequencing, labelling, puzzle, mini-game/Boss Challenge, case mapping, and quiz.
- `PROPOSED` task board always contains: objective, concise instruction, progress/step count, interaction surface, alternative input, and feedback/explanation zone.
- `PROPOSED` feedback animation uses 120–180 ms state transition, optional 200–280 ms one-time success movement, and no continuous particles during active task.
- `PROPOSED` Boss Challenge has a distinct “synthesis” framing (e.g. combine structure, function, and sequence) but no enforced timer, combat metaphor, or point value until content rules are approved.

## Media, illustration, and sound

- `EXPLICIT` scenes call for opening/learning/evaluation/closing music, low-volume ambience, and interaction SFX; video and infographics are part of pre-learning.
- `PROPOSED` ambient background starts muted until a user enables audio; no autoplay narration/music. All instructional audiovisual content requires caption/transcript and a visual equivalent.
- `PROPOSED` background artwork is subtle, cropped responsively, and <20% visual contrast relative to reading surfaces. “Glassmorphism” means modest translucency/border, never blur-heavy panels over all content.
- `PROPOSED` certificates and badges use flat vector art; confetti is a single burst after results and disabled with reduced motion.
