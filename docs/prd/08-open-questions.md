# Open Questions, Ambiguities, and Missing Requirements

**Parent:** [00-product-requirements.md](00-product-requirements.md). These items must be resolved or explicitly accepted before implementation planning; no answer is assumed here.

## Ambiguities and contradictions

| Issue ID | Description / affected area | Evidence | Possible interpretations | Recommended resolution |
| --- | --- | --- | --- | --- |
| AQ-001 | Scene count/numbering conflict. | C and E define Scenes 1–10; D says learners complete Scene 02 to Scene 12. | Ten storyboard scenes; twelve implementation levels; or a drafting error. | Confirm canonical scene/level map and update storyboard. |
| AQ-002 | Material code differs by section. | A says `KES_LKES_7 No.196`; storyboard branding says `LKS_AFTM_1` / `LKS_AFTM_01`. | Official code vs. internal/legacy UI code. | Preserve official A code; confirm whether UI code should appear. |
| AQ-003 | Two different initial cases. | D: 55-year-old case; Scene 4: 18-year-old case. | Separate pre-learning/class case and in-app case; or alternate drafts. | Confirm both are intentional and decide scoring/answer keys. |
| AQ-004 | Navigation versus sequence. | Home gives direct menus; D requires level order. | Menus are locked, linked to scenes, or freely accessible. | Define access/locking/back-navigation rules. |
| AQ-005 | “Profil” menu purpose. | Scene 2 only. | Learner profile, author credits, or placeholder. | Define or remove before build. |
| AQ-006 | Visual lab wording. | Storyboard backgrounds/ambience use lab imagery. | Visual atmosphere only, or incorrectly implies a virtual lab. | Confirm visual-only treatment; maintain non-laboratory scope. |
| AQ-007 | Global 2D educational vector art direction versus the proposal’s selectable 360° 3D anatomy model. | Current project art-direction directive; Storyboard Scenes 2 and 5. | Replace 3D with 2D, or preserve 360° model with stylised rendering. | Preserve the explicit 360° exploration requirement; confirm low-poly 3D versus 2.5D delivery, both bound to the shared vector-like art direction. |

## Missing requirements

| ID | Missing decision | Why it is needed |
| --- | --- | --- |
| MISSING-001 | KKM value and score weighting/partial credit. | Determines pass/fail and assessment validity. |
| MISSING-002 | Question bank, answer keys, feedback copy, and content depth. | Required to create reliable assessment/content. |
| MISSING-003 | Activity retries, attempts, skip rules, and Boss Challenge design. | Defines user progression and failure behaviour. |
| MISSING-004 | Identity, authentication, profile fields, persistence, and save/resume. | Determines whether progress/certificate is session-only or durable. |
| MISSING-005 | Certificate content, issuer, learner identity, format, and download method. | Required for a valid certificate experience. |
| MISSING-006 | Device/browser matrix, responsive behaviour, orientation, load/FPS/performance budgets. | 3D/media feasibility and QA depend on it. |
| MISSING-007 | Accessibility requirements: keyboard/touch equivalents, captions, transcript, contrast, screen reader, reduced motion, audio control. | Required for equitable use. |
| MISSING-008 | Offline/PWA and network/media-loading requirements. | Affects web delivery architecture. |
| MISSING-009 | Data privacy, security, consent, retention, and analytics decision. | Necessary before storing learner activity. |
| MISSING-010 | Asset ownership, licences, source files, visual-model formats, audio rights. | Needed for legal production use. |
| MISSING-011 | Medical-content source/citation and expert approval process. | Essential for health-education accuracy. |
| MISSING-012 | Teacher reporting/dashboard/assessment handoff. | Proposal names teacher facilitation but no digital support. |
| MISSING-013 | Error, loading, offline, exit, and recovery behaviour. | Needed for implementation/QA. |
| MISSING-014 | Language/localisation and narration/caption policy. | Indonesian content/narration is supplied but UI language rule is unstated. |
