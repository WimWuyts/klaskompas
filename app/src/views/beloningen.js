// Beloningen beheren (ADR-0003): menu per klas + sjablonen. Toevoegen, bewerken, verwijderen.

import { all, get, put, remove, beloningenVoorKlas } from '../db/repo.js';
import { maakBeloning, BELONING_CATEGORIE, BELONING_NIVEAU } from '../domain/model.js';
import { zaaiStartMenu } from '../domain/beloningen.js';
import { el, leeg, toast, dialoog, bevestig, euro, leegKaart } from '../ui/components.js';

export async function render(root, ctx) {
  const klas = ctx.klasId ? await get('klassen', ctx.klasId) : null;

  root.append(
    el('div', { class: 'kaart__kop kaart__kop--los' },
      el('h2', {}, 'Beloningen'),
      el('div', { class: 'knoprij' },
        el('button', { class: 'knop', onClick: async () => { const n = await zaaiStartMenu(); toast(n ? `${n} sjablonen toegevoegd` : 'Startmenu bestaat al'); render(leeg(root), ctx); } }, '✨ Startmenu'),
        el('button', { class: 'knop knop--primair', onClick: () => bewerkDialoog(root, ctx, null) }, '+ Beloning'),
      ),
    ),
    el('p', { class: 'zacht' }, klas ? `Menu voor ${klas.naam} — klas-eigen beloningen én gedeelde sjablonen.` : 'Kies een actieve klas om klas-eigen beloningen te zien. Sjablonen (voor alle klassen) verschijnen altijd.'),
  );

  const lijst = ctx.klasId ? await beloningenVoorKlas(ctx.klasId) : (await all('beloningen')).filter((b) => b.klasId === '*');
  const volgorde = { klein: 0, midden: 1, groot: 2 };
  lijst.sort((a, b) => (volgorde[a.niveau] - volgorde[b.niveau]) || a.prijs - b.prijs);

  if (!lijst.length) {
    root.append(leegKaart('Nog geen beloningen', 'Klik “Startmenu” voor de aanbevolen set, of voeg er zelf een toe.'));
    return;
  }

  for (const [sleutel, label] of Object.entries(BELONING_CATEGORIE)) {
    const items = lijst.filter((b) => b.categorie === sleutel);
    if (!items.length) continue;
    const grid = el('div', { class: 'menu-grid' });
    for (const b of items) {
      grid.append(
        el('div', { class: 'menu-item menu-item--' + b.niveau },
          el('div', { class: 'menu-item__kop' },
            el('span', { class: 'menu-item__naam' }, b.naam),
            el('span', { class: 'menu-item__prijs' }, euro(b.prijs)),
          ),
          b.omschrijving ? el('p', { class: 'menu-item__oms' }, b.omschrijving) : null,
          b.talen ? el('p', { class: 'menu-item__talen' }, '🗣 ' + b.talen) : null,
          el('div', { class: 'menu-item__voet' },
            el('span', { class: 'badge' }, b.klasId === '*' ? 'sjabloon' : 'deze klas'),
            el('span', { class: 'badge badge--stil' }, BELONING_NIVEAU[b.niveau] || b.niveau),
            el('span', { class: 'spatie' }),
            el('button', { class: 'icoonknop', title: 'Bewerken', onClick: () => bewerkDialoog(root, ctx, b) }, '✏️'),
            el('button', { class: 'icoonknop', title: 'Verwijderen', onClick: async () => {
              if (await bevestig(`"${b.naam}" verwijderen?`, { gevaar: true, jaLabel: 'Verwijderen' })) {
                await remove('beloningen', b.id); toast('Verwijderd'); render(leeg(root), ctx);
              }
            } }, '🗑'),
          ),
        ),
      );
    }
    root.append(el('div', { class: 'kaart' }, el('h3', { class: 'sectiekop' }, label), grid));
  }
}

function bewerkDialoog(root, ctx, bestaand) {
  dialoog(bestaand ? 'Beloning bewerken' : 'Nieuwe beloning', (body, sluit) => {
    const naam = veld('Naam', bestaand?.naam || '');
    const prijs = veld('Prijs (€)', bestaand?.prijs ?? 25, 'number');
    const categorie = keuze('Categorie', BELONING_CATEGORIE, bestaand?.categorie || 'voorrecht');
    const niveau = keuze('Niveau', BELONING_NIVEAU, bestaand?.niveau || 'midden');
    const talen = veld('Talen-toepassing (optioneel)', bestaand?.talen || '');
    const oms = veldArea('Omschrijving (optioneel)', bestaand?.omschrijving || '');
    const scope = keuze('Geldt voor', { klas: 'Deze klas', sjabloon: 'Alle klassen (sjabloon)' },
      bestaand ? (bestaand.klasId === '*' ? 'sjabloon' : 'klas') : (ctx.klasId ? 'klas' : 'sjabloon'));

    body.append(naam.wrap, prijs.wrap, categorie.wrap, niveau.wrap, talen.wrap, oms.wrap, scope.wrap,
      el('div', { class: 'dialoog__acties' },
        el('button', { class: 'knop', onClick: sluit }, 'Annuleren'),
        el('button', { class: 'knop knop--primair', onClick: async () => {
          if (!naam.input.value.trim()) { toast('Geef een naam', 'fout'); return; }
          const klasId = scope.select.value === 'sjabloon' ? '*' : (ctx.klasId || '*');
          if (bestaand) {
            Object.assign(bestaand, { naam: naam.input.value.trim(), prijs: Number(prijs.input.value) || 0,
              categorie: categorie.select.value, niveau: niveau.select.value, talen: talen.input.value.trim(),
              omschrijving: oms.input.value.trim(), klasId });
            await put('beloningen', bestaand);
          } else {
            await put('beloningen', maakBeloning({ klasId, naam: naam.input.value.trim(), prijs: Number(prijs.input.value),
              categorie: categorie.select.value, niveau: niveau.select.value, talen: talen.input.value.trim(), omschrijving: oms.input.value.trim() }));
          }
          sluit(); toast('Opgeslagen'); render(leeg(root), ctx);
        } }, 'Opslaan'),
      ),
    );
  });
}

// — kleine formulier-helpers —
function veld(label, waarde = '', type = 'text') {
  const input = el('input', { class: 'invoer', type, value: waarde });
  return { input, wrap: etiket(label, input) };
}
function veldArea(label, waarde = '') {
  const input = el('textarea', { class: 'invoer', rows: 2 }, waarde);
  return { input, wrap: etiket(label, input) };
}
function keuze(label, opties, gekozen) {
  const select = el('select', { class: 'invoer' }, ...Object.entries(opties).map(([v, l]) => el('option', { value: v, selected: v === gekozen }, l)));
  return { select, wrap: etiket(label, select) };
}
function etiket(label, control) {
  return el('label', { class: 'veld' }, el('span', {}, label), control);
}
