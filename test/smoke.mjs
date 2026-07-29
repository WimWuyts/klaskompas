// Browser-rooktest voor Klaskompas. Start zelf een statische server voor `app/` en
// doorloopt de belangrijkste flows in een headless browser.
//
// Vereist Playwright + een Chromium. Draaien:
//   npm i -D playwright-core           (of: npm i -D playwright && npx playwright install chromium)
//   PW_CHROMIUM=/pad/naar/chromium node test/smoke.mjs
// Zonder Playwright/Chromium slaat de test zichzelf netjes over (exit 0).

import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize } from 'node:path';

const APP = join(dirname(fileURLToPath(import.meta.url)), '..', 'app');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml' };

async function main() {
  let chromium;
  try { ({ chromium } = await import('playwright-core')); }
  catch { try { ({ chromium } = await import('playwright')); } catch { console.log('⏭  Playwright niet geïnstalleerd — rooktest overgeslagen.'); return 0; } }

  const server = http.createServer(async (req, res) => {
    try {
      let p = normalize(decodeURIComponent(req.url.split('?')[0]));
      if (p === '/' || p === '\\') p = '/index.html';
      if (p.includes('..')) { res.writeHead(403); return res.end(); }
      const buf = await readFile(join(APP, p));
      const ext = p.slice(p.lastIndexOf('.'));
      res.writeHead(200, { 'content-type': TYPES[ext] || 'application/octet-stream' });
      res.end(buf);
    } catch { res.writeHead(404); res.end('404'); }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const BASE = `http://127.0.0.1:${server.address().port}`;

  let browser;
  try {
    browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
  } catch (e) {
    console.log('⏭  Kon Chromium niet starten (' + e.message.split('\n')[0] + ') — rooktest overgeslagen.');
    server.close();
    return 0;
  }

  const page = await (await browser.newContext()).newPage();
  const fouten = [];
  page.on('console', (m) => { if (m.type() === 'error') fouten.push(m.text()); });
  page.on('pageerror', (e) => fouten.push(e.message));
  const ok = (n) => console.log('• ' + n);

  const CSV = 'voornaam,naam,klas,email\nNoah,Peeters,4-ENG-A,a@e.edu\nEmma,Janssens,4-ENG-A,b@e.edu\nJulia,Martens,4-SPA-B,c@e.edu';

  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.waitForSelector('.merk', { timeout: 5000 });
  ok('shell geladen');

  await page.evaluate(async (csv) => { const m = await import('/src/db/backup.js'); await m.importeerCsv(csv, { schooljaarId: null }); }, CSV);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.tegel', { timeout: 4000 });
  const n = await page.$$eval('.klaskiezer option', (o) => o.filter((x) => x.value).length);
  if (n < 2) throw new Error('CSV-import mislukt');
  ok('CSV-import + ' + n + ' klassen');

  for (const v of ['klassen', 'leerlingfiche', 'aanwezigheid', 'inhaalwerk', 'puntenboek', 'individueel', 'beloningen', 'zitplan', 'acties', 'afspraken', 'schooljaar', 'rooster', 'handleiding', 'instellingen']) {
    await page.goto(BASE + '/index.html#/' + v, { waitUntil: 'networkidle' });
    await page.waitForSelector('#inhoud .kaart, #inhoud .leeg, #inhoud .kaart__kop--los, #inhoud .tegels', { timeout: 4000 });
  }
  ok('alle admin-views geladen');

  await page.goto(BASE + '/index.html#/klasscherm', { waitUntil: 'networkidle' });
  await page.waitForSelector('.kb-amount', { timeout: 4000 });
  const s0 = await page.textContent('.kb-amount');
  await page.click('.kb-big.plus');
  await page.waitForTimeout(250);
  if (await page.textContent('.kb-amount') === s0) throw new Error('klaskapitaal beweegt niet');
  ok('klasscherm werkt');

  const enc = await page.evaluate(async () => {
    const repo = await import('/src/db/repo.js'); const model = await import('/src/domain/model.js');
    const bev = await import('/src/domain/beveiliging.js'); const backup = await import('/src/db/backup.js');
    const k = (await repo.all('klassen'))[0]; const leer = await repo.leerlingenVanKlas(k.id);
    const obs = model.maakObservatie({ leerlingId: leer[0].id, klasId: k.id, gedrag: 'geheim' });
    await repo.put('observaties', obs); await bev.stelPinIn('1357');
    const raw = (await backup.exporteerAlles()).data.observaties.find((o) => o.id === obs.id);
    const versleuteld = !!(raw?.gedrag?.__enc); const leesbaar = (await repo.get('observaties', obs.id)).gedrag === 'geheim';
    await bev.zetLockAf('1357');
    return versleuteld && leesbaar;
  });
  if (!enc) throw new Error('veld-encryptie faalt');
  ok('veld-encryptie at rest ✓');

  await browser.close();
  server.close();
  if (fouten.length) { console.log('\n❌ console-fouten:\n  ' + fouten.join('\n  ')); return 1; }
  console.log('\n✅ rooktest ok');
  return 0;
}

process.exit(await main());
