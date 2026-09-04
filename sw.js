/* =========================================================
   KULZZY RADIO NETWORK
   SERVICE WORKER
   VERSION 7
   FAST + RELIABLE LOADING
========================================================= */

const CACHE_NAME = "kulzzy-radio-app-v7";

/*
   Only cache files that are essential to displaying
   the application shell.

   Do NOT put JavaScript/CSS files here unless we know
   their exact current names.
*/
const APP_SHELL = [
    "./",
    "./index.html",
    "./manifest.json",
    "./install.js",
    "./icon-192.png"
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

            .catch(error => {

                console.error(
                    "Kulzzy Service Worker install error:",
                    error
                );

            })

    );

    /*
       Activate the new service worker immediately.
    */
    self.skipWaiting();

});


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

            .then(cacheNames => {

                return Promise.all(

                    cacheNames.map(cacheName => {

                        /*
                           Delete old Kulzzy caches.
                        */
                        if(
                            cacheName.startsWith(
                                "kulzzy-radio-app-"
                            ) &&
                            cacheName !== CACHE_NAME
                        ){

                            return caches.delete(
                                cacheName
                            );

                        }

                        return null;

                    })

                );

            })

            .then(() => {

                /*
                   Take control of all open pages.
                */
                return self.clients.claim();

            })

    );

});


/* =========================================================
   FETCH
========================================================= */

self.addEventListener("fetch", event => {

    const request = event.request;

    /*
       We only handle GET requests.
    */
    if(request.method !== "GET"){

        return;

    }


    const url = new URL(
        request.url
    );


    /* =====================================================
       EXTERNAL WEB REQUESTS
       
       Firebase, Google, radio servers, iframes, etc.
       
       Let the browser handle them normally.
       The service worker must NOT replace a failed
       external response with index.html.
    ===================================================== */

    if(
        url.origin !== self.location.origin
    ){

        event.respondWith(

            fetch(request)

                .catch(() => {

                    return Response.error();

                })

        );

        return;

    }


    /* =====================================================
       NAVIGATION / HTML PAGES

       Network first.

       This is important because users should receive
       the newest version of the app whenever internet
       is available.
    ===================================================== */

    if(
        request.mode === "navigate" ||
        request.destination === "document"
    ){

        event.respondWith(

            fetch(
                request,
                {
                    cache: "no-store"
                }
            )

                .then(response => {

                    /*
                       Only cache valid successful responses.
                    */
                    if(
                        response &&
                        response.ok
                    ){

                        const responseClone =
                            response.clone();

                        caches.open(
                            CACHE_NAME
                        ).then(cache => {

                            cache.put(
                                request,
                                responseClone
                            );

                        });

                    }

                    return response;

                })

                .catch(() => {

                    /*
                       Internet unavailable.

                       First try the exact requested
                       page from cache.
                    */
                    return caches.match(
                        request
                    )

                        .then(cachedPage => {

                            if(cachedPage){

                                return cachedPage;

                            }

                            /*
                               If the exact page isn't cached,
                               use the main app shell.
                            */
                            return caches.match(
                                "./index.html"
                            );

                        });

                })

        );

        return;

    }


    /* =====================================================
       SAME-ORIGIN STATIC FILES

       Examples:

       CSS
       JavaScript
       images
       manifest
       icons
       JSON
       fonts
       
       Cache first, then network.

       IMPORTANT:
       If a CSS/JS/image fails, DO NOT return index.html.
       Returning HTML for a JavaScript/CSS request can
       break the application.
    ===================================================== */

    event.respondWith(

        caches.match(request)

            .then(cachedResponse => {

                if(cachedResponse){

                    /*
                       Return cached file immediately.

                       At the same time, try to refresh
                       it from the network.
                    */

                    fetch(
                        request,
                        {
                            cache: "no-store"
                        }
                    )

                        .then(networkResponse => {

                            if(
                                networkResponse &&
                                networkResponse.ok
                            ){

                                caches.open(
                                    CACHE_NAME
                                ).then(cache => {

                                    cache.put(
                                        request,
                                        networkResponse.clone()
                                    );

                                });

                            }

                        })

                        .catch(() => {

                            /*
                               Network refresh failed.

                               Cached version is still valid.
                            */

                        });


                    return cachedResponse;

                }


                /*
                   File isn't cached.

                   Get it from the network.
                */
                return fetch(
                    request,
                    {
                        cache: "no-store"
                    }
                )

                    .then(networkResponse => {

                        if(
                            networkResponse &&
                            networkResponse.ok
                        ){

                            const responseClone =
                                networkResponse.clone();

                            caches.open(
                                CACHE_NAME
                            ).then(cache => {

                                cache.put(
                                    request,
                                    responseClone
                                );

                            });

                        }

                        return networkResponse;

                    })

                    .catch(() => {

                        /*
                           IMPORTANT:

                           Never return index.html here.

                           A failed JS request must remain a
                           failed JS request.

                           A failed CSS request must remain
                           a failed CSS request.

                           A failed image request must remain
                           a failed image request.
                        */

                        return Response.error();

                    });

            })

    );

});


/* =========================================================
   MESSAGE CONTROL
========================================================= */

self.addEventListener(
    "message",
    event => {

        if(!event.data){

            return;

        }


        /*
           Allows the page to tell the service worker
           to activate immediately.
        */
        if(
            event.data.type ===
            "SKIP_WAITING"
        ){

            self.skipWaiting();

        }

    }
);
