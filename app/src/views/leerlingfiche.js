// Leerlingfiche (ADR-0001 §2.4): één read-only overzicht per leerling.
// Kiezer bovenaan (select van de actieve klas + vrij zoekveld over alle leerlingen);
// daaronder kaarten met aanwezigheid, quota, observaties, consequenties, inhaalwerk en notities.

import { all, leerlingenVanKlas } from '../db/repo.js';
import {
  OBSERVATIE_CATEGORIE,
  QUOTA_TYPES,
  INHAALWERK_TYPE,
  INHAALWERK_STATUS,
  NOTITIE_KANAAL,
  AANWEZIGHEID_STATUS,
} from '../domain/model.js';
import { ficheData } from '../domain/individueel.js';
import { afdruk, escapeHtml } from '../domain/export.js';
import { el, leeg, keuze, datumKort, leegKaart, stijl } from '../ui/components.js';

export async function render(root, ctx) {
  stijl('css-leerlingfiche', CSS);

  root.append(el('div', { class: 'kaart__kop kaart__kop--los' }, el('h2', {}, 'Leerlingfiche')));

  if (!ctx.klasId) {
    root.append(
      leegKaart('Geen actieve klas', 'Kies eerst een klas (bij Klassen) om een leerlingfiche te bekijken.'),
    );
    return;
  }

  const leerlingen = await leerlingenVanKlas(ctx.klasId);
  const allen = await all('leerlingen');
  allen.sort((a, b) => (a.naam + a.voornaam).localeCompare(b.naam + b.voornaam, 'nl'));

  const naamVan = (l) => `${l.voornaam} ${l.naam}`.trim() || '(naamloos)';

  // — Kiezer —
  const opties = { '': '— Kies een leerling —' };
  for (const l of leerlingen) opties[l.id] = naamVan(l);
  const kies = keuze('Leerling in deze klas', opties, '');

  const zoek = el('input', {
    class: 'invoer',
    type: 'search',
    placeholder: 'Zoek op naam (alle leerlingen)…',
  });
  const zoekResultaat = el('div', { class: 'lf-zoekresultaat' });
  const zoekVeld = el('label', { class: 'veld' }, el('span', {}, 'Zoeken over alle leerlingen'), zoek, zoekResultaat);

  const detail = el('div', { class: 'lf-detail' });

  // — Afdrukknop (rapport voor de geselecteerde leerling) —
  const printKnop = el('button', {
    class: 'knop lf-printknop',
    type: 'button',
    disabled: true,
    onClick: () => { if (huidigeData?.leerling) afdruk(`Rapport — ${naamVan(huidigeData.leerling)}`, rapportHtml(huidigeData, naamVan, ctx)); },
  }, '🖨️ Rapport afdrukken');

  let huidigeData = null;

  const toon = async (leerlingId) => {
    leeg(detail);
    huidigeData = null;
    printKnop.disabled = true;
    if (!leerlingId) return;
    const data = await ficheData(leerlingId);
    if (!data?.leerling) {
      detail.append(el('p', { class: 'zacht' }, 'Leerling niet gevonden.'));
      return;
    }
    huidigeData = data;
    printKnop.disabled = false;
    toonFiche(detail, data, naamVan);
  };

  kies.select.addEventListener('change', () => {
    zoek.value = '';
    leeg(zoekResultaat);
    toon(kies.select.value);
  });

  zoek.addEventListener('input', () => {
    const term = zoek.value.trim().toLowerCase();
    leeg(zoekResultaat);
    if (!term) return;
    const treffers = allen
      .filter((l) => naamVan(l).toLowerCase().includes(term))
      .slice(0, 8);
    if (!treffers.length) {
      zoekResultaat.append(el('div', { class: 'lf-zoekresultaat__leeg zacht' }, 'Geen leerling gevonden.'));
      return;
    }
    for (const l of treffers) {
      zoekResultaat.append(
        el('button', {
          class: 'lf-treffer',
          type: 'button',
          onClick: () => {
            kies.select.value = leerlingen.some((k) => k.id === l.id) ? l.id : '';
            zoek.value = '';
            leeg(zoekResultaat);
            toon(l.id);
          },
        },
          el('span', { class: 'lf-treffer__naam' }, naamVan(l)),
          l.email ? el('span', { class: 'lf-treffer__mail zacht' }, l.email) : null,
        ),
      );
    }
  });

  root.append(
    el('div', { class: 'kaart' },
      el('div', { class: 'lf-kiezer' }, kies.wrap, zoekVeld),
      el('div', { class: 'lf-kiezer__acties' }, printKnop),
    ),
    detail,
  );

  if (leerlingen.length) {
    kies.select.value = leerlingen[0].id;
    toon(leerlingen[0].id);
  } else {
    detail.append(
      leegKaart('Nog geen leerlingen', 'Deze klas heeft nog geen leerlingen. Voeg ze toe bij Klassen.'),
    );
  }
}

function toonFiche(root, data, naamVan) {
  const { leerling, aanwezigheid, observaties, quota, consequenties, inhaalwerk, notities, seinen } = data;

  // 1 — Kop
  root.append(
    el('div', { class: 'kaart' },
      el('div', { class: 'lf-kop' },
        el('div', {},
          el('h2', { class: 'lf-kop__naam' }, naamVan(leerling)),
          el('p', { class: 'zacht lf-kop__mail' }, leerling.email || 'Geen e-mailadres'),
        ),
        seinen.length
          ? el('span', { class: 'badge lf-badge-sein', title: 'Quota over de drempel deze maand' },
              `🔔 ${seinen.length} ${seinen.length === 1 ? 'actief sein' : 'actieve seinen'}`)
          : null,
      ),
    ),
  );

  // 2 — Aanwezigheid
  const diag = el('div', { class: 'diag' });
  for (const [sleutel, label] of Object.entries(AANWEZIGHEID_STATUS)) {
    diag.append(
      el('div', { class: 'diag__item' },
        el('strong', {}, String(aanwezigheid[sleutel] ?? 0)),
        el('span', { class: 'zacht' }, label),
      ),
    );
  }
  root.append(kaart('Aanwezigheid', diag));

  // 3 — Quota
  root.append(kaart('Feitelijke tellers (quota)',
    quota.length
      ? el('div', { class: 'lf-lijst' },
          ...quota.map((q) => {
            const overDrempel = q.aantal >= q.drempel;
            return el('div', { class: 'regel lf-regel' + (overDrempel ? ' lf-regel--sein' : '') },
              el('span', { class: 'regel__label' }, QUOTA_TYPES[q.type] || q.type),
              el('span', { class: 'lf-quota__waarde' },
                overDrempel ? el('span', { class: 'badge lf-badge-sein' }, '🔔') : null,
                el('strong', {}, `${q.aantal}/${q.drempel}`),
              ),
            );
          }),
        )
      : nogNiets('Nog geen tellers geregistreerd.'),
  ));

  // 4 — Observaties (ABC)
  root.append(kaart('Observaties (ABC)',
    observaties.length
      ? el('div', { class: 'lf-lijst' },
          ...observaties.map((o) =>
            el('div', { class: 'lf-item' + (o.opvolgen ? ' lf-item--opvolgen' : '') },
              el('div', { class: 'lf-item__kop' },
                el('span', { class: 'zacht' }, datumKort(o.datum)),
                el('span', { class: 'badge badge--stil' }, OBSERVATIE_CATEGORIE[o.categorie] || o.categorie),
                o.opvolgen ? el('span', { class: 'badge lf-badge-opvolgen' }, 'Opvolgen') : null,
              ),
              abcRegel('A', o.aanleiding),
              abcRegel('B', o.gedrag),
              abcRegel('C', o.gevolg),
            ),
          ),
        )
      : nogNiets('Nog geen observaties.'),
  ));

  // 5 — Consequenties
  root.append(kaart('Consequenties',
    consequenties.length
      ? el('div', { class: 'lf-lijst' },
          ...consequenties.map((c) =>
            el('div', { class: 'regel lf-regel' },
              el('span', { class: 'regel__label' }, datumKort(c.datum)),
              el('span', {}, c.stap || '—'),
            ),
          ),
        )
      : nogNiets('Nog geen consequenties gezet.'),
  ));

  // 6 — Inhaalwerk
  root.append(kaart('Inhaalwerk',
    inhaalwerk.length
      ? el('div', { class: 'lf-lijst' },
          ...inhaalwerk.map((i) =>
            el('div', { class: 'lf-item' },
              el('div', { class: 'lf-item__kop' },
                el('span', { class: 'badge badge--stil' }, INHAALWERK_TYPE[i.type] || i.type),
                el('span', { class: 'lf-inhaal__titel' }, i.titel || '(zonder titel)'),
                el('span', { class: 'badge' }, INHAALWERK_STATUS[i.status] || i.status),
              ),
            ),
          ),
        )
      : nogNiets('Geen openstaand inhaalwerk.'),
  ));

  // 7 — Communicatie-notities
  root.append(kaart('Communicatie',
    notities.length
      ? el('div', { class: 'lf-lijst' },
          ...notities.map((n) =>
            el('div', { class: 'lf-item' },
              el('div', { class: 'lf-item__kop' },
                el('span', { class: 'badge badge--stil' }, NOTITIE_KANAAL[n.kanaal] || n.kanaal),
                el('span', { class: 'zacht' }, datumKort(n.datum)),
              ),
              el('p', { class: 'lf-notitie__tekst' }, n.tekst || '—'),
            ),
          ),
        )
      : nogNiets('Nog geen communicatie geregistreerd.'),
  ));
}

// — Afdrukbaar rapport (HTML-string voor afdruk(...)) —

function rapportHtml(data, naamVan, ctx) {
  const { leerling, aanwezigheid, observaties, quota, consequenties, inhaalwerk, notities } = data;
  const e = escapeHtml;
  const klasNaam = (ctx?.klassen || []).find((k) => k.id === ctx?.klasId)?.naam || '';

  const metaDelen = [];
  if (leerling.email) metaDelen.push(e(leerling.email));
  if (klasNaam) metaDelen.push('Klas: ' + e(klasNaam));
  const meta = metaDelen.length ? metaDelen.join(' · ') : 'Geen bijkomende gegevens';

  const deel = (titel, binnen) => `<h2>${e(titel)}</h2>${binnen}`;

  // Aanwezigheid — tellingen per status
  const aanwRijen = Object.entries(AANWEZIGHEID_STATUS)
    .map(([sleutel, label]) => `<tr><td>${e(label)}</td><td class="num">${e(aanwezigheid[sleutel] ?? 0)}</td></tr>`)
    .join('');
  const aanwHtml = `<table><thead><tr><th>Status</th><th class="num">Aantal</th></tr></thead><tbody>${aanwRijen}</tbody></table>`;

  // Observaties
  const obsHtml = observaties.length
    ? `<table><thead><tr><th>Datum</th><th>Categorie</th><th>A — Aanleiding</th><th>B — Gedrag</th><th>C — Gevolg</th></tr></thead><tbody>${
        observaties.map((o) =>
          `<tr><td>${e(datumKort(o.datum))}</td><td>${e(OBSERVATIE_CATEGORIE[o.categorie] || o.categorie)}</td>` +
          `<td>${e(o.aanleiding || '—')}</td><td>${e(o.gedrag || '—')}</td><td>${e(o.gevolg || '—')}</td></tr>`,
        ).join('')
      }</tbody></table>`
    : '<p>Geen</p>';

  // Quota
  const quotaHtml = quota.length
    ? `<table><thead><tr><th>Type</th><th class="num">Aantal</th><th class="num">Drempel</th></tr></thead><tbody>${
        quota.map((q) =>
          `<tr><td>${e(QUOTA_TYPES[q.type] || q.type)}</td><td class="num">${e(q.aantal)}</td><td class="num">${e(q.drempel)}</td></tr>`,
        ).join('')
      }</tbody></table>`
    : '<p>Geen</p>';

  // Consequenties
  const consHtml = consequenties.length
    ? `<ul>${consequenties.map((c) => `<li>${e(datumKort(c.datum))} — ${e(c.stap || '—')}</li>`).join('')}</ul>`
    : '<p>Geen</p>';

  // Inhaalwerk
  const inhaalHtml = inhaalwerk.length
    ? `<table><thead><tr><th>Type</th><th>Titel</th><th>Status</th></tr></thead><tbody>${
        inhaalwerk.map((i) =>
          `<tr><td>${e(INHAALWERK_TYPE[i.type] || i.type)}</td><td>${e(i.titel || '(zonder titel)')}</td><td>${e(INHAALWERK_STATUS[i.status] || i.status)}</td></tr>`,
        ).join('')
      }</tbody></table>`
    : '<p>Geen</p>';

  // Communicatie-notities
  const notitieHtml = notities.length
    ? `<table><thead><tr><th>Kanaal</th><th>Datum</th><th>Tekst</th></tr></thead><tbody>${
        notities.map((n) =>
          `<tr><td>${e(NOTITIE_KANAAL[n.kanaal] || n.kanaal)}</td><td>${e(datumKort(n.datum))}</td><td>${e(n.tekst || '—')}</td></tr>`,
        ).join('')
      }</tbody></table>`
    : '<p>Geen</p>';

  return `<h1>${e(naamVan(leerling))}</h1><div class="meta">${meta}</div>` +
    deel('Aanwezigheid', aanwHtml) +
    deel('Observaties', obsHtml) +
    deel('Quota', quotaHtml) +
    deel('Consequenties', consHtml) +
    deel('Inhaalwerk', inhaalHtml) +
    deel('Communicatie-notities', notitieHtml);
}

// — kleine bouwstenen —

function kaart(titel, inhoud) {
  return el('div', { class: 'kaart' }, el('h3', { class: 'sectiekop' }, titel), inhoud);
}

function nogNiets(tekst) {
  return el('p', { class: 'zacht lf-nogniets' }, tekst);
}

function abcRegel(letter, tekst) {
  if (!tekst) return null;
  return el('div', { class: 'lf-abc' },
    el('span', { class: 'lf-abc__letter' }, letter),
    el('span', {}, tekst),
  );
}

const CSS = `
.lf-kiezer { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0 16px; }
.lf-kiezer .veld { margin-bottom: 0; }
.lf-kiezer__acties { margin-top: 12px; }
.lf-printknop[disabled] { opacity: 0.55; cursor: not-allowed; }
.lf-zoekresultaat { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; }
.lf-treffer {
  text-align: left; display: flex; flex-direction: column; gap: 1px; cursor: pointer;
  padding: 8px 10px; border: 1px solid var(--rand); border-radius: var(--radius-s); background: var(--paneel-2); color: var(--tekst);
}
.lf-treffer:hover { border-color: var(--accent); }
.lf-treffer__naam { font-weight: 600; }
.lf-treffer__mail { font-size: 0.78rem; }
.lf-zoekresultaat__leeg { font-size: 0.85rem; padding: 4px 2px; }

.lf-detail { display: flex; flex-direction: column; gap: 14px; }
.lf-detail .kaart { margin: 0; }

.lf-kop { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.lf-kop__naam { margin: 0; }
.lf-kop__mail { margin: 2px 0 0; }
.lf-badge-sein { background: color-mix(in srgb, var(--goud) 26%, transparent); color: var(--tekst); }

.lf-lijst { display: flex; flex-direction: column; gap: 8px; }
.lf-regel { align-items: center; }
.lf-regel--sein { color: var(--tekst); font-weight: 600; }
.lf-quota__waarde { display: inline-flex; align-items: center; gap: 8px; }

.lf-item { padding: 10px 12px; background: var(--paneel-2); border-radius: var(--radius-s); border: 1px solid var(--rand); }
.lf-item--opvolgen { border-color: color-mix(in srgb, var(--goud) 55%, var(--rand)); }
.lf-item__kop { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }
.lf-badge-opvolgen { background: color-mix(in srgb, var(--goud) 26%, transparent); color: var(--tekst); }
.lf-inhaal__titel { font-weight: 600; }

.lf-abc { display: flex; gap: 8px; padding: 1px 0; font-size: 0.9rem; }
.lf-abc__letter {
  flex: 0 0 auto; width: 18px; height: 18px; display: grid; place-items: center; margin-top: 1px;
  border-radius: 4px; background: var(--paneel); border: 1px solid var(--rand); color: var(--tekst-zacht);
  font-size: 0.7rem; font-weight: 700;
}
.lf-notitie__tekst { margin: 0; }
.lf-nogniets { margin: 0; font-style: italic; }
`;
