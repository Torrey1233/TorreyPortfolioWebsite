import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    open: false
  },
  // Ensure all routes are handled by index.html for client-side routing
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
})
