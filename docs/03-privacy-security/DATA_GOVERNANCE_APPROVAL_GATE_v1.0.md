# Data Governance Approval Gate v1.0

**Status:** Phase 1B consolidated; school approval still required  
**Purpose:** prevent real pupil data from entering KlasKompas before purpose, responsibility, hosting, access, retention, rights and incident procedures are approved

## 1. Confirmed school-policy basis

The school board is responsible for pupil-data processing; Wis@d and Smartschool are existing official systems; access is need-to-know; pupils/parents have access/correction rights; health/support information is more restricted; retention must be limited.

## 2. Current gate

Until authorised school approval:

```text
real pupil data = prohibited
Smartschool roster/OAuth = fictitious/test only
Smartschool/LVS publication = disabled
production hosting = not selected
local device queue = fictitious data only
screenshots/analytics/error logs with real data = prohibited
```

## 3. Required approvals

| Gate | Required evidence | Owner | Status |
|---|---|---|---|
| G1 Purpose | Written approval for personal classroom-operation and pupil-follow-up use | School board/director | Open |
| G2 Roles | Controller, processor, sub-processors and teacher role | Privacy lead/school | Open |
| G3 Data inventory | Approved fields, purpose and lawful basis per module | Privacy lead | Open |
| G4 Hosting | Provider, EU/EEA location, backups and support access | ICT/privacy | Open |
| G5 Contracts | Processor/sub-processor terms | School board | Open |
| G6 Risk assessment | DPIA or documented alternative decision | DPO/privacy lead | Open |
| G7 Access | Single-teacher account, recovery, isolation and device-session rules | ICT/privacy | Open |
| G8 Smartschool | OneRoster/OAuth clients, scopes, credentials and logging | Smartschool admin | Open |
| G9 Retention | Per-domain active, closure and deletion schedule | Privacy lead | Open |
| G10 Rights | Access, correction, export, restriction and deletion procedure | Privacy lead | Open |
| G11 Incidents | Breach reporting, contacts, emergency access and runbook | ICT/privacy | Open |
| G12 Device storage | Encrypted pending queue, timeout and managed/personal-device rules | ICT/privacy | Open |
| G13 Official publication | Endpoint/manual route, rights, fields, visibility and confirmation | Smartschool/school | Blocked externally |
| G14 Launch | Fictitious-data test plus signed go/no-go | Project owner + school | Open |

## 4. Candidate production data after approval

### Shared core

- local UUID;
- external OneRoster/Smartschool identifier;
- pupil display name;
- class/subject membership;
- teacher and lesson session;
- audit and synchronisation metadata.

### Attendance

- lesson-level working deviation/status;
- correction reason/audit;
- external official-status reference where authorised.

### Assessments and make-up

- assessment title/type/date/class;
- missed-participation status;
- make-up decision, date and lifecycle;
- exemption/official-process reference;
- no full gradebook by default.

### Remediation

- manually selected source and factual reason category;
- concise instructional objective/action;
- due/review date;
- status and brief outcome;
- related assessment/action identifiers.

Remediation must not include diagnosis, sensitive care narrative or an inferred risk label.

### Classroom management

- structured observable category;
- concise factual description only when necessary;
- internal L3 record and announced response;
- L4 outcome;
- conversation/repair and follow-up state;
- separate school/publication references.

### Follow-up/audit

- action source, owner, status, deadline/review date and outcome;
- meaningful previous/new values;
- device/session/mutation/version metadata;
- publication response/external identifier where available.

## 5. Excluded from v1

- diagnoses, medical history or medication;
- CLB/support-dossier narrative;
- religion/ethnicity profile;
- family narrative beyond an explicitly approved minimal operational instruction;
- photos, audio/video evidence or biometrics;
- emotion/attention detection;
- inferred motivation, character or risk score;
- automatic remediation or sanction profiles;
- free-text copies of sensitive official dossiers.

## 6. Access

- one teacher sees only assigned classes/pupils;
- `teacher_id` and row/tenant isolation remain mandatory even in single-user v1;
- device sessions are reviewable/revocable;
- privacy/quick-lock and timeout are required;
- future school roles require separate approved purpose and access.

## 7. Retention proposal for decision

| Data type | Active use | Closure proposal | Open decision |
|---|---|---|---|
| Roster cache | Current year | Replace/archive at official rollover | Exact deletion period |
| Attendance working view | Until reconciled/teacher need ends | Delete after short approved audit window | Official source remains external |
| Assessment/make-up | Until graded/closed | Keep through current year for teacher follow-up | Year-end deletion/aggregation |
| Remediation | Until outcome reviewed/closed | Keep limited instructional history through current year | Closure and year-end period |
| Minor classroom records | Active pattern/follow-up | Close when resolved; limited history | Approved review period |
| Official/serious referral link | Until handover/publication confirmed | Minimise local copy/reference | School rule |
| Parent-contact action | Until completed | Retain only approved factual log/reference | Channel/retention |
| Sync/audit logs | Troubleshooting/accountability | Rotate/minimise | Candidate maximum 12 months |
| Local pending queue | Until sync/conflict resolution | Secure deletion immediately afterwards | Hours/days only |

The general school maximum after departure is not a justification to retain every KlasKompas record that long.

## 8. Rights support

KlasKompas must support the authorised school process to:

- find all records for one pupil across separate domains;
- explain sources and structured meanings;
- correct/withdraw without hiding audit history;
- export an understandable copy;
- exclude information about other pupils;
- delete/restrict according to school instruction;
- record the authorised handler of the request.

## 9. Security minimum

- MFA where supported;
- server-side secret storage;
- encryption in transit and at rest;
- strict row-level access;
- private-by-default logs;
- no real data in GitHub/tests/screenshots/analytics/error tracking;
- session timeout and quick lock;
- encrypted time-limited local queue;
- idempotency and record version/concurrency controls;
- backup/restore, deletion and revocation tests;
- incident contact/runbook.

## 10. Launch rule

Technical readiness and project-owner approval do not replace school governance. Real pupil data may be enabled only after G1-G14 are resolved or an authorised school role documents an explicit waiver/alternative.
