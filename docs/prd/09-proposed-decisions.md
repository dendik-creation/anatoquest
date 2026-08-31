# Proposed Decisions for Approval

**Parent:** [00-product-requirements.md](00-product-requirements.md). Everything here is **PROPOSED**, not a source requirement.

| ID | Proposed decision | Rationale | Depends on |
| --- | --- | --- | --- |
| PD-001 | Adopt the 10-scene storyboard as the canonical product route until a confirmed 12-scene map is supplied. | It is the only fully described screen/interaction inventory. | Resolution of AQ-001 |
| PD-002 | Treat `KES_LKES_7 No.196` as official metadata and hide legacy `LKS_AFTM_*` codes until confirmed. | The official metadata table is primary; storyboard codes conflict. | Resolution of AQ-002 |
| PD-003 | Make KKM, scoring weights, retries, and certificate conditions content configuration with an approved specification. | The proposal requires the outcome but supplies no numeric/rule values. | MISSING-001, 003, 005 |
| PD-004 | Provide keyboard/tap alternatives to drag/drop, visible focus, captions/transcripts, audio controls, and reduced-motion support. | Stated interaction and media patterns otherwise create access barriers. | MISSING-007 |
| PD-005 | Require anatomy/physiology expert review and traceable source/version control for all educational content and case feedback. | Medical learning accuracy is high-impact; the plan already includes expert validation. | MISSING-011 |
| PD-006 | Keep cases explicitly educational: no diagnostic conclusion, treatment instruction, or lab procedure. | Preserves product scope and learner safety. | AQ-006 |
| PD-007 | Decide supported devices/browsers and performance budget before choosing 3D/media technology. | The source prescribes user experience, not implementation stack. | MISSING-006 |
| PD-008 | Do not add accounts, cloud persistence, telemetry, or analytics before privacy/consent/ownership are approved. | These capabilities are not specified and may collect learner data. | MISSING-004, 009 |
| PD-009 | Model content separately from UI so organ systems, media, activities, questions, feedback, and scoring can be authored/reviewed independently. | The source has substantial educational content and repeated interaction patterns. | MISSING-002, 011 |

