// Puntenboek: gewogen gemiddelde per leerling. Punten zijn een hulpmiddel voor de
// leerkracht; ze blijven lokaal en privaat (geen ranking, geen labels).

import { byIndex, leerlingenVanKlas } from '../db/repo.js';

/**
 * Bouw het puntenboek voor een klas.
 * @returns {Promise<{evaluaties, leerlingen, resultaat:(l,e)=>obj|undefined, gemiddelde:Map<string,number|null>}>}
 */
export async function puntenboek(klasId) {
  const [evaluaties, resultaten, leerlingen] = await Promise.all([
    byIndex('evaluaties', 'klasId', klasId),
    byIndex('evalresultaten', 'klasId', klasId),
    leerlingenVanKlas(klasId),
  ]);
  evaluaties.sort((a, b) => (a.datum || '').localeCompare(b.datum || ''));
  const map = new Map(); // leerlingId|evaluatieId -> resultaat
  for (const r of resultaten) map.set(`${r.leerlingId}|${r.evaluatieId}`, r);

  const gemiddelde = new Map();
  for (const l of leerlingen) {
    let gewogenSom = 0;
    let gewichtSom = 0;
    for (const e of evaluaties) {
      const r = map.get(`${l.id}|${e.id}`);
      if (!r || r.afwezig || r.punten == null || !e.maxPunten) continue;
      const pct = (r.punten / e.maxPunten) * 100;
      const g = e.gewicht || 100;
      gewogenSom += pct * g;
      gewichtSom += g;
    }
    gemiddelde.set(l.id, gewichtSom ? Math.round((gewogenSom / gewichtSom) * 10) / 10 : null);
  }

  return {
    evaluaties,
    leerlingen,
    resultaat: (leerlingId, evaluatieId) => map.get(`${leerlingId}|${evaluatieId}`),
    gemiddelde,
  };
}
