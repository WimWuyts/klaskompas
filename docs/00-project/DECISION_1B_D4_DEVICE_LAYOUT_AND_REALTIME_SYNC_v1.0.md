# Decision 1B-D4 — Device layouts and cross-device realtime synchronisation v1.0

**Status:** approved by project owner  
**Approval date:** 22 July 2026  
**Scope:** dedicated laptop, tablet and phone experiences plus immediate integration of teacher changes across connected devices

## 1. Product decision

KlasKompas does not treat a laptop as a wider tablet. Version 1 has three purpose-built responsive experiences:

- **laptop:** teacher command centre;
- **tablet:** touch-first mobile classroom view;
- **phone:** rapid list/search and quick-action view.

All three experiences operate on the same teacher account, active lesson session and server-authoritative data. A confirmed change entered on one connected device must appear automatically on the teacher's other connected devices.

## 2. Laptop layout

On an ordinary school laptop, the default classroom workspace contains three simultaneous zones:

```text
lesson/context panel
+ central seat plan or class grid
+ fixed pupil/action panel
```

The laptop experience includes:

- class, subject, lesson phase, time and synchronisation state;
- attendance summary and pinned class routines;
- a central seat plan as the largest area when configured;
- alphabetical class-grid fallback;
- a fixed right-side pupil/action panel after pupil selection;
- a compact unresolved-actions bar when required;
- keyboard navigation, search, undo/correction and quick privacy lock.

Wide laptops show all three zones. Compact laptops may collapse the context panel, but the seat plan and action panel remain directly usable without horizontal scrolling. Smaller widths transition to tablet mode.

## 3. Tablet layout

The tablet experience is touch-first:

- seat plan or class grid is nearly full screen;
- pupil actions open in a large slide-over drawer;
- controls use large touch targets;
- lesson context and unresolved actions use compact bars or drawers;
- no permanent three-column requirement.

## 4. Phone layout

The phone experience is optimised for movement and rapid entry:

- alphabetical list or compact name grid is the default;
- search by pupil name;
- attendance and quick lesson actions;
- documented warning, direct response and follow-up creation;
- simplified seat-plan view as an optional secondary view;
- open-actions and synchronisation status.

The phone does not attempt to reproduce the complete laptop command centre.

## 5. Seat-plan rules

- Laptop and tablet use the seat plan by default when one is configured.
- The alphabetical class grid remains permanently available.
- Version 1 exposes one active seat plan per class while keeping the data model extensible for multiple rooms later.
- A behaviour-related seat change is temporary for the current lesson by default.
- Saving a temporary move as the new permanent seat requires a separate explicit action.
- Seat-plan edit mode is separate from ordinary lesson registration so pupils cannot be moved accidentally.

## 6. Cross-device realtime requirement

Under normal connectivity:

- a locally confirmed change is shown immediately on the initiating device;
- after server acceptance, the change should appear on the teacher's other connected devices within a product target of **two seconds**;
- no manual refresh is required;
- opening the same class on another device joins the existing active lesson instead of silently creating a duplicate lesson session.

The synchronised product state includes at least:

- attendance working status;
- active lesson and lesson phase;
- behaviour L3/L4 records and announced responses;
- direct-response completion/refusal/adaptation;
- temporary seat changes;
- follow-up tasks and their statuses;
- make-up assessment statuses;
- open-action indicators;
- corrections, withdrawals and audit events;
- pending, failed and conflict synchronisation states.

Purely local interface state does not have to synchronise. Examples are the currently open drawer, scroll position or highlighted button.

## 7. Safe synchronisation model

- The backend is the canonical source after a mutation is accepted.
- Each mutation has a client-generated unique mutation ID and originating device ID.
- Repeating the same mutation may not create duplicate behaviour events, follow-up tasks or audit records.
- Editable records use explicit versions or equivalent concurrency control.
- Conflicting edits are never silently overwritten.
- Corrections and withdrawals remain audit events; they do not erase history invisibly.
- Realtime delivery is server-mediated, not direct device-to-device synchronisation.

## 8. Connectivity loss

KlasKompas remains consistent with the Phase 1A connectivity rule:

- the initiating device shows whether a change is `local_pending`, `synced`, `failed` or `conflict`;
- pending mutations are held in an encrypted local queue where school governance permits this;
- when connectivity returns, mutations are replayed idempotently;
- other devices receive the accepted result only after the server confirms it;
- a device must never present a pending local change as safely synchronised;
- conflicting offline edits require visible resolution rather than silent last-write-wins behaviour.

## 9. Conflict rules

- Independent additions, such as two different factual events, are both retained.
- Duplicate retries with the same mutation ID collapse into one accepted event.
- Two edits to different fields may merge when validation proves they do not overlap.
- Two incompatible edits to the same field create a visible conflict task.
- A correction or withdrawal cannot silently disappear because an older offline edit reconnects later.
- The teacher sees which device and time produced each competing version, without exposing unnecessary technical detail.

## 10. Privacy and security

- All connected devices belong to the same authenticated teacher account in version 1.
- Device sessions can be reviewed and revoked.
- Local pending data are minimised and encrypted where stored.
- No pupil names or behaviour details appear in operating-system push notifications.
- Projecting or screen-sharing the laptop can activate one-step privacy mode, hiding names, attendance, follow-up indicators, selection and action panels.
- Synchronisation logs contain operational metadata and identifiers, not duplicated free-text pupil narratives unless technically necessary and approved.

## 11. Acceptance criteria

With fictional data, the later implementation must prove that:

1. a phone attendance change appears automatically on laptop and tablet;
2. a laptop L3 warning appears on phone and tablet without refresh;
3. a tablet temporary seat move appears in the laptop seat plan;
4. an offline phone action visibly remains pending and synchronises after reconnection;
5. replaying a queued mutation does not create duplicates;
6. concurrent incompatible edits produce a visible conflict rather than silent data loss;
7. correction or withdrawal propagates to every connected device with audit history;
8. opening the same class on a second device joins the active lesson session;
9. privacy mode hides pupil-identifying operational information immediately.

## 12. Technology boundary

This decision fixes product behaviour, not the final technology. The chosen stack must provide:

- authenticated realtime subscriptions or equivalent server push;
- idempotent mutation handling;
- record versioning/concurrency control;
- encrypted local pending queue support;
- audit logging;
- revocable device sessions.

A stack that cannot satisfy these requirements is not eligible for the production architecture.

## Related documents

- `SCOPE_LOCK_PHASE_1A_v1.0.md`
- `DECISION_1B_D3_DIRECT_CLASSROOM_RESPONSES_v1.0.md`
- `../04-architecture/CLASSROOM_QUICK_INTERACTION_SPEC_v0.1.md`
- `../04-architecture/CROSS_DEVICE_REALTIME_SYNC_SPEC_v0.1.md`
- `OPEN_DECISIONS_REGISTER.md`
