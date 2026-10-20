# Smart Jigsaw — Admin (โปรเจกต์แยก)

หน้าแอดมิน + backend สำหรับจัดการเว็บไซต์ Smart Jigsaw (เว็บสาธารณะอยู่อีกโปรเจกต์ `smartjigsaw`)
ออกแบบให้ใช้คนละโดเมน เช่น เว็บ `www.smartjigsaw.net` · แอดมิน `admin.jigsawbase.com`

## ทำงานอย่างไร
```
ผู้ดูแล ──► admin.jigsawbase.com  (โปรเจกต์นี้: หน้าแอดมิน + API + เก็บข้อมูลใน data/)
                    ▲
ผู้เข้าชม ─► www.smartjigsaw.net   (เว็บสาธารณะ: static) ── ดึง /api/content และรูป /uploads จากโดเมนแอดมิน
                                                          ── ส่งฟอร์มติดต่อไป /api/contact ของโดเมนแอดมิน
```
- เว็บสาธารณะยังเปิดได้ถ้าโดเมนแอดมินล่ม (ใช้ข้อความเริ่มต้นใน `src/site.ts` ของเว็บนั้น)
- `src/site.ts` ในโปรเจกต์นี้เป็น **สำเนา** ของเว็บสาธารณะ ใช้เป็นค่าเริ่มต้นและไอคอนในฟอร์มแอดมิน — ถ้าเพิ่ม/ลบหมวดข้อมูลในเว็บสาธารณะ ต้องคัดลอกไฟล์มาที่นี่ด้วย (และเพิ่มคีย์ใน `KEYS` ของ `server/index.mjs`)

## รันในเครื่อง
```
npm install
npm run dev      # หน้าแอดมินที่ http://localhost:5173
npm run server   # backend พอร์ต 3001 (เปิดคู่กับ dev)
```
รันแบบ production พอร์ตเดียว: `npm start` แล้วเข้า http://localhost:3001
รหัสผ่านเริ่มต้นสุ่มและพิมพ์ใน terminal ครั้งแรก (หรือตั้ง `ADMIN_PASSWORD` ก่อนรันครั้งแรก) เปลี่ยนได้ในหน้าแอดมิน

## ขึ้นโดเมนจริง (admin.jigsawbase.com)
1. เอาโปรเจกต์ขึ้นเซิร์ฟเวอร์ที่รัน Node ได้ (VPS / Railway / Render ฯลฯ) แล้วรัน `npm start`
2. ตั้ง environment ตาม `.env.example` — **ต้องตั้ง** `PUBLIC_ORIGINS` (โดเมนเว็บสาธารณะ), `TRUST_PROXY=1`, `ADMIN_PASSWORD` และ `VITE_SITE_URL` (ตั้งก่อน build)
3. เปิด HTTPS ที่ reverse proxy แล้วชี้ DNS `admin` → เซิร์ฟเวอร์
4. ใช้ volume/ดิสก์ถาวรสำหรับโฟลเดอร์ `data/` (หรือ `DATA_DIR`) — ถ้าไม่ถาวร เนื้อหาและรูปจะหายเมื่อรีสตาร์ต
5. ฝั่งเว็บสาธารณะ ตั้ง `VITE_API_URL=https://admin.jigsawbase.com` ตอน build

## ข้อมูลและความปลอดภัย
- `data/` เก็บ content.json, รหัสผ่าน (แฮช), คีย์เซ็น session, รูปที่อัปโหลด และข้อความติดต่อ — อยู่ใน .gitignore **ต้อง backup เอง**
- API ที่แก้ข้อมูลต้องล็อกอิน + header `X-Requested-With: admin` (กัน CSRF) · cookie เป็น HttpOnly + SameSite=Strict
- CORS เปิดเฉพาะ origin ใน `PUBLIC_ORIGINS` และเฉพาะ GET เนื้อหา / POST ฟอร์มติดต่อ / อ่านรูป
- ส่ง `X-Robots-Tag: noindex` ทุกหน้า
- ข้อจำกัด: แอดมินคนเดียว (รหัสผ่านเดียว) · ไม่มีประวัติย้อนกลับ · ไม่มีแจ้งเตือนอีเมลเมื่อมีข้อความใหม่
