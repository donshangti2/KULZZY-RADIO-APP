/* =========================================================
   KULZZY RADIO NETWORK
   SERVICE WORKER
   FAST + RELIABLE APP LOADING
========================================================= */

const CACHE_NAME = "kulzzy-radio-app-v6";

const APP_SHELL = [
    "./",
    "./index.html",
    "./manifest.json",
    "./install.js",
    "./icon-192.png",
    "./icon-512.png",
    "./apple-touch-icon.png"
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
   MESSAGE
========================================================= */

self.addEventListener("message", event => {

    if (
        event.data &&
        event.data.action === "SKIP_WAITING"
    ) {

        self.skipWaiting();

    }

});


/* =========================================================
   FETCH
========================================================= */

self.addEventListener("fetch", event => {

    const request = event.request;

    if (request.method !== "GET") {

        return;

    }


    const url = new URL(request.url);


    /* -----------------------------------------------------
       EXTERNAL REQUESTS
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


    /* -----------------------------------------------------
       HTML / PAGE NAVIGATION
       NETWORK FIRST
    ----------------------------------------------------- */

    if (
        request.mode === "navigate" ||
        request.destination === "document"
    ) {

        event.respondWith(

            fetch(request)

                .then(response => {

                    if (
                        response &&
                        response.ok
                    ) {

                        const copy =
                            response.clone();

                        caches.open(CACHE_NAME)

                            .then(cache => {

                                cache.put(
                                    request,
                                    copy
                                );

                            });

                    }

                    return response;

                })

                .catch(() => {

                    return caches.match(request)

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


    /* -----------------------------------------------------
       OTHER SAME-ORIGIN FILES
       CACHE FIRST
    ----------------------------------------------------- */

    event.respondWith(

        caches.match(request)

            .then(cachedResponse => {

                if (cachedResponse) {

                    return cachedResponse;

                }


                return fetch(request)

                    .then(response => {

                        if (
                            response &&
                            response.ok
                        ) {

                            const copy =
                                response.clone();

                            caches.open(CACHE_NAME)

                                .then(cache => {

                                    cache.put(
                                        request,
                                        copy
                                    );

                                });

                        }

                        return response;

                    })

                    .catch(() => {

                        return caches.match(
                            "./index.html"
                        );

                    });

            })

    );

});
