# Systeemscope v0.2

**Status:** afgeleid van goedgekeurde Scope Lock Phase 1A  
**Datum:** 22 juli 2026

## Gedeelde kern

- schooljaar;
- vak;
- klas, groep of lesopdracht;
- leerling;
- inschrijving van leerling in klas/groep;
- lesmoment;
- leerkrachtgebruiker;
- externe systeemidentiteit en synchronisatiestatus.

## Module A — Vandaag

Toont per geselecteerde klas:

- afwezige of te late leerlingen;
- open inhaaltoetsen;
- open gedragsopvolging;
- acties met een vervaldatum;
- relevante lesnotities;
- niet-gesynchroniseerde of mislukte mutaties.

## Module B — Aanwezigheid

Ondersteunt minimaal:

- aanwezig;
- afwezig;
- te laat;
- gedeeltelijk aanwezig;
- onbekend/nog te bevestigen;
- correctie achteraf met auditreden.

De officiële schoolregistratie blijft leidend. Smartschool-rostergegevens kunnen worden ingelezen, maar automatische aanwezigheidssynchronisatie wordt pas toegevoegd wanneer een officiële en toegestane endpoint is bevestigd.

## Module C — Evaluaties en inhaalwerk

Een evaluatie kan aan een klas en datum worden gekoppeld. Afwezigheid kan een inhaalverplichting creëren, maar uitzonderingen blijven mogelijk.

Kernstatussen:

- `not_required`;
- `required_unscheduled`;
- `scheduled`;
- `completed`;
- `graded`;
- `closed`;
- `exempted`.

## Module D — Gedrag

Registreert pas vanaf het afgesproken formele niveau. Een gebeurtenis bevat:

- observeerbaar gedrag;
- betrokken verwachting;
- interventiestap;
- gevolg;
- reactie of herstel;
- eventuele opvolging;
- externe publicatiestatus.

Een eventuele publicatie naar het Smartschool-Leerlingvolgsysteem vereist een officiële endpoint, correcte veldmapping, preview en expliciete leerkrachtbevestiging.

## Module E — Opvolgacties

Een actie kan ontstaan uit aanwezigheid, evaluatie, gedrag of een manuele notitie. Iedere actie heeft eigenaar, status, vervaldatum en bron.

## Module F — Historiek en audit

Statuswijzigingen bewaren minimaal:

- vorige en nieuwe waarde;
- tijdstip;
- handelende gebruiker;
- optionele of verplichte reden volgens actie;
- broncontext;
- synchronisatie- of publicatieresultaat;
- externe recordidentifier wanneer beschikbaar.

## Module G — Smartschool-integratie

### Roster

- officiële OneRoster 1.1-client;
- schools, classes, users, students, teachers, enrollments en academic sessions;
- configureerbare Smartschool-databron;
- idempotente synchronisatie;
- eigen UUID plus externe `sourcedId`;
- geen matching uitsluitend op naam.

### Authenticatie

- officiële OAuth2-flow;
- minimaal `userinfo`;
- `groupinfo` alleen wanneer functioneel nodig;
- server-side token- en secretbeheer.

### Leerlingvolgsysteem

- officiële LVS-schrijfwerking is gewenst maar conditioneel;
- geen scraping, browserextensie, headless browser of wachtwoordopslag;
- connectorcontract wordt voorbereid zonder fictieve endpoint te implementeren.

## Grens met officiële systemen

KlasKompas is een persoonlijk operationeel hulpmiddel. Officiële aanwezigheid, formele sancties en leerlingdossiers blijven in het door de school aangewezen systeem geregistreerd. KlasKompas vermindert dubbele invoer via officiële integraties waar die beschikbaar, toegestaan en auditbaar zijn.

## Buiten scope eerste septemberversie

- volledig puntenboek;
- rapportberekeningen;
- ouder- of leerlingportaal;
- gedeeld dossier voor collega’s;
- medische of uitgebreide zorginformatie;
- AI-risicoscores;
- automatische sancties;
- onofficiële Smartschoolautomatisering.
