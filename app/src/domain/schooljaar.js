// Schooljaar & kalender: "genereer schooljaar" = wekelijks rooster × schooljaar − vakanties.
// Puur rekenwerk op datums; niets wordt hier bewaard (de view beslist wat opgeslagen wordt).

/** ISO-datum (YYYY-MM-DD) → Date op lokale middernacht. */
export function parseDatum(s) {
  const [j, m, d] = s.split('-').map(Number);
  return new Date(j, m - 1, d);
}

/** Date → ISO-datum (YYYY-MM-DD). */
export function isoDatum(date) {
  const j = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${j}-${m}-${d}`;
}

/** Weekdag 1=maandag … 7=zondag (zoals in roosterslots). */
export function weekdag(date) {
  const d = date.getDay(); // 0=zondag
  return d === 0 ? 7 : d;
}

/** Valt `datum` binnen een kalenderitem (vakantie/vrije dag)? */
export function isVrij(datumIso, kalenderitems) {
  return kalenderitems.some((k) => datumIso >= k.van && datumIso <= k.tot);
}

/**
 * Genereer alle concrete lesmomenten voor een klas over het schooljaar.
 * @param {{start:string, eind:string}} schooljaar
 * @param {Array<{dag:number, lesuur?:string, start?:string, eind?:string, lokaal?:string}>} slots  wekelijkse roosterslots van de klas
 * @param {Array<{van:string, tot:string}>} kalenderitems  vakanties/vrije dagen
 * @returns {Array<{datum:string, dag:number, slot:object}>}
 */
export function genereerLesmomenten(schooljaar, slots, kalenderitems = []) {
  if (!schooljaar?.start || !schooljaar?.eind || !slots?.length) return [];
  const perDag = new Map(); // dag → slots
  for (const s of slots) {
    if (!perDag.has(s.dag)) perDag.set(s.dag, []);
    perDag.get(s.dag).push(s);
  }
  const out = [];
  const einde = parseDatum(schooljaar.eind);
  for (let d = parseDatum(schooljaar.start); d <= einde; d.setDate(d.getDate() + 1)) {
    const dag = weekdag(d);
    const dagSlots = perDag.get(dag);
    if (!dagSlots) continue;
    const iso = isoDatum(d);
    if (isVrij(iso, kalenderitems)) continue;
    for (const slot of dagSlots) out.push({ datum: iso, dag, slot });
  }
  out.sort((a, b) => a.datum.localeCompare(b.datum) || (a.slot.start || '').localeCompare(b.slot.start || ''));
  return out;
}

/** Tel les-weken en lesmomenten samen voor een overzicht. */
export function samenvatting(lesmomenten) {
  const weken = new Set();
  for (const l of lesmomenten) {
    const d = parseDatum(l.datum);
    const donderdag = new Date(d);
    donderdag.setDate(d.getDate() - ((weekdag(d) + 3) % 7)); // ISO-weekanker
    weken.add(isoDatum(donderdag));
  }
  return { lesmomenten: lesmomenten.length, weken: weken.size };
}

/** Genereer een default label uit twee jaartallen, bv. 2026 → "2026-2027". */
export function defaultLabel(startjaar) {
  return `${startjaar}-${startjaar + 1}`;
}
