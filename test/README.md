# Tests

## Unit-tests (geen browser nodig)

Zuivere domeinlogica (naamnormalisatie, schooljaar-generatie, zitplan-generator, …):

```bash
npm test        # = node --test test/*.test.mjs
```

Draait ook automatisch in CI (`.github/workflows/ci.yml`) samen met een syntaxcheck
van alle app-modules.

## Browser-rooktest (optioneel)

Doorloopt de echte app in een headless browser: CSV-import, alle views, het
Klasscherm en de veld-encryptie. Vereist Playwright + een Chromium.

```bash
npm i -D playwright-core
PW_CHROMIUM=/pad/naar/chromium npm run smoke
```

De test start zelf een statische server voor `app/`. Ontbreekt Playwright of Chromium,
dan slaat de test zichzelf netjes over (exit 0), zodat CI niet faalt op de browserstap.
