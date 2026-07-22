# Phase 2A.1 — Automation-first Architecture Preflight v0.1

**Status:** approved start brief  
**Date:** 22 July 2026  
**Owner:** Wim Wuyts  
**Execution branch:** `claude/phase-2a-automation-first-preflight`  
**Data boundary:** fictional data only

## 1. Purpose

Design the technical architecture for the real KlasKompas product while using only fictional pupils and classes during development.

KlasKompas is a personal, single-teacher overview and follow-up tool. It must minimise repeated data entry and automatically carry factual context through the workflow without replacing teacher judgement.

No application framework is installed and no production code is written in this preflight.

## 2. Automation-first product chain

The architecture must support this connected chain:

```text
timetable and class context
→ active lesson session
→ attendance working view
→ missed-assessment candidate
→ teacher make-up decision
→ make-up planning, completion, grading and closure
→ teacher-confirmed remediation
→ follow-up action
→ Today dashboard and pupil overview
```

Classroom-management, parent-contact, school-follow-up, audit and synchronisation records run as separate linked domains in the same personal overview.

## 3. Automation policy

### 3.1 Administrative actions that may be automatic

The architecture should permit safe deterministic automation for:

- suggesting the current or next lesson from the timetable;
- loading the matching class, seat plan and routines;
- joining an already active lesson from a second teacher device;
- initialising pupils as present in the lesson working view;
- deriving a missed-assessment candidate when an assessment and lesson absence coincide;
- pre-filling pupil, class, subject, assessment and source references in later workflows;
- creating or updating dashboard work items from accepted domain-state changes;
- carrying a make-up item through the next administratively implied status queue;
- creating review reminders after a teacher supplies a review date;
- computing D1 lesson-contact windows and creating the required review task;
- propagating accepted changes between the teacher's devices;
- retrying idempotent pending mutations after reconnect;
- preserving audit events, external identifiers and correction relationships;
- replacing fictional roster data through an approved import adapter without rebuilding domain logic.

Automatic actions must be deterministic, explainable, reversible where appropriate and visible in audit history.

### 3.2 Proposals that require teacher confirmation

The system may prepare or propose, but the teacher must explicitly decide:

- whether an ordinary missed assessment must be made up, is exempted or belongs to an official school process;
- the date or arrangement of a make-up assessment;
- whether remediation starts;
- the remediation objective, action and review outcome;
- whether a classroom event requires school follow-up;
- whether parent contact is planned or sent;
- resolution of incompatible concurrent edits;
- conversion of a temporary seat move into a permanent seat assignment;
- correction or withdrawal of a meaningful record;
- any official Smartschool/LVS publication.

### 3.3 Actions that may never be automatic in version 1

- deciding legal absence justification;
- scheduling official examinations independently of Oase/director/class council;
- imposing a sanction, official warning or order measure;
- publishing an internal record as an official school record;
- sending parent communication without explicit confirmation;
- diagnosing a learning, care, behavioural or medical need;
- generating a combined pupil risk score or permanent deficit label;
- inferring motivation, character or intent;
- selecting a school-support route without the teacher or authorised school process.

## 4. Interchangeable data-source architecture

Roster and timetable ingestion must be isolated behind explicit provider interfaces.

The design must support at least:

1. `FictionalSeedSource` — reproducible development and test data;
2. `CsvImportSource` — school-approved manual/emergency import;
3. `SmartschoolOneRosterSource` — future official read-only roster synchronisation.

All providers map to the same internal entities and local UUIDs. External identifiers remain source keys and never replace local primary keys.

The preflight must specify:

- provider contracts;
- validation and rejection reporting;
- idempotent import/sync;
- source provenance;
- school-year rollover;
- disabled/missing pupil handling;
- how fixtures can be reset without affecting production architecture;
- how real-data mode remains technically disabled until governance approval.

## 5. Architecture topics to resolve

Claude Code must produce a concrete recommendation for:

- frontend/PWA structure and responsive device shells;
- backend/API boundary;
- PostgreSQL or alternative relational persistence;
- authentication for one teacher with future tenant isolation;
- revocable device sessions;
- realtime server-mediated subscriptions;
- mutation command model and client-generated mutation IDs;
- transaction boundaries;
- optimistic UI and canonical server acceptance;
- offline pending queue and local encryption strategy;
- record versioning and conflict resolution;
- append-only audit/correction/withdrawal relationships;
- background job or event-processing needs;
- generic follow-up task projection without duplicating domain narratives;
- adapter boundaries for roster, timetable and future Smartschool publication;
- seed-data generation and database migration strategy;
- local development, CI and deployment boundaries;
- observability that never leaks pupil narratives.

## 6. Required domain coverage

The relational model and state-transition design must include:

- teacher and device session;
- school year, subject, class, group, pupil and enrolment;
- timetable entry and lesson session;
- seat plan and temporary seat move;
- attendance working record;
- assessment;
- pupil assessment participation/missed status;
- make-up assessment workflow;
- remediation workflow;
- generic follow-up action projection;
- internal classroom record and direct response;
- behaviour-pattern review;
- conversation/repair action;
- parent-contact action;
- school-follow-up request;
- official-school-record reference;
- external publication attempt;
- mutation, sync state, conflict and audit event.

The model may be modular, but cross-domain links and ownership must be explicit.

## 7. Stack evaluation

Evaluate at least:

- TypeScript PWA plus Supabase/PostgreSQL;
- self-hosted TypeScript plus PostgreSQL;
- Frappe where still credible;
- one justified alternative only when it materially improves the fit.

Use current official documentation and primary sources for technical claims. Record URLs or source references in the report without copying large passages.

The report must provide:

- one primary recommendation;
- one fallback;
- rejected options with reasons;
- proof obligations that remain before the stack can be locked;
- hosting/privacy unknowns clearly separated from engineering fit.

The stack remains a recommendation until project-owner approval and the issue #6 proof.

## 8. Required deliverables

Create or update only documentation and planning artefacts:

1. `docs/04-architecture/ARCHITECTURE_PREFLIGHT_REPORT_v0.1.md`
2. `docs/04-architecture/AUTOMATION_BOUNDARY_MATRIX_v0.1.md`
3. `docs/04-architecture/AUTOMATION_FIRST_DOMAIN_MODEL_v0.1.md`
4. `docs/04-architecture/DATA_SOURCE_ADAPTER_DESIGN_v0.1.md`
5. `docs/04-architecture/REALTIME_OFFLINE_AND_CONFLICT_DESIGN_v0.1.md`
6. `docs/04-architecture/STACK_EVALUATION_MATRIX_v0.1.md`
7. `docs/04-architecture/PROTOTYPE_VERTICAL_SLICE_PLAN_v0.1.md`
8. `docs/04-architecture/PHASE_2A_TEST_STRATEGY_v0.1.md`
9. `docs/00-project/PHASE_2A_PREFLIGHT_HANDOVER_v0.1.md`

Update `OPEN_DECISIONS_REGISTER.md` only for genuine decisions exposed by the preflight. Do not lock them without owner approval.

## 9. Vertical-slice plan requirement

The proposed first functional slice must exercise one connected scenario with fictional data:

```text
open scheduled lesson
→ mark pupil absent on phone
→ see update on laptop/tablet
→ link ordinary assessment to lesson
→ create missed-assessment candidate
→ confirm make-up required
→ schedule and complete it
→ mark graded
→ create manual remediation
→ review and close it
→ see every open/closed item in Today and the pupil overview
→ correct one earlier state without deleting history
```

Add one internal classroom record and temporary seat move to prove that classroom-management state shares the same session and synchronisation infrastructure without contaminating assessment/remediation logic.

## 10. Test and proof requirements

The plan must define tests for:

- state-transition invariants;
- idempotent imports and mutations;
- duplicate network retries;
- realtime propagation timing;
- reconnect and replay;
- conflicting edits;
- correction and withdrawal;
- row/tenant isolation even with one version-1 teacher;
- revoked device session;
- seed reset and repeatability;
- source-adapter contract tests;
- no automatic make-up, remediation, sanction or publication decision;
- privacy mode and safe logging.

Issue #6 remains the later executable synchronisation proof.

## 11. Canon and constraints

Read before designing:

- `CLAUDE.md`;
- `docs/00-project/PHASE_1B_CONSOLIDATED_OPERATING_CONTRACT_v1.0.md`;
- `docs/00-project/SYSTEM_SCOPE_v1.0.md`;
- `docs/02-student-follow-up/OPERATIONAL_OVERVIEW_AND_FOLLOW_UP_MODEL_v1.0.md`;
- `docs/01-behaviour-framework/BEHAVIOUR_AND_CLASSROOM_MANAGEMENT_CONTRACT_v1.0.md`;
- `docs/04-architecture/TECH_STACK_OPTIONS_v0.1.md`;
- `docs/04-architecture/CROSS_DEVICE_REALTIME_SYNC_SPEC_v0.1.md`;
- `docs/04-architecture/INTERNAL_OFFICIAL_RECORD_BOUNDARY_v0.1.md`;
- `docs/04-architecture/SMARTSCHOOL_ACCESS_AND_LVS_MAPPING_v1.0.md`;
- `docs/03-privacy-security/DATA_GOVERNANCE_APPROVAL_GATE_v1.0.md`;
- approved D1-D6 decision files;
- issue #6 and issue #7.

Never use real pupil data, install a framework, activate production services or invent missing school procedures in this preflight.

## 12. Completion gate

Phase 2A.1 is ready for owner review only when:

- the nine deliverables exist and agree with each other;
- all automation boundaries are explicit;
- the entire core workflow is represented in the domain model;
- data-source replacement is credible;
- the primary and fallback stack recommendations are evidence-based;
- issue #6 has an executable proof plan;
- no application code or real-data configuration was added;
- the handover ends with one exact next Claude Code instruction and no automatic continuation.
