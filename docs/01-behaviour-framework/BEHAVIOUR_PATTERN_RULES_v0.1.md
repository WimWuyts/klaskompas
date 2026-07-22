# Behaviour Pattern Rules v0.1

**Status:** candidate consistency rules for review; not school policy  
**Goal:** make repeated behaviour visible and trigger timely follow-up without producing an automatic sanction or pupil score.

## 1. Fundamental rule

Counts create a **review obligation**, not a sanction.

KlasKompas may say:

> “This is the third documented incident in the same category within the active window. A follow-up review is required.”

It may not say:

> “Three incidents automatically mean detention.”

## 2. Same-lesson rule

For the same observable behaviour within one lesson:

1. L1/L2 correction;
2. continued behaviour → L3 documented classroom warning with announced response;
3. repeated behaviour after L3 → L4 announced classroom response;
4. lesson still not workable or official measure needed → L5 school consultation.

A second L3 warning is not used merely to postpone the response already announced.

## 3. Cross-lesson candidate trigger

### Candidate rule P1

Three L3/L4 records in the **same behaviour category** within a rolling window of **15 school days** create a required follow-up task.

The follow-up task is:

```text
short pupil conversation
→ check context and preventive support
→ agree one observable next-step expectation
→ decide whether school consultation is needed
```

This trigger is provisional. It must be tested with fictional scenarios and approved by the project owner before product code treats it as a default.

## 4. Post-conversation trigger

### Candidate rule P2

If the same category is recorded again after the follow-up conversation and within the remaining active window, the app prompts:

- review whether preventive support was applied;
- consult the behaviour coach/student-support route if appropriate;
- request an official school measure only through the authorised gate.

Again, this is a prompt, not an automatic measure.

## 5. Recovery and closure

An active pattern can close when:

- no new record in the same category occurs for 10 school days after follow-up; or
- the teacher explicitly closes it after a successful review; or
- the school replaces it with an official support/order process.

Closing a pattern removes it from the active dashboard. Historical records remain subject to the approved retention policy and are never silently rewritten.

## 6. Category separation

Counts are not combined across unrelated categories.

Examples:

- talking during instruction is not added to forgotten material;
- off-task laptop use is not added to a disagreement expressed respectfully;
- lateness is excluded because the school already has an official Oase count and cycle;
- ordinary assessment absence is not behaviour;
- serious incidents do not use P1/P2.

## 7. Pattern categories for the first version

1. `start_routine_not_followed`
2. `instruction_disruption`
3. `task_non_start_or_off_task`
4. `peer_distraction_or_group_disruption`
5. `unauthorised_device_use`
6. `reasonable_instruction_not_followed`
7. `disrespectful_language_or_provocation_non_serious`
8. `transition_or_closing_routine_not_followed`
9. `material_or_space_misuse_non_serious`

Serious categories are flagged separately and never counted into this mechanism.

## 8. Prevention check before escalation

At every P1 or P2 trigger, KlasKompas asks the teacher to confirm which preventive actions were used. This is not a blame mechanism; it helps select the correct next action.

Possible fields:

- expectation taught;
- seating adjusted;
- task/instruction clarified;
- check for understanding completed;
- device routine applied;
- support/accommodation considered;
- pupil conversation held;
- other.

The teacher may continue without checking every item but must choose a short reason when requesting formal escalation.

## 9. No permanent red status

A pupil tile does not remain red because of historical incidents. The class screen may show only:

- an open action icon;
- an active classroom response in the current lesson;
- a due follow-up indicator.

Detailed history is visible only after opening the private pupil view.

## 10. Scenarios to test before approval

- three low-level incidents that self-correct quickly;
- three L3 records from different teachers/categories;
- repeated behaviour caused by an unclear task;
- repeated device refusal;
- behaviour after a successful follow-up conversation;
- serious incident occurring during an active minor pattern;
- pupil with an approved classroom accommodation;
- teacher corrects an erroneous record.