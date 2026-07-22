# Direct Response Configuration Contract v0.1

**Status:** implementation contract derived from approved decision 1B-D3  
**Scope:** configuration and UI behaviour for ordinary L3/L4 classroom responses

## Contract

Each ordinary behaviour category exposes:

```ts
type DirectResponseConfiguration = {
  behaviourCategoryKey: string;
  defaultResponseKey: string;
  allowedAlternativeResponseKey?: string;
  authorityStatus: 'classroom_management_autonomous';
  schoolGateOnRefusal: boolean;
  responseTextNl: string;
  optionalPromptEn?: string;
  optionalPromptEs?: string;
};
```

## Interaction

```text
select pupil
→ select behaviour category
→ preview default L4 response
→ confirm or choose the single approved alternative
→ record L3 with announced response
→ recurrence in same lesson
→ confirm completion/refusal/adaptation of announced L4 response
```

## Constraints

- No formal school measure is selectable as a direct response.
- `Change response` lists only the approved alternative and a reasoned `no response announced` path.
- Refusal creates an L5 consultation action; it never selects a formal sanction automatically.
- Serious categories do not load this contract and open the serious-incident route.
- The announced response is immutable after L3 except through an auditable correction.
- Approved accommodations can suppress or adapt a response without storing diagnosis details.
- The interface must support undo/correction and preserve the original value in audit history.

## Reference

- `../00-project/DECISION_1B_D3_DIRECT_CLASSROOM_RESPONSES_v1.0.md`
- `../01-behaviour-framework/BEHAVIOUR_MATRIX_v0.1.md`
- `CLASSROOM_QUICK_INTERACTION_SPEC_v0.1.md`
