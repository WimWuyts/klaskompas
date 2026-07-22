# Workflow inhaaltoets v0.1

## Hoofdroute

```text
Evaluatie gepland
→ leerling afwezig tijdens evaluatie
→ systeem signaleert mogelijke inhaalverplichting
→ leerkracht bevestigt verplicht, vrijgesteld of niet van toepassing
→ datum afspreken
→ inhaaltoets inplannen
→ afgelegd
→ gecorrigeerd
→ afgesloten
```

## Voorlopige statussen

- `not_required` — geen inhaalactie nodig;
- `required_unscheduled` — verplicht, datum nog niet bepaald;
- `scheduled` — datum gepland;
- `completed` — toets afgelegd;
- `graded` — gecorrigeerd/verwerkt;
- `closed` — volledig afgesloten;
- `exempted` — vrijgesteld met reden.

## Regels

- afwezigheid creëert geen automatische definitieve sanctie of verplichting;
- de leerkracht bevestigt de status;
- iedere afwijking of vrijstelling kan een reden vereisen;
- open statussen verschijnen op het klas- en leerlingdashboard;
- statusovergangen worden geaudit.
