// Aanwezigheid per lesuur/dag. Records zijn feitelijk en per (klas, datum, lesuur, leerling);
// geen scores of interpretatie.
//
// Id-formaat & compatibiliteit:
//   - "Hele dag": id `${klasId}:${datum}:${leerlingId}` (ONVERANDERD t.o.v. de oude structuur),
//     aangevuld met velden lesuur:'dag' en lesuurLabel:'Hele dag'. Zo blijven oude records
//     (zonder lesuur-veld) exact hetzelfde id houden en verschijnen ze onder "Hele dag".
//   - Per lesuur: id `${klasId}:${datum}:${lesuurKey}:${leerlingId}` met lesuurKey = de slot-start
//     zonder dubbelpunt (bv. '0825'), plus velden lesuur:lesuurKey en lesuurLabel.

import { get, put, byIndex, leerlingenVanKlas } from '../db/repo.js';
import { AANWEZIGHEID_STATUS } from '../domain/model.js';
import { el, leeg, toast, leegKaart, stijl } from '../ui/components.js';
import { isoDatum, parseDatum, weekdag } from '../domain/schooljaar.js';

/** Lesuur-sleutel uit een roosterslot: '08:25' → '0825'. */
function slotKey(slot) {
  return (slot.start || '').replace(':', '') || 'dag';
}

/** Leesbaar label voor een roosterslot, bv. "08:25–09:15 (A102)". */
function slotLabel(slot) {
  const tijd = `${slot.start || '?'}–${slot.eind || '?'}`;
  return slot.lokaal ? `${tijd} (${slot.lokaal})` : tijd;
}

/** Bepaalt of een bestaand record bij het gekozen lesuur hoort. */
function hoortBij(rec, lesuurKey) {
  if (lesuurKey === 'dag') return rec.lesuur === 'dag' || rec.lesuur == null; // oude records = hele dag
  return rec.lesuur === lesuurKey;
}

export async function render(root, ctx) {
  if (!ctx.klasId) {
    root.append(leegKaart('Geen actieve klas', 'Kies een klas om aanwezigheid te registreren.'));
    return;
  }

  stijl('css-aanwezigheid', `
    .lesuur-kiezer { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0 14px; }
    .lesuur-knop { font: inherit; padding: 7px 12px; border-radius: var(--radius-s); border: 1px solid var(--rand); background: var(--paneel-2); color: var(--tekst); cursor: pointer; }
    .lesuur-knop:hover { border-color: var(--accent); }
    .lesuur-knop--actief { background: var(--accent-zacht); color: var(--accent); border-color: var(--accent); font-weight: 600; }
    .aanw-samenvatting { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; align-items: center; }
  `);

  const klas = await get('klassen', ctx.klasId);
  const vandaag = isoDatum(new Date());

  const datum = el('input', { class: 'invoer invoer--kort', type: 'date', value: vandaag });
  root.append(
    el('div', { class: 'kaart__kop kaart__kop--los' },
      el('h2', {}, `Aanwezigheid — ${klas?.naam || ''}`),
      el('label', { class: 'veld veld--inline' }, el('span', {}, 'Datum'), datum),
    ),
  );

  const houder = el('div', { id: 'aanw-houder' });
  root.append(houder);
  datum.addEventListener('change', () => tekenDag());
  await tekenDag();

  // Tekent de lesuur-kiezer voor de gekozen datum en daaronder de tabel.
  async function tekenDag() {
    leeg(houder);
    const leerlingen = await leerlingenVanKlas(ctx.klasId);
    if (!leerlingen.length) {
      houder.append(leegKaart('Geen leerlingen', 'Voeg eerst leerlingen toe aan deze klas.'));
      return;
    }
    const dag = datum.value;

    // Roosterslots van deze klas voor de weekdag van de gekozen datum, gesorteerd op start.
    const alleSlots = await byIndex('roosterslots', 'klasId', ctx.klasId);
    const dagNr = weekdag(parseDatum(dag));
    const slots = alleSlots
      .filter((s) => s.dag === dagNr)
      .sort((a, b) => (a.start || '').localeCompare(b.start || ''));

    // Lesuur-opties: één per slot + altijd "Hele dag".
    const opties = [
      ...slots.map((s) => ({ key: slotKey(s), label: slotLabel(s) })),
      { key: 'dag', label: 'Hele dag' },
    ];
    let lesuurKey = opties[0].key; // eerste lesuur, of 'dag' als er geen slots zijn

    // Bestaande records voor deze (klas, datum) — filteren per lesuur gebeurt bij het tekenen.
    const bestaande = (await byIndex('aanwezigheid', 'klasId', ctx.klasId)).filter((a) => a.datum === dag);

    // Lesuur-kiezer (segmented). Verbergen als er maar één optie is ("Hele dag").
    const kiezer = el('div', { class: 'lesuur-kiezer', role: 'group', 'aria-label': 'Lesuur' });
    const knoppen = new Map();
    for (const opt of opties) {
      const knop = el('button', {
        class: 'lesuur-knop' + (opt.key === lesuurKey ? ' lesuur-knop--actief' : ''),
        onClick: () => {
          if (opt.key === lesuurKey) return;
          lesuurKey = opt.key;
          for (const [k, b] of knoppen) b.classList.toggle('lesuur-knop--actief', k === lesuurKey);
          tekenTabel();
        },
      }, opt.label);
      knoppen.set(opt.key, knop);
      kiezer.append(knop);
    }
    if (opties.length > 1) houder.append(kiezer);

    const kaart = el('div', { class: 'kaart' });
    houder.append(kaart);
    tekenTabel();

    // Tekent (of hertekent) de tabel voor het actuele lesuur.
    function tekenTabel() {
      leeg(kaart);
      const lesuurLabel = opties.find((o) => o.key === lesuurKey)?.label || 'Hele dag';
      const perLeerling = new Map(
        bestaande.filter((a) => hoortBij(a, lesuurKey)).map((a) => [a.leerlingId, a]),
      );

      const tabel = el('table', { class: 'tabel' },
        el('thead', {}, el('tr', {}, el('th', {}, 'Leerling'), el('th', {}, 'Status'), el('th', {}, 'Notitie'))));
      const tbody = el('tbody', {});
      const rijen = [];
      const samenvatting = el('div', { class: 'aanw-samenvatting' });

      for (const l of leerlingen) {
        const huidig = perLeerling.get(l.id);
        const sel = el('select', { class: 'invoer invoer--kort', onChange: updateSamenvatting },
          ...Object.entries(AANWEZIGHEID_STATUS).map(([v, lab]) =>
            el('option', { value: v, selected: (huidig?.status || 'aanwezig') === v }, lab)));
        const note = el('input', { class: 'invoer', value: huidig?.note || '', placeholder: '—' });
        rijen.push({ leerlingId: l.id, sel, note });
        tbody.append(el('tr', {}, el('td', {}, `${l.voornaam} ${l.naam}`.trim()), el('td', {}, sel), el('td', {}, note)));
      }
      tabel.append(tbody);

      kaart.append(
        tabel,
        el('div', { class: 'knoprij knoprij--rechts' },
          el('button', {
            class: 'knop knop--primair',
            onClick: async () => {
              for (const r of rijen) {
                const id = lesuurKey === 'dag'
                  ? `${ctx.klasId}:${dag}:${r.leerlingId}`
                  : `${ctx.klasId}:${dag}:${lesuurKey}:${r.leerlingId}`;
                const rec = {
                  id,
                  klasId: ctx.klasId,
                  leerlingId: r.leerlingId,
                  datum: dag,
                  lesuur: lesuurKey,
                  lesuurLabel,
                  status: r.sel.value,
                  note: r.note.value.trim(),
                };
                await put('aanwezigheid', rec);
                perLeerling.set(r.leerlingId, rec); // lokale cache bijwerken
                const idx = bestaande.findIndex((a) => a.id === id);
                if (idx >= 0) bestaande[idx] = rec; else bestaande.push(rec);
              }
              toast(`Aanwezigheid opgeslagen — ${lesuurLabel}`);
            },
          }, '💾 Opslaan'),
        ),
        samenvatting,
      );

      updateSamenvatting();

      // Kleine live-samenvatting: aanwezig / te laat / afwezig voor dit lesuur.
      function updateSamenvatting() {
        let aanwezig = 0, telaat = 0, afwezig = 0;
        for (const r of rijen) {
          const v = r.sel.value;
          if (v === 'aanwezig') aanwezig++;
          else if (v === 'telaat') telaat++;
          else if (v === 'gewettigd' || v === 'ongewettigd') afwezig++;
        }
        leeg(samenvatting);
        samenvatting.append(
          el('span', { class: 'zacht' }, `${lesuurLabel}:`),
          el('span', { class: 'badge' }, `${aanwezig} aanwezig`),
          el('span', { class: 'badge badge--stil' }, `${telaat} te laat`),
          el('span', { class: 'badge badge--stil' }, `${afwezig} afwezig`),
        );
      }
    }
  }
}
