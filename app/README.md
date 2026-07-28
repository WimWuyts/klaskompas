# Klaskompas — app (v0.1)

Lokaal-eerst web-app voor **klasadministratie** (rustige modus) en **visueel
klasmanagement** (Lesmodus / Klasscherm). Buildless: vanilla ES-modules, geen
afhankelijkheden, geen server nodig, **alle gegevens blijven lokaal** (IndexedDB).
Voldoet aan de harde grenzen uit [ADR-0001](../docs/adr/0001-klaskapitaal-en-visueel-klasmanagement.md):
teacher-triggered, geen biometrie, geen scores per leerling, geen externe datastroom.

## Starten

De app gebruikt ES-modules, IndexedDB en een service worker; die werken niet via
`file://`. Serveer de map dus lokaal (of via GitHub Pages):

```bash
cd app
python3 -m http.server 8000
# open http://127.0.0.1:8000/
```

Eenmaal geladen werkt Klaskompas **offline** en is het als PWA te "installeren".

### Eén-bestandsversie (dubbelklikken)

Voor gebruik zonder server is er een gebundelde versie: **`dist/klaskompas.html`**.
Bewaar dat ene bestand en open het rechtstreeks in de browser (Chrome/Edge aanbevolen).
Alle gegevens blijven lokaal (IndexedDB, per bestandslocatie). Opnieuw bouwen na
wijzigingen:

```bash
npm i -g esbuild        # of: npx esbuild
node app/build-singlefile.mjs
```

De losse `app/` blijft de bron; `dist/klaskompas.html` is een build-artefact.

## Wat werkt nu

- **Fundament** — IndexedDB-datalaag met schema/migraties, echte JSON-backup en
  **echte merge**-import (CSV én backup dedupliceren op leerling/klas i.p.v. te
  overschrijven — de zwakte van het prototype is opgelost).
- **Administratie (structuur, invulbaar)** — klassen & leerlingen (CSV-import),
  schooljaar & kalender (vakanties → "genereer schooljaar"), rooster-editor,
  aanwezigheid per dag.
- **Lesmodus / Klasscherm** — geldkoker (klaskapitaal-economie), decibelmeter
  (enkel live amplitude, neemt niets op), vaste lesdrill, reminder-strip,
  beloningsmenu met uitgeef-mechaniek.
- **Beloningen** — het startmenu uit [het onderzoek](../research/beloningssysteem-onderzoek.md)
  staat als sjabloon klaar; per klas aan te passen.
- **Instellingen** — per-klas configuratie van de klaspot (ADR-0001 §2.1.8) +
  backup/herstel + diagnostiek.

## Architectuur

```
app/
  index.html            app-shell
  manifest.webmanifest  PWA
  sw.js                 service worker (offline app-shell)
  assets/styles.css     design-systeem (licht/donker + podium-thema)
  src/
    main.js             bootstrap + hash-router + layout
    db/     idb.js schema.js repo.js backup.js
    domain/ model.js klaspot.js beloningen.js schooljaar.js
    ui/     components.js
    views/  dashboard klassen schooljaar rooster aanwezigheid beloningen instellingen klasscherm
```

De views praten enkel met `db/repo.js`; domeinlogica (pot, beloningen, kalender)
staat los van de UI. Alles is in het Nederlands en teacher-first.

## Nog te doen (volgende iteraties)

- Rooster per foto → transcriptie (OD-9), titularis-klas + zitplan (OD-7/OD-8).
- Individueel spoor: observaties/quota-UI (datastores staan klaar).
- App-lock/versleuteling van gevoelige velden (OD-5).
