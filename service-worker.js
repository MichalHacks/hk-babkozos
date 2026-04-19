/*// Choose a cache name
const cacheName = 'cache-v1';
// List the files to precache
const precacheResources = ['/ui_blazena.html', '/ui_blazena_profile.js', '/ui_blazena_new.js', '/ui_blazena_relevant.js', '/ui_blazena_new.css', '/ui_lubo_profile.css', '/ui_lubo_fyp.css'];

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
  console.log('Service worker install event!');
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activate event!');
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', (event) => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    }),
  );
});*/
const CACHE_NAME = 'my-app-v1';
const ASSETS = ['/material_symbols.css', '/main.css', '/ui_blazena.html', '/ui_blazena_profile.js', '/ui_blazena_new.js', '/ui_blazena_relevant.js', '/ui_blazena_new.css', '/ui_lubo_profile.css', '/ui_lubo_fyp.css'];

// Install: cache your app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});