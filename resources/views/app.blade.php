<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" href="/qr-hunt-logo.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/build/manifest.webmanifest">

    <title inertia>QR Hunt</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
    @inertiaHead

    <script>
        // if ('serviceWorker' in navigator) {
        //     window.addEventListener('load', () => {
        //         navigator.serviceWorker.register('/sw.js', {
        //             scope: '/'
        //         }).then(
        //             (registration) => {
        //                 console.log("Service worker registration succeeded:", registration);
        //             },
        //             (error) => {
        //                 console.error(`Service worker registration failed: ${error}`);
        //             },
        //         );
        //     })
        // }

        const registerServiceWorker = async () => {
            if ("serviceWorker" in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register("/sw.js", {
                        scope: "/",
                    });
                    if (registration.installing) {
                        console.log("Service worker installing");
                    } else if (registration.waiting) {
                        console.log("Service worker installed");
                    } else if (registration.active) {
                        console.log("Service worker active");
                    }
                } catch (error) {
                    console.error(`Registration failed with ${error}`);
                }
            }
        };

        // …

        registerServiceWorker();
    </script>
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>