// Bootstrap: database openen, sjablonen zaaien, shell + hash-router opzetten.

import { db, all, getSetting, setSetting } from './db/repo.js';
import { zaaiStartMenu } from './domain/beloningen.js';
import { el, leeg, toast } from './ui/components.js';

import * as dashboard from './views/dashboard.js';
import * as klassen from './views/klassen.js';
import * as schooljaar from './views/schooljaar.js';
import * as rooster from './views/rooster.js';
import * as aanwezigheid from './views/aanwezigheid.js';
import * as afspraken from './views/afspraken.js';
import * as beloningen from './views/beloningen.js';
import * as instellingen from './views/instellingen.js';
import * as klasscherm from './views/klasscherm.js';

const ROUTES = {
  dashboard: { titel: 'Dashboard', icoon: '🏠', view: dashboard, groep: 'admin' },
  klassen: { titel: 'Klassen & leerlingen', icoon: '👥', view: klassen, groep: 'admin' },
  schooljaar: { titel: 'Schooljaar & kalender', icoon: '📅', view: schooljaar, groep: 'admin' },
  rooster: { titel: 'Rooster', icoon: '🗓️', view: rooster, groep: 'admin' },
  aanwezigheid: { titel: 'Aanwezigheid', icoon: '✅', view: aanwezigheid, groep: 'admin' },
  afspraken: { titel: 'Afspraken & instructie', icoon: '🤝', view: afspraken, groep: 'admin' },
  beloningen: { titel: 'Beloningen', icoon: '🎁', view: beloningen, groep: 'admin' },
  instellingen: { titel: 'Instellingen & backup', icoon: '⚙️', view: instellingen, groep: 'admin' },
  klasscherm: { titel: 'Klasscherm', icoon: '📺', view: klasscherm, groep: 'les' },
};

const app = {
  actieveKlasId: null,
  klassen: [],
  root: null,
  inhoud: null,
  klaskiezer: null,
};

async function init() {
  document.body.append(bouwShell());
  try {
    await db();
    await zaaiStartMenu();
  } catch (e) {
    app.inhoud.append(
      el('div', { class: 'kaart kaart--fout' },
        el('h2', {}, 'Kan de lokale opslag niet openen'),
        el('p', {}, String(e.message || e)),
        el('p', { class: 'hint' }, 'Klaskompas heeft IndexedDB nodig. Werk je in een privévenster of met opslag geblokkeerd, sta dan lokale opslag toe.')),
    );
    return;
  }
  app.actieveKlasId = await getSetting('actieveKlasId', null);
  await herlaadKlassen();
  window.addEventListener('hashchange', route);
  route();
}

async function herlaadKlassen() {
  app.klassen = await all('klassen');
  app.klassen.sort((a, b) => a.naam.localeCompare(b.naam, 'nl'));
  if (app.actieveKlasId && !app.klassen.some((k) => k.id === app.actieveKlasId)) {
    app.actieveKlasId = null;
  }
  if (!app.actieveKlasId && app.klassen.length) app.actieveKlasId = app.klassen[0].id;
  vulKlaskiezer();
}

function vulKlaskiezer() {
  leeg(app.klaskiezer);
  if (!app.klassen.length) {
    app.klaskiezer.append(el('option', { value: '' }, 'Nog geen klassen'));
    app.klaskiezer.disabled = true;
    return;
  }
  app.klaskiezer.disabled = false;
  for (const k of app.klassen) {
    app.klaskiezer.append(
      el('option', { value: k.id, selected: k.id === app.actieveKlasId }, k.naam + (k.vak ? ` · ${k.vak}` : '')),
    );
  }
}

function bouwShell() {
  const root = el('div', { class: 'shell' });

  const navLinks = Object.entries(ROUTES)
    .filter(([, r]) => r.groep === 'admin')
    .map(([sleutel, r]) =>
      el('a', { class: 'nav__link', href: `#/${sleutel}`, dataset: { route: sleutel } },
        el('span', { class: 'nav__icoon' }, r.icoon), el('span', {}, r.titel)),
    );

  const zij = el('aside', { class: 'zijbalk' },
    el('div', { class: 'merk' }, el('span', { class: 'merk__logo' }, '🧭'), el('span', {}, 'Klaskompas')),
    el('nav', { class: 'nav' }, ...navLinks),
    el('a', { class: 'nav__lesmodus', href: '#/klasscherm' }, '📺 Lesmodus starten'),
    el('div', { class: 'zijbalk__voet' }, el('span', {}, 'Lokaal · v0.1 · privacy-by-design')),
  );

  app.klaskiezer = el('select', { class: 'klaskiezer', onChange: async (e) => {
    app.actieveKlasId = e.target.value || null;
    await setSetting('actieveKlasId', app.actieveKlasId);
    route();
  } });

  const topbalk = el('header', { class: 'topbalk' },
    el('button', { class: 'icoonknop zijbalk-toggle', title: 'Menu', onClick: () => root.classList.toggle('shell--open') }, '☰'),
    el('div', { class: 'topbalk__titel', id: 'paginatitel' }, 'Dashboard'),
    el('label', { class: 'klaskiezer-veld' }, el('span', {}, 'Actieve klas'), app.klaskiezer),
  );

  app.inhoud = el('main', { class: 'inhoud', id: 'inhoud' });
  const kolom = el('div', { class: 'hoofdkolom' }, topbalk, app.inhoud);
  root.append(zij, kolom);
  app.root = root;
  return root;
}

function huidigeRoute() {
  const h = (location.hash || '#/dashboard').replace(/^#\//, '');
  const sleutel = h.split('/')[0];
  return ROUTES[sleutel] ? sleutel : 'dashboard';
}

async function route() {
  const sleutel = huidigeRoute();
  const r = ROUTES[sleutel];
  const lesmodus = r.groep === 'les';
  app.root.classList.toggle('shell--lesmodus', lesmodus);
  app.root.classList.remove('shell--open');

  // Ruim de vorige view op (bv. microfoon van het Klasscherm stoppen).
  if (app.huidigeView && typeof app.huidigeView.cleanup === 'function') {
    try { app.huidigeView.cleanup(); } catch (_) { /* negeer */ }
  }
  app.huidigeView = r.view;

  document.querySelectorAll('.nav__link').forEach((a) =>
    a.classList.toggle('nav__link--actief', a.dataset.route === sleutel),
  );
  const titelEl = document.getElementById('paginatitel');
  if (titelEl) titelEl.textContent = r.titel;

  leeg(app.inhoud);
  const ctx = {
    klasId: app.actieveKlasId,
    klassen: app.klassen,
    navigate: (s) => { location.hash = `#/${s}`; },
    async herlaadKlassen() { await herlaadKlassen(); },
    setActieveKlas: async (id) => { app.actieveKlasId = id; await setSetting('actieveKlasId', id); vulKlaskiezer(); },
    toast,
  };
  try {
    await r.view.render(app.inhoud, ctx);
  } catch (e) {
    console.error(e);
    app.inhoud.append(el('div', { class: 'kaart kaart--fout' }, el('h2', {}, 'Er ging iets mis'), el('p', {}, String(e.message || e))));
  }
}

init();
