// Klassen & leerlingen: overzicht, detail met leerlingenlijst, CSV-import (echte merge).

import { all, get, put, remove, leerlingenVanKlas, verwijderKlas, byIndex } from '../db/repo.js';
import { maakKlas, maakLeerling, maakInschrijving } from '../domain/model.js';
import { importeerCsv } from '../db/backup.js';
import { el, leeg, toast, dialoog, bevestig, leegKaart } from '../ui/components.js';

export async function render(root, ctx) {
  const klassen = await all('klassen');
  klassen.sort((a, b) => a.naam.localeCompare(b.naam, 'nl'));

  root.append(
    el('div', { class: 'kaart__kop kaart__kop--los' },
      el('h2', {}, 'Klassen & leerlingen'),
      el('div', { class: 'knoprij' },
        el('button', { class: 'knop', onClick: () => importDialoog(ctx) }, '⬆️ CSV importeren'),
        el('button', { class: 'knop knop--primair', onClick: () => nieuweKlasDialoog(ctx) }, '+ Nieuwe klas'),
      ),
    ),
  );

  if (!klassen.length) {
    root.append(leegKaart('Nog geen klassen', 'Importeer een klaslijst (CSV) of maak handmatig een klas aan.'));
    return;
  }

  const rooster = el('div', { class: 'klaslijst' });
  for (const k of klassen) {
    const aantal = (await byIndex('inschrijvingen', 'klasId', k.id)).filter((i) => i.actief).length;
    rooster.append(
      el('button', { class: 'klaskaart' + (k.id === ctx.klasId ? ' klaskaart--actief' : ''), onClick: () => toonKlas(root, ctx, k.id) },
        el('div', { class: 'klaskaart__naam' }, k.naam),
        el('div', { class: 'klaskaart__meta' }, [k.vak, k.niveau].filter(Boolean).join(' · ') || '—'),
        el('div', { class: 'klaskaart__aantal' }, `${aantal} leerlingen`),
      ),
    );
  }
  root.append(rooster);

  const detail = el('div', { id: 'klasdetail' });
  root.append(detail);
  if (ctx.klasId && klassen.some((k) => k.id === ctx.klasId)) toonKlas(root, ctx, ctx.klasId);
}

async function toonKlas(root, ctx, klasId) {
  await ctx.setActieveKlas(klasId);
  document.querySelectorAll('.klaskaart').forEach((n) => n.classList.remove('klaskaart--actief'));
  const detail = root.querySelector('#klasdetail');
  if (!detail) return;
  leeg(detail);
  const klas = await get('klassen', klasId);
  if (!klas) return;
  const leerlingen = await leerlingenVanKlas(klasId);

  const tabel = el('table', { class: 'tabel' },
    el('thead', {}, el('tr', {}, el('th', {}, 'Naam'), el('th', {}, 'E-mail'), el('th', {}, ''))),
  );
  const tbody = el('tbody', {});
  if (!leerlingen.length) {
    tbody.append(el('tr', {}, el('td', { colSpan: 3, class: 'leeg-cel' }, 'Nog geen leerlingen in deze klas.')));
  }
  for (const l of leerlingen) {
    tbody.append(
      el('tr', {},
        el('td', {}, `${l.voornaam} ${l.naam}`.trim()),
        el('td', { class: 'zacht' }, l.email || '—'),
        el('td', { class: 'rechts' },
          el('button', { class: 'icoonknop', title: 'Uit klas verwijderen', onClick: async () => {
            if (await bevestig(`${l.voornaam} ${l.naam} uit ${klas.naam} verwijderen? (de leerling blijft bestaan)`)) {
              await remove('inschrijvingen', l.inschrijvingId);
              toast('Uit klas verwijderd');
              toonKlas(root, ctx, klasId);
            }
          } }, '✕'),
        ),
      ),
    );
  }
  tabel.append(tbody);

  detail.append(
    el('div', { class: 'kaart' },
      el('div', { class: 'kaart__kop' },
        el('h2', {}, klas.naam),
        el('div', { class: 'knoprij' },
          el('button', { class: 'knop', onClick: () => leerlingDialoog(root, ctx, klasId) }, '+ Leerling'),
          el('button', { class: 'knop', onClick: () => klasBewerkenDialoog(ctx, klas) }, '✏️ Bewerken'),
          el('button', { class: 'knop knop--gevaar-zacht', onClick: async () => {
            if (await bevestig(`Klas "${klas.naam}" verwijderen? Inschrijvingen en de pot verdwijnen; leerlingen blijven bestaan.`, { gevaar: true, jaLabel: 'Verwijderen' })) {
              await verwijderKlas(klasId);
              toast('Klas verwijderd');
              await ctx.herlaadKlassen();
              ctx.navigate('klassen');
            }
          } }, '🗑'),
        ),
      ),
      el('p', { class: 'zacht' }, [klas.vak, klas.niveau].filter(Boolean).join(' · ') || 'Geen vak/niveau ingesteld'),
      tabel,
    ),
  );
}

function nieuweKlasDialoog(ctx) {
  dialoog('Nieuwe klas', (body, sluit) => {
    const naam = veld('Naam', 'bv. 4-ENG-A');
    const vak = veld('Vak', 'bv. Engels');
    const niveau = veld('Niveau', 'bv. 2e graad');
    body.append(naam.wrap, vak.wrap, niveau.wrap,
      el('div', { class: 'dialoog__acties' },
        el('button', { class: 'knop', onClick: sluit }, 'Annuleren'),
        el('button', { class: 'knop knop--primair', onClick: async () => {
          if (!naam.input.value.trim()) { toast('Geef een naam', 'fout'); return; }
          const k = maakKlas({ naam: naam.input.value.trim(), vak: vak.input.value.trim(), niveau: niveau.input.value.trim(), schooljaarId: await actiefSchooljaar() });
          await put('klassen', k);
          sluit();
          toast('Klas aangemaakt');
          await ctx.herlaadKlassen();
          ctx.navigate('klassen');
        } }, 'Aanmaken'),
      ),
    );
  });
}

function klasBewerkenDialoog(ctx, klas) {
  dialoog('Klas bewerken', (body, sluit) => {
    const naam = veld('Naam', '', klas.naam);
    const vak = veld('Vak', '', klas.vak);
    const niveau = veld('Niveau', '', klas.niveau);
    body.append(naam.wrap, vak.wrap, niveau.wrap,
      el('div', { class: 'dialoog__acties' },
        el('button', { class: 'knop', onClick: sluit }, 'Annuleren'),
        el('button', { class: 'knop knop--primair', onClick: async () => {
          klas.naam = naam.input.value.trim() || klas.naam;
          klas.vak = vak.input.value.trim();
          klas.niveau = niveau.input.value.trim();
          await put('klassen', klas);
          sluit();
          toast('Opgeslagen');
          await ctx.herlaadKlassen();
          ctx.navigate('klassen');
        } }, 'Opslaan'),
      ),
    );
  });
}

function leerlingDialoog(root, ctx, klasId) {
  dialoog('Leerling toevoegen', (body, sluit) => {
    const voornaam = veld('Voornaam', '');
    const naam = veld('Naam', '');
    const email = veld('E-mail (optioneel)', '');
    body.append(voornaam.wrap, naam.wrap, email.wrap,
      el('div', { class: 'dialoog__acties' },
        el('button', { class: 'knop', onClick: sluit }, 'Annuleren'),
        el('button', { class: 'knop knop--primair', onClick: async () => {
          if (!voornaam.input.value.trim() && !naam.input.value.trim()) { toast('Geef minstens een naam', 'fout'); return; }
          const l = maakLeerling({ voornaam: voornaam.input.value, naam: naam.input.value, email: email.input.value });
          // merge op sleutel: bestaat de leerling al, hergebruik hem
          const bestaand = (await byIndex('leerlingen', 'sleutel', l.sleutel))[0];
          const leerlingId = bestaand ? bestaand.id : (await put('leerlingen', l), l.id);
          await put('inschrijvingen', maakInschrijving({ leerlingId, klasId, schooljaarId: await actiefSchooljaar() }));
          sluit();
          toast('Leerling toegevoegd');
          toonKlas(root, ctx, klasId);
        } }, 'Toevoegen'),
      ),
    );
  });
}

function importDialoog(ctx) {
  dialoog('CSV importeren', async (body, sluit) => {
    const schooljaren = await all('schooljaren');
    const sjSelect = el('select', { class: 'invoer' },
      el('option', { value: '' }, 'Geen schooljaar'),
      ...schooljaren.map((s) => el('option', { value: s.id }, s.label)),
    );
    const bestand = el('input', { type: 'file', accept: '.csv,text/csv', class: 'invoer' });
    const plak = el('textarea', { class: 'invoer', rows: 6, placeholder: 'voornaam,naam,klas,email\nNoah,Peeters,4-ENG-A,noah@...' });
    const uitslag = el('div', { class: 'import-uitslag' });

    bestand.addEventListener('change', async () => {
      const f = bestand.files?.[0];
      if (f) plak.value = await f.text();
    });

    body.append(
      el('p', { class: 'zacht' }, 'Kolommen worden herkend (voornaam, naam, klas, email). Bestaande leerlingen en klassen worden samengevoegd, niet gedupliceerd.'),
      etiket('Schooljaar koppelen', sjSelect),
      etiket('Bestand', bestand),
      etiket('… of plak hier', plak),
      uitslag,
      el('div', { class: 'dialoog__acties' },
        el('button', { class: 'knop', onClick: sluit }, 'Sluiten'),
        el('button', { class: 'knop knop--primair', onClick: async () => {
          const tekst = plak.value.trim();
          if (!tekst) { toast('Geen data', 'fout'); return; }
          try {
            const r = await importeerCsv(tekst, { schooljaarId: sjSelect.value || null });
            leeg(uitslag);
            uitslag.append(
              el('div', { class: 'import-uitslag__ok' },
                el('strong', {}, 'Klaar. '),
                `${r.nieuweLeerlingen} nieuwe leerlingen, ${r.hergebruikt} hergebruikt, ${r.nieuweKlassen} nieuwe klassen, ${r.nieuweInschrijvingen} inschrijvingen.`),
            );
            toast('Import gelukt');
            await ctx.herlaadKlassen();
            setTimeout(() => { sluit(); ctx.navigate('klassen'); }, 900);
          } catch (e) {
            toast('Import mislukt: ' + e.message, 'fout');
          }
        } }, 'Importeren'),
      ),
    );
  });
}

// — helpers —

async function actiefSchooljaar() {
  const sj = await all('schooljaren');
  return sj.length ? sj[sj.length - 1].id : null;
}

function veld(label, placeholder, waarde = '') {
  const input = el('input', { class: 'invoer', placeholder: placeholder || '', value: waarde });
  return { input, wrap: etiket(label, input) };
}

function etiket(label, control) {
  return el('label', { class: 'veld' }, el('span', {}, label), control);
}
