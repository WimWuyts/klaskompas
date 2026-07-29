// Beveiliging (rest van OD-5): app-lock met pincode (PBKDF2) en een optioneel
// VERSLEUTELDE backup (AES-GCM). Alles gebeurt lokaal met de Web Crypto API;
// er verlaat niets het toestel. De pincode zelf wordt nooit bewaard — enkel een hash.

import { getSetting, setSetting } from '../db/repo.js';
import { exporteerAlles } from '../db/backup.js';

const ITER = 150000;
const enc = new TextEncoder();

// — base64 helpers (chunked, veilig voor grote buffers) —
function b64(buf) {
  const bytes = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}
function unb64(str) {
  const bin = atob(str);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function pbkdf2Bits(geheim, salt, lengte = 256) {
  const mat = await crypto.subtle.importKey('raw', enc.encode(geheim), 'PBKDF2', false, ['deriveBits']);
  return crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, mat, lengte);
}

async function aesSleutel(passphrase, salt) {
  const mat = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' },
    mat,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

// ————————————————————————————————— app-lock —————

export async function lockStatus() {
  return (await getSetting('lock', null)) || { enabled: false };
}

/** Stel een pincode in (of wijzig ze). */
export async function stelPinIn(pin) {
  if (!pin || pin.length < 4) throw new Error('Kies een pincode van minstens 4 tekens.');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2Bits(pin, salt);
  await setSetting('lock', { enabled: true, salt: b64(salt), hash: b64(hash), iter: ITER });
  return true;
}

/** Controleer een pincode tegen de bewaarde hash (constante-tijd-vergelijking). */
export async function controleerPin(pin) {
  const lock = await getSetting('lock', null);
  if (!lock?.enabled) return true;
  const salt = unb64(lock.salt);
  const hash = new Uint8Array(await pbkdf2Bits(pin, salt));
  const ref = unb64(lock.hash);
  if (hash.length !== ref.length) return false;
  let diff = 0;
  for (let i = 0; i < hash.length; i++) diff |= hash[i] ^ ref[i];
  return diff === 0;
}

/** Schakel de app-lock uit (vereist de juiste pincode). */
export async function zetLockAf(pin) {
  if (!(await controleerPin(pin))) throw new Error('Verkeerde pincode.');
  await setSetting('lock', { enabled: false });
  return true;
}

// ————————————————————————————————— versleutelde backup —————

/** Exporteer een volledige, versleutelde backup (met een wachtwoord). */
export async function exporteerVersleuteld(passphrase) {
  if (!passphrase || passphrase.length < 6) throw new Error('Kies een wachtwoord van minstens 6 tekens.');
  const backup = await exporteerAlles();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const sleutel = await aesSleutel(passphrase, salt);
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, sleutel, enc.encode(JSON.stringify(backup)));
  return {
    formaat: 'klaskompas-backup-versleuteld',
    versie: 1,
    salt: b64(salt),
    iv: b64(iv),
    data: b64(cipher),
  };
}

/** Ontsleutel een versleutelde backup → geeft het gewone backup-object terug. */
export async function ontsleutelBackup(obj, passphrase) {
  if (obj?.formaat !== 'klaskompas-backup-versleuteld') throw new Error('Dit is geen versleutelde Klaskompas-backup.');
  const salt = unb64(obj.salt);
  const iv = unb64(obj.iv);
  const sleutel = await aesSleutel(passphrase, salt);
  let plat;
  try {
    plat = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, sleutel, unb64(obj.data));
  } catch (_) {
    throw new Error('Ontsleutelen mislukt — verkeerd wachtwoord?');
  }
  return JSON.parse(new TextDecoder().decode(plat));
}

/** Download een versleutelde backup als bestand. */
export async function downloadVersleuteldeBackup(passphrase) {
  const obj = await exporteerVersleuteld(passphrase);
  const datum = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `klaskompas-backup-versleuteld-${datum}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
