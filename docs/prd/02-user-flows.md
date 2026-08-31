# User Flows

**Parent:** [00-product-requirements.md](00-product-requirements.md). All flows reproduce the proposal's intended route; unlabelled routing rules remain `UNSPECIFIED`.

## UF-01 First-time / guided learning — EXPLICIT

```mermaid
flowchart TD
  A[Open application] --> B[Splash: initialise/loading]
  B --> C[Home]
  C --> D[Instructions]
  D --> E[Apersepsi and case]
  E --> F[Fundamentals]
  F --> G[Organ-system learning scenes in sequence]
  G --> H[Mini-game and quiz evaluation]
  H --> I{Meets KKM?}
  I -->|Yes| J[Badge + certificate]
  I -->|No| K[Repeat material or quiz]
  K --> F
  J --> L[Results: summary, glossary, reflection, finish]
```

## UF-02 Returning learner — INFERRED

```mermaid
flowchart LR
  A[Open application] --> B[Home]
  B --> C{Choose a listed menu}
  C --> D[Content / simulation / mini-game / quiz / glossary / profile / instructions]
```

The proposal lists these menu choices but does not specify persisted progress, resume point, locking, or deep-link permissions. It is therefore not evidence of a save/resume feature.

## UF-03 Learning module activity — EXPLICIT

```mermaid
flowchart LR
  A[Open material / system] --> B[See diagrams, 3D model and information]
  B --> C[Select or hover organ]
  C --> D[Highlight + name/location/function]
  D --> E[Watch physiology animation / simulation]
  E --> F[Complete drag/drop, matching, sequence, label or puzzle]
  F --> G[Automatic score, feedback and explanation]
  G --> H[Move to submaterial / next learning scene]
```

## UF-04 Case study — EXPLICIT

```mermaid
flowchart LR
  A[Case and symptoms presented] --> B[Inspect organs / symptoms]
  B --> C[Select organ or drag symptom to organ]
  C --> D[Selected organ highlighted]
  D --> E[Automatic short feedback]
  E --> F[All symptoms placed]
  F --> G[Initial score + short explanation]
  G --> H[Continue to core learning]
```

## UF-05 Evaluation and result — EXPLICIT

```mermaid
flowchart TD
  A[Open Scene 9] --> B[Choose / complete mini-game or quiz item]
  B --> C[Submit Periksa Jawaban]
  C --> D[Record answer, active state, feedback and score]
  D --> E{Another question?}
  E -->|Yes| B
  E -->|No| F[Calculate final score]
  F --> G{Final score >= KKM?}
  G -->|Yes| H[Pass: badge and certificate]
  G -->|No| I[Repeat material or quiz]
  H --> J[Scene 10 results]
```

## Flow constraints

- The proposal explicitly says core learning runs in order by level, but Home exposes several menu choices. Whether direct menu access bypasses the sequence is **UNSPECIFIED**.
- `Back`, exit confirmation, mid-activity retry, loading/error state, and progress resume are **UNSPECIFIED**.
- Scene numbering is inconsistent (1–10 vs. 02–12); see [08-open-questions.md](08-open-questions.md).

