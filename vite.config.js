import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true, // 👈 important pour accepter les connexions extérieures
    allowedHosts: ['.ngrok-free.app'], // 👈 accepte tous les sous-domaines ngrok
    port: 8080, // 👈 optionnel si tu veux forcer le port utilisé avec ngrok
  },
})
