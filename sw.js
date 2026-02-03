const CACHE_NAME = 'nasobilka-v1';

// Try to determine the base path from the script location
const scriptPath = self.location.pathname;
const BASE_PATH = scriptPath.substring(0, scriptPath.lastIndexOf('/'));

const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './css/style.css',
    './js/game.js',
    './js/constants.js',
    './js/state.js',
    './js/renderer.js',
    './js/input.js',
    './js/ui.js',
    './js/utils.js',
    './icon-192.png',
    './icon-512.png'
];

// Instalace service workeru
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache otevřena');
                // Use relative paths for caching
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
