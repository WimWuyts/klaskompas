# ADR-0003 — Beloningsmenu & uitgeef-mechaniek

- **Status:** goedgekeurd als ontwerp (2026-07); bouwt voort op ADR-0001.
- **Context-scope:** zie ADR-0001. Collectief, goedkoop, herbruikbaar, talen-gekleurd.
- **Bronnen:** `research/beloningssysteem-onderzoek.md` (+ ruwe bevindingen), afgeleid
  uit een breed webonderzoek (motivatiewetenschap, collectieve beloningen, tiener-menu,
  uitgeef-mechaniek, snoep, talenklas, uitfaseren, praktijk).

## 1. Context

ADR-0001 legde de **mechaniek** van de klaskapitaal-economie vast (de geldkoker: hoe
ze stijgt/zakt, drempels, herstart). Wat nog ontbrak was het eigenlijke **belonen**:
wát de klas wint en hóe uitgeven werkt. Het onderzoek geeft een eenduidige leidraad:
hóe je beloont weegt zwaarder dan wát je geeft — beloningen motiveren als ze
**informatief** (competentie-bevestigend) en **collectief** zijn, en ondermijnen als ze
**controlerend** en prestatie-gebonden aanvoelen (overjustification-effect).

## 2. Beslissing

### 2.1 Ontwerpprincipes (leidend bij elke beloning)

1. **Informatief boven controlerend** — koppel een stijging aan benoemd gedrag
   ("jullie hielden vol/hielpen elkaar"), niet aan gehoorzaamheid of cijfers.
2. **Beloon inzet/gedrag, niet de leuke kerntaak** en niet talent/labels.
3. **Meng voorspelbaar en onverwacht**; vaste prijzen voor transparantie, plus ruimte
   voor spontane toekenning.
4. **Collectief, nooit een label per leerling** (sluit aan bij de harde grenzen).
5. **Autonomie in het uitgeven** — de klas kiest mee (stem in de doeltaal).
6. **Bouw naar zelfstandigheid** — van betalen naar vieren; faseer uit.

### 2.2 Het beloningsmenu (gecategoriseerd, talen-gekleurd)

7. Vijf categorieën: **Voorrechten & autonomie**, **Ervaringen & spel**,
   **Talen-gekleurd**, **Snoep & materieel**, **Klasmoment/spaardoel**. Elke beloning
   heeft een niveau (klein/midden/groot), een prijs en optioneel een talen-toepassing.
8. **Startmenu** (aanbevolen set) staat als sjabloon klaar en is per klas aan te passen;
   zie `app/src/domain/beloningen.js` (`START_MENU`).
9. **Snoep is toegelaten** maar als collectief, zeldzaam cultuur-proevertje: individueel
   verpakt met ingrediëntenlijst, altijd een niet-voedsel-alternatief, en conform het
   schoolvoedingsbeleid.
10. **Huiswerk is géén beloning** (blijft sanctie): de "geen huiswerk"-coupon zit
    bewust niet in het menu.

### 2.3 Uitgeef-mechaniek

11. **Getrapt menu met vaste prijzen + klasstem + reset.** Drie prijsniveaus zodat er
    altijd iets bereikbaars is én iets om naar te sparen; prijzen liggen zichtbaar vast;
    bij een aankoop kiest de klas; na inwisselen daalt de pot ("verdiend uitgegeven",
    geen "alles kwijt").
12. **Veiling en loterij** worden niet de kern (toeval/competitie botst met eerlijk +
    geen-shaming); hooguit als zeldzaam feestje.
13. **IJking:** ronde drempels, zo dat een grote beloning binnen enkele weken haalbaar
    is terwijl kleine beloningen bereikbaar blijven; per klas instelbaar (de prijzen in
    het startmenu gaan uit van een prijsdrempel ~50).

### 2.4 Uitfaseren

14. Beloningsladder van **materieel/frequent → belevingen → sociale erkenning/rituelen**,
    met geleidelijke afbouw (niet abrupt), de klas laten meekiezen, en kleine
    overwinningen zichtbaar vieren.

## 3. Gevolgen

**Positief:** het collectieve spoor uit ADR-0001 krijgt een concreet, motiverend en
wetenschappelijk onderbouwd belonings-luik dat binnen de harde grenzen blijft
(collectief, geen scores, herstel boven straf). Talen-gekleurde beloningen maken van
het belonen meteen taalinput. De mechaniek is transparant en niet-manipuleerbaar.

**Aanvaarde risico's & mitigaties:** afhankelijkheid ("wat krijg ik ervoor?") wordt
tegengegaan door uit te faseren en de klas te laten meekiezen; overjustification door
inzet/gedrag te belonen i.p.v. al-leuke taken; snoep-risico's door de randvoorwaarden
in §2.2.9.

## 4. Realisatie

Gebouwd in `app/`: het startmenu wordt als sjabloon gezaaid; het beloningsmenu en de
uitgeef-mechaniek (saldocontrole, aftrek, logboek) draaien in de Lesmodus; beheer van
beloningen zit onder "Beloningen". Configuratie (prijsdrempel enz.) per klas via
"Instellingen".

## 5. Open punten

De concrete prijs-ijking per klas en de keuze welke beloningen actief zijn, blijven een
praktische, bijstelbare keuze van de leerkracht (geen aparte OD nodig).
