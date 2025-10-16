const CACHE_NAME = 'nasobilka-v1';
const BASE_PATH = '/multiplication-race';
const urlsToCache = [
    `${BASE_PATH}/`,
    `${BASE_PATH}/index.html`,
    `${BASE_PATH}/manifest.json`,
    `${BASE_PATH}/icon-192.png`,
    `${BASE_PATH}/icon-512.png`
];

// Instalace service workeru
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache otevřena');
                return cache.addAll(urlsToCache);
            })
    );
});

// Aktivace a čištění starých cache
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Mazání staré cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch - strategie Cache First
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Vrať z cache nebo stáhni ze sítě
                return response || fetch(event.request);
            })
    );
});