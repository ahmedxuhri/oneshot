import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/oneshot/',
  server: {
    port: 5173,
    proxy: {
      '/oneshot/api': {
        target: 'http://127.0.0.1:3040',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/oneshot\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
