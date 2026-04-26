import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Naye plugin ko import karein

// https://vitejs.dev/config/
export default defineConfig({
  // plugins array mein react() aur naya tailwindcss() plugin rakhein
  plugins: [react(), tailwindcss()], 
  server: {
    proxy: {
      '/api/v1': {
         target: 'http://127.0.0.1:3000', // Aapka backend server
        changeOrigin: true,
      },
    }
  }
})
