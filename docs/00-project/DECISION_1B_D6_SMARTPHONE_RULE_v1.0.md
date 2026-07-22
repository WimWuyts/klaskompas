# Decision 1B-D6 — Smartphone rule v1.0

**Status:** approved by project owner  
**Approval date:** 22 July 2026  
**Scope:** smartphone use during English and Spanish lessons, including two third-stage Spanish classes

## Rule

Smartphones are prohibited during all lessons taught through KlasKompas, including the two Spanish classes in the third stage.

A smartphone may be used only when the teacher explicitly activates a temporary, bounded pedagogical exception for a specific lesson activity.

## Lesson modes

KlasKompas supports two smartphone lesson modes:

- `prohibited` — default for every lesson and class;
- `teacher_authorised_temporary_use` — explicitly activated by the teacher for one defined activity.

Temporary use requires a visible start and stop action. At the stop action, the lesson automatically returns to `prohibited`.

## Unauthorised use

The immediate teacher instruction is:

> “Het toestel is nu niet toegestaan. Stop het in de genummerde smartphonehoes.”

When the pupil follows the instruction, the lesson continues through the ordinary classroom route.

When the pupil refuses:

```text
internal classroom record
→ reasonable instruction not followed
→ L5 school follow-up
```

KlasKompas does not create repeated warnings, invent a confiscation period or instruct the teacher to retain the device outside the authorised classroom routine.

## Implementation consequences

- Every lesson starts in `prohibited` mode.
- The temporary exception is lesson-scoped, never a permanent class entitlement.
- The interface clearly shows when temporary use is active.
- Start, stop and return-to-prohibited actions synchronise across the teacher's connected devices.
- Refusal creates an internal factual record and a school-follow-up route, not an automatic formal sanction.
- The exact receiving school role and official consequence remain governed by the school's internal procedure.

## Related documents

- `DECISION_1B_D3_DIRECT_CLASSROOM_RESPONSES_v1.0.md`
- `DECISION_1B_D5_INTERNAL_OFFICIAL_RECORD_BOUNDARY_v1.0.md`
- `../01-behaviour-framework/BEHAVIOUR_MATRIX_v0.1.md`
- `../01-behaviour-framework/TEACHER_AUTHORITY_MATRIX_v0.1.md`
- `OPEN_DECISIONS_REGISTER.md`
