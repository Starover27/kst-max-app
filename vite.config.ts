import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Разрешаем слушать все сетевые интерфейсы
    allowedHosts: true, // Самая важная строчка: разрешаем доступ по любым доменам (для cloudflared/ngrok)
  }
})