// Instellingen & backup: per-klas klaspot-configuratie (ADR-0001 §2.1.8),
// echte JSON-backup/herstel, diagnostiek en een bewuste "alles wissen".

import { get, telAlles, db } from '../db/repo.js';
import { updateConfig } from '../domain/klaspot.js';
import { DECIBEL_MODUS } from '../domain/model.js';
import { downloadBackup, importeerBackup } from '../db/backup.js';
import { STORES } from '../db/schema.js';
import { el, leeg, toast, dialoog, bevestig } from '../ui/components.js';

export async function render(root, ctx) {
  root.append(el('h2', { class: 'sectiekop' }, 'Instellingen & backup'));

  // — klaspot-configuratie —
  if (ctx.klasId) {
    const klas = await get('klassen', ctx.klasId);
    const c = klas.config;
    const velden = {
      startkapitaal: getal('Startkapitaal (€)', c.startkapitaal),
      bodem: getal('Bodem (€)', c.bodem),
      stapbedrag: getal('Stapbedrag per handeling (€)', c.stapbedrag),
      prijsdrempel: getal('Prijsdrempel (€)', c.prijsdrempel),
      herstartdrempel: getal('Herstart-drempel (€)', c.herstartdrempel),
      decibelDrempel: getal('Decibel-drempel (0–100)', c.decibelDrempel),
    };
    const decibelModus = el('select', { class: 'invoer' }, ...Object.entries(DECIBEL_MODUS).map(([v, l]) => el('option', { value: v, selected: c.decibelModus === v }, l)));
    const optieC = schakel('Individueel gedrag mag de pot doen dalen (optie C)', c.optieC);
    const collectiefGevolg = schakel('Collectief gevolg bij mislukte herstart', c.collectiefGevolg);

    root.append(el('div', { class: 'kaart' },
      el('div', { class: 'kaart__kop' }, el('h3', {}, `Klaspot — ${klas.naam}`), el('span', { class: 'badge badge--stil' }, 'per klas')),
      el('div', { class: 'raster2' }, ...Object.values(velden).map((v) => v.wrap), etiket('Decibel-modus', decibelModus)),
      el('div', { class: 'schakels' }, optieC.wrap, collectiefGevolg.wrap),
      el('p', { class: 'zacht' }, 'De tool meet, telt en seint — elk gevolg voor leerlingen blijft door jou getriggerd (ADR-0001 §2.4).'),
      el('div', { class: 'knoprij knoprij--rechts' },
        el('button', { class: 'knop knop--primair', onClick: async () => {
          await updateConfig(ctx.klasId, {
            startkapitaal: getalW(velden.startkapitaal), bodem: getalW(velden.bodem), stapbedrag: getalW(velden.stapbedrag),
            prijsdrempel: getalW(velden.prijsdrempel), herstartdrempel: getalW(velden.herstartdrempel), decibelDrempel: getalW(velden.decibelDrempel),
            decibelModus: decibelModus.value, optieC: optieC.input.checked, collectiefGevolg: collectiefGevolg.input.checked,
          });
          toast('Configuratie opgeslagen');
        } }, '💾 Opslaan'),
      ),
    ));
  } else {
    root.append(el('div', { class: 'kaart' }, el('p', { class: 'zacht' }, 'Kies een actieve klas om de klaspot te configureren.')));
  }

  // — backup —
  const bestand = el('input', { type: 'file', accept: '.json,application/json', class: 'invoer' });
  root.append(el('div', { class: 'kaart' },
    el('h3', {}, 'Backup & herstel'),
    el('p', { class: 'zacht' }, 'Alle gegevens blijven lokaal op dit toestel. Maak regelmatig een backup; herstellen voegt samen op id (geen overschrijving van andere klassen).'),
    el('div', { class: 'knoprij' },
      el('button', { class: 'knop knop--primair', onClick: () => downloadBackup() }, '⬇️ Backup downloaden'),
    ),
    etiket('Backup-bestand herstellen', bestand),
    el('div', { class: 'knoprij' },
      el('button', { class: 'knop', onClick: () => herstel(bestand, 'merge', ctx) }, '🔀 Samenvoegen'),
      el('button', { class: 'knop knop--gevaar-zacht', onClick: () => herstel(bestand, 'vervang', ctx) }, '♻️ Vervangen'),
    ),
  ));

  // — diagnostiek + gevarenzone —
  const tellingen = await telAlles();
  root.append(el('div', { class: 'kaart' },
    el('h3', {}, 'Diagnostiek'),
    el('div', { class: 'diag' }, ...Object.entries(tellingen).map(([k, v]) => el('div', { class: 'diag__item' }, el('strong', {}, String(v)), el('span', { class: 'zacht' }, k)))),
    el('hr', { class: 'scheiding' }),
    el('h3', { class: 'gevaar-titel' }, 'Gevarenzone'),
    el('p', { class: 'zacht' }, 'Wist onherroepelijk alle lokale gegevens op dit toestel. Maak eerst een backup.'),
    el('button', { class: 'knop knop--gevaar', onClick: async () => {
      if (await bevestig('ALLE lokale gegevens wissen? Dit kan niet ongedaan gemaakt worden.', { gevaar: true, jaLabel: 'Alles wissen' })) {
        const d = await db();
        for (const s of STORES) if (s.name !== 'meta') await d.clear(s.name);
        await ctx.herlaadKlassen();
        toast('Alle gegevens gewist');
        ctx.navigate('dashboard');
      }
    } }, '🗑 Alles wissen'),
  ));
}

async function herstel(bestand, strategie, ctx) {
  const f = bestand.files?.[0];
  if (!f) { toast('Kies eerst een bestand', 'fout'); return; }
  if (strategie === 'vervang' && !(await bevestig('Vervangen wist eerst de bestaande gegevens per store. Doorgaan?', { gevaar: true, jaLabel: 'Vervangen' }))) return;
  try {
    const backup = JSON.parse(await f.text());
    const r = await importeerBackup(backup, strategie);
    toast(`Hersteld: ${r.records} records`);
    await ctx.herlaadKlassen();
    ctx.navigate('dashboard');
  } catch (e) {
    toast('Herstel mislukt: ' + e.message, 'fout');
  }
}

// — helpers —
function getal(label, waarde) {
  const input = el('input', { class: 'invoer', type: 'number', step: 'any', value: waarde });
  return { input, wrap: etiket(label, input) };
}
function getalW(v) { return Number(v.input.value) || 0; }
function schakel(label, aan) {
  const input = el('input', { type: 'checkbox', checked: !!aan });
  return { input, wrap: el('label', { class: 'schakel' }, input, el('span', {}, label)) };
}
function etiket(label, control) {
  return el('label', { class: 'veld' }, el('span', {}, label), control);
}
