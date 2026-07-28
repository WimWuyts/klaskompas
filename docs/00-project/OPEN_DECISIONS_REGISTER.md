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
| OD-5 | Fundering-saneringen prototype (opslag, privacy, import) | open | Randvoorwaarde vóór echt klasgebruik; zie `research/klasadministratie-vergelijking.md`. Nog te plannen als bouwtaken. |
| OD-6 | Afstemming met schoolreglement/DPO/ICT-coördinator | open | Persoonlijk hulpmiddel onder schoolgezag; vervangt geen officieel systeem of sanctieprocedure. Af te stemmen door de projecteigenaar met de school. |
| OD-7 | Visuele mockup van het "Klasscherm" (lesmodus) | open | Voorgesteld als volgende stap; nog te bouwen en te valideren. |
| OD-8 | Plaatsengenerator met randvoorwaarden (zitplan) | open | Voor de klas waar de leerkracht klastitularis is (welke klas: nog te bepalen). Leerkracht vult de eerste keer zelf de leerlingen in; daarna wijst het lot plaatsen toe, met "slotjes"/randvoorwaarden (bv. niet naast X, vast vooraan, vast achteraan). Hoort bij het Klasscherm/zitplan (OD-7). |
| OD-9 | Bouw admin-fundament (v0.5) | gepland | Verbeterde versie van het prototype met kalender + rooster-editor + "genereer schooljaar", enrollment-datamodel, CSV-import (merge), aanwezigheid per lesuur, IndexedDB. Rooster wordt door de leerkracht per foto aangeleverd (Claude transcribeert; geen in-browser OCR). Bouwen gepland voor de volgende sessie. |
