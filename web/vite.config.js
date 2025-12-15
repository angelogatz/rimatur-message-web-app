import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Necessário para o Docker mapear a porta
    port: 5173, 
    watch: {
      usePolling: true, // <--- A MÁGICA: Força o Vite a verificar mudanças
    },
  },
})