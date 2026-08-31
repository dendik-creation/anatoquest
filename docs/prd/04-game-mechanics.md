# Game Mechanics Specification

**Parent:** [00-product-requirements.md](00-product-requirements.md). Values such as points, timers, lives, levels, unlocks, and attempts are `UNSPECIFIED` unless named below.

| ID | Mechanic | Purpose / learner action | System response / state | Success / failure / reward | Type & evidence |
| --- | --- | --- | --- | --- |
| GM-01 | 3D organ exploration | Rotate body 360°; select organ. Learn name, location, and function. | Selected organ glows/highlights; information appears; model may auto-rotate. | No explicit fail/reward. | EXPLICIT — Scenes 2, 5 |
| GM-02 | Anatomy vs physiology grouping | Drag examples into the correct concept group. | Immediate feedback. | Exact success/attempt rule unspecified. | EXPLICIT — Scene 5 |
| GM-03 | Organ/function matching | Pair organ/structure and physiological function. | Automatic score/explanation. | Correct match; scoring value unspecified. | EXPLICIT — D; Scenes 6, 8–9 |
| GM-04 | Anatomical placement | Drag organ to correct anatomical position/system. | Immediate feedback/score/explanation. | Correct placement; retry rule unspecified. | EXPLICIT — D; Scene 9 |
| GM-05 | Physiology sequencing | Sequence air, blood, food, neural impulse, or urine-formation path. | Automatic score/explanation. | Correct ordered path; partial credit unspecified. | EXPLICIT — D; Scenes 6–7, 9 |
| GM-06 | Labelling | Label organ parts. | Feedback described generally. | Answer model unspecified. | EXPLICIT — D |
| GM-07 | Anatomy puzzle | Assemble/solve anatomy puzzle. | Score/feedback described generally. | Puzzle completion; design unspecified. | EXPLICIT — D; Scene 9 |
| GM-08 | Intro case mapping | Select organ or drag symptom to organ. | Highlight selected organ; short feedback; after completion give initial score/explanation. | Completion after all symptoms; correctness scheme unspecified. | EXPLICIT — Scene 4 |
| GM-09 | Mini-game | Educational game challenge during/after content. | Shows feedback/progress. | Exact variants unspecified. | EXPLICIT — B; D; Scene 9 |
| GM-10 | Boss Challenge | End-of-level challenge. | Immediate feedback/progress inferred from general feedback rule. | Occurs at each level end; challenge definition unspecified. | EXPLICIT / INFERRED — D |
| GM-11 | Quiz | Multiple choice, true–false, plus case study; choose answer and check it. | Record answer, active choice, feedback, score; move next with swipe/Berikutnya. | Final score calculated automatically. | EXPLICIT — Scene 9 |
| GM-12 | KKM gate | Complete evaluation. | Compare final score to KKM. | Pass: badge/certificate. Below KKM: repeat material or quiz. KKM value unspecified. | EXPLICIT — C; Scene 9 |
| GM-13 | Achievement feedback | Complete activities/evaluation. | Colour/animation/SFX/explanation/score/badge/progress can appear immediately. | Badge/certificate after pass; badge criteria otherwise unspecified. | EXPLICIT — B; D; Scenes 9–10 |
| GM-14 | Reflection | Finish learning. | Learner reflects on experience, benefits, difficulties. | No score/reward specified. | EXPLICIT — D |

## Mechanic rules intentionally not invented

- Number/name/order of levels beyond the storyboard groupings.
- Point values, penalties, timers, streaks, lives, power-ups, leaderboard, unlocks, and avatar customisation.
- Completion thresholds for individual activities and Boss Challenges.
- Whether activities may be skipped, retried, or accessed from Home before their assigned level.

## Proposed mechanic guardrails

1. `PROPOSED`: Every game mechanic should expose a learning objective and concept explanation; decorative scoring alone should not define success.
2. `PROPOSED`: Provide a tap/click selection alternative to drag/drop and avoid time pressure unless educationally justified and approved.
3. `PROPOSED`: Define assessment scoring separately from motivational score/badge rules so KKM is auditable.

