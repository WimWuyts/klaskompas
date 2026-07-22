# Phase 1B Progress — 22 July 2026

## Current status

**Phase 1B consolidation completed on the review branch and ready for project-owner final review.**

No real pupil data, production credentials or official Smartschool publication have been added.

## Source basis

- Schoolreglement 2025-2026, Sint-Joris Bazel.
- Approved Phase 1A scope.
- Approved Phase 1B decisions D1 through D6.
- Project-owner clarification that KlasKompas is primarily a personal overview tool and must include attendance, missed assessments, make-up work and manual remediation.

## Consolidated v1.0 deliverables

### Product and scope

1. `PHASE_1B_CONSOLIDATED_OPERATING_CONTRACT_v1.0.md`
2. `SYSTEM_SCOPE_v1.0.md`
3. `PHASE_1B_CONSOLIDATION_AUDIT_v1.0.md`
4. updated `OPEN_DECISIONS_REGISTER.md`

### Operational pupil follow-up

5. `../02-student-follow-up/OPERATIONAL_OVERVIEW_AND_FOLLOW_UP_MODEL_v1.0.md`

### Classroom management

6. `../01-behaviour-framework/BEHAVIOUR_AND_CLASSROOM_MANAGEMENT_CONTRACT_v1.0.md`
7. `../01-behaviour-framework/SCHOOL_POLICY_ALIGNMENT_REGISTER_v1.0.md`
8. `../01-behaviour-framework/TEACHER_AUTHORITY_MATRIX_v1.0.md`

### Smartschool and governance

9. `../04-architecture/SMARTSCHOOL_ACCESS_AND_LVS_MAPPING_v1.0.md`
10. `../03-privacy-security/DATA_GOVERNANCE_APPROVAL_GATE_v1.0.md`

### Approved detailed decisions retained

11. D1 repeated-behaviour pattern
12. D2 language presentation
13. D3 direct classroom responses
14. D4 device layouts and realtime synchronisation
15. D5 internal-versus-official record boundary
16. D6 smartphone rule

## Consolidated product definition

KlasKompas is one teacher's private operational overview for:

- classes, pupils and lessons;
- attendance exceptions;
- missed assessments;
- make-up decisions and full make-up lifecycle;
- manually indicated remediation;
- classroom management and behaviour follow-up;
- conversations, repair, parent contact and school-follow-up tasks;
- pupil overview by separate domain;
- history, corrections, audit and device synchronisation.

It remains separate from official attendance, full gradebook/reporting, formal sanctions, care dossiers and official Smartschool/LVS records.

## Remediation clarification

Included:

- teacher manually identifies a need;
- links source such as assessment, make-up work or lesson observation;
- records a concise objective/action;
- plans a due/review date;
- follows status and outcome.

Excluded:

- automatic assignment from marks or score thresholds;
- diagnosis or sensitive care narrative;
- automatic official support referral;
- full gradebook or report calculation.

## Checkpoint status

| Checkpoint | Status | Remaining dependency |
|---|---|---|
| 1B.1 School policy alignment | Consolidated v1.0 | 2026-2027 regulations and internal procedures |
| 1B.1 Teacher authority | Consolidated with restrictive defaults | Official order-measure, class-removal and ordinary make-up authority |
| 1B.2 Smartschool/LVS | Boundary and candidate mapping consolidated | Official access, fields, visibility, rights and write route |
| 1B.3 Privacy/governance | Gate consolidated v1.0 | School/privacy/hosting/processor approval |
| Operational overview | Consolidated v1.0 | Prototype validation with fictitious data |
| Device/UI contract | Product behaviour locked | Technology proof and final stack decision |

## Intentional open dependencies

- Schoolreglement 2026-2027.
- Chromebook/laptop brochure.
- Internal order-measure and class-removal procedure.
- Ordinary make-up authority and deadlines.
- Formal school remediation/support process, where applicable.
- Smartschool OneRoster/OAuth access and official LVS write route.
- Hosting, privacy, processor, retention and launch approval.
- Final technology stack after the realtime/offline proof.

These dependencies block real-data production use, but not a fictitious-data prototype.

## Final Phase 1B review question

The project owner must confirm that the v1.0 authority set:

1. correctly treats KlasKompas as a personal overview tool;
2. sufficiently includes attendance, missed assessments, make-up work and manual remediation;
3. preserves the approved D1-D6 classroom-management boundaries;
4. supersedes the listed v0.x drafts for implementation;
5. leaves external school-dependent facts open rather than guessing them.

After that approval, PR #5 may be merged and Phase 1B closed.
