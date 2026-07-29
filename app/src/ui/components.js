// Kleine, afhankelijkheidsvrije UI-helpers: element-fabriek, toast, dialoog, formatters.

/**
 * Element-fabriek. `props` mag class/id/attrs/events/dataset bevatten.
 * el('button', {class:'knop', onClick:fn}, 'Tekst')
 */
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
    else if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k in node && k !== 'list') {
      try {
        node[k] = v;
      } catch (_) {
        node.setAttribute(k, v);
      }
    } else node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}

export function leeg(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
  return node;
}

/** Korte, niet-blokkerende melding rechtsonder. */
export function toast(bericht, soort = 'info') {
  let laag = document.querySelector('.toast-laag');
  if (!laag) {
    laag = el('div', { class: 'toast-laag' });
    document.body.append(laag);
  }
  const t = el('div', { class: `toast toast--${soort}` }, bericht);
  laag.append(t);
  requestAnimationFrame(() => t.classList.add('toast--in'));
  setTimeout(() => {
    t.classList.remove('toast--in');
    setTimeout(() => t.remove(), 250);
  }, 3200);
}

/**
 * Modale dialoog. `bouw(sluit)` vult de inhoud; retourneer knoppen zelf.
 * @returns {{sluit:()=>void, root:HTMLElement}}
 */
export function dialoog(titel, bouw) {
  const overlay = el('div', { class: 'overlay' });
  const sluit = () => {
    overlay.classList.remove('overlay--in');
    setTimeout(() => overlay.remove(), 200);
    document.removeEventListener('keydown', esc);
  };
  const esc = (e) => {
    if (e.key === 'Escape') sluit();
  };
  const paneel = el(
    'div',
    { class: 'dialoog', role: 'dialog', 'aria-modal': 'true' },
    el(
      'div',
      { class: 'dialoog__kop' },
      el('h2', {}, titel),
      el('button', { class: 'icoonknop', title: 'Sluiten', onClick: sluit }, '✕'),
    ),
  );
  const body = el('div', { class: 'dialoog__body' });
  paneel.append(body);
  overlay.append(paneel);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) sluit();
  });
  document.addEventListener('keydown', esc);
  document.body.append(overlay);
  requestAnimationFrame(() => overlay.classList.add('overlay--in'));
  bouw(body, sluit);
  return { sluit, root: paneel };
}

/** Ja/nee-bevestiging als belofte. */
export function bevestig(vraag, { jaLabel = 'Ja', neeLabel = 'Annuleren', gevaar = false } = {}) {
  return new Promise((resolve) => {
    dialoog('Bevestigen', (body, sluit) => {
      body.append(
        el('p', {}, vraag),
        el(
          'div',
          { class: 'dialoog__acties' },
          el('button', { class: 'knop', onClick: () => { sluit(); resolve(false); } }, neeLabel),
          el(
            'button',
            { class: gevaar ? 'knop knop--gevaar' : 'knop knop--primair', onClick: () => { sluit(); resolve(true); } },
            jaLabel,
          ),
        ),
      );
    });
  });
}

// — Formatters —

export function euro(bedrag) {
  const n = Number(bedrag) || 0;
  return '€' + (Number.isInteger(n) ? n : n.toFixed(2));
}

export function datumKort(iso) {
  if (!iso) return '';
  const d = iso.length > 10 ? new Date(iso) : (() => { const [j, m, dd] = iso.split('-'); return new Date(j, m - 1, dd); })();
  return d.toLocaleDateString('nl-BE', { day: '2-digit', month: 'short' });
}

export function datumTijd(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('nl-BE', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

/** Injecteer een <style> één keer (per id). Zo brengt elke view haar eigen CSS mee. */
export function stijl(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id;
  s.textContent = css;
  document.head.append(s);
}

// — Herbruikbare formuliervelden (import in views i.p.v. lokaal herdefiniëren) —

export function etiket(label, control) {
  return el('label', { class: 'veld' }, el('span', {}, label), control);
}

export function veld(label, { type = 'text', value = '', placeholder = '' } = {}) {
  const input = el('input', { class: 'invoer', type, value: value ?? '', placeholder });
  return { input, wrap: etiket(label, input) };
}

export function tekstveld(label, { value = '', rows = 3, placeholder = '' } = {}) {
  const input = el('textarea', { class: 'invoer', rows, placeholder }, value || '');
  return { input, wrap: etiket(label, input) };
}

export function keuze(label, opties, gekozen) {
  const select = el(
    'select',
    { class: 'invoer' },
    ...Object.entries(opties).map(([v, l]) => el('option', { value: v, selected: v === gekozen }, l)),
  );
  return { select, wrap: etiket(label, select) };
}

/** Toont een lege-toestand met titel + hint. */
export function leegKaart(titel, hint, actie) {
  return el(
    'div',
    { class: 'leeg' },
    el('div', { class: 'leeg__icoon' }, '🧭'),
    el('h3', {}, titel),
    hint ? el('p', {}, hint) : null,
    actie || null,
  );
}
