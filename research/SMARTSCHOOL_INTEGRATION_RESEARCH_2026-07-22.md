# Smartschool Integration Research

**Onderzoeksdatum:** 22 juli 2026  
**Doel:** bepalen hoe KlasKompas officieel kan synchroniseren met Smartschool en dubbele invoer in het Leerlingvolgsysteem kan beperken.

## 1. Hoofdconclusie

De officiële Smartschool-integratiemogelijkheden zijn bruikbaar voor:

- OAuth2-aanmelding;
- profielinformatie;
- groep- en klaslidmaatschap;
- OneRoster 1.1-rostersynchronisatie;
- berichten en meldingen;
- Planner-integraties;
- resultaten naar Skore.

De publieke documentatie toont op de onderzoeksdatum geen algemene API-endpoint om klasnotities of dossierlijnen in het Smartschool-Leerlingvolgsysteem aan te maken.

Smartschool vermeldt dat scopes op maat mogelijk kunnen zijn na contact. Rechtstreeks schrijven naar het LVS moet daarom als formele API-vraag aan Smartschool en de schoolbeheerder worden voorgelegd.

## 2. Officiële bronnen

### Smartschool Developers

https://www.smartschool.be/developers/

Bruikbaar voor het overzicht van officiële integratiemogelijkheden en de officiële PHP-voorbeeldapp met OAuth.

### Smartschool OAuth

https://www.smartschool.be/oauth/

Gedocumenteerde scopes:

- `userinfo`;
- `fulluserinfo`;
- `groupinfo`;
- `sendmessage`;
- `sendnotif`;
- `exerciseresults`.

De documentatie vermeldt dat scopes op maat besproken kunnen worden.

### Smartschool OneRoster

https://www.smartschool.be/oneroster/

Smartschool ondersteunt OneRoster 1.1 als read-only dataprovider. De school kan een client aanmaken en kiezen uit databronnen zoals Skore-lesopdrachten, vaklidmaatschappen en geselecteerde groepen.

Beschikbare kernobjecten omvatten scholen, klassen, gebruikers, leerlingen, leerkrachten, inschrijvingen en academische sessies.

### Resultservice

https://www.smartschool.be/oauth/documentatie-resultaten-service-oauth/

Bruikbaar voor het patroon van een officiële client-credentials-integratie, idempotente externe UUID's en auditbare terugkoppeling. Deze API is uitsluitend bedoeld voor resultaten en niet voor LVS-dossierlijnen.

## 3. Smartschool-specifieke GitHub-repositories

### 3.1 `johancoppens/smartschool-client`

https://github.com/johancoppens/smartschool-client

**Type:** onofficiële Node.js-wrapper rond een subset van de Smartschool SOAP Webservices V3.

**Bruikbaar voor:**

- gebruikers en groepen ophalen;
- klassenstructuren begrijpen;
- SOAP-foutafhandeling;
- data normaliseren en transformeren;
- voorbeeld van een configureerbare API-adapter.

**Beperkingen:**

- documentatie noemt Node.js v8;
- slechts een subset van de SOAP-API;
- focus op gebruikers en groepen, niet op het Leerlingvolgsysteem;
- legacyreferentie, geen productiebasis.

**Besluit:** gerichte code- en contractaudit; niet rechtstreeks als dependency gebruiken.

### 3.2 `johancoppens/smartschool2gsheet`

https://github.com/johancoppens/smartschool2gsheet

**Type:** synchronisatiescript van Smartschool-masterdata naar Google Sheets.

**Bruikbaar voor:**

- geplande synchronisatie via cron;
- scheiding tussen bronextractie en doeladapter;
- omgaan met serviceaccountcredentials;
- periodieke masterdata-refresh.

**Beperkingen:**

- Google Sheets is geen geschikte opslaglaag voor KlasKompas-productiedata;
- gebruikt de legacy SOAP-wrapper;
- geen delta- of conflictmodel.

**Besluit:** alleen patroonreferentie voor synchronisatietaken.

### 3.3 `svaningelgem/smartschool`

https://github.com/svaningelgem/smartschool

**Type:** actieve, onofficiële Python-parser voor toegang tot de Smartschool-webinterface.

**Bruikbaar voor onderzoek:**

- inzicht in foutafhandeling en typeveilige domeinobjecten;
- tests rond wijzigende webpagina's;
- overzicht van niet-officiële leesmogelijkheden.

**Onacceptabel voor productie-integratie:**

- gebruikt gebruikersnaam, wachtwoord en eventueel MFA-secret;
- parseert de webinterface in plaats van een officieel contract;
- kan breken bij interfacewijzigingen;
- GPLv3 kan architecturale gevolgen hebben bij codehergebruik;
- ondersteunt geen officieel LVS-schrijfcontract.

**Besluit:** negatieve en diagnostische referentie; geen dependency en geen architectuurgrondslag.

### 3.4 `martymcvry/smartschool-api`

https://github.com/martymcvry/smartschool-api

**Type:** kleine PHP-wrapper rond Smartschool-API-functionaliteit.

**Bruikbaar voor:**

- vergelijking van SOAP-aanroepen;
- historische API-methoden en foutcodes.

**Beperkingen:**

- zeer beperkte README;
- kleine, oude codebasis;
- geen aangetoonde moderne OAuth- of OneRosterarchitectuur;
- geen LVS-functionaliteit.

**Besluit:** lage prioriteit, alleen historische referentie.

### 3.5 `EbbDrop/SmarterSmartchool`

https://github.com/EbbDrop/SmarterSmartchool

**Type:** browserextensie die de Smartschoolinterface wijzigt.

**Bruikbaar voor:** uitsluitend negatieve referentie over de kwetsbaarheid van DOM-afhankelijke browserintegraties.

**Besluit:** expliciet niet gebruiken voor gegevensintegratie of automatische formulierinvoer.

## 4. Standaard- en toolingrepositories

### 4.1 `openapi-ts/openapi-typescript`

https://github.com/openapi-ts/openapi-typescript

**Doel:** TypeScript-types genereren uit de officiële OneRoster/OpenAPI-specificatie van Smartschool.

**Advies:** bruikbaar voor statische typen. Runtimevalidatie moet afzonderlijk worden toegevoegd.

### 4.2 `panva/oauth4webapi`

https://github.com/panva/oauth4webapi

**Doel:** standaardenconforme OAuth2 authorization-code- en tokenafhandeling in JavaScript/TypeScript.

**Advies:** sterke kandidaat wanneer de gekozen backend JavaScript/TypeScript gebruikt. Smartschool is OAuth2 Identity Provider, maar de exacte metadata en afwijkingen moeten met de officiële voorbeeldapp worden getest.

### 4.3 `vossenv/oneroster-python`

https://github.com/vossenv/oneroster-python

**Doel:** referentie voor een OneRoster 1.1-client met client-credentialsauthenticatie en gebruikersopvraging.

**Advies:** alleen gebruiken wanneer Python de backendstack wordt. Anders dient het als contract- en testreferentie.

### 4.4 `gotranseo/oneroster`

https://github.com/gotranseo/oneroster

**Doel:** Swift/Vapor-client voor OneRoster 1.1 met OAuth1- en OAuth2-ondersteuning.

**Advies:** geen stackkandidaat voor KlasKompas, maar nuttig voor testgevallen en endpointsemantiek.

### 4.5 `lepo-project/roster-hub`

https://github.com/lepo-project/roster-hub

**Doel:** OneRoster 1.1-rosterbeheer en CSV/API-conversie.

**Advies:** bruikbaar als testserver- en fixturesreferentie; niet nodig als productiecomponent.

### 4.6 `Ed-Fi-Alliance-OSS/edfi-oneroster`

https://github.com/Ed-Fi-Alliance-OSS/edfi-oneroster

**Doel:** actuele OneRoster-serverimplementatie en conformance-/testpatronen.

**Beperking:** gericht op OneRoster 1.2 terwijl Smartschool 1.1 aanbiedt.

**Advies:** gebruiken voor beveiligings-, paginatie- en contracttestideeën, niet als directe client.

## 5. Aanbevolen technische route

### Route A — officieel en noodzakelijk

1. Schoolbeheerder maakt een Smartschool OneRoster-client aan.
2. KlasKompas verkrijgt client-id, client-secret, token-url en base-url via een beveiligd secretkanaal.
3. Een server-side synchronisatiejob haalt alleen de benodigde klassen, leerlingen, leerkrachten en enrollments op.
4. De app bewaart eigen UUID's plus externe Smartschool-identifiers.
5. Wijzigingen worden idempotent verwerkt en auditbaar gelogd.

### Route B — Smartschool-login

1. OAuth-client aanvragen bij Smartschool.
2. Authorization-code flow met `state`, refresh-tokenrotatie en server-side secretopslag.
3. Minimaal `userinfo`; alleen aanvullende scopes wanneer aantoonbaar nodig.

### Route C — LVS-schrijfwerking

1. Smartschool schriftelijk vragen of een officiële endpoint of maatwerkscope bestaat voor:
   - klasnotities;
   - dossierlijnen;
   - schoolconfigureerbare LVS-velden;
   - bronreferentie of externe UUID;
   - update, intrekking en foutcorrectie.
2. De schoolbeheerder laat de precieze LVS-structuur en rechten vastleggen.
3. Alleen na positieve bevestiging een productieconnector bouwen.
4. Iedere publicatie vereist een expliciete preview en leerkrachtbevestiging.

## 6. Vragen aan Smartschool

1. Bestaat er een officiële API om een dossierlijn of klasnotitie aan te maken?
2. Kan hiervoor een maatwerkscope of partnerendpoint worden voorzien?
3. Kan een externe stabiele UUID worden meegestuurd om dubbels te vermijden?
4. Kunnen records achteraf worden bijgewerkt of ingetrokken?
5. Hoe worden schoolconfigureerbare dossierlijnvelden en keuzelijsten opgehaald?
6. Welke rechten van de aangemelde leerkracht worden afgedwongen?
7. Is een testplatform of sandbox beschikbaar?
8. Welke logging, rate limits en bewaartermijnen gelden?
9. Is OneRoster de aanbevolen route voor een interne toepassing van één school?
10. Kan de OAuth-client worden beperkt tot uitsluitend het Smartschoolplatform van de school?

## 7. Definitief researchadvies

- **Bouwen op:** officiële Smartschool OneRoster 1.1 en OAuth2.
- **Gericht auditen:** `johancoppens/smartschool-client`, `smartschool2gsheet`, `openapi-typescript`, `oauth4webapi`.
- **Alleen negatieve referentie:** webscrapers, parsers en browserextensies.
- **Niet beloven vóór bevestiging:** automatische publicatie naar het Smartschool-Leerlingvolgsysteem.
