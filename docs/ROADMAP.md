# Roadmap

Geplande uitbreidingen op de app (`app/`), geordend van "nu bouwbaar" naar "pas later".
Status: ✅ klaar · 🔨 in aanbouw · ⬜ gepland. Zie ook het
[open-beslissingenregister](00-project/OPEN_DECISIONS_REGISTER.md) en de ADR's.

## A. Nu bouwbaar (geen externe input nodig) — ✅ gebouwd (v0.3)

1. ✅ **Afdrukken & exporteren** — printbaar puntenboek + CSV-export van cijfers, en een
   afdrukbaar leerlingrapport (via een print-venster).
2. ✅ **Zitplan handmatig slepen** — bankjes verslepen/wisselen bovenop de generator.
3. ✅ **Robuustheid: "ongedaan maken" + invoercontroles** — verwijderen met een
   "ongedaan maken"-toast (gedeelde helper) en rode veldmarkering bij ongeldige invoer.
4. ✅ **Rooster-import (app-zijde)** — "plak transcriptie (JSON)"-import in de rooster-editor.
   Formaat: `[{ "dag":1, "start":"08:25", "eind":"09:15", "lokaal":"A102" }]` (dag 1–5).
5. ✅ **Rooster ↔ aanwezigheid koppelen** — aanwezigheid per concreet lesuur (met terugval
   "Hele dag"); oude records blijven werken.
6. ✅ **Veld-encryptie "at rest"** — gevoelige vrije-tekstvelden (observaties, notities,
   consequenties) versleuteld met een sleutel uit de pincode; transparant via de datalaag.
7. ✅ **Afwerking/polish** — zichtbare focus (toetsenbord), print-terugval, en een
   ingebouwde **Handleiding**-tab.
8. ✅ **Geautomatiseerde testset in de repo** — unit-tests (`node --test`) + CI-workflow +
   een portable browser-rooktest. Zie `test/`.

## B. Pas later (externe input of tijd nodig)

9. ⬜ **Rooster-per-foto — de eigenlijke transcriptie** — wanneer de leerkracht een foto van
   het uurrooster aanlevert (via de import uit stap 4).
10. ⬜ **Concrete september-gegevens** — titularis-klas, echte leerlingen en
    zitplan-randvoorwaarden. Invullen in september (framework-first).

## C. Vraagt eerst een beslissing (raakt de privacy-grenzen uit de ADR's)

11. ⬜ **Synchronisatie tussen toestellen** — botst met "lokaal-eerst, geen externe
    datastroom" (ADR-0001/0002). Kan met versleutelde sync, maar is een bewuste koerswijziging.
12. ⬜ **Echt communiceren naar ouders** (versturen i.p.v. lokale notitie) — raakt privacy en
    OD-6; eerst af te stemmen met school/DPO.

---

**Aanbevolen volgorde:** A1 → A8 in deze volgorde, dan B9–B10 zodra de gegevens er zijn,
en C11–C12 enkel na expliciete goedkeuring (ze wijzigen vastgelegde privacy-afspraken).
