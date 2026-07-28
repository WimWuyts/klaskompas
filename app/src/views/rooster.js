// Rooster (structuur nu, invullen later): wekelijkse lesmomenten per klas.
// De leerkracht kan het rooster later ook per foto aanleveren; hier zetten we de editor klaar.

import { get, put, remove, byIndex, getSetting } from '../db/repo.js';
import { uid, DAGEN } from '../domain/model.js';
import { el, leeg, toast, dialoog, bevestig, leegKaart } from '../ui/components.js';

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
      el('button', { class: 'knop knop--primair', onClick: () => slotDialoog(root, ctx, schooljaarId, null) }, '+ Lesmoment'),
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
        bestaand ? el('button', { class: 'knop knop--gevaar-zacht', onClick: async () => {
          if (await bevestig('Dit lesmoment verwijderen?')) { await remove('roosterslots', bestaand.id); sluit(); render(leeg(root), ctx); }
        } }, '🗑 Verwijderen') : null,
        el('span', { class: 'spatie' }),
        el('button', { class: 'knop', onClick: sluit }, 'Annuleren'),
        el('button', { class: 'knop knop--primair', onClick: async () => {
          const rec = bestaand || { id: uid(), klasId: ctx.klasId, schooljaarId };
          Object.assign(rec, { dag: Number(dag.value), start: start.input.value, eind: eind.input.value, lokaal: lokaal.input.value.trim() });
          await put('roosterslots', rec); sluit(); toast('Opgeslagen'); render(leeg(root), ctx);
        } }, 'Opslaan'),
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
