import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'SpendWise',
        short_name: 'SpendWise',
        description: 'Track expenses, borrow/lend money, and share with friends.',
        theme_color: '#007BFF',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        orientation: 'any',
        dir: 'auto',
        lang: 'en-US',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
