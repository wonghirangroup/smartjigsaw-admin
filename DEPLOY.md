# Deploy บน VPS (Docker) — admin.jigsawbase.com

ใช้วิธีเดียวกับระบบ TimeLine: รันเป็น container ด้วย docker compose บน VPS แล้วให้ reverse proxy เปิด HTTPS

## 0) สิ่งที่ต้องมีบน VPS
- Docker + docker compose · git · reverse proxy ที่มีอยู่แล้ว (Nginx หรือ Cloudflare Tunnel)
- พอร์ต `3010` ว่าง (VPS Smart-Jigsaw ใช้ 3001–3003, 4002, 4100, 5000, 8080, 8082 อยู่แล้ว)

## 1) DNS (Namecheap → Advanced DNS)
เพิ่ม record: `A Record` · Host `admin` · Value `<IP ของ VPS>` (ถ้าใช้ Cloudflare Tunnel ให้ตั้งตามที่ Tunnel กำหนดแทน)

## 2) ดึงโค้ดและตั้งค่า
```bash
git clone https://github.com/wonghirangroup/smartjigsaw-admin.git
cd smartjigsaw-admin
cat > .env <<'EOF'
ADMIN_PASSWORD=ตั้งรหัสผ่านยาวๆ
PUBLIC_ORIGINS=https://www.smartjigsaw.com,https://smartjigsaw.com
VITE_SITE_URL=https://www.smartjigsaw.com
EOF
```
`PUBLIC_ORIGINS` ต้องตรงกับโดเมนเว็บสาธารณะเป๊ะ (รวม https และไม่มี / ท้าย) ใส่ได้หลายค่าคั่นด้วยจุลภาค

## 3) รัน
```bash
docker compose build
docker compose up -d
docker compose logs -f admin     # ควรเห็น [server] http://localhost:3001
```
ข้อมูลอยู่ใน volume `admin_data` (เนื้อหา รหัสผ่าน รูป ข้อความติดต่อ) — **ต้อง backup**
```bash
docker run --rm -v smartjigsaw-admin_admin_data:/data -v "$PWD":/backup alpine tar czf /backup/admin-data.tgz -C /data .
```
(ชื่อ volume จริงดูได้จาก `docker volume ls`)

## 4) Nginx (ถ้าใช้ Nginx เป็น reverse proxy)
```nginx
server {
  listen 80;
  server_name admin.jigsawbase.com;
  client_max_body_size 60m;          # อัปโหลดรูป/วิดีโอ
  location / {
    proxy_pass http://127.0.0.1:3010;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```
แล้วออกใบรับรอง HTTPS: `sudo certbot --nginx -d admin.jigsawbase.com`
(ถ้าใช้ Cloudflare Tunnel: ชี้ hostname `admin.jigsawbase.com` → `http://localhost:3010`)

## 5) ฝั่งเว็บสาธารณะ
ตอน build เว็บ `smartjigsaw` ตั้ง `VITE_API_URL=https://admin.jigsawbase.com` (ถ้าเว็บอยู่บน Vercel ให้ตั้งที่ Environment Variables แล้ว redeploy)

## อัปเดตเวอร์ชันครั้งต่อไป
```bash
cd smartjigsaw-admin && git pull && docker compose build && docker compose up -d
```

## ตรวจว่าใช้ได้
- เปิด https://admin.jigsawbase.com → เห็นหน้าล็อกอิน แล้วเข้าด้วย `ADMIN_PASSWORD`
- `curl -I -H "Origin: https://www.smartjigsaw.com" https://admin.jigsawbase.com/api/content` ต้องเห็น `Access-Control-Allow-Origin`
