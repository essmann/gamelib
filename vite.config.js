import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // <--- This is the crucial fix for Electron file loading
  build: {
    outDir: './backend/dist/', // 👈 output folder for build
  }
})
