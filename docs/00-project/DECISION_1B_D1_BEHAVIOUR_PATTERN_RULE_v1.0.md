# Decision 1B-D1 — Repeated-behaviour pattern rule v1.0

**Status:** approved by project owner  
**Approval date:** 22 July 2026  
**Scope:** internal KlasKompas consistency logic for ordinary repeated classroom behaviour

## Decision

### P1 — required follow-up conversation

Three L3/L4 records in the same behaviour category within the last six lesson contacts with the relevant class create a required short follow-up conversation.

The conversation must:

1. name the factual pattern;
2. check context and preventive support;
3. agree one observable next-step expectation;
4. determine whether school consultation is needed.

P1 creates no automatic sanction and no official school warning.

### P2 — recurrence after the conversation

A further L3/L4 record in the same category within four lesson contacts after the follow-up conversation prompts review of the agreement and preventive support, followed where appropriate by consultation with the class teacher, behaviour coach or student-support route.

An official order measure may only be requested or recorded through the authorised school gate. KlasKompas does not impose it automatically.

### Recovery and closure

An active pattern closes when:

- six consecutive lesson contacts with the class pass without a new L3/L4 record in the same category;
- the teacher explicitly closes it after a successful review; or
- the school replaces it with an official support or order process.

Closure removes the pattern from the active dashboard but does not silently delete or rewrite the underlying records.

## Interpretation rules

- A lesson-contact window is used instead of calendar or school days because class contact frequency differs.
- Unrelated behaviour categories are never added together.
- Official lateness tracking is excluded and remains part of the Oase process.
- Assessment absence is not a behaviour incident.
- Serious or unsafe incidents bypass this pattern mechanism.
- Counts create a review obligation, never an automatic sanction.
- Pupils receive no permanent red status or combined behaviour score.

## Implementation consequences

The eventual rules engine must:

- calculate rolling windows by completed class lesson contacts;
- recalculate auditably when a record is corrected or withdrawn;
- distinguish P1, P2, active, closed and replaced-by-school-process states;
- show a due follow-up action without exposing counts to other pupils;
- keep formal school measures behind the authority gate;
- include automated tests for differing timetable frequencies and boundary contacts.

## Related documents

- `../01-behaviour-framework/BEHAVIOUR_PATTERN_RULES_v0.1.md`
- `../01-behaviour-framework/TEACHER_RESPONSE_LADDER_v0.2.md`
- `../01-behaviour-framework/TEACHER_AUTHORITY_MATRIX_v0.1.md`
- `OPEN_DECISIONS_REGISTER.md`
