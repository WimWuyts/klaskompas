// Aanwezigheid per lesuur/dag (structuur nu, invullen later).
// Records zijn feitelijk en per (klas, datum, leerling); geen scores of interpretatie.

import { get, put, byIndex, leerlingenVanKlas } from '../db/repo.js';
import { AANWEZIGHEID_STATUS } from '../domain/model.js';
import { el, leeg, toast, leegKaart } from '../ui/components.js';
import { isoDatum } from '../domain/schooljaar.js';

export async function render(root, ctx) {
  if (!ctx.klasId) {
    root.append(leegKaart('Geen actieve klas', 'Kies een klas om aanwezigheid te registreren.'));
    return;
  }
  const klas = await get('klassen', ctx.klasId);
  const vandaag = isoDatum(new Date());

  const datum = el('input', { class: 'invoer invoer--kort', type: 'date', value: vandaag });
  root.append(
    el('div', { class: 'kaart__kop kaart__kop--los' },
      el('h2', {}, `Aanwezigheid — ${klas?.naam || ''}`),
      el('label', { class: 'veld veld--inline' }, el('span', {}, 'Datum'), datum),
    ),
  );

  const houder = el('div', { id: 'aanw-houder' });
  root.append(houder);
  datum.addEventListener('change', () => teken());
  await teken();

  async function teken() {
    leeg(houder);
    const leerlingen = await leerlingenVanKlas(ctx.klasId);
    if (!leerlingen.length) { houder.append(leegKaart('Geen leerlingen', 'Voeg eerst leerlingen toe aan deze klas.')); return; }
    const dag = datum.value;
    const bestaande = (await byIndex('aanwezigheid', 'klasId', ctx.klasId)).filter((a) => a.datum === dag);
    const perLeerling = new Map(bestaande.map((a) => [a.leerlingId, a]));

    const tabel = el('table', { class: 'tabel' }, el('thead', {}, el('tr', {}, el('th', {}, 'Leerling'), el('th', {}, 'Status'), el('th', {}, 'Notitie'))));
    const tbody = el('tbody', {});
    const rijen = [];
    for (const l of leerlingen) {
      const huidig = perLeerling.get(l.id);
      const sel = el('select', { class: 'invoer invoer--kort' }, ...Object.entries(AANWEZIGHEID_STATUS).map(([v, lab]) => el('option', { value: v, selected: (huidig?.status || 'aanwezig') === v }, lab)));
      const note = el('input', { class: 'invoer', value: huidig?.note || '', placeholder: '—' });
      rijen.push({ leerlingId: l.id, sel, note });
      tbody.append(el('tr', {}, el('td', {}, `${l.voornaam} ${l.naam}`.trim()), el('td', {}, sel), el('td', {}, note)));
    }
    tabel.append(tbody);
    houder.append(
      el('div', { class: 'kaart' }, tabel,
        el('div', { class: 'knoprij knoprij--rechts' },
          el('button', { class: 'knop knop--primair', onClick: async () => {
            for (const r of rijen) {
              const id = `${ctx.klasId}:${dag}:${r.leerlingId}`;
              await put('aanwezigheid', { id, klasId: ctx.klasId, leerlingId: r.leerlingId, datum: dag, status: r.sel.value, note: r.note.value.trim() });
            }
            toast('Aanwezigheid opgeslagen');
          } }, '💾 Opslaan'),
        ),
      ),
    );
  }
}
