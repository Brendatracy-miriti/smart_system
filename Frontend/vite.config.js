import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    injectRegister: 'auto',
    registerType: 'autoUpdate',
    devOptions: { enabled: true },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json}']
    }
  })],
})
