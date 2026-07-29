// Lesmodus — het projecteerbare Klasscherm (ADR-0001), in de mockup-stijl:
// topbalk + focus-strip + drie panelen (Klaskapitaal, Geluid+Lesdrill, Zitplan).
// Alles teacher-triggered; de microfoon meet enkel live volume en neemt niets op.

import { get, getSetting, setSetting, potGeschiedenis, byIndex, leerlingenVanKlas } from '../db/repo.js';
import { potStatus, verdien, verlies, reset } from '../domain/klaspot.js';
import { menuVoorKlas, wisselIn } from '../domain/beloningen.js';
import { DRILL_STAPPEN, ZITREGEL_TYPE, AANWEZIGHEID_STATUS } from '../domain/model.js';
import { isoDatum } from '../domain/schooljaar.js';
import { projecteer as projecteerAfspraken } from './afspraken.js';
import { el, leeg, euro, toast, dialoog, bevestig, datumTijd } from '../ui/components.js';

let actief = { stream: null, ctx: null, raf: 0, tick: 0 };
function stopAlles() {
  if (actief.raf) cancelAnimationFrame(actief.raf);
  if (actief.tick) clearInterval(actief.tick);
  if (actief.stream) actief.stream.getTracks().forEach((t) => t.stop());
  if (actief.ctx && actief.ctx.state !== 'closed') actief.ctx.close().catch(() => {});
  actief = { stream: null, ctx: null, raf: 0, tick: 0 };
}
export function cleanup() { stopAlles(); }

export async function render(root, ctx) {
  stopAlles();
  if (!ctx.klasId) {
    root.append(el('div', { class: 'kaart' }, el('h2', {}, 'Geen actieve klas'),
      el('p', {}, 'Kies eerst een klas.'), el('a', { class: 'knop knop--primair', href: '#/klassen' }, 'Naar klassen')));
    return;
  }
  const klas = await get('klassen', ctx.klasId);
  const status = await potStatus(ctx.klasId);
  const config = status.config;

  const bord = el('div', { class: 'klasbord' });
  root.append(bord);

  // — topbalk —
  bord.append(el('header', { class: 'kb-top' },
    el('div', { class: 'kb-brand' },
      el('div', { class: 'kb-crest' }, '🧭'),
      el('div', {}, el('h1', { class: 'kb-title' }, klas?.naam || 'Klas', klas?.niveau ? el('span', { class: 'kb-grade' }, klas.niveau) : null)),
    ),
    el('div', { class: 'kb-modes' },
      el('span', { class: 'kb-mode active' }, '▣ Lesmodus'),
      el('a', { class: 'kb-mode', href: '#/dashboard' }, '⚙ Administratie'),
    ),
    el('div', { class: 'kb-privacy' }, '🔒 privacy: lokaal'),
  ));

  // — focus-strip (reminder + drill-voortgang) —
  const reminder = await getSetting('reminder:' + ctx.klasId, 'Neem je boek en de taak uit je planner. Start daarna stil aan de opdracht.');
  const focusText = el('div', { class: 'kb-focus-text', title: 'Klik om aan te passen' }, reminder);
  focusText.addEventListener('click', async () => {
    const n = prompt('Dagfocus / reminder:', focusText.textContent);
    if (n != null) { await setSetting('reminder:' + ctx.klasId, n); focusText.textContent = n; }
  });
  const drillTeller = el('strong', {});
  const dots = el('div', { class: 'kb-dots' }, ...DRILL_STAPPEN.map(() => el('span', {})));
  bord.append(el('section', { class: 'kb-focus' },
    el('div', { class: 'kb-focus-icon' }, '◎'), focusText,
    el('div', { class: 'kb-progress' }, drillTeller, dots),
  ));

  // — dashboard —
  const grid = el('div', { class: 'kb-grid' });
  bord.append(grid);

  // ===== Klaskapitaal =====
  const amount = el('div', { class: 'kb-amount' }, euro(status.saldo));
  const notes = el('div', { class: 'kb-notes' });
  const drempelLabel = el('div', { class: 'kb-threshold-label' }, `${euro(config.prijsdrempel)}`, el('br'), 'KLASPRIJS');
  const tube = el('div', { class: 'kb-tube' },
    notes,
    el('div', { class: 'kb-threshold', style: { top: '7%' } }, el('div', { class: 'kb-threshold-line' }), drempelLabel),
    el('div', { class: 'kb-bottom' }, `Bodem ${euro(config.bodem)}`),
  );
  const capFooter = el('div', { class: 'kb-cap-footer' });

  const capital = el('article', { class: 'kb-card kb-capital' },
    el('div', { class: 'kb-card-h' }, el('div', {}, el('h2', { class: 'kb-card-t' }, 'Klaskapitaal'), el('p', { class: 'kb-card-s' }, 'Samen groeien we.'))),
    el('div', {}, el('div', { class: 'kb-amount-label' }, 'Huidig bedrag'), amount),
    el('div', { class: 'kb-tube-zone' }, tube),
    el('div', { class: 'kb-controls' },
      el('button', { class: 'kb-big plus', onClick: () => beweeg(+1) }, el('span', {}, `+ ${euro(config.stapbedrag)}`), el('small', {}, 'verdienen')),
      el('button', { class: 'kb-big min', onClick: () => beweeg(-1) }, el('span', {}, `− ${euro(config.stapbedrag)}`), el('small', {}, 'collectief')),
    ),
    el('div', { class: 'kb-minirij' },
      el('button', { class: 'kb-mini', onClick: () => beweeg(+5) }, `+${euro(config.stapbedrag * 5)}`),
      el('button', { class: 'kb-mini', onClick: () => beweeg(-5) }, `−${euro(config.stapbedrag * 5)}`),
      el('button', { class: 'kb-mini', onClick: () => openMenu() }, '🎁 Menu'),
      el('button', { class: 'kb-mini', onClick: () => projecteerAfspraken() }, '🤝 Afspraken'),
      el('button', { class: 'kb-mini', onClick: async () => { if (await bevestig('Pot terugzetten op het startkapitaal?')) { await reset(ctx.klasId); herteken(); toast('Nieuwe cyclus'); } } }, '↺'),
      el('button', { class: 'kb-mini', onClick: () => toonLog(ctx.klasId) }, '📜'),
    ),
    capFooter,
  );
  grid.append(capital);

  function tekenKapitaal(s) {
    amount.textContent = euro(s.saldo);
    const doel = Math.max(s.config.prijsdrempel || 1, 1);
    const fractie = Math.max(0, Math.min(1, s.saldo / doel));
    const maxNotes = 7;
    const aantal = Math.round(fractie * maxNotes);
    leeg(notes);
    for (let i = 0; i < aantal; i++) {
      const denom = i % 3 === 2 ? 20 : 50;
      const note = el('div', { class: `kb-note kb-note-${denom}`, style: { bottom: `${(i / maxNotes) * 90}%`, transform: `translateX(-50%) rotate(${(i % 2 ? 1.5 : -1.6)}deg)` } }, el('span', { class: 'val' }, String(denom)));
      notes.append(note);
    }
    leeg(capFooter);
    if (s.saldo >= (s.config.prijsdrempel || Infinity)) {
      capFooter.className = 'kb-cap-footer feest';
      capFooter.append(el('span', {}, '🎉 Prijsdrempel bereikt!'), el('button', { class: 'kb-mini', onClick: () => openMenu() }, 'Beloning kiezen'));
    } else {
      capFooter.className = 'kb-cap-footer';
      const nog = Math.max(0, Math.round((s.config.prijsdrempel - s.saldo) * 100) / 100);
      capFooter.append(el('span', {}, 'Nog nodig voor de klasprijs'), el('strong', {}, euro(nog)));
    }
  }

  async function beweeg(n) {
    const s = n > 0 ? await verdien(ctx.klasId, Math.abs(n), Math.abs(n) > 1 ? 'Meerdere stappen' : 'Collectief gedrag')
      : await verlies(ctx.klasId, Math.abs(n), 'Collectief negatief gedrag');
    tekenKapitaal(s);
  }
  async function herteken() { tekenKapitaal(await potStatus(ctx.klasId)); }

  async function openMenu() {
    dialoog('Beloningsmenu', async (body, sluit) => {
      const s = await potStatus(ctx.klasId);
      const items = await menuVoorKlas(ctx.klasId);
      body.append(el('div', { class: 'menu-saldo' }, 'Saldo: ', el('strong', {}, euro(s.saldo))));
      if (!items.length) body.append(el('p', { class: 'zacht' }, 'Nog geen beloningen. Voeg ze toe onder “Beloningen”.'));
      const rooster = el('div', { class: 'menu-grid' });
      for (const b of items) {
        const kanNiet = s.saldo < b.prijs;
        rooster.append(el('div', { class: 'menu-item menu-item--' + b.niveau },
          el('div', { class: 'menu-item__kop' }, el('span', { class: 'menu-item__naam' }, b.naam), el('span', { class: 'menu-item__prijs' }, euro(b.prijs))),
          b.omschrijving ? el('p', { class: 'menu-item__oms' }, b.omschrijving) : null,
          b.talen ? el('p', { class: 'menu-item__talen' }, '🗣 ' + b.talen) : null,
          el('button', { class: 'knop ' + (kanNiet ? 'knop--stil' : 'knop--primair'), disabled: kanNiet, onClick: async () => {
            const r = await wisselIn(ctx.klasId, b.id);
            if (r.ok) { toast('Ingewisseld! Saldo ' + euro(r.saldo)); sluit(); herteken(); } else toast(r.reden, 'fout');
          } }, kanNiet ? 'Nog sparen' : 'Inwisselen'),
        ));
      }
      body.append(rooster, el('div', { class: 'dialoog__acties' }, el('button', { class: 'knop', onClick: sluit }, 'Sluiten')));
    });
  }

  // ===== midden: geluid + lesdrill =====
  const midden = el('div', { class: 'kb-middle' });
  grid.append(midden);
  midden.append(bouwGeluid(ctx.klasId, config), await bouwDrill(ctx.klasId, drillTeller, dots));

  // ===== zitplan =====
  grid.append(await bouwZitplan(ctx.klasId));

  tekenKapitaal(status);
}

// ————————————————————————————————— geluidsmeter —————
function bouwGeluid(klasId, config) {
  const drempel = config.decibelDrempel ?? 55;
  const mask = el('div', { class: 'kb-meter-mask', style: { height: '100%' } });
  const current = el('div', { class: 'kb-current', style: { bottom: '0%' } }, '—');
  const tooloud = el('div', { class: 'kb-tooloud', style: { bottom: drempel + '%' } }, el('span', {}, `TE LUID · ${drempel}`));
  const meter = el('div', { class: 'kb-meter' }, mask, tooloud, current);
  const status = el('div', { class: 'kb-status' }, '▥ METER UIT');
  const knop = el('button', { class: 'knop knop--primair kb-sound-btn', onClick: () => toggle() }, '▶ Meten aan');
  const kaart = el('article', { class: 'kb-card kb-sound' },
    el('div', { class: 'kb-card-h' }, el('div', {}, el('h2', { class: 'kb-card-t' }, 'Stilte verdient'), el('p', { class: 'kb-card-s' }, 'We meten, jij ziet.'))),
    el('div', { class: 'kb-meter-area' },
      el('div', { class: 'kb-scale' }, el('span', {}, 'luid'), el('span', {}, ''), el('span', {}, ''), el('span', {}, 'stil')),
      meter,
      el('div', { class: 'kb-sound-copy' }, status, el('p', {}, 'Onder de drempel blijft de klas verdienen. Deze meter neemt niets op en herkent niemand.')),
    ),
    knop,
  );

  let aan = false, boven = 0;
  async function toggle() {
    if (aan) { stopAlles(); aan = false; knop.textContent = '▶ Meten aan'; status.textContent = '▥ METER UIT'; status.className = 'kb-status'; mask.style.height = '100%'; return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } });
      const audio = new (window.AudioContext || window.webkitAudioContext)();
      const src = audio.createMediaStreamSource(stream);
      const analyser = audio.createAnalyser(); analyser.fftSize = 512; src.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      actief.stream = stream; actief.ctx = audio; aan = true; knop.textContent = '⏸ Meten uit';
      let som = 0, tellen = 0;
      const meet = () => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0; for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v; }
        const niveau = Math.min(100, Math.round(Math.sqrt(sum / buf.length) * 240));
        mask.style.height = (100 - niveau) + '%';
        current.style.bottom = Math.min(96, niveau) + '%';
        current.textContent = String(niveau);
        if (niveau >= drempel) { status.textContent = '▲ TE LUID'; status.className = 'kb-status luid'; }
        else if (niveau >= drempel * 0.7) { status.textContent = '● LET OP'; status.className = 'kb-status'; }
        else { status.textContent = '▥ RUSTIG'; status.className = 'kb-status'; }
        som += niveau; tellen++;
        actief.raf = requestAnimationFrame(meet);
      };
      meet();
      actief.tick = setInterval(async () => {
        const gem = tellen ? som / tellen : 0; som = 0; tellen = 0;
        if (config.decibelModus !== 'objectief') return;
        if (gem >= drempel) { boven++; if (boven >= 2) await verlies(klasId, 1, 'Aanhoudend te luid (objectieve drift)', 'decibel'); }
        else { boven = 0; await verdien(klasId, 1, 'Stil gewerkt', 'decibel'); }
      }, 6000);
    } catch (_) { toast('Geen toegang tot de microfoon', 'fout'); }
  }
  return kaart;
}

// ————————————————————————————————— lesdrill —————
async function bouwDrill(klasId, drillTeller, dots) {
  const sleutel = 'drill:' + klasId;
  const status = new Set((await getSetting(sleutel, [])) || []);
  const steps = el('ol', { class: 'kb-steps' });
  const items = [];

  function ververs() {
    const klaar = status.size;
    drillTeller.textContent = `Drill ${klaar}/${DRILL_STAPPEN.length}`;
    dots.querySelectorAll('span').forEach((d, i) => d.classList.toggle('done', i < klaar));
    items.forEach((li, i) => {
      const gedaan = status.has(i);
      const huidig = !gedaan && i === klaar;
      li.className = 'kb-step ' + (gedaan ? 'done' : huidig ? 'current' : 'pending');
      li.querySelector('.kb-check').textContent = gedaan ? '✓' : huidig ? '→' : '•';
    });
  }
  DRILL_STAPPEN.forEach((tekst, i) => {
    const li = el('button', { class: 'kb-step', onClick: async () => {
      if (status.has(i)) status.delete(i); else status.add(i);
      await setSetting(sleutel, [...status]); ververs();
    } }, el('span', { class: 'kb-nr' }, String(i + 1)), el('span', { class: 'kb-step-label' }, tekst.split(' — ')[0]), el('span', { class: 'kb-check' }, '•'));
    items.push(li); steps.append(li);
  });

  const kaart = el('article', { class: 'kb-card kb-drill' },
    el('div', { class: 'kb-card-h' }, el('div', {}, el('h2', { class: 'kb-card-t' }, 'Lesstart-drill')),
      el('button', { class: 'kb-mini', onClick: async () => { status.clear(); await setSetting(sleutel, []); ververs(); } }, 'Nieuwe les')),
    steps,
    el('div', { class: 'kb-privacy-note' }, el('span', {}, '🔒'), el('span', {}, 'Individuele correcties worden niet geprojecteerd. Ze blijven privé.')),
  );
  ververs();
  return kaart;
}

// ————————————————————————————————— zitplan (weergave) —————
async function bouwZitplan(klasId) {
  const [plan, regels, leerlingen, aanwVandaag] = await Promise.all([
    get('zitplannen', klasId),
    byIndex('zitregels', 'klasId', klasId),
    leerlingenVanKlas(klasId),
    byIndex('aanwezigheid', 'klasId', klasId),
  ]);
  const naam = new Map(leerlingen.map((l) => [l.id, `${l.voornaam || ''} ${l.naam || ''}`.trim()]));
  const vandaag = isoDatum(new Date());
  const teller = { aanwezig: 0, telaat: 0, afwezig: 0 };
  for (const a of aanwVandaag.filter((x) => x.datum === vandaag)) {
    if (a.status === 'aanwezig') teller.aanwezig++;
    else if (a.status === 'telaat') teller.telaat++;
    else teller.afwezig++;
  }
  // regels tellen per type voor de chips
  const chipTeller = {};
  for (const r of regels) chipTeller[r.type] = (chipTeller[r.type] || 0) + 1;
  const chips = Object.entries(chipTeller).map(([t, n]) => el('span', { class: 'kb-chip' }, `🔒 ${n}× ${ZITREGEL_TYPE[t] || t}`));

  const room = el('div', { class: 'kb-room' });
  if (plan?.plaatsen?.length) {
    const regelVoor = new Map();
    for (const r of regels) { if (r.leerlingId) regelVoor.set(r.leerlingId, ZITREGEL_TYPE[r.type]); }
    const seats = el('div', { class: 'kb-seats', style: { gridTemplateColumns: `repeat(${plan.kolommen}, minmax(110px, 1fr))` } });
    const geplaatst = new Map(plan.plaatsen.map((p) => [`${p.rij},${p.kol}`, p.leerlingId]));
    for (let rij = 0; rij < plan.rijen; rij++) {
      for (let kol = 0; kol < plan.kolommen; kol++) {
        const lid = geplaatst.get(`${rij},${kol}`);
        if (!lid) { seats.append(el('div', {})); continue; }
        const volledig = naam.get(lid) || '—';
        const delen = volledig.split(' ');
        seats.append(el('div', { class: 'kb-seat' },
          el('div', { class: 'kb-student' }, delen[0] || volledig, delen.length > 1 ? el('br') : null, delen.slice(1).join(' ')),
          el('div', { class: 'kb-seat-meta' }, regelVoor.has(lid) ? '🔒 ' + regelVoor.get(lid) : ''),
        ));
      }
    }
    room.append(el('div', { class: 'kb-board' }, '♟ Bord · leerkrachtzone'), seats);
  } else {
    room.append(el('div', { class: 'kb-room-leeg' },
      el('p', {}, 'Nog geen zitplan bewaard.'),
      el('a', { class: 'knop knop--primair', href: '#/zitplan' }, 'Zitplan maken')));
  }

  return el('article', { class: 'kb-card kb-seating' },
    el('div', { class: 'kb-card-h' }, el('div', {}, el('h2', { class: 'kb-card-t' }, 'Zitplan'), el('p', { class: 'kb-card-s' }, 'Bordzijde bovenaan.')),
      el('a', { class: 'kb-mini', href: '#/zitplan' }, '⚙ Beheer')),
    el('div', { class: 'kb-summary' },
      el('div', { class: 'kb-sum' }, '👥', el('div', {}, el('strong', {}, String(teller.aanwezig)), ' aanwezig · ', el('span', {}, `${teller.telaat} te laat · ${teller.afwezig} afwezig`))),
      el('div', { class: 'kb-sum' }, chips.length ? el('div', { class: 'kb-chips' }, ...chips) : el('span', { class: 'zacht' }, 'Geen randvoorwaarden ingesteld')),
    ),
    room,
    el('div', { class: 'kb-seating-foot' }, el('span', {}, 'ⓘ'), el('span', {}, 'Enkel neutrale zitinfo wordt geprojecteerd. Persoonlijke notities blijven in Administratie.')),
  );
}

// ————————————————————————————————— logboek —————
async function toonLog(klasId) {
  dialoog('Logboek van de pot', async (body, sluit) => {
    const events = await potGeschiedenis(klasId, 40);
    if (!events.length) body.append(el('p', { class: 'zacht' }, 'Nog geen bewegingen.'));
    const lijst = el('div', { class: 'log' });
    for (const e of events) {
      lijst.append(el('div', { class: 'log__regel' },
        el('span', { class: 'log__delta ' + (e.delta >= 0 ? 'plus' : 'min') }, (e.delta >= 0 ? '+' : '') + euro(e.delta)),
        el('span', { class: 'log__reden' }, e.reden || e.bron),
        el('span', { class: 'log__saldo' }, euro(e.saldoNa)),
        el('span', { class: 'log__tijd zacht' }, datumTijd(e.ts)),
      ));
    }
    body.append(lijst, el('div', { class: 'dialoog__acties' }, el('button', { class: 'knop', onClick: sluit }, 'Sluiten')));
  });
}
