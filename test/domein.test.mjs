// Unit-tests voor de zuivere domeinlogica (geen browser/IndexedDB nodig).
// Draaien: `node --test test/`  (Node 18+).

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { dedupSleutel, defaultKlasConfig } from '../app/src/domain/model.js';
import { genereerLesmomenten, defaultLabel, weekdag, isoDatum } from '../app/src/domain/schooljaar.js';
import { genereerZitplan, rasterAfmeting } from '../app/src/domain/zitplan.js';

test('dedupSleutel normaliseert accenten en hoofdletters', () => {
  assert.equal(dedupSleutel('José', 'Peña'), dedupSleutel('jose', 'pena'));
  assert.equal(dedupSleutel('  Noah ', 'Peeters'), 'noah peeters');
  assert.notEqual(dedupSleutel('Noah', 'Peeters'), dedupSleutel('Noa', 'Peeters'));
});

test('defaultKlasConfig heeft veilige defaults', () => {
  const c = defaultKlasConfig();
  assert.equal(c.optieC, false); // OD-2: default uit
  assert.equal(c.bodem, 0);
  assert.ok(c.prijsdrempel > c.startkapitaal);
});

test('defaultLabel bouwt een schooljaarlabel', () => {
  assert.equal(defaultLabel(2026), '2026-2027');
});

test('weekdag geeft maandag=1 .. zondag=7', () => {
  assert.equal(weekdag(new Date(2026, 7, 31)), 1); // 31 aug 2026 = maandag
  assert.equal(weekdag(new Date(2026, 8, 6)), 7); // 6 sep 2026 = zondag
});

test('genereerLesmomenten telt wekelijkse slots minus vakanties', () => {
  const sj = { start: '2026-09-01', eind: '2026-09-30' }; // september 2026
  const slots = [{ dag: 2, start: '08:25', eind: '09:15' }]; // elke dinsdag
  // dinsdagen in sep 2026: 1, 8, 15, 22, 29 → 5
  const zonderVakantie = genereerLesmomenten(sj, slots, []);
  assert.equal(zonderVakantie.length, 5);
  // vakantie die dinsdag 8 sep bevat → 4 over
  const metVakantie = genereerLesmomenten(sj, slots, [{ van: '2026-09-07', tot: '2026-09-11' }]);
  assert.equal(metVakantie.length, 4);
});

test('isoDatum formatteert lokaal zonder tijdzone-verschuiving', () => {
  assert.equal(isoDatum(new Date(2026, 0, 5)), '2026-01-05');
});

test('rasterAfmeting kiest een passend raster', () => {
  assert.deepEqual(rasterAfmeting(12, 4), { rijen: 3, kolommen: 4 });
  assert.deepEqual(rasterAfmeting(10, 4), { rijen: 3, kolommen: 4 });
});

test('genereerZitplan plaatst iedereen', () => {
  const leerlingen = Array.from({ length: 12 }, (_, i) => ({ id: 'l' + i, voornaam: 'V' + i, naam: 'N' + i }));
  const plan = genereerZitplan(leerlingen, [], { kolommen: 4 });
  assert.equal(plan.plaatsen.length, 12);
  // geen twee leerlingen op dezelfde plaats
  const posities = new Set(plan.plaatsen.map((p) => `${p.rij},${p.kol}`));
  assert.equal(posities.size, 12);
});

test('genereerZitplan respecteert een vaste plaats', () => {
  const leerlingen = Array.from({ length: 8 }, (_, i) => ({ id: 'l' + i, voornaam: 'V' + i, naam: 'N' + i }));
  const regels = [{ type: 'vasteplaats', leerlingId: 'l3', rij: 0, kol: 0 }];
  const plan = genereerZitplan(leerlingen, regels, { kolommen: 4 });
  const l3 = plan.plaatsen.find((p) => p.leerlingId === 'l3');
  assert.deepEqual({ rij: l3.rij, kol: l3.kol }, { rij: 0, kol: 0 });
});

test('genereerZitplan meldt "niet naast" als opgelost of gerapporteerd', () => {
  const leerlingen = Array.from({ length: 8 }, (_, i) => ({ id: 'l' + i, voornaam: 'V' + i, naam: 'N' + i }));
  const regels = [{ type: 'nietnaast', leerlingId: 'l0', leerlingId2: 'l1' }];
  const plan = genereerZitplan(leerlingen, regels, { kolommen: 4 });
  const a = plan.plaatsen.find((p) => p.leerlingId === 'l0');
  const b = plan.plaatsen.find((p) => p.leerlingId === 'l1');
  const naastElkaar = a.rij === b.rij && Math.abs(a.kol - b.kol) === 1;
  // Ofwel opgelost (niet naast elkaar), ofwel netjes teruggemeld in onopgelost[].
  assert.ok(!naastElkaar || plan.onopgelost.length > 0);
});
