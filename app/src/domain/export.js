// Afdrukken & exporteren (roadmap A1). Alles lokaal: CSV-download en een print-venster
// (via een tijdelijke iframe, zodat popup-blokkers niet in de weg zitten).

/** Download een matrix (array van rijen) als CSV-bestand (Excel-vriendelijk, ';' + BOM). */
export function exporteerCsv(bestandsnaam, matrix) {
  const csv = matrix
    .map((rij) => rij.map((cel) => {
      const s = String(cel ?? '');
      return /[",;\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(';'))
    .join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = bestandsnaam.endsWith('.csv') ? bestandsnaam : bestandsnaam + '.csv';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const PRINT_CSS = `
  * { box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; color: #182b20; margin: 24px; }
  h1 { font-size: 20px; margin: 0 0 2px; }
  h2 { font-size: 15px; margin: 18px 0 6px; }
  .meta { color: #667; font-size: 12px; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; margin: 6px 0 14px; }
  th, td { border: 1px solid #cbd5cc; padding: 5px 8px; text-align: left; vertical-align: top; }
  th { background: #eef3ec; }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  ul { margin: 4px 0 12px; padding-left: 18px; }
  li { margin: 2px 0; }
  .rij { display: flex; gap: 24px; flex-wrap: wrap; }
  .voet { margin-top: 24px; color: #889; font-size: 11px; border-top: 1px solid #cbd5cc; padding-top: 8px; }
  @media print { body { margin: 0; } @page { margin: 16mm; } }
`;

/** Open een afdrukvenster met de gegeven HTML-inhoud. */
export function afdruk(titel, htmlBinnen) {
  const iframe = document.createElement('iframe');
  Object.assign(iframe.style, { position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0' });
  document.body.append(iframe);
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>${escapeHtml(titel)}</title><style>${PRINT_CSS}</style></head><body>${htmlBinnen}<div class="voet">Klaskompas · lokaal gegenereerd · ${new Date().toLocaleDateString('nl-BE')}</div></body></html>`);
  doc.close();
  iframe.contentWindow.focus();
  setTimeout(() => {
    iframe.contentWindow.print();
    setTimeout(() => iframe.remove(), 800);
  }, 300);
}

export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
