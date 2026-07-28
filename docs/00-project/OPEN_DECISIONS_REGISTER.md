# Open Decisions Register

Register van beslissingen die nog open zijn, aannames bevatten of bevestiging vragen.
Gesloten beslissingen verhuizen naar een ADR in `docs/adr/`.

Status: `open` · `beslist` (met ADR-verwijzing) · `bijstelbaar` (beslist, maar bewust
instelbaar/herzienbaar).

| # | Onderwerp | Status | Toelichting |
|---|-----------|--------|-------------|
| OD-1 | Klaskapitaal-economie & visueel klasmanagement | beslist → [ADR-0001](../adr/0001-klaskapitaal-en-visueel-klasmanagement.md) | Kernontwerp goedgekeurd door projecteigenaar. |
| OD-2 | Voorwaarden waaronder individueel gedrag de klaspot mag doen dalen (optie C) | open | Default: uit. C alleen als expliciet, vooraf gedefinieerd per klas. Concrete voorwaarden nog te bepalen. |
| OD-3 | Exact gedrag decibelmeter → klaspot | beslist → [ADR-0001 §2.3](../adr/0001-klaskapitaal-en-visueel-klasmanagement.md) | Stilte laat altijd verdienen. "Te luid" = objectief ingesteld niveau; aanhoudend daarboven (na waarschuwing) zakt de pot geleidelijk, met bodem, herstelbaar. Modus per klas: bevestigen-per-keer of objectieve drift. De meterbeweging brengt nooit automatisch een gevolg voor leerlingen teweer — herstart en collectief gevolg blijven teacher-triggered. |
| OD-4 | Framing van het collectieve gevolg bij mislukte herstart-uitdaging | bijstelbaar | Default: terugvallen op individueel werk + korte controle op het einde (leerwaarde), teacher-triggered. Zwaarte per klas instelbaar. |
| OD-5 | Fundering-saneringen prototype (opslag, privacy, import) | deels beslist → [ADR-0002](../adr/0002-app-fundament-en-administratie.md) | **Gedaan:** IndexedDB, PWA/offline, echte JSON-backup, echte merge-import, geen externe datastroom. **Nog open:** versleuteling van gevoelige velden + app-lock. Zie `research/klasadministratie-vergelijking.md`. |
| OD-6 | Afstemming met schoolreglement/DPO/ICT-coördinator | open | Persoonlijk hulpmiddel onder schoolgezag; vervangt geen officieel systeem of sanctieprocedure. Af te stemmen door de projecteigenaar met de school. |
| OD-7 | Visuele mockup van het "Klasscherm" (lesmodus) | deels beslist → [ADR-0002](../adr/0002-app-fundament-en-administratie.md) | Het Klasscherm is gebouwd (geldkoker, decibelmeter, lesdrill, reminder, beloningsmenu) in `app/`. Nog te valideren in de praktijk; zitplan-weergave (OD-8) volgt. |
| OD-8 | Plaatsengenerator met randvoorwaarden (zitplan) | open | Voor de klas waar de leerkracht klastitularis is (welke klas: nog te bepalen). Leerkracht vult de eerste keer zelf de leerlingen in; daarna wijst het lot plaatsen toe, met "slotjes"/randvoorwaarden (bv. niet naast X, vast vooraan, vast achteraan). Hoort bij het Klasscherm/zitplan (OD-7). |
| OD-9 | Bouw admin-fundament (v0.5) | beslist → [ADR-0002](../adr/0002-app-fundament-en-administratie.md) | Gebouwd in `app/`: IndexedDB, enrollment-datamodel, CSV merge-import, kalender + "genereer schooljaar", rooster-editor, aanwezigheid. Rooster-per-foto (transcriptie) volgt in een latere iteratie. |
| OD-10 | Beloningsmenu & uitgeef-mechaniek | beslist → [ADR-0003](../adr/0003-beloningsmenu-en-uitgeefmechaniek.md) | Gecategoriseerd menu (voorrechten, ervaringen, talen, snoep, klasmoment) + getrapt menu met vaste prijzen, klasstem en reset; startmenu als sjabloon gebouwd. Prijs-ijking per klas blijft bijstelbaar. |
| — | **Ontwerpprincipe: framework-first, config-later** | vastgelegd | Bouw het volledige framework nu **generiek en leeg**. Concrete info komt pas in **september** en wordt dan enkel ingevuld: (a) rooster via foto → transcriptie, (b) titularis-klas + leerlingen, (c) zitplan-randvoorwaarden (OD-8). De app mag geen september-specifieke data hardcoderen; alles via invoer/import. |
