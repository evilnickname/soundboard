/* https://developers.google.com/web/ilt/pwa/offline-quickstart */

var CACHE = 'soundboard-cache';
var urlsToCache = [
    '.',
    'index.html',
    'megaphone.svg',
    'android-chrome-512x512.png'
]

self.addEventListener('install', function (e) {
    console.log('The service worker is being installed.');
    e.waitUntil(caches.open(CACHE)
        .then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                return response || fetchAndCache(event.request);
            })
    );
});

function fetchAndCache(url) {
    return fetch(url)
        .then(function (response) {
            // Check if we received a valid response
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return caches.open(CACHE)
                .then(function (cache) {
                    cache.put(url, response.clone());
                    return response;
                });
        })
        .catch(function (error) {
            console.log('Request failed:', error);
            // You could return a custom offline 404 page here
        });
}