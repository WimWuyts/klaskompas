# Klaskompas — Onderzoek naast prototype "Klascockpit"

*Vergelijkende analyse voor een Vlaamse vakleerkracht 2e graad (Engels & Spaans, meerdere klasgroepen). Persoonlijk, lokaal-eerst hulpmiddel — géén vervanging van Smartschool/Informat/Discimus of schoolprocedures.*

---

## 1. Managementsamenvatting

Het prototype "Klascockpit" (v4) is verrassend volwaardig: het dekt in één single-file web-app zowat elk administratief domein dat het onderzoek identificeert — klassen/leerlingen, aanwezigheid, afwezigheden + inhaalwerk, observaties, klasmanagement, evaluaties + puntenboek, communicatie, acties, week-/dagoverzicht en overdracht. De teacher-first UX is sterk: prominente klas-switcher, FAB-snelinvoer, "Iedereen aanwezig"-knop, statuscyclusknoppen, dark mode en 44px touch targets. Als functionele demonstrator staat dit ver.

De grootste kansen/hiaten zijn echter structureel en raken de harde grenzen van dit project:

1. **Dataveiligheid & privacy is het grootste risico.** Data zit in `localStorage` (niet IndexedDB), en gevoelige zorggegevens (dyslexie/ADHD/IAC = bijzondere categorieën AVG) worden **onversleuteld** gedeeld via WhatsApp, e-mail, data-in-URL én een **externe QR-dienst (api.qrserver.com)**. Dat botst frontaal met privacy-by-design en lokaal-eerst. `localStorage` riskeert bovendien stil dataverlies (Safari 7-dagenregel, ~5 MB-limiet, eviction).
2. **Stille automatisering met leerlinggevolg.** Het puntenboek maakt automatisch remediëring-records aan bij "onvoldoende"; aanwezigheid genereert automatisch afwezigheidsrecords. Dit conflicteert met het principe "geen stille automatisering met gevolgen voor leerlingen" en met "geen automatische sancties" (klasmanagement kent al "ernst" + "maatregel").
3. **Vlaamse correctheid & vakleerkracht-realiteit ontbreken.** Aanwezigheid werkt **per dag** i.p.v. **per lesuur** — terwijl een vakleerkracht een groep maar enkele uren/week ziet. Statussen mappen niet op de conceptuele Discimus-categorieën, en er is geen expliciete disclaimer "dit is geen officiële afwezigheidsregistratie".
4. **Data-integriteit & herstelbaarheid.** "Import"/overdracht **overschrijft** de volledige state (`Object.assign`) ondanks de UI-belofte "wordt samengevoegd" → dataverliesrisico. Geen undo/prullenbak, geen auditlog van statusovergangen, geen echte backup-discipline.
5. **Talenspecifiek gemis.** Geen vaardigheidsevaluatie (lezen/luisteren/spreken/schrijven/gesprek), geen ERK-niveaus, `gewicht %` wordt bewaard maar niet gebruikt in de berekening.

Kernboodschap: **behoud de sterke UX-schil, maar herbouw de fundering** (opslag, privacy, geen stille automatisering, per-lesuur) vóór er ook maar één echte klas mee werkt.

---

## 2. Referentie: wat dekt een volwaardige klasadministratie?

**Klassen & leerlingen** — Klasgroepen met vak/schooljaar; leerling en inschrijving als aparte entiteiten (enrollment-patroon, [OneRoster](https://www.imsglobal.org/lis/imsOneRosterv1p0/imsOneRosterCSV-v1p0.html)); import via begeleide CSV/Excel-mapping + plak-fallback; archiveren i.p.v. verwijderen; jaarovergang; UTF-8 voor Spaanse namen. Officiële bron blijft [Discimus/AGODI](https://www.onderwijs.vlaanderen.be/nl/welke-gegevens_bao_en_so_vind_je_in_Dataloep).

**Aanwezigheden** — Twee strikt gescheiden lagen: (1) snelle, feitelijke **per-lesuur** registratie voor de leerkracht; (2) de officiële [Discimus-halve-dag-administratie](https://onderwijs.vlaanderen.be/nl/afwezigheidscodes-in-discimus) op schoolniveau. "Iedereen aanwezig" als default, cyclische één-tik-status (aanwezig/afwezig/te laat), live teller, disclaimer "niet officieel", geen automatische codetoekenning of "spijbelaar"-label.

**Evaluatie & punten** — Matrix leerlingen × evaluaties met apart bewaarde score én max-score; categorie + gewicht; formatief vs. summatief; status-vlaggen los van score; meerdere schaaltypes; rubrics; feedbackgeschiedenis; volledige keyboard-invoer + fill-down; virtueel gemiddelde met 50%-drempel; géén deliberatie/attesten (klassenraadbevoegdheid, [50%-regel](https://www.elfri.be/rechtspraak/niet-slagen-is-geen-loutere-puntentelling-bij-deliberatie-klassenraad)).

**Observaties & opvolging** — Feit strikt gescheiden van interpretatie (verplicht feitveld); [HGW](https://wij-leren.nl/hgw-uitgangspunten.php) + [zorgcontinuum](https://prodiagnostiek.be/het-zorgcontinuum/brede-basiszorg/) (leerkracht = fase 0-1, signaalgever); ABC-schema; zichtbaarheid privaat vs. dossierwaardig; auditlog; retentie; **geen risicoscores of karakterduiding**.

**Taken/huiswerk/materiaal** — Statusmodel toegewezen → ingeleverd → te laat → ontbrekend; aparte snelle materiaalcontrole; longitudinale telling "hoe vaak niet in orde" (feit, geen drempel); herstel boven straf ([geen automatische nul](https://www.evocaat.be/nl/themas/onderwijs/mag-een-leerkracht-een-nul-geven-als-je-een-taak-vergeet-in-te-dienen)).

**Communicatie** — Vast schema (datum, kanaal-enum, leerling, reden, feitelijke samenvatting, uitkomst, follow-up-status); per-leerling tijdlijn; soft-delete + mutatiegeschiedenis; export PDF/CSV; CLB als kanaal, geen CLB-dossier.

**Acties/opvolgpunten** — 10-seconden quick-capture; licht statusmodel; defer/snooze; koppeling aan bron (observatie/afwezigheid/communicatie); filter per klasgroep; geen optelscore.

**Overzicht & planning** — "Vandaag"-startscherm op basis van het **uurrooster**; weekoverzicht; per-groep voortgang; geaggregeerde to-do; feitelijke klas-signalen, geen leerlingoordelen; lage cognitieve belasting.

**Output** — Client-side PDF (jsPDF) + CSV/Excel (SheetJS); modulaire veldselectie; per-leerling-export als privacyveilige default; "niet-officiële werkkopie"-markering.

**Techniek** — [IndexedDB via Dexie](https://dexie.org/docs/ExportImport/dexie-export-import) i.p.v. localStorage; `navigator.storage.persist()`; PWA (ontsnapt aan [Safari 7-dagenregel](https://searchengineland.com/what-safaris-7-day-cap-on-script-writeable-storage-means-for-pwa-developers-332519)); expliciete bestandsbackup; geen externe datastroom.

**Privacy & recht** — AVG van toepassing (geen huishoudelijke uitzondering); school = verwerkingsverantwoordelijke; dataminimalisatie, doelbinding, bewaartermijnen, betrokkenenrechten; [privacy by design (art. 25)](https://gdpr-text.com/read/article-25/); feitelijk gedrag boven interpretatie.

---

## 3. Vergelijkingstabel per domein

| Domein | Best practice / must-have | Status in prototype | Hiaat & aanbeveling |
|---|---|---|---|
| **Klassen & leerlingen** | Klasgroep (vak/jaar) + leerlingen; enrollment scheiden van leerling; archiveren i.p.v. verwijderen | **Deels** — classes[] + students[] aanwezig, CSV-import met veel kolomaliassen, schooljaar-kopieerfunctie | Geen aparte inschrijvings-entiteit (leerling zit vast aan één `classId` + `schoolYear`); geen archiveren (alleen cascade-**delete**). Aanbeveling: enrollment-join toevoegen; soft-delete/archief. |
| **Import & fictieve data** | Begeleide mapping-wizard; plak-fallback; **fictieve** testnamen | **Deels** — flexibele CSV-import, maar `identifier` is vrij tekstveld | Risico op echte namen; niets koppelt aan `data/examples/`. Aanbeveling: mapping-preview + demo-modus met fictieve namen; UTF-8 borgen. |
| **Aanwezigheid (snel)** | "Iedereen aanwezig", cyclische één-tik, live teller, **per lesuur** | **Deels** — "Iedereen aanwezig", statusknoppen, live teller ✓/X/L/G aanwezig; sterk & mobielvriendelijk | Registratie **per dag**, niet per lesuur. Aanbeveling: lesuur/rooster als dimensie toevoegen — kernbehoefte vakleerkracht. |
| **Aanwezigheid (Vlaams correct)** | Disclaimer "niet officieel"; geen auto-codetoekenning | **Afwezig** — statussen mappen niet op Discimus-categorieën; geen disclaimer | Voeg zichtbare disclaimer toe; houd statussen feitelijk (aanwezig/afwezig/te laat) los van juridische codes. |
| **Afwezigheidslog & inhaalwerk** | Koppeling afwezigheid↔inhaalwerk; expliciet statusmodel | **Aanwezig** — absences[]↔makeups[], statuscyclus, herstelgericht | Sterk. Missend: herinnering bij naderende afspraakdatum (voor de leerkracht zelf). |
| **Evaluatie & punten** | Score + max apart; gewicht toegepast; formatief/summatief; status-vlaggen los van score; keyboard + fill-down | **Deels** — matrix, inline-invoer, sticky naam, CSV-export | `resultVal` is vrije tekst (geen aparte max); `weight` **niet gebruikt**; geen formatief/summatief-vlag; geen fill-down/paste. Aanbeveling: score/max structureren, weging toepassen, drempels configureerbaar. |
| **Automatisering evaluatie** | Geen stille automatisering met leerlinggevolg | **Afwezig (grensoverschrijdend)** — auto-remediëring bij "onvoldoende", auto-absences bij bewaren | Maak elke gevolg-actie **expliciet opt-in met bevestiging**. |
| **Talen-specifiek** | Vaardigheden (L/L/S/S/G), ERK, rubrics, leerplandoelen | **Afwezig** — alleen vrij tekstveld `topic` | Voeg vaardigheidscategorieën + rubric-sjablonen + ERK-niveaus (A1–B1) toe. |
| **Observaties** | Verplicht feitveld, gescheiden van gelabelde interpretatie; ABC; tags | **Deels** — observaties + klasmanagement gescheiden, notitie verplicht, positieve categorie | Geen expliciete feit/interpretatie-splitsing; categorie "motivatie" neigt naar duiding; geen ABC-structuur. |
| **Klasmanagement/sanctie** | Herstel boven straf; geen automatische sancties/scores | **Deels (grens)** — "ernst" (licht→ernstig) + "maatregel" (nablijven/rapport directie) manueel | Structureel sanctie-nabij. Bewaak tegen risicoscores; herframe naar herstelgerichte opvolgacties. |
| **Zichtbaarheid & audit** | Privaat vs. dossierwaardig; mutatie-/statushistoriek | **Afwezig** — statussen overschrijven zonder log | Voeg zichtbaarheidsstatus + auditlog (wie/wanneer/wijziging) toe — CLAUDE.md vereist auditbaarheid. |
| **Communicatie** | Kanaal-enum, per-leerling tijdlijn, follow-up-status, soft-delete, export | **Deels** — type-enum incl. CLB, deadline-bewaking, dashboard-alert | Geen soft-delete/mutatiegeschiedenis; geen PDF/CSV-verslagexport; gevoelige notitie onafgeschermd. |
| **Acties/opvolgpunten** | Quick-capture, defer/snooze, koppeling aan bron, filters | **Deels** — actions[] met prioriteit/status/vervaldag, klas/leerling-koppeling | Geen defer/snooze, geen herhalende taken, geen herinneringen, geen 1-klik "actie vanuit observatie". |
| **Overzicht & planning** | "Vandaag" op uurrooster; feitelijke klas-signalen; lage cognitieve belasting | **Deels** — sterk dashboard + weekoverzicht, doorklikbare metrics | **Geen lesrooster/lesuren**; "aandachtspunten" neigen naar risicosignalen. Aanbeveling: rooster als ruggengraat; signalen op klas-/taakniveau houden. |
| **Output/export** | Client-side PDF + CSV; per-leerling default; "werkkopie"-markering | **Deels** — CSV-export puntenboek, TXT-"rapport" | "Rapport PDF" levert **.txt**; CSV-kolom "Gemiddelde %" is een **bug** (altijd leeg); geen echte PDF, geen "niet-officieel"-markering. |
| **Opslag (techniek)** | IndexedDB/Dexie + migraties; persist(); PWA | **Afwezig** — **localStorage** (`klascockpit-v4`), geen migraties, geen PWA | Migreer naar IndexedDB/Dexie; vraag `persist()`; maak installeerbaar (Safari-risico). |
| **Backup/sync** | Expliciete bestandsbackup; geen externe datastroom | **Deels (risicovol)** — JSON-export/import, maar QR via externe dienst; import overschrijft | Verwijder externe QR/WhatsApp-datastroom; echte merge i.p.v. `Object.assign`; backup-herinnering. |
| **Privacy & recht (AVG)** | Dataminimalisatie, versleuteling gevoelige data, betrokkenenrechten, app-lock | **Afwezig/zwak** — zorgdata onversleuteld gedeeld; geen PIN; wissen onherstelbaar | Grootste zwakte. Versleutel (WebCrypto), app-lock, per-leerling inzage/export/wis, geen data-in-URL. |

---

## 4. Sterktes van het prototype (behouden)

- **Teacher-first UX-schil.** Klas-switcher, FAB + snelmodals, "Iedereen aanwezig", 44px touch targets, dark mode, mobiele bottom-nav, 16px inputs tegen iOS-zoom. Dit is precies wat het onderzoek als kritisch benoemt (bulk-eerst, minimale handelingen).
- **Slimme anti-dubbelinvoer bij aanwezigheid.** Synchronisatie naar de afwezigheidslog met dubbelcheck (leerling+datum+klas) — goed doordacht.
- **Expliciete statusmodellen met cyclusknoppen** (inhaalwerk, remediëring, communicatie) + visuele overdue-markering en dashboard-alerts. Sluit aan bij "expliciete statusmodellen".
- **Geïntegreerde leerlingfiche** die afwezigheid/observatie/evaluatie/communicatie/klasmanagement bundelt — sterk 360°-beeld voor gespreksvoorbereiding.
- **Herstelgerichte grondtoon.** Inhaalwerk gekoppeld aan afwezigheid, remediëring aan evaluatie, positieve observatiecategorie — herstel naast consequentie.
- **Overdrachtsgemak voor niet-technische leerkracht.** Stap-voor-stap uitleg, meerdere paden, schooljaar-kopieerfunctie bij jaarovergang.
- **Consistente semantiek** via centrale `badgeClass`-kleurlogica; flexibele CSV-import (NL/EN/FR-kolomaliassen); formulieren die klas/datum behouden voor snel herhalen.

---

## 5. Hiaten & verbeteringen (belangrijk → minder belangrijk)

### A. Opslag & backup-risico (localStorage) — kritiek
`localStorage` is synchroon, ~5 MB begrensd, en wordt door Safari/WebKit na **7 dagen inactiviteit gewist** — fataal bij weekends/vakanties. Een vakleerkracht met meerdere groepen bouwt snel honderden records op.
- **Migreer naar IndexedDB via Dexie** met schema-migraties (geen dataverlies bij updates); houd `localStorage` enkel voor UI-instellingen (`darkMode`, `activeClassId`).
- Vraag `navigator.storage.persist()` en toon quota/status + "laatste backup: X geleden".
- Maak de app **installeerbaar als PWA** (manifest + service worker) — ontsnapt aan de 7-dagenregel en opent offline in de klas.
- Expliciete bestandsbackup (JSON/ZIP) met download-fallback; import met **echte merge en validatie**, niet `Object.assign` (nu een dataverliesrisico ondanks "wordt samengevoegd"-belofte).

### B. Privacy & AVG — kritiek
- **Verwijder de externe datastroom onmiddellijk:** de "Deel via link"-QR stuurt de volledige state (incl. zorg-/gezondheidsgegevens) naar `api.qrserver.com`. Genereer QR **lokaal** (client-side lib) of schrap de functie. Idem: geen onversleutelde volledige dataset via WhatsApp/mailto/URL.
- **Versleutel gevoelige export** (WebCrypto AES-GCM, wachtwoord-afgeleid). Voeg **app-lock/PIN** toe voor gedeelde schoolPC's + "vergrendel scherm"-actie.
- **Betrokkenenrechten als functie:** per-leerling inzage-overzicht + export (CSV/JSON/PDF) + echte verwijdering.
- Onboarding-tekst: "persoonlijk hulpmiddel onder schoolgezag; stem af met DPO/ICT-coördinator; vervangt geen officieel systeem."

### C. Stille automatisering met leerlinggevolg — grensbewaking
Auto-remediëring bij "onvoldoende" en auto-absences bij bewaren zijn "stille automatisering met gevolgen". Maak elke gevolg-actie een **expliciete, bevestigde keuze** (opt-in checkbox/toast), nooit automatisch.

### D. Vlaamse correctheid (afwezigheidscodes) & per-lesuur
- Voeg **lesuur** (en idealiter een licht rooster) toe naast datum — de vakleerkracht ziet een groep enkele uren/week.
- Toon een **disclaimer** "geen officiële afwezigheidsregistratie". Houd statussen feitelijk; bied de Discimus-categorieën hooguit als niet-bindende referentiehulp. Geen "problematisch"-teller met gevolgen.

### E. Herstelbaarheid & auditbaarheid
- Vervang `confirm()`-delete door **soft-delete + prullenbak/undo-toast**; "Alle data wissen" met backup-prompt.
- Log statusovergangen/mutaties met tijdstempel (auditbaar) — nu overschrijven ze stil.

### F. Evaluatie afmaken + talenspecifiek
- Bewaar score én max apart; **pas `weight` toe** in de berekening; maak drempels configureerbaar; voeg formatief/summatief-vlag toe.
- **Fix de CSV-bug** (lege "Gemiddelde %"-kolom) en het "Rapport PDF"-label dat .txt levert (→ echte jsPDF).
- Voeg vaardigheidsevaluatie (lezen/luisteren/spreken/schrijven/gesprek), rubric-sjablonen en ERK-niveaus toe — dé meerwaarde voor Engels/Spaans.

### G. Interoperabiliteit & output
- Echte PDF-generatie (jsPDF + autotable) + nette CSV met gedocumenteerde koppen voor overzetten naar Smartschool; per-leerling-export als privacyveilige default; "niet-officiële werkkopie"-voettekst.

### H. Kleinere punten
- Feit/interpretatie-splitsing in observaties; heroverweeg categorie "motivatie"; toegankelijkheid (kleur niet als enige signaal, ARIA, toetsenbord); typfout "Comunicatie"; defer/herhaling/herinnering bij acties.

---

## 6. Aanbevolen prioriteiten (shortlist)

Afgestemd op een vakleerkracht 2e graad met meerdere groepen — eerst de fundering veilig, dan het dagelijkse werk sneller en correcter.

1. **Opslag verharden: localStorage → IndexedDB/Dexie + PWA + echte backup.** Zonder dit kan een krokusvakantie de hele administratie wissen. Randvoorwaarde voor élk verder gebruik.
2. **Privacylek dichten: externe QR/WhatsApp/URL-datastroom weg, gevoelige data versleutelen, app-lock.** Directe schending van de harde grenzen; niet-onderhandelbaar bij zorggegevens.
3. **Import repareren (merge i.p.v. overschrijven) + soft-delete/undo.** Beschermt tegen dataverlies dat de leerkracht niet ziet aankomen.
4. **Stille automatisering ontkoppelen (opt-in bevestiging bij remediëring/absences).** Herstelt conformiteit met "geen stille automatisering met gevolgen".
5. **Aanwezigheid per lesuur + disclaimer "niet officieel".** Maakt de app pas echt bruikbaar voor een vakleerkracht en Vlaams-correct gepositioneerd.
6. **Evaluatie afmaken: weging toepassen, CSV-bug fixen, echte PDF; daarna vaardigheden/ERK/rubrics voor talen.** Zet het puntenboek van "demo" naar dagelijks werkinstrument, met de talenmeerwaarde als differentiator.

Stappen 1–4 zijn *saneringen* (grenzen en betrouwbaarheid); 5–6 zijn *waarde-toevoegingen* die het prototype van indrukwekkende demo naar verantwoord teacher-first hulpmiddel tillen. Behoud daarbij bewust de bestaande UX-schil, statuscyclus-aanpak en anti-dubbelinvoer — dat is al goed.
