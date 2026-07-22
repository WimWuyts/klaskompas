# Phase 1B Progress — 22 July 2026

## Source received

- `Schoolreglement 2025-2026`, Sint-Joris Bazel, 64 pages.

The regulations have been analysed for:

- pedagogical principles;
- attendance and lateness;
- ordinary and examination make-up work;
- smartphone and laptop rules;
- classroom conduct;
- bullying, violence, discrimination and safety;
- restorative, order and disciplinary measures;
- parent communication and Smartschool;
- privacy, access, correction and retention;
- school roles relevant to behaviour and student support.

## Draft deliverables created

1. `SCHOOL_POLICY_ALIGNMENT_REGISTER_v0.1.md`
2. `TEACHER_AUTHORITY_MATRIX_v0.1.md`
3. `SMARTSCHOOL_ACCESS_AND_LVS_MAPPING_v0.1.md`
4. `DATA_GOVERNANCE_APPROVAL_GATE_v0.1.md`

Additional product-design drafts:

5. `UNIVERSAL_EXPECTATIONS_v0.2.md`
6. `BEHAVIOUR_MATRIX_v0.1.md`
7. `TEACHER_RESPONSE_LADDER_v0.2.md`
8. `BEHAVIOUR_PATTERN_RULES_v0.1.md`
9. `CLASSROOM_QUICK_INTERACTION_SPEC_v0.1.md`
10. `CROSS_DEVICE_REALTIME_SYNC_SPEC_v0.1.md`

Approved decision records:

11. `DECISION_1B_D1_BEHAVIOUR_PATTERN_RULE_v1.0.md`
12. `DECISION_1B_D2_LANGUAGE_PRESENTATION_v1.0.md`
13. `DECISION_1B_D3_DIRECT_CLASSROOM_RESPONSES_v1.0.md`
14. `DECISION_1B_D4_DEVICE_LAYOUT_AND_REALTIME_SYNC_v1.0.md`

## Checkpoint status

| Checkpoint | Status | Notes |
|---|---|---|
| 1B.1 School policy source | Substantially complete | School regulations extracted; internal staff procedures and laptop brochure still required |
| 1B.1 Teacher authority | Drafted, not locked | Ordinary direct classroom responses are locked; formal order measures still require clarification of “in consultation with director/delegate” |
| 1B.2 Smartschool/LVS | Partially complete | Official platform role confirmed; technical roster/write access and field mapping open |
| 1B.3 Privacy/governance | Partially complete | School board responsibility, access rights and general retention confirmed; external-app approval open |
| Device/UI product contract | Substantially locked | Dedicated device layouts, seat-plan defaults and cross-device realtime behaviour approved; final technology remains open |

## Approved Phase 1B decisions

### 1B-D1 — repeated-behaviour pattern timing

Approved on 22 July 2026:

- P1: three same-category L3/L4 records within the last six lesson contacts with the class require a short follow-up conversation;
- P2: another same-category L3/L4 record within four lesson contacts after that conversation prompts review and possible school-support consultation;
- closure: six consecutive lesson contacts without recurrence, explicit successful review, or replacement by an official school process;
- counts create review obligations, never automatic sanctions.

### 1B-D2 — pupil-facing language presentation

Approved on 22 July 2026:

- Dutch is mandatory and visually primary for pupil-facing expectations;
- a class may show Dutch only, Dutch with supporting English, or Dutch with supporting Spanish;
- English and Spanish are not shown together;
- L1/L2 routine prompts may optionally use the subject language;
- L3-L5 response text, the private teacher interface and official Smartschool/LVS or parent communication remain Dutch-first;
- the six approved short formulations are stored in Dutch, English and Spanish under one stable semantic rule set.

### 1B-D3 — direct classroom responses

Approved on 22 July 2026:

- every ordinary behaviour category has one default L4 classroom response and no more than one approved alternative;
- the response is shown and confirmed before the L3 warning is spoken;
- recurrence in the same lesson applies the announced L4 response instead of creating another warning;
- routine problems are repaired by completing the missed routine;
- instruction disruption defaults to a seat change;
- non-start/off-task and group disruption default to a bounded individual-work response;
- unauthorised smartphone use defaults to the numbered classroom pouch;
- unauthorised laptop use defaults to closing the device and using an equivalent paper task;
- non-serious disrespect defaults to separation and pausing the interaction;
- material or space misuse defaults to stopping and restoring;
- refusal or an unworkable lesson opens L5 school consultation, never an automatic formal sanction;
- serious incidents bypass the L4 map entirely.

### 1B-D4 — device layouts and cross-device realtime synchronisation

Approved on 22 July 2026:

- laptop uses a dedicated teacher command centre with lesson/context panel, central seat plan or class grid and fixed pupil/action panel;
- tablet uses a touch-first, nearly full-screen seat plan with slide-over controls;
- phone uses a rapid alphabetical list/grid with search, quick actions and optional simplified seat plan;
- laptop and tablet default to the seat plan when configured;
- a behaviour-related seat move is temporary for the current lesson unless explicitly saved as permanent;
- one teacher may use laptop, tablet and phone in the same canonical lesson session;
- a confirmed change on one connected device propagates automatically to the others without refresh;
- the product target is propagation within two seconds after server acceptance under normal connectivity;
- offline changes remain visibly pending and replay idempotently after reconnection;
- duplicate retries do not create duplicate records;
- incompatible concurrent edits create visible conflicts and are never silently overwritten;
- privacy mode hides pupil-identifying operational information immediately.

## Important conclusions

- Classroom routines and ordinary organisational responses can be designed now.
- Formal school order measures must remain behind an authorisation/consultation gate.
- Disciplinary measures are director/delegate-only.
- Serious safety/boundary incidents bypass ordinary warning counts.
- The official Oase lateness process must not be duplicated.
- Examination make-up is an official Oase/director/class-council workflow.
- Real pupil data remain prohibited until school approval.
- Behaviour publication to Smartschool/LVS remains blocked until an official write route is confirmed.
- Cross-device KlasKompas synchronisation is separate from Smartschool publication.
- The final stack must prove realtime subscriptions/server push, idempotency, record versioning, conflict handling, encrypted local queue support and revocable device sessions.

## Sources still needed

- 2026-2027 school regulations;
- Chromebook/laptop brochure;
- internal staff procedure for order measures and class removal;
- Smartschool/LVS field and permissions guide;
- Smartschool administrator and privacy/ICT contact confirmation;
- production hosting and processor approval.

## Next review decisions for project owner

- distinction between internal documented warning and official school warning;
- treatment of smartphone-pouch refusal pending school procedure;
- which ordinary follow-up and parent-contact actions should appear in the first prototype;
- whether cross-device presence should show custom device names or generic labels only.
