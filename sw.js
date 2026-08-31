const CACHE_NAME = "kulzzy-radio-v2";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./logo.jpg"
];


/* INSTALL NEW VERSION */

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME).then(cache => {

      return cache.addAll(APP_SHELL);

    })

  );

  self.skipWaiting();

});


/* DELETE OLD VERSIONS */

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(cacheNames => {

      return Promise.all(

        cacheNames

          .filter(name => name !== CACHE_NAME)

          .map(name => caches.delete(name))

      );

    })

  );

  self.clients.claim();

});


/* ALWAYS CHECK INTERNET FIRST */

self.addEventListener("fetch", event => {

  if(event.request.method !== "GET") return;

  event.respondWith(

    fetch(event.request)

      .then(response => {

        const copy = response.clone();

        caches.open(CACHE_NAME).then(cache => {

          cache.put(event.request, copy);

        });

        return response;

      })

      .catch(() => {

        return caches.match(event.request);

      })

  );

});
