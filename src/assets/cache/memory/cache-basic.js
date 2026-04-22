const cache_version = "0.0.1_prototype";
const assets_to_cache = [
  './',
  './index.html'
];

// Instalação: Salva arquivos no Cache Storage
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cache_version).then((cache) => {
      console.log('Arquivos em cache!');
      return cache.addAll(assets_to_cache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
