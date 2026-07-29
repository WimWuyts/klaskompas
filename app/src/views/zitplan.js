// Zitplan (OD-8): raster met randvoorwaarden ("slotjes"), genereren/schudden en bewaren.
// Toont enkel neutrale zitinfo; persoonlijke notities blijven in Administratie.

import { el, leeg, toast, dialoog, keuze, veld, leegKaart, stijl } from '../ui/components.js';
import { get, put, remove, byIndex, leerlingenVanKlas } from '../db/repo.js';
import { ZITREGEL_TYPE, maakZitregel } from '../domain/model.js';
import { genereerZitplan } from '../domain/zitplan.js';

const KOLOMMEN = 4;

const ZITSTIJL = `
.zp-kop { align-items: flex-start; }
.zp-room {
  overflow-x: auto;
  border: 1px solid var(--rand);
  border-radius: var(--radius-s);
  background: var(--paneel-2);
  padding: 0 0 4px;
}
.zp-board {
  min-height: 40px;
  margin-bottom: 12px;
  display: grid;
  place-items: center;
  border-bottom: 1px solid var(--rand);
  border-radius: var(--radius-s) var(--radius-s) 0 0;
  color: #fff;
  background: linear-gradient(180deg, var(--accent), var(--groen));
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.02em;
}
.zp-seats {
  min-width: 560px;
  padding: 4px 12px 12px;
  display: grid;
  gap: 14px;
}
.zp-seat {
  position: relative;
  min-height: 88px;
  padding: 15px 8px 9px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--rand);
  border-radius: 11px;
  background: var(--paneel);
  box-shadow: 0 3px 7px rgba(20, 40, 25, 0.08);
}
.zp-seat::before {
  content: "";
  position: absolute;
  top: -11px;
  left: 50%;
  width: 46%;
  height: 13px;
  transform: translateX(-50%);
  border: 1px solid var(--accent);
  border-bottom: 0;
  border-radius: 8px 8px 0 0;
  background: var(--accent);
  opacity: 0.85;
}
.zp-seat--leeg {
  border-style: dashed;
  background: var(--paneel-2);
  box-shadow: none;
}
.zp-seat--leeg::before { opacity: 0.3; }
.zp-seat--slot { border-color: var(--goud); }
.zp-naam {
  font-size: 0.84rem;
  font-weight: 800;
  line-height: 1.1;
  text-align: center;
  color: var(--tekst);
}
.zp-leegtekst { color: var(--tekst-zacht); font-size: 0.72rem; font-style: italic; }
.zp-slot {
  font-size: 0.62rem;
  font-weight: 750;
  padding: 2px 7px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--goud) 22%, var(--paneel));
  color: color-mix(in srgb, var(--goud) 55%, var(--tekst));
  white-space: nowrap;
}
.zp-onopgelost {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  margin-top: 12px;
}
.zp-regellijst { list-style: none; margin: 0 0 12px; padding: 0; display: grid; gap: 8px; }
.zp-regel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 11px;
  border: 1px solid var(--rand);
  border-radius: var(--radius-s);
  background: var(--paneel-2);
}
.zp-regel__tekst { font-size: 0.85rem; }
.zp-regel__type { font-weight: 700; }
.zp-nota { margin-top: 14px; display: flex; align-items: flex-start; gap: 8px; font-size: 0.72rem; }
`;

/** Korte badgetekst per zitregel-type. */
const SLOT_TEKST = {
  vastvooraan: 'vast vooraan',
  vastachteraan: 'vast achteraan',
  vasteplaats: 'vaste plaats',
  nietnaast: 'niet naast',
};

function volledigeNaam(l) {
  return `${l?.voornaam || ''} ${l?.naam || ''}`.trim() || '—';
}

export async function render(root, ctx) {
  stijl('css-zitplan', ZITSTIJL);
  leeg(root);

  if (!ctx.klasId) {
    root.append(
      leegKaart('Geen actieve klas', 'Kies bovenaan een klas om een zitplan te maken.'),
    );
    return;
  }

  const klas = await get('klassen', ctx.klasId);
  const leerlingen = await leerlingenVanKlas(ctx.klasId);
  const naamVan = new Map(leerlingen.map((l) => [l.id, l]));

  // Huidig getoond plan: bewaard plan of een net gegenereerd (nog niet opgeslagen) plan.
  let plan = await get('zitplannen', ctx.klasId);
  let bewaard = !!plan;

  async function laadRegels() {
    return byIndex('zitregels', 'klasId', ctx.klasId);
  }

  /** Bouw een map leerlingId -> korte slottekst op basis van de zitregels. */
  function slotMap(regels) {
    const m = new Map();
    for (const r of regels) {
      if (r.leerlingId) m.set(r.leerlingId, SLOT_TEKST[r.type] || 'vast');
      if (r.type === 'nietnaast' && r.leerlingId2) m.set(r.leerlingId2, SLOT_TEKST.nietnaast);
    }
    return m;
  }

  async function teken() {
    leeg(root);
    const regels = await laadRegels();
    const slots = slotMap(regels);

    // — kop met acties —
    root.append(
      el('div', { class: 'kaart__kop kaart__kop--los zp-kop' },
        el('div', {},
          el('h2', {}, 'Zitplan'),
          el('p', { class: 'zacht' },
            klas?.naam ? `${klas.naam} · ${leerlingen.length} leerlingen` : `${leerlingen.length} leerlingen`),
        ),
        el('div', { class: 'knoprij' },
          el('button', { class: 'knop', onClick: () => randvoorwaardenDialoog() }, '⚙ Randvoorwaarden'),
          el('button', { class: 'knop', onClick: () => genereer() }, '⤨ Genereer/Schud plaatsen'),
          el('button', { class: 'knop knop--primair', onClick: () => bewaar() }, '💾 Bewaar plan'),
        ),
      ),
    );

    const kaart = el('div', { class: 'kaart' });

    if (!leerlingen.length) {
      kaart.append(
        el('div', { class: 'leeg' },
          el('div', { class: 'leeg__icoon' }, '🪑'),
          el('h3', {}, 'Nog geen leerlingen'),
          el('p', {}, 'Voeg eerst leerlingen toe aan deze klas via Klassen & leerlingen.'),
        ),
      );
      root.append(kaart);
      restNota();
      return;
    }

    if (!plan || !plan.plaatsen?.length) {
      kaart.append(
        el('div', { class: 'leeg' },
          el('div', { class: 'leeg__icoon' }, '🪑'),
          el('h3', {}, 'Nog geen zitplan'),
          el('p', {}, 'Genereer een plaatsing; randvoorwaarden ("slotjes") worden zo goed mogelijk gerespecteerd.'),
          el('button', { class: 'knop knop--primair', onClick: () => genereer() }, '⤨ Genereer plaatsen'),
        ),
      );
      root.append(kaart);
      restNota();
      return;
    }

    // — statusregel (bewaard / niet bewaard) —
    kaart.append(
      el('div', { class: 'knoprij', style: { marginBottom: '10px' } },
        el('span', { class: bewaard ? 'badge' : 'badge badge--stil' },
          bewaard ? '💾 Bewaard plan' : '● Niet bewaard'),
        regels.length ? el('span', { class: 'badge badge--stil' }, `🔒 ${regels.length} randvoorwaarde${regels.length === 1 ? '' : 'n'}`) : null,
      ),
    );

    // — raster —
    const cellen = new Map();
    for (const p of plan.plaatsen) cellen.set(`${p.rij},${p.kol}`, p.leerlingId);

    const seats = el('div', { class: 'zp-seats',
      style: { gridTemplateColumns: `repeat(${plan.kolommen}, minmax(120px, 1fr))` } });

    for (let rij = 0; rij < plan.rijen; rij++) {
      for (let kol = 0; kol < plan.kolommen; kol++) {
        const lid = cellen.get(`${rij},${kol}`);
        if (!lid) {
          seats.append(el('div', { class: 'zp-seat zp-seat--leeg' },
            el('span', { class: 'zp-leegtekst' }, 'leeg')));
          continue;
        }
        const l = naamVan.get(lid);
        const slot = slots.get(lid);
        seats.append(
          el('div', { class: 'zp-seat' + (slot ? ' zp-seat--slot' : '') },
            el('div', { class: 'zp-naam' }, l?.voornaam || '', l ? el('br') : null, l?.naam || (!l ? '(onbekend)' : '')),
            slot ? el('div', { class: 'zp-slot' }, `🔒 ${slot}`) : null,
          ),
        );
      }
    }

    kaart.append(
      el('div', { class: 'zp-room' },
        el('div', { class: 'zp-board' }, '♟ Bord · leerkrachtzone'),
        seats,
      ),
    );

    // — onopgeloste randvoorwaarden als discrete waarschuwing —
    if (plan.onopgelost?.length) {
      kaart.append(
        el('div', { class: 'zp-onopgelost' },
          el('span', { class: 'badge badge--stil' }, '⚠ niet volledig opgelost'),
          ...plan.onopgelost.map((t) => el('span', { class: 'zacht', style: { fontSize: '0.74rem' } }, t)),
        ),
      );
    }

    root.append(kaart);
    restNota();
  }

  function restNota() {
    root.append(
      el('p', { class: 'zacht zp-nota' },
        el('span', {}, '🔒'),
        el('span', {}, 'Enkel neutrale zitinfo; persoonlijke notities blijven in Administratie.'),
      ),
    );
  }

  async function genereer() {
    if (!leerlingen.length) { toast('Geen leerlingen om te plaatsen', 'fout'); return; }
    const regels = await laadRegels();
    const res = genereerZitplan(leerlingen, regels, { kolommen: KOLOMMEN });
    plan = {
      klasId: ctx.klasId,
      naam: 'Zitplan',
      plaatsen: res.plaatsen,
      rijen: res.rijen,
      kolommen: res.kolommen,
      onopgelost: res.onopgelost,
      aangemaakt: new Date().toISOString(),
    };
    bewaard = false;
    toast('Plaatsing gegenereerd');
    await teken();
  }

  async function bewaar() {
    if (!plan || !plan.plaatsen?.length) { toast('Genereer eerst een plaatsing', 'fout'); return; }
    await put('zitplannen', {
      klasId: ctx.klasId,
      naam: plan.naam || 'Zitplan',
      plaatsen: plan.plaatsen,
      rijen: plan.rijen,
      kolommen: plan.kolommen,
      onopgelost: plan.onopgelost || [],
      aangemaakt: new Date().toISOString(),
    });
    bewaard = true;
    toast('Zitplan bewaard');
    await teken();
  }

  // — Randvoorwaarden-dialoog —
  function randvoorwaardenDialoog() {
    dialoog('Randvoorwaarden', (body) => {
      async function vul() {
        leeg(body);
        const regels = await laadRegels();

        body.append(el('p', { class: 'zacht' },
          'Slotjes sturen de plaatsing. Ze worden zo goed mogelijk gerespecteerd bij het genereren.'));

        if (!regels.length) {
          body.append(el('p', { class: 'zacht' }, 'Nog geen randvoorwaarden.'));
        } else {
          const lijst = el('ul', { class: 'zp-regellijst' });
          for (const r of regels) {
            lijst.append(
              el('li', { class: 'zp-regel' },
                el('span', { class: 'zp-regel__tekst' },
                  el('span', { class: 'zp-regel__type' }, ZITREGEL_TYPE[r.type] || r.type),
                  ' — ',
                  regelBetrokkenen(r)),
                el('button', { class: 'icoonknop', title: 'Verwijderen', onClick: async () => {
                  await remove('zitregels', r.id);
                  toast('Randvoorwaarde verwijderd');
                  await vul();
                  await teken();
                } }, '✕'),
              ),
            );
          }
          body.append(lijst);
        }

        body.append(
          el('div', { class: 'dialoog__acties' },
            el('button', { class: 'knop knop--primair', onClick: () => regelToevoegenDialoog(vul) }, '+ Regel'),
          ),
        );
      }
      vul();
    });
  }

  function regelBetrokkenen(r) {
    if (r.type === 'nietnaast') {
      return `${volledigeNaam(naamVan.get(r.leerlingId))} & ${volledigeNaam(naamVan.get(r.leerlingId2))}`;
    }
    if (r.type === 'vasteplaats') {
      const pos = (r.rij != null && r.kol != null) ? ` (rij ${r.rij + 1}, kol ${r.kol + 1})` : '';
      return volledigeNaam(naamVan.get(r.leerlingId)) + pos;
    }
    return volledigeNaam(naamVan.get(r.leerlingId));
  }

  function leerlingOpties() {
    const o = {};
    for (const l of leerlingen) o[l.id] = volledigeNaam(l);
    return o;
  }

  function regelToevoegenDialoog(naVul) {
    dialoog('Randvoorwaarde toevoegen', (body, sluit) => {
      const typeKeuze = keuze('Type', ZITREGEL_TYPE, 'vastvooraan');
      const extra = el('div', {});
      body.append(typeKeuze.wrap, extra);

      let velden = {};
      function tekenExtra() {
        leeg(extra);
        velden = {};
        const t = typeKeuze.select.value;
        const opties = leerlingOpties();
        if (t === 'nietnaast') {
          velden.a = keuze('Leerling', opties, leerlingen[0]?.id);
          velden.b = keuze('Niet naast', opties, leerlingen[1]?.id || leerlingen[0]?.id);
          extra.append(velden.a.wrap, velden.b.wrap);
        } else if (t === 'vasteplaats') {
          velden.a = keuze('Leerling', opties, leerlingen[0]?.id);
          velden.rij = veld('Rij (1 = vooraan)', { type: 'number', value: '1' });
          velden.kol = veld('Kolom', { type: 'number', value: '1' });
          extra.append(velden.a.wrap, velden.rij.wrap, velden.kol.wrap);
        } else {
          velden.a = keuze('Leerling', opties, leerlingen[0]?.id);
          extra.append(velden.a.wrap);
        }
      }
      typeKeuze.select.addEventListener('change', tekenExtra);
      tekenExtra();

      body.append(
        el('div', { class: 'dialoog__acties' },
          el('button', { class: 'knop', onClick: sluit }, 'Annuleren'),
          el('button', { class: 'knop knop--primair', onClick: async () => {
            const t = typeKeuze.select.value;
            const g = { klasId: ctx.klasId, type: t };
            if (t === 'nietnaast') {
              const a = velden.a.select.value;
              const b = velden.b.select.value;
              if (!a || !b || a === b) { toast('Kies twee verschillende leerlingen', 'fout'); return; }
              g.leerlingId = a; g.leerlingId2 = b;
            } else if (t === 'vasteplaats') {
              const a = velden.a.select.value;
              if (!a) { toast('Kies een leerling', 'fout'); return; }
              const rij = Math.max(1, parseInt(velden.rij.input.value, 10) || 1) - 1;
              const kol = Math.max(1, parseInt(velden.kol.input.value, 10) || 1) - 1;
              g.leerlingId = a; g.rij = rij; g.kol = kol;
            } else {
              const a = velden.a.select.value;
              if (!a) { toast('Kies een leerling', 'fout'); return; }
              g.leerlingId = a;
            }
            await put('zitregels', maakZitregel(g));
            sluit();
            toast('Randvoorwaarde toegevoegd');
            await naVul();
            await teken();
          } }, 'Toevoegen'),
        ),
      );
    });
  }

  await teken();
}
