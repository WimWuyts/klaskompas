# Behaviour Pattern Rules v0.1

**Status:** timing rule approved as Phase 1B-D1 on 22 July 2026; remaining implementation details stay under review  
**Goal:** make repeated behaviour visible and trigger timely follow-up without producing an automatic sanction or pupil score.

## 1. Fundamental rule

Counts create a **review obligation**, not a sanction.

KlasKompas may say:

> “This is the third documented incident in the same category within the last six lessons with this class. A follow-up conversation is required.”

It may not say:

> “Three incidents automatically mean detention.”

## 2. Same-lesson rule

For the same observable behaviour within one lesson:

1. L1/L2 correction;
2. continued behaviour → L3 documented classroom warning with announced response;
3. repeated behaviour after L3 → L4 announced classroom response;
4. lesson still not workable or official measure needed → L5 school consultation.

A second L3 warning is not used merely to postpone the response already announced.

## 3. Approved cross-lesson trigger

### Rule P1 — approved in decision 1B-D1

Three L3/L4 records in the **same behaviour category** within the **last six lesson contacts with that class** create a required follow-up task.

A `lesson contact` is a completed lesson session for the relevant class and teacher context. Calendar days, holidays and lessons with unrelated classes do not advance this window.

The follow-up task is:

```text
short pupil conversation
→ name the factual pattern
→ check context and preventive support
→ agree one observable next-step expectation
→ decide whether school consultation is needed
```

The trigger creates no automatic sanction and does not itself create an official school warning.

## 4. Approved post-conversation trigger

### Rule P2 — approved in decision 1B-D1

If the same category receives another L3/L4 record **within four lesson contacts with that class after the follow-up conversation**, the app prompts the teacher to:

- review the earlier observable agreement;
- verify whether the planned preventive support was applied;
- consult the class teacher, behaviour coach or student-support route where appropriate;
- request an official school measure only through the authorised gate.

This remains a prompt, not an automatic measure.

If four lesson contacts pass without another formal record in the same category, P2 is not triggered by a later isolated event. A later pattern must satisfy P1 again.

## 5. Approved recovery and closure

An active pattern closes when:

- no new L3/L4 record in the same category occurs for **six consecutive lesson contacts with that class** after follow-up; or
- the teacher explicitly closes it after a successful review; or
- the school replaces it with an official support or order process.

Closing a pattern removes it from the active dashboard. Historical records remain subject to the approved retention policy and are never silently rewritten.

A closed pattern does not permanently lower a pupil's status. A later pattern starts from the normal P1 rule unless an authorised official school process is still active.

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

The exact category wording and mappings remain reviewable until the behaviour matrix is approved.

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

## 10. Required tests before implementation acceptance

- three L3/L4 incidents in the same category across exactly six lesson contacts;
- an older incident falling outside the six-contact window;
- classes taught at different weekly frequencies;
- repeated behaviour within four contacts after the follow-up conversation;
- later isolated behaviour after the four-contact P2 window;
- six consecutive contacts without recurrence closing an active pattern;
- unrelated categories remaining separate;
- lateness excluded from the mechanism;
- a serious incident bypassing P1/P2;
- a pupil with an approved classroom accommodation;
- correction or withdrawal of an erroneous record recalculating the pattern auditably.

## 11. Binding decision reference

- `../00-project/DECISION_1B_D1_BEHAVIOUR_PATTERN_RULE_v1.0.md`
