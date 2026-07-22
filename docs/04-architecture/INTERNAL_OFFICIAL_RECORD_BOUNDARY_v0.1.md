# Internal and Official Record Boundary v0.1

**Status:** architecture contract derived from approved Decision 1B-D5  
**Data:** fictional only until the governance gate is approved

## Purpose

Prevent a private teacher working record from being confused with, silently converted into or automatically published as an official school warning, order measure, parent communication or Smartschool/LVS record.

## Aggregate separation

The domain must model at least these separate aggregates:

```text
ClassroomBehaviourRecord
ClassroomResponse
SchoolFollowUpRequest
OfficialSchoolRecord
ParentContactAction
ExternalPublication
```

They may be linked, but they are not interchangeable.

## ClassroomBehaviourRecord

Represents the approved L3 **internal classroom record with announced response**.

Required properties include:

- stable local UUID;
- teacher and source device/session;
- pupil, class and lesson-session references;
- occurred-at and recorded-at times;
- expectation and observable category;
- factual description where required;
- announced response reference;
- record version;
- correction/withdrawal history;
- default visibility `teacher_private_working_record`.

It must not contain an `official_warning=true` shortcut.

## ClassroomResponse

Represents the L4 outcome linked to one internal L3 record.

Allowed operational states:

```text
announced
completed
refused
adapted
withdrawn
```

A refusal may create a school-follow-up draft, but it may not create a confirmed official measure automatically.

## SchoolFollowUpRequest

Represents the teacher's proposal to enter the authorised school route.

Minimum states:

```text
draft
requested
confirmed
declined
completed
cancelled
```

The request records source internal records and the intended destination role. The proposal and later decision remain separate.

## OfficialSchoolRecord

Represents a confirmed official warning, note, measure or support record owned by the authorised school process.

It must include:

- official type;
- deciding/confirming role;
- decision time;
- linked source records;
- school visibility profile;
- notification requirements;
- status and audit history;
- external reference where one exists.

An official record may exist without Smartschool publication when the school procedure uses another route.

## ParentContactAction

Parent contact has its own lifecycle and is not implied by L3, L4 or an official record.

Suggested states:

```text
planned
drafted
sent
completed
cancelled
failed
```

Recipient checks, factual Dutch-first preview and privacy safeguards are required.

## ExternalPublication

Tracks a publication attempt to Smartschool or another approved official system.

Suggested states:

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

Required fields include idempotency key, destination, mapped field profile, visibility profile, request/response metadata, external record ID and retry history.

## Invariants

1. Creating or confirming an internal L3 record never creates an official record.
2. Completing or refusing L4 never confirms an official measure.
3. Reaching a pattern threshold creates only a review obligation.
4. An official school record requires an authorised confirmation event.
5. Publication requires a final preview and explicit confirmation.
6. KlasKompas cross-device sync does not alter official-publication state.
7. Internal source records remain after official follow-up is linked.
8. Withdrawal/correction is append-only audit behaviour, not silent deletion.
9. Parent contact is never inferred solely from a behaviour count.
10. Official and external identifiers never replace local primary keys.

## UI terminology

Use:

- `Interne klasregistratie` for the compact L3 action;
- `Aangekondigde klasreactie` and `Directe klasreactie` for L4;
- `Schoolopvolging voorbereiden` for the L5 proposal;
- `Officiële schoolregistratie` only after authorised confirmation;
- `Niet gepubliceerd naar Smartschool` when the external state is local or unavailable.

Do not use `formele waarschuwing` or `officiële waarschuwing` for an internal L3 record.

## API and event guidance

Candidate event names:

```text
classroom_record.confirmed
classroom_record.corrected
classroom_record.withdrawn
classroom_response.announced
classroom_response.completed
classroom_response.refused
school_follow_up.requested
official_school_record.confirmed
parent_contact.sent
external_publication.published
external_publication.failed
```

Each event must carry an idempotency/mutation identifier and be compatible with the approved cross-device realtime contract.

## Testing requirements

- L3 confirmation creates no official record or publication.
- L4 refusal creates no automatic sanction.
- D1 threshold creates only a follow-up task.
- An authorised official record can link multiple internal sources without changing them.
- Parent contact can exist independently of an official warning.
- Publication failure leaves the official/local records intact and visibly failed.
- Duplicate publication retries do not create duplicate external records.
- Correction and withdrawal propagate across devices with audit history.
- Legacy `documented classroom warning` fixtures fail migration validation until renamed or explicitly mapped as legacy terminology.

## Related documents

- `../00-project/DECISION_1B_D5_INTERNAL_OFFICIAL_RECORD_BOUNDARY_v1.0.md`
- `CLASSROOM_QUICK_INTERACTION_SPEC_v0.1.md`
- `CROSS_DEVICE_REALTIME_SYNC_SPEC_v0.1.md`
- `SMARTSCHOOL_ACCESS_AND_LVS_MAPPING_v0.1.md`
