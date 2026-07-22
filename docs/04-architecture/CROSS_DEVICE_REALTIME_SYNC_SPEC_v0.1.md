# Cross-device Realtime Synchronisation Specification v0.1

**Status:** approved product requirement; implementation architecture still open  
**Primary actor:** one authenticated teacher using laptop, tablet and phone  
**Data:** fictional only until the school governance gate is approved

## 1. Purpose

A teacher may move between devices during one lesson. KlasKompas must maintain one coherent operational state so that a change made on the phone is integrated automatically into laptop and tablet views, and vice versa.

This is not multi-teacher collaboration in version 1. It is multi-device continuity for one teacher account.

## 2. Canonical topology

```text
phone / tablet / laptop
        ↓ authenticated mutation
canonical backend
        ↓ accepted realtime event
all other active teacher devices
```

Direct peer-to-peer device synchronisation is not used. The backend confirms the canonical result, assigns or validates the record version and broadcasts the accepted state.

## 3. Local interaction and server confirmation

Every data-changing action has two clearly separated moments:

1. **local acknowledgement** — the initiating interface updates immediately and labels the mutation as pending;
2. **server confirmation** — the backend accepts, rejects or reports a conflict and broadcasts the result.

The UI may use optimistic interaction for speed, but it may not falsely label a pending mutation as synchronised.

## 4. Mutation envelope

Every mutation must carry or derive at least:

```text
mutation_id
teacher_id
device_session_id
entity_type
entity_id
operation
base_version
client_created_at
server_received_at
payload
```

`mutation_id` is created before transmission and is reused for retries. The backend stores enough information to guarantee idempotent replay.

## 5. Realtime event envelope

Accepted server events contain at least:

```text
event_id
mutation_id
teacher_id
entity_type
entity_id
new_version
operation
server_committed_at
originating_device_session_id
changed_fields or canonical snapshot
```

Other devices update only after validating that the event belongs to the authenticated teacher and a newer entity version.

## 6. Entity strategies

### 6.1 Append-oriented entities

Examples:

- behaviour event;
- direct-response outcome;
- audit event;
- follow-up creation;
- factual serious-incident event.

These are retained as distinct accepted events. A repeated delivery with the same `mutation_id` does not create a second record.

### 6.2 Versioned mutable entities

Examples:

- attendance working status;
- follow-up task status;
- active lesson phase;
- make-up assessment status;
- active seat plan;
- temporary seat assignment.

These records carry a version. A mutation that is based on an obsolete version is either safely field-merged or returned as a conflict.

### 6.3 Corrections and withdrawals

Corrections and withdrawals create new audit events and a new canonical version. They do not hard-delete the historical action that was previously visible.

## 7. Active lesson coordination

For one teacher, class and lesson-time context, the backend maintains one canonical active lesson session unless the teacher explicitly starts a distinct session.

When another device opens the class:

- it detects the active session;
- it offers or automatically performs `Join active lesson` according to safe context rules;
- it receives current attendance, lesson phase, temporary seat changes, announced responses and unresolved actions;
- it does not silently create a parallel session.

Ending the lesson on one device updates all connected devices. A second device with unsent local mutations must resolve or transmit them before it can treat the lesson as cleanly closed.

## 8. Synchronised state by module

### Classroom and behaviour

- active lesson phase;
- pupil working attendance state;
- L3 warnings;
- announced L4 response;
- L4 outcome;
- pattern follow-up trigger;
- temporary seat changes;
- serious-route handover state;
- correction or withdrawal.

### Follow-up

- task creation;
- owner;
- due date;
- status;
- completion note where authorised;
- school-gate proposal and confirmed school decision as separate records.

### Assessments

- ordinary assessment absence;
- make-up requirement proposal/confirmation;
- schedule and status;
- official-school-process marker for examinations.

### Interface indicators

- open action icons;
- pending/failed/conflict indicators;
- current active lesson identity.

Selections, open drawers, filters and scroll positions remain device-local.

## 9. Target timing

Under normal network conditions:

- local pending feedback: immediate;
- server round-trip and canonical acceptance: monitored;
- propagation to another connected device: product acceptance target of no more than two seconds after server acceptance.

This is a target, not a guarantee during loss of connectivity or platform outage. The interface must always show the actual synchronisation state.

## 10. Offline queue

Where school governance permits local temporary storage:

- pending mutations are encrypted at rest;
- the queue is scoped to the authenticated teacher and device session;
- entries retain their original `mutation_id`;
- retries use controlled backoff;
- successful acceptance removes the item from the pending queue while retaining canonical audit history;
- rejected or conflicted items remain visible for teacher action;
- signing out or revoking the device clears local sensitive state according to the approved security policy.

## 11. Conflict policy

### Automatic safe handling

- duplicate mutation retry → return the original accepted result;
- distinct append events → retain both;
- non-overlapping validated field edits → merge and create a new canonical version;
- device receives an already newer canonical snapshot without local edit → replace local cache.

### Teacher resolution required

- two incompatible attendance states for the same lesson record;
- two different destinations for the same temporary seat assignment;
- status moved both forward and backward on different offline devices;
- edit versus withdrawal of the same record;
- competing active-seat-plan layout changes.

The resolution view shows:

- current server value;
- pending device value;
- time and device label;
- safe choices: keep server, use pending version, or cancel pending change;
- resulting audit entry.

No conflict is solved by invisible last-write-wins behaviour.

## 12. Presence and device sessions

The teacher may see a compact status such as:

```text
Laptop — active now
Phone — active now
Tablet — last active 4 min ago
```

The system supports:

- named device sessions;
- last-seen time;
- revocation;
- re-authentication after sensitive timeout;
- quick lock without ending the server session where policy permits.

Device presence never appears to pupils.

## 13. Security safeguards

- all transport is authenticated and encrypted;
- realtime channels are authorised server-side per teacher account;
- a client may not subscribe to another teacher's or pupil's unrestricted data stream;
- payloads are minimised to the fields needed for the current screen;
- no free-text pupil detail appears in push notification previews;
- logs redact access tokens, secrets and unnecessary pupil content;
- replay protection and mutation idempotency are tested;
- clock differences between devices never determine canonical order by themselves; server commit order and record versions are authoritative.

## 14. Failure states shown to the teacher

- `synced` — accepted by server;
- `local_pending` — stored locally but not accepted yet;
- `retrying` — automatic retry in progress;
- `failed` — rejected or unable to retry automatically;
- `conflict` — teacher resolution required;
- `offline` — device has no confirmed server connection.

A small status is visible globally and on affected records. The app does not rely on colour alone.

## 15. Test matrix

The implementation must include automated and scenario tests for:

- phone → laptop attendance propagation;
- laptop → tablet behaviour-event propagation;
- tablet → phone follow-up completion;
- joining an active lesson from a second device;
- duplicate network delivery;
- disconnect during L3 creation;
- reconnect and queue replay;
- same-field concurrent edit;
- non-overlapping field merge;
- correction after another device cached the old value;
- withdrawal versus old offline edit;
- device revocation;
- privacy lock/projected screen;
- two timetable frequencies and multiple consecutive lesson contacts.

## 16. Open implementation choices

The product decision does not yet select:

- realtime transport or provider;
- database product;
- local encrypted storage technology;
- exact cache library;
- hosting location;
- authentication provider.

Those choices are part of the later architecture decision, but each candidate stack must demonstrate compliance with this specification before selection.

## Related documents

- `../00-project/DECISION_1B_D4_DEVICE_LAYOUT_AND_REALTIME_SYNC_v1.0.md`
- `../00-project/SCOPE_LOCK_PHASE_1A_v1.0.md`
- `CLASSROOM_QUICK_INTERACTION_SPEC_v0.1.md`
- `TECH_STACK_OPTIONS_v0.1.md`
