const CACHE_NAME = 'electrolyte-pwa-v4';
const STATIC_ASSETS = [
  './',
  './index.html',
  './DefaultImage.jpg',
  './favicon.svg',
  './manifest.webmanifest',
  './pwa-icon.svg'
];

const cacheStaticAssets = async () => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(STATIC_ASSETS);

  const indexResponse = await fetch('./index.html', { cache: 'reload' });
  if (!indexResponse.ok) return;

  await cache.put('./index.html', indexResponse.clone());
  const html = await indexResponse.text();
  const assetUrls = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => new URL(match[1], self.location.href))
    .filter((url) => url.origin === self.location.origin && url.pathname.includes('/assets/'));

  await Promise.all(
    assetUrls.map((url) =>
      fetch(url).then((response) => {
        if (response.ok) {
          return cache.put(url, response);
        }
      }).catch(() => undefined)
    )
  );
};

self.addEventListener('install', (event) => {
  event.waitUntil(cacheStaticAssets());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
          }
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => {
          if (event.request.destination === 'image') {
            return caches.match('./DefaultImage.jpg');
          }
          return undefined;
        });
    })
  );
});
