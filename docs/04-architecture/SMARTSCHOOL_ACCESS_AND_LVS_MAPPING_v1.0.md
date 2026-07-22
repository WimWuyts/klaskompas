# Smartschool Access and LVS Mapping v1.0

**Status:** Phase 1B consolidated; official write access remains externally blocked  
**Purpose:** define where KlasKompas may reduce duplicate work without pretending to replace official school systems

## 1. Official-system role

Smartschool remains the official platform for school communication, roster-related context and any school-designated official pupil-follow-up record. KlasKompas remains the teacher's private operational overview.

## 2. Integration modes

| Mode | Purpose | Status |
|---|---|---|
| `roster_only` | Read classes, pupils, teachers and enrolments through official OneRoster 1.1 | Target after school client/credentials |
| `roster_plus_login` | Add official Smartschool OAuth teacher identity | Optional after approved client/scopes |
| `draft_preview` | Prepare a factual Dutch preview for approved manual entry | Allowed fallback after school approval |
| `manual_external_confirmation` | Record that the teacher manually entered an item in the official system, with time/reference where available | Candidate fallback |
| `official_lvs_write` | Publish a confirmed official record through an official endpoint | Blocked pending Smartschool/school confirmation |
| `official_message` | Send approved parent/pupil communication after preview | Outside first prototype unless requested/approved |

## 3. Roster mapping

- local UUID remains primary;
- OneRoster `sourcedId` stored as external key;
- class, pupil, teacher, enrolment and academic-session identities preserve source/year context;
- matching is never based only on a display name;
- sync is idempotent, auditable and correctable.

## 4. Domain publication boundary

| KlasKompas domain record | Default external state | Possible official destination | Requirement |
|---|---|---|---|
| Attendance working deviation | `local_only` | Official attendance view only if supported/authorised | Official endpoint and authority |
| Missed ordinary assessment/make-up | `local_only` | Usually no LVS destination; possible planner/task workflow | School decision |
| Official exam tracking | `external_reference_only` | Oase/official school process | Import/manual confirmation only |
| Manual remediation | `local_only` | Possible factual follow-up line only if school explicitly wants it | Separate school decision, visibility and rights |
| L1/L2 correction | not stored/never publish | None | Never publish |
| L3 internal classroom record | `local_only` | No automatic destination | Separate school-follow-up decision required |
| L4 classroom response | `local_only` | No automatic destination | Separate school-follow-up decision required |
| D1 pattern conversation | `local_only` | Possible shared follow-up line | Preview + authorised scope |
| Parent-contact action | local lifecycle | Smartschool message/contact record | Recipient check + explicit send confirmation |
| School-follow-up proposal | `local_only` | None as a decided measure | Wait for authorised decision |
| Confirmed official school record | linked local status | School-designated note/LVS/order-measure field | Authorised process |
| Serious incident handover | minimal local reference | Restricted official dossier/process | School-owned restricted mapping |
| Medical/care narrative | prohibited | Existing restricted school system only | Outside KlasKompas v1 |

## 5. Internal versus official object

A KlasKompas internal record is never the same object as an official school record.

```text
internal source record(s)
→ school-follow-up request
→ authorised decision
→ official school record
→ optional Smartschool publication
```

The internal source remains preserved. External publication stores its own type, visibility, authorised role, preview, idempotency key, response, external ID and correction/withdrawal history.

## 6. Candidate official publication object

```ts
interface OfficialStudentFollowUpPublicationRequest {
  localOfficialRecordId: string;
  sourceInternalRecordIds: string[];
  externalStudentId: string;
  occurredAt: string;
  sourceClassId?: string;
  officialRecordType: string;
  title: string;
  factualDescription: string;
  teacherOrSchoolAction?: string;
  visibilityProfile: string;
  authorisedByRole: string;
  idempotencyKey: string;
}
```

The official school mapping must determine:

- class note, agenda note, dossier line, message or separate order-measure structure;
- category/line type and required fields;
- visibility to pupil, parents, subject teacher, class teacher, class council, support and leadership;
- notifications;
- edit/withdrawal rules;
- which role may confirm and publish.

## 7. Publication states

```text
not_available
local_only
preview_ready
awaiting_confirmation
publishing
published
failed
corrected
withdrawn
```

These remain separate from classroom-record, make-up, remediation, parent-contact and school-follow-up states.

## 8. No-copy objective and fallback

The long-term objective is one official publication after a final preview. Until a confirmed write route exists:

- KlasKompas keeps the local working/official link;
- may produce a structured preview/export after approval;
- may record manual external-entry confirmation;
- clearly shows `not published to Smartschool` or equivalent;
- never scrapes, simulates clicks, reuses cookies or stores a personal Smartschool password.

## 9. Acceptance criteria for official write

- official documentation and permitted endpoint/scope;
- written school approval;
- fictitious-pupil test environment;
- stable external identifiers;
- field and visibility mapping;
- server-side authorisation using actual rights;
- final Dutch preview and explicit confirmation;
- idempotency and duplicate prevention;
- correction/withdrawal route;
- request/response/external-ID audit;
- retry without duplicate records;
- privacy/security review.

## 10. Open external questions

1. Is OneRoster enabled, and which class source should be used?
2. Is OAuth desirable and which scopes/redirect URIs are allowed?
3. Which module contains ordinary class/behaviour notes?
4. Which official record types may a subject teacher create?
5. Which fields, visibility and notifications apply?
6. Is there an official write endpoint, partner scope or approved custom integration?
7. How are corrections/withdrawals handled?
8. Does the school want any remediation follow-up shared officially, or only kept as the teacher's working overview?
