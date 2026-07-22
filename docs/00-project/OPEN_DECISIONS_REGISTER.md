# Open Decisions Register

| ID | Beslissing | Status | Nodig vóór |
|---|---|---|---|
| OD-001 | Interne projectnaam blijft `KlasKompas`; publieke naam mag later wijzigen | Locked — Phase 1A | Publieke vormgeving |
| OD-002 | Technologiestack voor webapp/PWA en backend | Open | Productiecode |
| OD-003 | Hosting en gegevenslocatie | Open | Productiedata |
| OD-004 | Versie 1 heeft één leerkrachtgebruiker; technisch authenticatiemodel en latere accountisolatie nog kiezen | Partially locked | Backendbouw |
| OD-005 | Smartschool OneRoster 1.1 wordt voorkeursbron voor klassen en leerlingen; CSV blijft ontwikkel- en noodfallback | Partially locked | Import- en synchronisatiefunctie |
| OD-006 | Smartschool blijft officieel systeem; KlasKompas synchroniseert rosterdata en streeft naar officiële LVS-schrijfwerking | Partially locked | Attendance- en gedragsproductie |
| OD-007 | Exact schoolbeleid en bevoegdheden rond sancties | Open | Gedragsworkflow |
| OD-008 | Bewaartermijnen voor aanwezigheid, gedrag, synchronisatielogs en opvolgacties | Open | Productiedata |
| OD-009 | Geen volledig offline-first systeem; wel veilige lokale wachtrij en zichtbare synchronisatiestatus | Locked — Phase 1A | Stackkeuze |
| OD-010 | Definitieve status- en termijnregels voor inhaaltoetsen | Open | Inhaalmodule |
| OD-011 | Nodige exports voor klassenraad, oudercontact of persoonlijke voorbereiding | Open | Rapportage |
| OD-012 | Schoolgoedkeuring, privacyrollen en mogelijke gegevensbeschermingseffectbeoordeling | Open | Ingebruikname |
| OD-013 | Bestaat er een officiële Smartschool-endpoint of maatwerkscope voor het schrijven van LVS-dossierlijnen of klasnotities? | Blocked — external confirmation | LVS-integratie |
| OD-014 | Mapping van KlasKompas-gedragscategorieën naar de schoolconfigureerbare Smartschool-LVS-structuur en rechten | Blocked — OD-007/OD-013 | LVS-integratie |
| OD-015 | Smartschoolbeheerder levert OneRoster-client, databronkeuze, credentials en testtoegang | Open — school action | Roster sync |
| OD-016 | Smartschool OAuth-client, redirect-URI’s en minimaal toegestane scopes | Open — Smartschool request | Smartschool login |
| OD-017 | Beleid voor conflicten, uitgeschakelde accounts en leerlingen die tijdelijk uit OneRoster verdwijnen | Open | Roster sync productie |

## Bindende verwijzingen

- `SCOPE_LOCK_PHASE_1A_v1.0.md`
- `../04-architecture/SMARTSCHOOL_INTEGRATION_BOUNDARY_v0.1.md`
- `../../research/SMARTSCHOOL_INTEGRATION_RESEARCH_2026-07-22.md`
