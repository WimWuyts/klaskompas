// Individueel spoor (ADR-0001 §2.2/§2.4): quota-tellers met seinen, consequentieladder,
// en de aggregatie voor de leerlingfiche. Feitelijk en privaat; geen scores of labels.
// Dit spoor staat LOS van de klaspot (individueel gedrag raakt de pot niet, tenzij optie C).

import { get, put, byIndex } from '../db/repo.js';
import { maakConsequentie } from './model.js';

const huidigeMaand = () => new Date().toISOString().slice(0, 7);

/** Verhoog een teller met 1. Reset automatisch bij een nieuwe maand. @returns {quota, sein} */
export async function verhoogQuota(quotaId) {
  const q = await get('quota', quotaId);
  if (!q) return null;
  if (q.maand !== huidigeMaand()) {
    q.maand = huidigeMaand();
    q.aantal = 0;
  }
  q.aantal += 1;
  q.laatst = new Date().toISOString();
  await put('quota', q);
  return { quota: q, sein: q.aantal >= q.drempel };
}

/** Verlaag een teller met 1 (correctie), niet onder 0. */
export async function verlaagQuota(quotaId) {
  const q = await get('quota', quotaId);
  if (!q) return null;
  q.aantal = Math.max(0, q.aantal - 1);
  await put('quota', q);
  return { quota: q, sein: q.aantal >= q.drempel };
}

/** Log een gezette stap op de consequentieladder. */
export async function logConsequentie({ leerlingId, klasId, stap, note = '', observatieId = null }) {
  const c = maakConsequentie({ leerlingId, klasId, stap, note, observatieId });
  await put('consequenties', c);
  return c;
}

/**
 * Alles wat op de leerlingfiche hoort, in één keer opgehaald.
 * @returns {Promise<{leerling, aanwezigheid, observaties, quota, consequenties, inhaalwerk, notities, seinen}>}
 */
export async function ficheData(leerlingId) {
  const leerling = await get('leerlingen', leerlingId);
  const [aanw, observaties, quota, consequenties, inhaalwerk, notities] = await Promise.all([
    byIndex('aanwezigheid', 'leerlingId', leerlingId),
    byIndex('observaties', 'leerlingId', leerlingId),
    byIndex('quota', 'leerlingId', leerlingId),
    byIndex('consequenties', 'leerlingId', leerlingId),
    byIndex('inhaalwerk', 'leerlingId', leerlingId),
    byIndex('notities', 'leerlingId', leerlingId),
  ]);
  const aanwStats = { aanwezig: 0, telaat: 0, gewettigd: 0, ongewettigd: 0, deel: 0 };
  for (const a of aanw) if (a.status in aanwStats) aanwStats[a.status]++;
  const sorteerNieuw = (a, b) => (b.datum || '').localeCompare(a.datum || '');
  observaties.sort(sorteerNieuw);
  consequenties.sort(sorteerNieuw);
  notities.sort(sorteerNieuw);
  const seinen = quota.filter((q) => q.maand === huidigeMaand() && q.aantal >= q.drempel);
  return { leerling, aanwezigheid: aanwStats, observaties, quota, consequenties, inhaalwerk, notities, seinen };
}
