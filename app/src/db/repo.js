// Data-toegangslaag: één geopende database + hogere-orde queries per entiteit.
// De views praten enkel met deze module, nooit rechtstreeks met IndexedDB.

import { openDb } from './schema.js';
import { uid, defaultKlasConfig } from '../domain/model.js';

let _db = null;

// Optionele crypto-hooks (veld-encryptie at rest). Zonder hooks: alles plein-tekst.
// enc/dec krijgen (store, record) en geven een KLOON terug (muteren het origineel niet).
let cryptoHooks = null;
export function setCryptoHooks(h) { cryptoHooks = h; }
async function enc(store, value) { return cryptoHooks ? cryptoHooks.enc(store, value) : value; }
async function dec(store, value) { return cryptoHooks && value ? cryptoHooks.dec(store, value) : value; }
async function decList(store, rows) { return cryptoHooks ? Promise.all(rows.map((r) => cryptoHooks.dec(store, r))) : rows; }

/** Open (eenmalig) en cache de database. */
export async function db() {
  if (!_db) {
    _db = await openDb();
    await zorgVoorMeta();
  }
  return _db;
}

async function zorgVoorMeta() {
  const bestaand = await _db.get('meta', 'app');
  if (!bestaand) {
    await _db.put('meta', {
      key: 'app',
      appVersie: '0.1.0',
      schemaVersie: 1,
      aangemaakt: new Date().toISOString(),
    });
  }
}

// — Instellingen (sleutel/waarde) —

export async function getSetting(key, fallback = null) {
  const d = await db();
  const rec = await d.get('settings', key);
  return rec ? rec.value : fallback;
}

export async function setSetting(key, value) {
  const d = await db();
  await d.put('settings', { key, value });
  return value;
}

// — Generieke CRUD —

export async function all(store) {
  return decList(store, await (await db()).getAll(store));
}
export async function get(store, id) {
  return dec(store, await (await db()).get(store, id));
}
export async function put(store, value) {
  await (await db()).put(store, await enc(store, value));
  return value;
}
export async function putAll(store, values) {
  const versleuteld = cryptoHooks ? await Promise.all(values.map((v) => enc(store, v))) : values;
  return (await db()).putAll(store, versleuteld);
}
export async function remove(store, id) {
  return (await db()).delete(store, id);
}
export async function byIndex(store, index, value) {
  return decList(store, await (await db()).getAllByIndex(store, index, value));
}

// — Klassen & leerlingen —

/** Actieve inschrijvingen van een klas, verrijkt met de leerlinggegevens. */
export async function leerlingenVanKlas(klasId) {
  const d = await db();
  const inschr = (await d.getAllByIndex('inschrijvingen', 'klasId', klasId)).filter(
    (i) => i.actief,
  );
  const out = [];
  for (const i of inschr) {
    const l = await d.get('leerlingen', i.leerlingId);
    if (l) out.push({ ...l, inschrijvingId: i.id, klasId });
  }
  out.sort((a, b) => (a.naam + a.voornaam).localeCompare(b.naam + b.voornaam, 'nl'));
  return out;
}

/** Verwijder een klas + haar inschrijvingen + pot (leerlingen blijven bestaan). */
export async function verwijderKlas(klasId) {
  const d = await db();
  const inschr = await d.getAllByIndex('inschrijvingen', 'klasId', klasId);
  for (const i of inschr) await d.delete('inschrijvingen', i.id);
  await d.delete('potten', klasId).catch(() => {});
  await d.delete('klassen', klasId);
}

// — Klaspot —

/** Haal het potrecord op; maak het aan uit de klasconfig als het nog niet bestaat. */
export async function getPot(klasId) {
  const d = await db();
  let pot = await d.get('potten', klasId);
  if (!pot) {
    const klas = await d.get('klassen', klasId);
    const config = klas?.config || defaultKlasConfig();
    pot = { klasId, saldo: config.startkapitaal, updated: new Date().toISOString() };
    await d.put('potten', pot);
  }
  return pot;
}

export async function bewaarPot(pot) {
  const d = await db();
  pot.updated = new Date().toISOString();
  await d.put('potten', pot);
  return pot;
}

export async function potGeschiedenis(klasId, limiet = 25) {
  const d = await db();
  const events = await d.getAllByIndex('potEvents', 'klasId', klasId);
  events.sort((a, b) => b.ts.localeCompare(a.ts));
  return events.slice(0, limiet);
}

// — Beloningen: klas-specifiek + sjablonen ('*') samen —

export async function beloningenVoorKlas(klasId) {
  const d = await db();
  const eigen = await d.getAllByIndex('beloningen', 'klasId', klasId);
  const sjablonen = await d.getAllByIndex('beloningen', 'klasId', '*');
  return [...eigen, ...sjablonen].filter((b) => b.actief);
}

export async function aankopenVanKlas(klasId, limiet = 25) {
  const d = await db();
  const a = await d.getAllByIndex('aankopen', 'klasId', klasId);
  a.sort((x, y) => y.ts.localeCompare(x.ts));
  return a.slice(0, limiet);
}

// — Diagnostiek —

export async function telAlles() {
  const d = await db();
  const stores = [
    'schooljaren',
    'klassen',
    'leerlingen',
    'inschrijvingen',
    'kalenderitems',
    'roosterslots',
    'aanwezigheid',
    'beloningen',
    'aankopen',
    'observaties',
    'quota',
  ];
  const out = {};
  for (const s of stores) out[s] = await d.count(s);
  return out;
}

export { uid };
