# Classroom Quick Interaction Specification v0.1

**Status:** interface design incorporating approved Phase 1B-D3 and D4 decisions  
**Primary user:** one teacher during a busy lesson  
**Primary devices:** dedicated laptop, tablet and phone experiences  
**Data:** fictional only until the governance gate is approved

## 1. Design objective

A normal classroom action from L3 onward should require no more than:

```text
select pupil
→ select observable behaviour
→ confirm displayed response
```

The interface reduces improvisation without turning pupils into scores or public colour labels. All connected teacher devices share one canonical lesson state through the cross-device synchronisation contract.

## 2. Shared class-session header

Every device shows an appropriately compact version of:

- class and subject;
- active lesson identity and start/end time;
- current lesson phase: `start`, `instruction`, `individual`, `group`, `assessment`, `closing`;
- connection/synchronisation state;
- whether another teacher-owned device is active in the same lesson;
- serious-incident route;
- end-lesson and unresolved-actions control.

Opening the same class on a second device joins the existing active lesson session instead of silently creating a duplicate.

## 3. Laptop command-centre layout

A normal school laptop uses a dedicated teacher workspace rather than a stretched tablet layout.

### 3.1 Wide laptop

```text
┌──────────────────────────────────────────────────────────────────┐
│ Class · subject · lesson phase · time · sync · search · privacy │
├───────────────┬──────────────────────────────┬───────────────────┤
│ Lesson panel  │ Seat plan / class grid       │ Pupil/action panel│
│               │                              │                   │
│ Attendance    │ [ pupil ] [ pupil ]          │ Selected pupil    │
│ Routines      │ [ pupil ] [ pupil ]          │ Behaviour         │
│ Open actions  │ [ pupil ] [ pupil ]          │ Response preview  │
│ Device state  │                              │ Follow-up          │
├───────────────┴──────────────────────────────┴───────────────────┤
│ Unresolved actions for this lesson                               │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Left lesson/context panel

The fixed or collapsible left panel contains:

- attendance summary;
- active lesson phase;
- pinned entry, phone, help and closing routines;
- open actions carried into the lesson;
- connected-device and synchronisation status;
- serious-route button.

### 3.3 Central class area

The central area is the largest zone and shows:

- configured seat plan by default;
- alphabetical class grid as a one-click fallback;
- empty seats and designated individual work positions;
- current-lesson temporary seat changes;
- only small icons for active classroom response or open follow-up.

### 3.4 Fixed right pupil/action panel

Selecting a pupil opens the right panel without covering the entire seat plan. It contains:

- pupil display name;
- working attendance status;
- observable behaviour categories;
- applicable expectation;
- current L3/L4 step;
- approved default response and alternative;
- Dutch formal teacher sentence;
- follow-up and school-gate controls;
- local/pending/synchronised/conflict state.

### 3.5 Compact laptop

At narrower laptop widths:

- lesson/context panel may collapse;
- seat plan remains directly usable;
- pupil/action panel remains available at the right or as a narrow overlay;
- no horizontal page scrolling is required.

Below the tested laptop threshold, the app changes to tablet mode.

### 3.6 Laptop input

Minimum keyboard and pointer support:

- single click: select pupil;
- double click: open full private pupil overview;
- safe context menu: attendance, warning, direct response, follow-up, overview;
- `/`: pupil search;
- `Esc`: close current panel;
- arrow keys: navigate pupil tiles;
- `Enter`: confirm the currently focused safe action;
- `Ctrl+Z`: correct/withdraw the last eligible action with audit history.

Formal school measures are never offered as one-click context-menu actions.

## 4. Tablet layout

The tablet is touch-first and designed for use while moving through the room:

- seat plan or class grid occupies almost the entire screen;
- pupil actions open in a large slide-over drawer;
- touch targets are large;
- lesson context is available in a compact top or side drawer;
- unresolved actions use a compact bottom bar;
- the same three-step warning flow remains available;
- changes synchronise automatically to laptop and phone after server acceptance.

## 5. Phone layout

The phone is a rapid-entry and quick-check experience:

- alphabetical list or compact name grid is default;
- search by pupil name;
- quick attendance update;
- documented warning and approved direct response;
- follow-up task creation and completion;
- open-action and sync indicators;
- simplified seat-plan view as an optional secondary view.

The phone does not reproduce the complete three-column laptop command centre. A phone change must nevertheless update the laptop/tablet state automatically.

## 6. Seat-plan behaviour

- Laptop and tablet default to a seat plan when configured.
- Alphabetical grid remains permanently available.
- Version 1 exposes one active plan per class while the data model remains extensible for multiple rooms.
- Edit mode is separate from lesson-registration mode.
- A behaviour-related seat change is temporary for the current lesson by default.
- Saving a temporary move as a permanent seat assignment requires a separate explicit confirmation.
- Temporary seat changes synchronise across all connected devices.

## 7. Pupil tile content and privacy

Each pupil tile shows only:

- first name and last-name initial or school-approved display name;
- present/absent/late working status where authorised;
- current-lesson active-action icon;
- open-follow-up indicator.

It does **not** show:

- total behaviour points;
- permanent red/green identity colour;
- diagnoses or detailed support information;
- marks;
- records of other pupils.

## 8. Class routines panel

The teacher can pin class-specific prevention settings:

- entry routine;
- assigned seating active/inactive;
- phone pouch active/inactive;
- attention signal;
- default voice level;
- help routine;
- closing routine.

These settings change support, not the universal expectations.

## 9. Pupil quick actions

Primary actions:

1. `Documented classroom warning`
2. `Direct classroom response`
3. `Positive/self-correction note` — optional and selective
4. `Create follow-up task`
5. `Serious incident`
6. `Open pupil overview`

Behaviour categories:

- start routine not followed;
- instruction disruption;
- task not started/off-task;
- peer/group disruption;
- unauthorised smartphone use;
- unauthorised laptop use;
- reasonable instruction not followed;
- disrespectful language/provocation;
- transition/closing routine;
- material/space misuse;
- other observable behaviour.

The `other` option requires a short factual description and may not be used for personality labels.

## 10. Response preview

After selecting behaviour, the app shows:

- applicable universal expectation;
- current ladder level;
- suggested Dutch teacher sentence;
- approved default response;
- approved alternative where present;
- whether the action is autonomous or behind the school gate;
- whether the record remains local or could later be eligible for Smartschool publication;
- current mutation state.

Example:

```text
Expectation: Laat iedereen leren
Observed behaviour: speaking during whole-class instruction
Current step: L3 documented classroom warning
Say: “Je bleef praten na de herinnering. Als dit opnieuw gebeurt, verander je van plaats.”
Default response: seat change
Authority: classroom management — autonomous
Smartschool: local only; no publication
Sync: ready
```

Buttons:

- `Confirm`
- `Choose approved alternative`
- `Do not announce response` — reason required
- `Do not record`
- `Serious route instead`

## 11. Direct classroom response flow

When L4 is triggered, the previous L3 record and announced response are preselected. The teacher confirms completion rather than creating another warning.

Approved quick responses derive from Decision 1B-D3, including:

- complete missed routine step;
- seat change;
- temporary individual work;
- individual work position with task block;
- phone into numbered pouch;
- close device / paper alternative;
- separate pupils and pause interaction;
- repair/clean-up step.

The outcome is stored as:

- `completed`;
- `refused`;
- `adapted`;
- `withdrawn`.

Responses that are official order measures are not immediate confirmation buttons. They open a school-consultation request.

## 12. School-gate flow

For L5 actions the app shows:

```text
Teacher proposal
→ reason and supporting records
→ authorised role / destination
→ status: draft / requested / confirmed / declined / completed
```

The initial teacher proposal and official school decision are stored separately.

No parent notice, official Smartschool note, punishment work, detention, study detention or temporary removal is marked as imposed until confirmed through the school process.

## 13. Serious-incident screen

The serious route has a deliberately different visual and interaction pattern.

Immediate checklist:

- safety instruction given;
- school support summoned;
- involved pupils separated where safe;
- destination/handover selected;
- urgent medical or emergency service required.

Factual record sections:

- exact time and place;
- directly observed action;
- exact words only when relevant;
- immediate teacher action;
- people informed;
- handover confirmation;
- attachments disabled in v1 unless school governance approves them.

No ordinary count or warning level is shown.

## 14. End-of-lesson review

When ending the lesson, the app displays only unresolved items:

- pupil conversation due;
- school-consultation draft not sent;
- failed, pending or conflicted sync;
- serious handover not confirmed;
- attendance/evaluation follow-up;
- direct response announced but not marked completed;
- offline changes on this device not yet accepted by the server.

The teacher can close the lesson with open follow-up items, but a second device must see the same canonical closure and outstanding-action state.

## 15. Pupil overview

Private detail view with separate tabs:

- open actions;
- attendance working view;
- make-up assessments;
- behaviour events;
- conversations/restoration;
- audit history.

The view shows facts and statuses, not a combined risk score.

## 16. Cross-device synchronisation behaviour

KlasKompas follows `CROSS_DEVICE_REALTIME_SYNC_SPEC_v0.1.md`.

Under normal connectivity:

- the initiating device responds immediately and marks the mutation pending;
- accepted changes appear automatically on other connected teacher devices within the two-second product target after server acceptance;
- no manual refresh is required;
- duplicate network retries do not create duplicate records;
- incompatible edits produce a visible conflict instead of silent overwrite.

Synchronised state includes attendance, active lesson phase, L3/L4 events, temporary seat changes, follow-ups, make-up statuses, corrections, withdrawals and unresolved-action indicators.

Device-local UI state such as scroll position or open drawer is not synchronised.

## 17. Synchronisation indicators

The interface supports at least:

- `synced`;
- `local_pending`;
- `retrying`;
- `failed`;
- `conflict`;
- `offline`.

Indicators are visible globally and on affected records and do not rely on colour alone.

## 18. Projection and privacy mode

Laptop provides a one-step privacy mode that immediately hides:

- pupil names;
- attendance;
- follow-up indicators;
- current selection;
- pupil/action panel;
- behavioural operational details.

Only general expectations, routines or lesson content may remain visible. Tablet and phone retain quick-lock behaviour.

## 19. Accessibility and pressure-state requirements

- keyboard operation for laptop;
- large touch targets for tablet;
- rapid list/search operation for phone;
- no reliance on colour alone;
- undo/correct last eligible action with audit history;
- visible unsynchronised state;
- confirmation only for high-impact or school-gated actions, not every ordinary click;
- private-screen timeout and quick lock;
- pupil names hidden from projected/shared displays by default.

## 20. Smartschool boundary

The first interface may synchronise roster data after school approval. Behaviour records remain within the KlasKompas backend until an official LVS write endpoint and field mapping are approved.

Cross-device KlasKompas synchronisation is not the same as Smartschool publication. A record can be fully synchronised between the teacher's devices while its Smartschool publication state remains `not_available` or `local_only`.

Any future Smartschool publication flow must show a final preview and explicit teacher confirmation.

## Related documents

- `../00-project/DECISION_1B_D4_DEVICE_LAYOUT_AND_REALTIME_SYNC_v1.0.md`
- `CROSS_DEVICE_REALTIME_SYNC_SPEC_v0.1.md`
- `DIRECT_RESPONSE_CONFIGURATION_CONTRACT_v0.1.md`
- `SMARTSCHOOL_INTEGRATION_BOUNDARY_v0.1.md`
