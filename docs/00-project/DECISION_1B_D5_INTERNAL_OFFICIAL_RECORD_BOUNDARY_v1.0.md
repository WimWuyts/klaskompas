# Decision 1B-D5 — Internal versus official record boundary v1.0

**Status:** approved by project owner  
**Approval date:** 22 July 2026  
**Scope:** distinction between KlasKompas lesson records, parent contact, official school warnings and Smartschool/LVS publication

## 1. Approved terminology

L3 is named:

> **internal classroom record with announced response**

The former draft term `documented classroom warning` is deprecated. In older Phase 1B draft documents it must be interpreted as the approved L3 internal classroom record, not as an official school warning or order measure.

The Dutch pupil-facing teacher sentence uses factual wording such as:

> “Dit gedrag is na de herinnering blijven doorgaan. Ik noteer dit voor mijn lesopvolging. Als dit opnieuw gebeurt, [aangekondigde klasreactie].”

The interface may use the compact label `Interne klasregistratie` where space is limited.

## 2. Internal KlasKompas record

An L3 internal classroom record stores only the teacher's own lesson-follow-up facts:

- pupil, class and lesson session;
- date and time;
- observable behaviour category;
- applicable expectation;
- required correction;
- announced L4 classroom response;
- teacher/source;
- later L4 outcome, correction, withdrawal and audit history.

Its default visibility and publication state are:

```text
visibility = teacher_private_working_record
school_record_status = none
smartschool_publication_status = local_only
parent_visibility = false
pupil_visibility = false
```

It may be used for the approved D1 pattern logic. It is not an official school warning, agenda note, Smartschool class note, LVS dossier line or imposed order measure.

## 3. L4 remains linked and internal by default

An L4 classroom response is linked to the originating L3 record and stores whether the announced response was:

- `completed`;
- `refused`;
- `adapted`;
- `withdrawn`.

Seat changes, individual work positions, phone-pouch use, paper alternatives and routine-repair actions remain local classroom-management records by default.

## 4. Official school record is separate

An internal record is never silently promoted, renamed or converted into an official school record.

The official route creates a separate linked object:

```text
one or more internal source records
→ school-follow-up proposal
→ authorised school workflow
→ confirmed official decision
→ optional official Smartschool/LVS publication
```

The official record must store separately:

- official record or measure type;
- source internal record identifiers;
- proposing teacher;
- authorised deciding or confirming role;
- decision and decision time;
- destination system/module;
- field/category mapping;
- visibility profile;
- parent/pupil notification status;
- external Smartschool identifier where available;
- publication, failure, correction and withdrawal history.

The original internal record remains auditably preserved.

## 5. School-gate triggers

KlasKompas may offer `Prepare school follow-up` when:

- L4 does not restore workable learning conditions;
- the pupil refuses the announced L4 response;
- the D1 pattern review indicates that school consultation may be appropriate;
- the teacher consciously selects school consultation because of context or severity;
- the separate serious-incident route is active.

A count never creates an official warning automatically.

## 6. Parent contact is separate

Parent contact is neither an internal L3 record nor automatically an official warning.

A pupil case may contain independently linked objects such as:

```text
internal classroom record
+ parent-contact action
+ official school warning
```

Any of these may exist without the others. Parent communication must remain factual, Dutch-first and must not disclose information about other pupils.

## 7. Smartschool/LVS publication boundary

Cross-device synchronisation inside KlasKompas is not Smartschool publication.

An internal record can be fully synchronised across the teacher's phone, tablet and laptop while its external publication state remains `local_only` or `not_available`.

Official publication requires all of the following:

1. school-approved record destination and field mapping;
2. confirmation that the user has the required school rights;
3. correct visibility and recipient profile;
4. final Dutch preview;
5. explicit confirmation;
6. official write endpoint or approved manual-registration fallback;
7. idempotency and duplicate prevention;
8. external result, identifier and audit logging;
9. defined correction or withdrawal route.

Until an official Smartschool write route exists, KlasKompas may prepare a structured preview and record a manually confirmed external-entry status, but it may not simulate browser actions or claim that a local record was published.

## 8. Required state separation

The implementation must keep these dimensions separate:

- `classroom_record_state` — draft, confirmed, corrected, withdrawn;
- `classroom_response_state` — announced, completed, refused, adapted, withdrawn;
- `school_follow_up_state` — none, draft, requested, confirmed, declined, completed;
- `official_record_state` — none, proposed, confirmed, corrected, withdrawn;
- `smartschool_publication_state` — not_available, local_only, preview_ready, awaiting_confirmation, published, failed, corrected, withdrawn;
- `parent_contact_state` — none, planned, drafted, sent, completed, cancelled.

No state in one dimension automatically implies a state in another.

## 9. Non-negotiable safeguards

- No automatic promotion from internal to official.
- No official terminology on an unconfirmed local record.
- No parent/pupil visibility by default for internal records.
- No automatic Smartschool/LVS publication.
- No official measure marked as imposed before authorised confirmation.
- No deletion of the internal source record when an official record is created.
- No merged behaviour score or automatic sanction.
- Corrections and withdrawals remain audit events.

## 10. Implementation and migration consequence

All product text, schemas, fixtures and tests must use the approved L3 name. Existing Phase 1B draft references to `documented classroom warning` are a terminology overlay only and must be migrated before implementation is considered complete.

## Related documents

- `DECISION_1B_D1_BEHAVIOUR_PATTERN_RULE_v1.0.md`
- `DECISION_1B_D3_DIRECT_CLASSROOM_RESPONSES_v1.0.md`
- `DECISION_1B_D4_DEVICE_LAYOUT_AND_REALTIME_SYNC_v1.0.md`
- `../01-behaviour-framework/TEACHER_RESPONSE_LADDER_v0.2.md`
- `../01-behaviour-framework/TEACHER_AUTHORITY_MATRIX_v0.1.md`
- `../04-architecture/INTERNAL_OFFICIAL_RECORD_BOUNDARY_v0.1.md`
- `../04-architecture/SMARTSCHOOL_ACCESS_AND_LVS_MAPPING_v0.1.md`
- `OPEN_DECISIONS_REGISTER.md`
