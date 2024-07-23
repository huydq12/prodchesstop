const cacheName = "DefaultCompany-PokeChess-0.1.0";
const contentToCache = [
    "Build/athenechess.loader.js",
    "Build/athenechess.framework.js",
    "Build/athenechess.data",
    "Build/athenechess.wasm",
    "TemplateData/style.css"
];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');

    e.waitUntil((async function () {
        const cache = await caches.open(cacheName);
        console.log('[Service Worker] Caching all: app shell and content');
        await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
        // Chỉ xử lý các yêu cầu GET
        if (e.request.method !== 'GET') {
            return fetch(e.request);
        }

        let response = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (response) { return response; }

        response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
    })());
});

