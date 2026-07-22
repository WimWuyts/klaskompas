# Fase 1B — Schoolbeleid, bevoegdheden en Smartschooltoegang

**Status:** intake — nog niet goedgekeurd  
**Doel:** alle schoolafhankelijke grenzen vastleggen vóór de gedragsworkflow, Smartschoolproductie-integratie en verwerking van echte leerlinggegevens.

## Uitgangspunt

KlasKompas mag de leerkracht helpen om consequent te handelen, maar mag geen bevoegdheden, sancties of officiële registraties verzinnen die niet door de school zijn toegestaan.

Tot dit document is ingevuld en goedgekeurd, gelden veilige voorlopige grenzen:

- Smartschoolkoppeling is read-only voor rosterdata;
- gedragspublicatie naar het LVS is uitgeschakeld;
- KlasKompas legt geen officiële sanctie op;
- formele schoolprocedures worden alleen als externe opvolgactie getoond;
- alleen fictieve ontwikkeldata worden gebruikt.

---

# Checkpoint 1B.1 — Schoolbeleid en eigen bevoegdheid

## Benodigde bronnen

Verzamel waar beschikbaar:

- actueel schoolreglement;
- leefregels of klasafspraken;
- gsm- en laptopbeleid;
- sanctie- of ordeprocedure;
- procedure voor verwijdering uit de les;
- afspraken rond te laat komen en afwezigheden;
- procedure voor agressie, bedreiging, discriminatie en schade;
- afspraken rond oudercontact;
- handleiding of interne afspraken voor Smartschool-LVS/klasnotities;
- eventuele afspraken van vakgroep, graadteam of leerlingenbegeleiding.

## Bevoegdheidsmatrix

Voor elk onderwerp moet worden vastgelegd:

| Onderwerp | Wat mag de leerkracht zelfstandig? | Wat vereist melding? | Wat vereist goedkeuring/beslissing door anderen? | Officiële registratieplaats | Bron |
|---|---|---|---|---|---|
| Te laat komen |  |  |  |  |  |
| Afwezigheid |  |  |  |  |  |
| Materiaal niet bij |  |  |  |  |  |
| Gsmgebruik |  |  |  |  |  |
| Laptopmisbruik |  |  |  |  |  |
| Plaatswissel |  |  |  |  |  |
| Tijdelijk individueel werken |  |  |  |  |  |
| Gesprek na de les |  |  |  |  |  |
| Inhaal- of herstelactie |  |  |  |  |  |
| Formele waarschuwing |  |  |  |  |  |
| Strafstudie/nablijven |  |  |  |  |  |
| Verwijdering uit de les |  |  |  |  |  |
| Oudercontact |  |  |  |  |  |
| Agressie/bedreiging |  |  |  |  |  |
| Discriminatie |  |  |  |  |  |
| Schade/herstel |  |  |  |  |  |

## Beslisregels

Voor iedere maatregel wordt één status gekozen:

- `teacher_autonomous` — leerkracht mag zelfstandig beslissen en uitvoeren;
- `teacher_with_notification` — leerkracht beslist, maar moet melden;
- `school_approval_required` — leerkracht registreert en vraagt beslissing;
- `emergency_procedure` — onmiddellijk veiligheidsprotocol;
- `not_permitted` — niet gebruiken in KlasKompas.

---

# Checkpoint 1B.2 — Smartschool en Leerlingvolgsysteem

## Technische en organisatorische contactpunten

Vast te leggen:

- naam/functie van Smartschoolbeheerder;
- naam/functie van privacy- of ICT-verantwoordelijke;
- wie OneRoster-clients mag aanmaken;
- wie OAuth-clients/scopes mag aanvragen;
- wie de LVS-structuur en velden beheert;
- wie toestemming geeft voor een externe applicatie;
- of een testplatform of fictieve testaccounts bestaan.

## Huidige LVS-werkwijze

Te documenteren:

1. Welke onderdelen gebruikt de school?
   - klasnotities;
   - dossierlijnen;
   - meldingen;
   - sancties;
   - opvolgacties;
   - andere.
2. Welke velden zijn verplicht?
3. Welke categorieën/keuzelijsten bestaan?
4. Wie kan records lezen?
5. Wie kan records aanmaken, wijzigen of verwijderen?
6. Welke informatie mag nooit in een klasnotitie?
7. Is een record zichtbaar voor leerling of ouders?
8. Wordt oudercontact of leerlingenbegeleiding automatisch verwittigd?
9. Kunnen registraties worden gecorrigeerd of ingetrokken?
10. Bestaat een officiële API of maatwerkroute voor schrijven?

## Integratiemodi

De uiteindelijke modus wordt expliciet gekozen:

- `roster_only` — alleen klassen en leerlingen synchroniseren;
- `roster_plus_login` — roster + Smartschool OAuth;
- `draft_export` — KlasKompas maakt een gecontroleerde tekst/gegevenspreview voor manuele overname;
- `official_lvs_write` — officiële API schrijft na expliciete bevestiging;
- `disabled` — geen Smartschoolintegratie.

Browserautomatisering, scraping en credential-reuse zijn geen toegelaten modus.

---

# Checkpoint 1B.3 — Privacy, verantwoordelijkheid en ingebruikname

## Te bevestigen door de school

- wie verwerkingsverantwoordelijke is;
- of KlasKompas als schooltoepassing mag worden gebruikt;
- welke hostinglocaties en leveranciers zijn toegestaan;
- of een verwerkersovereenkomst nodig is;
- of een gegevensbeschermingseffectbeoordeling nodig is;
- welke categorieën persoonsgegevens mogen worden opgeslagen;
- welke bewaartermijnen gelden;
- wie toegang mag hebben;
- hoe inzage, correctie en verwijdering verlopen;
- hoe incidenten en datalekken moeten worden gemeld;
- of lokale tijdelijke opslag op laptop/tablet/telefoon is toegestaan.

## Gegevenscategorieën per voorlopige status

| Gegevenscategorie | Voorlopig toegestaan in ontwikkeling | Toegestaan in productie zonder schoolbevestiging |
|---|---:|---:|
| Fictieve leerlingen | Ja | N.v.t. |
| Namen en klaslidmaatschap | Alleen fictief | Nee |
| Aanwezigheidsregistraties | Alleen fictief | Nee |
| Inhaaltoetsstatus | Alleen fictief | Nee |
| Observeerbare gedragsregistraties | Alleen fictief | Nee |
| Sancties/formele schoolmaatregelen | Alleen fictief | Nee |
| Zorg- of medische gegevens | Nee | Nee |
| Religie, etniciteit, gezondheid, biometrie | Nee | Nee |

---

# Oplevering Fase 1B

Fase 1B is pas klaar wanneer er vier goedgekeurde opleveringen zijn:

1. `SCHOOL_POLICY_ALIGNMENT_REGISTER_v1.0.md`;
2. `TEACHER_AUTHORITY_MATRIX_v1.0.md`;
3. `SMARTSCHOOL_ACCESS_AND_LVS_MAPPING_v1.0.md`;
4. `DATA_GOVERNANCE_APPROVAL_GATE_v1.0.md`.

## Blokkades na Fase 1B

- Zonder schoolbeleid: geen definitieve sanctie- of escalatieladder.
- Zonder Smartschoolbeheerder: alleen CSV/fictieve rosterimport.
- Zonder officiële LVS-write-API: geen automatische LVS-publicatie.
- Zonder privacygoedkeuring: geen echte leerlinggegevens in productie.
