import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ตอน npm run dev ให้ส่ง /api และ /uploads ไปที่ backend (npm run server)
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:3001', '/uploads': 'http://localhost:3001' } },
})
