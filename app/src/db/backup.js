// Echte backup (JSON) en echte merge-import (CSV + JSON).
// Lost de prototype-zwakte op waarbij "import" de volledige state overschreef.

import { db } from './repo.js';
import { STORES } from './schema.js';
import {
  uid,
  maakLeerling,
  maakKlas,
  maakInschrijving,
  dedupSleutel,
} from '../domain/model.js';

// ————————————————————————————————————————————————— CSV —————

/** Robuuste CSV-parser (ondersteunt quotes, komma's en puntkomma's). */
export function parseCsv(text) {
  const rows = [];
  let veld = '';
  let rij = [];
  let inQuote = false;
  const sep = kiesScheidingsteken(text);
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuote) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          veld += '"';
          i++;
        } else inQuote = false;
      } else veld += c;
    } else if (c === '"') {
      inQuote = true;
    } else if (c === sep) {
      rij.push(veld);
      veld = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      rij.push(veld);
      veld = '';
      if (rij.some((v) => v.trim() !== '')) rows.push(rij);
      rij = [];
    } else veld += c;
  }
  if (veld !== '' || rij.length) {
    rij.push(veld);
    if (rij.some((v) => v.trim() !== '')) rows.push(rij);
  }
  return rows;
}

function kiesScheidingsteken(text) {
  const eersteRegel = text.split(/\r?\n/, 1)[0] || '';
  return (eersteRegel.match(/;/g) || []).length > (eersteRegel.match(/,/g) || []).length
    ? ';'
    : ',';
}

const KOLOM_ALIASSEN = {
  voornaam: ['voornaam', 'firstname', 'first_name', 'first'],
  naam: ['naam', 'achternaam', 'lastname', 'last_name', 'last', 'familienaam'],
  volledige: ['volledige_naam', 'volledige naam', 'naam volledig', 'leerling', 'student', 'fullname', 'name'],
  klas: ['klas', 'class', 'class_name', 'klasgroep', 'groep'],
  email: ['email', 'e-mail', 'mail'],
};

function mapKoppen(koppen) {
  const norm = koppen.map((k) => k.trim().toLowerCase());
  const idx = {};
  for (const [veld, aliassen] of Object.entries(KOLOM_ALIASSEN)) {
    idx[veld] = norm.findIndex((k) => aliassen.includes(k));
  }
  return idx;
}

/** Splits "Achternaam, Voornaam" of "Voornaam Achternaam". */
function splitNaam(volledig) {
  const s = (volledig || '').trim();
  if (s.includes(',')) {
    const [a, v] = s.split(',');
    return { voornaam: (v || '').trim(), naam: (a || '').trim() };
  }
  const delen = s.split(/\s+/);
  if (delen.length === 1) return { voornaam: delen[0], naam: '' };
  return { voornaam: delen[0], naam: delen.slice(1).join(' ') };
}

/**
 * Importeer leerlingen/klassen uit CSV met ECHTE merge:
 * bestaande leerlingen (zelfde dedup-sleutel) worden hergebruikt, niet gedupliceerd;
 * bestaande klassen (zelfde naam binnen het schooljaar) idem; dubbele inschrijvingen worden overgeslagen.
 * @returns {Promise<{nieuweLeerlingen:number, hergebruikt:number, nieuweKlassen:number, nieuweInschrijvingen:number, overgeslagen:number, rijen:number}>}
 */
export async function importeerCsv(text, { schooljaarId = null } = {}) {
  const d = await db();
  const rows = parseCsv(text);
  const res = {
    rijen: 0,
    nieuweLeerlingen: 0,
    hergebruikt: 0,
    nieuweKlassen: 0,
    nieuweInschrijvingen: 0,
    overgeslagen: 0,
  };
  if (rows.length < 2) return res;

  const idx = mapKoppen(rows[0]);
  const heeftKoppen = Object.values(idx).some((v) => v >= 0);
  const dataRijen = heeftKoppen ? rows.slice(1) : rows;

  // Caches om binnen één import niet telkens de db te bevragen.
  const leerlingCache = new Map(); // sleutel -> leerlingId
  for (const l of await d.getAll('leerlingen')) leerlingCache.set(l.sleutel, l.id);
  const klasCache = new Map(); // naam|schooljaar -> klasId
  for (const k of await d.getAll('klassen')) klasCache.set(`${k.naam}|${k.schooljaarId}`, k.id);
  const inschrijvingSet = new Set(); // leerlingId|klasId
  for (const i of await d.getAll('inschrijvingen')) inschrijvingSet.add(`${i.leerlingId}|${i.klasId}`);

  for (const rij of dataRijen) {
    const cel = (v) => (v >= 0 && rij[v] != null ? String(rij[v]).trim() : '');
    let voornaam = cel(idx.voornaam);
    let naam = cel(idx.naam);
    if (!voornaam && !naam && idx.volledige >= 0) {
      ({ voornaam, naam } = splitNaam(cel(idx.volledige)));
    }
    if (!voornaam && !naam) {
      // geen koppen? probeer eerste twee kolommen als voornaam/naam
      if (!heeftKoppen && rij.length >= 1) ({ voornaam, naam } = splitNaam(rij.slice(0, 2).join(' ')));
    }
    if (!voornaam && !naam) {
      res.overgeslagen++;
      continue;
    }
    res.rijen++;
    const email = cel(idx.email);
    const klasNaam = cel(idx.klas);

    // Leerling — merge op dedup-sleutel.
    const sleutel = dedupSleutel(voornaam, naam);
    let leerlingId = leerlingCache.get(sleutel);
    if (leerlingId) {
      res.hergebruikt++;
      if (email) {
        const l = await d.get('leerlingen', leerlingId);
        if (l && !l.email) {
          l.email = email;
          await d.put('leerlingen', l);
        }
      }
    } else {
      const l = maakLeerling({ voornaam, naam, email });
      await d.put('leerlingen', l);
      leerlingCache.set(sleutel, l.id);
      leerlingId = l.id;
      res.nieuweLeerlingen++;
    }

    // Klas — merge op naam binnen schooljaar.
    if (klasNaam) {
      const klasKey = `${klasNaam}|${schooljaarId}`;
      let klasId = klasCache.get(klasKey);
      if (!klasId) {
        const k = maakKlas({ naam: klasNaam, schooljaarId });
        await d.put('klassen', k);
        klasCache.set(klasKey, k.id);
        klasId = k.id;
        res.nieuweKlassen++;
      }
      // Inschrijving — sla dubbele over.
      const isKey = `${leerlingId}|${klasId}`;
      if (!inschrijvingSet.has(isKey)) {
        await d.put('inschrijvingen', maakInschrijving({ leerlingId, klasId, schooljaarId }));
        inschrijvingSet.add(isKey);
        res.nieuweInschrijvingen++;
      }
    }
  }
  return res;
}

// ———————————————————————————————————————————————— JSON —————

/** Volledige backup als één object (met versie-informatie). */
export async function exporteerAlles() {
  const d = await db();
  const data = {};
  for (const def of STORES) {
    if (def.name === 'meta') continue;
    data[def.name] = await d.getAll(def.name);
  }
  const meta = (await d.get('meta', 'app')) || {};
  return {
    formaat: 'klaskompas-backup',
    versie: 1,
    appVersie: meta.appVersie || '0.1.0',
    geexporteerd: new Date().toISOString(),
    data,
  };
}

/** Download de backup als bestand. */
export async function downloadBackup() {
  const backup = await exporteerAlles();
  const datum = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `klaskompas-backup-${datum}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Importeer een JSON-backup.
 * @param {object} backup
 * @param {'merge'|'vervang'} strategie merge = upsert per id; vervang = eerst wissen.
 */
export async function importeerBackup(backup, strategie = 'merge') {
  if (!backup || backup.formaat !== 'klaskompas-backup') {
    throw new Error('Dit is geen geldige Klaskompas-backup.');
  }
  const d = await db();
  const res = { stores: 0, records: 0 };
  for (const def of STORES) {
    const records = backup.data?.[def.name];
    if (!Array.isArray(records)) continue;
    if (strategie === 'vervang') await d.clear(def.name);
    for (const rec of records) {
      // upsert; ontbrekende id's krijgen er één zodat niets stilletjes verdwijnt
      if (def.key === 'id' && !rec.id) rec.id = uid();
      await d.put(def.name, rec);
      res.records++;
    }
    res.stores++;
  }
  return res;
}
