// Bundelt Klaskompas tot één zelfstandig HTML-bestand (dist/klaskompas.html)
// dat lokaal via file:// werkt (dubbelklikken). Vereist esbuild.
//   npx esbuild  (of: npm i -g esbuild)  →  node app/build-singlefile.mjs
//
// De losse app/ (ES-modules + service worker) blijft de bron; dit is een build-artefact.

import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const hier = dirname(fileURLToPath(import.meta.url));

const res = await build({
  entryPoints: [resolve(hier, 'src/main.js')],
  bundle: true,
  format: 'iife', // klassiek script → werkt op file:// zonder server
  charset: 'utf8',
  legalComments: 'none',
  write: false,
});
const bundel = res.outputFiles[0].text;
const css = await readFile(resolve(hier, 'assets/styles.css'), 'utf8');

const favicon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%A7%AD%3C/text%3E%3C/svg%3E";

const html = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Klaskompas</title>
<meta name="description" content="Klaskompas — lokaal-eerst hulpmiddel voor klasadministratie en visueel klasmanagement." />
<meta name="theme-color" content="#1f7a5a" />
<link rel="icon" href="${favicon}" />
<style>
${css}
</style>
</head>
<body>
<noscript>Klaskompas heeft JavaScript nodig om lokaal te werken.</noscript>
<script>
${bundel}
</script>
</body>
</html>
`;

await mkdir(resolve(hier, 'dist'), { recursive: true });
const uit = resolve(hier, 'dist/klaskompas.html');
await writeFile(uit, html, 'utf8');
console.log('Geschreven:', uit, '(' + Math.round(html.length / 1024) + ' kB)');
