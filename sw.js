/* =========================================================
   KULZZY RADIO NETWORK
   SERVICE WORKER
   FAST + RELIABLE APP LOADING
========================================================= */

const CACHE_NAME = "kulzzy-radio-app-v3";

const APP_SHELL = [
    "./",
    "./index.html",
    "./manifest.json",
    "./install.js",
    "./icon-192.png",
    "./icon-512.png"
];


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => {

                return cache.addAll(APP_SHELL);

            })

            .then(() => {

                return self.skipWaiting();

            })

    );

});


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

            .then(cacheNames => {

                return Promise.all(

                    cacheNames

                        .filter(name => {

                            return name !== CACHE_NAME;

                        })

                        .map(name => {

                            return caches.delete(name);

                        })

                );

            })

            .then(() => {

                return self.clients.claim();

            })

    );

});


/* =========================================================
   FETCH
========================================================= */

self.addEventListener("fetch", event => {

    const request = event.request;


    /* -----------------------------------------------------
       ONLY GET REQUESTS
    ----------------------------------------------------- */

    if (request.method !== "GET") {

        return;

    }


    const url = new URL(request.url);


    /* -----------------------------------------------------
       EXTERNAL SERVICES
       
       Firebase, radio player, APIs, etc.
       are NOT cached by this service worker.
    ----------------------------------------------------- */

    if (url.origin !== self.location.origin) {

        event.respondWith(

            fetch(request)

                .catch(() => {

                    return caches.match(request);

                })

        );

        return;

    }


    /* =====================================================
       NAVIGATION / HTML
       
       NETWORK FIRST
       
       This prevents an old cached index.html from keeping
       the app stuck on an older version.
    ===================================================== */

    if (
        request.mode === "navigate" ||
        request.destination === "document"
    ) {

        event.respondWith(

            fetch(request)

                .then(networkResponse => {

                    if (
                        networkResponse &&
                        networkResponse.ok
                    ) {

                        const responseClone =
                            networkResponse.clone();

                        caches.open(CACHE_NAME)

                            .then(cache => {

                                cache.put(
                                    request,
                                    responseClone
                                );

                            });

                    }

                    return networkResponse;

                })

                .catch(() => {

                    return caches.match(
                        request
                    )

                    .then(cachedPage => {

                        if (cachedPage) {

                            return cachedPage;

                        }

                        return caches.match(
                            "./index.html"
                        );

                    });

                })

        );

        return;

    }


    /* =====================================================
       OTHER SAME-ORIGIN FILES
       
       CACHE FIRST
       NETWORK FALLBACK
    ===================================================== */

    event.respondWith(

        caches.match(request)

            .then(cachedResponse => {

                if (cachedResponse) {

                    return cachedResponse;

                }


                return fetch(request)

                    .then(networkResponse => {

                        if (
                            networkResponse &&
                            networkResponse.ok
                        ) {

                            const responseClone =
                                networkResponse.clone();

                            caches.open(CACHE_NAME)

                                .then(cache => {

                                    cache.put(
                                        request,
                                        responseClone
                                    );

                                });

                        }

                        return networkResponse;

                    })

                    .catch(() => {

                        return caches.match(
                            "./index.html"
                        );

                    });

            })

    );

});
