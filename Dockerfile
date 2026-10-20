# smartjigsaw-admin — build หน้าแอดมิน (Vite) แล้วรันด้วย Express ตัวเดียว (หน้าแอดมิน + API)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
# โดเมนของเว็บสาธารณะ ใช้กับลิงก์ "ดูหน้าเว็บ" ในหน้าแอดมิน (ฝังตอน build)
ARG VITE_SITE_URL=
ENV VITE_SITE_URL=$VITE_SITE_URL
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev --silent
COPY --from=builder /app/dist ./dist
COPY server ./server
# ข้อมูลทั้งหมด (เนื้อหา รหัสผ่าน รูป ข้อความติดต่อ) อยู่ที่ /data — ต้อง mount volume ถาวร
ENV DATA_DIR=/data
VOLUME ["/data"]
EXPOSE 3001
CMD ["node", "server/index.mjs"]
