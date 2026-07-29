// Afspraken & instructie (ADR-0001 §2.3.12): de klasafspraken, de lesstart-routine
// en een korte uitleg hoe de klaspot werkt. Bewerkbaar en projecteerbaar op het bord.

import { getSetting, setSetting } from '../db/repo.js';
import { DEFAULT_AFSPRAKEN, DRILL_STAPPEN } from '../domain/model.js';
import { el, leeg, toast } from '../ui/components.js';

async function laadAfspraken() {
  const opgeslagen = await getSetting('afspraken', null);
  return Array.isArray(opgeslagen) && opgeslagen.length ? opgeslagen : [...DEFAULT_AFSPRAKEN];
}

export async function render(root, ctx) {
  const afspraken = await laadAfspraken();

  root.append(
    el('div', { class: 'kaart__kop kaart__kop--los' },
      el('h2', {}, 'Afspraken & instructie'),
      el('button', { class: 'knop knop--primair', onClick: () => projecteer() }, '📺 Projecteer op het bord'),
    ),
    el('p', { class: 'zacht' }, 'Voorspelbaarheid = eerlijkheid. Toon deze afspraken bij het begin en scherp ze samen met de klas aan.'),
  );

  // — bewerkbare kernafspraken —
  const lijst = el('div', { class: 'afspraken-edit' });
  const maakRij = (tekst) => {
    const input = el('input', { class: 'invoer', value: tekst });
    const rij = el('div', { class: 'afspraken-edit__rij' },
      el('span', { class: 'afspraken-edit__bullet' }, '•'),
      input,
      el('button', { class: 'icoonknop', title: 'Verwijderen', onClick: () => rij.remove() }, '✕'),
    );
    rij._input = input;
    return rij;
  };
  afspraken.forEach((a) => lijst.append(maakRij(a)));

  root.append(
    el('div', { class: 'kaart' },
      el('div', { class: 'kaart__kop' }, el('h3', {}, '🗣️ Onze kernafspraken'), el('span', { class: 'badge badge--stil' }, 'talenklas')),
      lijst,
      el('div', { class: 'knoprij' },
        el('button', { class: 'knop', onClick: () => lijst.append(maakRij('')) }, '+ Afspraak'),
        el('button', { class: 'knop knop--stil', onClick: async () => { await setSetting('afspraken', [...DEFAULT_AFSPRAKEN]); toast('Teruggezet op de standaardafspraken'); render(leeg(root), ctx); } }, '↺ Standaard'),
        el('span', { class: 'spatie' }),
        el('button', { class: 'knop knop--primair', onClick: async () => {
          const waarden = [...lijst.querySelectorAll('.afspraken-edit__rij')].map((r) => r._input.value.trim()).filter(Boolean);
          await setSetting('afspraken', waarden);
          toast('Afspraken opgeslagen');
        } }, '💾 Opslaan'),
      ),
    ),
  );

  // — lesstart-routine —
  root.append(
    el('div', { class: 'kaart' },
      el('h3', {}, '🚪 Lesstart-routine'),
      el('ol', { class: 'genummerd' }, ...DRILL_STAPPEN.map((s) => el('li', {}, s))),
      el('p', { class: 'zacht' }, 'Deze routine staat ook als afvinkbare checklist op het Klasscherm.'),
    ),
  );

  // — uitleg klaspot —
  root.append(
    el('div', { class: 'kaart' },
      el('h3', {}, '💶 Hoe werkt de klaspot?'),
      el('ul', { class: 'uitleg' },
        el('li', {}, el('strong', {}, 'Samen sparen. '), 'De pot stijgt bij collectief positief gedrag (lesklaar, aan het werk, opgeruimd).'),
        el('li', {}, el('strong', {}, 'Samen dragen. '), 'Bij collectief storend gedrag kan de pot zakken — met een bodem, en altijd terug te verdienen.'),
        el('li', {}, el('strong', {}, 'Een prijs kiezen. '), 'Vanaf een afgesproken bedrag kiest de klas samen een beloning.'),
        el('li', {}, el('strong', {}, 'Individueel blijft apart. '), 'Individueel gedrag raakt de pot niet; dat lossen we persoonlijk en herstelgericht op.'),
        el('li', {}, el('strong', {}, 'Eerlijk & voorspelbaar. '), 'Alles is vooraf gekend; de leerkracht beslist elk gevolg — niets gebeurt automatisch.'),
      ),
    ),
  );
}

/** Toon de afspraken groot en projecteerbaar (ook oproepbaar vanuit het Klasscherm). */
export async function projecteer() {
  const afspraken = await laadAfspraken();
  const overlay = el('div', { class: 'projectie' });
  const sluit = () => { overlay.remove(); document.removeEventListener('keydown', esc); };
  const esc = (e) => { if (e.key === 'Escape') sluit(); };
  document.addEventListener('keydown', esc);
  overlay.append(
    el('button', { class: 'projectie__sluit', title: 'Sluiten (Esc)', onClick: sluit }, '✕'),
    el('div', { class: 'projectie__inhoud' },
      el('h1', {}, '🗣️ Onze klasafspraken'),
      el('ol', { class: 'projectie__lijst' }, ...afspraken.map((a) => el('li', {}, a))),
      el('div', { class: 'projectie__routine' },
        el('span', { class: 'zacht' }, 'Lesstart: '),
        DRILL_STAPPEN.map((s) => s.split(' — ')[0]).join('  →  '),
      ),
    ),
  );
  document.body.append(overlay);
}
