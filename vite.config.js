import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  // Local dev serves from "/", but the production build is hosted on
  // GitHub Pages as a project site: https://zodiac6666.github.io/portfolio/
  base: mode === 'production' ? '/portfolio/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Forward API calls to the local PHP server. Using 127.0.0.1 avoids
      // IPv6-only binding issues on Windows (localhost may resolve to ::1).
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
}))
