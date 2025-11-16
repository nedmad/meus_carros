import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //Aqui e o inicio
  build: {
    outDir: "dist",
  },
  server: {
    port: 5173,
    open: true,
  },//Aqui e o final
})
