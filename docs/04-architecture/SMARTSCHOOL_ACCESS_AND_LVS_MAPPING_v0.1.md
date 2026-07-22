# Smartschool Access and LVS Mapping v0.1

**Status:** first organisational mapping; technical write access remains unconfirmed  
**Sources:** 2025-2026 school regulations and the Smartschool integration boundary

## 1. What the school regulations confirm

Smartschool is an official school platform for:

- daily information to pupils and parents;
- communication and appointment requests;
- planner and deadlines;
- results through Skore;
- processing pupil personal data;
- teacher/director comments and facts that must be brought to parents' attention through the communication section of the school planner.

The regulations do not specify a public API for adding behaviour records to Smartschool's pupil-tracking system.

## 2. Desired integration modes

| Mode | Purpose | September readiness |
|---|---|---|
| `roster_only` | Read classes, pupils, teachers and memberships through official OneRoster | Target, subject to school client/credentials |
| `roster_plus_login` | Add official Smartschool OAuth teacher identity | Target if client/scopes are approved |
| `draft_preview` | Prepare a factual, field-mapped preview for manual school entry | Possible fallback, but does not meet the final no-copy goal |
| `official_lvs_write` | Write a confirmed note/dossier line through an official endpoint | Blocked until Smartschool/school confirmation |
| `official_message` | Send a parent/pupil message through an approved API after explicit preview | Out of September MVP unless school requests it |

## 3. Candidate data mapping

### 3.1 Roster

| KlasKompas field | Smartschool/OneRoster source | Rule |
|---|---|---|
| `student.external_source_id` | OneRoster `user.sourcedId` | External key only, never local primary key |
| `student.display_name` | OneRoster user name fields | Smartschool is authoritative |
| `class.external_source_id` | OneRoster `class.sourcedId` | External key only |
| `class.title/code` | OneRoster class/course fields | Preserve source and school-year context |
| `enrolment.external_source_id` | OneRoster enrolment `sourcedId` | Use for idempotent sync |
| `teacher.external_source_id` | OneRoster/OAuth identity | Match by stable identifier, not name |
| `academic_session` | OneRoster term/year | Required for year rollover |

### 3.2 Behaviour/LVS candidate publication

The exact Smartschool fields are not yet known. KlasKompas should prepare a neutral publication object:

```ts
interface StudentFollowUpPublicationRequest {
  localEventId: string;
  externalStudentId: string;
  occurredAt: string;
  sourceClassId: string;
  categoryCode: string;
  title: string;
  factualDescription: string;
  teacherAction: string;
  followUpStatus?: string;
  visibilityProfile: string;
  idempotencyKey: string;
}
```

The school/Smartschool mapping must decide:

- klasnotitie versus dossierlijn;
- category/line type;
- title and required text format;
- mandatory dropdowns or custom fields;
- visibility to pupil, parents, class council, student support and leadership;
- whether a teacher may edit/withdraw a record;
- external UUID/idempotency support;
- who is notified automatically;
- whether an official order measure is a separate record.

## 4. Publication boundary by record type

| KlasKompas record | Local by default | Candidate Smartschool destination | Publication requirement |
|---|---:|---|---|
| L1/L2 correction | Yes; normally not stored | None | Never publish |
| L3 documented classroom warning | Yes | Possibly no destination or teacher-only class note | School decision + explicit confirmation |
| L4 classroom response | Yes | Possibly combined with relevant class note | School decision + explicit confirmation |
| P1/P2 pattern review | Yes | Student follow-up line if school wants shared follow-up | Preview + authorised scope |
| Parent contact | Local task/status | Smartschool message/contact record | Explicit preview and recipient check |
| Proposed order measure | Yes as proposal | No publication as decided measure | Wait for official confirmation |
| Confirmed order measure | Local status + external reference | Official school field/record | Authorised role/process only |
| Serious incident referral | Minimal local handover | Appropriate restricted school dossier | Restricted mapping and school-owned outcome |
| Medical/support narrative | No | Existing restricted school systems only | Outside KlasKompas v1 |

## 5. Visibility profiles

KlasKompas must not assume that every record is visible to parents or all teachers. Candidate profiles to map to the school's configuration:

- `teacher_private_working_record`;
- `subject_teacher_and_class_teacher`;
- `student_support_restricted`;
- `school_leadership_restricted`;
- `parent_visible_after_confirmation`;
- `pupil_visible_after_confirmation`.

These are local labels until the actual Smartschool field permissions are obtained.

## 6. Roles/contact points from school policy

The technical and organisational intake should identify people by function, not hard-code names in application logic:

- Smartschool administrator;
- director/delegate;
- deputy director;
- behaviour coach;
- second-grade student counsellor;
- privacy/ICT contact;
- school board/controller representative;
- Oase/secretariat process owner.

## 7. Required school questions

1. Which Smartschool module currently holds ordinary behaviour/classroom notes?
2. Are subject teachers allowed to create records directly there?
3. Which records are visible to parents and pupils?
4. Is there a separate structure for order measures, sanctions and student support?
5. Which fields and categories are mandatory?
6. Can records be corrected, withdrawn or superseded?
7. Who receives notifications?
8. Is an official API/partner scope available for writing?
9. Is OneRoster enabled and which source is appropriate: Skore teaching assignments, course memberships or selected groups/classes?
10. Is OAuth login desirable or should KlasKompas use a separate school-approved account?
11. Is a test Smartschool environment available?
12. Which rate limits, token lifetimes and audit requirements apply?

## 8. No-copy goal and fallback

The final product goal remains official one-step publication after a teacher preview. Until an official write route exists:

- KlasKompas will retain a local confirmed record;
- it may generate a structured preview/export if the school approves;
- it will clearly show `not published to Smartschool`;
- it will not simulate browser input, reuse cookies or store a personal Smartschool password;
- duplicate manual entry remains an acknowledged limitation, not a hidden automated workaround.

## 9. Acceptance criteria for `official_lvs_write`

- official technical documentation;
- written school approval;
- test environment with fictitious pupils;
- stable student and record identifiers;
- field and visibility mapping;
- server-side authorisation using the teacher's actual rights;
- idempotency/duplicate prevention;
- update/withdrawal behaviour;
- preview and explicit teacher confirmation;
- audit of request, response, external ID and failure;
- retry without duplicate dossier lines;
- security and privacy review.