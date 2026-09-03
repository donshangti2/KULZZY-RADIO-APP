/* =========================================================
   KULZZY RADIO NETWORK
   SERVICE WORKER
   FAST + RELIABLE APP LOADING
========================================================= */

const CACHE_NAME = "kulzzy-radio-app-v2";

const APP_SHELL = [
    "./",
    "./index.html",
    "./manifest.json",
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
   APP SHELL = CACHE FIRST
   OTHER FILES = NETWORK WITH SAFE FALLBACK
========================================================= */

self.addEventListener("fetch", event => {

    const request = event.request;


    /* -----------------------------------------------------
       ONLY HANDLE GET REQUESTS
    ----------------------------------------------------- */

    if (request.method !== "GET") {

        return;

    }


    const url = new URL(request.url);


    /* -----------------------------------------------------
       KEEP EXTERNAL SERVICES OUT OF THE APP CACHE
       Firebase, radio player, APIs, etc.
    ----------------------------------------------------- */

    const isExternal =
        url.origin !== self.location.origin;


    /* -----------------------------------------------------
       MAIN KULZZY APP
       CACHE FIRST
       
       This makes the already-loaded app open immediately
       even when the internet is slow.
    ----------------------------------------------------- */

    if (!isExternal) {

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

                            /* ------------------------------------------------
                               If a page/file cannot be reached,
                               try the cached app shell.
                            ------------------------------------------------ */

                            return caches.match("./index.html");

                        });

                })

        );

        return;

    }


    /* =====================================================
       EXTERNAL REQUESTS
       
       Do NOT allow Firebase/player/external services to
       block the main application.
    ===================================================== */

    event.respondWith(

        fetch(request)

            .catch(() => {

                return caches.match(request);

            })

    );

});
