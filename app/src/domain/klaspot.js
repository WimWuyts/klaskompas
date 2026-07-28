// Klaskapitaal-economie (ADR-0001 §2.1). Puur rekenwerk + persistentie.
// Elke beweging wordt gelogd (transparantie). De module straft nooit automatisch:
// ze berekent en bewaart; de leerkracht triggert elke handeling (§2.4).

import { getPot, bewaarPot, get, put } from '../db/repo.js';
import { maakPotEvent } from './model.js';

/** Haal saldo + config samen op voor een klas. */
export async function potStatus(klasId) {
  const pot = await getPot(klasId);
  const klas = await get('klassen', klasId);
  const config = klas?.config || {};
  return {
    saldo: pot.saldo,
    config,
    prijsBereikt: pot.saldo >= (config.prijsdrempel ?? Infinity),
    onderHerstart: pot.saldo <= (config.herstartdrempel ?? -Infinity),
    aanBodem: pot.saldo <= (config.bodem ?? 0),
  };
}

/**
 * Beweeg de pot met `delta` euro (positief = verdienen, negatief = verliezen).
 * Respecteert de bodem. Logt het event. @returns het nieuwe potStatus-object.
 */
export async function beweeg(klasId, delta, { reden = '', bron = 'handmatig' } = {}) {
  const pot = await getPot(klasId);
  const klas = await get('klassen', klasId);
  const config = klas?.config || {};
  const bodem = config.bodem ?? 0;
  const nieuw = Math.max(bodem, Math.round((pot.saldo + delta) * 100) / 100);
  const echteDelta = Math.round((nieuw - pot.saldo) * 100) / 100;
  pot.saldo = nieuw;
  await bewaarPot(pot);
  if (echteDelta !== 0 || delta !== 0) {
    await put('potEvents', maakPotEvent({ klasId, delta: echteDelta, saldoNa: nieuw, reden, bron }));
  }
  return potStatus(klasId);
}

/** Verdien één stap (of een veelvoud). */
export function verdien(klasId, stappen = 1, reden = '', bron = 'handmatig') {
  return metStap(klasId, +1, stappen, reden, bron);
}

/** Verlies één stap (collectief negatief gedrag). */
export function verlies(klasId, stappen = 1, reden = '', bron = 'handmatig') {
  return metStap(klasId, -1, stappen, reden, bron);
}

async function metStap(klasId, richting, stappen, reden, bron) {
  const klas = await get('klassen', klasId);
  const stap = klas?.config?.stapbedrag ?? 1;
  return beweeg(klasId, richting * stap * stappen, { reden, bron });
}

/** Zet de pot terug op het startkapitaal (na een prijs of bij een verse start). */
export async function reset(klasId, reden = 'Herstart / nieuwe cyclus') {
  const klas = await get('klassen', klasId);
  const start = klas?.config?.startkapitaal ?? 0;
  const pot = await getPot(klasId);
  const delta = Math.round((start - pot.saldo) * 100) / 100;
  pot.saldo = start;
  await bewaarPot(pot);
  await put('potEvents', maakPotEvent({ klasId, delta, saldoNa: start, reden, bron: 'herstart' }));
  return potStatus(klasId);
}

/** Trek een prijsbedrag af (bij het inwisselen van een beloning). */
export async function geefUit(klasId, bedrag, reden = 'Beloning ingewisseld') {
  return beweeg(klasId, -Math.abs(bedrag), { reden, bron: 'beloning' });
}

/** Pas de per-klas configuratie aan (bewaart ook mee in de pot-momentopname). */
export async function updateConfig(klasId, patch) {
  const klas = await get('klassen', klasId);
  if (!klas) return null;
  klas.config = { ...klas.config, ...patch };
  await put('klassen', klas);
  return klas.config;
}
