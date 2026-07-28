// Lesmodus — het projecteerbare Klasscherm (ADR-0001 §2.3/§2.5):
// geldkoker, decibelmeter (enkel live amplitude), vaste lesdrill, reminder-strip,
// en een knop naar het beloningsmenu. Alles teacher-triggered; niets wordt opgenomen.

import { get, getSetting, setSetting, potGeschiedenis } from '../db/repo.js';
import { potStatus, verdien, verlies, reset } from '../domain/klaspot.js';
import { menuVoorKlas, wisselIn } from '../domain/beloningen.js';
import { DRILL_STAPPEN } from '../domain/model.js';
import { projecteer as projecteerAfspraken } from './afspraken.js';
import { el, leeg, euro, toast, dialoog, bevestig, datumTijd } from '../ui/components.js';

// Actieve, op te ruimen bronnen (mic-stream, timers) tussen twee renders.
let actief = { stream: null, ctx: null, raf: 0, tick: 0 };
function stopAlles() {
  if (actief.raf) cancelAnimationFrame(actief.raf);
  if (actief.tick) clearInterval(actief.tick);
  if (actief.stream) actief.stream.getTracks().forEach((t) => t.stop());
  if (actief.ctx && actief.ctx.state !== 'closed') actief.ctx.close().catch(() => {});
  actief = { stream: null, ctx: null, raf: 0, tick: 0 };
}

/** Router-hook: stopt de microfoon/timers wanneer je het Klasscherm verlaat. */
export function cleanup() {
  stopAlles();
}

export async function render(root, ctx) {
  stopAlles();
  if (!ctx.klasId) {
    root.append(el('div', { class: 'kaart' }, el('h2', {}, 'Geen actieve klas'), el('p', {}, 'Kies eerst een klas.'),
      el('a', { class: 'knop knop--primair', href: '#/klassen' }, 'Naar klassen')));
    return;
  }
  const klas = await get('klassen', ctx.klasId);
  const status = await potStatus(ctx.klasId);
  const config = status.config;

  const podium = el('div', { class: 'podium' });
  root.append(podium);

  // — kop —
  podium.append(
    el('div', { class: 'podium__kop' },
      el('div', { class: 'podium__klas' }, klas?.naam || 'Klas'),
      el('div', { class: 'podium__acties' },
        el('button', { class: 'knop knop--stil', onClick: () => projecteerAfspraken() }, '🤝 Afspraken'),
        el('a', { class: 'knop knop--stil', href: '#/dashboard' }, '‹ Administratie'),
      ),
    ),
  );

  // — reminder-strip —
  const reminder = await getSetting('reminder:' + ctx.klasId, 'Lesklaar · boek + taak van vorige dag · aan het werk');
  const strip = el('div', { class: 'reminder', title: 'Klik om aan te passen', onClick: async () => {
    const nieuw = prompt('Reminder / dagfocus:', reminder);
    if (nieuw != null) { await setSetting('reminder:' + ctx.klasId, nieuw); strip.querySelector('span').textContent = nieuw; }
  } }, el('strong', {}, '📌 '), el('span', {}, reminder));
  podium.append(strip);

  const rooster = el('div', { class: 'podium__rooster' });
  podium.append(rooster);

  // — geldkoker —
  const kokerWrap = el('div', { class: 'koker-kolom' });
  rooster.append(kokerWrap);
  const saldoEl = el('div', { class: 'koker__saldo' }, euro(status.saldo));
  const koker = el('div', { class: 'koker' });
  const vulling = el('div', { class: 'koker__vulling' });
  const briefjes = el('div', { class: 'koker__briefjes' });
  vulling.append(briefjes);
  const doelLijn = el('div', { class: 'koker__doel', title: 'Prijsdrempel' }, el('span', {}, `🎯 ${euro(config.prijsdrempel)}`));
  koker.append(vulling, doelLijn);
  kokerWrap.append(saldoEl, koker, el('div', { class: 'koker__onder' },
    el('span', { class: 'zacht' }, `Start ${euro(config.startkapitaal)} · bodem ${euro(config.bodem)}`)));

  const bannerEl = el('div', { class: 'podium__banner' });
  kokerWrap.append(bannerEl);

  function tekenKoker(s) {
    saldoEl.textContent = euro(s.saldo);
    const doel = Math.max(s.config.prijsdrempel || 1, 1);
    const pct = Math.max(0, Math.min(100, (s.saldo / doel) * 100));
    vulling.style.height = pct + '%';
    // briefjes: één per ~ (doel/12), gestapeld
    const stapEuro = Math.max(1, Math.round(doel / 12));
    const n = Math.min(24, Math.floor(s.saldo / stapEuro));
    leeg(briefjes);
    for (let i = 0; i < n; i++) briefjes.append(el('div', { class: 'briefje' }, '€'));
    koker.classList.toggle('koker--vol', s.saldo >= (s.config.prijsdrempel || Infinity));
    tekenBanner(s);
  }

  function tekenBanner(s) {
    leeg(bannerEl);
    if (s.saldo >= (s.config.prijsdrempel || Infinity)) {
      bannerEl.className = 'podium__banner podium__banner--feest';
      bannerEl.append(el('span', {}, '🎉 Prijsdrempel bereikt!'),
        el('button', { class: 'knop knop--primair', onClick: () => openMenu(ctx, herteken) }, 'Beloning kiezen'));
    } else if (s.saldo <= (s.config.herstartdrempel ?? -Infinity)) {
      bannerEl.className = 'podium__banner podium__banner--waarschuwing';
      bannerEl.append(el('span', {}, '⚠️ Herstart-zone — samen terugverdienen'));
      if (s.config.collectiefGevolg) {
        bannerEl.append(el('button', { class: 'knop knop--stil', onClick: () => herstartUitleg() }, 'Wat betekent dit?'));
      }
    } else {
      bannerEl.className = 'podium__banner';
    }
  }

  async function herteken() {
    const s = await potStatus(ctx.klasId);
    tekenKoker(s);
  }

  // — bedieningspaneel —
  const paneel = el('div', { class: 'podium__paneel' });
  rooster.append(paneel);

  const stap = config.stapbedrag ?? 1;
  paneel.append(
    el('div', { class: 'knoppen-groot' },
      el('button', { class: 'grootknop grootknop--plus', onClick: () => beweeg(+1) }, el('span', {}, `+ ${euro(stap)}`), el('small', {}, 'verdienen')),
      el('button', { class: 'grootknop grootknop--min', onClick: () => beweeg(-1) }, el('span', {}, `− ${euro(stap)}`), el('small', {}, 'collectief')),
    ),
    el('div', { class: 'knoprij knoprij--centraal' },
      el('button', { class: 'knop', onClick: () => beweeg(+5) }, `+ ${euro(stap * 5)}`),
      el('button', { class: 'knop', onClick: () => beweeg(-5) }, `− ${euro(stap * 5)}`),
      el('button', { class: 'knop', onClick: () => openMenu(ctx, herteken) }, '🎁 Menu'),
      el('button', { class: 'knop knop--stil', onClick: async () => {
        if (await bevestig('Pot terugzetten op het startkapitaal? (bv. na een prijs of nieuwe periode)')) {
          const s = await reset(ctx.klasId); tekenKoker(s); toast('Nieuwe cyclus gestart');
        }
      } }, '↺ Reset'),
      el('button', { class: 'knop knop--stil', onClick: () => toonLog(ctx.klasId) }, '📜 Log'),
    ),
  );

  async function beweeg(richting) {
    const s = richting > 0
      ? await verdien(ctx.klasId, Math.abs(richting), richting > 1 || richting < -1 ? 'Meerdere stappen' : 'Collectief gedrag')
      : await verlies(ctx.klasId, Math.abs(richting), 'Collectief negatief gedrag');
    tekenKoker(s);
  }

  // — decibelmeter —
  paneel.append(bouwDecibel(ctx.klasId, config, beweeg, herteken));

  // — lesdrill —
  paneel.append(await bouwDrill(ctx.klasId));

  tekenKoker(status);
}

// ————————————————————————————————— decibelmeter —————

function bouwDecibel(klasId, config, beweegFn, herteken) {
  const wrap = el('div', { class: 'decibel' });
  const titel = el('div', { class: 'decibel__kop' }, el('span', {}, '🎙️ Geluidsmeter'),
    el('span', { class: 'zacht' }, config.decibelModus === 'objectief' ? 'objectief' : config.decibelModus === 'bevestigen' ? 'bevestigen' : 'uit'));
  const balk = el('div', { class: 'decibel__balk' });
  const vul = el('div', { class: 'decibel__vul' });
  const drempelLijn = el('div', { class: 'decibel__drempel' });
  drempelLijn.style.left = (config.decibelDrempel ?? 55) + '%';
  balk.append(vul, drempelLijn);
  const knop = el('button', { class: 'knop knop--primair', onClick: () => toggle() }, '▶ Meten aan');
  const uitleg = el('p', { class: 'zacht decibel__uitleg' }, 'Meet enkel live volume. Neemt niets op en herkent niemand.');
  wrap.append(titel, balk, knop, uitleg);

  let aan = false;
  let boven = 0; // opeenvolgende ticks boven de drempel (grace)
  const drempel = config.decibelDrempel ?? 55;

  async function toggle() {
    if (aan) { stopAlles(); aan = false; knop.textContent = '▶ Meten aan'; balk.classList.remove('decibel--live'); vul.style.width = '0%'; return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } });
      const audio = new (window.AudioContext || window.webkitAudioContext)();
      const src = audio.createMediaStreamSource(stream);
      const analyser = audio.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      actief.stream = stream; actief.ctx = audio;
      aan = true; knop.textContent = '⏸ Meten uit'; balk.classList.add('decibel--live');

      let som = 0, tellen = 0;
      const meet = () => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v; }
        const rms = Math.sqrt(sum / buf.length); // 0..~1
        const niveau = Math.min(100, Math.round(rms * 240)); // relatieve luidheid
        vul.style.width = niveau + '%';
        vul.className = 'decibel__vul ' + (niveau >= drempel ? 'decibel__vul--rood' : niveau >= drempel * 0.7 ? 'decibel__vul--oranje' : 'decibel__vul--groen');
        som += niveau; tellen++;
        actief.raf = requestAnimationFrame(meet);
      };
      meet();

      // Trage evaluatietick (elke 6s): enkel in 'objectief' beweegt de collectieve meter.
      actief.tick = setInterval(async () => {
        const gem = tellen ? som / tellen : 0; som = 0; tellen = 0;
        if (config.decibelModus !== 'objectief') return;
        if (gem >= drempel) {
          boven++;
          if (boven >= 2) { // korte grace-periode vóór drift
            const s = await verlies(klasId, 1, 'Aanhoudend te luid (objectieve drift)', 'decibel'); herteken(s);
          }
        } else {
          boven = 0;
          const s = await verdien(klasId, 1, 'Stil gewerkt', 'decibel'); herteken(s);
        }
      }, 6000);
    } catch (e) {
      toast('Geen toegang tot de microfoon', 'fout');
    }
  }

  return wrap;
}

// ————————————————————————————————— lesdrill —————

async function bouwDrill(klasId) {
  const sleutel = 'drill:' + klasId;
  const opgeslagen = (await getSetting(sleutel, [])) || [];
  const status = new Set(opgeslagen);
  const wrap = el('div', { class: 'drill' }, el('div', { class: 'drill__kop' }, '✅ Lesstart'));
  const lijst = el('div', { class: 'drill__lijst' });
  DRILL_STAPPEN.forEach((tekst, i) => {
    const aan = status.has(i);
    const item = el('button', { class: 'drill__stap' + (aan ? ' drill__stap--klaar' : '') , onClick: async () => {
      if (status.has(i)) status.delete(i); else status.add(i);
      await setSetting(sleutel, [...status]);
      item.classList.toggle('drill__stap--klaar');
    } }, el('span', { class: 'drill__vink' }, aan ? '✓' : (i + 1)), el('span', {}, tekst));
    lijst.append(item);
  });
  wrap.append(lijst, el('button', { class: 'knop knop--stil drill__reset', onClick: async () => {
    status.clear(); await setSetting(sleutel, []);
    lijst.querySelectorAll('.drill__stap').forEach((n, i) => { n.classList.remove('drill__stap--klaar'); n.querySelector('.drill__vink').textContent = i + 1; });
  } }, 'Nieuwe les'));
  return wrap;
}

// ————————————————————————————————— beloningsmenu (uitgeven) —————

async function openMenu(ctx, herteken) {
  dialoog('Beloningsmenu', async (body, sluit) => {
    const status = await potStatus(ctx.klasId);
    const items = await menuVoorKlas(ctx.klasId);
    body.append(el('div', { class: 'menu-saldo' }, 'Saldo: ', el('strong', {}, euro(status.saldo))));
    if (!items.length) {
      body.append(el('p', { class: 'zacht' }, 'Nog geen beloningen. Voeg ze toe onder “Beloningen”.'));
    }
    const grid = el('div', { class: 'menu-grid' });
    for (const b of items) {
      const kanNiet = status.saldo < b.prijs;
      grid.append(
        el('div', { class: 'menu-item menu-item--' + b.niveau },
          el('div', { class: 'menu-item__kop' }, el('span', { class: 'menu-item__naam' }, b.naam), el('span', { class: 'menu-item__prijs' }, euro(b.prijs))),
          b.omschrijving ? el('p', { class: 'menu-item__oms' }, b.omschrijving) : null,
          b.talen ? el('p', { class: 'menu-item__talen' }, '🗣 ' + b.talen) : null,
          el('button', { class: 'knop ' + (kanNiet ? 'knop--stil' : 'knop--primair'), disabled: kanNiet, onClick: async () => {
            const r = await wisselIn(ctx.klasId, b.id);
            if (r.ok) { toast('Ingewisseld! Nieuw saldo ' + euro(r.saldo)); sluit(); herteken(); }
            else toast(r.reden, 'fout');
          } }, kanNiet ? 'Nog sparen' : 'Inwisselen'),
        ),
      );
    }
    body.append(grid);
    body.append(el('div', { class: 'dialoog__acties' }, el('button', { class: 'knop', onClick: sluit }, 'Sluiten')));
  });
}

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

function herstartUitleg() {
  dialoog('Herstart-uitdaging', (body, sluit) => {
    body.append(
      el('p', {}, 'De pot staat laag. Dit is geen straf, maar een gedeelde kans: de klas krijgt een korte, neutrale opdracht om samen terug te verdienen.'),
      el('p', { class: 'zacht' }, 'Lukt de herstart niet, dan volgt (indien ingeschakeld) een collectief gevolg: terugvallen op individueel werk met een korte controle op het einde. Jij beslist en triggert dit zelf — het gebeurt nooit automatisch.'),
      el('div', { class: 'dialoog__acties' }, el('button', { class: 'knop knop--primair', onClick: sluit }, 'Begrepen')),
    );
  });
}
