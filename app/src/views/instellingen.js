// Instellingen & backup: per-klas klaspot-configuratie (ADR-0001 §2.1.8),
// echte JSON-backup/herstel, diagnostiek en een bewuste "alles wissen".

import { get, put, remove, byIndex, telAlles, db } from '../db/repo.js';
import { updateConfig } from '../domain/klaspot.js';
import { DECIBEL_MODUS, maakOptieCVoorwaarde } from '../domain/model.js';
import { downloadBackup, importeerBackup } from '../db/backup.js';
import { lockStatus, stelPinIn, zetLockAf, downloadVersleuteldeBackup, ontsleutelBackup } from '../domain/beveiliging.js';
import { STORES } from '../db/schema.js';
import { el, leeg, toast, dialoog, bevestig, veld } from '../ui/components.js';

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

    // — Optie C: expliciet vooraf gedefinieerde voorwaarden (OD-2) —
    const voorwaarden = await byIndex('optiecvoorwaarden', 'klasId', ctx.klasId);
    const lijst = el('div', { class: 'voorwaarden' });
    if (!voorwaarden.length) lijst.append(el('p', { class: 'zacht' }, 'Nog geen voorwaarden. Zonder voorwaarden blijft optie C in de praktijk uit.'));
    for (const v of voorwaarden) {
      lijst.append(el('div', { class: 'voorwaarde' + (v.actief ? '' : ' voorwaarde--uit') },
        el('label', { class: 'schakel' },
          el('input', { type: 'checkbox', checked: v.actief, onChange: async (e) => { v.actief = e.target.checked; await put('optiecvoorwaarden', v); } }),
          el('span', {}, v.tekst)),
        el('button', { class: 'icoonknop', title: 'Verwijderen', onClick: async () => { await remove('optiecvoorwaarden', v.id); render(leeg(root), ctx); } }, '✕'),
      ));
    }
    const nieuw = veld('Nieuwe voorwaarde', { placeholder: 'bv. "Herhaald wangedrag na twee waarschuwingen, tijdens groepswerk"' });
    root.append(el('div', { class: 'kaart' },
      el('div', { class: 'kaart__kop' }, el('h3', {}, 'Optie C — voorwaarden'), el('span', { class: 'badge ' + (c.optieC ? '' : 'badge--stil') }, c.optieC ? 'actief' : 'uit')),
      el('p', { class: 'zacht' }, 'Individueel gedrag mag de klaspot enkel doen dalen als optie C hierboven aanstaat én onder deze expliciet, vooraf gedefinieerde voorwaarden (OD-2). Zo blijft het voorspelbaar en eerlijk; jij triggert elke daling zelf.'),
      lijst,
      el('div', { class: 'knoprij' }, nieuw.wrap,
        el('button', { class: 'knop', onClick: async () => {
          if (!nieuw.input.value.trim()) { toast('Geef een voorwaarde', 'fout'); return; }
          await put('optiecvoorwaarden', maakOptieCVoorwaarde({ klasId: ctx.klasId, tekst: nieuw.input.value.trim() }));
          render(leeg(root), ctx);
        } }, '+ Toevoegen'),
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

  // — beveiliging: app-lock + versleutelde backup (OD-5) —
  const lock = await lockStatus();
  const slotKaart = el('div', { class: 'kaart' });
  slotKaart.append(el('h3', {}, '🔒 Beveiliging'));
  if (lock.enabled) {
    slotKaart.append(
      el('p', { class: 'zacht' }, 'App-lock staat aan: bij het openen vraagt Klaskompas een pincode.'),
      el('div', { class: 'knoprij' },
        el('button', { class: 'knop', onClick: () => pinDialoog(root, ctx,'wijzig') }, 'Pincode wijzigen'),
        el('button', { class: 'knop knop--gevaar-zacht', onClick: () => pinDialoog(root, ctx,'uit') }, 'App-lock uitschakelen'),
      ),
    );
  } else {
    slotKaart.append(
      el('p', { class: 'zacht' }, 'Zet een pincode op deze app-installatie. Nuttig op een gedeeld toestel. De pincode wordt nooit bewaard — enkel een hash.'),
      el('div', { class: 'knoprij' }, el('button', { class: 'knop knop--primair', onClick: () => pinDialoog(root, ctx,'aan') }, 'App-lock inschakelen')),
    );
  }
  const encWachtwoord = veld('Wachtwoord', { type: 'password', placeholder: 'min. 6 tekens' });
  const encBestand = el('input', { type: 'file', accept: '.json,application/json', class: 'invoer' });
  slotKaart.append(
    el('hr', { class: 'scheiding' }),
    el('h4', {}, 'Versleutelde backup'),
    el('p', { class: 'zacht' }, 'Een backup die je veilig buiten dit toestel kunt bewaren (AES-256). Bewaar het wachtwoord goed — zonder wachtwoord is herstel onmogelijk.'),
    encWachtwoord.wrap,
    el('div', { class: 'knoprij' },
      el('button', { class: 'knop knop--primair', onClick: async () => {
        try { await downloadVersleuteldeBackup(encWachtwoord.input.value); toast('Versleutelde backup gedownload'); }
        catch (e) { toast(e.message, 'fout'); }
      } }, '⬇️ Versleuteld downloaden'),
    ),
    etiket('Versleutelde backup herstellen', encBestand),
    el('div', { class: 'knoprij' },
      el('button', { class: 'knop', onClick: async () => {
        const f = encBestand.files?.[0];
        if (!f) { toast('Kies eerst een bestand', 'fout'); return; }
        try {
          const obj = JSON.parse(await f.text());
          const backup = await ontsleutelBackup(obj, encWachtwoord.input.value);
          const r = await importeerBackup(backup, 'merge');
          toast(`Hersteld: ${r.records} records`);
          await ctx.herlaadKlassen();
          ctx.navigate('dashboard');
        } catch (e) { toast(e.message, 'fout'); }
      } }, '🔓 Ontsleutelen & samenvoegen'),
    ),
  );
  root.append(slotKaart);

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

function pinDialoog(root, ctx, modus) {
  const titel = modus === 'uit' ? 'App-lock uitschakelen' : modus === 'wijzig' ? 'Pincode wijzigen' : 'App-lock inschakelen';
  dialoog(titel, (body, sluit) => {
    if (modus === 'uit') {
      const pin = veld('Huidige pincode', { type: 'password' });
      body.append(pin.wrap, el('div', { class: 'dialoog__acties' },
        el('button', { class: 'knop', onClick: sluit }, 'Annuleren'),
        el('button', { class: 'knop knop--gevaar', onClick: async () => {
          try { await zetLockAf(pin.input.value); sluit(); toast('App-lock uitgeschakeld'); render(leeg(root), ctx); }
          catch (e) { toast(e.message, 'fout'); }
        } }, 'Uitschakelen')));
    } else {
      const pin = veld('Nieuwe pincode (min. 4)', { type: 'password' });
      const herhaal = veld('Herhaal pincode', { type: 'password' });
      body.append(pin.wrap, herhaal.wrap, el('div', { class: 'dialoog__acties' },
        el('button', { class: 'knop', onClick: sluit }, 'Annuleren'),
        el('button', { class: 'knop knop--primair', onClick: async () => {
          if (pin.input.value !== herhaal.input.value) { toast('De pincodes verschillen', 'fout'); return; }
          try { await stelPinIn(pin.input.value); sluit(); toast('Pincode ingesteld'); render(leeg(root), ctx); }
          catch (e) { toast(e.message, 'fout'); }
        } }, 'Opslaan')));
    }
  });
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
