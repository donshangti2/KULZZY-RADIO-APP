/* =========================================================
   KULZZY RADIO NETWORK
   UNIVERSAL PWA INSTALL SYSTEM
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       INSTALL PROMPT
    ===================================================== */

    var deferredInstallPrompt = null;


    /* =====================================================
       CHECK IF APP IS ALREADY INSTALLED
    ===================================================== */

    function isInstalled() {

        if (
            window.matchMedia &&
            window.matchMedia("(display-mode: standalone)").matches
        ) {
            return true;
        }


        if (
            window.navigator.standalone === true
        ) {
            return true;
        }


        return false;

    }


    /* =====================================================
       IOS DETECTION
    ===================================================== */

    function isIOS() {

        return /iphone|ipad|ipod/i.test(
            navigator.userAgent
        );

    }


    /* =====================================================
       IOS SAFARI DETECTION
    ===================================================== */

    function isIOSSafari() {

        var ua = navigator.userAgent;

        var iOS =
            /iphone|ipad|ipod/i.test(ua);

        var webkit =
            /webkit/i.test(ua);

        var standalone =
            navigator.standalone;

        return (
            iOS &&
            webkit &&
            !standalone
        );

    }


    /* =====================================================
       ANDROID DETECTION
    ===================================================== */

    function isAndroid() {

        return /android/i.test(
            navigator.userAgent
        );

    }


    /* =====================================================
       CAPTURE REAL BROWSER INSTALL PROMPT
    ===================================================== */

    window.addEventListener(
        "beforeinstallprompt",
        function (event) {

            event.preventDefault();

            deferredInstallPrompt = event;


            var button =
                document.getElementById(
                    "kulzzyInstallButton"
                );


            if (button) {

                button.innerHTML =
                    "📲 INSTALL APP";

                button.style.display =
                    "block";

            }

        }
    );


    /* =====================================================
       CREATE INSTALL SCREEN
    ===================================================== */

    function createInstallScreen() {

        if (isInstalled()) {
            return;
        }


        if (
            document.getElementById(
                "kulzzyInstallScreen"
            )
        ) {
            return;
        }


        var screen =
            document.createElement("div");


        screen.id =
            "kulzzyInstallScreen";


        screen.innerHTML = `

            <div class="kulzzyInstallBox">

                <div class="kulzzyInstallImageWrap">

                    <img
                        src="./logo.jpg"
                        class="kulzzyInstallImage"
                        alt="Kulzzy Radio"
                    >

                </div>


                <div class="kulzzyInstallTitle">

                    INSTALL KULZZY RADIO

                </div>


                <div class="kulzzyInstallLive">

                    🔴 JOIN US LIVE ON-AIR

                </div>


                <div
                    id="kulzzyInstallMessage"
                    class="kulzzyInstallMessage"
                >

                    Install Kulzzy Radio on your
                    device for quick and easy access.

                </div>


                <button
                    id="kulzzyInstallButton"
                    class="kulzzyInstallButton"
                    type="button"
                >

                    📲 INSTALL APP

                </button>


                <button
                    id="kulzzyContinueButton"
                    class="kulzzyContinueButton"
                    type="button"
                >

                    CONTINUE TO KULZZY RADIO

                </button>


                <div
                    id="kulzzyInstallHelp"
                    class="kulzzyInstallHelp"
                ></div>

            </div>

        `;


        document.body.appendChild(screen);


        addInstallStyles();


        setupInstallButton();


        setupContinueButton();


        updateInstallScreen();

    }


    /* =====================================================
       INSTALL SCREEN CSS
    ===================================================== */

    function addInstallStyles() {

        if (
            document.getElementById(
                "kulzzyInstallStyles"
            )
        ) {
            return;
        }


        var style =
            document.createElement("style");


        style.id =
            "kulzzyInstallStyles";


        style.textContent = `

            #kulzzyInstallScreen {

                position: fixed;

                inset: 0;

                width: 100%;

                height: 100%;

                background:
                    linear-gradient(
                        180deg,
                        #020d1a 0%,
                        #06152B 55%,
                        #020d1a 100%
                    );

                z-index: 2147483647;

                display: flex;

                align-items: center;

                justify-content: center;

                padding: 20px;

                overflow-y: auto;

                font-family:
                    Arial,
                    Helvetica,
                    sans-serif;

            }


            .kulzzyInstallBox {

                width: 100%;

                max-width: 430px;

                text-align: center;

                background:
                    rgba(
                        7,
                        21,
                        47,
                        .98
                    );

                border:
                    2px solid
                    #ffd700;

                border-radius: 24px;

                padding: 25px 20px 22px;

                box-shadow:
                    0 0 35px
                    rgba(
                        255,
                        215,
                        0,
                        .20
                    );

            }


            .kulzzyInstallImageWrap {

                width: 145px;

                height: 145px;

                margin:
                    0 auto 18px;

                border-radius: 22px;

                overflow: hidden;

                border:
                    3px solid
                    #ffd700;

                box-shadow:
                    0 0 20px
                    rgba(
                        255,
                        215,
                        0,
                        .35
                    );

            }


            .kulzzyInstallImage {

                width: 100%;

                height: 100%;

                object-fit: cover;

                display: block;

            }


            .kulzzyInstallTitle {

                color: #ffd700;

                font-size: 27px;

                font-weight: 900;

                line-height: 1.15;

                margin-bottom: 10px;

            }


            .kulzzyInstallLive {

                color: white;

                font-size: 19px;

                font-weight: 900;

                margin-bottom: 18px;

            }


            .kulzzyInstallMessage {

                color: #ffffff;

                font-size: 15px;

                line-height: 1.55;

                margin-bottom: 20px;

            }


            .kulzzyInstallButton {

                width: 100%;

                min-height: 58px;

                border: 0;

                border-radius: 15px;

                background: #ffd700;

                color: #06152B;

                font-size: 19px;

                font-weight: 900;

                cursor: pointer;

                padding: 12px 15px;

                box-shadow:
                    0 5px 20px
                    rgba(
                        255,
                        215,
                        0,
                        .25
                    );

                -webkit-tap-highlight-color:
                    transparent;

            }


            .kulzzyInstallButton:active {

                transform: scale(.98);

            }


            .kulzzyContinueButton {

                width: 100%;

                min-height: 50px;

                margin-top: 12px;

                border:
                    1px solid
                    rgba(
                        255,
                        215,
                        0,
                        .55
                    );

                border-radius: 14px;

                background:
                    transparent;

                color: white;

                font-size: 14px;

                font-weight: 800;

                cursor: pointer;

                padding: 10px;

                -webkit-tap-highlight-color:
                    transparent;

            }


            .kulzzyInstallHelp {

                color: #ffd700;

                font-size: 14px;

                line-height: 1.55;

                margin-top: 18px;

                display: none;

            }


            .kulzzyInstallHelp strong {

                color: white;

            }


            @media(max-width:380px) {

                .kulzzyInstallBox {

                    padding:
                        20px 15px;

                }


                .kulzzyInstallImageWrap {

                    width: 115px;

                    height: 115px;

                }


                .kulzzyInstallTitle {

                    font-size: 23px;

                }


                .kulzzyInstallLive {

                    font-size: 17px;

                }

            }

        `;


        document.head.appendChild(style);

    }


    /* =====================================================
       INSTALL BUTTON
    ===================================================== */

    function setupInstallButton() {

        var button =
            document.getElementById(
                "kulzzyInstallButton"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            async function () {


                /* =========================================
                   REAL PWA INSTALL
                ========================================= */

                if (deferredInstallPrompt) {

                    try {

                        deferredInstallPrompt.prompt();


                        var result =
                            await deferredInstallPrompt.userChoice;


                        if (
                            result &&
                            result.outcome ===
                            "accepted"
                        ) {

                            closeInstallScreen();

                        }


                        deferredInstallPrompt =
                            null;

                    }

                    catch (error) {

                        showManualInstructions();

                    }

                    return;

                }


                /* =========================================
                   IPHONE / IPAD
                ========================================= */

                if (isIOSSafari()) {

                    showIOSInstructions();

                    return;

                }


                /* =========================================
                   ANDROID / OTHER BROWSERS
                ========================================= */

                showManualInstructions();

            }
        );

    }


    /* =====================================================
       CONTINUE BUTTON
    ===================================================== */

    function setupContinueButton() {

        var button =
            document.getElementById(
                "kulzzyContinueButton"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                closeInstallScreen();

            }
        );

    }


    /* =====================================================
       CLOSE INSTALL SCREEN
    ===================================================== */

    function closeInstallScreen() {

        var screen =
            document.getElementById(
                "kulzzyInstallScreen"
            );


        if (!screen) {
            return;
        }


        screen.style.opacity =
            "0";


        screen.style.transition =
            "opacity .25s ease";


        setTimeout(
            function () {

                if (screen) {

                    screen.remove();

                }

            },
            250
        );

    }


    /* =====================================================
       IOS INSTALL INSTRUCTIONS
    ===================================================== */

    function showIOSInstructions() {

        var message =
            document.getElementById(
                "kulzzyInstallMessage"
            );


        var help =
            document.getElementById(
                "kulzzyInstallHelp"
            );


        if (message) {

            message.innerHTML =
                "Follow these simple steps to install Kulzzy Radio on your iPhone or iPad.";

        }


        if (help) {

            help.style.display =
                "block";


            help.innerHTML = `

                <strong>iPhone / iPad:</strong><br><br>

                1. Tap the
                <strong>Share</strong>
                button in Safari.<br><br>

                2. Scroll down and tap
                <strong>Add to Home Screen</strong>.<br><br>

                3. Tap
                <strong>Add</strong>.<br><br>

                Kulzzy Radio will then appear
                on your Home Screen.

            `;

        }


        var button =
            document.getElementById(
                "kulzzyInstallButton"
            );


        if (button) {

            button.innerHTML =
                "📱 HOW TO INSTALL";

        }

    }


    /* =====================================================
       MANUAL INSTALL INSTRUCTIONS
    ===================================================== */

    function showManualInstructions() {

        var message =
            document.getElementById(
                "kulzzyInstallMessage"
            );


        var help =
            document.getElementById(
                "kulzzyInstallHelp"
            );


        if (message) {

            message.innerHTML =
                "Your browser does not allow automatic installation here. Use your browser's Install or Add to Home Screen option.";

        }


        if (help) {

            help.style.display =
                "block";


            if (isAndroid()) {

                help.innerHTML = `

                    <strong>Android:</strong><br><br>

                    Open your browser menu
                    <strong>⋮</strong>
                    and choose
                    <strong>Install app</strong>
                    or
                    <strong>Add to Home screen</strong>.

                `;

            }

            else {

                help.innerHTML = `

                    <strong>Computer:</strong><br><br>

                    Look for the
                    <strong>Install</strong>
                    button in your browser's
                    address bar or browser menu.

                `;

            }

        }

    }


    /* =====================================================
       UPDATE INSTALL SCREEN
    ===================================================== */

    function updateInstallScreen() {

        var button =
            document.getElementById(
                "kulzzyInstallButton"
            );


        if (!button) {
            return;
        }


        /*
         * REAL INSTALL PROMPT AVAILABLE
         */

        if (deferredInstallPrompt) {

            button.innerHTML =
                "📲 INSTALL APP";

            button.style.display =
                "block";

            return;

        }


        /*
         * IOS
         */

        if (isIOSSafari()) {

            button.style.display =
                "block";

            return;

        }


        /*
         * KEEP BUTTON AVAILABLE
         * FOR BROWSERS THAT PROVIDE
         * THEIR OWN INSTALL OPTION
         */

        button.style.display =
            "block";

    }


    /* =====================================================
       APP INSTALLED
    ===================================================== */

    window.addEventListener(
        "appinstalled",
        function () {

            deferredInstallPrompt =
                null;

            closeInstallScreen();

        }
    );


    /* =====================================================
       WHEN PAGE IS READY
    ===================================================== */

    function startInstallSystem() {

        if (isInstalled()) {
            return;
        }


        createInstallScreen();


        /*
         * Give the browser time to
         * provide beforeinstallprompt.
         */

        setTimeout(
            function () {

                updateInstallScreen();

            },
            1000
        );

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            startInstallSystem
        );

    }

    else {

        startInstallSystem();

    }


})();
