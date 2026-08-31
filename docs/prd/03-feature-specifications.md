# Feature Specifications

**Parent:** [00-product-requirements.md](00-product-requirements.md). `Source` references the proposal. Priorities are a planning interpretation: every `Must` is essential to the proposal's defined journey; `Should` is explicit but can be delivered within its associated scene; `TBD` requires a decision.

## Core requirement catalogue

### FR-001 — Web learning application
**Requirement:** Deliver AnatoQuest as a web-based, 16:9 single-page application.  
**Priority / Type:** Must / EXPLICIT. **Actor:** Learner. **Precondition:** Application is available. **Trigger:** Learner opens it.  
**Expected behavior:** The application presents the stated educational game/multimedia experience in a 16:9 format.  
**Acceptance criteria:** A learner can access the web application and navigate it without a full-document multi-page experience; the defined scene UI is designed for 16:9.  
**Source:** B. Deskripsi Umum.

### FR-002 — Opening and home navigation
**Requirement:** Show splash/loading/initiation before the home screen, then expose the eight home menus: Mulai Pembelajaran, Materi, Simulasi Organ, Mini Game, Kuis, Glosarium, Profil, Petunjuk.  
**Priority / Type:** Must / EXPLICIT. **Actor:** Learner. **Precondition:** App opened. **Trigger:** Loading completes / menu selected.  
**Expected behavior:** Move from splash to home and respond to each listed menu selection.  
**Acceptance criteria:** Splash includes identity/loading; home displays all eight named choices and each has a defined destination or approved no-content treatment.  
**Source:** C; E Scenes 1–2.

### FR-003 — Guidance
**Requirement:** Provide an instruction scene with six instruction cards, short pop-up detail on card selection, and a Lanjut action to Scene 4.  
**Priority / Type:** Should / EXPLICIT. **Actor:** Learner. **Precondition:** Home/instruction entry. **Trigger:** Opens Petunjuk.  
**Expected behavior:** Cards are visible progressively and touch users can swipe among them.  
**Acceptance criteria:** Six cards, pop-up detail, Lanjut, and swipe support are demonstrable.  
**Source:** E Scene 3.

### FR-004 — Introductory case
**Requirement:** Present the Scene 4 symptom case and let a learner select an organ or drag symptom icons to related organs.  
**Priority / Type:** Must / EXPLICIT. **Actor:** Learner. **Precondition:** Guidance complete. **Trigger:** Case entered.  
**Expected behavior:** Selected organ is highlighted; completion returns automatic short feedback, initial score, and explanation before core material.  
**Acceptance criteria:** Four stated symptoms are usable, placement can be completed, and stated feedback is shown.  
**Source:** D; E Scene 4.

### FR-005 — Fundamental learning content
**Requirement:** Teach definitions of anatomy and physiology, body organisation, homeostasis, and the structure–function relationship.  
**Priority / Type:** Must / EXPLICIT. **Actor:** Learner. **Precondition:** Learning scene opened. **Trigger:** Scene 5.  
**Expected behavior:** Learner can read/view content and perform anatomy-vs-physiology grouping drag/drop.  
**Acceptance criteria:** All named concepts and activity are present.  
**Source:** A; D; E Scene 5.

### FR-006 — 3D anatomy exploration
**Requirement:** Offer a rotatable 360° 3D body model with selectable major organs.  
**Priority / Type:** Must / EXPLICIT. **Actor:** Learner. **Precondition:** Home/material screen. **Trigger:** Organ selection.  
**Expected behavior:** The organ highlights and shows name, location, and basic function.  
**Acceptance criteria:** Brain, lungs, heart, liver, stomach, kidneys, intestine, bones, and muscles are selectable in the fundamentals model.  
**Source:** E Scenes 2, 5.

### FR-007 — Ten organ-system learning domains
**Requirement:** Cover all ten specified organ-system domains in the learning content.  
**Priority / Type:** Must / EXPLICIT. **Actor:** Learner. **Precondition:** Core learning. **Trigger:** Sequential learning route.  
**Expected behavior:** Scene groupings cover Scene 6 (respiratory, heart/blood vessel, lymphatic), Scene 7 (digestive, nervous, urinary), and Scene 8 (reproductive, musculoskeletal, sensory, endocrine).  
**Acceptance criteria:** Content inventory includes every domain listed in A. Identitas.  
**Source:** A; E Scenes 6–8.

### FR-008 — Physiology visualisation
**Requirement:** Display stated physiology animations/visualisations for relevant systems.  
**Priority / Type:** Must / EXPLICIT. **Actor:** Learner. **Precondition:** Relevant scene opened. **Trigger:** System/content chosen.  
**Expected behavior:** Show the processes enumerated in Scenes 5–8.  
**Acceptance criteria:** Respiratory, cardiovascular/lymphatic, digestive/nervous/urinary, and reproductive/musculoskeletal/sensory/endocrine visualisations are represented.  
**Source:** B; E Scenes 5–8.

### FR-009 — Practice interactions
**Requirement:** Provide puzzle, matching, anatomical placement, pathway sequencing, labelling, and drag/drop activity forms where specified.  
**Priority / Type:** Must / EXPLICIT. **Actor:** Learner. **Precondition:** Relevant activity loaded. **Trigger:** Learner performs activity.  
**Expected behavior:** The system evaluates completion and returns score/explanation.  
**Acceptance criteria:** Activities cover named examples: air, blood, food, neural-impulse, and urine-formation pathways, and organ/function matching.  
**Source:** D; E Scenes 5–9.

### FR-010 — Immediate feedback
**Requirement:** Give immediate interactive feedback during gameplay/activities.  
**Priority / Type:** Must / EXPLICIT. **Actor:** Learner. **Precondition:** Learner action evaluated. **Trigger:** Answer/activity interaction.  
**Expected behavior:** Use applicable colour state, animation, SFX, scientific explanation, score, badge, and/or progress bar.  
**Acceptance criteria:** At least a visible correctness/selection response plus score/explanation appears for each scored activity.  
**Source:** B; D; E Scenes 4–10.

### FR-011 — Mini-game and Boss Challenge
**Requirement:** Include mini-game and Boss Challenge at the end of every level.  
**Priority / Type:** Must / EXPLICIT. **Actor:** Learner. **Precondition:** Level material completed. **Trigger:** Level end.  
**Expected behavior:** Learner completes challenge and receives feedback/progress response.  
**Acceptance criteria:** Every approved level definition identifies its end mini-game and Boss Challenge. Exact challenge design is TBD.  
**Source:** D: Tahap Inti.

### FR-012 — Evaluation formats
**Requirement:** Provide Organ Puzzle, Organ–Function Matching, Drag and Drop Sistem Organ, multiple choice, true–false, and case-study evaluation.  
**Priority / Type:** Must / EXPLICIT. **Actor:** Learner. **Precondition:** Material complete. **Trigger:** Scene 9 entry.  
**Expected behavior:** Learner selects/arranges answers and moves by swipe or Berikutnya.  
**Acceptance criteria:** Each named format is represented in the evaluation catalogue.  
**Source:** E Scene 9.

### FR-013 — Answer checking and automatic scoring
**Requirement:** Record answers, provide active selection, show feedback after Periksa Jawaban, and calculate score/final score automatically.  
**Priority / Type:** Must / EXPLICIT. **Actor:** Learner. **Precondition:** Evaluation item active. **Trigger:** Submit/check answer.  
**Expected behavior:** System processes answer and updates result.  
**Acceptance criteria:** An evaluation run produces a calculated final score without manual marking.  
**Source:** C; E Scene 9.

### FR-014 — KKM outcome
**Requirement:** Compare final score against Kriteria Ketuntasan Minimal (KKM).  
**Priority / Type:** Must / EXPLICIT. **Actor:** Learner. **Precondition:** Final score exists. **Trigger:** Evaluation completes.  
**Expected behavior:** At/above KKM is pass; below KKM routes to repeat material or quiz.  
**Acceptance criteria:** Both routes can be tested using configured threshold values. The actual KKM value is TBD.  
**Source:** C; E Scene 9.

### FR-015 — Achievement and certificate
**Requirement:** Award/display badge and certificate for learners who meet KKM.  
**Priority / Type:** Must / EXPLICIT. **Actor:** Learner. **Precondition:** Pass outcome. **Trigger:** Results displayed.  
**Expected behavior:** Badge/certificate use a visual result presentation and learner can select Unduh Sertifikat.  
**Acceptance criteria:** Pass route displays badge and certificate and exposes the stated download action. Certificate file format/identity fields are TBD.  
**Source:** B; C; E Scene 10.

### FR-016 — Result, summary, glossary, reflection
**Requirement:** Present final score, badge, certificate, progress/completion information, summary, glossary, reflection, and closure.  
**Priority / Type:** Must / EXPLICIT. **Actor:** Learner. **Precondition:** Evaluation complete. **Trigger:** Scene 10.  
**Expected behavior:** Learner may open mind-map material or glossary definitions and choose Ulangi Materi, Kembali ke Beranda, or Selesai.  
**Acceptance criteria:** All named result components/actions appear.  
**Source:** C; D; E Scene 10.

### FR-017 — Progress/status indicators
**Requirement:** Display learning progress percentage, level, and badge count on Home; provide progress indication during learning.  
**Priority / Type:** Should / EXPLICIT. **Actor:** Learner. **Precondition:** Home/learning rendered. **Trigger:** Progress changes.  
**Expected behavior:** Indicators reflect the current session/defined progress model.  
**Acceptance criteria:** Home contains all three indicators; learning feedback can show a progress bar. Persistence is TBD.  
**Source:** D; E Scene 2.

### FR-018 — Audio and scene feedback
**Requirement:** Include the scene-appropriate SFX, music, and ambience direction described by the storyboard.  
**Priority / Type:** Should / EXPLICIT. **Actor:** Learner. **Precondition:** Relevant scene entered/action occurs. **Trigger:** Scene/action.  
**Expected behavior:** Sound accompanies stated click, opening, evaluation, result, and ambience moments.  
**Acceptance criteria:** Audio cue inventory maps to each scene; controls are TBD.  
**Source:** E Scenes 1–10.

### FR-019 — Touch and pointer interactions
**Requirement:** Support the specified normal, hover, click/hit, swipe, show, and drag/drop interactions where storyboarded.  
**Priority / Type:** Must / EXPLICIT. **Actor:** Learner. **Precondition:** Applicable UI/scene. **Trigger:** Pointer/touch action.  
**Expected behavior:** Hover lights/enlarges relevant object; click navigates/opens/evaluates; touch can swipe specified content.  
**Acceptance criteria:** Each storyboarded interaction state has a demonstrable behaviour in its corresponding scene.  
**Source:** E Scenes 1–10.

### FR-020 — Educational, non-clinical boundary
**Requirement:** Keep experience focused on anatomy/physiology learning and simple educational cases, not medical diagnosis, treatment, or virtual-laboratory procedures.  
**Priority / Type:** Must / INFERRED. **Actor:** Content author/system. **Precondition:** Any content feature is proposed. **Trigger:** Content review.  
**Expected behavior:** No clinical decision claim or laboratory workflow is introduced.  
**Acceptance criteria:** Content review finds no diagnosis/treatment advice, experiments, or lab procedures.  
**Source:** A–E; project boundary supplied with task.

### FR-021 — Accessible equivalents
**Requirement:** Provide non-drag, non-hover, non-audio-only equivalents for stated interactions.  
**Priority / Type:** TBD / PROPOSED. **Actor:** Learner. **Precondition:** Interaction requires pointer precision/sound/motion. **Trigger:** Alternative input/preference.  
**Expected behavior:** Learner can complete the same educational task using keyboard/tap selection and access text feedback.  
**Acceptance criteria:** Approved accessibility standard and test cases exist.  
**Source:** Recommendation; accessibility absent from proposal.

### FR-022 — Assessment configuration
**Requirement:** Configure KKM, score weights, attempts, and scoring rules outside hard-coded activity behaviour.  
**Priority / Type:** TBD / PROPOSED. **Actor:** Product/content owner. **Precondition:** Assessment build. **Trigger:** Policy changes.  
**Expected behavior:** Approved rules can be inspected and changed with controlled content configuration.  
**Acceptance criteria:** Rules are documented and testable.  
**Source:** Recommendation; values absent from proposal.

### FR-023 — Reflection capture
**Requirement:** Give learners a reflection prompt at closure. Persisting or reporting it is not required.  
**Priority / Type:** Should / EXPLICIT. **Actor:** Learner. **Precondition:** Closing activity. **Trigger:** Reflection step.  
**Expected behavior:** Learner is prompted to communicate experience, benefits, and difficulties.  
**Acceptance criteria:** A reflection prompt appears in closing flow.  
**Source:** D: Penutup dan Refleksi.

### FR-024 — Teacher facilitation context
**Requirement:** The experience must permit teacher-facilitated individual or 3–4-person learning; no teacher dashboard is required.  
**Priority / Type:** Should / INFERRED. **Actor:** Teacher/learner. **Precondition:** Classroom use. **Trigger:** Classroom session.  
**Expected behavior:** Core activities remain usable when learners collaborate at one computer/laptop.  
**Acceptance criteria:** Usability review includes both individual and small-group use; teacher dashboard remains out of scope unless approved.  
**Source:** D: Tahap Inti.

### FR-025 — Global visual art direction
**Requirement:** Treat visual consistency as a system-level requirement: backgrounds, UI controls/panels, icons, illustrations, anatomy/educational diagrams, characters, Phaser game objects, and generated assets share the approved modern 2D educational vector game visual language.  
**Priority / Type:** Must / EXPLICIT — current project directive. **Actor:** Design, art, content, and implementation teams. **Precondition:** Any visual asset is proposed, commissioned, purchased, adapted, or generated. **Trigger:** Asset creation or approval.  
**Expected behavior:** Assets use the documented shape language, outline treatment, gradients/transparency, lighting, palette, detail density, and educational fidelity. Individual realism/spectacle does not override the system.  
**Acceptance criteria:** Each visual asset passes the checklist in `docs/design/04-game-visual-language.md`; AI-generated records retain the required style instruction and source prompt; the explicit 360° anatomy requirement is preserved with approved low-poly/2.5D vector-like treatment rather than photorealistic rendering.  
**Source:** Current project art-direction directive; reconciles with Storyboard Scenes 2 and 5.
