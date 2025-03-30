import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // listen on all addresses
    port: 3000,
    strictPort: true, // fail if port is in use
    watch: {
      usePolling: true // needed for some docker setups
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  }
})
