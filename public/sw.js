const CACHE = 'hip-homorrd-shell-v13-3';
const SHELL = ['/', '/create-invoice', '/offline', '/pricing'];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then(async (cache) => {
    await Promise.allSettled(SHELL.map(async (url) => { const response = await fetch(url, { cache: 'reload' }); if (response.ok) await cache.put(url, response); }));
  }).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => { event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const privateOrAuthRoute =
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/pay/') ||
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up') ||
    url.pathname.startsWith('/verify') ||
    url.pathname.startsWith('/forgot') ||
    url.pathname.startsWith('/reset') ||
    url.pathname.startsWith('/auth/');
  if (url.origin !== self.location.origin || privateOrAuthRoute) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => { if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, response.clone())); return response; }).catch(async () => (await caches.match(request)) || (await caches.match(url.pathname)) || (await caches.match('/offline'))));
    return;
  }
  if (url.pathname.startsWith('/_next/static/') || /\.(?:css|js|woff2|webp|png|jpg|jpeg|svg|ico)$/.test(url.pathname)) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => { if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, response.clone())); return response; })));
  }
});
