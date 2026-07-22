# Classroom Quick Interaction Specification v0.1

**Status:** interface design draft with fictional data only  
**Primary user:** one teacher during a busy lesson  
**Primary devices:** laptop and tablet; phone as secondary quick view

## 1. Design objective

A normal classroom action from L3 onward should require no more than:

```text
select pupil
→ select observable behaviour
→ confirm displayed response
```

The interface must reduce improvisation without turning pupils into scores or public colour labels.

## 2. Class screen

### Header

- class and subject;
- lesson start/end time;
- connection/synchronisation state;
- current lesson phase: `start`, `instruction`, `individual`, `group`, `assessment`, `closing`;
- button for serious incident route;
- button to end lesson and review open actions.

### Main area

Default view is a seat plan when configured; fallback is an alphabetical name grid.

Each pupil tile shows only:

- first name and last-name initial or school-approved display name;
- present/absent/late working status where authorised;
- current-lesson active action icon;
- open follow-up indicator.

It does **not** show:

- total behaviour points;
- permanent red/green identity colour;
- diagnoses or support details;
- marks;
- records of other pupils.

### Class routines panel

The teacher can pin class-specific prevention settings:

- entry routine;
- assigned seating active/inactive;
- phone pouch active/inactive;
- attention signal;
- default voice level;
- help routine;
- closing routine.

These settings change support, not the universal expectations.

## 3. Pupil quick drawer

Selecting a pupil opens a drawer without leaving the class screen.

### Primary actions

1. `Documented classroom warning`
2. `Direct classroom response`
3. `Positive/self-correction note` — optional and selective
4. `Create follow-up task`
5. `Serious incident`
6. `Open pupil overview`

### Behaviour categories

Large buttons grouped by lesson context:

- start routine not followed;
- instruction disruption;
- task not started/off-task;
- peer/group disruption;
- unauthorised device use;
- reasonable instruction not followed;
- disrespectful language/provocation;
- transition/closing routine;
- material/space misuse;
- other observable behaviour.

The `other` option requires a short factual description and may not be used for personality labels.

## 4. Response preview

After selecting behaviour, the app shows:

- applicable universal expectation;
- current ladder level;
- suggested teacher sentence;
- direct classroom response chosen for this category/class;
- whether the action is autonomous or behind the school gate;
- whether the record will stay local or is eligible for later Smartschool publication.

Example:

```text
Expectation: Let everyone learn
Observed behaviour: speaking during whole-class instruction
Current step: L3 documented classroom warning
Say: “You continued speaking after the reminder. If it happens again, you move to the individual seat.”
Next classroom response: seat change
Authority: classroom management - autonomous
Smartschool: local only; no publication
```

Buttons:

- `Confirm`
- `Change response`
- `Do not record`
- `Serious route instead`

## 5. Direct classroom response flow

When L4 is triggered, the previous L3 record is preselected. The teacher confirms the announced response rather than creating a new warning.

Possible quick responses:

- seat change;
- temporary individual work;
- phone into pouch;
- close device / paper alternative;
- repeat routine step;
- repair/clean-up step;
- after-lesson check-in.

Responses that are official order measures are not shown as immediate confirm buttons. They open a school consultation request.

## 6. School-gate flow

For L5 actions the app shows:

```text
Teacher proposal
→ reason and supporting records
→ authorised role / destination
→ status: draft / requested / confirmed / declined / completed
```

The initial teacher proposal and official school decision are stored separately.

No parent notice, official Smartschool note, punishment work, detention, study detention or temporary removal is marked as imposed until confirmed through the school process.

## 7. Serious-incident screen

The serious route has a deliberately different visual and interaction pattern.

### Immediate checklist

- safety instruction given;
- school support summoned;
- involved pupils separated where safe;
- destination/handover selected;
- urgent medical or emergency service required.

### Factual record sections

- exact time and place;
- directly observed action;
- exact words only when relevant;
- immediate teacher action;
- people informed;
- handover confirmation;
- attachments disabled in v1 unless school governance approves them.

No ordinary count or warning level is shown.

## 8. End-of-lesson review

When ending the lesson, the app displays only unresolved items:

- pupil conversation due;
- school consultation draft not sent;
- failed or pending sync;
- serious handover not confirmed;
- attendance/evaluation follow-up;
- direct response announced but not marked completed.

The teacher can close the lesson with open items; they move to the Today dashboard.

## 9. Pupil overview

Private detail view with separate tabs:

- open actions;
- attendance working view;
- make-up assessments;
- behaviour events;
- conversations/restoration;
- audit history.

The view shows facts and statuses, not a combined risk score.

## 10. Accessibility and pressure-state requirements

- keyboard operation for laptop;
- large touch targets for tablet;
- no reliance on colour alone;
- undo/correct last action;
- visible unsynchronised state;
- confirmation only for high-impact or school-gated action, not every ordinary click;
- private-screen timeout and quick lock;
- pupil names hidden from projected/shared displays by default.

## 11. Smartschool boundary

The first interface may synchronise roster data after school approval. Behaviour records remain local until an official LVS write endpoint and field mapping are approved.

A future publication flow must always show a final preview and explicit teacher confirmation.