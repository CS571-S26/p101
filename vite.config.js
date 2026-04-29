import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/p101/',
  plugins: [react()],
  build: {
    outDir: 'docs',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
