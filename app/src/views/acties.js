// Acties & notities: eenvoudige to-do's en lokale communicatie-notities.
// Alles blijft lokaal in IndexedDB; er wordt niets verzonden.

import { all, get, put, remove, leerlingenVanKlas } from '../db/repo.js';
import { ACTIE_STATUS, maakActie, NOTITIE_KANAAL, maakNotitie } from '../domain/model.js';
import { el, leeg, toast, dialoog, bevestig, stijl, keuze, tekstveld, datumKort, leegKaart } from '../ui/components.js';

const CSS = `
.acties-invoer { display: flex; gap: 8px; flex-wrap: wrap; align-items: flex-end; }
.acties-invoer .invoer { min-width: 0; }
.acties-invoer__tekst { flex: 1 1 220px; }
.acties-invoer__datum { flex: 0 0 auto; }
.actie-lijst { list-style: none; margin: 12px 0 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.actie-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: 1px solid var(--rand); border-radius: var(--radius-s); background: var(--paneel-2); }
.actie-item input[type="checkbox"] { width: 18px; height: 18px; flex: 0 0 auto; cursor: pointer; accent-color: var(--groen); }
.actie-item__tekst { flex: 1; min-width: 0; }
.actie-item--gedaan .actie-item__tekst { text-decoration: line-through; color: var(--tekst-zacht); }
.actie-item__meta { display: flex; gap: 6px; align-items: center; flex: 0 0 auto; }
.notitie-lijst { list-style: none; margin: 12px 0 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.notitie-item { padding: 10px 12px; border: 1px solid var(--rand); border-radius: var(--radius-s); background: var(--paneel-2); }
.notitie-item__kop { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }
.notitie-item__tekst { margin: 4px 0 0; white-space: pre-wrap; }
.notitie-item__voet { display: flex; gap: 6px; align-items: center; margin-top: 6px; }
.badge--opvolgen { background: color-mix(in srgb, var(--accent) 18%, transparent); color: var(--accent); }
`;

export async function render(root, ctx) {
  stijl('css-acties', CSS);

  const klas = ctx.klasId ? await get('klassen', ctx.klasId) : null;

  root.append(
    el('div', { class: 'kaart__kop kaart__kop--los' },
      el('h2', {}, 'Acties & notities'),
    ),
    el('p', { class: 'zacht' }, klas
      ? `To-do's en communicatie-notities — gekoppeld waar mogelijk aan ${klas.naam}.`
      : "To-do's en communicatie-notities. Kies een actieve klas om notities aan leerlingen te koppelen."),
  );

  await tekenTaken(root, ctx);
  await tekenNotities(root, ctx);
}

// Naam van een klas ophalen uit ctx.klassen (val terug op het id).
function klasnaam(ctx, id) {
  if (!id) return '';
  const k = (ctx.klassen || []).find((x) => x.id === id);
  return k ? k.naam : '';
}

// ————————————————————————————— A) Taken / to-do's —————

async function tekenTaken(root, ctx) {
  const kaart = el('div', { class: 'kaart' });
  root.append(kaart);
  await hertekenTaken(kaart, ctx);
}

async function hertekenTaken(kaart, ctx) {
  leeg(kaart);

  const tekstIn = el('input', { class: 'invoer', type: 'text', placeholder: 'Nieuwe taak…' });
  const datumIn = el('input', { class: 'invoer invoer--kort', type: 'date' });

  const voegToe = async () => {
    const tekst = tekstIn.value.trim();
    if (!tekst) { toast('Geef een taak in', 'fout'); return; }
    await put('acties', maakActie({ tekst, klasId: ctx.klasId || null, datum: datumIn.value || '' }));
    toast('Taak toegevoegd');
    await hertekenTaken(kaart, ctx);
  };
  tekstIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') voegToe(); });

  const toonGedaan = kaart._toonGedaan ?? false;
  const gedaanSchakel = el('label', { class: 'schakel' },
    el('input', { type: 'checkbox', checked: toonGedaan, onChange: async (e) => {
      kaart._toonGedaan = e.target.checked;
      await hertekenTaken(kaart, ctx);
    } }),
    el('span', {}, 'Toon gedaan'),
  );

  kaart.append(
    el('div', { class: 'kaart__kop kaart__kop--los' },
      el('h3', {}, "Taken / to-do's"),
      gedaanSchakel,
    ),
    el('div', { class: 'acties-invoer' },
      el('div', { class: 'acties-invoer__tekst' }, tekstIn),
      el('div', { class: 'acties-invoer__datum' }, datumIn),
      el('button', { class: 'knop knop--primair', onClick: voegToe }, 'Toevoegen'),
    ),
  );

  let acties = await all('acties');
  acties.sort((a, b) => {
    if ((a.status === 'gedaan') !== (b.status === 'gedaan')) return a.status === 'gedaan' ? 1 : -1;
    return (b.aangemaakt || '').localeCompare(a.aangemaakt || '');
  });
  if (!toonGedaan) acties = acties.filter((a) => a.status !== 'gedaan');

  if (!acties.length) {
    kaart.append(leegKaart('Geen taken', toonGedaan ? 'Voeg hierboven een taak toe.' : 'Alles is afgewerkt — of voeg een nieuwe taak toe.'));
    return;
  }

  const lijst = el('ul', { class: 'actie-lijst' });
  for (const a of acties) {
    const gedaan = a.status === 'gedaan';
    const kn = klasnaam(ctx, a.klasId);
    lijst.append(
      el('li', { class: 'actie-item' + (gedaan ? ' actie-item--gedaan' : '') },
        el('input', { type: 'checkbox', checked: gedaan, title: gedaan ? 'Markeer als open' : 'Markeer als gedaan',
          onChange: async () => {
            a.status = gedaan ? 'open' : 'gedaan';
            await put('acties', a);
            await hertekenTaken(kaart, ctx);
          } }),
        el('span', { class: 'actie-item__tekst' }, a.tekst),
        el('div', { class: 'actie-item__meta' },
          a.datum ? el('span', { class: 'badge badge--stil' }, datumKort(a.datum)) : null,
          kn ? el('span', { class: 'badge' }, kn) : null,
          el('button', { class: 'icoonknop', title: 'Verwijderen', onClick: async () => {
            await remove('acties', a.id);
            toast('Taak verwijderd');
            await hertekenTaken(kaart, ctx);
          } }, '🗑'),
        ),
      ),
    );
  }
  kaart.append(lijst);
}

// ————————————————————————————— B) Communicatie-notities —————

async function tekenNotities(root, ctx) {
  const kaart = el('div', { class: 'kaart' });
  root.append(kaart);
  await hertekenNotities(kaart, ctx);
}

async function hertekenNotities(kaart, ctx) {
  leeg(kaart);

  kaart.append(
    el('div', { class: 'kaart__kop kaart__kop--los' },
      el('h3', {}, 'Communicatie-notities'),
      el('button', { class: 'knop knop--primair', onClick: () => notitieDialoog(kaart, ctx, null) }, '+ Notitie'),
    ),
    el('p', { class: 'zacht' }, 'Deze notities blijven lokaal; Klaskompas verstuurt niets.'),
  );

  const notities = await all('notities');
  notities.sort((a, b) => (b.datum || '').localeCompare(a.datum || ''));

  if (!notities.length) {
    kaart.append(leegKaart('Nog geen notities', 'Noteer een gesprek of afspraak met ouder, mentor, zorg of directie.'));
    return;
  }

  // Leerlingnamen ophalen (uit betrokken klassen) voor koppeling.
  const namen = await leerlingNamenMap(notities);

  const lijst = el('ul', { class: 'notitie-lijst' });
  for (const n of notities) {
    const naam = n.leerlingId ? namen.get(n.leerlingId) : '';
    lijst.append(
      el('li', { class: 'notitie-item' },
        el('div', { class: 'notitie-item__kop' },
          el('span', { class: 'badge' }, NOTITIE_KANAAL[n.kanaal] || n.kanaal),
          el('span', { class: 'badge badge--stil' }, datumKort(n.datum)),
          naam ? el('span', { class: 'zacht' }, naam) : null,
          n.opvolgen ? el('span', { class: 'badge badge--opvolgen' }, '⚑ Opvolgen') : null,
        ),
        el('p', { class: 'notitie-item__tekst' }, n.tekst),
        el('div', { class: 'notitie-item__voet' },
          el('span', { class: 'spatie' }),
          el('button', { class: 'icoonknop', title: 'Bewerken', onClick: () => notitieDialoog(kaart, ctx, n) }, '✏️'),
          el('button', { class: 'icoonknop', title: 'Verwijderen', onClick: async () => {
            if (await bevestig('Deze notitie verwijderen?', { gevaar: true, jaLabel: 'Verwijderen' })) {
              await remove('notities', n.id);
              toast('Notitie verwijderd');
              await hertekenNotities(kaart, ctx);
            }
          } }, '🗑'),
        ),
      ),
    );
  }
  kaart.append(lijst);
}

// Verzamel leerlingnamen voor de leerlingId's die in notities voorkomen.
async function leerlingNamenMap(notities) {
  const map = new Map();
  const ids = [...new Set(notities.map((n) => n.leerlingId).filter(Boolean))];
  for (const id of ids) {
    const l = await get('leerlingen', id);
    if (l) map.set(id, `${l.voornaam} ${l.naam}`.trim());
  }
  return map;
}

async function notitieDialoog(kaart, ctx, bestaand) {
  const leerlingen = ctx.klasId ? await leerlingenVanKlas(ctx.klasId) : [];

  dialoog(bestaand ? 'Notitie bewerken' : 'Nieuwe notitie', (body, sluit) => {
    const kanaal = keuze('Kanaal', NOTITIE_KANAAL, bestaand?.kanaal || 'ouder');

    let leerlingSel = null;
    if (leerlingen.length) {
      const opties = { '': '— Geen leerling —' };
      for (const l of leerlingen) opties[l.id] = `${l.voornaam} ${l.naam}`.trim();
      leerlingSel = keuze('Leerling (optioneel)', opties, bestaand?.leerlingId || '');
    }

    const tekst = tekstveld('Notitie', { value: bestaand?.tekst || '', rows: 4, placeholder: 'Wat is er besproken of afgesproken?' });
    const opvolgen = el('input', { type: 'checkbox', checked: !!bestaand?.opvolgen });
    const opvolgenWrap = el('label', { class: 'schakel' }, opvolgen, el('span', {}, 'Opvolgen'));

    body.append(
      kanaal.wrap,
      leerlingSel ? leerlingSel.wrap : null,
      tekst.wrap,
      opvolgenWrap,
      el('div', { class: 'dialoog__acties' },
        el('button', { class: 'knop', onClick: sluit }, 'Annuleren'),
        el('button', { class: 'knop knop--primair', onClick: async () => {
          if (!tekst.input.value.trim()) { toast('Geef een notitie in', 'fout'); return; }
          const leerlingId = leerlingSel ? (leerlingSel.select.value || null) : (bestaand?.leerlingId || null);
          if (bestaand) {
            Object.assign(bestaand, {
              kanaal: kanaal.select.value,
              leerlingId,
              tekst: tekst.input.value.trim(),
              opvolgen: opvolgen.checked,
            });
            await put('notities', bestaand);
          } else {
            await put('notities', maakNotitie({
              leerlingId,
              klasId: ctx.klasId || null,
              kanaal: kanaal.select.value,
              tekst: tekst.input.value.trim(),
              opvolgen: opvolgen.checked,
            }));
          }
          sluit();
          toast('Notitie opgeslagen');
          await hertekenNotities(kaart, ctx);
        } }, 'Opslaan'),
      ),
    );
  });
}
