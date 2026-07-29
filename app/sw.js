// Service worker: maakt Klaskompas offline-bruikbaar (app-shell caching).
// Gegevens zelf leven in IndexedDB en worden nooit gecachet of verstuurd.

const CACHE = 'klaskompas-v0.2.0';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/styles.css',
  './src/main.js',
  './src/db/idb.js',
  './src/db/schema.js',
  './src/db/repo.js',
  './src/db/backup.js',
  './src/domain/model.js',
  './src/domain/klaspot.js',
  './src/domain/beloningen.js',
  './src/domain/schooljaar.js',
  './src/domain/individueel.js',
  './src/domain/zitplan.js',
  './src/domain/evaluaties.js',
  './src/domain/beveiliging.js',
  './src/ui/components.js',
  './src/views/dashboard.js',
  './src/views/klassen.js',
  './src/views/schooljaar.js',
  './src/views/rooster.js',
  './src/views/aanwezigheid.js',
  './src/views/inhaalwerk.js',
  './src/views/leerlingfiche.js',
  './src/views/individueel.js',
  './src/views/puntenboek.js',
  './src/views/acties.js',
  './src/views/zitplan.js',
  './src/views/afspraken.js',
  './src/views/beloningen.js',
  './src/views/instellingen.js',
  './src/views/klasscherm.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((sleutels) =>
      Promise.all(sleutels.filter((s) => s !== CACHE).map((s) => caches.delete(s))),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // Stale-while-revalidate voor de app-shell.
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const net = fetch(e.request)
        .then((res) => {
          if (res && res.ok) {
            const kopie = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, kopie));
          }
          return res;
        })
        .catch(() => cached);
      return cached || net;
    }),
  );
});
