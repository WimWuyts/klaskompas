# Decision 1B-D3 — Direct classroom responses v1.0

**Status:** approved by project owner  
**Approval date:** 22 July 2026  
**Scope:** default L4 classroom-management response for ordinary behaviour categories

## 1. Fundamental rule

Every ordinary behaviour category has one default direct classroom response and no more than one approved alternative.

The app shows the response before the teacher confirms an L3 documented classroom warning. The teacher may change the response before giving the warning. When the same behaviour recurs in that lesson, the response announced at L3 is applied at L4.

A formal school order measure is never offered as an L4 alternative. When ordinary classroom management cannot restore the lesson, KlasKompas opens the L5 school-consultation gate.

## 2. Approved response map

| Behaviour category | Default L4 response | Approved alternative | School-gate boundary |
|---|---|---|---|
| `start_routine_not_followed` | Complete the missed routine step correctly | Use the designated individual start place until the start task has begun | Repeated refusal moves to instruction-following/L5 review |
| `instruction_disruption` | Seat change to the agreed individual position | Separate working position until calm re-entry is possible | Persistent unworkability opens L5 |
| `task_non_start_or_off_task` | Individual work position with one defined task block and checkpoint | Equivalent paper version when digital distraction is the cause | Learning adaptations require a genuine support reason, not punishment logic |
| `peer_distraction_or_group_disruption` | Temporary individual work for the remainder of the activity | Different bounded group role or work position when this can genuinely restore cooperation | Repeated or harmful conduct can trigger follow-up or school consultation |
| `unauthorised_smartphone_use` | Device into the numbered classroom pouch for the remainder of the lesson | None in the ordinary route | Refusal is treated as `reasonable_instruction_not_followed` and opens L5; no invented confiscation period |
| `unauthorised_laptop_use` | Close device and complete an equivalent paper task | Reposition screen/seat when digital access remains necessary | Approved assistive technology may not be removed; laptop brochure may refine the rule |
| `reasonable_instruction_not_followed` | Move to the individual work position and complete the original instruction there | Choose between two valid ways to complete the same instruction | Refusal of the L4 response opens L5; no endless warning sequence |
| `disrespectful_language_or_provocation_non_serious` | Separate involved pupils and pause the interaction | Temporary individual work when disruption would otherwise continue | Serious threats, bullying, sexual-boundary violations or severe discrimination use the serious route |
| `transition_or_closing_routine_not_followed` | Redo the missed transition or closing step correctly | Complete the next transition individually on the teacher's cue | Leaving without permission or persistent refusal may require L5 review |
| `material_or_space_misuse_non_serious` | Stop use and restore the material, workplace or room condition | Use alternative material under direct supervision where needed | Actual damage creates a factual damage record and school-consultation task; teacher does not decide liability |

## 3. Serious incidents

Serious or unsafe incidents have no standard L4 classroom response. Violence, credible threats, serious bullying, sexual-boundary violations, severe discriminatory/racist incidents, dangerous objects, drugs/alcohol and acute safety risks use the separate serious route:

```text
stop behaviour
→ restore safety
→ summon authorised support
→ confirm handover
→ record facts
```

## 4. Teacher interaction rule

At L3 the interface shows:

```text
Default response if repeated: [response]

Confirm
Choose approved alternative
Do not announce a response — short reason required
```

At L4 the earlier L3 record and announced response are preselected. The teacher confirms completion rather than creating another warning.

## 5. Safeguards

- Direct responses must restore learning conditions and be immediately executable.
- No unrelated punishment writing is generated.
- No collective class punishment is created.
- No public humiliation, forced public apology or forced mediation.
- No loss of teaching, assessment access or approved accommodation without a valid support reason.
- A response may be corrected or withdrawn with audit history.
- The app never converts refusal automatically into detention, punishment work or class removal.
- Official warnings, agenda/Smartschool notes, punishment work, detention, study detention and temporary class removal remain behind the authorised school gate.

## 6. Implementation consequences

The eventual rules and interface layer must store:

- stable behaviour-category key;
- `default_response_key`;
- optional `allowed_alternative_response_key`;
- Dutch response text and optional English/Spanish L1/L2 prompts;
- authority status;
- school-gate requirement;
- announced response at L3;
- completed, refused, adapted or withdrawn outcome at L4;
- audit history.

Category defaults are configuration, not automatic sanctions. The teacher remains responsible for the professional decision and may choose an approved alternative before the warning is issued.

## 7. Related documents

- `../01-behaviour-framework/BEHAVIOUR_MATRIX_v0.1.md`
- `../01-behaviour-framework/TEACHER_RESPONSE_LADDER_v0.2.md`
- `../01-behaviour-framework/TEACHER_AUTHORITY_MATRIX_v0.1.md`
- `../04-architecture/CLASSROOM_QUICK_INTERACTION_SPEC_v0.1.md`
- `OPEN_DECISIONS_REGISTER.md`
