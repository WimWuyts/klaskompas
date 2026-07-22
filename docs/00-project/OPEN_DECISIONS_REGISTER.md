# Open Decisions Register

| ID | Decision | Status | Needed before |
|---|---|---|---|
| OD-001 | Internal project name remains `KlasKompas`; public name may change later | Locked — Phase 1A | Public design |
| OD-002 | Technology stack for web/PWA and backend | Open — candidate must satisfy D4 realtime, idempotency, concurrency, encrypted queue and audit requirements | Production code |
| OD-003 | Hosting and data location | Open | Production data |
| OD-004 | Version 1 has one teacher user; technical authentication model and future account isolation still to choose | Partially locked | Backend build |
| OD-005 | Smartschool OneRoster 1.1 is preferred source for classes and pupils; CSV remains development/emergency fallback | Partially locked | Import/sync function |
| OD-006 | Smartschool remains official system; KlasKompas syncs roster data and aims for official LVS write support | Partially locked | Attendance/behaviour production |
| OD-007 | School policy and authority for sanctions/order measures | Partially locked — school regulations extracted; internal staff procedure still required | Behaviour workflow |
| OD-008 | Retention for attendance, assessment/make-up, remediation, behaviour, sync logs and follow-up | Partially informed — consolidated proposal exists; school approval open | Production data |
| OD-009 | No full offline-first system; safe local queue and visible sync status | Locked — Phase 1A | Stack choice |
| OD-010 | Make-up workflow distinguishes teacher-owned ordinary work from official examination process and continues through completion, grading and closure | Partially locked — exact ordinary-work authority/deadlines remain open | Make-up module |
| OD-011 | Required exports for class council, parent contact or personal preparation | Open | Reporting |
| OD-012 | School approval, privacy roles and possible DPIA | Partially informed — v1.0 governance gate exists; approval open | Real-data launch |
| OD-013 | Is there an official Smartschool endpoint/custom scope for writing LVS lines/class notes? | Blocked — external confirmation | LVS integration |
| OD-014 | Mapping from KlasKompas categories to school-configured Smartschool LVS structure and rights | Blocked — OD-007/OD-013 | LVS integration |
| OD-015 | Smartschool administrator supplies OneRoster client, source selection, credentials and test access | Open — school action | Roster sync |
| OD-016 | Smartschool OAuth client, redirect URIs and minimum allowed scopes | Open — Smartschool request | Smartschool login |
| OD-017 | Policy for conflicts, disabled accounts and pupils temporarily missing from OneRoster | Open | Roster sync production |
| OD-018 | Verify all extracted rules against the 2026-2027 school regulations before September production use | Open — mandatory annual check | Launch |
| OD-019 | Repeated-behaviour P1/P2 timing: 3 same-category L3/L4 records within 6 class lesson contacts require follow-up; recurrence within 4 contacts after the conversation prompts school-support review | Locked — Phase 1B-D1 | Behaviour rules engine |
| OD-020 | Smartphones are prohibited in every lesson, including third-stage Spanish; only a teacher-activated temporary pedagogical exception is allowed, and refusal of the numbered-pouch instruction creates an internal record and L5 school follow-up without an invented confiscation period | Locked — Phase 1B-D6 | Device workflow |
| OD-021 | L3 is an `internal classroom record with announced response`; it and L4 remain private/local by default, while official warnings, parent contact and Smartschool/LVS records are separate linked objects requiring the authorised school gate and explicit publication confirmation | Locked — Phase 1B-D5 | Behaviour/LVS mapping |
| OD-022 | Which order measures may a subject teacher initiate independently versus only after director/delegate consultation? | Open — school procedure | Formal escalation |
| OD-023 | Immediate temporary removal from class: prior approval versus immediate handover followed by notification | Open — school procedure | Serious/lesson-removal flow |
| OD-024 | Exact authority and standard deadlines for make-up ordinary quizzes/tasks | Open — school/Oase procedure | Make-up module |
| OD-025 | Obtain and audit the Chromebook/laptop brochure referenced in the regulations | Open — source needed | Technology behaviour rules |
| OD-026 | Pupil-facing expectations use mandatory Dutch primary text with optional supporting English or Spanish per class; formal and official communication remains Dutch-first | Locked — Phase 1B-D2 | September materials |
| OD-027 | Active pattern closes after 6 consecutive class lesson contacts without recurrence, explicit successful review, or replacement by an official school process | Locked — Phase 1B-D1 | Behaviour rules engine |
| OD-028 | Default and approved alternative L4 classroom responses per ordinary behaviour category; formal measures remain behind L5 school gate | Locked — Phase 1B-D3 | Behaviour rules and quick interaction |
| OD-029 | Dedicated laptop command centre, touch-first tablet view and rapid phone view; seat plan defaults on laptop/tablet and teacher changes synchronise server-mediated across connected devices with visible offline/conflict states | Locked — Phase 1B-D4 | UI architecture and backend sync |
| OD-030 | KlasKompas includes manually indicated instructional remediation with source, objective/action, status and review outcome; automatic score-based remediation, diagnosis and care-dossier functionality remain excluded | Locked — Phase 1B consolidation | Overview, remediation and follow-up modules |
| OD-031 | Phase 1B v1.0 documents supersede the listed v0.x design drafts as implementation authority while preserving them as historical records | Candidate — awaiting final Phase 1B approval | Phase 1B merge |

## Binding references

### Consolidated Phase 1B authority

- `PHASE_1B_CONSOLIDATED_OPERATING_CONTRACT_v1.0.md`
- `SYSTEM_SCOPE_v1.0.md`
- `PHASE_1B_CONSOLIDATION_AUDIT_v1.0.md`
- `../02-student-follow-up/OPERATIONAL_OVERVIEW_AND_FOLLOW_UP_MODEL_v1.0.md`
- `../01-behaviour-framework/BEHAVIOUR_AND_CLASSROOM_MANAGEMENT_CONTRACT_v1.0.md`
- `../01-behaviour-framework/SCHOOL_POLICY_ALIGNMENT_REGISTER_v1.0.md`
- `../01-behaviour-framework/TEACHER_AUTHORITY_MATRIX_v1.0.md`
- `../04-architecture/SMARTSCHOOL_ACCESS_AND_LVS_MAPPING_v1.0.md`
- `../03-privacy-security/DATA_GOVERNANCE_APPROVAL_GATE_v1.0.md`

### Approved decisions

- `SCOPE_LOCK_PHASE_1A_v1.0.md`
- `DECISION_1B_D1_BEHAVIOUR_PATTERN_RULE_v1.0.md`
- `DECISION_1B_D2_LANGUAGE_PRESENTATION_v1.0.md`
- `DECISION_1B_D3_DIRECT_CLASSROOM_RESPONSES_v1.0.md`
- `DECISION_1B_D4_DEVICE_LAYOUT_AND_REALTIME_SYNC_v1.0.md`
- `DECISION_1B_D5_INTERNAL_OFFICIAL_RECORD_BOUNDARY_v1.0.md`
- `DECISION_1B_D6_SMARTPHONE_RULE_v1.0.md`

### Supporting architecture/research

- `../04-architecture/SMARTSCHOOL_INTEGRATION_BOUNDARY_v0.1.md`
- `../04-architecture/DIRECT_RESPONSE_CONFIGURATION_CONTRACT_v0.1.md`
- `../04-architecture/CLASSROOM_QUICK_INTERACTION_SPEC_v0.1.md`
- `../04-architecture/CROSS_DEVICE_REALTIME_SYNC_SPEC_v0.1.md`
- `../04-architecture/INTERNAL_OFFICIAL_RECORD_BOUNDARY_v0.1.md`
- `../../research/SMARTSCHOOL_INTEGRATION_RESEARCH_2026-07-22.md`
