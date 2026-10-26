import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, Copy, ExternalLink, Eye, EyeOff, Image as ImageIcon, KeyRound, LogOut, Mail, Monitor, Plus, RotateCw, Smartphone, Tablet, Trash2, Upload, X } from 'lucide-react'
import { EDITABLE, applyOverride, safeUrl } from '../site'
import { FILE_RULES, IMAGE_SPECS, SECTIONS, VIDEO_SPEC, type Field, type Section } from './schema'
import './admin.css'

type Json = any // ข้อมูลฟอร์มเป็นโครงสร้างตาม schema ที่ตรวจตอนรันเท่านั้น

async function api(path: string, opts: { method?: string; body?: unknown; raw?: File } = {}) {
  const r = await fetch(path, {
    method: opts.method ?? (opts.body || opts.raw ? 'POST' : 'GET'),
    headers: { 'X-Requested-With': 'admin', ...(opts.body ? { 'Content-Type': 'application/json' } : {}) },
    body: opts.raw ?? (opts.body ? JSON.stringify(opts.body) : undefined),
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw Object.assign(new Error(data.error || String(r.status)), { status: r.status })
  return data
}

const ERRORS: Record<string, string> = {
  bad_password: 'รหัสผ่านไม่ถูกต้อง', too_many_requests: 'ลองมากเกินไป กรุณารอสักครู่', unsupported_type: 'ไม่รองรับไฟล์ชนิดนี้ (รับ JPG PNG GIF WebP MP4 WebM)',
  too_large: 'ไฟล์ใหญ่เกินกำหนด (รูปไม่เกิน 8MB วิดีโอไม่เกิน 200MB)', content_mismatch: 'เนื้อไฟล์ไม่ตรงกับนามสกุล', too_short: 'รหัสผ่านใหม่ต้องยาวอย่างน้อย 10 ตัวอักษร',
}
const errText = (e: unknown) => ERRORS[(e as Error).message] ?? `เกิดข้อผิดพลาด (${(e as Error).message})`
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v ?? null))

// ---------- Toast ----------
function useToast() {
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null)
  const t = useRef<number>()
  const show = useCallback((text: string, bad = false) => {
    setMsg({ text, bad }); window.clearTimeout(t.current); t.current = window.setTimeout(() => setMsg(null), 4000)
  }, [])
  const node = msg ? <div className={`a-toast${msg.bad ? ' bad' : ''}`} role="status">{msg.text}</div> : null
  return { show, node }
}

// ---------- ตัวเลือกไฟล์จากคลังสื่อ ----------
interface MediaItem { name: string; url: string; size: number; kind: 'image' | 'video' }
const fmtSize = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.ceil(n / 1024)} KB`)

function Picker({ kind, onPick, onClose }: { kind: 'image' | 'video'; onPick: (url: string) => void; onClose: () => void }) {
  const [items, setItems] = useState<MediaItem[] | null>(null)
  useEffect(() => { api('/api/media').then(d => setItems(d.filter((m: MediaItem) => m.kind === kind))).catch(() => setItems([])) }, [kind])
  return (
    <div className="a-modal" role="dialog" aria-modal="true" aria-label="เลือกจากคลังสื่อ" onClick={onClose}>
      <div className="a-modal-box" onClick={e => e.stopPropagation()}>
        <div className="a-row"><h3>เลือกจากคลังสื่อ</h3><button className="a-btn ghost" onClick={onClose} aria-label="ปิด"><X size={16} /></button></div>
        {items === null ? <p>กำลังโหลด…</p> : !items.length ? <p className="a-note">ยังไม่มีไฟล์ในคลัง — อัปโหลดจากช่องของฟิลด์ได้เลย</p> : (
          <div className="a-thumbs">
            {items.map(m => (
              <button key={m.name} className="a-thumb" onClick={() => { onPick(m.url); onClose() }} title={m.name}>
                {m.kind === 'image' ? <img src={m.url} alt={m.name} loading="lazy" /> : <video src={m.url} preload="metadata" muted />}
                <span>{m.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------- ฟิลด์ไฟล์ (รูป/วิดีโอ) ----------
function FileField({ kind, spec, value, onChange, toast }: { kind: 'image' | 'video'; spec?: string; value: string; onChange: (v: string) => void; toast: (t: string, bad?: boolean) => void }) {
  // ช่อง Hero: ขนาดที่แนะนำเปลี่ยนตามรูปแบบ Hero ที่เลือกในธีม (แบนเนอร์เต็มจอ ใช้สัดส่วนกว้าง)
  const hs = (EDITABLE.THEME as { heroStyle?: string } | undefined)?.heroStyle
  const key = spec === 'hero' ? (hs === 'banner' ? 'heroBanner' : hs === 'poster' ? 'heroPoster' : 'hero') : spec
  const sp = key ? IMAGE_SPECS[key] : undefined
  const [busy, setBusy] = useState(false)
  const [pick, setPick] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const upload = async (f: File) => {
    setBusy(true)
    try {
      const r = await api(`/api/upload?name=${encodeURIComponent(f.name)}`, { raw: f })
      onChange(r.url)
      if (sp && kind === 'image') {
        // เตือนเมื่อภาพเล็กกว่าที่ต้องการมาก (จะเบลอบนจอ Retina) หรือสัดส่วนต่างจากกรอบ
        const img = new Image()
        img.onload = () => {
          const dim = `${img.naturalWidth}×${img.naturalHeight}px`
          if (img.naturalWidth < sp.w * 0.6) toast(`อัปโหลดแล้ว แต่ภาพเล็กไป (${dim}) — แนะนำ ${sp.w}×${sp.h}px`, true)
          else if (Math.abs(img.naturalWidth / img.naturalHeight - sp.w / sp.h) / (sp.w / sp.h) > 0.25) toast(`อัปโหลดแล้ว แต่สัดส่วนต่างจากกรอบ (${dim}) ภาพจะถูกครอป — แนะนำ ${sp.w}×${sp.h}px`, true)
          else toast('อัปโหลดแล้ว')
        }
        img.src = r.url
      } else toast('อัปโหลดแล้ว')
    } catch (e) { toast(errText(e), true) } finally { setBusy(false); if (input.current) input.current.value = '' }
  }
  const src = safeUrl(value)
  return (
    <div className="a-file">
      {src && (kind === 'image' ? <img className="a-preview" src={src} alt="ตัวอย่างภาพ" /> : <video className="a-preview" src={src} controls preload="metadata" />)}
      <div className="a-row">
        <input value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={kind === 'image' ? '/uploads/… หรือ https://…' : '/uploads/….mp4'} aria-label="ที่อยู่ไฟล์" />
      </div>
      <div className="a-row wrap">
        <input ref={input} type="file" hidden accept={kind === 'image' ? 'image/jpeg,image/png,image/gif,image/webp' : 'video/mp4,video/webm'} onChange={e => e.target.files?.[0] && upload(e.target.files[0])} />
        <button type="button" className="a-btn" disabled={busy} onClick={() => input.current?.click()}><Upload size={15} />{busy ? 'กำลังอัปโหลด…' : 'อัปโหลดไฟล์'}</button>
        <button type="button" className="a-btn ghost" onClick={() => setPick(true)}><ImageIcon size={15} />เลือกจากคลัง</button>
        {value && <button type="button" className="a-btn ghost" onClick={() => onChange('')}><X size={15} />เอาออก</button>}
      </div>
      {sp && <p className="a-spec"><b>ขนาดที่ควรทำ: {sp.w}×{sp.h} px</b> ({sp.formats}) · <button type="button" className="a-linkbtn" onClick={() => document.dispatchEvent(new CustomEvent('admin-guide'))}>ดูรายละเอียด</button></p>}
      {kind === 'video' && <p className="a-spec"><b>ขนาดที่ควรทำ: {VIDEO_SPEC.w}×{VIDEO_SPEC.h} px</b> · {VIDEO_SPEC.note}</p>}
      {pick && <Picker kind={kind} onPick={onChange} onClose={() => setPick(false)} />}
    </div>
  )
}

// ---------- ตัวแก้ฟิลด์ (เรียกซ้ำสำหรับ list) ----------
function FieldEditor({ f, value, onChange, toast }: { f: Field; value: Json; onChange: (v: Json) => void; toast: (t: string, bad?: boolean) => void }) {
  const id = useRef(`f${Math.random().toString(36).slice(2)}`).current
  let control: ReactNode
  switch (f.type) {
    case 'textarea': control = <textarea id={id} rows={3} value={value ?? ''} onChange={e => onChange(e.target.value)} />; break
    case 'range': control = (
      <div className="a-row">
        <input id={id} type="range" min={f.min} max={f.max} step={f.step ?? 1} value={value ?? f.def ?? f.min} onChange={e => onChange(Number(e.target.value))} style={{ flex: 1, padding: 0 }} />
        <b className="a-size" style={{ minWidth: 64, textAlign: 'right' }}>{value ?? f.def ?? f.min}{f.unit}</b>
      </div>); break
    case 'number': control = <input id={id} type="number" min={0} value={value ?? 0} onChange={e => onChange(Number(e.target.value))} />; break
    case 'color': control = (
      <div className="a-row">
        <input id={id} type="color" value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#0e7c86'} onChange={e => onChange(e.target.value)} className="a-color" />
        <input value={value ?? ''} onChange={e => onChange(e.target.value)} aria-label={`${f.label} (รหัสสี)`} maxLength={9} />
      </div>); break
    case 'select': control = <select id={id} value={value ?? ''} onChange={e => onChange(e.target.value)}>{f.options!().map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>; break
    case 'image': case 'video': control = <FileField kind={f.type} spec={f.spec} value={value ?? ''} onChange={onChange} toast={toast} />; break
    case 'strings': {
      const arr: string[] = Array.isArray(value) ? value : []
      const set = (i: number, v: string) => onChange(arr.map((x, j) => (j === i ? v : x)))
      control = (
        <div className="a-stack">
          {arr.map((s, i) => (
            <div key={i} className="a-row top">
              {f.multiline ? <textarea rows={3} value={s} onChange={e => set(i, e.target.value)} aria-label={`${f.label} ${i + 1}`} /> : <input value={s} onChange={e => set(i, e.target.value)} aria-label={`${f.label} ${i + 1}`} />}
              <button type="button" className="a-btn ghost" aria-label="ลบรายการ" onClick={() => onChange(arr.filter((_, j) => j !== i))}><Trash2 size={15} /></button>
            </div>
          ))}
          <button type="button" className="a-btn ghost" onClick={() => onChange([...arr, ''])}><Plus size={15} />เพิ่ม</button>
        </div>)
      break
    }
    case 'list': control = <ListEditor fields={f.fields!} titleKey={f.titleKey} blank={f.blank!} value={value} onChange={onChange} toast={toast} nested />; break
    default: control = <input id={id} value={value ?? ''} onChange={e => onChange(e.target.value)} />
  }
  const Wrap = f.type === 'text' || f.type === 'textarea' || f.type === 'number' || f.type === 'select' || f.type === 'color' ? 'label' : 'div'
  return (
    <Wrap className="a-field" {...(Wrap === 'label' ? {} : { role: 'group', 'aria-label': f.label })}>
      <span className="a-label">{f.label}</span>
      {control}
      {f.help && <span className="a-note">{f.help}</span>}
    </Wrap>
  )
}

function ObjectFields({ fields, value, onChange, toast }: { fields: Field[]; value: Json; onChange: (v: Json) => void; toast: (t: string, bad?: boolean) => void }) {
  return <>{fields.map(f => <FieldEditor key={f.key} f={f} value={value?.[f.key]} onChange={v => onChange({ ...value, [f.key]: v })} toast={toast} />)}</>
}

function ListEditor({ fields, titleKey, blank, value, onChange, toast, fixed, nested, focus, onOpen }: {
  fields: Field[]; titleKey?: string; blank?: () => Record<string, unknown>; value: Json; onChange: (v: Json) => void; toast: (t: string, bad?: boolean) => void; fixed?: boolean; nested?: boolean; focus?: Focus | null; onOpen?: (i: number | null) => void
}) {
  const items: Json[] = Array.isArray(value) ? value : []
  const [open, setOpen] = useState<number | null>(nested ? null : (focus?.index ?? 0))
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => { if (!nested) onOpen?.(open) }, [open]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (nested || focus?.index == null) return
    setOpen(focus.index)
    window.setTimeout(() => root.current?.querySelector('.a-item.open')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60)
  }, [focus?.tick]) // eslint-disable-line react-hooks/exhaustive-deps
  const move = (i: number, d: number) => {
    const j = i + d; if (j < 0 || j >= items.length) return
    const c = [...items]; [c[i], c[j]] = [c[j], c[i]]; onChange(c); setOpen(j)
  }
  return (
    <div className="a-stack" ref={root}>
      {items.map((it, i) => {
        const title = String(it?.[titleKey ?? ''] ?? '').trim() || `รายการที่ ${i + 1}`
        const isOpen = open === i
        return (
          <div key={i} className={`a-item${isOpen ? ' open' : ''}`}>
            <div className="a-item-head">
              <button type="button" className="a-item-title" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}><b>{i + 1}.</b> {title}</button>
              {!fixed && (
                <div className="a-row">
                  <button type="button" className="a-btn ghost" aria-label="เลื่อนขึ้น" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp size={15} /></button>
                  <button type="button" className="a-btn ghost" aria-label="เลื่อนลง" disabled={i === items.length - 1} onClick={() => move(i, 1)}><ArrowDown size={15} /></button>
                  <button type="button" className="a-btn ghost" aria-label="ทำสำเนา" onClick={() => { const c = [...items]; c.splice(i + 1, 0, clone(it)); onChange(c); setOpen(i + 1) }}><Copy size={15} /></button>
                  <button type="button" className="a-btn ghost danger" aria-label="ลบรายการ" onClick={() => { if (confirm(`ลบ "${title}" ?`)) { onChange(items.filter((_, j) => j !== i)); setOpen(null) } }}><Trash2 size={15} /></button>
                </div>
              )}
            </div>
            {isOpen && <div className="a-item-body"><ObjectFields fields={fields} value={it} onChange={v => onChange(items.map((x, j) => (j === i ? v : x)))} toast={toast} /></div>}
          </div>
        )
      })}
      {!fixed && blank && <button type="button" className="a-btn" onClick={() => { onChange([...items, blank()]); setOpen(items.length) }}><Plus size={15} />เพิ่มรายการ</button>}
    </div>
  )
}

// ---------- ชุดสีสำเร็จรูป + ตรวจคอนทราสต์ (หมวดธีม) ----------
const LIGHT = { surface: '#ffffff', onPrimary: '#ffffff', buttonShape: 'rounded', heroStyle: 'split', heroColor: '', bodyWeight: 400, textScale: 100, headScale: 100 }
const PRESETS: { name: string; v: Record<string, string | number> }[] = [
  { name: 'Smart Jigsaw (เริ่มต้น)', v: { ...LIGHT, primary: '#1369d5', primaryInk: '#0d52ad', accent: '#e0641f', ink: '#0b1e36', ink2: '#44546f', ground: '#f5f7fa', text: '#0b1e36', fontHead: 'Kanit', fontBody: 'Kanit', radius: 14 } },
  { name: 'Digital Navy (กรมท่าเข้ม + ส้ม)', v: { heroColor: '', primary: '#ff9f2e', primaryInk: '#ffc27a', accent: '#ff9f2e', ink: '#070b1c', ink2: '#d5dcf2', ground: '#0c1330', surface: '#20306f', text: '#ffffff', onPrimary: '#0c1330', buttonShape: 'pill', heroStyle: 'banner', fontHead: 'Prompt', fontBody: 'Noto Sans Thai', bodyWeight: 500, textScale: 105, headScale: 105, radius: 22 } },
  { name: 'ครีมอุ่น + ส้มอิฐ (อบอุ่น เป็นกันเอง)', v: { ...LIGHT, heroColor: '#7c2d12', primary: '#c2410c', primaryInk: '#9a3412', accent: '#c2410c', ink: '#2b1b12', ink2: '#6b5748', ground: '#fbf6ee', text: '#2b1b12', buttonShape: 'pill', fontHead: 'Athiti', fontBody: 'Sarabun', radius: 20, textScale: 105 } },
  { name: 'เขียวมินต์สดชื่น (สะอาด ทันสมัย)', v: { ...LIGHT, heroColor: '#0b6b5a', primary: '#0b7a63', primaryInk: '#075e4c', accent: '#c2410c', ink: '#0b3b36', ink2: '#3f6660', ground: '#f2faf7', text: '#0f2e2a', fontHead: 'Prompt', fontBody: 'Sarabun', radius: 18 } },
  { name: 'ม่วงเที่ยงคืน + ฟ้านีออน (AI / เทค)', v: { heroColor: '#4c2fc4', primary: '#22d3ee', primaryInk: '#67e8f9', accent: '#22d3ee', ink: '#08061a', ink2: '#cfc9f0', ground: '#0e0b24', surface: '#1c1740', text: '#ffffff', onPrimary: '#0e0b24', buttonShape: 'pill', heroStyle: 'banner', fontHead: 'Prompt', fontBody: 'Noto Sans Thai', bodyWeight: 500, radius: 22, textScale: 105, headScale: 105 } },
  { name: 'เทาถ่าน + เขียวมะนาว (คม เท่ สมัยใหม่)', v: { heroColor: '#2a323d', primary: '#a3e635', primaryInk: '#bef264', accent: '#a3e635', ink: '#0a0c0f', ink2: '#b8c0ca', ground: '#111418', surface: '#1d2229', text: '#f3f5f7', onPrimary: '#111418', buttonShape: 'rounded', heroStyle: 'banner', fontHead: 'Kanit', fontBody: 'Noto Sans Thai', bodyWeight: 500, radius: 8, textScale: 105 } },
  { name: 'เขียวน้ำเงิน', v: { ...LIGHT, primary: '#0e7c86', primaryInk: '#0a5d65', accent: '#e0641f', ink: '#0f1f3d', ink2: '#44546f', ground: '#f5f7fa', text: '#0f1f3d' } },
  { name: 'ม่วงอบอุ่น', v: { ...LIGHT, primary: '#7a4dcb', primaryInk: '#5b35a0', accent: '#d97706', ink: '#1f1235', ink2: '#4b4560', ground: '#f7f5fb', text: '#1f1235' } },
  { name: 'ส้มสดใส', v: { ...LIGHT, primary: '#d4560f', primaryInk: '#a8420a', accent: '#1369d5', ink: '#2a1608', ink2: '#5c4636', ground: '#fbf7f3', text: '#2a1608' } },
]
const lum = (hex: string) => {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const contrast = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
const isHex = (v: unknown): v is string => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v)

function ThemeExtras({ value, onChange }: { value: Json; onChange: (v: Json) => void }) {
  const checks: [string, string, string][] = [
    ['ตัวอักษรบนปุ่มสีหลัก', value?.onPrimary, value?.primary],
    ['ตัวอักษรบนปุ่มสีเน้น', value?.onPrimary, value?.accent],
    ['ตัวอักษรเนื้อความบนพื้นหลังเว็บ', value?.text, value?.ground],
    ['ตัวอักษรเนื้อความบนการ์ด', value?.text, value?.surface],
    ['ข้อความรองบนการ์ด', value?.ink2, value?.surface],
    ['สีหลักเมื่อเป็นลิงก์บนพื้นหลังเว็บ', value?.primaryInk, value?.ground],
  ]
  return (
    <div className="a-card a-stack" style={{ marginTop: 16 }}>
      <b>ชุดสีสำเร็จรูป</b>
      <div className="a-row wrap">
        {PRESETS.map(p => <button key={p.name} type="button" className="a-btn" onClick={() => onChange({ ...value, ...p.v })}>{p.name}</button>)}
      </div>
      <b>ตรวจความอ่านง่าย (ควรได้ 4.5 ขึ้นไป)</b>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {checks.map(([label, fg, bg]) => {
          if (!isHex(fg) || !isHex(bg)) return null
          const r = contrast(fg, bg)
          return <li key={label} style={{ color: r >= 4.5 ? 'inherit' : '#b42318' }}>{label}: <b>{r.toFixed(1)}</b> {r >= 4.5 ? '✓ ผ่าน' : '⚠ อ่านยาก ลองปรับสีให้ต่างกันมากขึ้น'}</li>
        })}
      </ul>
    </div>
  )
}

// ---------- แก้เนื้อหาหนึ่งหมวด ----------
const liveValue = (s: Section) => {
  const v = clone(EDITABLE[s.key])
  return s.key === 'PRODUCTS' ? (v as Json[]).map(({ icon: _i, ...rest }) => rest) : v
}

function validate(s: Section, v: Json): string | null {
  if (s.key === 'ARTICLES') {
    const slugs = (v as Json[]).map(a => a.slug)
    if (slugs.some(x => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(x || ''))) return 'ชื่อในลิงก์ของบทความต้องเป็นภาษาอังกฤษตัวเล็ก ตัวเลข และ - เท่านั้น'
    if (new Set(slugs).size !== slugs.length) return 'ชื่อในลิงก์ของบทความซ้ำกัน'
  }
  if (s.key === 'COURSES' && new Set((v as Json[]).map(c => c.id)).size !== v.length) return 'รหัสหลักสูตรซ้ำกัน'
  return null
}

function SectionEditor({ section, toast, onDraft, focus, onView }: { section: Section; toast: (t: string, bad?: boolean) => void; onDraft: (key: string, value: Json) => void; focus: Focus | null; onView: (key: string, index: number | null) => void }) {
  const [value, setValue] = useState<Json>(() => liveValue(section))
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const dirtyRef = useRef(false)
  dirtyRef.current = dirty
  // เปิดหมวดนี้ → ล็อกตัวอย่างไปที่ส่วนนี้ (ฟอร์มแบบรายการจะแจ้งรายการที่เปิดเองผ่าน onOpen)
  useEffect(() => { if (section.kind !== 'list') onView(section.key, null) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // ทุกครั้งที่แก้ฟอร์ม ส่งร่างไปแสดงในหน้า preview ทันที (ยังไม่บันทึกจริง)
  const change = (v: Json) => { setValue(v); setDirty(true); onDraft(section.key, v) }
  // ออกจากหมวดโดยไม่บันทึก → คืนหน้า preview เป็นค่าที่บันทึกไว้
  useEffect(() => () => { if (dirtyRef.current) onDraft(section.key, liveValue(section)) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault() }
    window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const save = async () => {
    const problem = validate(section, value)
    if (problem) return toast(problem, true)
    setSaving(true)
    try {
      await api(`/api/content/${section.key}`, { method: 'PUT', body: { value } })
      applyOverride(section.key, clone(value)); setDirty(false); toast('บันทึกแล้ว — หน้าเว็บแสดงผลใหม่ทันที')
    } catch (e) { toast(errText(e), true) } finally { setSaving(false) }
  }
  const reset = async () => {
    if (!confirm('คืนค่าหมวดนี้เป็นค่าเริ่มต้นจากโค้ด? การแก้ไขที่บันทึกไว้จะหายไป')) return
    try { await api(`/api/content/${section.key}`, { method: 'DELETE' }); toast('คืนค่าเริ่มต้นแล้ว กำลังโหลดใหม่…'); setTimeout(() => location.reload(), 700) } catch (e) { toast(errText(e), true) }
  }

  return (
    <section>
      <div className="a-row between">
        <h2>{section.label}</h2>
        <div className="a-row">
          <button className="a-btn ghost" onClick={reset}>คืนค่าเริ่มต้น</button>
          <button className="a-btn primary" disabled={!dirty || saving} onClick={save}>{saving ? 'กำลังบันทึก…' : dirty ? 'บันทึก' : 'บันทึกแล้ว'}</button>
        </div>
      </div>
      {section.help && <p className="a-note">{section.help}</p>}
      <div className="a-card">
        {section.kind === 'object'
          ? <ObjectFields fields={section.fields} value={value} onChange={change} toast={toast} />
          : <ListEditor fields={section.fields} titleKey={section.titleKey} blank={section.blank} value={value} onChange={change} toast={toast} fixed={section.fixed} focus={focus} onOpen={i => onView(section.key, i)} />}
      </div>
      {section.key === 'THEME' && <ThemeExtras value={value} onChange={change} />}
    </section>
  )
}

// ---------- คลังสื่อ ----------
function Library({ toast }: { toast: (t: string, bad?: boolean) => void }) {
  const [items, setItems] = useState<MediaItem[] | null>(null)
  const [busy, setBusy] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const load = useCallback(() => { api('/api/media').then(setItems).catch(e => toast(errText(e), true)) }, [toast])
  useEffect(load, [load])
  const upload = async (files: FileList) => {
    setBusy(true)
    for (const f of Array.from(files)) {
      try { await api(`/api/upload?name=${encodeURIComponent(f.name)}`, { raw: f }) } catch (e) { toast(`${f.name}: ${errText(e)}`, true) }
    }
    setBusy(false); if (input.current) input.current.value = ''; load()
  }
  return (
    <section>
      <div className="a-row between"><h2>คลังสื่อ</h2>
        <div>
          <input ref={input} type="file" hidden multiple accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm" onChange={e => e.target.files && upload(e.target.files)} />
          <button className="a-btn primary" disabled={busy} onClick={() => input.current?.click()}><Upload size={15} />{busy ? 'กำลังอัปโหลด…' : 'อัปโหลดไฟล์'}</button>
        </div>
      </div>
      <p className="a-note">รูป JPG/PNG/GIF/WebP ไม่เกิน 8MB · วิดีโอ MP4/WebM ไม่เกิน 200MB · คัดลอกที่อยู่ไฟล์ไปวางในฟิลด์ใดก็ได้ หรือใช้ปุ่ม "เลือกจากคลัง" ในฟอร์ม</p>
      {items === null ? <p>กำลังโหลด…</p> : !items.length ? <div className="a-card">ยังไม่มีไฟล์</div> : (
        <div className="a-thumbs big">
          {items.map(m => (
            <div key={m.name} className="a-thumb static">
              {m.kind === 'image' ? <img src={m.url} alt={m.name} loading="lazy" /> : <video src={m.url} preload="metadata" controls />}
              <span title={m.name}>{m.name} · {fmtSize(m.size)}</span>
              <div className="a-row">
                <button className="a-btn ghost" onClick={() => navigator.clipboard?.writeText(m.url).then(() => toast('คัดลอกที่อยู่แล้ว'))}><Copy size={14} />คัดลอกที่อยู่</button>
                <button className="a-btn ghost danger" aria-label={`ลบ ${m.name}`} onClick={async () => { if (confirm(`ลบ ${m.name}? หากมีหน้าที่ใช้ไฟล์นี้อยู่ รูปจะหาย`)) { await api(`/api/media/${m.name}`, { method: 'DELETE' }).catch(e => toast(errText(e), true)); load() } }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// ---------- คู่มือขนาดภาพสำหรับฝ่ายออกแบบ ----------
function Guide() {
  return (
    <section>
      <div className="a-row between"><h2>คู่มือขนาดภาพและวิดีโอ</h2><button className="a-btn" onClick={() => window.print()}>พิมพ์ / บันทึกเป็น PDF ส่งฝ่ายออกแบบ</button></div>
      <p className="a-note">{FILE_RULES}. ขนาดด้านล่างคำนวณเผื่อจอ Retina (2 เท่าของที่แสดงจริง) ทำใหญ่กว่านี้ได้แต่ต้องรักษาสัดส่วน</p>
      {Object.values(IMAGE_SPECS).map(sp => (
        <article key={sp.label} className="a-card">
          <div className="a-row between"><h3 style={{ margin: 0 }}>{sp.label}</h3><b className="a-size">{sp.w} × {sp.h} px</b></div>
          <p className="a-note">{sp.where} · {sp.shown} · ไฟล์: {sp.formats}</p>
          <div className="a-ratio" style={{ aspectRatio: `${sp.w} / ${sp.h}`, maxWidth: sp.w / sp.h > 2 ? 520 : 300 }}>{sp.w}×{sp.h}</div>
          <ul>{sp.tips.map(t => <li key={t}>{t}</li>)}</ul>
        </article>
      ))}
      <article className="a-card">
        <div className="a-row between"><h3 style={{ margin: 0 }}>ไฟล์วิดีโอ</h3><b className="a-size">{VIDEO_SPEC.w} × {VIDEO_SPEC.h} px</b></div>
        <p className="a-note">{VIDEO_SPEC.note}</p>
      </article>
    </section>
  )
}

// ---------- ข้อความจากฟอร์มติดต่อ ----------
interface Msg { id: string; time: string; name: string; company: string; phone: string; email: string; interest: string; message: string; read: boolean }
function Messages({ toast }: { toast: (t: string, bad?: boolean) => void }) {
  const [list, setList] = useState<Msg[] | null>(null)
  const load = useCallback(() => { api('/api/messages').then(setList).catch(e => toast(errText(e), true)) }, [toast])
  useEffect(load, [load])
  return (
    <section>
      <h2>ข้อความจากฟอร์มติดต่อ</h2>
      {list === null ? <p>กำลังโหลด…</p> : !list.length ? <div className="a-card">ยังไม่มีข้อความ</div> : list.map(m => (
        <article key={m.id} className={`a-card msg${m.read ? '' : ' unread'}`}>
          <div className="a-row between">
            <b>{m.name}{m.company && ` · ${m.company}`}</b>
            <span className="a-note">{new Date(m.time).toLocaleString('th-TH')}</span>
          </div>
          <p className="a-note">โทร {m.phone}{m.email && ` · ${m.email}`}{m.interest && ` · สนใจ: ${m.interest}`}</p>
          {m.message && <p style={{ whiteSpace: 'pre-wrap' }}>{m.message}</p>}
          <div className="a-row">
            <button className="a-btn ghost" onClick={async () => { await api(`/api/messages/${m.id}`, { method: 'PATCH', body: { read: !m.read } }); load() }}>{m.read ? 'ทำเครื่องหมายยังไม่อ่าน' : 'อ่านแล้ว'}</button>
            <button className="a-btn ghost danger" onClick={async () => { if (confirm('ลบข้อความนี้?')) { await api(`/api/messages/${m.id}`, { method: 'DELETE' }); load() } }}><Trash2 size={14} />ลบ</button>
          </div>
        </article>
      ))}
    </section>
  )
}

function Password({ toast }: { toast: (t: string, bad?: boolean) => void }) {
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    if (f.get('next') !== f.get('again')) return toast('รหัสผ่านใหม่ทั้งสองช่องไม่ตรงกัน', true)
    try { await api('/api/password', { body: { current: f.get('current'), next: f.get('next') } }); toast('เปลี่ยนรหัสผ่านแล้ว'); e.currentTarget.reset() } catch (err) { toast(errText(err), true) }
  }
  return (
    <section>
      <h2>เปลี่ยนรหัสผ่าน</h2>
      <form className="a-card a-stack" onSubmit={submit} style={{ maxWidth: 420 }}>
        <label className="a-field"><span className="a-label">รหัสผ่านปัจจุบัน</span><input name="current" type="password" required autoComplete="current-password" /></label>
        <label className="a-field"><span className="a-label">รหัสผ่านใหม่ (อย่างน้อย 10 ตัวอักษร)</span><input name="next" type="password" required minLength={10} autoComplete="new-password" /></label>
        <label className="a-field"><span className="a-label">ยืนยันรหัสผ่านใหม่</span><input name="again" type="password" required minLength={10} autoComplete="new-password" /></label>
        <button className="a-btn primary" type="submit">เปลี่ยนรหัสผ่าน</button>
      </form>
    </section>
  )
}

// ---------- ตัวอย่างหน้าเว็บ (Preview) ----------
interface Focus { key: string; index: number | null; tick: number }
const PAGES: [string, string][] = [['/', 'หน้าแรก'], ['/products', 'บริการ'], ['/services', 'วิธีทำงาน'], ['/about', 'เกี่ยวกับเรา'], ['/knowledge', 'ศูนย์ความรู้'], ['/customers', 'ลูกค้า'], ['/contact', 'ติดต่อเรา']]

function Preview({ siteUrl, frame, path, onClose }: { siteUrl: string; frame: React.RefObject<HTMLIFrameElement>; path: string; onClose: () => void }) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [size, setSize] = useState({ w: 600, h: 700 })
  const box = useRef<HTMLDivElement>(null)
  const origin = new URL(siteUrl).origin
  useEffect(() => {
    const el = box.current; if (!el) return
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el); setSize({ w: el.clientWidth, h: el.clientHeight }); return () => ro.disconnect()
  }, [])
  const design = device === 'desktop' ? 1280 : device === 'tablet' ? 768 : 390
  const scale = Math.min(1, size.w / design)
  const goto = (p: string) => frame.current?.contentWindow?.postMessage({ type: 'sj-goto', path: p }, origin)
  return (
    <aside className="a-preview-pane" aria-label="ตัวอย่างหน้าเว็บ">
      <div className="a-preview-bar">
        <b>ตัวอย่างหน้าเว็บ</b>
        <select value={PAGES.some(p => p[0] === path) ? path : ''} onChange={e => goto(e.target.value)} aria-label="เลือกหน้าที่จะดู">
          {!PAGES.some(p => p[0] === path) && <option value="">{path}</option>}
          {PAGES.map(([p, l]) => <option key={p} value={p}>{l}</option>)}
        </select>
        <div className="a-row">
          <button className={`a-btn ghost${device === 'desktop' ? ' on' : ''}`} onClick={() => setDevice('desktop')} aria-label="มุมมองคอมพิวเตอร์" title="คอมพิวเตอร์"><Monitor size={15} /></button>
          <button className={`a-btn ghost${device === 'tablet' ? ' on' : ''}`} onClick={() => setDevice('tablet')} aria-label="มุมมองแท็บเล็ต" title="แท็บเล็ต"><Tablet size={15} /></button>
          <button className={`a-btn ghost${device === 'mobile' ? ' on' : ''}`} onClick={() => setDevice('mobile')} aria-label="มุมมองมือถือ" title="มือถือ"><Smartphone size={15} /></button>
          <button className="a-btn ghost" onClick={() => { if (frame.current) frame.current.src = frame.current.src }} aria-label="โหลดตัวอย่างใหม่" title="โหลดใหม่"><RotateCw size={15} /></button>
          <button className="a-btn ghost close" onClick={onClose} aria-label="ซ่อนตัวอย่าง"><EyeOff size={15} /></button>
        </div>
      </div>
      <p className="a-note a-preview-hint">คลิกส่วนใดของเว็บเพื่อไปแก้ที่ฟอร์มนั้น · สิ่งที่พิมพ์จะขึ้นในตัวอย่างทันที แต่จะแสดงจริงบนเว็บเมื่อกด “บันทึก”</p>
      <div className="a-preview-box" ref={box}>
        <iframe ref={frame} title="ตัวอย่างหน้าเว็บ" src={`${siteUrl}/?sj-preview=1`}
          style={{ width: design, height: size.h / scale, transform: `scale(${scale})`, marginInline: device !== 'desktop' ? 'auto' : 0, left: device !== 'desktop' ? Math.max(0, (size.w - design * scale) / 2) : 0 }} />
      </div>
    </aside>
  )
}

// ---------- เข้าสู่ระบบ + โครงหน้า ----------
function Login({ onDone }: { onDone: () => void }) {
  const [err, setErr] = useState('')
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setErr('')
    try { await api('/api/login', { body: { password: new FormData(e.currentTarget).get('password') } }); onDone() } catch (x) { setErr(errText(x)) }
  }
  return (
    <div className="a-login">
      <form className="a-card a-stack" onSubmit={submit}>
        <h1><KeyRound size={22} /> เข้าสู่ระบบแอดมิน</h1>
        <label className="a-field"><span className="a-label">รหัสผ่าน</span><input name="password" type="password" required autoFocus autoComplete="current-password" /></label>
        {err && <div className="a-err" role="alert">{err}</div>}
        <button className="a-btn primary" type="submit">เข้าสู่ระบบ</button>
        <p className="a-note">รหัสผ่านตั้งโดยผู้ดูแลระบบ (ตัวแปร ADMIN_PASSWORD บนเซิร์ฟเวอร์)</p>
      </form>
    </div>
  )
}

export default function Admin() {
  const [auth, setAuth] = useState<'loading' | 'out' | 'in' | 'down'>('loading')
  const [tab, setTab] = useState<string>(SECTIONS[0].key)
  const { show, node } = useToast()
  const [siteUrl, setSiteUrl] = useState('')
  const [showPreview, setShowPreview] = useState(() => window.innerWidth >= 1180)
  const [focus, setFocus] = useState<Focus | null>(null)
  const [pvPath, setPvPath] = useState('/')
  const frame = useRef<HTMLIFrameElement>(null)
  const drafts = useRef(new Map<string, Json>())
  const siteOrigin = (() => { try { return siteUrl ? new URL(siteUrl).origin : '' } catch { return '' } })()
  const toFrame = useCallback((msg: unknown) => {
    if (siteOrigin) frame.current?.contentWindow?.postMessage(msg, siteOrigin)
  }, [siteOrigin])
  const sendDraft = useCallback((key: string, value: Json) => {
    if (!siteOrigin) return
    frame.current?.contentWindow?.postMessage({ type: 'sj-preview', key, value: clone(value) }, siteOrigin)
  }, [siteOrigin])
  // ล็อกตัวอย่างไปที่ส่วนที่กำลังแก้ (หน่วงเล็กน้อยกันส่งถี่) — ไม่เลื่อนตอนพิมพ์ ส่งเฉพาะตอนเปลี่ยนหมวด/เปิดรายการ
  const lastView = useRef<{ key: string; index: number | null } | null>(null)
  const viewTimer = useRef<number>()
  const onView = useCallback((key: string, index: number | null) => {
    lastView.current = { key, index }
    window.clearTimeout(viewTimer.current)
    viewTimer.current = window.setTimeout(() => { toFrame({ type: 'sj-view', key, index }) }, 180)
  }, [toFrame])
  const onDraft = useCallback((key: string, value: Json) => { drafts.current.set(key, value); sendDraft(key, value) }, [sendDraft])
  useEffect(() => { fetch('/api/config').then(r => r.json()).then(d => setSiteUrl(d.siteUrl || '')).catch(() => {}) }, [])
  useEffect(() => {
    if (!siteOrigin) return
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== siteOrigin || e.source !== frame.current?.contentWindow) return
      const d = e.data; if (!d || typeof d !== 'object') return
      if (d.type === 'sj-ready') { drafts.current.forEach((v, k) => sendDraft(k, v)); if (lastView.current) toFrame({ type: 'sj-view', ...lastView.current }) }
      else if (d.type === 'sj-path' && typeof d.path === 'string') setPvPath(d.path)
      else if (d.type === 'sj-focus' && SECTIONS.some(s => s.key === d.key)) { setTab(d.key); setFocus({ key: d.key, index: typeof d.index === 'number' ? d.index : null, tick: Date.now() }) }
    }
    window.addEventListener('message', onMsg); return () => window.removeEventListener('message', onMsg)
  }, [siteOrigin, sendDraft, toFrame])
  const check = useCallback(() => {
    fetch('/api/me').then(r => r.json()).then(d => setAuth(d.admin ? 'in' : 'out')).catch(() => setAuth('down'))
  }, [])
  useEffect(check, [check])
  useEffect(() => { document.title = 'จัดการเว็บไซต์' }, [])
  useEffect(() => { const go = () => setTab('_guide'); document.addEventListener('admin-guide', go); return () => document.removeEventListener('admin-guide', go) }, [])

  if (auth === 'loading') return <div className="a-login"><p>กำลังโหลด…</p></div>
  if (auth === 'down') return <div className="a-login"><div className="a-card"><h1>เชื่อมต่อ backend ไม่ได้</h1><p>เปิด backend ด้วยคำสั่ง <code>npm run server</code> แล้วรีเฟรชหน้านี้</p></div></div>
  if (auth === 'out') return <Login onDone={check} />

  const groups = [...new Set(SECTIONS.map(s => s.group))]
  const section = SECTIONS.find(s => s.key === tab)
  return (
    <div className={`a-shell${siteUrl && showPreview ? ' with-preview' : ''}`}>
      <aside className="a-side">
        <div className="a-brand">จัดการเว็บไซต์</div>
        <a className="a-link" href={siteUrl || '/'} target="_blank" rel="noopener"><ExternalLink size={14} />เปิดหน้าเว็บจริง</a>
        {siteUrl && !showPreview && <button className="a-link a-linkbtn-side" onClick={() => setShowPreview(true)}><Eye size={14} />แสดงตัวอย่างเว็บ</button>}
        {groups.map(g => (
          <nav key={g} aria-label={g}>
            <div className="a-group">{g}</div>
            {SECTIONS.filter(s => s.group === g).map(s => <button key={s.key} aria-current={tab === s.key} onClick={() => setTab(s.key)}>{s.label}</button>)}
          </nav>
        ))}
        <nav aria-label="เครื่องมือ">
          <div className="a-group">เครื่องมือ</div>
          <button aria-current={tab === '_guide'} onClick={() => setTab('_guide')}>คู่มือขนาดภาพ</button>
          <a className="a-link" href="/design-system.pdf" target="_blank" rel="noopener" style={{ padding: '8px 10px' }}>📄 Wireframe &amp; Design System (PDF)</a>
          <button aria-current={tab === '_media'} onClick={() => setTab('_media')}>คลังสื่อ (รูป/วิดีโอ)</button>
          <button aria-current={tab === '_msgs'} onClick={() => setTab('_msgs')}><Mail size={14} /> ข้อความติดต่อ</button>
          <button aria-current={tab === '_pw'} onClick={() => setTab('_pw')}>เปลี่ยนรหัสผ่าน</button>
          <button onClick={async () => { await api('/api/logout', { method: 'POST' }); setAuth('out') }}><LogOut size={14} /> ออกจากระบบ</button>
        </nav>
      </aside>
      <main className="a-main">
        {section ? <SectionEditor key={section.key} section={section} toast={show} onDraft={onDraft} onView={onView} focus={focus?.key === section.key ? focus : null} /> : tab === '_guide' ? <Guide /> : tab === '_media' ? <Library toast={show} /> : tab === '_msgs' ? <Messages toast={show} /> : <Password toast={show} />}
      </main>
      {siteUrl && showPreview && <Preview siteUrl={siteUrl} frame={frame} path={pvPath} onClose={() => setShowPreview(false)} />}
      {node}
    </div>
  )
}
