import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    devOptions: { enabled: true },
    // Single-page app fallback for client-side routes
    navigateFallback: '/index.html',
    // Denylist API and asset requests from being redirected
    navigateFallbackDenylist: [/^\/api\//, /^\/_/, /\.[a-zA-Z0-9]{2,4}$/],
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json}']
    },
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
    manifest: {
        name: 'Edu-Guardian',
        short_name: 'Edu-Guardian',
        description: 'Safe. Transparent. Smart. Connect your school community in one platform.',
        theme_color: '#ffffff',
        display: 'fullscreen',
        start_url: '/index.html',
        background_color: '#ffffff',
        icons: [
            {
                src: 'pwa-64x64.png',
                sizes: '64x64',
                type: 'image/png'
            },
            {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: 'maskable-icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
            }
        ],
      }
  })],
})
