# KlasKompas

**Werknaam:** KlasKompas  
**Status:** Fase 1A goedgekeurd; scope- en integratieontwerp  
**Eigenaar:** Wim Wuyts  
**Doelomgeving:** tweede graad secundair onderwijs, Engels en Spaans

KlasKompas wordt een persoonlijk, visueel leerkrachtdashboard voor consequente klasroutines, gedragsinterventies, aanwezigheid, gemiste evaluaties, inhaaltoetsen en open opvolgacties.

## Kernbelofte

De toepassing helpt de leerkracht om in vergelijkbare situaties dezelfde beslisroute te volgen, zonder professioneel oordeel te vervangen.

## Geplande modules

1. Klassen en leerlingen
2. Vandaag-dashboard
3. Aanwezigheden
4. Evaluaties en inhaalwerk
5. Gedrag en interventies
6. Opvolgacties
7. Historiek en audit
8. Officiële Smartschool-integratie

## Smartschool

Smartschool blijft het officiële schoolsysteem. KlasKompas gebruikt waar mogelijk officiële interfaces om dubbele invoer te vermijden:

- OneRoster 1.1 voor klassen, leerlingen, leerkrachten en inschrijvingen;
- OAuth2 voor een gekoppelde leerkrachtidentiteit;
- rechtstreekse LVS-dossierlijnen alleen wanneer Smartschool een officiële en toegestane schrijfendpoint bevestigt.

Onofficiële scraping, browserautomatisering en opslag van het Smartschoolwachtwoord zijn uitgesloten.

## Niet het doel

KlasKompas is geen vervanging voor Smartschool of een officieel schooladministratiesysteem. Het wordt geen volledig puntenboek, zorgdossier, communicatieplatform of AI-risicoscoringsysteem.

## Belangrijkste veiligheidsregel

**Nooit echte leerlinggegevens, namen, opmerkingen, screenshots of exports in GitHub plaatsen.** Gebruik uitsluitend fictieve testgegevens.

## Huidige fase

Fase 1A is inhoudelijk goedgekeurd. Productiecode start pas nadat de resterende schoolbeleids-, privacy-, hosting- en architectuurbeslissingen zijn genomen.

## Documentatie

Begin bij:

- `docs/00-project/SCOPE_LOCK_PHASE_1A_v1.0.md`
- `docs/00-project/SYSTEM_SCOPE_v0.2.md`
- `docs/00-project/OPEN_DECISIONS_REGISTER.md`
- `docs/04-architecture/SMARTSCHOOL_INTEGRATION_BOUNDARY_v0.1.md`
- `research/SMARTSCHOOL_INTEGRATION_RESEARCH_2026-07-22.md`
- `CLAUDE.md`
