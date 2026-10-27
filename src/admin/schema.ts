// โครงสร้างฟอร์มของหน้าแอดมิน — หนึ่ง Section ต่อหนึ่งคีย์ใน EDITABLE (src/site.ts)
// เพิ่มข้อมูลใหม่: เพิ่มคีย์ใน site.ts + server/index.mjs (KEYS) แล้วประกาศ Section ที่นี่
import { FONT_CHOICES, PRODUCTS } from '../site'

export type FieldType = 'text' | 'textarea' | 'number' | 'range' | 'color' | 'date' | 'select' | 'image' | 'video' | 'strings' | 'list'

// ขนาดภาพที่ฝ่ายออกแบบต้องทำ (px) — คำนวณจากกรอบจริงบนเว็บ x2 สำหรับจอ Retina
// ถ้าเปลี่ยน layout ใน styles.css ต้องทบทวนตารางนี้และไฟล์ docs/IMAGE-SPECS.md
export interface ImageSpec { label: string; w: number; h: number; shown: string; where: string; tips: string[]; formats: string }
export const IMAGE_SPECS: Record<string, ImageSpec> = {
  hero: { label: 'Hero (สไลด์หน้าแรก)', w: 1200, h: 1020, shown: 'แสดงจริงประมาณ 480×408', where: 'กรอบภาพด้านขวาของสไลด์ มุมโค้ง 26px',
    tips: ['ซ่อนบนมือถือ (หน้าจอแคบกว่า 920px) — ห้ามใส่ข้อมูลสำคัญที่ต้องอ่านเฉพาะในภาพ', 'เว้นมุมซ้ายบนและมุมขวาล่างให้โล่ง เพราะมีป้ายข้อความลอยทับ', 'ภาพถูกครอปตรงกลางแบบเต็มกรอบ ให้วางจุดเด่นไว้กลางภาพ'], formats: 'PNG/WebP/JPG' },
  heroBanner: { label: 'Hero แบบแบนเนอร์เต็มจอ (ธีม Digital Navy)', w: 2400, h: 1000, shown: 'แสดงจริงกว้างเต็มจอ สูง 460–640', where: 'พื้นหลังเต็มความกว้างของสไลด์ในหน้าแรก (เมื่อเลือกรูปแบบ Hero เป็น “แบนเนอร์เต็มจอ”)',
    tips: ['ข้อความและปุ่มอยู่ชิด “ล่างซ้าย” — ให้มุมซ้ายล่างของภาพโล่ง ไม่มีรายละเอียดสำคัญ', 'วางจุดเด่นของภาพไว้ “กลางค่อนขวา” (บนมือถือภาพถูกครอปเหลือส่วนกลางค่อนขวา)', 'ระบบใส่เงาทึบทับด้านซ้ายและด้านล่างให้อ่านข้อความง่ายอยู่แล้ว — ไม่ต้องทำภาพให้มืดเอง', 'ห้ามมีตัวหนังสือในภาพ', 'โทนภาพกลางค่อนเข้ม (ฟ้า/กรมท่า/ม่วง) อ่านข้อความง่ายที่สุด — ภาพโทนสว่างมากจะทำให้ข้อความสีขาวอ่านยาก'], formats: 'JPG/WebP ไม่เกิน ~400KB' },
  square: { label: 'ภาพร้านลูกค้า (หน้า “ลูกค้าของเรา”)', w: 800, h: 800, shown: 'แสดงจริงสี่เหลี่ยมจัตุรัส 200×200 (มือถือ 96×96)', where: 'ภาพซ้ายของรายการร้านลูกค้า',
    tips: ['สัดส่วน 1:1 เสมอ', 'วางหน้าร้าน/จุดเด่นไว้กลางภาพ', 'ต้องได้รับอนุญาตจากร้านก่อนใช้'], formats: 'JPG/WebP' },
  heroPoster: { label: 'Hero แบบโปสเตอร์ (ข้อความอยู่ในภาพ)', w: 2400, h: 840, shown: 'แสดงเต็มกว้าง ไม่ครอป (สูงตามสัดส่วนภาพ)', where: 'ภาพแบนเนอร์ทั้งใบของสไลด์ (เมื่อเลือกรูปแบบ Hero เป็น “โปสเตอร์”) กดแล้วไปลิงก์ของปุ่มหลัก',
    tips: ['สัดส่วนประมาณ 2.9:1 (กว้าง 2400 × สูง 840)', 'ใส่ข้อความ/โลโก้/ปุ่มในภาพได้เลย — เว้นขอบซ้าย-ขวาอย่างน้อย 6% กันตัวหนังสือชิดขอบ', 'ตัวหนังสือหลักสูงอย่างน้อย 70px ที่ขนาด 2400 เพื่อให้อ่านได้บนแท็บเล็ต', 'บนมือถือภาพจะย่อมาก — ควรทำภาพมือถือแยก (ช่อง “ภาพสำหรับมือถือ”)', 'ทุกสไลด์ควรใช้สัดส่วนเดียวกัน เพื่อไม่ให้ความสูง Hero กระโดดตอนเลื่อน'], formats: 'JPG/WebP ไม่เกิน ~500KB' },
  heroPosterMobile: { label: 'Hero โปสเตอร์ — ภาพมือถือ', w: 1080, h: 1200, shown: 'แสดงเต็มกว้างจอมือถือ (≤ 920px)', where: 'ใช้แทนภาพหลักเมื่อเปิดบนมือถือ/แท็บเล็ตแนวตั้ง',
    tips: ['สัดส่วน 9:10 (กว้าง 1080 × สูง 1200)', 'จัดข้อความเรียงบน-ล่างให้อ่านง่ายในจอแคบ', 'ถ้าไม่ใส่ จะใช้ภาพหลักย่อลง (ตัวหนังสืออาจเล็กมาก)'], formats: 'JPG/WebP ไม่เกิน ~350KB' },
  proglogo: { label: 'โลโก้โปรแกรม (ปุ่มใต้ Hero)', w: 600, h: 200, shown: 'แสดงจริงสูงไม่เกิน 52px', where: 'ปุ่มโปรแกรมแต่ละปุ่มในหน้าแรก (แทนที่ชื่อที่เป็นตัวอักษร)',
    tips: ['PNG พื้นโปร่งใส สีขาวหรือสีสว่าง (พื้นปุ่มเป็นสีเข้ม)', 'ครอปชิดตัวโลโก้ เว้นขอบไม่เกิน 10%', 'ไม่รับไฟล์ SVG'], formats: 'PNG' },
  ad: { label: 'แบนเนอร์โฆษณา/โปรโมชัน', w: 2200, h: 600, shown: 'แสดงจริงกว้าง ~1100 สูง 220–300', where: 'พื้นหลังเต็มความกว้างของแบนเนอร์',
    tips: ['ข้อความสีขาวและปุ่มจะวางทับ "ครึ่งซ้าย" ของภาพ — ทำครึ่งซ้ายให้สีเข้ม/ไม่มีรายละเอียด', 'วางจุดเด่นไว้ฝั่งขวา (เห็นเฉพาะเดสก์ท็อป)', 'บนมือถือเห็นเฉพาะ "แถบกลาง" ราว 30% ของภาพ (x 770–1430) และข้อความทับทั้งแถบ — แถบนี้ต้องเข้ม/เรียบ', 'อย่าใส่ตัวหนังสือลงในภาพ เพราะแก้ไขไม่ได้และตกขอบบนมือถือ'], formats: 'JPG/WebP' },
  cover: { label: 'ภาพกิจกรรม / ข่าว / บริษัท', w: 1280, h: 720, shown: 'แสดงจริงกว้าง ~350–450', where: 'ภาพปกของการ์ดกิจกรรม ข่าว และส่วน Our Company (สัดส่วน 16:9)',
    tips: ['สัดส่วน 16:9 เสมอ', 'ข้อความบนเว็บอยู่ใต้ภาพ ไม่ทับภาพ จึงใส่ข้อความในภาพได้บ้าง แต่ควรเว้นขอบรอบ 5%'], formats: 'JPG/WebP' },
  logo: { label: 'โลโก้ลูกค้า', w: 400, h: 160, shown: 'แสดงจริงสูงไม่เกิน 40 กว้างไม่เกิน ~150', where: 'ช่องโลโก้ในส่วนลูกค้าของเรา',
    tips: ['PNG พื้นหลังโปร่งใส (ไม่รับไฟล์ SVG)', 'ครอปชิดตัวโลโก้ เว้นขอบรอบไม่เกิน 10%', 'ภาพจะถูกย่อให้พอดีกรอบโดยไม่บิดสัดส่วน — โลโก้แนวนอนจะดูชัดที่สุด', 'เมื่อไม่ใส่โลโก้ ระบบแสดงเป็นชื่อลูกค้าแทน'], formats: 'PNG' },
  thumb: { label: 'ภาพปกวิดีโอ', w: 1280, h: 720, shown: 'แสดงจริงกว้าง ~350', where: 'ภาพก่อนกดเล่นของวิดีโอที่อัปโหลดเป็นไฟล์ (วิดีโอ YouTube ใช้พื้นสีแทน)',
    tips: ['สัดส่วน 16:9 เสมอ'], formats: 'JPG/WebP' },
}
export const VIDEO_SPEC = { w: 1920, h: 1080, note: 'MP4 (H.264 + AAC) หรือ WebM · สัดส่วน 16:9 · ไม่เกิน 200MB (แนะนำบีบให้ไม่เกิน 50MB เพื่อให้โหลดเร็ว) · ความยาวแนะนำไม่เกิน 3 นาที' }
export const FILE_RULES = 'ไฟล์รูปไม่เกิน 8MB (แนะนำ 300–600KB) · รับ JPG PNG WebP GIF · ไม่รับ SVG · ตั้งชื่อไฟล์เป็นอังกฤษ ไม่มีอักขระพิเศษ'

export interface Field {
  key: string; label: string; type: FieldType; help?: string
  min?: number; max?: number; step?: number; unit?: string; def?: number  // range: ช่วงค่า/หน่วยที่แสดง
  spec?: keyof typeof IMAGE_SPECS  // image: ขนาดที่แนะนำ (แสดงใต้ช่อง + เตือนเมื่อภาพเล็กไป)
  options?: () => [string, string][]
  fields?: Field[]          // list: ฟิลด์ย่อยของแต่ละรายการ
  titleKey?: string         // list: ฟิลด์ที่ใช้เป็นชื่อรายการ
  multiline?: boolean       // strings: แต่ละบรรทัดเป็นกล่องข้อความยาว
  blank?: () => Record<string, unknown>
}

export interface Section {
  key: string; label: string; group: string; help?: string
  kind: 'object' | 'list'
  fields: Field[]
  titleKey?: string         // list: ฟิลด์ที่ใช้เป็นชื่อรายการ
  fixed?: boolean           // list ที่เพิ่ม/ลบไม่ได้ (เช่น สินค้า — ผูกกับหน้ารายละเอียดและไอคอน)
  blank?: () => Record<string, unknown>
}

const productOptions = (): [string, string][] => [['', 'ทั่วไป'], ...PRODUCTS.map(p => [p.slug, p.name] as [string, string])]
const link = 'ลิงก์ภายในเว็บขึ้นต้นด้วย / เช่น /contact หรือลิงก์ภายนอกขึ้นต้นด้วย https://'

export const SECTIONS: Section[] = [
  {
    key: 'HERO', label: 'Hero (สไลด์หน้าแรก)', group: 'หน้าแรก', kind: 'list', titleKey: 'title',
    help: 'สไลด์ใหญ่บนสุดของหน้าแรก เลื่อนอัตโนมัติ ถ้าใส่ภาพ ภาพจะแสดงในกรอบด้านขวาแทนไอคอน',
    blank: () => ({ tag: '', title: 'หัวข้อใหม่', lead: '', color: '#0E7C86', image: '', shade: 'on', buttons: 'show', overlayText: 'show', primaryLabel: 'ดูรายละเอียด', primaryTo: '/products', secondaryLabel: 'ขอใบเสนอราคา', secondaryTo: '/contact', chip1: '', chip2: '' }),
    fields: [
      { key: 'tag', label: 'ป้ายเล็กเหนือหัวข้อ', type: 'text' },
      { key: 'title', label: 'หัวข้อ', type: 'text' },
      { key: 'lead', label: 'คำอธิบายใต้หัวข้อ', type: 'textarea' },
      { key: 'color', label: 'สีพื้นหลัง', type: 'color' },
      { key: 'image', label: 'ภาพประกอบ / ภาพพื้นหลัง / ภาพโปสเตอร์ (ตามรูปแบบ Hero)', type: 'image', spec: 'hero' },
      { key: 'shade', label: 'เงาทึบทับภาพ (รูปแบบแบนเนอร์เต็มจอ)', type: 'select', options: () => [['on', 'เปิด — ช่วยให้อ่านข้อความบนภาพ'], ['off', 'ปิด — เห็นภาพสีสดเต็มๆ']], help: 'ปิดเมื่อภาพมีข้อความ/ตกแต่งมาแล้ว หรือภาพมืดอยู่แล้ว · ภาพที่มีข้อความอยู่ในภาพ แนะนำใช้รูปแบบ “โปสเตอร์เต็มกว้าง” ในเมนูธีม (ไม่ครอป ไม่มีเงา)' },
      { key: 'fit', label: 'การจัดภาพให้พอดี Hero (รูปแบบแบนเนอร์เต็มจอ)', type: 'select', options: () => [['whole', 'พอดีความกว้าง — เห็นทั้งภาพ ความสูง Hero ตามสัดส่วนภาพ (แนะนำ)'], ['contain', 'ความสูง Hero คงที่ — เห็นทั้งภาพ มีแถบสีสองข้าง'], ['cover', 'เต็มกรอบ ตัดขอบภาพ — ใช้ซูม/จุดโฟกัสด้านล่างปรับได้']], help: 'ถ้าภาพถูกตัดขอบ ให้เลือก “พอดีความกว้าง” · ทุกสไลด์ควรใช้สัดส่วนภาพเดียวกัน ไม่งั้นความสูง Hero จะกระโดดตอนเลื่อน' },
      { key: 'imageZoom', label: 'ซูมภาพ — เดสก์ท็อป', type: 'range', min: 50, max: 250, step: 5, unit: '%', def: 100, help: 'ใช้เมื่อเลือกการจัดภาพ “เต็มกรอบ ตัดขอบภาพ” · 100% = เต็มกรอบพอดี · มากกว่า = ซูมเข้า · น้อยกว่า = ซูมออก (เห็นภาพมากขึ้น ขอบจะเห็นสีพื้นของสไลด์)' },
      { key: 'imageX', label: 'จุดโฟกัสภาพ แนวนอน — เดสก์ท็อป', type: 'range', min: 0, max: 100, step: 1, unit: '%', def: 70, help: '0 = ชิดซ้าย · 50 = กลาง · 100 = ชิดขวา (ส่วนของภาพที่จะอยู่กลางกรอบเมื่อภาพถูกตัดขอบ)' },
      { key: 'imageY', label: 'จุดโฟกัสภาพ แนวตั้ง — เดสก์ท็อป', type: 'range', min: 0, max: 100, step: 1, unit: '%', def: 50, help: '0 = ชิดบน · 50 = กลาง · 100 = ชิดล่าง' },
      { key: 'imageMobile', label: 'ภาพสำหรับมือถือ/แท็บเล็ต (ไม่ใส่ = ใช้ภาพเดียวกับเดสก์ท็อป)', type: 'image', spec: 'heroPosterMobile' },
      { key: 'mobileZoom', label: 'ซูมภาพ — มือถือ', type: 'range', min: 50, max: 250, step: 5, unit: '%', def: 100, help: 'ใช้กับจอกว้างไม่เกิน 920px · กดปุ่มรูปมือถือในช่องตัวอย่างเพื่อดูผลระหว่างปรับ' },
      { key: 'mobileX', label: 'จุดโฟกัสภาพ แนวนอน — มือถือ', type: 'range', min: 0, max: 100, step: 1, unit: '%', def: 50 },
      { key: 'mobileY', label: 'จุดโฟกัสภาพ แนวตั้ง — มือถือ', type: 'range', min: 0, max: 100, step: 1, unit: '%', def: 50 },
      { key: 'overlayText', label: 'ป้าย / หัวข้อ / คำอธิบาย บนสไลด์', type: 'select', options: () => [['show', 'แสดง'], ['hide', 'ซ่อน (ภาพมีข้อความอยู่แล้ว)']], help: 'ซ่อนแล้วข้อความยังอยู่ในหน้าสำหรับโปรแกรมอ่านหน้าจอและ SEO — ควรกรอกให้ตรงกับข้อความในภาพ' },
      { key: 'buttons', label: 'ปุ่มบนสไลด์ (เรียนรู้เพิ่มเติม / ติดต่อเรา)', type: 'select', options: () => [['show', 'แสดง'], ['hide', 'ซ่อนทั้งสองปุ่ม']], help: 'อยากซ่อนแค่ปุ่มเดียว: ล้างช่อง “ข้อความ” ของปุ่มนั้นให้ว่าง' },
      { key: 'primaryLabel', label: 'ปุ่มหลัก: ข้อความ', type: 'text' },
      { key: 'primaryTo', label: 'ปุ่มหลัก: ลิงก์', type: 'text', help: link },
      { key: 'secondaryLabel', label: 'ปุ่มรอง: ข้อความ', type: 'text' },
      { key: 'secondaryTo', label: 'ปุ่มรอง: ลิงก์', type: 'text', help: link },
      { key: 'chip1', label: 'ป้ายลอยบนภาพ 1', type: 'text' },
      { key: 'chip2', label: 'ป้ายลอยบนภาพ 2', type: 'text' },
    ],
  },
  {
    key: 'PROGRAMS', label: 'โปรแกรมของเรา (ปุ่มใต้ Hero)', group: 'หน้าแรก', kind: 'list', titleKey: 'name',
    help: 'แถบปุ่มสีใต้ Hero (GrowStore · Yoonai · Weajer · SyncZag) · ลิงก์ว่าง = ไปหน้าติดต่อเรา · ใส่ https://… เพื่อเปิดเว็บของโปรแกรมนั้นในแท็บใหม่',
    blank: () => ({ name: 'โปรแกรมใหม่', tagline: '', color: '#1369D5', color2: '#5C9BEA', logo: '', to: '' }),
    fields: [
      { key: 'name', label: 'ชื่อโปรแกรม', type: 'text' },
      { key: 'tagline', label: 'คำอธิบายสั้น (ใต้ชื่อ)', type: 'text' },
      { key: 'color', label: 'สีปุ่ม (ด้านซ้ายบน)', type: 'color' },
      { key: 'color2', label: 'สีปุ่ม (ด้านขวาล่าง)', type: 'color' },
      { key: 'logo', label: 'โลโก้ (ไม่ใส่ = แสดงชื่อเป็นตัวอักษร)', type: 'image', spec: 'proglogo' },
      { key: 'to', label: 'ลิงก์เว็บของโปรแกรม', type: 'text', help: 'https://… หรือ /หน้าในเว็บ — ว่าง = ไปหน้าติดต่อเรา' },
    ],
  },
  {
    key: 'VIDEOS', label: 'วิดีโอแนะนำระบบ', group: 'หน้าแรก', kind: 'list', titleKey: 'title',
    help: 'ใส่ได้ 2 แบบ: อัปโหลดไฟล์วิดีโอ หรือใส่รหัส YouTube (ส่วนท้ายลิงก์ เช่น dQw4w9WgXcQ) ถ้าใส่ทั้งคู่ จะใช้ไฟล์ที่อัปโหลด',
    blank: () => ({ title: 'วิดีโอใหม่', text: '', duration: '', product: '', youtubeId: '', file: '', thumb: '' }),
    fields: [
      { key: 'title', label: 'ชื่อวิดีโอ', type: 'text' },
      { key: 'text', label: 'คำอธิบาย', type: 'textarea' },
      { key: 'product', label: 'ระบบที่เกี่ยวข้อง', type: 'select', options: productOptions },
      { key: 'duration', label: 'ความยาว (เช่น 5:12)', type: 'text' },
      { key: 'file', label: 'ไฟล์วิดีโอ (MP4/WebM)', type: 'video' },
      { key: 'thumb', label: 'ภาพปกวิดีโอ (ใช้กับไฟล์ที่อัปโหลด)', type: 'image', spec: 'thumb' },
      { key: 'youtubeId', label: 'รหัส YouTube', type: 'text' },
    ],
  },
  {
    key: 'SOCIAL_POSTS', label: 'คอนเทนต์โซเชียล (โพสต์/คลิป)', group: 'หน้าแรก', kind: 'list', titleKey: 'title',
    help: 'วางลิงก์โพสต์หรือคลิปจาก Facebook / Instagram / TikTok / YouTube · ผู้เข้าชมกด “ดูโพสต์” แล้วจึงโหลดตัวฝังของแพลตฟอร์ม · ไม่มีรายการ = ซ่อนส่วนนี้ทั้งหมด · โพสต์ต้องตั้งเป็นสาธารณะ ถึงจะฝังได้',
    blank: () => ({ platform: 'facebook', url: '', title: 'โพสต์ใหม่', text: '', cover: '', date: '', show: 'embed' }),
    fields: [
      { key: 'platform', label: 'แพลตฟอร์ม', type: 'select', options: () => [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['youtube', 'YouTube'], ['other', 'อื่นๆ (การ์ดเปิดลิงก์)']] },
      { key: 'url', label: 'ลิงก์โพสต์/คลิป', type: 'text', help: 'ใช้ลิงก์เต็มขึ้นต้น https:// เช่น facebook.com/…/posts/… · instagram.com/reel/… · tiktok.com/@…/video/… · youtu.be/… (ลิงก์ย่อของ TikTok เช่น vm.tiktok.com ฝังไม่ได้)' },
      { key: 'show', label: 'รูปแบบการแสดง', type: 'select', options: () => [['embed', 'ฝังโพสต์ในหน้าเว็บ (กดแล้วโหลด)'], ['card', 'การ์ดเปิดโพสต์ต้นฉบับอย่างเดียว']] },
      { key: 'title', label: 'หัวข้อ', type: 'text' },
      { key: 'text', label: 'คำอธิบายสั้น', type: 'textarea' },
      { key: 'cover', label: 'ภาพปก (แสดงก่อนกดโหลด / ใช้กับการ์ด)', type: 'image', spec: 'thumb' },
      { key: 'date', label: 'วันที่โพสต์', type: 'date' },
    ],
  },
  {
    key: 'TEAM', label: 'ทีมผู้พัฒนา', group: 'หน้าอื่นๆ', kind: 'list', titleKey: 'name',
    help: 'แสดงในหน้า “เกี่ยวกับเรา” เป็นการ์ดคนละใบ · ถ้าไม่ใส่รูป จะแสดงวงกลมสีพร้อมตัวอักษรแรกของชื่อ · ไม่มีรายการ = ซ่อนส่วนนี้',
    blank: () => ({ name: 'ชื่อ-นามสกุล', role: 'ตำแหน่ง', text: '', photo: '', color: '#1369D5' }),
    fields: [
      { key: 'name', label: 'ชื่อ', type: 'text' },
      { key: 'role', label: 'ตำแหน่ง/หน้าที่ (เช่น นักพัฒนาซอฟต์แวร์)', type: 'text' },
      { key: 'text', label: 'แนะนำสั้นๆ', type: 'textarea' },
      { key: 'photo', label: 'รูปถ่าย (สี่เหลี่ยมจัตุรัส ใบหน้าอยู่กลางภาพ)', type: 'image', spec: 'square' },
      { key: 'color', label: 'สีวงกลม (เมื่อไม่มีรูป)', type: 'color' },
    ],
  },
  {
    key: 'TRANSLATIONS', label: 'คำแปลภาษาอังกฤษ', group: 'ทั่วทั้งเว็บ', kind: 'list', titleKey: 'th',
    help: 'เว็บมีเวอร์ชันภาษาอังกฤษให้แล้ว (กดธง EN ที่แถบบนของเว็บ) · ถ้าคุณแก้ข้อความไทยเป็นประโยคใหม่ เว็บอังกฤษจะยังแสดงเป็นไทยเพราะไม่มีคำแปล — เพิ่มที่นี่ได้: ช่อง “ข้อความไทย” ต้องตรงกับที่ใช้ในหน้าเว็บทุกตัวอักษร แล้วใส่คำแปลในช่องอังกฤษ · ใช้ทับคำแปลที่มีอยู่แล้วได้ด้วย',
    blank: () => ({ th: '', en: '' }),
    fields: [
      { key: 'th', label: 'ข้อความไทย (ต้องตรงกับในเว็บทุกตัวอักษร)', type: 'textarea' },
      { key: 'en', label: 'ข้อความอังกฤษ', type: 'textarea' },
    ],
  },
  {
    key: 'AWARDS', label: 'รางวัลและการรับรอง', group: 'หน้าแรก', kind: 'list', titleKey: 'title',
    help: 'รางวัล ใบรับรอง หรือมาตรฐานที่ได้รับ — แสดงเป็นการ์ดบนหน้าแรก · ใส่เฉพาะที่ได้รับจริงและแสดงได้ · ไม่มีรายการ = ซ่อนส่วนนี้ · ถ้าใส่ลิงก์ ผู้เข้าชมกดการ์ดเพื่อเปิดหน้าตรวจสอบ/อ่านเพิ่มได้',
    blank: () => ({ title: 'ชื่อรางวัลหรือการรับรอง', issuer: '', year: '', text: '', image: '', url: '' }),
    fields: [
      { key: 'title', label: 'ชื่อรางวัล/การรับรอง', type: 'text' },
      { key: 'issuer', label: 'หน่วยงานที่มอบให้', type: 'text' },
      { key: 'year', label: 'ปี (เช่น 2569 หรือ 2026)', type: 'text' },
      { key: 'text', label: 'รายละเอียดสั้นๆ', type: 'textarea' },
      { key: 'image', label: 'ตรา/ใบรับรอง (ไม่ใส่ = ใช้ไอคอนรางวัล)', type: 'image', spec: 'logo' },
      { key: 'url', label: 'ลิงก์ตรวจสอบ/อ่านเพิ่ม (ไม่บังคับ)', type: 'text', help: 'https://…' },
    ],
  },
  {
    key: 'ADS', label: 'พื้นที่โฆษณา/โปรโมชัน', group: 'หน้าแรก', kind: 'list', titleKey: 'title',
    help: 'แบนเนอร์ใหญ่กลางหน้า เลื่อนอัตโนมัติ ถ้าใส่ภาพ จะใช้ภาพเป็นพื้นหลังเต็มกรอบ (ควรเป็นภาพที่ตัวอักษรสีขาวอ่านออก)',
    blank: () => ({ title: 'โปรโมชันใหม่', text: '', cta: 'ดูรายละเอียด', to: '/contact', color: '#0E7C86', image: '' }),
    fields: [
      { key: 'title', label: 'หัวข้อ', type: 'text' },
      { key: 'text', label: 'รายละเอียด', type: 'textarea' },
      { key: 'cta', label: 'ข้อความบนปุ่ม', type: 'text' },
      { key: 'to', label: 'ลิงก์ของปุ่ม', type: 'text', help: link },
      { key: 'color', label: 'สีพื้นหลัง (เมื่อไม่มีภาพ)', type: 'color' },
      { key: 'image', label: 'ภาพพื้นหลัง', type: 'image', spec: 'ad' },
    ],
  },
  {
    key: 'COMPANY', label: 'Our Company', group: 'หน้าแรก', kind: 'object',
    help: 'ส่วนแนะนำบริษัทในหน้าแรก และตัวเลขสถิติในหน้า "เกี่ยวกับเรา"',
    fields: [
      { key: 'heading', label: 'หัวข้อ', type: 'text' },
      { key: 'text', label: 'ย่อหน้าแนะนำ', type: 'strings', multiline: true },
      { key: 'image', label: 'ภาพบริษัท/ทีมงาน', type: 'image', spec: 'cover' },
      { key: 'stats', label: 'ตัวเลขสถิติ', type: 'list', titleKey: 'label', blank: () => ({ n: '', label: '' }), fields: [{ key: 'n', label: 'ตัวเลข (เช่น 2,000+)', type: 'text' }, { key: 'label', label: 'คำอธิบาย', type: 'text' }] },
    ],
  },
  {
    key: 'CUSTOMERS', label: 'Our Customer', group: 'หน้าแรก', kind: 'list', titleKey: 'name',
    help: 'ใส่โลโก้ลูกค้าได้ ถ้าไม่ใส่จะแสดงเป็นชื่อ',
    blank: () => ({ name: 'ลูกค้าใหม่', logo: '', place: '', url: '', systems: '', text: '', image: '', color: '#0E7C86' }),
    fields: [
      { key: 'name', label: 'ชื่อลูกค้า', type: 'text' },
      { key: 'logo', label: 'โลโก้', type: 'image', spec: 'logo' },
      { key: 'place', label: 'ที่ตั้ง (เช่น จ.นครปฐม)', type: 'text' },
      { key: 'url', label: 'เว็บไซต์ของลูกค้า', type: 'text', help: 'https://… — กดที่โลโก้/ชื่อแล้วเปิดเว็บนี้ในแท็บใหม่' },
      { key: 'systems', label: 'ระบบของเราที่ลูกค้าใช้', type: 'text', help: 'คั่นด้วยจุลภาค เช่น GrowStore, Yoonai' },
      { key: 'text', label: 'ข้อความแนะนำร้าน (แสดงในหน้า ลูกค้าของเรา)', type: 'textarea' },
      { key: 'image', label: 'ภาพร้าน/โปสเตอร์', type: 'image', spec: 'square' },
      { key: 'color', label: 'สีพื้น (เมื่อไม่มีภาพ)', type: 'color' },
    ],
  },
  {
    key: 'EVENTS', label: 'กิจกรรม/สัมมนา', group: 'หน้าแรก', kind: 'list', titleKey: 'title',
    blank: () => ({ title: 'กิจกรรมใหม่', date: new Date().toISOString().slice(0, 10), place: '', text: '', image: '', color: '#0E7C86' }),
    fields: [
      { key: 'title', label: 'ชื่อกิจกรรม', type: 'text' },
      { key: 'date', label: 'วันที่ (ปี ค.ศ.-เดือน-วัน)', type: 'text', help: 'รูปแบบ 2569-11-14 (ปี พ.ศ.) ระบบแสดงเป็นวันที่ไทยให้' },
      { key: 'place', label: 'สถานที่', type: 'text' },
      { key: 'text', label: 'รายละเอียด', type: 'textarea' },
      { key: 'image', label: 'ภาพ', type: 'image', spec: 'cover' },
      { key: 'color', label: 'สีพื้น (เมื่อไม่มีภาพ)', type: 'color' },
    ],
  },
  {
    key: 'NEWS', label: 'ข่าวและสื่อ', group: 'หน้าแรก', kind: 'list', titleKey: 'title',
    blank: () => ({ title: 'ข่าวใหม่', outlet: 'ข่าวประชาสัมพันธ์', date: '', text: '', image: '', color: '#0F1F3D' }),
    fields: [
      { key: 'title', label: 'หัวข้อข่าว', type: 'text' },
      { key: 'outlet', label: 'แหล่งข่าว/สื่อ', type: 'text' },
      { key: 'date', label: 'วันที่', type: 'text', help: 'รูปแบบ 2569-10-08 (ปี พ.ศ.-เดือน-วัน)' },
      { key: 'text', label: 'รายละเอียด', type: 'textarea' },
      { key: 'image', label: 'ภาพ', type: 'image', spec: 'cover' },
      { key: 'color', label: 'สีพื้น (เมื่อไม่มีภาพ)', type: 'color' },
    ],
  },
  {
    key: 'HOME', label: 'หัวข้อแต่ละส่วนของหน้าแรก', group: 'หน้าแรก', kind: 'object',
    fields: [
      { key: 'programsTitle', label: 'ปุ่มโปรแกรม 4 ปุ่ม: หัวข้อ', type: 'text' },
      { key: 'socialTitle', label: 'คอนเทนต์โซเชียล: หัวข้อ', type: 'text' }, { key: 'socialText', label: 'คอนเทนต์โซเชียล: คำอธิบาย', type: 'text' },
      { key: 'teamTitle', label: 'ทีมผู้พัฒนา (หน้าเกี่ยวกับเรา): หัวข้อ', type: 'text' }, { key: 'teamText', label: 'ทีมผู้พัฒนา: คำอธิบาย', type: 'text' },
      { key: 'awardsTitle', label: 'รางวัลและการรับรอง: หัวข้อ', type: 'text' }, { key: 'awardsText', label: 'รางวัลและการรับรอง: คำอธิบาย', type: 'text' },
      { key: 'videosTitle', label: 'วิดีโอ: หัวข้อ', type: 'text' }, { key: 'videosText', label: 'วิดีโอ: คำอธิบาย', type: 'text' },
      { key: 'companyTag', label: 'บริษัท: ป้ายหัวข้อ', type: 'text' },
      { key: 'customersTitle', label: 'ลูกค้า: หัวข้อ', type: 'text' }, { key: 'customersText', label: 'ลูกค้า: คำอธิบาย', type: 'text' },
      { key: 'eventsTitle', label: 'กิจกรรม: หัวข้อ', type: 'text' }, { key: 'eventsText', label: 'กิจกรรม: คำอธิบาย', type: 'text' },
      { key: 'newsTitle', label: 'ข่าว: หัวข้อ', type: 'text' }, { key: 'newsText', label: 'ข่าว: คำอธิบาย', type: 'text' },
      { key: 'contactTitle', label: 'ติดต่อ: หัวข้อ', type: 'text' }, { key: 'contactText', label: 'ติดต่อ: คำอธิบาย', type: 'textarea' },
    ],
  },
  {
    key: 'THEME', label: 'ธีม: สี ฟอนต์ ขนาด', group: 'ทั่วทั้งเว็บ', kind: 'object',
    help: 'ปรับหน้าตาทั้งเว็บ — ดูผลในช่องตัวอย่างทันทีก่อนกด "บันทึก" · กด "คืนค่าเริ่มต้น" เพื่อกลับไปใช้ธีมของแบรนด์',
    fields: [
      { key: 'primary', label: 'สีหลัก (ปุ่มหลัก ลิงก์ จุดโฟกัส)', type: 'color' },
      { key: 'primaryInk', label: 'สีหลักแบบเข้ม (ตอนชี้เมาส์)', type: 'color' },
      { key: 'accent', label: 'สีเน้น (ปุ่มขอคำปรึกษา/ขอเดโม)', type: 'color' },
      { key: 'ink', label: 'สีกรมท่า (ตัวอักษรหลัก แถบบน ท้ายเว็บ หัวหน้าย่อย)', type: 'color' },
      { key: 'ink2', label: 'สีข้อความรอง', type: 'color' },
      { key: 'ground', label: 'สีพื้นหลังเว็บ', type: 'color' },
      { key: 'surface', label: 'สีพื้นการ์ด / แถบเมนู / ช่องกรอก', type: 'color' },
      { key: 'text', label: 'สีตัวอักษรเนื้อความ (ธีมเข้มใช้สีขาว)', type: 'color' },
      { key: 'onPrimary', label: 'สีตัวอักษรบนปุ่มสีหลัก/สีเน้น', type: 'color', help: 'สีส้ม/เหลืองสว่างควรใช้ตัวอักษรสีกรมท่า' },
      { key: 'heroColor', label: 'สีพื้นสไลด์ Hero ทุกอัน (ล้างให้ว่าง = ใช้สีของแต่ละสไลด์)', type: 'color', help: 'ช่วยให้ Hero เข้ากับชุดสีของธีม — ไม่กระทบสไลด์ที่ใช้ภาพพื้นหลังเต็มจอ' },
      { key: 'fontHead', label: 'ฟอนต์หัวข้อ', type: 'select', options: () => FONT_CHOICES.map(f => [f, f] as [string, string]) },
      { key: 'fontBody', label: 'ฟอนต์เนื้อความ', type: 'select', options: () => FONT_CHOICES.map(f => [f, f] as [string, string]) },
      { key: 'buttonShape', label: 'รูปทรงปุ่ม', type: 'select', options: () => [['rounded', 'มุมโค้ง'], ['pill', 'ทรงแคปซูล (โค้งเต็ม)']] },
      { key: 'heroStyle', label: 'รูปแบบ Hero หน้าแรก', type: 'select', options: () => [['split', 'ข้อความซ้าย + ภาพ/กล่องขวา'], ['banner', 'แบนเนอร์เต็มจอ ข้อความชิดล่างซ้าย (ภาพไม่มีตัวหนังสือ)'], ['poster', 'โปสเตอร์เต็มกว้าง (ข้อความอยู่ในภาพ)']], help: 'แบนเนอร์: ใส่ภาพพื้นหลังเต็มจอของแต่ละสไลด์ในหมวด Hero · โปสเตอร์: ใช้ภาพที่ออกแบบข้อความมาแล้วทั้งใบ (เหมือนแบนเนอร์โฆษณา) และใส่ภาพมือถือแยกได้' },
      { key: 'bodyWeight', label: 'น้ำหนักตัวอักษรเนื้อความ', type: 'range', min: 400, max: 600, step: 100, help: '400 = ปกติ · 500 = หนาปานกลาง (แนะนำสำหรับธีมเข้ม) · 600 = หนา' },
      { key: 'textScale', label: 'ขนาดตัวอักษรทั้งเว็บ', type: 'range', min: 80, max: 130, step: 5, unit: '%' },
      { key: 'headScale', label: 'ขนาดหัวข้อเพิ่มเติม', type: 'range', min: 70, max: 140, step: 5, unit: '%', help: 'ปรับเฉพาะหัวข้อใหญ่ (Hero หัวส่วน หัวหน้าย่อย) เพิ่มจากขนาดตัวอักษรทั้งเว็บ' },
      { key: 'radius', label: 'ความโค้งมุมการ์ดและปุ่ม', type: 'range', min: 0, max: 28, step: 1, unit: 'px' },
      { key: 'sectionSpace', label: 'ระยะบน-ล่างของแต่ละส่วน (จอกว้าง)', type: 'range', min: 40, max: 140, step: 4, unit: 'px' },
      { key: 'maxWidth', label: 'ความกว้างเนื้อหาสูงสุด', type: 'range', min: 1000, max: 1400, step: 20, unit: 'px' },
    ],
  },
  {
    key: 'BRAND', label: 'ข้อมูลบริษัท/ติดต่อ', group: 'ทั่วทั้งเว็บ', kind: 'object',
    help: 'ใช้ในแถบบน ส่วนท้าย หน้าติดต่อ และหน้าแรก',
    fields: [
      { key: 'name', label: 'ชื่อแบรนด์', type: 'text' }, { key: 'tagline', label: 'สโลแกน', type: 'text' },
      { key: 'company', label: 'ชื่อบริษัท (ทางกฎหมาย)', type: 'text' }, { key: 'taxId', label: 'เลขประจำตัวผู้เสียภาษี', type: 'text' },
      { key: 'address', label: 'ที่อยู่', type: 'textarea' },
      { key: 'salesPhone', label: 'เบอร์ฝ่ายขาย', type: 'text' }, { key: 'servicePhone', label: 'เบอร์ฝ่ายบริการ', type: 'text' },
      { key: 'email', label: 'อีเมล', type: 'text' }, { key: 'line', label: 'LINE ID', type: 'text' },
      { key: 'hours', label: 'เวลาทำการ', type: 'text' },
    ],
  },
  {
    key: 'NAV', label: 'เมนูหลัก (Header)', group: 'ทั่วทั้งเว็บ', kind: 'list', titleKey: 'label',
    help: 'ช่องลิงก์: ว่าง = หัวข้อที่กดไม่ได้ (เปิดเมนูย่อยอย่างเดียว) · /หน้า = ลิงก์ในเว็บ · https://… = เว็บอื่น (เปิดแท็บใหม่) · เมื่อบันทึกเมนูที่นี่ ชื่อสินค้าในเมนูจะไม่อัปเดตตามหมวด "สินค้า" อัตโนมัติ',
    blank: () => ({ label: 'เมนูใหม่', to: '', children: [] }),
    fields: [
      { key: 'label', label: 'ชื่อเมนู', type: 'text' },
      { key: 'to', label: 'ลิงก์ (เว้นว่างได้)', type: 'text', help: link },
      { key: 'children', label: 'เมนูย่อย', type: 'list', titleKey: 'label', blank: () => ({ label: 'เมนูย่อยใหม่', to: '/', children: [] }), fields: [
        { key: 'label', label: 'ชื่อ', type: 'text' },
        { key: 'to', label: 'ลิงก์', type: 'text', help: link },
        { key: 'children', label: 'เมนูชั้นที่ 3 (แตกออกด้านข้าง)', type: 'list', titleKey: 'label', blank: () => ({ label: 'รายการใหม่', to: '/' }), fields: [{ key: 'label', label: 'ชื่อ', type: 'text' }, { key: 'to', label: 'ลิงก์', type: 'text', help: link }] },
      ] },
    ],
  },
  {
    key: 'SOCIAL', label: 'โซเชียล (แถบบนสุด)', group: 'ทั่วทั้งเว็บ', kind: 'list', titleKey: 'label',
    blank: () => ({ label: 'ช่องทางใหม่', href: 'https://' }),
    fields: [{ key: 'label', label: 'ชื่อที่แสดง', type: 'text' }, { key: 'href', label: 'ลิงก์', type: 'text', help: 'ต้องขึ้นต้นด้วย https://' }],
  },
  {
    key: 'PRODUCTS', label: 'บริการ (4 ด้าน)', group: 'หน้าอื่นๆ', kind: 'list', titleKey: 'name', fixed: true,
    help: 'แก้ข้อความของสินค้าที่มีอยู่ (เพิ่ม/ลบสินค้าและเปลี่ยนไอคอนต้องแก้โค้ดใน src/site.ts)',
    fields: [
      { key: 'name', label: 'ชื่อสินค้า', type: 'text' }, { key: 'short', label: 'ประโยคสั้น', type: 'text' },
      { key: 'summary', label: 'สรุป', type: 'textarea' }, { key: 'forWho', label: 'เหมาะกับใคร', type: 'textarea' },
      { key: 'color', label: 'สีประจำสินค้า', type: 'color' },
      { key: 'features', label: 'จุดเด่น', type: 'strings' },
      { key: 'modules', label: 'โมดูล', type: 'list', titleKey: 'title', blank: () => ({ title: '', text: '' }), fields: [{ key: 'title', label: 'ชื่อโมดูล', type: 'text' }, { key: 'text', label: 'รายละเอียด', type: 'textarea' }] },
    ],
  },
  {
    key: 'ARTICLES', label: 'บทความ/ศูนย์ความรู้', group: 'หน้าอื่นๆ', kind: 'list', titleKey: 'title',
    blank: () => ({ slug: `article-${Date.now().toString(36)}`, title: 'บทความใหม่', category: 'ข่าวสาร', date: '', excerpt: '', body: [''] }),
    fields: [
      { key: 'title', label: 'ชื่อบทความ', type: 'text' },
      { key: 'slug', label: 'ชื่อในลิงก์ (ภาษาอังกฤษ ตัวเล็ก ใช้ - คั่น)', type: 'text', help: 'เปลี่ยนแล้วลิงก์เดิมของบทความนี้จะใช้ไม่ได้' },
      { key: 'category', label: 'หมวด', type: 'select', options: () => ['ERP', 'POS', 'ข่าวสาร'].map(c => [c, c] as [string, string]) },
      { key: 'date', label: 'วันที่', type: 'text', help: 'รูปแบบ 2569-10-10 (ปี พ.ศ.-เดือน-วัน)' },
      { key: 'excerpt', label: 'ข้อความย่อ', type: 'textarea' },
      { key: 'body', label: 'เนื้อหา (แต่ละกล่อง = 1 ย่อหน้า)', type: 'strings', multiline: true },
    ],
  },
  {
    key: 'SERVICES', label: 'วิธีทำงานของเรา', group: 'หน้าอื่นๆ', kind: 'list', titleKey: 'title',
    blank: () => ({ title: 'บริการใหม่', text: '' }),
    fields: [{ key: 'title', label: 'ชื่อบริการ', type: 'text' }, { key: 'text', label: 'รายละเอียด', type: 'textarea' }],
  },
  {
    key: 'COURSES', label: 'หลักสูตรอบรม (ยังไม่เปิด)', group: 'หน้าอื่นๆ', kind: 'list', titleKey: 'title',
    blank: () => ({ id: `course-${Date.now().toString(36)}`, title: 'หลักสูตรใหม่', level: 'พื้นฐาน', hours: 4, price: 'ฟรี', topics: [''] }),
    fields: [
      { key: 'title', label: 'ชื่อหลักสูตร', type: 'text' }, { key: 'id', label: 'รหัสหลักสูตร', type: 'text' },
      { key: 'level', label: 'ระดับ', type: 'text' }, { key: 'hours', label: 'จำนวนชั่วโมง', type: 'number' },
      { key: 'price', label: 'ราคา', type: 'text' }, { key: 'topics', label: 'หัวข้อที่เรียน', type: 'strings' },
    ],
  },
]
