// Schooljaar & kalender (structuur nu, invullen later): schooljaren + vakanties/vrije dagen,
// en een "genereer schooljaar"-voorbeeld op basis van het rooster van de actieve klas.

import { all, get, put, remove, byIndex } from '../db/repo.js';
import { maakSchooljaar, uid, KALENDER_TYPE } from '../domain/model.js';
import { genereerLesmomenten, samenvatting, defaultLabel } from '../domain/schooljaar.js';
import { el, leeg, toast, dialoog, bevestig, datumKort, leegKaart } from '../ui/components.js';

export async function render(root, ctx) {
  const jaren = await all('schooljaren');
  jaren.sort((a, b) => (a.start || '').localeCompare(b.start || ''));

  root.append(
    el('div', { class: 'kaart__kop kaart__kop--los' },
      el('h2', {}, 'Schooljaar & kalender'),
      el('button', { class: 'knop knop--primair', onClick: () => jaarDialoog(root, ctx, null) }, '+ Schooljaar'),
    ),
  );

  if (!jaren.length) {
    root.append(leegKaart('Nog geen schooljaar', 'Leg een schooljaar vast; daarna kun je vakanties en het rooster invullen.'));
    return;
  }

  for (const sj of jaren) {
    const items = await byIndex('kalenderitems', 'schooljaarId', sj.id);
    items.sort((a, b) => (a.van || '').localeCompare(b.van || ''));
    const kaart = el('div', { class: 'kaart' });
    kaart.append(
      el('div', { class: 'kaart__kop' },
        el('h3', {}, `${sj.label}`),
        el('div', { class: 'knoprij' },
          el('span', { class: 'zacht' }, `${datumKort(sj.start)} → ${datumKort(sj.eind)}`),
          el('button', { class: 'knop knop--stil', onClick: () => jaarDialoog(root, ctx, sj) }, '✏️'),
          el('button', { class: 'knop knop--stil', onClick: async () => {
            if (await bevestig(`Schooljaar ${sj.label} verwijderen? Kalenderitems verdwijnen mee.`, { gevaar: true, jaLabel: 'Verwijderen' })) {
              for (const it of items) await remove('kalenderitems', it.id);
              await remove('schooljaren', sj.id); toast('Verwijderd'); render(leeg(root), ctx);
            }
          } }, '🗑'),
        ),
      ),
    );

    // vakanties/vrije dagen
    const vak = el('div', { class: 'kalender' });
    if (!items.length) vak.append(el('p', { class: 'zacht' }, 'Nog geen vakanties of vrije dagen.'));
    for (const it of items) {
      vak.append(el('div', { class: 'kalender__item' },
        el('span', { class: 'badge badge--stil' }, KALENDER_TYPE[it.type] || it.type),
        el('span', {}, it.naam || '—'),
        el('span', { class: 'zacht' }, `${datumKort(it.van)}–${datumKort(it.tot)}`),
        el('button', { class: 'icoonknop', onClick: async () => { await remove('kalenderitems', it.id); render(leeg(root), ctx); } }, '✕'),
      ));
    }
    kaart.append(el('div', { class: 'kaart__sub' },
      el('div', { class: 'kaart__kop' }, el('h4', {}, 'Vakanties & vrije dagen'),
        el('button', { class: 'knop knop--stil', onClick: () => kalenderDialoog(root, ctx, sj) }, '+ Toevoegen')),
      vak));

    // genereer-voorbeeld voor actieve klas
    if (ctx.klasId) {
      const slots = (await byIndex('roosterslots', 'klasId', ctx.klasId)).filter((s) => s.schooljaarId === sj.id || !s.schooljaarId);
      const lm = genereerLesmomenten(sj, slots, items);
      const s = samenvatting(lm);
      kaart.append(el('div', { class: 'genereer' },
        el('span', {}, '🧮 Genereer schooljaar (actieve klas): '),
        slots.length ? el('strong', {}, `${s.lesmomenten} lesmomenten over ${s.weken} weken`) : el('span', { class: 'zacht' }, 'nog geen rooster voor deze klas — vul het in onder “Rooster”.'),
      ));
    }
    root.append(kaart);
  }
}

function jaarDialoog(root, ctx, bestaand) {
  dialoog(bestaand ? 'Schooljaar bewerken' : 'Nieuw schooljaar', (body, sluit) => {
    const nu = bestaand ? null : new Date().getFullYear();
    const label = veld('Label', bestaand?.label || (nu ? defaultLabel(nu) : ''));
    const start = veld('Start', bestaand?.start || (nu ? `${nu}-09-01` : ''), 'date');
    const eind = veld('Einde', bestaand?.eind || (nu ? `${nu + 1}-06-30` : ''), 'date');
    body.append(label.wrap, start.wrap, eind.wrap,
      el('div', { class: 'dialoog__acties' },
        el('button', { class: 'knop', onClick: sluit }, 'Annuleren'),
        el('button', { class: 'knop knop--primair', onClick: async () => {
          if (!label.input.value.trim()) { toast('Geef een label', 'fout'); return; }
          if (bestaand) { Object.assign(bestaand, { label: label.input.value.trim(), start: start.input.value, eind: eind.input.value }); await put('schooljaren', bestaand); }
          else await put('schooljaren', maakSchooljaar({ label: label.input.value.trim(), start: start.input.value, eind: eind.input.value }));
          sluit(); toast('Opgeslagen'); render(leeg(root), ctx);
        } }, 'Opslaan'),
      ),
    );
  });
}

function kalenderDialoog(root, ctx, sj) {
  dialoog('Vakantie / vrije dag', (body, sluit) => {
    const type = el('select', { class: 'invoer' }, ...Object.entries(KALENDER_TYPE).map(([v, l]) => el('option', { value: v }, l)));
    const naam = veld('Naam', '');
    const van = veld('Van', '', 'date');
    const tot = veld('Tot en met', '', 'date');
    body.append(etiket('Type', type), naam.wrap, van.wrap, tot.wrap,
      el('div', { class: 'dialoog__acties' },
        el('button', { class: 'knop', onClick: sluit }, 'Annuleren'),
        el('button', { class: 'knop knop--primair', onClick: async () => {
          if (!van.input.value) { toast('Kies een begindatum', 'fout'); return; }
          await put('kalenderitems', { id: uid(), schooljaarId: sj.id, type: type.value, naam: naam.input.value.trim(), van: van.input.value, tot: tot.input.value || van.input.value });
          sluit(); toast('Toegevoegd'); render(leeg(root), ctx);
        } }, 'Toevoegen'),
      ),
    );
  });
}

function veld(label, waarde = '', type = 'text') {
  const input = el('input', { class: 'invoer', type, value: waarde });
  return { input, wrap: etiket(label, input) };
}
function etiket(label, control) {
  return el('label', { class: 'veld' }, el('span', {}, label), control);
}
