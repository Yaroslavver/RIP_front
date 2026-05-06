import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({

  server: {
    host: '0.0.0.0',   // слушаем все интерфейсы (и локальный, и ZeroTier)
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // адрес вашего Go-сервера
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },


  plugins: [react()],
});
