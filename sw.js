const CACHE_NAME = 'bolt999-v1';
const urlsToCache = [
    'https://beastmanxxx.github.io/BOLT999/',
    'https://beastmanxxx.github.io/BOLT999/index.html',
    'https://beastmanxxx.github.io/BOLT999/logo.avif',
    'https://beastmanxxx.github.io/BOLT999/manifest.json',
    'https://beastmanxxx.github.io/BOLT999/color.png',
    'https://beastmanxxx.github.io/BOLT999/mine.png',
    'https://beastmanxxx.github.io/BOLT999/coin.png',
    'https://beastmanxxx.github.io/BOLT999/boom.png',
    'https://beastmanxxx.github.io/BOLT999/qr.png',
    'https://beastmanxxx.github.io/BOLT999/auth.mp3',
    'https://beastmanxxx.github.io/BOLT999/color.mp3',
    'https://beastmanxxx.github.io/BOLT999/mine.mp3',
    'https://beastmanxxx.github.io/BOLT999/main.mp3',
    'https://beastmanxxx.github.io/BOLT999/deposite.mp3',
    'https://beastmanxxx.github.io/BOLT999/withdraw.mp3',
    'https://beastmanxxx.github.io/BOLT999/history.mp3',
    'https://beastmanxxx.github.io/BOLT999/dw.mp3',
    'https://beastmanxxx.github.io/BOLT999/error.mp3',
    'https://beastmanxxx.github.io/BOLT999/boom.mp3',
    'https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js',
    'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js',
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    'https://unpkg.com/@babel/standalone/babel.min.js',
    'https://cdn.tailwindcss.com'
];

// Install event - cache all assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control of all clients
            clients.claim()
        ])
    );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith('https://beastmanxxx.github.io/BOLT999/') &&
        !event.request.url.startsWith('https://www.gstatic.com/') &&
        !event.request.url.startsWith('https://unpkg.com/') &&
        !event.request.url.startsWith('https://cdn.tailwindcss.com')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    response => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                ).catch(() => {
                    // If both cache and network fail, return a fallback response
                    if (event.request.url.endsWith('.html')) {
                        return caches.match('https://beastmanxxx.github.io/BOLT999/index.html');
                    }
                });
            })
    );
});

// Handle navigation requests
self.addEventListener('navigate', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
}); 
