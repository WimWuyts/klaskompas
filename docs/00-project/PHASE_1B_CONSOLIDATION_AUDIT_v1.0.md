# Phase 1B Consolidation Audit v1.0

**Status:** consolidation candidate awaiting project-owner approval  
**Date:** 22 July 2026

## 1. Consolidation objective

Replace a behaviour-heavy collection of drafts with one coherent product contract for KlasKompas as a personal teacher overview covering:

- attendance;
- missed assessments;
- make-up assessments;
- manual remediation;
- classroom management;
- follow-up actions;
- pupil overview;
- history/audit;
- cross-device use;
- Smartschool boundaries;
- privacy/governance.

## 2. New v1.0 authority set

### Project and scope

- `PHASE_1B_CONSOLIDATED_OPERATING_CONTRACT_v1.0.md`
- `SYSTEM_SCOPE_v1.0.md`
- `OPEN_DECISIONS_REGISTER.md`

### Operational follow-up

- `../02-student-follow-up/OPERATIONAL_OVERVIEW_AND_FOLLOW_UP_MODEL_v1.0.md`

### Classroom management

- `../01-behaviour-framework/BEHAVIOUR_AND_CLASSROOM_MANAGEMENT_CONTRACT_v1.0.md`
- approved Decision 1B-D1 through D6 files

### School alignment and authority

- `../01-behaviour-framework/SCHOOL_POLICY_ALIGNMENT_REGISTER_v1.0.md`
- `../01-behaviour-framework/TEACHER_AUTHORITY_MATRIX_v1.0.md`

### Integration and governance

- `../04-architecture/SMARTSCHOOL_ACCESS_AND_LVS_MAPPING_v1.0.md`
- `../03-privacy-security/DATA_GOVERNANCE_APPROVAL_GATE_v1.0.md`
- approved D4/D5 architecture contracts

## 3. Superseded design drafts

The following remain historical source/design records but are no longer implementation authority where a v1.0 document exists:

- `SYSTEM_SCOPE_v0.2.md`;
- `SCHOOL_POLICY_ALIGNMENT_REGISTER_v0.1.md`;
- `TEACHER_AUTHORITY_MATRIX_v0.1.md`;
- `UNIVERSAL_EXPECTATIONS_v0.2.md`;
- `BEHAVIOUR_MATRIX_v0.1.md`;
- `TEACHER_RESPONSE_LADDER_v0.2.md`;
- `BEHAVIOUR_PATTERN_RULES_v0.1.md`;
- `SMARTSCHOOL_ACCESS_AND_LVS_MAPPING_v0.1.md`;
- `DATA_GOVERNANCE_APPROVAL_GATE_v0.1.md`.

Architecture drafts without a v1.0 replacement remain usable only together with the approved D1-D6 decision overlays and the consolidated v1.0 contracts.

## 4. Terminology audit

### Approved

- `Interne klasregistratie`;
- `internal classroom record with announced response`;
- `direct classroom response` / `directe klasreactie`;
- `school follow-up` / `schoolopvolging`;
- separate `official school record`;
- separate `Smartschool publication state`.

### Deprecated

- `documented classroom warning` as an implementation term;
- any wording implying L3 is a formal or official warning;
- any automatic promotion from internal to official.

Legacy wording in historical drafts must not be copied into implementation fixtures, schemas, UI or tests.

## 5. Scope reconciliation

### Preserved from Phase 1A

- one teacher in v1;
- laptop primary, tablet full classroom use, phone quick actions;
- attendance, evaluations/make-up, behaviour, follow-up and audit;
- Smartschool remains official;
- no full gradebook, automated sanctions, AI risk scores or care dossier;
- fictitious data until governance approval.

### Clarified in Phase 1B consolidation

- remediation is included as **manual instructional follow-up**;
- automatic remediation based on marks/scores remains excluded;
- Today and pupil overview combine domains without combining them into a score;
- official examination follow-up remains school-owned;
- internal KlasKompas records remain separate from official records/publication;
- all teacher devices share one canonical state.

## 6. Cross-domain consistency checks

| Check | Result |
|---|---|
| Attendance can generate missed-assessment candidate without deciding legal absence | Pass |
| Missed ordinary assessment requires teacher decision | Pass |
| Official exams remain Oase/director/class-council route | Pass |
| Make-up workflow continues through grading and closure | Pass |
| Manual remediation can link to assessment/make-up/observation | Pass |
| Remediation does not require a full gradebook | Pass |
| Behaviour records do not become official automatically | Pass |
| Parent contact is separate from warning/publication | Pass |
| Cross-device sync is separate from Smartschool publication | Pass |
| No combined pupil score/risk label | Pass |
| Corrections/withdrawals preserve audit history | Pass |
| Real-data use remains blocked by governance gate | Pass |

## 7. Remaining intentional unknowns

These are not product-design gaps to solve through more microdecisions. They require external school or technical evidence:

- official order-measure authority and class-removal procedure;
- make-up deadlines/authority for ordinary work;
- Chromebook/laptop brochure;
- Smartschool clients, scopes, fields, visibility and write route;
- official remediation/support workflow, if the school distinguishes one;
- privacy, hosting, processor, retention and launch approval;
- 2026-2027 school regulations;
- final technology stack after realtime/offline proof.

## 8. Consolidation result

Phase 1B is suitable for closure when the project owner confirms that:

1. KlasKompas is correctly defined as a personal overview tool;
2. attendance, assessments, make-up work and manual remediation are represented sufficiently;
3. D1-D6 classroom-management rules remain correct;
4. the v1.0 authority set supersedes the listed drafts;
5. unresolved external dependencies remain open rather than being guessed.

No code or real-data activation follows automatically from this consolidation approval.
