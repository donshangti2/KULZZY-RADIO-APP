/* =========================================================
   KULZZY RADIO NETWORK
   UNIVERSAL SERVICE WORKER
   FAST + RELIABLE LOADING
   ========================================================= */

const CACHE_NAME = "kulzzy-radio-app-v5";

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

self.addEventListener("install", function(event) {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(function(cache) {

                return cache.addAll(APP_SHELL);

            })

            .then(function() {

                return self.skipWaiting();

            })

    );

});


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener("activate", function(event) {

    event.waitUntil(

        caches.keys()

            .then(function(cacheNames) {

                return Promise.all(

                    cacheNames

                        .filter(function(name) {

                            return name !== CACHE_NAME;

                        })

                        .map(function(name) {

                            return caches.delete(name);

                        })

                );

            })

            .then(function() {

                return self.clients.claim();

            })

    );

});


/* =========================================================
   FETCH
========================================================= */

self.addEventListener("fetch", function(event) {

    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);


    /* =====================================================
       EXTERNAL REQUESTS
       Firebase, radio player, APIs, etc.
       NEVER CACHE THESE.
    ===================================================== */

    if (url.origin !== self.location.origin) {

        event.respondWith(

            fetch(request)

                .catch(function() {

                    return caches.match(request);

                })

        );

        return;
    }


    /* =====================================================
       HTML / PAGE NAVIGATION

       NETWORK FIRST
       CACHE FALLBACK

       This makes sure users get the latest app when
       internet is available, while still allowing the
       app to open when the connection is poor.
    ===================================================== */

    if (
        request.mode === "navigate" ||
        request.destination === "document"
    ) {

        event.respondWith(

            fetch(request)

                .then(function(response) {

                    if (
                        response &&
                        response.ok
                    ) {

                        const copy =
                            response.clone();

                        caches.open(CACHE_NAME)

                            .then(function(cache) {

                                cache.put(
                                    request,
                                    copy
                                );

                            });

                    }

                    return response;

                })

                .catch(function() {

                    return caches.match(request)

                        .then(function(cached) {

                            if (cached) {
                                return cached;
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
       SAME-ORIGIN FILES

       CACHE FIRST
       NETWORK FALLBACK
    ===================================================== */

    event.respondWith(

        caches.match(request)

            .then(function(cached) {

                if (cached) {
                    return cached;
                }

                return fetch(request)

                    .then(function(response) {

                        if (
                            response &&
                            response.ok
                        ) {

                            const copy =
                                response.clone();

                            caches.open(CACHE_NAME)

                                .then(function(cache) {

                                    cache.put(
                                        request,
                                        copy
                                    );

                                });

                        }

                        return response;

                    })

                    .catch(function() {

                        return caches.match(
                            "./index.html"
                        );

                    });

            })

    );

});
