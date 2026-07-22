# Scope Lock — Fase 1A v1.0

**Status:** goedgekeurd door projecteigenaar op 22 juli 2026  
**Project:** KlasKompas  
**Doel:** product- en gebruikersscope vastleggen vóór productiecode

## 1. Projectnaam

`KlasKompas` blijft de officiële interne projectnaam. Een eventuele latere publieke productnaam blokkeert de bouw niet.

## 2. Primaire gebruiker

Versie 1 wordt gebouwd voor één leerkracht: de projecteigenaar.

Niet voorzien in versie 1:

- leerlingaccounts;
- ouderaccounts;
- accounts voor collega’s;
- een gedeeld leerlingdossier tussen leerkrachten.

De architectuur bewaart wel een `teacher_id`, zodat latere uitbreiding naar meerdere strikt gescheiden leerkrachtaccounts mogelijk blijft.

## 3. Doelapparaten

KlasKompas wordt een responsieve webapp/PWA met deze prioriteit:

1. laptop als hoofdscherm;
2. tablet als volwaardig klasscherm;
3. telefoon voor snelle registratie en controle.

Er komt in versie 1 geen afzonderlijke Windows-, Android- of iOS-app.

## 4. Primaire werkstromen

### A. Les en aanwezigheid

```text
Klas openen
→ lesmoment starten
→ aanwezigen controleren
→ afwijkingen aanduiden
→ lesmoment bewaren
```

Iedere leerling staat aanvankelijk op aanwezig. De leerkracht duidt alleen afwijkingen aan.

### B. Gemiste evaluatie en inhaaltoets

```text
Evaluatie aanmaken
→ afwezige leerlingen detecteren
→ inhaaltoets bevestigen of uitzondering registreren
→ datum plannen
→ afgelegd
→ gecorrigeerd
→ afgesloten
```

Het systeem mag een inhaalverplichting voorstellen, maar de leerkracht bevestigt de beslissing.

### C. Gedragsregistratie

```text
Klas openen
→ leerling selecteren
→ observeerbaar gedrag kiezen
→ reactiestap bekijken
→ formele gebeurtenis registreren
→ eventueel gevolg of opvolging aanmaken
```

Stille signalen en gewone herinneringen worden niet geregistreerd. Registratie begint pas vanaf het formeel afgesproken niveau.

### D. Open opvolging

```text
Dashboard openen
→ open acties zien
→ actie uitvoeren
→ status aanpassen
→ afsluiten met historiek
```

Een actie kan ontstaan uit aanwezigheid, een evaluatie, gedrag of een manuele notitie.

## 5. Ondersteunende schermen

Versie 1 bevat:

- Vandaag-dashboard;
- klassenoverzicht;
- leerlingoverzicht;
- eenvoudige historiek;
- klasinstellingen;
- import en synchronisatie van leerlingen;
- beheer van fictieve ontwikkeldata.

## 6. Expliciet uitgesteld

Niet voorzien in de eerste septemberversie:

- volledig puntenboek;
- rapportberekeningen;
- remediëring op basis van cijfers;
- ouder- of leerlingcommunicatie;
- automatische e-mails;
- gedeeld gebruik met collega’s;
- uitgebreide klassenraadrapporten;
- AI-analyse;
- automatische gedragsscores;
- automatische sancties;
- medische of uitgebreide zorginformatie.

## 7. Smartschool-integratie

Smartschool blijft het officiële schoolsysteem en KlasKompas wordt geen vervanging van het Leerlingvolgsysteem.

### 7.1 Verplichte integratiedoelen

KlasKompas moet, mits schooltoestemming en beschikbare credentials:

- klassen, leerlingen, leerkrachten en inschrijvingen uit Smartschool synchroniseren via de officiële OneRoster 1.1-interface;
- Smartschool-identifiers bewaren als externe sleutels, zonder ze als eigen primaire sleutels te gebruiken;
- optioneel aanmelden met Smartschool ondersteunen via de officiële OAuth2-flow;
- dubbele invoer van namen, klassen en groepslidmaatschap vermijden;
- synchronisatieverschillen auditbaar en herstelbaar afhandelen.

### 7.2 Gedrag en Leerlingvolgsysteem

Het gewenste einddoel is dat een door de leerkracht bevestigde gedrags- of klasmanagementregistratie vanuit KlasKompas kan worden toegevoegd aan de correcte Smartschool-LVS-structuur, zodat dezelfde tekst niet opnieuw hoeft te worden getypt of gekopieerd.

De publiek gedocumenteerde Smartschool-API bevat op 22 juli 2026 geen algemene endpoint voor het aanmaken van klasnotities of dossierlijnen. Deze functie is daarom **conditioneel geblokkeerd** tot Smartschool en de school bevestigen dat een officiële API, partnerscope of maatwerkendpoint beschikbaar en toegestaan is.

Tot die bevestiging gelden deze grenzen:

- geen browserextensie of schermscraper om dossierlijnen te schrijven;
- geen opslag van het persoonlijke Smartschoolwachtwoord in KlasKompas;
- geen simulatie van gebruikersklikken;
- geen verborgen of onbevestigde automatische doorsturing;
- geen belofte dat LVS-schrijfwerking in de september-MVP zit.

De software krijgt wel vanaf het begin een verwisselbare `SmartschoolConnector`-grens, zodat een officiële schrijfendpoint later zonder herbouw van het gedragsdomein kan worden toegevoegd.

## 8. Verbindingsverlies

Versie 1 wordt geen volledig offline-first systeem. De app moet wel tijdelijke verbindingsproblemen veilig opvangen:

- geopende klasgegevens blijven bruikbaar zolang dit veilig kan;
- nog niet verzonden mutaties worden versleuteld en tijdelijk lokaal in een wachtrij geplaatst;
- de interface toont ondubbelzinnig of een mutatie lokaal, gesynchroniseerd of mislukt is;
- de app probeert gecontroleerd opnieuw te synchroniseren;
- conflicten worden niet stil overschreven.

## 9. MVP-succescriteria

De septemberversie is functioneel geslaagd wanneer de leerkracht:

1. klassen en leerlingen zonder herhaald manueel overtypen kan inladen;
2. een klas kan openen;
3. aanwezigheid snel kan controleren;
4. een evaluatie kan aanmaken;
5. onmiddellijk ziet wie ze gemist heeft;
6. iedere inhaaltoets tot afsluiting kan opvolgen;
7. een formele gedragsgebeurtenis in enkele handelingen kan registreren;
8. de afgesproken reactiestap kan zien;
9. open acties op één scherm kan terugvinden;
10. per leerling een feitelijk overzicht kan raadplegen;
11. fouten kan corrigeren zonder de historiek te wissen.

## 10. Blokkerende vervolgbeslissingen

Voor de Smartschool-integratie moeten nog worden bevestigd:

- toestemming en medewerking van de Smartschoolbeheerder van de school;
- OneRoster-client, databron en credentials;
- OAuth-client en toegestane scopes;
- bestaan en voorwaarden van een officiële LVS-schrijfendpoint of maatwerkscope;
- exacte mapping naar de door de school ingerichte klasnotities, dossierlijnen, velden en rechten;
- juridische rollen, gegevenslocatie en bewaartermijnen.
