# KlasKompas System Scope v1.0

**Status:** Phase 1B consolidation candidate  
**Primary user:** one teacher  
**Primary purpose:** personal operational overview and follow-up

## Shared core

- school year;
- subject;
- class/group;
- pupil;
- pupil enrolment in a class/group;
- lesson session;
- teacher account;
- seat plan and class routines;
- external source identity;
- synchronisation and audit metadata.

## Module A — Today

The Today dashboard shows actionable exceptions and due work, grouped by urgency and source rather than by a calculated risk score:

- today's/next lessons;
- attendance exceptions and unresolved states;
- missed assessments awaiting teacher decision;
- make-up work to schedule, perform, grade or close;
- remediation to plan, perform or review;
- behaviour follow-up and conversations;
- parent-contact and school-follow-up tasks;
- data corrections;
- pending, failed or conflicted synchronisation.

## Module B — Attendance

Working statuses:

- `present`;
- `absent`;
- `late`;
- `partly_present`;
- `unknown`;
- `corrected` through audit history rather than as a permanent status.

Rules:

- pupils default to present when a lesson opens;
- the teacher records only deviations;
- official legal attendance remains external;
- official lateness sanctions/counts remain in Oase/school systems;
- an assessment in the lesson can link absence to a missed-assessment candidate.

## Module C — Assessments

An assessment contains at least:

- class, subject and school year;
- title and assessment type;
- planned/actual date;
- ordinary assessment versus official examination workflow;
- participating/missing pupils;
- make-up decision status;
- remediation links where manually created.

KlasKompas is not a complete points book. Marks need not be stored for the prototype unless a minimal school-approved value is later necessary. A teacher may manually indicate that a result led to remediation without importing or calculating a full gradebook.

## Module D — Make-up assessment

Suggested lifecycle:

```text
decision_required
not_required
required_unscheduled
scheduled
completed
graded
closed
exempted
official_school_process
```

Rules:

- lesson absence may create `decision_required`;
- the teacher confirms whether ordinary work must be made up;
- official exams use `official_school_process` and are not independently scheduled by KlasKompas;
- a scheduled make-up remains open until completion, grading and closure are confirmed;
- corrections and exemptions remain auditable.

## Module E — Remediation

Remediation is manually indicated by the teacher and remains instructional follow-up, not an automated diagnosis.

Suggested lifecycle:

```text
to_plan
planned
in_progress
review_due
completed
closed
cancelled
```

Minimum fields:

- pupil and subject;
- source: assessment, make-up work, lesson observation or manual;
- concise factual reason category;
- one or more instructional objectives;
- planned action/resource;
- due or review date;
- status;
- brief outcome;
- links to related assessment/follow-up where present;
- audit history.

Not included:

- automatic remediation based on score thresholds;
- diagnosis or care narrative;
- inferred motivation or risk;
- automatic communication or official support referral.

## Module F — Behaviour and classroom management

Uses the consolidated Phase 1B-D1–D6 contract:

- six universal expectations;
- L0 prevention, L1 redirect, L2 reminder;
- L3 internal classroom record with announced response;
- L4 approved immediate classroom response;
- L5 school-follow-up proposal;
- separate serious-incident route;
- pattern review based on lesson contacts;
- no automatic sanction, score or official publication.

## Module G — Follow-up actions

Source types include:

```text
attendance
assessment
make_up
remediation
behaviour
parent_contact
school_follow_up
manual
data_correction
sync_problem
```

Suggested states:

```text
open
planned
in_progress
waiting
completed
cancelled
```

Every action has:

- source reference;
- owner;
- short title;
- due/review date where relevant;
- status;
- completion/outcome note where needed;
- audit history.

## Module H — Pupil overview

Separate sections:

1. open actions;
2. attendance;
3. assessments and make-up work;
4. remediation;
5. classroom records and direct responses;
6. conversations and repair;
7. parent contact;
8. school follow-up and official references;
9. history/audit.

No combined score, colour identity or permanent label.

## Module I — History and audit

For meaningful mutations:

- prior and new state;
- timestamp;
- teacher/device/session;
- mutation ID;
- source and reason;
- server/synchronisation status;
- correction/withdrawal relation;
- external publication result where relevant.

## Module J — Device synchronisation

- laptop command centre;
- tablet classroom view;
- phone rapid-entry view;
- one canonical active lesson;
- server-mediated realtime update;
- idempotent mutations;
- explicit record versions/concurrency control;
- encrypted local pending queue where approved;
- visible `synced`, `local_pending`, `retrying`, `failed`, `conflict`, `offline` states;
- revocable device sessions.

## Module K — Smartschool integration

### Roster

Official OneRoster 1.1 after school approval.

### Identity

Official OAuth2 where approved.

### Official record publication

Conditionally blocked until:

- official endpoint or approved manual route;
- school authority and rights;
- field and visibility mapping;
- final preview and explicit confirmation;
- idempotency, audit and correction/withdrawal behaviour.

## Boundary with official systems

KlasKompas stores the teacher's working overview. Official attendance, official examinations, formal sanctions, official support/care records and official Smartschool/LVS entries remain governed by the school-designated system and authorised roles.

## Outside v1 prototype

- full gradebook;
- report calculations;
- automatic score-based remediation;
- automatic sanctions or behaviour risk scoring;
- pupil/parent/colleague accounts;
- full communication platform;
- medical or CLB dossier;
- unofficial Smartschool automation.
