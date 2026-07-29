// Individueel spoor (ADR-0001 §2.2/§2.4): feitelijk en privaat, LOS van de klaspot.
// Quota-tellers met seinen, ABC-observaties en de herstel-/consequentieladder.
// Geen scores, geen labels, geen automatische straf — enkel feiten en seintjes.

import { get, put, byIndex, leerlingenVanKlas } from '../db/repo.js';
import {
  OBSERVATIE_CATEGORIE,
  HERSTELVRAGEN,
  CONSEQUENTIE_LADDER,
  QUOTA_TYPES,
  maakObservatie,
  maakQuota,
} from '../domain/model.js';
import { verhoogQuota, verlaagQuota, logConsequentie } from '../domain/individueel.js';
import {
  el, leeg, toast, dialoog, stijl, veld, tekstveld, keuze, leegKaart,
} from '../ui/components.js';

const CSS = `
.ind-uitleg { border-left: 3px solid var(--goud); background: var(--paneel-2); padding: 12px 14px; border-radius: var(--radius-s); margin-bottom: 14px; }
.ind-uitleg p { margin: 0; color: var(--tekst-zacht); font-size: 0.86rem; line-height: 1.45; }
.ind-lijst { display: flex; flex-direction: column; gap: 12px; }
.ind-kaart__kop { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.ind-kaart__naam { font-size: 1.05rem; font-weight: 700; margin-right: auto; }
.ind-quota { display: flex; flex-direction: column; gap: 6px; margin: 10px 0 12px; }
.ind-teller { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border: 1px solid var(--rand); border-radius: var(--radius-s); background: var(--paneel-2); }
.ind-teller__label { flex: 1; font-size: 0.88rem; }
.ind-teller__telling { font-variant-numeric: tabular-nums; font-weight: 700; }
.ind-teller--seint { border-color: var(--goud); background: color-mix(in srgb, var(--goud) 16%, var(--paneel-2)); }
.ind-sein { display: inline-flex; align-items: center; gap: 4px; font-weight: 700; font-size: 0.78rem; color: var(--goud); padding: 2px 8px; border-radius: 999px; border: 1px solid var(--goud); }
.ind-teller__knoppen { display: flex; gap: 4px; }
.ind-teller__knoppen .icoonknop { border: 1px solid var(--rand); }
.ind-quota--leeg { color: var(--tekst-zacht); font-style: italic; font-size: 0.84rem; margin: 8px 0 12px; }
.ind-ladder__stap { border: 1px solid var(--rand); border-radius: var(--radius-s); padding: 10px 12px; margin-bottom: 8px; }
.ind-ladder__kop { display: flex; align-items: center; gap: 10px; }
.ind-ladder__label { font-weight: 700; margin-right: auto; }
.ind-ladder__hint { margin: 4px 0 0; color: var(--tekst-zacht); font-size: 0.82rem; }
.ind-vragen { margin: 8px 0 0; padding: 8px 10px; background: var(--paneel-2); border-radius: var(--radius-s); }
.ind-vragen li { display: flex; gap: 8px; align-items: flex-start; padding: 3px 0; font-size: 0.84rem; list-style: none; }
.ind-check { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.ind-check input { width: auto; }
`;

export async function render(root, ctx) {
  stijl('css-individueel', CSS);

  if (!ctx.klasId) {
    root.append(leegKaart('Geen actieve klas', 'Kies een klas in de balk bovenaan om het individuele spoor te openen.'));
    return;
  }

  const klas = await get('klassen', ctx.klasId);

  root.append(
    el('div', { class: 'kaart__kop kaart__kop--los' }, el('h2', {}, `Individueel spoor — ${klas?.naam || ''}`)),
    el('div', { class: 'ind-uitleg' },
      el('p', {},
        'Dit spoor is privaat en feitelijk: tellers, ABC-observaties en herstelstappen. Het staat los van de klaspot — een teller die “seint” (🔔) is enkel een signaal, geen automatische straf. Elk gevolg beslist u zelf.'),
    ),
  );

  const leerlingen = await leerlingenVanKlas(ctx.klasId);
  if (!leerlingen.length) {
    root.append(leegKaart('Geen leerlingen', 'Voeg eerst leerlingen toe aan deze klas.'));
    return;
  }

  const lijst = el('div', { class: 'ind-lijst' });
  root.append(lijst);
  for (const l of leerlingen) {
    const kaart = el('div', { class: 'kaart ind-kaart' });
    lijst.append(kaart);
    await vulKaart(kaart, l, ctx);
  }
}

/** Teken (of hertekent) de kaart van één leerling. */
async function vulKaart(kaart, leerling, ctx) {
  leeg(kaart);
  const naam = `${leerling.voornaam} ${leerling.naam}`.trim();
  const hertekenen = () => vulKaart(kaart, leerling, ctx);

  const [tellers, observaties] = await Promise.all([
    byIndex('quota', 'leerlingId', leerling.id),
    byIndex('observaties', 'leerlingId', leerling.id),
  ]);
  const seinenAantal = tellers.filter((q) => q.aantal >= q.drempel).length;

  const kop = el('div', { class: 'ind-kaart__kop' },
    el('span', { class: 'ind-kaart__naam' }, naam),
    seinenAantal
      ? el('span', { class: 'ind-sein', title: 'Teller(s) boven de drempel' }, `🔔 ${seinenAantal} seint${seinenAantal > 1 ? 'en' : ''}`)
      : null,
    el('span', { class: 'badge badge--stil' }, `${observaties.length} observatie${observaties.length === 1 ? '' : 's'}`),
  );
  kaart.append(kop);

  // — Quota-tellers —
  if (tellers.length) {
    const box = el('div', { class: 'ind-quota' });
    tellers.sort((a, b) => (QUOTA_TYPES[a.type] || a.type).localeCompare(QUOTA_TYPES[b.type] || b.type, 'nl'));
    for (const q of tellers) {
      const seint = q.aantal >= q.drempel;
      box.append(
        el('div', { class: 'ind-teller' + (seint ? ' ind-teller--seint' : '') },
          el('span', { class: 'ind-teller__label' },
            `${QUOTA_TYPES[q.type] || q.type}: `,
            el('span', { class: 'ind-teller__telling' }, `${q.aantal}/${q.drempel}`),
          ),
          seint ? el('span', { class: 'ind-sein' }, '🔔 seint') : null,
          el('div', { class: 'ind-teller__knoppen' },
            el('button', { class: 'icoonknop', title: 'Teller verlagen (correctie)', disabled: q.aantal <= 0, onClick: async () => {
              await verlaagQuota(q.id);
              hertekenen();
            } }, '−'),
            el('button', { class: 'icoonknop', title: 'Teller verhogen', onClick: async () => {
              const res = await verhoogQuota(q.id);
              if (res?.sein) toast(`${naam} — ${QUOTA_TYPES[q.type] || q.type} seint (${res.quota.aantal}/${res.quota.drempel}) 🔔`, 'waarschuwing');
              hertekenen();
            } }, '+'),
          ),
        ),
      );
    }
    kaart.append(box);
  } else {
    kaart.append(el('p', { class: 'ind-quota--leeg' }, 'Nog geen tellers voor deze leerling.'));
  }

  // — Actieknoppen —
  kaart.append(
    el('div', { class: 'knoprij' },
      el('button', { class: 'knop', onClick: () => tellerDialoog(leerling, ctx, hertekenen) }, '＋ teller'),
      el('button', { class: 'knop', onClick: () => observatieDialoog(leerling, ctx, hertekenen) }, '📝 Observatie'),
      el('button', { class: 'knop', onClick: () => ladderDialoog(leerling, ctx) }, '🪜 Herstel/consequentie'),
    ),
  );
}

/** Dialoog: nieuwe quota-teller. */
function tellerDialoog(leerling, ctx, klaar) {
  dialoog(`Nieuwe teller — ${leerling.voornaam} ${leerling.naam}`.trim(), (body, sluit) => {
    const type = keuze('Type teller', QUOTA_TYPES, 'boek');
    const drempel = veld('Drempel (seint vanaf)', { type: 'number', value: 3 });
    body.append(
      type.wrap,
      drempel.wrap,
      el('p', { class: 'zacht' }, 'De teller reset automatisch elke maand. Boven de drempel geeft hij enkel een seintje.'),
      el('div', { class: 'dialoog__acties' },
        el('button', { class: 'knop', onClick: sluit }, 'Annuleren'),
        el('button', { class: 'knop knop--primair', onClick: async () => {
          const d = Number(drempel.input.value);
          const q = maakQuota({ leerlingId: leerling.id, klasId: ctx.klasId, type: type.select.value, drempel: d > 0 ? d : 3 });
          await put('quota', q);
          sluit();
          toast('Teller toegevoegd');
          await klaar();
        } }, 'Toevoegen'),
      ),
    );
  });
}

/** Dialoog: ABC-observatie toevoegen. */
function observatieDialoog(leerling, ctx, klaar) {
  dialoog(`Observatie — ${leerling.voornaam} ${leerling.naam}`.trim(), (body, sluit) => {
    const categorie = keuze('Categorie', OBSERVATIE_CATEGORIE, 'gedrag');
    const aanleiding = tekstveld('A — Aanleiding (wat ging eraan vooraf?)', { rows: 2 });
    const gedrag = tekstveld('B — Gedrag / feit (wat gebeurde er precies?)', { rows: 2 });
    const gevolg = tekstveld('C — Gevolg (wat volgde erop?)', { rows: 2 });
    const opvolgen = el('input', { type: 'checkbox' });
    body.append(
      categorie.wrap,
      aanleiding.wrap,
      gedrag.wrap,
      gevolg.wrap,
      el('label', { class: 'ind-check' }, opvolgen, el('span', {}, 'Opvolgen')),
      el('div', { class: 'dialoog__acties' },
        el('button', { class: 'knop', onClick: sluit }, 'Annuleren'),
        el('button', { class: 'knop knop--primair', onClick: async () => {
          if (!gedrag.input.value.trim()) { toast('Beschrijf minstens het gedrag (B)', 'fout'); return; }
          const o = maakObservatie({
            leerlingId: leerling.id,
            klasId: ctx.klasId,
            categorie: categorie.select.value,
            aanleiding: aanleiding.input.value.trim(),
            gedrag: gedrag.input.value.trim(),
            gevolg: gevolg.input.value.trim(),
            opvolgen: opvolgen.checked,
          });
          await put('observaties', o);
          sluit();
          toast('Observatie bewaard');
          await klaar();
        } }, 'Bewaren'),
      ),
    );
  });
}

/** Dialoog: consequentie-/herstelladder — één stap zetten. */
function ladderDialoog(leerling, ctx) {
  dialoog(`Herstel / consequentie — ${leerling.voornaam} ${leerling.naam}`.trim(), (body, sluit) => {
    const note = tekstveld('Notitie bij de stap (optioneel)', { rows: 2, placeholder: 'Bv. context of afspraak…' });

    const stappen = el('div', {});
    for (const stap of CONSEQUENTIE_LADDER) {
      const kop = el('div', { class: 'ind-ladder__kop' },
        el('span', { class: 'ind-ladder__label' }, stap.label),
        el('button', { class: 'knop knop--primair', onClick: async () => {
          await logConsequentie({ leerlingId: leerling.id, klasId: ctx.klasId, stap: stap.sleutel, note: note.input.value.trim() });
          sluit();
          toast(`Stap gezet: ${stap.label}`);
        } }, 'Zet stap'),
      );
      const vak = el('div', { class: 'ind-ladder__stap' }, kop, el('p', { class: 'ind-ladder__hint' }, stap.hint));
      if (stap.sleutel === 'herstelgesprek') {
        vak.append(
          el('ul', { class: 'ind-vragen' },
            ...HERSTELVRAGEN.map((v) => el('li', {}, el('span', {}, '☐'), el('span', {}, v))),
          ),
        );
      }
      stappen.append(vak);
    }

    body.append(
      el('p', { class: 'zacht' }, 'Van licht naar zwaar. Kies bewust — dit is een keuze, geen automatisme.'),
      note.wrap,
      stappen,
      el('div', { class: 'dialoog__acties' },
        el('button', { class: 'knop', onClick: sluit }, 'Sluiten'),
      ),
    );
  });
}
