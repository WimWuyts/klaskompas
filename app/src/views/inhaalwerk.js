// Afwezigheden & inhaalwerk: opvolging van gemiste toetsen/taken per klas (ADR-0001 admin v0.2).
// Feitelijke opvolgingslijst — geen scores, enkel status en planning.

import { get, put, remove, byIndex, leerlingenVanKlas } from '../db/repo.js';
import { INHAALWERK_TYPE, INHAALWERK_STATUS, maakInhaalwerk } from '../domain/model.js';
import { el, leeg, toast, dialoog, bevestig, stijl, veld, keuze, tekstveld, etiket, datumKort, leegKaart } from '../ui/components.js';

// Statussen die als "open werk" tellen (bovenaan sorteren).
const OPEN_STATUS = new Set(['open', 'afspraak', 'ingepland', 'afgelegd']);
const AFGESLOTEN_STATUS = new Set(['afgesloten']);
const INGEPLAND_STATUS = new Set(['ingepland', 'afspraak', 'afgelegd']);

function statusBadgeKlasse(status) {
  if (AFGESLOTEN_STATUS.has(status)) return 'badge badge--stil ihw-badge ihw-badge--afgesloten';
  if (status === 'ingepland' || status === 'afgelegd') return 'badge ihw-badge ihw-badge--ingepland';
  return 'badge ihw-badge ihw-badge--open';
}

export async function render(root, ctx) {
  stijl('css-inhaalwerk', `
    .ihw-samenvatting { display:flex; flex-wrap:wrap; gap:.6rem; margin:.4rem 0 .9rem; }
    .ihw-stat { display:flex; flex-direction:column; gap:.15rem; padding:.55rem .8rem;
      background:var(--paneel-2); border:1px solid var(--rand); border-radius:var(--radius-s); min-width:6.5rem; }
    .ihw-stat__getal { font-size:1.35rem; font-weight:700; line-height:1; }
    .ihw-stat__label { font-size:.8rem; color:var(--tekst-zacht); }
    .ihw-stat--open .ihw-stat__getal { color:var(--rood); }
    .ihw-stat--ingepland .ihw-stat__getal { color:var(--goud); }
    .ihw-stat--afgesloten .ihw-stat__getal { color:var(--groen); }
    .ihw-badge--open { background:color-mix(in srgb, var(--rood) 18%, transparent); color:var(--rood); }
    .ihw-badge--ingepland { background:color-mix(in srgb, var(--goud) 22%, transparent); color:var(--goud); }
    .ihw-badge--afgesloten { color:var(--tekst-zacht); }
    .ihw-filter { display:flex; align-items:center; gap:.5rem; }
    .ihw-filter .veld { margin:0; }
    .ihw-rij-status { min-width:9rem; }
    .ihw-datum { white-space:nowrap; color:var(--tekst-zacht); }
    .ihw-titel { font-weight:600; }
    .ihw-leerling { white-space:nowrap; }
  `);

  if (!ctx.klasId) {
    root.append(leegKaart('Geen actieve klas', 'Kies een klas om afwezigheden en inhaalwerk op te volgen.'));
    return;
  }

  const klas = await get('klassen', ctx.klasId);
  const leerlingen = await leerlingenVanKlas(ctx.klasId);
  const naamVan = new Map(leerlingen.map((l) => [l.id, `${l.voornaam} ${l.naam}`.trim()]));

  root.append(
    el('div', { class: 'kaart__kop kaart__kop--los' },
      el('h2', {}, `Afwezigheden & inhaalwerk — ${klas?.naam || ''}`),
      el('button', { class: 'knop knop--primair',
        onClick: () => bewerkDialoog(root, ctx, leerlingen, null) }, '+ Inhaalwerk'),
    ),
    el('p', { class: 'zacht' }, 'Opvolging van gemiste toetsen en taken: wat moet nog ingehaald, ingepland of afgesloten worden?'),
  );

  if (!leerlingen.length) {
    root.append(leegKaart('Geen leerlingen', 'Voeg eerst leerlingen toe aan deze klas.'));
    return;
  }

  const items = await byIndex('inhaalwerk', 'klasId', ctx.klasId);

  const aantalOpen = items.filter((i) => i.status === 'open' || i.status === 'afspraak').length;
  const aantalIngepland = items.filter((i) => i.status === 'ingepland' || i.status === 'afgelegd').length;
  const aantalAfgesloten = items.filter((i) => AFGESLOTEN_STATUS.has(i.status)).length;

  root.append(
    el('div', { class: 'ihw-samenvatting' },
      el('div', { class: 'ihw-stat ihw-stat--open' },
        el('span', { class: 'ihw-stat__getal' }, String(aantalOpen)),
        el('span', { class: 'ihw-stat__label' }, 'Open')),
      el('div', { class: 'ihw-stat ihw-stat--ingepland' },
        el('span', { class: 'ihw-stat__getal' }, String(aantalIngepland)),
        el('span', { class: 'ihw-stat__label' }, 'Ingepland')),
      el('div', { class: 'ihw-stat ihw-stat--afgesloten' },
        el('span', { class: 'ihw-stat__getal' }, String(aantalAfgesloten)),
        el('span', { class: 'ihw-stat__label' }, 'Afgesloten')),
    ),
  );

  // Statusfilter
  const filter = keuze('Filter op status', { alle: 'Alle', ...INHAALWERK_STATUS }, 'alle');
  filter.wrap.classList.add('ihw-filter');
  filter.select.addEventListener('change', () => tekenLijst());
  root.append(el('div', { class: 'ihw-filter' }, filter.wrap));

  const houder = el('div', { id: 'ihw-houder' });
  root.append(houder);
  tekenLijst();

  function tekenLijst() {
    leeg(houder);
    const gekozen = filter.select.value;
    let lijst = items.slice();
    if (gekozen !== 'alle') lijst = lijst.filter((i) => i.status === gekozen);

    if (!lijst.length) {
      houder.append(leegKaart('Niets te tonen',
        gekozen === 'alle' ? 'Voeg inhaalwerk toe met de knop hierboven.' : 'Geen items met deze status.'));
      return;
    }

    // Open items bovenaan; daarbinnen op geplande/gemiste datum.
    lijst.sort((a, b) => {
      const oa = OPEN_STATUS.has(a.status) ? 0 : 1;
      const ob = OPEN_STATUS.has(b.status) ? 0 : 1;
      if (oa !== ob) return oa - ob;
      const da = a.scheduledDatum || a.missedDatum || '';
      const dbb = b.scheduledDatum || b.missedDatum || '';
      return da.localeCompare(dbb);
    });

    const tabel = el('table', { class: 'tabel' },
      el('thead', {}, el('tr', {},
        el('th', {}, 'Leerling'),
        el('th', {}, 'Type'),
        el('th', {}, 'Titel'),
        el('th', {}, 'Status'),
        el('th', {}, 'Gemist'),
        el('th', {}, 'Ingepland'),
        el('th', {}, ''),
      )),
    );
    const tbody = el('tbody', {});
    for (const it of lijst) {
      const statusSel = el('select', { class: 'invoer invoer--kort ihw-rij-status' },
        ...Object.entries(INHAALWERK_STATUS).map(([v, l]) =>
          el('option', { value: v, selected: v === it.status }, l)));
      statusSel.addEventListener('change', async () => {
        it.status = statusSel.value;
        await put('inhaalwerk', it);
        toast('Status bijgewerkt');
        render(leeg(root), ctx);
      });

      tbody.append(
        el('tr', {},
          el('td', { class: 'ihw-leerling' }, naamVan.get(it.leerlingId) || '— onbekend —'),
          el('td', {}, INHAALWERK_TYPE[it.type] || it.type),
          el('td', { class: 'ihw-titel' }, it.titel || '—'),
          el('td', {}, el('span', { class: statusBadgeKlasse(it.status) }, INHAALWERK_STATUS[it.status] || it.status)),
          el('td', { class: 'ihw-datum' }, it.missedDatum ? datumKort(it.missedDatum) : '—'),
          el('td', { class: 'ihw-datum' }, it.scheduledDatum ? datumKort(it.scheduledDatum) : '—'),
          el('td', {},
            el('div', { class: 'knoprij knoprij--rechts' },
              statusSel,
              el('button', { class: 'icoonknop', title: 'Bewerken',
                onClick: () => bewerkDialoog(root, ctx, leerlingen, it) }, '✏️'),
              el('button', { class: 'icoonknop', title: 'Verwijderen', onClick: async () => {
                if (await bevestig(`Inhaalwerk "${it.titel || INHAALWERK_TYPE[it.type] || 'item'}" verwijderen?`,
                  { gevaar: true, jaLabel: 'Verwijderen' })) {
                  await remove('inhaalwerk', it.id);
                  toast('Verwijderd');
                  render(leeg(root), ctx);
                }
              } }, '🗑'),
            ),
          ),
        ),
      );
    }
    tabel.append(tbody);
    houder.append(el('div', { class: 'kaart' }, tabel));
  }
}

function bewerkDialoog(root, ctx, leerlingen, bestaand) {
  dialoog(bestaand ? 'Inhaalwerk bewerken' : 'Nieuw inhaalwerk', (body, sluit) => {
    const leerlingOpties = Object.fromEntries(
      leerlingen.map((l) => [l.id, `${l.voornaam} ${l.naam}`.trim()]));
    const leerling = keuze('Leerling', leerlingOpties, bestaand?.leerlingId || leerlingen[0]?.id);
    const type = keuze('Type', INHAALWERK_TYPE, bestaand?.type || 'toets');
    const titel = veld('Titel', { value: bestaand?.titel || '', placeholder: 'Bv. Toets hoofdstuk 3' });
    const status = keuze('Status', INHAALWERK_STATUS, bestaand?.status || 'open');
    const missed = veld('Gemist op', { type: 'date', value: bestaand?.missedDatum || '' });
    const scheduled = veld('Ingepland op', { type: 'date', value: bestaand?.scheduledDatum || '' });
    const note = tekstveld('Notitie', { value: bestaand?.note || '', placeholder: 'Optionele afspraken of context…' });

    body.append(
      leerling.wrap, type.wrap, titel.wrap, status.wrap, missed.wrap, scheduled.wrap, note.wrap,
      el('div', { class: 'dialoog__acties' },
        el('button', { class: 'knop', onClick: sluit }, 'Annuleren'),
        el('button', { class: 'knop knop--primair', onClick: async () => {
          if (!leerling.select.value) { toast('Kies een leerling', 'fout'); return; }
          const gegevens = {
            leerlingId: leerling.select.value,
            klasId: ctx.klasId,
            type: type.select.value,
            titel: titel.input.value.trim(),
            status: status.select.value,
            missedDatum: missed.input.value,
            scheduledDatum: scheduled.input.value,
            note: note.input.value.trim(),
          };
          if (bestaand) {
            Object.assign(bestaand, gegevens);
            await put('inhaalwerk', bestaand);
          } else {
            await put('inhaalwerk', maakInhaalwerk(gegevens));
          }
          sluit();
          toast('Opgeslagen');
          render(leeg(root), ctx);
        } }, 'Opslaan'),
      ),
    );
  });
}
