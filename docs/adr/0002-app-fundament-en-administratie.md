# ADR-0002 — App-fundament & administratie-structuur (v0.1)

- **Status:** gebouwd (2026-07); vervangt de open beslissing OD-9.
- **Context-scope:** zie ADR-0001. Persoonlijk, lokaal-eerst hulpmiddel voor een
  vakleerkracht 2e graad (Engels & Spaans) met meerdere klasgroepen.
- **Realisatie:** `app/` (buildless web-app).
- **Bronnen:** `research/klasadministratie-vergelijking.md`, `research/prototype-inventaris.json`.

## 1. Context

Het "Klascockpit"-prototype (`prototypes/klascockpit-v4.html`) was een rijk maar
rudimentair single-file-experiment met bekende zwaktes: opslag in `localStorage`,
een "import" die de volledige state **overschreef** (geen echte merge), geen
versionering, en enkele externe diensten (QR via een externe host). ADR-0001 §2.5.24
zette de fundering-saneringen als randvoorwaarde vóór echt klasgebruik. OD-9 vroeg
een verbeterd admin-fundament (v0.5). Deze ADR legt de gekozen architectuur vast en
het **framework-first, config-later**-principe: de structuur staat nu klaar en leeg;
concrete gegevens (rooster, titularis-klas, leerlingen) worden later ingevuld.

## 2. Beslissing

### 2.1 Technische fundering

1. **Buildless web-app.** Vanilla ES-modules, geen build-stap, **geen externe
   afhankelijkheden of CDN's** — voldoet aan de harde grens "geen externe datastroom".
2. **IndexedDB i.p.v. localStorage** via een eigen dunne promise-wrapper
   (`src/db/idb.js`) met een expliciet schema en migratiepad (`src/db/schema.js`).
   Alle stores worden nu al aangelegd (ook voor nog niet gebouwde modules), zodat
   later invullen geen migratie vraagt.
3. **PWA/offline.** Manifest + service worker cachen de app-shell; na de eerste keer
   laden werkt Klaskompas offline en is het installeerbaar. Gegevens zelf worden
   nooit gecachet of verstuurd.
4. **Echte backup.** Volledige JSON-export met versie-informatie; herstel gebeurt als
   **upsert per id** (samenvoegen), met een bewuste "vervangen"-optie.
5. **Echte merge-import.** CSV-import dedupliceert leerlingen op een genormaliseerde
   naamsleutel en klassen op naam binnen het schooljaar; dubbele inschrijvingen
   worden overgeslagen. Herimporteren dupliceert niet (getest).

### 2.2 Datamodel-ruggengraat

6. **`klas → leerling` via `inschrijving`** (ADR-0001 §2.5.21). Een leerling is een
   persoon; een inschrijving koppelt hem aan een klas binnen een schooljaar. Zo kan
   dezelfde leerling later in meerdere klassen/jaren voorkomen zonder duplicatie.
7. **Eén app, één datamodel.** Administratie en klasmanagement delen dezelfde
   entiteiten `schooljaar`, `klas`, `leerling`, `inschrijving`.

### 2.3 Administratie-structuur (leeg, invulbaar)

8. **Klassen & leerlingen** — CSV-import (merge) + handmatig beheer.
9. **Schooljaar & kalender** — schooljaren met vakanties/vrije dagen; "genereer
   schooljaar" = wekelijks rooster × schooljaar − vakanties (voorbeeldberekening aanwezig).
10. **Rooster-editor** — wekelijks terugkerende lesmomenten per klas (weekrooster).
11. **Aanwezigheid** — feitelijke registratie per (klas, datum, leerling), zonder
    scores of interpretatie.

### 2.4 Twee weergaves

12. **Administratie** (rustige modules na de les) en **Lesmodus/Klasscherm** (het
    projecteerbare bord met geldkoker, decibelmeter, lesdrill, reminder), conform
    ADR-0001 §2.5.23. De klaspot-economie en het beloningsmenu (ADR-0003) draaien in
    de Lesmodus.

### 2.5 Grenzen bevestigd

13. Teacher-triggered; geen biometrie/emotiedetectie/risicoscores; geen gedragsscores
    of -labels per leerling; individuele data privaat en feitelijk; privacy-by-design
    (ADR-0001 §2.4). De datastores voor het individuele spoor (observaties, quota)
    staan klaar maar krijgen pas UI in een latere iteratie.

## 3. Gevolgen

**Positief:** een robuust, lokaal, offline-bruikbaar fundament dat de prototype-zwaktes
oplost (echte merge, IndexedDB, backup, geen externe diensten); een schone
modulearchitectuur (views ↔ `repo` ↔ domein) waarop de resterende modules aansluiten;
de structuur staat klaar zodat september-gegevens enkel ingevuld hoeven te worden.

**Aanvaarde beperkingen (v0.1):**
- Rooster wordt nu handmatig ingevuld; de foto-transcriptie (OD-9) volgt later.
- Versleuteling van gevoelige velden en app-lock (OD-5) zijn nog niet gebouwd; tot dan
  geldt: bewaar geen echte, gevoelige leerlinggegevens zonder afstemming met de school (OD-6).
- Zitplan/titularis-klas (OD-7/OD-8) zijn nog niet geïmplementeerd.

## 4. Overwogen alternatieven

- **Prototype uitbreiden.** Afgewezen: het single-file-model met nep-merge en
  localStorage schaalt niet naar de saneringen uit ADR-0001 §2.5.24.
- **Framework + build-stap (bv. Vite/React).** Afgewezen voor nu: voegt toolchain- en
  onderhoudslast toe en botst met "gewoon lokaal openen/serveren"; vanilla ES-modules
  volstaan voor deze schaal en houden alles inspecteerbaar.

## 5. Open punten

Zie het register: OD-5 (versleuteling/app-lock), OD-6 (afstemming school),
OD-7 (zitplan/Klasscherm-mockup), OD-8 (plaatsengenerator). OD-9 wordt door deze ADR
gesloten.
