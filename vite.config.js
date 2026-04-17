import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/charque/',
  server: {
    host: true,
    port: 5173 
  },
  plugins: [
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.svg', 'icons.svg', 'shark-192x192.png', 'shark-512x512.png'],
      manifest: {
        name: 'Charque - Neon Shark Hunt',
        short_name: 'Charque',
        description: 'Um jogo estilo Snake em PWA focado na experiência mobile Cyberpunk',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'shark-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'shark-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});
