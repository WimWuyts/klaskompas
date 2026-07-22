# Claude Code — permanente projectinstructies

## Rol

Claude Code implementeert, test en documenteert goedgekeurde projectbeslissingen. Claude beslist niet zelfstandig over pedagogisch beleid, sancties, privacygrenzen of schoolprocedures.

## Canonvolgorde

Bij conflict geldt deze volgorde:

1. expliciete actuele opdracht van de projecteigenaar;
2. goedgekeurde ADR's en beslisdocumenten;
3. `docs/00-project/OPEN_DECISIONS_REGISTER.md`;
4. overige versieerde documenten in `docs/`;
5. bestaande code en tests;
6. onderzoeksnotities in `research/`.

Onderzoeksrepositories zijn inspiratie en geen canon.

## Absolute grenzen

- Gebruik nooit echte leerlinggegevens.
- Voeg geen biometrie, gezichtsherkenning, emotiedetectie of aandachtsscores toe.
- Voeg geen automatische sancties of gecombineerde risicoscores toe.
- Leid geen karaktereigenschappen, motivatie of zorgbehoeften af uit registraties.
- Vervang geen schoolprocedure door een eigen workflow zonder expliciete goedkeuring.
- Kopieer geen externe code zonder licentiecontrole en bronregistratie.

## Werkwijze

- Werk op een taakbranch, bij voorkeur `claude/<korte-taaknaam>`.
- Wijzig `main` niet rechtstreeks.
- Houd commits klein en doelgericht.
- Voeg tests toe voor iedere gedragsregel, statusovergang en autorisatiegrens.
- Documenteer aannames als open beslissing; verberg ze niet in code.
- Gebruik fictieve testnamen uit `data/examples/`.
- Bewaar statusovergangen en mutaties auditbaar.
- Maak destructieve acties herstelbaar waar praktisch mogelijk.

## Voor iedere bouwtaak

1. Lees de relevante canonbestanden.
2. Benoem welke open beslissingen de taak blokkeren.
3. Maak een uitvoeringsplan.
4. Implementeer alleen de goedgekeurde scope.
5. Voer linting, typechecks en tests uit.
6. Lever een compact handoverrapport met gewijzigde bestanden, tests, resterende risico's en volgende actie.

## Productprincipes

- teacher-first;
- maximaal enkele handelingen tijdens een les;
- feitelijk gedrag boven interpretatie;
- preventie en herstel naast consequenties;
- universele kern, configureerbare klaspreventie;
- privacy by design;
- expliciete statusmodellen;
- geen stille automatisering met gevolgen voor leerlingen.
