import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-gsap': ['gsap'],
          'vendor-ogl': ['ogl'],
          'vendor-lenis': ['lenis'],
          'vendor-motion': ['motion'],
          'vendor-misc': ['react-countup', 'react-intersection-observer', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
