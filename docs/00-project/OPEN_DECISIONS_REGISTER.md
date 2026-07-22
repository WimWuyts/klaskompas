# Open Decisions Register

| ID | Decision | Status | Needed before |
|---|---|---|---|
| OD-001 | Internal project name remains `KlasKompas`; public name may change later | Locked — Phase 1A | Public design |
| OD-002 | Technology stack for web/PWA and backend | Open | Production code |
| OD-003 | Hosting and data location | Open | Production data |
| OD-004 | Version 1 has one teacher user; technical authentication model and future account isolation still to choose | Partially locked | Backend build |
| OD-005 | Smartschool OneRoster 1.1 is preferred source for classes and pupils; CSV remains development/emergency fallback | Partially locked | Import/sync function |
| OD-006 | Smartschool remains official system; KlasKompas syncs roster data and aims for official LVS write support | Partially locked | Attendance/behaviour production |
| OD-007 | School policy and authority for sanctions/order measures | Partially locked — school regulations extracted; internal staff procedure still required | Behaviour workflow |
| OD-008 | Retention for attendance, behaviour, sync logs and follow-up | Partially informed — school regulation gives general maximum of one year after departure; KlasKompas-specific schedule open | Production data |
| OD-009 | No full offline-first system; safe local queue and visible sync status | Locked — Phase 1A | Stack choice |
| OD-010 | Final status/deadline rules for make-up assessments | Partially informed — ordinary work and examinations require separate workflows | Make-up module |
| OD-011 | Required exports for class council, parent contact or personal preparation | Open | Reporting |
| OD-012 | School approval, privacy roles and possible DPIA | Partially informed — school board is controller and privacy contact exists; KlasKompas approval open | Real-data launch |
| OD-013 | Is there an official Smartschool endpoint/custom scope for writing LVS lines/class notes? | Blocked — external confirmation | LVS integration |
| OD-014 | Mapping from KlasKompas categories to school-configured Smartschool LVS structure and rights | Blocked — OD-007/OD-013 | LVS integration |
| OD-015 | Smartschool administrator supplies OneRoster client, source selection, credentials and test access | Open — school action | Roster sync |
| OD-016 | Smartschool OAuth client, redirect URIs and minimum allowed scopes | Open — Smartschool request | Smartschool login |
| OD-017 | Policy for conflicts, disabled accounts and pupils temporarily missing from OneRoster | Open | Roster sync production |
| OD-018 | Verify all extracted rules against the 2026-2027 school regulations before September production use | Open — mandatory annual check | Launch |
| OD-019 | Repeated-behaviour P1/P2 timing: 3 same-category L3/L4 records within 6 class lesson contacts require follow-up; recurrence within 4 contacts after the conversation prompts school-support review | Locked — Phase 1B-D1 | Behaviour rules engine |
| OD-020 | Exact school procedure when a pupil refuses the smartphone pouch; whether and by whom devices may be retained | Open — school procedure | Device workflow |
| OD-021 | Exact distinction between KlasKompas `documented classroom warning` and official school warning/agenda/Smartschool note | Open — school procedure | Behaviour/LVS mapping |
| OD-022 | Which order measures may a subject teacher initiate independently versus only after director/delegate consultation? | Open — school procedure | Formal escalation |
| OD-023 | Immediate temporary removal from class: prior approval versus immediate handover followed by notification | Open — school procedure | Serious/lesson-removal flow |
| OD-024 | Authority and standard deadlines for make-up ordinary quizzes/tasks versus official examinations | Open — school/Oase procedure | Make-up module |
| OD-025 | Obtain and audit the Chromebook/laptop brochure referenced in the regulations | Open — source needed | Technology behaviour rules |
| OD-026 | Decide pupil-facing language presentation for universal expectations: Dutch only or Dutch + English/Spanish | Open — product owner decision | September materials |
| OD-027 | Active pattern closes after 6 consecutive class lesson contacts without recurrence, explicit successful review, or replacement by an official school process | Locked — Phase 1B-D1 | Behaviour rules engine |

## Binding references

- `SCOPE_LOCK_PHASE_1A_v1.0.md`
- `PHASE_1B_SCHOOL_POLICY_AND_ACCESS_INTAKE_v0.1.md`
- `DECISION_1B_D1_BEHAVIOUR_PATTERN_RULE_v1.0.md`
- `../01-behaviour-framework/SCHOOL_POLICY_ALIGNMENT_REGISTER_v0.1.md`
- `../01-behaviour-framework/TEACHER_AUTHORITY_MATRIX_v0.1.md`
- `../01-behaviour-framework/UNIVERSAL_EXPECTATIONS_v0.2.md`
- `../01-behaviour-framework/BEHAVIOUR_MATRIX_v0.1.md`
- `../01-behaviour-framework/TEACHER_RESPONSE_LADDER_v0.2.md`
- `../01-behaviour-framework/BEHAVIOUR_PATTERN_RULES_v0.1.md`
- `../03-privacy-security/DATA_GOVERNANCE_APPROVAL_GATE_v0.1.md`
- `../04-architecture/SMARTSCHOOL_INTEGRATION_BOUNDARY_v0.1.md`
- `../04-architecture/SMARTSCHOOL_ACCESS_AND_LVS_MAPPING_v0.1.md`
- `../../research/SMARTSCHOOL_INTEGRATION_RESEARCH_2026-07-22.md`
