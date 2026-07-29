// Rooster (structuur nu, invullen later): wekelijkse lesmomenten per klas.
// De leerkracht kan het rooster later ook per foto aanleveren; hier zetten we de editor klaar.

import { get, put, remove, byIndex, getSetting } from '../db/repo.js';
import { uid, DAGEN } from '../domain/model.js';
import { el, leeg, toast, dialoog, leegKaart, verwijderMetUndo, markeerFout, stijl } from '../ui/components.js';

// Verwacht JSON-formaat voor rooster-import (matcht later de output van een roosterfoto-transcriptie):
// [ { "dag": 1, "start": "08:25", "eind": "09:15", "lokaal": "A102" }, { "dag": 3, "start": "10:20", "eind": "11:10" } ]
// dag 1..5 = maandag..vrijdag; lokaal is optioneel.
const IMPORT_VOORBEELD = '[\n  { "dag": 1, "start": "08:25", "eind": "09:15", "lokaal": "A102" },\n  { "dag": 3, "start": "10:20", "eind": "11:10" }\n]';
const TIJD_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

function hertekenen(root, ctx) {
  render(leeg(root), ctx);
}

export async function render(root, ctx) {
  if (!ctx.klasId) {
    root.append(leegKaart('Geen actieve klas', 'Kies een klas om haar rooster in te vullen.'));
    return;
  }
  const klas = await get('klassen', ctx.klasId);
  const schooljaarId = await getSetting('actiefSchooljaarId', null);
  const slots = (await byIndex('roosterslots', 'klasId', ctx.klasId));
  slots.sort((a, b) => (a.dag - b.dag) || (a.start || '').localeCompare(b.start || ''));

  root.append(
    el('div', { class: 'kaart__kop kaart__kop--los' },
      el('h2', {}, `Rooster — ${klas?.naam || ''}`),
      el('div', { class: 'kaart__kop-acties' },
        el('button', { class: 'knop', onClick: () => importDialoog(root, ctx, schooljaarId) }, '📋 Rooster importeren'),
        el('button', { class: 'knop knop--primair', onClick: () => slotDialoog(root, ctx, schooljaarId, null) }, '+ Lesmoment'),
      ),
    ),
    el('p', { class: 'zacht' }, 'Wekelijks terugkerende lesmomenten. Later te combineren met de schooljaarkalender voor concrete lesdatums.'),
  );

  const grid = el('div', { class: 'weekgrid' });
  for (let dag = 1; dag <= 5; dag++) {
    const kolom = el('div', { class: 'weekgrid__dag' }, el('div', { class: 'weekgrid__kop' }, DAGEN[dag - 1]));
    const dagSlots = slots.filter((s) => s.dag === dag);
    if (!dagSlots.length) kolom.append(el('div', { class: 'weekgrid__leeg zacht' }, '—'));
    for (const s of dagSlots) {
      kolom.append(el('div', { class: 'lesblok', onClick: () => slotDialoog(root, ctx, schooljaarId, s) },
        el('div', { class: 'lesblok__tijd' }, `${s.start || '?'}–${s.eind || '?'}`),
        s.lokaal ? el('div', { class: 'lesblok__lokaal zacht' }, '📍 ' + s.lokaal) : null,
      ));
    }
    grid.append(kolom);
  }
  root.append(el('div', { class: 'kaart' }, grid));
}

function slotDialoog(root, ctx, schooljaarId, bestaand) {
  dialoog(bestaand ? 'Lesmoment bewerken' : 'Lesmoment toevoegen', (body, sluit) => {
    const dag = el('select', { class: 'invoer' }, ...DAGEN.map((d, i) => el('option', { value: i + 1, selected: bestaand?.dag === i + 1 }, d)));
    const start = veld('Van', bestaand?.start || '08:25', 'time');
    const eind = veld('Tot', bestaand?.eind || '09:15', 'time');
    const lokaal = veld('Lokaal (optioneel)', bestaand?.lokaal || '');
    body.append(etiket('Dag', dag), start.wrap, eind.wrap, lokaal.wrap,
      el('div', { class: 'dialoog__acties' },
        bestaand ? el('button', { class: 'knop knop--gevaar-zacht', onClick: () => {
          sluit();
          verwijderMetUndo('roosterslots', bestaand, () => hertekenen(root, ctx), 'Lesmoment verwijderd');
        } }, '🗑 Verwijderen') : null,
        el('span', { class: 'spatie' }),
        el('button', { class: 'knop', onClick: sluit }, 'Annuleren'),
        el('button', { class: 'knop knop--primair', onClick: async () => {
          const rec = bestaand || { id: uid(), klasId: ctx.klasId, schooljaarId };
          Object.assign(rec, { dag: Number(dag.value), start: start.input.value, eind: eind.input.value, lokaal: lokaal.input.value.trim() });
          await put('roosterslots', rec); sluit(); toast('Opgeslagen'); hertekenen(root, ctx);
        } }, 'Opslaan'),
      ),
    );
  });
}

function importDialoog(root, ctx, schooljaarId) {
  stijl('css-rooster', `
    .rooster-import__voorbeeld { margin: .25rem 0 .75rem; padding: .5rem .75rem; background: var(--vlak-2, rgba(0,0,0,.05));
      border-radius: .5rem; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .8rem;
      white-space: pre; overflow-x: auto; }
    .rooster-import__vink { display: flex; align-items: center; gap: .5rem; margin: .5rem 0; }
    .rooster-import__vink input { width: auto; }
  `);
  dialoog('Rooster importeren', (body, sluit) => {
    const invoer = el('textarea', { class: 'invoer', rows: 8, placeholder: 'Plak hier de JSON van het rooster…' });
    const wisVink = el('input', { type: 'checkbox' });
    body.append(
      el('p', { class: 'zacht' }, 'Plak de lesmomenten als JSON-lijst. Dit is hetzelfde formaat dat later automatisch uit een roosterfoto komt. Dag 1..5 = maandag t/m vrijdag; het lokaal is optioneel.'),
      el('div', { class: 'rooster-import__voorbeeld' }, IMPORT_VOORBEELD),
      etiket('JSON', invoer),
      el('label', { class: 'rooster-import__vink' }, wisVink, el('span', {}, 'Bestaande roosterslots van deze klas eerst wissen')),
      el('div', { class: 'dialoog__acties' },
        el('span', { class: 'spatie' }),
        el('button', { class: 'knop', onClick: sluit }, 'Annuleren'),
        el('button', { class: 'knop knop--primair', onClick: async () => {
          let data;
          try {
            data = JSON.parse(invoer.value);
          } catch (_) {
            return markeerFout(invoer, 'Ongeldige JSON');
          }
          if (!Array.isArray(data)) return markeerFout(invoer, 'Verwacht een JSON-lijst');

          let geldig = 0;
          let overgeslagen = 0;
          const teBewaren = [];
          for (const item of data) {
            const dag = Number(item?.dag);
            const start = typeof item?.start === 'string' ? item.start.trim() : '';
            const eind = typeof item?.eind === 'string' ? item.eind.trim() : '';
            const lokaal = typeof item?.lokaal === 'string' ? item.lokaal.trim() : '';
            if (!(dag >= 1 && dag <= 5) || !TIJD_RE.test(start) || !TIJD_RE.test(eind)) {
              overgeslagen++;
              continue;
            }
            teBewaren.push({ id: uid(), klasId: ctx.klasId, schooljaarId, dag, start, eind, lokaal });
            geldig++;
          }

          if (wisVink.checked) {
            const bestaande = await byIndex('roosterslots', 'klasId', ctx.klasId);
            for (const s of bestaande) await remove('roosterslots', s.id);
          }
          for (const rec of teBewaren) await put('roosterslots', rec);

          sluit();
          const staart = overgeslagen ? ` (${overgeslagen} overgeslagen)` : '';
          toast(`${geldig} lesmoment${geldig === 1 ? '' : 'en'} geïmporteerd${staart}`);
          hertekenen(root, ctx);
        } }, 'Importeren'),
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
