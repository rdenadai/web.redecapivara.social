import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
        suppressWarnings: true,
      },
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: [
        'favicon.ico',
        'icon-96x96.png',
        'icon-128x128.png',
        'icon-192x192.png',
        'icon-512x512.png',
        'robots.txt',
      ],
      manifest: {
        name: 'Rede Capivara',
        short_name: 'Capivara',
        description: 'BlueSky PDS Client for Rede Capivara',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#ffffff',
        theme_color: '#444444',
        icons: [
          {
            src: 'icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: 'icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: false,
        clientsClaim: false,
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/], // Evita cache de assets do Vite
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot}'],
        globIgnores: ['**/node_modules/**/*', '**/sw.js', '**/workbox-*.js'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // Estratégias de runtime caching
        runtimeCaching: [
          {
            // Cache de navegação (páginas HTML)
            urlPattern: ({ request, url }) => {
              // Ignora hot-reload do Vite
              return request.mode === 'navigate' && !url.pathname.includes('/@')
            },
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 24 horas
              },
              networkTimeoutSeconds: 5,
            },
          },
          {
            // Cache de imagens
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 5 * 24 * 60 * 60, // 5 dias
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache de fontes
            urlPattern: ({ url }) =>
              url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 1 ano
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache de API (com fallback offline)
            urlPattern: ({ url }) => url.pathname.startsWith('/xrpc/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 5 * 60, // 5 minutos
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache de avatares e assets externos
            urlPattern: ({ url }) =>
              url.origin !== self.location.origin &&
              (url.pathname.endsWith('.jpg') ||
                url.pathname.endsWith('.png') ||
                url.pathname.endsWith('.jpeg') ||
                url.pathname.endsWith('.webp')),
            handler: 'CacheFirst',
            options: {
              cacheName: 'external-images-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
