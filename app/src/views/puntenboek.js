// Evaluaties & puntenboek: gewogen gemiddelde per leerling. Punten zijn een
// hulpmiddel voor de leerkracht — ze blijven lokaal en privaat (geen ranking,
// geen labels). Rijen = leerlingen, kolommen = evaluaties + gemiddelde.

import { get, put, remove, byIndex } from '../db/repo.js';
import { EVALUATIE_TYPE, maakEvaluatie, maakEvalResultaat } from '../domain/model.js';
import { puntenboek } from '../domain/evaluaties.js';
import { exporteerCsv, afdruk, escapeHtml } from '../domain/export.js';
import {
  el, leeg, toast, dialoog, bevestig, stijl, veld, keuze, tekstveld, datumKort, leegKaart,
  verwijderMetUndo, markeerFout,
} from '../ui/components.js';

stijl('css-puntenboek', `
  .pb-schuif { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .pb-tabel { min-width: 100%; border-collapse: collapse; }
  .pb-tabel th, .pb-tabel td {
    border-bottom: 1px solid var(--rand);
    padding: 7px 9px; text-align: left; vertical-align: middle;
  }
  .pb-tabel thead th {
    position: sticky; top: 0; background: var(--paneel); z-index: 1;
    font-size: 0.8rem;
  }
  .pb-naam { white-space: nowrap; font-weight: 600; }
  .pb-evalkop { cursor: pointer; border-radius: var(--radius-s); }
  .pb-evalkop:hover { background: var(--paneel-2); }
  .pb-evalkop__titel { display: block; font-weight: 700; }
  .pb-evalkop__meta { display: block; color: var(--tekst-zacht); font-size: 0.72rem; font-weight: 400; }
  .pb-cel { display: flex; align-items: center; gap: 4px; }
  .pb-cel .invoer--kort { width: 4.2rem; }
  .pb-afw {
    padding: 3px 6px; font-size: 0.68rem; line-height: 1; border-radius: var(--radius-s);
    border: 1px solid var(--rand); background: var(--paneel); color: var(--tekst-zacht); cursor: pointer;
  }
  .pb-afw.is-actief { background: var(--accent); border-color: var(--accent); color: #fff; }
  .pb-gem-kop, .pb-gem {
    background: var(--paneel-2);
    border-left: 2px solid var(--accent) !important;
    text-align: right; white-space: nowrap;
  }
  .pb-gem { font-weight: 700; }
  .pb-gem--leeg { color: var(--tekst-zacht); font-weight: 400; }
`);

export async function render(root, ctx) {
  if (!ctx.klasId) {
    root.append(leegKaart('Geen actieve klas', 'Kies een klas om evaluaties en punten bij te houden.'));
    return;
  }
  const klas = await get('klassen', ctx.klasId);

  const kop = el('div', { class: 'kaart__kop kaart__kop--los' },
    el('h2', {}, `Evaluaties & puntenboek — ${klas?.naam || ''}`),
    el('button', { class: 'knop', onClick: () => exporteerPuntenboek(ctx, klas) }, '⬇️ CSV'),
    el('button', { class: 'knop', onClick: () => afdrukPuntenboek(ctx, klas) }, '🖨️ Afdrukken'),
    el('button', { class: 'knop knop--primair', onClick: () => evaluatieDialoog(root, ctx, null) }, '+ Evaluatie'),
  );
  root.append(kop);
  root.append(el('p', { class: 'zacht' },
    'Punten zijn een privaat hulpmiddel — lokaal bewaard, geen ranking of labels. Het gemiddelde is gewogen naar het gewicht per evaluatie.'));

  const houder = el('div', {});
  root.append(houder);
  await teken(houder, ctx);
}

async function teken(houder, ctx) {
  leeg(houder);
  const pb = await puntenboek(ctx.klasId);

  if (!pb.leerlingen.length) {
    houder.append(leegKaart('Geen leerlingen', 'Voeg eerst leerlingen toe aan deze klas.'));
    return;
  }
  if (!pb.evaluaties.length) {
    houder.append(leegKaart(
      'Nog geen evaluaties',
      'Maak een eerste evaluatie (toets, taak, mondeling …) om punten in te voeren.',
      el('button', { class: 'knop knop--primair', onClick: () => evaluatieDialoog(houder.parentElement, ctx, null) }, '+ Evaluatie'),
    ));
    return;
  }

  // lokale, actualiseerbare kopie van de resultaten
  const resMap = new Map();
  for (const l of pb.leerlingen) {
    for (const e of pb.evaluaties) {
      const r = pb.resultaat(l.id, e.id);
      if (r) resMap.set(`${l.id}|${e.id}`, r);
    }
  }
  const gemCellen = new Map();

  const koprij = el('tr', {},
    el('th', {}, 'Leerling'),
    ...pb.evaluaties.map((e) => el('th', { class: 'pb-evalkop', title: 'Klik om te bewerken of te verwijderen', onClick: () => evaluatieDialoog(houder.parentElement, ctx, e) },
      el('span', { class: 'pb-evalkop__titel' }, e.titel || (EVALUATIE_TYPE[e.type] || 'Evaluatie')),
      el('span', { class: 'pb-evalkop__meta' }, `/${e.maxPunten}${e.datum ? ' · ' + datumKort(e.datum) : ''}`),
    )),
    el('th', { class: 'pb-gem-kop', title: 'Gewogen gemiddelde' }, 'Gemiddelde'),
  );

  const tbody = el('tbody', {});
  for (const l of pb.leerlingen) {
    const rij = el('tr', {}, el('td', { class: 'pb-naam' }, `${l.voornaam} ${l.naam}`.trim()));
    for (const e of pb.evaluaties) {
      rij.append(el('td', {}, maakCel(ctx, l, e, resMap, gemCellen)));
    }
    const gem = pb.gemiddelde.get(l.id);
    const gemCel = el('td', { class: gem == null ? 'pb-gem pb-gem--leeg' : 'pb-gem' }, gem == null ? '—' : `${Math.round(gem)}%`);
    gemCellen.set(l.id, gemCel);
    rij.append(gemCel);
    tbody.append(rij);
  }

  houder.append(
    el('div', { class: 'kaart' },
      el('div', { class: 'pb-schuif' },
        el('table', { class: 'tabel pb-tabel' }, el('thead', {}, koprij), tbody),
      ),
    ),
  );
}

function maakCel(ctx, leerling, evaluatie, resMap, gemCellen) {
  const key = `${leerling.id}|${evaluatie.id}`;
  const bestaand = resMap.get(key);
  const state = { afw: !!bestaand?.afwezig };

  const invoer = el('input', {
    class: 'invoer invoer--kort', type: 'number', min: '0', max: String(evaluatie.maxPunten),
    step: 'any', value: bestaand?.punten == null ? '' : bestaand.punten,
    placeholder: '—', disabled: state.afw,
  });
  const afwKnop = el('button', {
    class: state.afw ? 'pb-afw is-actief' : 'pb-afw', type: 'button',
    title: 'Afwezig — telt niet mee', 'aria-pressed': String(state.afw),
  }, 'afw');

  async function bewaar() {
    const puntenVal = state.afw || invoer.value === '' ? null : Number(invoer.value);
    const huidig = resMap.get(key);
    let rec;
    if (huidig) rec = { ...huidig, punten: puntenVal, afwezig: state.afw };
    else rec = maakEvalResultaat({ evaluatieId: evaluatie.id, leerlingId: leerling.id, klasId: ctx.klasId, punten: puntenVal, afwezig: state.afw });
    await put('evalresultaten', rec);
    resMap.set(key, rec);
    await ververGemiddelden(ctx, gemCellen);
  }

  invoer.addEventListener('change', bewaar);
  invoer.addEventListener('blur', bewaar);
  afwKnop.addEventListener('click', async () => {
    state.afw = !state.afw;
    afwKnop.classList.toggle('is-actief', state.afw);
    afwKnop.setAttribute('aria-pressed', String(state.afw));
    invoer.disabled = state.afw;
    await bewaar();
  });

  return el('div', { class: 'pb-cel' }, invoer, afwKnop);
}

async function ververGemiddelden(ctx, gemCellen) {
  const pb = await puntenboek(ctx.klasId);
  for (const [leerlingId, cel] of gemCellen) {
    const gem = pb.gemiddelde.get(leerlingId);
    if (gem == null) {
      cel.textContent = '—';
      cel.className = 'pb-gem pb-gem--leeg';
    } else {
      cel.textContent = `${Math.round(gem)}%`;
      cel.className = 'pb-gem';
    }
  }
}

// Bouw de gedeelde gegevens (koppen + rijen) voor CSV- en afdrukexport.
async function bouwExportData(ctx) {
  const pb = await puntenboek(ctx.klasId);
  const evalTitel = (e) => e.titel || (EVALUATIE_TYPE[e.type] || 'Evaluatie');
  const koppen = ['Leerling', ...pb.evaluaties.map((e) => `${evalTitel(e)} (${e.maxPunten})`), 'Gemiddelde'];
  const rijen = pb.leerlingen.map((l) => {
    const naam = `${l.voornaam} ${l.naam}`.trim();
    const punten = pb.evaluaties.map((e) => {
      const r = pb.resultaat(l.id, e.id);
      return (r && !r.afwezig && r.punten != null) ? r.punten : '';
    });
    const gem = pb.gemiddelde.get(l.id);
    return { naam, punten, gem: gem == null ? '' : `${Math.round(gem)}%` };
  });
  return { koppen, rijen, aantalEval: pb.evaluaties.length };
}

async function exporteerPuntenboek(ctx, klas) {
  const { koppen, rijen } = await bouwExportData(ctx);
  const matrix = [koppen, ...rijen.map((r) => [r.naam, ...r.punten, r.gem])];
  exporteerCsv(`puntenboek-${klas?.naam || 'klas'}.csv`, matrix);
}

async function afdrukPuntenboek(ctx, klas) {
  const { koppen, rijen } = await bouwExportData(ctx);
  const thead = '<tr>' + koppen.map((k, i) =>
    `<th${i === 0 ? '' : ' class="num"'}>${escapeHtml(k)}</th>`).join('') + '</tr>';
  const tbody = rijen.map((r) => '<tr>'
    + `<td>${escapeHtml(r.naam)}</td>`
    + r.punten.map((p) => `<td class="num">${escapeHtml(p)}</td>`).join('')
    + `<td class="num">${escapeHtml(r.gem)}</td>`
    + '</tr>').join('');
  const html = `<h1>${escapeHtml(klas?.naam || '')} — Puntenboek</h1>`
    + `<table><thead>${thead}</thead><tbody>${tbody}</tbody></table>`;
  afdruk(`Puntenboek — ${klas?.naam || ''}`, html);
}

function evaluatieDialoog(root, ctx, bestaand) {
  dialoog(bestaand ? 'Evaluatie bewerken' : 'Nieuwe evaluatie', (body, sluit) => {
    const titel = veld('Titel', { value: bestaand?.titel || '' });
    const type = keuze('Type', EVALUATIE_TYPE, bestaand?.type || 'toets');
    const datum = veld('Datum', { type: 'date', value: bestaand?.datum || '' });
    const maxPunten = veld('Max. punten', { type: 'number', value: bestaand?.maxPunten ?? 10 });
    const gewicht = veld('Gewicht (%)', { type: 'number', value: bestaand?.gewicht ?? 100 });
    const thema = veld('Thema', { value: bestaand?.thema || '' });
    const note = tekstveld('Notitie', { value: bestaand?.note || '', rows: 2 });

    const acties = el('div', { class: 'dialoog__acties' });
    if (bestaand) {
      acties.append(el('button', { class: 'knop knop--stil', onClick: async () => {
        if (!(await bevestig(`"${bestaand.titel || 'deze evaluatie'}" verwijderen? Alle bijhorende punten gaan mee.`, { gevaar: true, jaLabel: 'Verwijderen' }))) return;
        // Keuze: de bijhorende resultaten wissen we hier definitief (aparte remove);
        // enkel het evaluatie-record loopt via verwijderMetUndo. "Ongedaan maken"
        // herstelt daardoor de evaluatie zonder haar oude punten — dat is aanvaardbaar.
        const res = await byIndex('evalresultaten', 'evaluatieId', bestaand.id);
        for (const r of res) await remove('evalresultaten', r.id);
        sluit();
        await verwijderMetUndo('evaluaties', bestaand, () => hertekenRoot(root, ctx), 'Evaluatie verwijderd');
      } }, '🗑 Verwijderen'));
    }
    acties.append(
      el('button', { class: 'knop', onClick: sluit }, 'Annuleren'),
      el('button', { class: 'knop knop--primair', onClick: async () => {
        if (!titel.input.value.trim()) { markeerFout(titel.input, 'Geef een titel'); return; }
        const velden = {
          titel: titel.input.value.trim(),
          type: type.select.value,
          datum: datum.input.value,
          maxPunten: Number(maxPunten.input.value) || 10,
          gewicht: Number(gewicht.input.value) || 100,
          thema: thema.input.value.trim(),
          note: note.input.value.trim(),
        };
        if (bestaand) await put('evaluaties', { ...bestaand, ...velden });
        else await put('evaluaties', maakEvaluatie({ klasId: ctx.klasId, ...velden }));
        sluit();
        toast('Opgeslagen');
        hertekenRoot(root, ctx);
      } }, 'Opslaan'),
    );

    body.append(titel.wrap, type.wrap, datum.wrap, maxPunten.wrap, gewicht.wrap, thema.wrap, note.wrap, acties);
  });
}

// Herteken de volledige view netjes na een structuurwijziging (evaluatie toegevoegd/gewist).
function hertekenRoot(root, ctx) {
  if (root) render(leeg(root), ctx);
}
