import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Gunakan classic JSX transform agar komponen tidak perlu `import React`
      // dan agar vitest bisa menjalankan test dengan benar
      jsxRuntime: 'automatic',
    }),
  ],

  // ── Proxy dev: hanya untuk public API yang dipanggil via URL relatif
  //    adminApi.js sudah pakai URL absolut (VITE_API_URL), tidak perlu proxy
  server: {
    port: 5173,
    proxy: {
      '/facilities':   { target: 'http://localhost:8000', changeOrigin: true },
      '/activities':   { target: 'http://localhost:8000', changeOrigin: true },
      '/health':       { target: 'http://localhost:8000', changeOrigin: true },
      '/about':        { target: 'http://localhost:8000', changeOrigin: true },
      '/stats':        { target: 'http://localhost:8000', changeOrigin: true },
      '/news':         { target: 'http://localhost:8000', changeOrigin: true },
      '/hero-slides':  { target: 'http://localhost:8000', changeOrigin: true },
      '/site-content': { target: 'http://localhost:8000', changeOrigin: true },
      '/media':        { target: 'http://localhost:8000', changeOrigin: true },
    },
  },

  // ── Vitest config (Modul 10 — CI testing)
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
})
