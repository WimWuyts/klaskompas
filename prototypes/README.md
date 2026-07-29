# Prototypes

Werkende, verkennende prototypes. Dit is **geen canon** — het zijn startpunten en
inspiratie om op voort te bouwen. Beslissingen horen in `docs/`.

> **Opgevolgd door `app/`.** Sinds ADR-0002 is er een echte web-app (`app/`) met
> IndexedDB, echte merge-import en een offline-schil. Dit prototype blijft hier als
> historisch startpunt en ideeënbron, maar wordt niet verder ontwikkeld.

## klascockpit-v4.html

Eerste, rudimentaire versie van het **klasadministratiesysteem** (single-file web-app,
werkt lokaal in de browser). Bevat modules voor dashboard, weekoverzicht, klassen &
leerlingen (CSV-import), leerlingfiche, aanwezigheid, afwezigheidslog, observaties &
klasmanagement, evaluaties, puntenboek, communicatie, acties en sync (JSON-export/import).

- Data wordt lokaal bewaard (localStorage); synchroniseren gebeurt via JSON-export/import.
- Geen server, geen echte leerlinggegevens — gebruik fictieve testnamen.
- Dient als vertrekpunt voor het verdere ontwerp van klasadministratie én het
  (nog te ontwerpen) visuele klasmanagement.

Open het bestand rechtstreeks in een browser om het te bekijken.
