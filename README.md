# KlasKompas

**Werknaam:** KlasKompas  
**Status:** Fase 1B geconsolideerd — wacht op eindgoedkeuring  
**Eigenaar:** Wim Wuyts  
**Doelomgeving:** persoonlijke leerkrachttool voor Engels en Spaans in tweede en derde graad

KlasKompas wordt een persoonlijk, visueel en apparaatoverschrijdend leerkrachtdashboard om voor jezelf één betrouwbaar overzicht te houden van lessen, afwezigheden, gemiste evaluaties, inhaaltoetsen, remediëring, klasmanagement en open opvolgacties.

## Kernbelofte

De toepassing toont wat vandaag nog aandacht vraagt en helpt vergelijkbare situaties via dezelfde beslisroute op te volgen, zonder professioneel oordeel te vervangen.

## Geconsolideerde modules

1. Klassen, leerlingen en lesmomenten
2. Vandaag-dashboard
3. Aanwezigheidswerkweergave
4. Evaluaties en gemiste evaluaties
5. Inhaaltoetsen tot en met planning, afname, correctie en afsluiting
6. Handmatig aangegeven remediëring met doel, actie en review
7. Gedrag en directe klasreacties
8. Opvolgacties, gesprekken, herstel en ouder-/schoolopvolging
9. Privéleerlingoverzicht per domein
10. Historiek, correcties en audit
11. Realtime synchronisatie tussen laptop, tablet en gsm
12. Officiële Smartschool-integratie waar toegestaan

## Persoonlijk overzicht, geen totaalscore

Aanwezigheid, evaluaties, inhaalwerk, remediëring en gedrag worden op één dashboard samengebracht, maar blijven afzonderlijke domeinen. KlasKompas maakt geen gecombineerde leerlingrisicoscore, permanente kleurcode of automatische sanctie.

## Remediëring

De leerkracht kan zelf aangeven dat remediëring nodig is en opvolgen:

- waarom de remediëring werd gestart;
- welk leerdoel of welke vaardigheid centraal staat;
- welke actie gepland is;
- wanneer een review nodig is;
- wat het resultaat was.

Automatische remediëring op basis van cijfers, diagnoses en zorgdossiers blijven buiten scope.

## Smartschool

Smartschool blijft het officiële schoolsysteem. KlasKompas gebruikt uitsluitend officiële en goedgekeurde routes om dubbele invoer te beperken:

- OneRoster 1.1 voor klassen, leerlingen, leerkrachten en inschrijvingen;
- OAuth2 voor een gekoppelde leerkrachtidentiteit;
- rechtstreekse officiële records alleen wanneer endpoint, rechten, veldmapping en zichtbaarheid zijn bevestigd.

Een interne KlasKompasregistratie is nooit automatisch een officiële Smartschool-/LVS-registratie. Onofficiële scraping, browserautomatisering en opslag van het Smartschoolwachtwoord zijn uitgesloten.

## Niet het doel

KlasKompas is geen vervanging voor Smartschool, Wis@d, Oase, Skore of het officiële Leerlingvolgsysteem. Het wordt geen volledig puntenboek, rapportmodule, zorgdossier, communicatieplatform, AI-risicosysteem of automatisch sanctiesysteem.

## Belangrijkste veiligheidsregel

**Nooit echte leerlinggegevens, namen, opmerkingen, screenshots of exports in GitHub plaatsen.** Gebruik uitsluitend fictieve testgegevens totdat de school het volledige governance- en lanceertraject heeft goedgekeurd.

## Geconsolideerde documentatie

Begin bij:

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
- `CLAUDE.md`
