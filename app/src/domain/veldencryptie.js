// Veld-encryptie "at rest" (roadmap A6): gevoelige vrije-tekstvelden worden versleuteld
// opgeslagen (AES-GCM) met een sleutel afgeleid uit de pincode (PBKDF2). Transparant via
// de repo-hooks: de views merken er niets van. Zonder pincode/sleutel: alles plein-tekst.

import { setCryptoHooks, getSetting, setSetting, all, put } from '../db/repo.js';

// Enkel de écht persoonlijke, feitelijke vrije tekst. Deze velden worden altijd via
// repo.get/byIndex/all gelezen (dus de hooks vangen ze), nooit via de rauwe Idb.
const VELDEN = {
  observaties: ['aanleiding', 'gedrag', 'gevolg'],
  notities: ['tekst'],
  consequenties: ['note'],
};

const ITER = 150000;
const enc = new TextEncoder();
const dec = new TextDecoder();
let sleutel = null;

function b64(buf) { const b = new Uint8Array(buf); let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000)); return btoa(s); }
function unb64(str) { const bin = atob(str); const out = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; }

async function deriveKey(pin, salt) {
  const mat = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, mat, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

async function encStr(klaar) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const c = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, sleutel, enc.encode(klaar));
  const buf = new Uint8Array(iv.length + c.byteLength); buf.set(iv, 0); buf.set(new Uint8Array(c), iv.length);
  return { __enc: b64(buf) };
}
async function decStr(obj) {
  const buf = unb64(obj.__enc); const iv = buf.slice(0, 12); const data = buf.slice(12);
  const p = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, sleutel, data);
  return dec.decode(p);
}

async function encRec(store, rec) {
  const velden = VELDEN[store];
  if (!sleutel || !velden || !rec) return rec;
  const kopie = { ...rec };
  for (const f of velden) { const v = kopie[f]; if (typeof v === 'string' && v.length) kopie[f] = await encStr(v); }
  return kopie;
}
async function decRec(store, rec) {
  const velden = VELDEN[store];
  if (!velden || !rec) return rec;
  const kopie = { ...rec };
  for (const f of velden) {
    const v = kopie[f];
    if (v && typeof v === 'object' && v.__enc) {
      if (sleutel) { try { kopie[f] = await decStr(v); } catch (_) { kopie[f] = '🔒'; } }
      else kopie[f] = '🔒 vergrendeld';
    }
  }
  return kopie;
}

/** Registreer de hooks (één keer, bij het opstarten). */
export function initEncryptie() { setCryptoHooks({ enc: encRec, dec: decRec }); }

export function heeftSleutel() { return !!sleutel; }
export function wisSleutel() { sleutel = null; }

/** Leid de sleutel af na een correcte pincode (bij het ontgrendelen). */
export async function ontgrendelSleutel(pin) {
  const e = await getSetting('enc', null);
  if (!e?.salt) return false;
  sleutel = await deriveKey(pin, unb64(e.salt));
  return true;
}

/** Zet encryptie AAN (of her-encrypteer met een nieuwe pincode): versleutel bestaande data. */
export async function versleutelAlles(pin) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  await setSetting('enc', { salt: b64(salt) });
  sleutel = await deriveKey(pin, salt);
  for (const store of Object.keys(VELDEN)) {
    for (const rec of await all(store)) await put(store, rec); // all() = plein-tekst, put() versleutelt
  }
}

/** Zet encryptie UIT: ontsleutel bestaande data terug naar plein-tekst. */
export async function ontsleutelAlles() {
  if (sleutel) {
    const snapshot = {};
    for (const store of Object.keys(VELDEN)) snapshot[store] = await all(store); // ontsleuteld
    sleutel = null; // hooks worden no-op
    for (const store of Object.keys(VELDEN)) for (const rec of snapshot[store]) await put(store, rec); // plein-tekst
  }
  await setSetting('enc', null);
}
