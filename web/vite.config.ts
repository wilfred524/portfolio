import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // El frontend nunca conoce la URL del backend: todo pasa por /api.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
