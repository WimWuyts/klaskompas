# Smartschool Integration Boundary v0.1

**Status:** ontwerpgrens, onderworpen aan school- en API-goedkeuring  
**Datum:** 22 juli 2026

## Doel

KlasKompas moet dubbele invoer beperken zonder Smartschool te vervangen of via onofficiële browserautomatisering te manipuleren.

## Integratielagen

### Laag 1 — Roster synchronisatie

**Voorkeur:** officiële Smartschool OneRoster 1.1 REST API.

Te synchroniseren objecten:

- school en schooljaarcontext;
- klassen, vakgroepen of lesopdrachten;
- leerlingen;
- leerkrachten;
- inschrijvingen en groepslidmaatschappen.

Smartschool treedt hierbij op als provider. KlasKompas leest deze gegevens en bewaart per record de externe `sourcedId`, bron, laatste synchronisatietijd en bronstatus.

### Laag 2 — Leerkrachtauthenticatie

**Voorkeur:** officiële Smartschool OAuth2 authorization-code flow.

Minimale scope:

- `userinfo` voor de gekoppelde leerkrachtidentiteit.

Mogelijke aanvullende scope:

- `groupinfo`, indien OneRoster niet alle benodigde persoonlijke groepscontext levert.

OAuth-tokens worden uitsluitend server-side versleuteld opgeslagen. Client secrets verschijnen nooit in browsercode, logs of GitHub.

### Laag 3 — Uitgaande Smartschoolacties

Publiek gedocumenteerde mogelijkheden omvatten onder meer berichten, meldingen en resultaten. Die functies vallen niet automatisch binnen de september-MVP.

### Laag 4 — Leerlingvolgsysteem en gedrag

Gewenste functie:

```text
Bevestigde KlasKompas-registratie
→ veldmapping valideren
→ leerkracht toont definitieve preview
→ leerkracht bevestigt publicatie
→ officiële Smartschool-API schrijft dossierlijn/klasnotitie
→ Smartschool-record-id en resultaat auditbaar opslaan
```

Deze laag mag pas worden geïmplementeerd wanneer een officiële endpoint of schriftelijk goedgekeurde maatwerkscope beschikbaar is.

## Verboden routes

- HTML-scraping als productiekoppeling;
- sessiecookies of gebruikerswachtwoorden hergebruiken;
- browserextensies die Smartschoolformulieren automatisch invullen;
- headless browser automation;
- reverse-engineering van interne, niet-publieke endpoints;
- automatische publicatie zonder expliciete leerkrachtbevestiging;
- Smartschool als stil nevenarchief behandelen zonder bronstatus.

## Connectorcontract

De applicatie gebruikt een interne adaptergrens, bijvoorbeeld:

```ts
interface SmartschoolConnector {
  syncRoster(input: RosterSyncRequest): Promise<RosterSyncResult>;
  getCurrentTeacher(): Promise<ExternalTeacherIdentity>;
  publishStudentFollowUp?(
    input: StudentFollowUpPublicationRequest,
  ): Promise<StudentFollowUpPublicationResult>;
}
```

`publishStudentFollowUp` blijft optioneel zolang de officiële schrijfcapaciteit niet is bevestigd.

## Identiteit en matching

- Gebruik Smartschool `sourcedId` of cross-platform identifier als externe sleutel.
- Gebruik een eigen UUID als primaire sleutel in KlasKompas.
- Match nooit uitsluitend op naam.
- Bewaar wijzigingen in externe identifiers auditbaar.
- Verwijder een leerling niet automatisch wanneer die tijdelijk niet meer in de bron verschijnt; markeer de inschrijving eerst als niet-actief of te beoordelen.

## Synchronisatieregels

- Roster sync is idempotent.
- Smartschool is leidend voor namen en lidmaatschap.
- Lokale pedagogische registraties blijven eigendom van KlasKompas totdat publicatie officieel is bevestigd.
- Conflicten worden zichtbaar gemaakt en niet stil overschreven.
- Een mislukte uitgaande publicatie krijgt een herhaalbare status, geen dubbele dossierlijn.

## Vereiste bewijsstukken vóór productie

1. schooltoestemming;
2. verwerkers- en verantwoordelijkheidsanalyse;
3. OneRoster-clientconfiguratie;
4. OAuth-clientconfiguratie;
5. API-documentatie voor LVS-schrijfwerking;
6. veld- en rechtenmapping van de school;
7. testplatform of fictieve testaccounts;
8. logging- en bewaartermijnenbeleid.
