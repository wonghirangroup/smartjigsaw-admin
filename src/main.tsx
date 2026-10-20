import React from 'react'
import ReactDOM from 'react-dom/client'
import Admin from './admin/Admin'
import { applyOverrides } from './site'
import './styles.css'

// ฟอร์มแอดมินต้องแสดงค่าที่บันทึกไว้ (ไม่ใช่ค่าเริ่มต้นในโค้ด) — โหลดมาทับก่อนเริ่มแสดงผล
async function loadContent() {
  try {
    const r = await fetch('/api/content')
    if (r.ok && (r.headers.get('content-type') || '').includes('application/json')) applyOverrides(await r.json())
  } catch { /* ยังไม่ล็อกอิน/เซิร์ฟเวอร์ไม่ตอบ — ใช้ค่าเริ่มต้น */ }
}

loadContent().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Admin />
    </React.StrictMode>,
  )
})
