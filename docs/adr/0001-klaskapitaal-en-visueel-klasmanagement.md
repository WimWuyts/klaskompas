# ADR-0001 — Klaskapitaal-economie & visueel klasmanagement

- **Status:** goedgekeurd door projecteigenaar (2026-07)
- **Context-scope:** Vlaamse leerkracht, 2e graad secundair, Engels & Spaans,
  vakleerkracht met meerdere klasgroepen. Persoonlijk, lokaal-eerst hulpmiddel.
- **Bronnen:** `research/klasmanagement-catalogus.md`, `research/onderzoek-klasmanagement-en-administratie.md`, `research/klasadministratie-vergelijking.md`.

## 1. Context

Klaskompas krijgt naast de bestaande klasadministratie ("Klascockpit"-prototype) een
**visueel klasmanagement-luik** met een collectief beloningssysteem. De projecteigenaar
wil bewust dat het systeem de **realiteit** weerspiegelt (ook moeilijk te managen
klassen), niet enkel het theoretische ideaal. Waar dat de pedagogische grenzen raakt,
zijn keuzes expliciet door de eigenaar gemaakt en hier vastgelegd.

## 2. Beslissing

### 2.1 De klaskapitaal-economie (collectief spoor)

1. **Visualisatie:** een verticale "geldkoker" (Squid-Game-stijl) met euro-briefjes die
   de klas zichtbaar ziet aangroeien. Projecteerbaar op het digibord.
2. **Per klas geïsoleerd:** elke klas heeft een eigen pot, gekoppeld aan de
   CSV-klassenlijst. Datamodel-ruggengraat: `klas → leerling (via inschrijving)`.
3. **Startkapitaal:** elke klas start met een instelbaar bedrag.
4. **Beweging:** de pot **stijgt** op collectief positief gedrag (lesklaar, aan het werk,
   opgeruimd) en kan **dalen** op collectief negatief gedrag (bv. de hele klas praat),
   met een **bodem** en altijd terug te verdienen.
5. **Prijs:** vanaf een instelbaar bedrag mag de klas het kapitaal inzetten voor een prijs.
6. **Herstart-uitdaging:** zakt de pot onder een drempel, dan volgt een **neutrale
   herstart-uitdaging** — een gedeelde opdracht om samen terug te verdienen (kans, geen straf).
7. **Collectief gevolg bij mislukte herstart:** werkt de herstart niet, dan volgt een
   collectief gevolg: **terugvallen op individueel werk + een korte controle/toets op het
   einde van de les**. Dit is bewust een collectief gevolg voor collectief gedrag; het is
   **teacher-triggered** (zie §2.4) en per klas in zwaarte instelbaar. (OD-4)
8. **Configureerbaar per klas** (universele kern, configureerbare klaspreventie):
   startkapitaal, drempels, prijsbedrag, wat de pot beweegt, en of stap 7 aanstaat.

### 2.2 Individueel spoor (losgekoppeld van de pot)

9. **Keuze 1 = A + B:** individueel wangedrag raakt de klaspot **niet** (het wordt
   persoonlijk en herstelgericht opgelost); individuen kunnen wel **positief** bijdragen
   aan de pot. *Lof collectief, straf individueel.*
10. **Optie C (voorwaardelijk):** individueel gedrag mag de pot enkel doen dalen als de
    leerkracht dat per klas **expliciet en vooraf gedefinieerd** inschakelt. Default: uit. (OD-2)
11. **Individuele consequentie-ladder** (alle vier, in deze volgorde):
    1. **Herstelgesprek** (5 vaste herstelvragen, kort na de les);
    2. **Logische herstelopdracht** ("you break it, you fix it"; evt. korte zinvolle
       opdracht, bv. in de doeltaal);
    3. **Feitelijke notitie + opschalen bij patroon** (ABC-notitie in de private fiche;
       bij herhaling een signaal naar mentor/ouders/zorg);
    4. **Tijdelijk, gerelateerd privilegeverlies** (bv. even geen vrije partner-/plaatskeuze;
       nooit de leerstof of een basisbehoefte).

### 2.3 Gewenste modules/features

12. **Instructietab:** handleiding + transparante klasafspraken + uitleg over hoe de
    economie werkt (voorspelbaarheid = eerlijkheid).
13. **Continue reminder:** subtiele strip op het Klasscherm (dagfocus / actieve afspraak /
    huidige drill-stap).
14. **Decibelmeter:** de microfoon meet **enkel live volume-amplitude**, neemt niets op en
    herkent niemand. **Stilte/onder een drempel laat de klas altijd verdienen** (positief).
    "Te luid" is een **objectief, vooraf door de leerkracht ingesteld niveau**: blijft het
    volume daar **aanhoudend** boven (na een zichtbare waarschuwing, meter groen→oranje→rood,
    met korte grace-periode), dan **zakt de pot geleidelijk**, met een **bodem**, en herstelt
    ze zodra het weer stil wordt (symmetrisch met verdienen). De leerkracht stelt het niveau
    in en kan altijd ingrijpen/overrulen. Twee modi per klas: *bevestigen-per-keer* (meter
    seint, leerkracht tikt) of *objectief* (bovenstaande automatische drift op het ingestelde
    niveau).
    **Waarborg (harde grens intact):** dit beweegt enkel de **collectieve, visuele** meter;
    het brengt **nooit automatisch een gevolg voor leerlingen** teweer. De herstart-uitdaging
    (§2.1.6) en het collectieve gevolg (§2.1.7) blijven **teacher-triggered** (§2.4). De
    objectieve drift is feedback op een meetbare, herstelbare klas-conditie, geen automatische
    sanctie tegen een persoon. (OD-3, beslist)
15. **Individuele quota:** feitelijke tellers (bv. "3× boek vergeten deze maand"). Bij het
    bereiken van een quota **seint** het systeem; de leerkracht kiest de herstelgerichte
    consequentie (§2.2). Geen automatische straf, geen risicoscore.
16. **Vaste lesdrill** (afvinkbare checklist op het Klasscherm): binnenkomen → rechtstaan →
    gaan zitten → boek + taak uit de **planner van de vorige dag** → starten terwijl de
    leerkracht klaarzet.

### 2.4 Harde grenzen (bevestigd)

17. **Teacher-triggered, nooit automatisch straffend.** De tool **meet, telt en seint**;
    de leerkracht **beslist en triggert** elk gevolg. Geen automatische sancties, geen
    stille automatisering met gevolgen voor leerlingen.
18. **Geen** biometrie, gezichtsherkenning, emotiedetectie of aandachtsscores; **geen**
    gecombineerde risicoscores of afgeleide karaktereigenschappen. De klaspot is
    **collectief**; er zijn geen gedragsscores of -labels per leerling. Individuele data
    (tellers, notities) zijn **privaat** en feitelijk.
19. **Herstel boven straf; feitelijk gedrag boven interpretatie; privacy-by-design.**
20. **Geen vervanging van schoolprocedures.** Dit werkt op klasniveau binnen de eigen
    praktijk van de leerkracht; het vervangt geen officiële afwezigheids- of
    sanctieprocedure. Afstemmen met schoolreglement/DPO/ICT-coördinator. (OD-6)

### 2.5 Integratie met de administratietool

21. **Eén app, één datamodel.** Administratie (aanwezigheid, taken/materiaal, punten,
    observaties, communicatie, acties, leerlingfiche) en klasmanagement (klaspot,
    decibelmeter, lesdrill, afsprakenset, interventieladder) delen dezelfde entiteiten
    `klas` en `leerling/inschrijving` uit de CSV-import.
22. **Koppelingen tegen dubbele invoer:** één feit voedt meerdere modules — bv.
    "boek vergeten" = materiaalcheck (admin) + quota-teller (§2.3) + mogelijk pot-event
    (indien C aanstaat). Feitelijke observaties voeden de fiche.
23. **Twee weergaves:** *Lesmodus* (het projecteerbare "Klasscherm": geldkoker,
    decibelmeter, drill, reminder) en *Administratie* (de rustige modules, na de les).
24. **Fundering-saneringen als randvoorwaarde** vóór echt klasgebruik: IndexedDB i.p.v.
    localStorage, PWA/offline, echte backup, echte merge bij import, geen externe
    datastroom, versleuteling van gevoelige data, app-lock. Zie
    `research/klasadministratie-vergelijking.md`. (OD-5)

## 3. Gevolgen

**Positief:** één samenhangend, teacher-first systeem; een motiverende, visuele collectieve
beloning; consequenties op zowel collectief als individueel niveau; volledig binnen de
harde grenzen doordat de leerkracht elke sanctie zelf triggert; configureerbaar per klas
zodat het de reële klasdynamiek volgt.

**Aanvaarde risico's & mitigaties:**
- *Collectief gevolg / peer-druk (shaming, zondebok).* Erkend risico. Mitigaties:
  bewegingen zijn collectief en nooit aan één zichtbare naam gekoppeld; er is altijd een
  echte herstelkans (herstart) vóór een gevolg; alles is vooraf gekend en voorspelbaar;
  individueel gedrag loopt over het aparte, private herstelspoor; optie C staat default uit.
- *Decibel-oneerlijkheid.* Ondervangen door positief-gericht verdienen + seinen i.p.v.
  automatisch straffen, en door de leerkracht als trigger.
- *Testen als straf.* Geframed als terugvallen op individueel werk + korte controle met
  leerwaarde, niet als straftoets. (OD-4)

## 4. Overwogen alternatieven

- **Zuiver positief (nooit dalen, geen gevolg).** Pedagogisch het veiligst en aanbevolen
  door het onderzoek, maar door de eigenaar afgewezen omdat het de realiteit van moeilijke
  klassen onvoldoende weerspiegelt.
- **Knikkers i.p.v. euro's.** Vervangen door euro's/briefjes op vraag van de eigenaar
  (sterker visueel narratief).
- **Automatische decibel-sanctie (Too Noisy-stijl).** Afgewezen: botst met de harde grens
  tegen automatische sancties.

## 5. Open punten

Zie `docs/00-project/OPEN_DECISIONS_REGISTER.md`: OD-2 (voorwaarden optie C), OD-3
(decibel→pot exact), OD-4 (framing collectief gevolg), OD-5 (fundering-saneringen),
OD-6 (afstemming school), OD-7 (visuele mockup).
