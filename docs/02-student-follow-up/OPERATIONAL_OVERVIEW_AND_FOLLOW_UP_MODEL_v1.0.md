# Operational Overview and Follow-up Model v1.0

**Status:** Phase 1B consolidation candidate  
**Purpose:** define the personal teacher overview across attendance, missed assessments, make-up work, remediation, behaviour and other follow-up

## 1. One overview, separate domains

KlasKompas uses one Today dashboard and one pupil overview, but does not collapse different domains into a score.

The teacher sees separate, linked work items for:

- attendance;
- assessments;
- make-up work;
- remediation;
- classroom management;
- conversations and repair;
- parent contact;
- school follow-up;
- data/synchronisation problems.

## 2. Today dashboard

### Priority sections

#### Current and next lessons

- class, subject and time;
- lesson-session status;
- attendance not yet checked;
- configured seat plan/routines;
- connected-device state.

#### Attendance exceptions

- absent;
- late;
- partly present;
- unknown/unconfirmed;
- corrections requiring attention.

#### Missed assessments

- assessment occurred while pupil was absent;
- teacher decision still required;
- no make-up required/exempted;
- official-exam workflow pending external confirmation.

#### Make-up work

- required but not scheduled;
- scheduled today/upcoming;
- overdue;
- completed but not graded;
- graded but not closed.

#### Remediation

- remediation identified but not planned;
- planned action due;
- in progress;
- review due;
- completed but not closed.

#### Classroom and pupil follow-up

- conversation due;
- repair action due;
- D1 pattern review due;
- L5 school-follow-up draft/request;
- parent-contact task;
- serious handover not confirmed.

#### System attention

- local pending mutation;
- failed sync;
- conflict;
- external publication failed;
- data correction waiting.

## 3. Dashboard ordering

Ordering is based on:

1. safety/confirmed handover problems;
2. actions due or overdue today;
3. unresolved decisions blocking later work;
4. scheduled near-term actions;
5. review/closure tasks;
6. informational items.

This is task prioritisation, not pupil risk scoring.

## 4. Attendance-to-assessment flow

```text
lesson opens
→ pupils default present
→ teacher records deviations
→ assessment is linked to the lesson/date
→ absent pupil becomes missed-assessment candidate
→ teacher confirms ordinary make-up, exemption or official-exam route
```

Attendance itself never decides the legal absence status. It only supports the teacher's working view.

## 5. Ordinary assessment and make-up flow

```text
assessment created
→ pupil missing/participated confirmed
→ make-up decision
→ date or arrangement planned
→ completed
→ graded
→ closed
```

### Decision states

- `decision_required`;
- `not_required`;
- `required_unscheduled`;
- `scheduled`;
- `completed`;
- `graded`;
- `closed`;
- `exempted`;
- `official_school_process`.

The teacher can correct a wrong decision with an audit reason.

## 6. Official examination route

For examinations or other school-owned evaluation processes:

- KlasKompas displays a personal tracking status;
- the official date/decision remains owned by Oase/director/class council;
- the teacher does not create an independent official schedule;
- imported or manually confirmed official information is clearly labelled by source.

## 7. Remediation flow

```text
teacher identifies instructional need
→ source and concise reason selected
→ objective/action planned
→ action performed
→ outcome reviewed
→ closed or adapted
```

### Statuses

- `to_plan`;
- `planned`;
- `in_progress`;
- `review_due`;
- `completed`;
- `closed`;
- `cancelled`.

### Allowed sources

- ordinary assessment;
- make-up assessment;
- lesson observation;
- pupil work/task;
- manual teacher decision.

### Minimal remediation record

- pupil, class/subject and teacher;
- source and date;
- factual reason category;
- concise instructional objective;
- action/resource;
- deadline or review date;
- status;
- brief outcome;
- related assessment/action identifiers;
- audit metadata.

### Safeguards

- no automatic assignment based on a score;
- no diagnostic label;
- no medical or care narrative;
- no automatic escalation to official support;
- no permanent deficit label on the pupil tile;
- remediation can be corrected, adapted, cancelled or closed.

## 8. Behaviour follow-up flow

The D1-D6 contract applies. Behaviour follow-up appears on the same dashboard but remains a separate domain:

- L3 internal classroom record;
- L4 response outcome;
- short conversation/repair action;
- D1 pattern review;
- L5 school-follow-up where consciously required;
- external publication remains separate.

## 9. Parent contact

Parent contact is a separate follow-up action and may be linked to an assessment, remediation, behaviour or another teacher concern.

Minimum lifecycle:

- `planned`;
- `drafted`;
- `sent`;
- `completed`;
- `cancelled`;
- `failed`.

The first prototype may track the action and factual outcome without becoming a complete communication platform. Smartschool remains the preferred official channel when communication is sent.

## 10. Pupil overview

### Header

- school-approved display name;
- class and subject memberships;
- open-action count by domain, not one combined score;
- data/sync warning when relevant.

### Sections

#### Open actions

Only unresolved or due tasks, with source and deadline.

#### Attendance

Lesson-level working deviations and corrections.

#### Assessments and make-up

Assessment list, missed status and complete make-up lifecycle.

#### Remediation

Current and past instructional remediation with objectives, status and review outcome.

#### Classroom management

Internal L3 records, linked L4 actions, conversations and repair.

#### Parent/school follow-up

Separate parent contact, school-follow-up requests, official references and publication states.

#### Audit

Corrections, withdrawals and meaningful status changes.

## 11. Action model

A generic follow-up action stores:

```text
id
teacher_id
pupil_id? 
class_id?
source_type
source_id?
title
status
due_at?
review_at?
completed_at?
outcome?
created_at
updated_at
version
sync_state
```

Domain-specific records remain authoritative; the action is the dashboard work item, not a duplicate narrative dossier.

## 12. Closure rules

An item leaves the active dashboard only when:

- it is completed and no review remains;
- it is explicitly closed;
- it is cancelled with a reason where required;
- an official school process replaces it and the handover is recorded;
- a corrected source record removes the need, with audit history.

Underlying records are not silently deleted.

## 13. Prototype acceptance scenarios

With fictional data, prove that the teacher can:

1. mark a pupil absent in a lesson;
2. see that pupil appear as missing an assessment held in that lesson;
3. confirm make-up required and schedule it;
4. mark it completed, graded and closed;
5. create manual remediation from the original or make-up assessment;
6. plan an action and review date;
7. see it on Today until reviewed/closed;
8. view attendance, assessment, remediation and behaviour separately in the pupil overview;
9. correct a wrong status without erasing history;
10. see all accepted changes on laptop, tablet and phone.
