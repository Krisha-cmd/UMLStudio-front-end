import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/UMLStudio-front-end/',
  plugins: [react()],
    optimizeDeps: {
    include: ['axios']
  }
})

