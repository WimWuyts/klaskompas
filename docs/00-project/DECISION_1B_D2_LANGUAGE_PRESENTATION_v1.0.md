# Decision 1B-D2 — Pupil-facing language presentation v1.0

**Status:** approved by project owner  
**Approval date:** 22 July 2026  
**Scope:** language presentation of universal classroom expectations and teacher-response text

## Decision

KlasKompas uses Dutch as the mandatory primary language for pupil-facing expectations. English or Spanish may appear as a supporting subject-language line underneath the Dutch wording.

Version 1 supports three class settings:

- `nl` — Dutch only;
- `nl-en` — Dutch with supporting English;
- `nl-es` — Dutch with supporting Spanish.

Dutch cannot be disabled in version 1.

## Display hierarchy

- Dutch appears first and in the largest type.
- The supporting English or Spanish line appears directly underneath in a visually secondary style.
- English and Spanish are not shown together on one classroom display.
- The behavioural meaning must remain equivalent across languages.

Example for an English lesson:

```text
LAAT IEDEREEN LEREN
Let everyone learn.
```

Example for a Spanish lesson:

```text
LAAT IEDEREEN LEREN
Deja que todos aprendan.
```

## Approved short formulations

| No. | Dutch — primary | English — supporting | Spanish — supporting |
|---|---|---|---|
| 1 | Start en eindig volgens de routine. | Start and finish with the routine. | Empieza y termina siguiendo la rutina. |
| 2 | Werk actief mee en volg de instructie. | Work actively and follow instructions. | Participa activamente y sigue las instrucciones. |
| 3 | Laat iedereen leren. | Let everyone learn. | Deja que todos aprendan. |
| 4 | Behandel iedereen respectvol en houd het veilig. | Treat everyone with respect and keep it safe. | Trata a todos con respeto y actúa de forma segura. |
| 5 | Gebruik materiaal en technologie zoals afgesproken. | Use materials and technology as agreed. | Usa el material y la tecnología según lo acordado. |
| 6 | Neem verantwoordelijkheid en herstel wat fout loopt. | Take responsibility and put things right. | Asume tu responsabilidad y repara lo ocurrido. |

The phrase `reasonable instructions` remains part of the internal policy meaning. The shorter pupil-facing wording uses `volg de instructie` so the display remains direct and memorable.

## Teacher-response language

- L1 and L2 routine prompts may optionally be shown or spoken in English or Spanish.
- L3 documented classroom warnings, L4 consequences and L5 school-gate text are presented in Dutch first.
- A target-language support line may be available for L1/L2, but never replaces the Dutch formal wording.
- The private teacher interface is Dutch in the September version.

## Official communication

The following are Dutch by default:

- Smartschool or LVS drafts/publications;
- parent communication;
- formal notes and school measures;
- follow-up and repair agreements;
- audit descriptions intended for school review.

## Implementation consequences

The eventual interface must:

- store expectation content by stable semantic key rather than by visible text;
- support `nl`, `en` and `es` translations without creating separate behavioural rules;
- keep Dutch mandatory in pupil-facing class displays;
- allow a per-class subject-language setting;
- prevent a translation change from altering behaviour-category or rules-engine meaning;
- include tests that every approved expectation has complete Dutch, English and Spanish text.

## Source alignment

This decision follows the school regulation principles that boundaries must be clear and human, teaching language must be understandable and motivating, and the school’s general communication language is Dutch.

## Related documents

- `../01-behaviour-framework/UNIVERSAL_EXPECTATIONS_v0.2.md`
- `OPEN_DECISIONS_REGISTER.md`
- `PHASE_1B_PROGRESS_2026-07-22.md`
