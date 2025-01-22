import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    build: {
        sourcemap: true,
    },
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
        VitePWA({
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}']
            },
            additionalManifestEntries: [
                { url: '/favicon.ico', revision: `${Date.now()}` }
            ],
            outDir: 'public',
            registerType: 'autoUpdate',
            injectManifest: {
                enableWorkboxModulesLogs: true,
            },
			devOptions: {
				enabled: true
			},
            scope: '/',
            manifest: {
                id: '/',
                scope: '/',
                start_url: '/',
                orientation: 'portrait',
                name: 'QR Hunt',
                short_name: 'QR Hunt',
                description: 'QR Hunt game!',
                theme_color: '#3880ff',
                background: {
                    service_worker: "sw.js"
                },
                icons: [
                    {
                        "src": "/qr-hunt-logo-192.png",
                        "sizes": "192x192",
                        "type": "image/png",
                        "purpose": "maskable any"
                    },
                    {
                        "src": "/qr-hunt-logo-512.png",
                        "sizes": "512x512",
                        "type": "image/png",
                        "purpose": "maskable any"
                    }
                ]
            }
        })
    ],
});
