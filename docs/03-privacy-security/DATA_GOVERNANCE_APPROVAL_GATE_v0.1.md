# Data Governance Approval Gate v0.1

**Status:** first extraction from the 2025-2026 school regulations; school approval still required  
**Purpose:** prevent real pupil data from entering KlasKompas before responsibility, hosting, access, retention and incident procedures are formally agreed.

## 1. Confirmed from the school regulations

The regulations establish that:

- the school board is responsible for processing pupil personal data;
- pupil data are currently processed in Wis@d and Smartschool;
- access must be restricted to people involved in administration or guidance;
- pupils and parents have rights of access, explanation, correction, deletion and a digital copy, subject to the rights of others;
- the school generally keeps data no longer than one year after the pupil leaves, except where a longer legal retention period applies;
- health data are exceptional and require a specific lawful/consent basis;
- support-dossier access is narrower than ordinary teacher access;
- privacy questions can be directed through the school's privacy contact.

## 2. Current product gate

Until the school approves KlasKompas as a school application:

```text
real pupil data = prohibited
Smartschool roster sync = test/fictitious only
LVS publication = disabled
production hosting = not selected
local device queue = fictitious data only
```

## 3. Required approvals before real data

| Gate | Required decision/evidence | Owner | Current status |
|---|---|---|---|
| G1 — School purpose | Written confirmation that KlasKompas may be used for classroom operations and pupil follow-up | School board/director | Open |
| G2 — Processing roles | Determine controller, processor(s), sub-processors and teacher's role | School/privacy lead | Open |
| G3 — Data inventory | Approve exact fields, purposes and lawful basis per module | School/privacy lead | Open |
| G4 — Hosting | Approve provider, EU/EEA location, backups and support access | School/ICT/privacy | Open |
| G5 — Contracts | Processor agreement and sub-processor terms where required | School board | Open |
| G6 — Risk assessment | Decide whether a DPIA or equivalent documented assessment is required | Privacy lead/DPO | Open |
| G7 — Access model | Approve single-teacher access, account recovery and future multi-user isolation | School/ICT | Open |
| G8 — Smartschool | Approve OneRoster/OAuth client, scopes, credentials and logging | Smartschool administrator | Open |
| G9 — Retention | Approve active-year, post-year and post-departure retention per data type | School/privacy | Open |
| G10 — Rights handling | Define access, correction, export, objection and deletion process | School/privacy | Open |
| G11 — Incidents | Define breach reporting, emergency access and notification contacts | School/ICT/privacy | Open |
| G12 — Device storage | Approve encrypted temporary queue on laptop/tablet/phone and timeout | School/ICT/privacy | Open |
| G13 — LVS write | Official API, field mapping, rights and confirmation process | Smartschool/school | Blocked externally |
| G14 — Launch approval | Signed go/no-go decision after test with fictitious data | Project owner + school | Open |

## 4. Preliminary data minimisation

### Allowed candidate data in production after approval

- internal KlasKompas UUID;
- Smartschool/OneRoster external identifier;
- pupil display name;
- class/subject membership;
- lesson session;
- working attendance status needed for the teacher's lesson;
- assessment and make-up status;
- structured observable behaviour category;
- short factual description only when necessary;
- teacher classroom response;
- follow-up status and deadline;
- audit metadata;
- Smartschool sync/publication status and external record ID.

### Excluded from v1

- diagnosis or medical history;
- medication details;
- religion or ethnicity profile;
- CLB/support-dossier narrative;
- family circumstances unless a school-approved minimal operational instruction is strictly necessary;
- photographs, audio or video evidence;
- biometric data;
- emotional or attention detection;
- inferred motivation, character or risk score;
- free-text copies of sensitive Smartschool dossiers.

## 5. Access rule

The version-1 user may view only pupils in classes assigned to that teacher. The system is designed around one teacher but must still store `teacher_id` and enforce tenant/row isolation so later multi-user expansion does not expose records across teachers.

A future school role may access official escalation records only after an explicit role and purpose are approved.

## 6. Retention proposal for school decision

This is a proposal, not a final legal decision.

| Data type | Active use proposal | Closure proposal | Maximum without renewed justification |
|---|---|---|---|
| Roster cache | Current school year | Replace/archive after official rollover | Until end of next academic year or earlier when no longer needed |
| Lesson attendance working copy | Current school year | Delete after reconciliation plus short audit period | To be decided; official source remains Smartschool/Wis@d |
| Make-up assessment workflow | Until assessment and correction are closed | Keep through current academic year for teacher follow-up | Delete/aggregate after school-year close unless official need |
| Minor behaviour record | Active pattern and follow-up | Close when resolved; retain limited history for consistency | Candidate: end of academic year plus approved short review period |
| Serious/order-measure referral | Follow official school record and access rules | Local copy should be minimised after successful publication/handover | School decision required |
| Sync/audit log | Operational troubleshooting and accountability | Rotate and minimise content | Candidate 12 months, subject to school approval |
| Local offline queue | Until successful sync or manual resolution | Immediate secure deletion after sync | Hours/days, never long-term |

The school regulation's general maximum of one year after leaving school is an outer school rule, not a reason for KlasKompas to retain every record that long.

## 7. Pupil/parent rights support

KlasKompas must be able to:

- search all records for one pupil;
- explain the source and meaning of structured fields;
- correct factual errors without hiding the prior audit event;
- export an understandable copy when authorised;
- delete or restrict records according to school instruction;
- exclude information about other pupils from an access response;
- record which authorised person handled the request.

The application itself does not answer requests directly; it supports the school procedure.

## 8. Security minimum before real data

- multi-factor authentication where supported;
- server-side secret storage;
- encrypted transport and storage;
- strict row-level access controls;
- audit of meaningful reads/writes where proportionate;
- no real data in GitHub, tests, screenshots, analytics or error tracking;
- private-by-default logs;
- explicit session timeout and quick lock;
- encrypted and time-limited local queue;
- backup restore test;
- deletion and account-revocation test;
- incident contact and runbook.

## 9. School questions still open

1. Who is the operational privacy contact/DPO for approval?
2. May a teacher use a privately developed external application for these purposes?
3. Which hosting providers/regions are allowed?
4. Is an individual teacher considered an authorised school user under the school's processing responsibility, or is separate approval/contracting required?
5. Which behaviour records belong only in KlasKompas temporarily and which must enter Smartschool/LVS?
6. Which roles may view a subject teacher's behaviour records?
7. What is the formal retention schedule for classroom notes, order measures and Smartschool LVS lines?
8. May temporary encrypted data be stored on a personal or school-managed device?
9. Which analytics, monitoring and backup providers are acceptable?

## 10. Launch rule

No technical readiness, convenience or user approval can replace this governance gate. Real pupil data may be enabled only after G1-G14 are resolved or explicitly waived by the authorised school role with a documented reason.