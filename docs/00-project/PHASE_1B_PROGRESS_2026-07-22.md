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
11. `INTERNAL_OFFICIAL_RECORD_BOUNDARY_v0.1.md`

Approved decision records:

12. `DECISION_1B_D1_BEHAVIOUR_PATTERN_RULE_v1.0.md`
13. `DECISION_1B_D2_LANGUAGE_PRESENTATION_v1.0.md`
14. `DECISION_1B_D3_DIRECT_CLASSROOM_RESPONSES_v1.0.md`
15. `DECISION_1B_D4_DEVICE_LAYOUT_AND_REALTIME_SYNC_v1.0.md`
16. `DECISION_1B_D5_INTERNAL_OFFICIAL_RECORD_BOUNDARY_v1.0.md`
17. `DECISION_1B_D6_SMARTPHONE_RULE_v1.0.md`

## Checkpoint status

| Checkpoint | Status | Notes |
|---|---|---|
| 1B.1 School policy source | Substantially complete | School regulations extracted; internal staff procedures and laptop brochure still required |
| 1B.1 Teacher authority | Drafted, partly locked | Internal L3/L4 route, direct responses and smartphone refusal route are locked; exact authority for official order measures remains open |
| 1B.2 Smartschool/LVS | Partially complete | Internal-versus-official boundary is locked; technical write access, destination fields, visibility and rights mapping remain open |
| 1B.3 Privacy/governance | Partially complete | School board responsibility, access rights and general retention confirmed; external-app approval open |
| Device/UI product contract | Substantially locked | Dedicated device layouts, seat-plan defaults and cross-device realtime behaviour approved; final technology remains open |

## Approved Phase 1B decisions

### 1B-D1 — repeated-behaviour pattern timing

- P1: three same-category L3/L4 records within the last six lesson contacts require a short follow-up conversation.
- P2: another same-category record within four lesson contacts after that conversation prompts review and possible school-support consultation.
- Closure follows six consecutive lesson contacts without recurrence, explicit successful review or replacement by an official school process.
- Counts create review obligations, never automatic sanctions.

### 1B-D2 — pupil-facing language presentation

- Dutch is mandatory and visually primary.
- A class may show Dutch only, Dutch with supporting English or Dutch with supporting Spanish.
- L1/L2 prompts may use the subject language; L3-L5 and official communication remain Dutch-first.

### 1B-D3 — direct classroom responses

- Every ordinary category has one default L4 response and at most one approved alternative.
- The response is shown before L3 and applied at L4 instead of issuing repeated warnings.
- Formal measures remain behind L5; serious incidents bypass the ordinary route.

### 1B-D4 — device layouts and cross-device realtime synchronisation

- Laptop, tablet and phone have purpose-built views.
- Laptop/tablet default to the seat plan when configured.
- Connected teacher devices share one canonical lesson and propagate accepted changes automatically.
- Offline, duplicate and conflicting mutations remain visible and auditably handled.

### 1B-D5 — internal versus official record boundary

- L3 is `internal classroom record with announced response` / `interne klasregistratie`.
- L3/L4 remain teacher-private by default.
- Parent contact, official school records and Smartschool/LVS publication are separate linked lifecycles.
- No automatic promotion or external publication.

### 1B-D6 — smartphone rule

- Smartphones are prohibited during every lesson, including the two third-stage Spanish classes.
- Only a teacher-activated, temporary pedagogical-use window is permitted.
- Every lesson defaults to `prohibited`; stopping authorised use returns immediately to that mode.
- Unauthorised use leads to the numbered-pouch instruction.
- Refusal creates an internal factual record under `reasonable_instruction_not_followed` and opens L5 school follow-up.
- KlasKompas does not prescribe physical confiscation or invent a retention period.

## Important conclusions

- Classroom routines and ordinary organisational responses can be designed now.
- Formal school order measures remain behind an authorisation/consultation gate.
- Serious safety/boundary incidents bypass ordinary warning counts.
- Real pupil data remain prohibited until school approval.
- Behaviour publication to Smartschool/LVS remains blocked until an official write route is confirmed.
- Cross-device KlasKompas synchronisation is separate from Smartschool publication.
- Legacy L3 terminology must be migrated before implementation is considered complete.

## Sources still needed

- 2026-2027 school regulations;
- Chromebook/laptop brochure;
- internal staff procedure for order measures and class removal;
- Smartschool/LVS field and permissions guide;
- Smartschool administrator and privacy/ICT contact confirmation;
- production hosting and processor approval.

## Next review decisions for project owner

- which ordinary follow-up and parent-contact actions should appear in the first prototype;
- whether cross-device presence should show custom device names or generic labels only;
- exact official school-record destinations, visibility and authority once the internal procedures are available.
