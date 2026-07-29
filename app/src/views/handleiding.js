// Handleiding: een beknopte, vriendelijke mini-handleiding binnen de app.
// Statische inhoudspagina in kaarten met kopjes. Geen data-afhankelijkheden.

import { el, stijl } from '../ui/components.js';

/** Kleine kaart-bouwer: titel + inhoud (elementen). */
function kaart(titel, ...inhoud) {
  return el('div', { class: 'kaart' },
    el('h3', { class: 'sectiekop' }, titel),
    ...inhoud,
  );
}

export async function render(root, ctx) {
  stijl('css-handleiding', `
    .handleiding { display: grid; gap: 16px; }
    .handleiding .kaart { display: grid; gap: 8px; }
    .handleiding .kaart p { margin: 0; line-height: 1.5; }
    .handleiding ul { margin: 4px 0 0; padding-left: 20px; line-height: 1.5; }
    .handleiding ul li { margin: 3px 0; }
    .handleiding .weergaves { display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
    .handleiding .weergave { border: 1px solid var(--rand); border-radius: var(--radius-s); padding: 10px 12px; background: var(--paneel); }
    .handleiding .weergave h4 { margin: 0 0 4px; font-size: 0.95rem; }
    .handleiding .weergave p { color: var(--tekst-zacht); font-size: 0.9rem; }
    .handleiding .meer { border-left: 3px solid var(--accent); }
    .handleiding code { background: var(--paneel); border: 1px solid var(--rand); border-radius: var(--radius-s); padding: 1px 6px; font-size: 0.9em; }
  `);

  const wrap = el('div', { class: 'handleiding' });

  wrap.append(
    el('div', { class: 'kaart__kop kaart__kop--los' },
      el('h2', {}, 'Handleiding'),
      el('span', { class: 'badge badge--stil' }, 'lokaal-eerst'),
    ),
    el('p', { class: 'zacht' }, 'Een korte rondleiding door Klaskompas: wat het is, hoe je aan de slag gaat en waar de grenzen liggen.'),
  );

  // 1. Wat is Klaskompas?
  wrap.append(
    kaart('🧭 Wat is Klaskompas?',
      el('p', {}, 'Klaskompas is een lokaal-eerst hulpmiddel voor de leerkracht. Alle gegevens blijven op dit toestel; er wordt niets naar buiten verstuurd.'),
      el('p', { class: 'zacht' }, 'Het ondersteunt jouw klasbeheer, maar vervangt geen schoolprocedures, zorgbeleid of tucht­reglement.'),
    ),
  );

  // 2. Twee weergaves
  wrap.append(
    kaart('🖥️ Twee weergaves',
      el('div', { class: 'weergaves' },
        el('div', { class: 'weergave' },
          el('h4', {}, 'Administratie'),
          el('p', {}, 'De rustige modules die je na de les gebruikt: afspraken, observaties, beloningen, backups en instellingen.'),
        ),
        el('div', { class: 'weergave' },
          el('h4', {}, 'Lesmodus / Klasscherm'),
          el('p', {}, 'Projecteerbaar op het bord: geldkoker, geluidsmeter, lesdrill en zitplan. Groot en klasklaar.'),
        ),
      ),
    ),
  );

  // 3. Aan de slag
  wrap.append(
    kaart('🚀 Aan de slag',
      el('ul', {},
        el('li', {}, 'Kies of maak een klas — of ', el('strong', {}, 'importeer een CSV'), ' met leerlingen.'),
        el('li', {}, 'Stel bovenaan de ', el('strong', {}, 'actieve klas'), ' in.'),
        el('li', {}, 'Start daarna de ', el('strong', {}, 'Lesmodus'), ' om op het bord te projecteren.'),
      ),
    ),
  );

  // 4. De klaspot
  wrap.append(
    kaart('💶 De klaspot (klaskapitaal)',
      el('ul', {},
        el('li', {}, el('strong', {}, 'Samen sparen. '), 'De pot stijgt bij collectief positief gedrag.'),
        el('li', {}, el('strong', {}, 'Samen dragen. '), 'Bij collectief storend gedrag kan de pot dalen — met een bodem, altijd terug te verdienen.'),
        el('li', {}, el('strong', {}, 'Een beloning kiezen. '), 'Vanaf een afgesproken drempel kiest de klas samen een beloning.'),
        el('li', {}, el('strong', {}, 'Individueel staat los. '), 'Individueel gedrag raakt de pot niet (behalve bij optie C).'),
      ),
      el('p', { class: 'zacht' }, 'Alles is teacher-triggered: de tool meet, telt en seint — jij beslist elk gevolg. Niets gebeurt automatisch.'),
    ),
  );

  // 5. Individueel spoor
  wrap.append(
    kaart('👤 Individueel spoor',
      el('ul', {},
        el('li', {}, el('strong', {}, 'Observaties. '), 'Feitelijk genoteerd volgens ABC (aanleiding, gedrag, gevolg).'),
        el('li', {}, el('strong', {}, 'Quota-tellers. '), 'Geven een seintje bij een grens — geen automatische straf.'),
        el('li', {}, el('strong', {}, 'Herstel- en consequentieladder. '), 'Duidelijke, voorspelbare stappen, herstel eerst.'),
      ),
      el('p', { class: 'zacht' }, 'Dit spoor is privaat en alleen voor jou zichtbaar.'),
    ),
  );

  // 6. Beloningen
  wrap.append(
    kaart('🎁 Beloningen',
      el('p', {}, 'Een gecategoriseerd menu van beloningen waaruit de klas kan kiezen. Je past de lijst per klas aan naar wat bij jouw groep past.'),
    ),
  );

  // 7. Backup & veiligheid
  wrap.append(
    kaart('🛟 Backup & veiligheid',
      el('ul', {},
        el('li', {}, 'Maak regelmatig een ', el('strong', {}, 'backup'), ' via Instellingen.'),
        el('li', {}, 'Optioneel: een ', el('strong', {}, 'app-lock'), ' met pincode en een ', el('strong', {}, 'versleutelde backup'), '.'),
        el('li', {}, 'Alles blijft lokaal op dit toestel.'),
      ),
    ),
  );

  // 8. Privacy-grenzen
  wrap.append(
    kaart('🔒 Privacy-grenzen',
      el('ul', {},
        el('li', {}, 'Geen scores of labels per leerling.'),
        el('li', {}, 'Geen biometrie.'),
        el('li', {}, 'Herstel gaat boven straf.'),
      ),
      el('p', { class: 'zacht' }, 'Stem het gebruik af met het schoolreglement en, waar nodig, met de DPO.'),
    ),
  );

  // Meer weten?
  wrap.append(
    el('div', { class: 'kaart meer' },
      el('h3', { class: 'sectiekop' }, '📚 Meer weten?'),
      el('p', {}, 'De achtergrond en ontwerpkeuzes staan in de map ', el('code', {}, 'docs/'), ' van het project (de ADR’s). Daar lees je waarom Klaskompas werkt zoals het werkt.'),
    ),
  );

  root.append(wrap);
}
