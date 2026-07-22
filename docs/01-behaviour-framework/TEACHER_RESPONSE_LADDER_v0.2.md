# Teacher Response Ladder v0.2

**Status:** first school-aligned operational design  
**Purpose:** help the teacher follow the same decision route under pressure without converting behaviour into an automatic punishment score.

## 1. Ordinary classroom route

### L0 — Prevent and teach the routine

The teacher organises the lesson so the expected behaviour is easy to perform:

- expectation visible;
- materials and first task ready;
- assigned seats where useful;
- attention signal and voice level taught;
- phone/laptop routine decided in advance;
- instructions brief and checked;
- transition and closing routine rehearsed.

**Stored:** no individual behaviour record.

### L1 — Non-verbal redirect

Use the least intrusive action likely to work:

- eye contact;
- proximity;
- gesture;
- point to instruction or task;
- pause near the pupil.

**Stored:** normally no.

### L2 — Brief private reminder

State the observable behaviour and expected action in one calm sentence.

> “You are talking during instruction. The expectation is that one person speaks. Stop now.”

Avoid a public discussion, long lecture or interpretation of motivation.

**Stored:** normally no.

### L3 — Documented classroom warning

Use when the same behaviour continues after a clear reminder or when a clear, non-serious violation requires a recorded boundary.

The warning contains:

1. observed behaviour;
2. broken expectation;
3. required action;
4. the direct classroom response if it happens again in the lesson.

> “You continued talking after the reminder. I am recording a classroom warning. If it happens again, you move to the individual seat.”

**Stored:** yes.

**Policy meaning:** this is a KlasKompas operational record. It is not automatically the official school `ordemaatregel` called a warning or agenda note.

### L4 — Announced direct classroom response

Apply the response that was named at L3. It must restore learning conditions and remain within ordinary classroom management.

Possible responses:

- seat change;
- temporary individual work for the activity;
- phone into the classroom pouch;
- close device and use equivalent paper task;
- redo the entry, transition or closing step;
- complete missed clean-up or restore material;
- short check-in after the lesson.

> “It happened again, so you move to the individual seat now. We discuss it after the lesson.”

**Stored:** yes, linked to the L3 record.

### L5 — School consultation / official order-measure gate

Use when:

- L4 does not restore the lesson;
- the pattern recurs across lessons;
- the appropriate next action is an official order measure;
- parent communication or formal school follow-up is needed;
- removal from class is being considered.

KlasKompas creates a proposal or follow-up request for one of the authorised routes:

- formal conversation;
- official warning/note;
- punishment work;
- detention or study detention;
- material service;
- temporary removal from lesson;
- behavioural contract;
- formal restorative/support process.

The measure becomes `confirmed` only after the school-authorised consultation or workflow.

**Stored:** proposal, decision, deciding role, notification status and outcome.

## 2. Serious-incident route — S

The ordinary ladder is skipped when behaviour creates immediate danger or crosses a serious boundary, including:

- violence or credible threat;
- serious bullying or sexual boundary violation;
- discriminatory/racist incident of sufficient severity;
- dangerous object;
- serious theft or deliberate serious damage;
- drugs/alcohol;
- acute safety risk;
- behaviour that makes the classroom unsafe or impossible to manage.

### S1 — Stop and secure

Give a direct safety instruction, separate people when safe and summon the authorised school support route.

### S2 — Handover

Record to whom the pupil/situation was handed over and whether the handover was confirmed.

### S3 — Factual incident record

Record only what was seen, heard, done and immediately reported. Separate observations, quotations, sources and teacher actions.

### S4 — School-owned outcome

The school decides support, order measures, disciplinary steps, parent contact and external involvement. KlasKompas may display the confirmed status if authorised but does not decide it.

## 3. Decision rules

### One behaviour in one lesson

```text
L1 or L2
→ continued behaviour
→ L3 with announced response
→ same behaviour repeats
→ L4
→ lesson still not workable or formal measure needed
→ L5
```

The teacher does not issue multiple new warnings after the announced consequence should have followed.

### Different small behaviour in the same lesson

Use professional judgment. Do not mechanically escalate because an unrelated minor behaviour occurred. The system should show the current lesson history but require a conscious decision.

### Self-correction

When a pupil corrects behaviour at L1, L2 or L3 and the lesson continues, the active lesson path closes. The teacher may mark `self_corrected` at L3 without creating a consequence.

### Context and accommodations

The teacher may pause or adapt the ladder for:

- a confirmed classroom accommodation;
- a misunderstanding or inaccessible instruction;
- a technical problem;
- a teacher misinterpretation;
- a pupil who immediately reports a legitimate difficulty.

The app records the reason only when an L3+ record already exists; it does not store diagnostic details.

## 4. Registration fields from L3 onward

Minimum structured fields:

- pupil;
- class and lesson session;
- timestamp;
- expectation;
- observable behaviour category;
- short factual description when needed;
- ladder level;
- announced/direct response;
- pupil response (`corrected`, `repeated`, `refused`, `unclear`);
- follow-up required;
- source/teacher;
- sync/publication status;
- correction/audit history.

## 5. Non-negotiable safeguards

- No combined behaviour score.
- No automatic sanction after a count.
- No public colour or ranking visible to pupils.
- No personality or motivation labels.
- No official Smartschool/LVS publication without preview and explicit confirmation.
- No formal school measure marked as imposed before authorised confirmation.
- No serious incident treated as an ordinary warning accumulation.

## 6. Open school confirmations

- exact boundary between a KlasKompas documented warning and an official school warning;
- whether temporary class removal can occur immediately with later consultation;
- which staff member receives each L5 request;
- which L5 outcomes may be initiated by the subject teacher;
- official parent-notification process;
- whether the behaviour coach has a standard referral form or Smartschool field.