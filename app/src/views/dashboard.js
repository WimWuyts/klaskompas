// Dashboard: overzicht + snelkoppelingen. Vangt de lege begintoestand op met onboarding.

import { telAlles, get } from '../db/repo.js';
import { potStatus } from '../domain/klaspot.js';
import { el, euro, leegKaart } from '../ui/components.js';

export async function render(root, ctx) {
  const tellingen = await telAlles();
  const geenData = tellingen.klassen === 0;

  if (geenData) {
    root.append(
      el('div', { class: 'kaart onboarding' },
        el('h2', {}, 'Welkom bij Klaskompas 🧭'),
        el('p', {}, 'Er zijn nog geen klassen. Zet de structuur nu op — concrete gegevens kun je later invullen of importeren.'),
        el('div', { class: 'onboarding__stappen' },
          stap('1', 'Schooljaar', 'Leg een schooljaar met kalender vast.', () => ctx.navigate('schooljaar')),
          stap('2', 'Klassen & leerlingen', 'Importeer een klaslijst (CSV) of voeg handmatig toe.', () => ctx.navigate('klassen')),
          stap('3', 'Lesmodus', 'Projecteer het Klasscherm met de geldkoker.', () => ctx.navigate('klasscherm')),
        ),
      ),
    );
    return;
  }

  root.append(
    el('div', { class: 'tegels' },
      tegel('👥', tellingen.klassen, 'klassen', () => ctx.navigate('klassen')),
      tegel('🧑‍🎓', tellingen.leerlingen, 'leerlingen', () => ctx.navigate('klassen')),
      tegel('📅', tellingen.schooljaren, 'schooljaren', () => ctx.navigate('schooljaar')),
      tegel('🎁', tellingen.beloningen, 'beloningen', () => ctx.navigate('beloningen')),
    ),
  );

  if (ctx.klasId) {
    const klas = await get('klassen', ctx.klasId);
    const status = await potStatus(ctx.klasId);
    root.append(
      el('div', { class: 'kaart' },
        el('div', { class: 'kaart__kop' },
          el('h2', {}, `Actieve klas — ${klas?.naam || ''}`),
          el('a', { class: 'knop knop--primair', href: '#/klasscherm' }, '📺 Lesmodus'),
        ),
        el('div', { class: 'potsamenvatting' },
          el('div', { class: 'potsamenvatting__saldo' }, euro(status.saldo)),
          el('div', { class: 'potsamenvatting__meta' },
            regel('Prijsdrempel', euro(status.config.prijsdrempel)),
            regel('Startkapitaal', euro(status.config.startkapitaal)),
            regel('Status', status.prijsBereikt ? '🎉 prijs beschikbaar' : status.onderHerstart ? '⚠️ herstart-zone' : 'op koers'),
          ),
        ),
      ),
    );
  } else {
    root.append(leegKaart('Geen actieve klas', 'Kies rechtsboven een klas of maak er een aan.'));
  }
}

function tegel(icoon, getal, label, onClick) {
  return el('button', { class: 'tegel', onClick },
    el('span', { class: 'tegel__icoon' }, icoon),
    el('span', { class: 'tegel__getal' }, String(getal)),
    el('span', { class: 'tegel__label' }, label),
  );
}

function stap(nr, titel, tekst, onClick) {
  return el('button', { class: 'stap', onClick },
    el('span', { class: 'stap__nr' }, nr),
    el('span', { class: 'stap__titel' }, titel),
    el('span', { class: 'stap__tekst' }, tekst),
  );
}

function regel(label, waarde) {
  return el('div', { class: 'regel' }, el('span', { class: 'regel__label' }, label), el('span', {}, waarde));
}
