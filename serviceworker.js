var CACHE_NAME = 'learn-pwa-cache-v1';
var urlsToCache = [
  './',
  './fallback.json',
  './assets/css/style.css',
  './assets/js/jquery.min.js',
  './assets/js/main.js'
];

// Install
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch
self.addEventListener('fetch', function(event) {
  var request = event.request;
  var url = new URL(request.url);

  if(url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
          // Cache hit - return response
          return response || fetch(request);
      })
    );
  } else {
    event.respondWith(
      caches.open('members-cache').then(function(cache) {
        return fetch(request).then(function(liveResponse) {
          cache.put(request, liveResponse.clone());
          return liveResponse;
        }).catch(function() {
          return caches.match(request).then(function(response) {
            if(response) return response;
            return caches.match('./fallback.json');
          });
        });
      })
    );
  }
  
});

// Activate
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName != CACHE_NAME
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});