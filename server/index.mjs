// Backend + หน้าแอดมินของเว็บ Smart Jigsaw (โปรเจกต์แยก ใช้โดเมนของตัวเอง เช่น admin.smartjigsaw.com)
// เก็บเนื้อหาที่แอดมินแก้ (JSON), รับอัปโหลดสื่อ, ยืนยันตัวตนแอดมิน, รับข้อความจากฟอร์มติดต่อของเว็บสาธารณะ
// รัน: npm run server  (พอร์ต 3001, ตั้งค่าได้ด้วย PORT) · ข้อมูลทั้งหมดอยู่ในโฟลเดอร์ data/ (ตั้งใหม่ด้วย DATA_DIR)
import express from 'express'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA = path.resolve(process.env.DATA_DIR || path.join(ROOT, 'data'))
const UPLOADS = path.join(DATA, 'uploads')
const DIST = path.join(ROOT, 'dist')
const PORT = Number(process.env.PORT) || 3001
fs.mkdirSync(UPLOADS, { recursive: true })

// ---------- ที่เก็บข้อมูล ----------
const file = n => path.join(DATA, n)
function readJson(name, fallback) {
  try { return JSON.parse(fs.readFileSync(file(name), 'utf8')) } catch { return fallback }
}
function writeJson(name, value) {
  const tmp = file(`${name}.${process.pid}.tmp`)
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2))
  fs.renameSync(tmp, file(name)) // เขียนแบบ atomic กันไฟล์พังเมื่อดับกลางทาง
}

// คีย์เนื้อหาที่อนุญาตให้แอดมินเขียน (ต้องตรงกับ EDITABLE ใน src/site.ts)
const KEYS = new Set(['NAV', 'BRAND', 'SOCIAL', 'HERO', 'HOME', 'VIDEOS', 'ADS', 'COMPANY', 'CUSTOMERS', 'EVENTS', 'NEWS', 'PRODUCTS', 'ARTICLES', 'SERVICES', 'COURSES'])
let content = readJson('content.json', {})

// ---------- รหัสผ่านแอดมิน ----------
const hashPw = (pw, salt) => crypto.scryptSync(pw, salt, 64).toString('hex')
let admin = readJson('admin.json', null)
function setPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex')
  admin = { salt, hash: hashPw(pw, salt) }
  writeJson('admin.json', admin)
}
if (!admin) {
  const pw = process.env.ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url')
  setPassword(pw)
  console.log(`\n[admin] สร้างบัญชีแอดมินแล้ว — รหัสผ่านเริ่มต้น: ${pw}\n        (แสดงครั้งเดียว เปลี่ยนได้ในหน้า /admin)\n`)
}
const checkPassword = pw => {
  const a = Buffer.from(hashPw(String(pw), admin.salt), 'hex')
  return crypto.timingSafeEqual(a, Buffer.from(admin.hash, 'hex'))
}

// ---------- session แบบ cookie ที่เซ็นด้วย HMAC ----------
let secret
try { secret = fs.readFileSync(file('secret.key')) } catch {
  secret = crypto.randomBytes(32)
  fs.writeFileSync(file('secret.key'), secret, { mode: 0o600 })
}
const b64 = b => Buffer.from(b).toString('base64url')
const sign = p => crypto.createHmac('sha256', secret).update(p).digest('base64url')
const SESSION_MS = 12 * 3600 * 1000
function makeToken() {
  const p = b64(JSON.stringify({ exp: Date.now() + SESSION_MS, pwv: admin.hash.slice(0, 8) }))
  return `${p}.${sign(p)}`
}
function validToken(t) {
  if (typeof t !== 'string') return false
  const [p, sig] = t.split('.')
  if (!p || !sig) return false
  const expect = sign(p)
  if (sig.length !== expect.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expect))) return false
  try {
    const d = JSON.parse(Buffer.from(p, 'base64url').toString())
    return d.exp > Date.now() && d.pwv === admin.hash.slice(0, 8) // เปลี่ยนรหัสผ่านแล้ว session เก่าใช้ไม่ได้
  } catch { return false }
}
const cookieOf = req => Object.fromEntries((req.headers.cookie || '').split(';').map(c => c.trim().split(/=(.*)/s).slice(0, 2)).filter(x => x[0]))
const setCookie = (res, req, value, maxAge) => {
  const secure = req.secure || req.headers['x-forwarded-proto'] === 'https' || process.env.COOKIE_SECURE === '1'
  res.setHeader('Set-Cookie', `admin=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${secure ? '; Secure' : ''}`)
}
function requireAuth(req, res, next) {
  if (!validToken(cookieOf(req).admin)) return res.status(401).json({ error: 'unauthorized' })
  // กัน CSRF อีกชั้น: คำสั่งที่แก้ข้อมูลต้องมี header ที่เว็บอื่นส่งข้ามโดเมนไม่ได้
  if (req.method !== 'GET' && req.headers['x-requested-with'] !== 'admin') return res.status(403).json({ error: 'forbidden' })
  next()
}

// ---------- จำกัดอัตราแบบง่าย (ในหน่วยความจำ) ----------
function limiter(max, windowMs) {
  const hits = new Map()
  return (req, res, next) => {
    const now = Date.now(), k = req.ip
    const arr = (hits.get(k) || []).filter(t => now - t < windowMs)
    if (arr.length >= max) return res.status(429).json({ error: 'too_many_requests' })
    arr.push(now); hits.set(k, arr)
    if (hits.size > 5000) for (const [key, v] of hits) if (!v.some(t => now - t < windowMs)) hits.delete(key)
    next()
  }
}

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', process.env.TRUST_PROXY === '1')
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('X-Robots-Tag', 'noindex, nofollow')
  next()
})
const json = express.json({ limit: '2mb' })

// เว็บสาธารณะอยู่คนละโดเมน — อนุญาตเฉพาะ origin ใน PUBLIC_ORIGINS ให้อ่านเนื้อหา/อัปโหลดรูป/ส่งฟอร์มติดต่อ (ไม่ส่ง cookie ข้ามโดเมน)
const ORIGINS = (process.env.PUBLIC_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)
app.use(['/api/content', '/api/contact', '/uploads'], (req, res, next) => {
  const o = req.headers.origin
  if (o && ORIGINS.includes(o)) {
    res.setHeader('Access-Control-Allow-Origin', o)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if (req.method === 'OPTIONS') return res.sendStatus(204)
  }
  next()
})

// ---------- เนื้อหา ----------
// ที่อยู่เว็บสาธารณะ ใช้แสดงตัวอย่าง (preview) ในหน้าแอดมิน — ตั้งด้วย SITE_URL (ถ้าไม่ตั้ง ใช้ origin แรกของ PUBLIC_ORIGINS)
const SITE_URL = (process.env.SITE_URL || ORIGINS[0] || '').replace(/\/$/, '')
app.get('/api/config', (_req, res) => res.json({ siteUrl: SITE_URL }))

app.get('/api/content', (_req, res) => { res.setHeader('Cache-Control', 'no-cache'); res.json(content) })

app.put('/api/content/:key', requireAuth, json, (req, res) => {
  const { key } = req.params
  if (!KEYS.has(key)) return res.status(404).json({ error: 'unknown_key' })
  const v = req.body?.value
  if (v === null || typeof v !== 'object') return res.status(400).json({ error: 'invalid_value' })
  content = { ...content, [key]: v }
  writeJson('content.json', content)
  res.json({ ok: true })
})

app.delete('/api/content/:key', requireAuth, (req, res) => {
  const { key } = req.params
  if (!KEYS.has(key)) return res.status(404).json({ error: 'unknown_key' })
  const { [key]: _removed, ...rest } = content
  content = rest
  writeJson('content.json', content)
  res.json({ ok: true })
})

// ---------- เข้าสู่ระบบ ----------
app.post('/api/login', limiter(8, 15 * 60 * 1000), json, (req, res) => {
  if (!checkPassword(req.body?.password ?? '')) return res.status(401).json({ error: 'bad_password' })
  setCookie(res, req, makeToken(), SESSION_MS / 1000)
  res.json({ ok: true })
})
app.post('/api/logout', (req, res) => { setCookie(res, req, '', 0); res.json({ ok: true }) })
app.get('/api/me', (req, res) => res.json({ admin: validToken(cookieOf(req).admin) }))
app.post('/api/password', requireAuth, json, (req, res) => {
  const { current, next: np } = req.body || {}
  if (!checkPassword(current ?? '')) return res.status(400).json({ error: 'bad_password' })
  if (typeof np !== 'string' || np.length < 10) return res.status(400).json({ error: 'too_short' })
  setPassword(np)
  setCookie(res, req, makeToken(), SESSION_MS / 1000)
  res.json({ ok: true })
})

// ---------- สื่อ (รูป/วิดีโอ) ----------
// ตรวจทั้งนามสกุลและไบต์แรกของไฟล์ — ไม่รับ SVG/HTML เพราะรันสคริปต์ได้
const TYPES = {
  jpg: b => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  jpeg: b => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  png: b => b.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47])),
  gif: b => b.subarray(0, 3).toString() === 'GIF',
  webp: b => b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP',
  mp4: b => b.subarray(4, 8).toString() === 'ftyp',
  webm: b => b.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3])),
}
const IMAGE_EXT = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp'])
const MAX_IMAGE = 8 * 1024 * 1024
const MAX_VIDEO = 200 * 1024 * 1024
const NAME_RE = /^[\w-]{1,80}\.(jpg|jpeg|png|gif|webp|mp4|webm)$/

// วิดีโอใหญ่ จึงสตรีมลงไฟล์ ไม่โหลดทั้งก้อนเข้าหน่วยความจำ
app.post('/api/upload', requireAuth, (req, res) => {
  const orig = String(req.query.name || 'file')
  const ext = path.extname(orig).slice(1).toLowerCase()
  if (!TYPES[ext]) return res.status(400).json({ error: 'unsupported_type' })
  const limit = IMAGE_EXT.has(ext) ? MAX_IMAGE : MAX_VIDEO
  if (Number(req.headers['content-length']) > limit) return res.status(413).json({ error: 'too_large' })

  const base = path.basename(orig, path.extname(orig)).replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'file'
  const name = `${base}-${crypto.randomBytes(4).toString('hex')}.${ext}`
  const dest = path.join(UPLOADS, name)
  const out = fs.createWriteStream(dest, { flags: 'wx' })
  let size = 0, head = Buffer.alloc(0), aborted = false
  const fail = (code, error) => {
    if (aborted) return
    aborted = true
    req.unpipe(out); out.destroy()
    fs.rm(dest, { force: true }, () => { if (!res.headersSent) res.status(code).json({ error }) })
  }
  req.on('data', c => {
    size += c.length
    if (head.length < 16) head = Buffer.concat([head, c]).subarray(0, 16)
    if (size > limit) fail(413, 'too_large')
  })
  req.on('error', () => fail(400, 'upload_failed'))
  req.pipe(out)
  out.on('error', () => fail(500, 'write_failed'))
  out.on('finish', () => {
    if (aborted) return
    if (!size || !TYPES[ext](head)) return fail(400, 'content_mismatch')
    res.json({ url: `/uploads/${name}`, name, size })
  })
})

app.get('/api/media', requireAuth, (_req, res) => {
  const list = fs.readdirSync(UPLOADS).filter(n => NAME_RE.test(n)).map(n => {
    const st = fs.statSync(path.join(UPLOADS, n))
    return { name: n, url: `/uploads/${n}`, size: st.size, time: st.mtimeMs, kind: IMAGE_EXT.has(path.extname(n).slice(1)) ? 'image' : 'video' }
  }).sort((a, b) => b.time - a.time)
  res.json(list)
})
app.delete('/api/media/:name', requireAuth, (req, res) => {
  if (!NAME_RE.test(req.params.name)) return res.status(400).json({ error: 'bad_name' })
  fs.rmSync(path.join(UPLOADS, req.params.name), { force: true })
  res.json({ ok: true })
})
app.use('/uploads', express.static(UPLOADS, { maxAge: '7d', index: false, dotfiles: 'deny' }))

// ---------- ข้อความจากฟอร์มติดต่อ ----------
const clip = (v, n) => String(v ?? '').slice(0, n)
app.post('/api/contact', limiter(5, 10 * 60 * 1000), json, (req, res) => {
  const b = req.body || {}
  if (!clip(b.name, 120).trim() || !clip(b.phone, 40).trim()) return res.status(400).json({ error: 'missing_fields' })
  const msgs = readJson('messages.json', [])
  msgs.unshift({ id: crypto.randomUUID(), time: new Date().toISOString(), name: clip(b.name, 120), company: clip(b.company, 160), phone: clip(b.phone, 40), email: clip(b.email, 160), interest: clip(b.interest, 120), message: clip(b.message, 3000), read: false })
  writeJson('messages.json', msgs.slice(0, 1000))
  res.json({ ok: true })
})
app.get('/api/messages', requireAuth, (_req, res) => res.json(readJson('messages.json', [])))
app.patch('/api/messages/:id', requireAuth, json, (req, res) => {
  const msgs = readJson('messages.json', [])
  const m = msgs.find(x => x.id === req.params.id)
  if (!m) return res.status(404).json({ error: 'not_found' })
  m.read = !!req.body?.read
  writeJson('messages.json', msgs)
  res.json({ ok: true })
})
app.delete('/api/messages/:id', requireAuth, (req, res) => {
  writeJson('messages.json', readJson('messages.json', []).filter(x => x.id !== req.params.id))
  res.json({ ok: true })
})

// ---------- เสิร์ฟเว็บที่ build แล้ว (ใช้ตอน production) ----------
app.use('/api', (_req, res) => res.status(404).json({ error: 'not_found' }))
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST, { index: false, maxAge: '1h' }))
  app.get('*', (_req, res) => { res.setHeader('Cache-Control', 'no-cache'); res.sendFile(path.join(DIST, 'index.html')) })
}

app.use((err, _req, res, _next) => {
  if (err?.type === 'entity.too.large') return res.status(413).json({ error: 'too_large' })
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'bad_json' })
  console.error(err)
  res.status(500).json({ error: 'server_error' })
})

app.listen(PORT, () => console.log(`[server] http://localhost:${PORT}  (ข้อมูล: ${DATA})`))
