# Claude Code opdracht — Phase 2A.1 automation-first architecture preflight

Werk in repository `WimWuyts/klaskompas` op branch:

```text
claude/phase-2a-automation-first-preflight
```

Voer uitsluitend **Phase 2A.1 — automation-first architecture preflight** uit.

## Startcontrole

1. Bevestig repository, branch en actuele `main`-basis.
2. Lees `CLAUDE.md` volledig.
3. Lees eerst de geconsolideerde v1.0-canon:
   - `docs/00-project/PHASE_1B_CONSOLIDATED_OPERATING_CONTRACT_v1.0.md`
   - `docs/00-project/SYSTEM_SCOPE_v1.0.md`
   - `docs/02-student-follow-up/OPERATIONAL_OVERVIEW_AND_FOLLOW_UP_MODEL_v1.0.md`
   - `docs/01-behaviour-framework/BEHAVIOUR_AND_CLASSROOM_MANAGEMENT_CONTRACT_v1.0.md`
   - `docs/01-behaviour-framework/SCHOOL_POLICY_ALIGNMENT_REGISTER_v1.0.md`
   - `docs/01-behaviour-framework/TEACHER_AUTHORITY_MATRIX_v1.0.md`
   - `docs/04-architecture/SMARTSCHOOL_ACCESS_AND_LVS_MAPPING_v1.0.md`
   - `docs/03-privacy-security/DATA_GOVERNANCE_APPROVAL_GATE_v1.0.md`
   - `docs/00-project/PHASE_1B_CONSOLIDATION_AUDIT_v1.0.md`
   - `docs/00-project/OPEN_DECISIONS_REGISTER.md`
4. Lees alle goedgekeurde D1-D6-beslisdocumenten.
5. Lees:
   - `docs/04-architecture/TECH_STACK_OPTIONS_v0.1.md`
   - `docs/04-architecture/CROSS_DEVICE_REALTIME_SYNC_SPEC_v0.1.md`
   - `docs/04-architecture/CLASSROOM_QUICK_INTERACTION_SPEC_v0.1.md`
   - `docs/04-architecture/INTERNAL_OFFICIAL_RECORD_BOUNDARY_v0.1.md`
   - issue #6;
   - issue #7;
   - `docs/00-project/PHASE_2A_AUTOMATION_FIRST_ARCHITECTURE_PREFLIGHT_v0.1.md`.
6. Meld vóór wijzigingen:
   - welke canon je als bindend behandelt;
   - welke historische v0.x-bestanden alleen achtergrond zijn;
   - welke open externe schoolbeslissingen geen technische aannames mogen worden;
   - of de branch schoon en correct gebaseerd is.

Stop en rapporteer wanneer repository, branch of canon niet overeenkomen.

## Productintentie

Ontwerp het echte KlasKompas-systeem voor één leerkracht, maar gebruik uitsluitend fictieve data tot de governancepoort is goedgekeurd.

Het systeem moet zo veel mogelijk administratief automatisch doen:

```text
uurrooster
→ juiste lescontext
→ aanwezigheid
→ kandidaat gemiste evaluatie
→ bevestigde inhaalworkflow
→ handmatig bevestigde remediëring
→ opvolgactie
→ Vandaag-dashboard en leerlingoverzicht
```

Gedragsopvolging, oudercontact, schoolopvolging, audit en synchronisatie moeten geïntegreerd maar als afzonderlijke domeinen blijven bestaan.

Bouw geen wegwerpdemo. Ontwerp een productiegeschikte kern waarvan de fictieve seedbron later kan worden vervangen door CSV en officiële Smartschool OneRoster-invoer zonder herschrijving van de domeinlogica.

## Niet doen

- Installeer geen framework, package of database.
- Schrijf geen applicatie-, migratie- of infrastructuurcode.
- Maak geen productieproject bij Supabase of een andere provider.
- Gebruik geen echte leerlingdata, Smartschoolcredentials of herkenbare voorbeelden.
- Lock de stack niet definitief.
- Verander geen goedgekeurd pedagogisch, gedrags-, sanctie- of privacybeleid.
- Vul geen schoolprocedure in op basis van een aannemelijke gok.
- Maak geen automatische sanctie, officiële publicatie, oudercommunicatie, remediëringsbeslissing of wettelijke aanwezigheidsbeslissing.
- Verwijder of herschrijf historische documenten niet massaal.

## Onderzoeksmethode

Voor actuele technische claims mag je webresearch uitvoeren, maar gebruik uitsluitend primaire bronnen en officiële documentatie van de onderzochte technologieën. Noteer bron en raadpleegdatum. Scheid duidelijk:

- wat de KlasKompas-canon vereist;
- wat officiële technologie-documentatie ondersteunt;
- wat jouw architectuuradvies of inferentie is;
- wat nog experimenteel moet worden bewezen.

Controleer licenties wanneer je concrete libraries of frameworks aanbeveelt.

## Vereiste opleveringen

Maak exact deze documenten:

1. `docs/04-architecture/ARCHITECTURE_PREFLIGHT_REPORT_v0.1.md`
2. `docs/04-architecture/AUTOMATION_BOUNDARY_MATRIX_v0.1.md`
3. `docs/04-architecture/AUTOMATION_FIRST_DOMAIN_MODEL_v0.1.md`
4. `docs/04-architecture/DATA_SOURCE_ADAPTER_DESIGN_v0.1.md`
5. `docs/04-architecture/REALTIME_OFFLINE_AND_CONFLICT_DESIGN_v0.1.md`
6. `docs/04-architecture/STACK_EVALUATION_MATRIX_v0.1.md`
7. `docs/04-architecture/PROTOTYPE_VERTICAL_SLICE_PLAN_v0.1.md`
8. `docs/04-architecture/PHASE_2A_TEST_STRATEGY_v0.1.md`
9. `docs/00-project/PHASE_2A_PREFLIGHT_HANDOVER_v0.1.md`

Werk `docs/00-project/OPEN_DECISIONS_REGISTER.md` alleen bij wanneer de preflight een aantoonbaar nieuwe beslissing blootlegt. Nieuwe beslissingen blijven `Open` of `Proposed`; lock niets namens de projecteigenaar.

## Inhoudelijke vereisten

### A. Automation boundary matrix

Classificeer iedere relevante handeling als:

- `automatic_deterministic`;
- `automatic_after_teacher_input`;
- `proposal_requires_confirmation`;
- `manual_only`;
- `official_external_process`;
- `forbidden_automation`.

Neem minimaal aanwezigheid, gemiste evaluaties, inhaalwerk, remediëring, gedrag, oudercontact, schoolopvolging, Smartschoolpublicatie, synchronisatie en correcties op.

Beschrijf per handeling:

- trigger;
- benodigde brondata;
- resultaat;
- menselijke bevestiging;
- auditvereiste;
- herstel-/correctieroute;
- fout- en conflictgedrag.

### B. Domain model

Ontwerp een relationeel model met expliciete aggregate boundaries, lokale UUID's, externe bronsleutels, versies en auditrelaties voor alle kernentiteiten uit de fasebrief.

Lever:

- entiteiten en verantwoordelijkheden;
- belangrijkste velden;
- cardinaliteiten;
- state machines;
- unieke constraints en idempotency keys;
- transaction boundaries;
- cross-domain links;
- welke gegevens projecties zijn en welke records autoritatief zijn;
- retentie-/privacyaandachtspunten zonder schoolbeslissingen te verzinnen.

Gebruik geen allesomvattend `student_status`-record en geen combined risk object.

### C. Data-source adapters

Ontwerp providercontracten voor:

- fictieve seeddata;
- CSV-import;
- Smartschool OneRoster;
- eventueel een afzonderlijke timetable-provider wanneer dat architecturaal beter is.

Toon hoe dezelfde domeinlogica blijft werken bij bronwissel. Beschrijf validatie, provenance, idempotentie, rollover, missing/disabled records, import preview, rejection report en governance feature flag.

### D. Realtime/offline/conflict

Ontwerp:

- server-authoritative mutations;
- client mutation ID en device ID;
- optimistic local state;
- realtime subscriptions;
- reconnect/replay;
- lokale versleutelde queue;
- recordversies of equivalent concurrencymechanisme;
- mergeable versus incompatible edits;
- zichtbare conflict tasks;
- corrections/withdrawals;
- revocable device sessions;
- safe logs and notifications.

Bereid issue #6 voor met een uitvoerbare meet- en testmethode, maar voer de technische proef nog niet uit.

### E. Stack evaluation

Vergelijk minimaal de drie bestaande opties. Je mag één alternatief toevoegen wanneer dit werkelijk kansrijker is.

Beoordeel onder andere:

- automation/event handling;
- relationele workflowcomplexiteit;
- realtime;
- offline/replay/conflicts;
- tenant/row isolation;
- authentication/device revocation;
- EU/EEA hostingmogelijkheden als open governancepunt;
- testbaarheid;
- deployment- en beheerslast voor één projecteigenaar;
- ontwikkelsnelheid met Claude Code;
- lock-in en migratiepad;
- kostenrisico zonder actuele prijs te gokken;
- fit voor aparte laptop/tablet/gsm-shells.

Geef één primaire aanbeveling en één fallback, maar label de uitkomst als `proposed pending owner approval and proof`.

### F. Vertical slice

Plan een eerste functionele slice die de volledige automation-first keten bewijst met fictieve data. Geef:

- precieze schermen;
- API/mutation flows;
- tabellen/aggregates;
- events/projecties;
- seedscenario;
- tests;
- meetpunten;
- duidelijke uitsluitingen;
- commit- en PR-volgorde.

De slice moet ook één interne klasregistratie en één tijdelijke plaatswissel bevatten om gedeelde lessessie/synchronisatie te bewijzen.

## Kwaliteitscontrole

Voer vóór oplevering uit:

1. canon-consistency audit;
2. interne-linkcontrole voor alle nieuwe documenten;
3. terminologiecontrole: gebruik `Interne klasregistratie`, niet de vervallen formele-waarschuwingsterm;
4. controle dat remediëring handmatig wordt bevestigd;
5. controle dat echte data en productieconfiguratie ontbreken;
6. controle dat geen stack als definitief is gelockt;
7. controle dat elk automatisch proces een fout-, audit- en correctieroute heeft;
8. controle dat issue #6 volledig uitvoerbaar wordt vanuit het ontwerp;
9. `git diff --check` en relevante documentatiechecks die zonder installatie mogelijk zijn.

Commit klein en logisch. Push naar dezelfde branch. Open of actualiseer één draft-PR naar `main` met `Closes #7` niet in de body zolang eigenaargoedkeuring nog nodig is; gebruik liever `Tracks #7`.

## Eindrapport

Eindig met één compact rapport met:

- branch en begin/eind-SHA;
- aangemaakte en gewijzigde bestanden;
- primaire stackaanbeveling en fallback;
- belangrijkste automatiseringsgrenzen;
- blokkerende open beslissingen;
- uitgevoerde controles;
- PR-link;
- bevestiging dat geen code/framework/productieconfiguratie of echte data zijn toegevoegd;
- één exacte kopieerklare volgende Claude Code-opdracht voor de goedgekeurde technische proef, maar voer die niet uit.

Stop daarna. Wacht op expliciete beoordeling en goedkeuring door de projecteigenaar.
