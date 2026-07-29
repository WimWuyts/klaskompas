// Zitplan-generator (OD-8): plaatst leerlingen in een raster met randvoorwaarden ("slotjes").
// Regels: vaste plaats, vast vooraan, vast achteraan, en "niet naast elkaar".
// Best-effort met herhaalde pogingen; niet-oplosbare regels worden teruggemeld i.p.v. genegeerd.

export function rasterAfmeting(n, kolommen = 4) {
  const cols = Math.min(kolommen, Math.max(1, n));
  const rijen = Math.max(1, Math.ceil(n / cols));
  return { rijen, kolommen: cols };
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * @param {Array<{id:string}>} leerlingen
 * @param {Array} regels  zitregels (zie model.maakZitregel)
 * @param {{kolommen?:number}} opties
 * @returns {{plaatsen:Array<{leerlingId,rij,kol}>, rijen:number, kolommen:number, onopgelost:string[]}}
 */
export function genereerZitplan(leerlingen, regels = [], { kolommen = 4 } = {}) {
  const ids = leerlingen.map((l) => l.id);
  const naam = new Map(leerlingen.map((l) => [l.id, `${l.voornaam || ''} ${l.naam || ''}`.trim()]));
  const n = ids.length;
  const { rijen, kolommen: cols } = rasterAfmeting(n, kolommen);
  const grensVoor = Math.ceil(rijen / 2);

  const vast = new Map();
  const vooraan = new Set();
  const achteraan = new Set();
  const nietnaast = [];
  for (const r of regels) {
    if (r.type === 'vasteplaats' && r.leerlingId != null && r.rij != null && r.kol != null) vast.set(r.leerlingId, { rij: r.rij, kol: r.kol });
    else if (r.type === 'vastvooraan' && r.leerlingId) vooraan.add(r.leerlingId);
    else if (r.type === 'vastachteraan' && r.leerlingId) achteraan.add(r.leerlingId);
    else if (r.type === 'nietnaast' && r.leerlingId && r.leerlingId2) nietnaast.push([r.leerlingId, r.leerlingId2]);
  }

  const alleCellen = [];
  for (let rij = 0; rij < rijen; rij++) for (let kol = 0; kol < cols; kol++) alleCellen.push({ rij, kol });
  const cK = (c) => `${c.rij},${c.kol}`;

  const telSchendingen = (plek) => {
    let s = 0;
    for (const [a, b] of nietnaast) {
      const pa = plek.get(a);
      const pb = plek.get(b);
      if (pa && pb && pa.rij === pb.rij && Math.abs(pa.kol - pb.kol) === 1) s++;
    }
    return s;
  };

  const probeer = () => {
    const plek = new Map();
    const bezet = new Set();
    // 1) vaste plaatsen
    for (const [id, pos] of vast) {
      if (id && ids.includes(id) && pos.rij < rijen && pos.kol < cols && !bezet.has(cK(pos))) {
        plek.set(id, pos);
        bezet.add(cK(pos));
      }
    }
    const vrij = alleCellen.filter((c) => !bezet.has(cK(c)));
    const teplaatsen = ids.filter((id) => !plek.has(id));
    const front = shuffle(vrij.filter((c) => c.rij < grensVoor));
    const back = shuffle(vrij.filter((c) => c.rij >= grensVoor));
    const rest = shuffle([...vrij]);
    const gebruikt = new Set();
    const pak = (pool) => {
      while (pool.length) {
        const c = pool.pop();
        if (!gebruikt.has(cK(c))) { gebruikt.add(cK(c)); return c; }
      }
      return null;
    };
    const onopgelost = [];
    const mustFront = teplaatsen.filter((id) => vooraan.has(id));
    const mustBack = teplaatsen.filter((id) => achteraan.has(id) && !vooraan.has(id));
    const overige = teplaatsen.filter((id) => !vooraan.has(id) && !achteraan.has(id));
    for (const id of mustFront) { const c = pak(front) || pak(rest); if (c) plek.set(id, c); else onopgelost.push(`Geen plaats voor ${naam.get(id)}`); }
    for (const id of mustBack) { const c = pak(back) || pak(rest); if (c) plek.set(id, c); else onopgelost.push(`Geen plaats voor ${naam.get(id)}`); }
    const restCellen = shuffle(alleCellen.filter((c) => !gebruikt.has(cK(c)) && !bezet.has(cK(c))));
    for (const id of overige) { const c = restCellen.pop(); if (c) { plek.set(id, c); gebruikt.add(cK(c)); } else onopgelost.push(`Geen plaats voor ${naam.get(id)}`); }
    return { plek, onopgelost };
  };

  let beste = null;
  for (let i = 0; i < 400; i++) {
    const r = probeer();
    const score = telSchendingen(r.plek) + r.onopgelost.length;
    if (!beste || score < beste.score) beste = { ...r, score };
    if (score === 0) break;
  }

  const onopgelost = [...beste.onopgelost];
  const rest = telSchendingen(beste.plek);
  if (rest > 0) onopgelost.push(`${rest}× "niet naast elkaar" kon niet volledig worden gerespecteerd`);

  const plaatsen = [...beste.plek.entries()].map(([leerlingId, pos]) => ({ leerlingId, rij: pos.rij, kol: pos.kol }));
  return { plaatsen, rijen, kolommen: cols, onopgelost };
}
