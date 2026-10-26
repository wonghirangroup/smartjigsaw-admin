// ข้อมูลทั้งเว็บอยู่ที่ไฟล์นี้ — เปลี่ยนชื่อแบรนด์ เบอร์โทร บริการ ข่าว ได้ที่นี่ที่เดียว
// (ข้อมูลบริษัท บริการ ผลงาน และช่องทางติดต่อ นำมาจากเว็บ Smart Jigsaw ฉบับเดิม — ช่องที่ยังไม่มีข้อมูลจริงเว้นว่างไว้ ไม่แสดงบนเว็บ)
import { Briefcase, ShoppingCart, Bot, Code, type LucideIcon } from 'lucide-react'

export const BRAND = {
  name: 'Smart Jigsaw',
  tagline: 'โซลูชันอัจฉริยะ เพื่ออนาคตที่ชาญฉลาดกว่า',
  company: 'Smart Jigsaw',
  address: '92/1 ถ.ปักธงชัย ต.ในเมือง อ.เมือง จ.นครราชสีมา 30000',
  taxId: '',
  salesPhone: '063-972-2228',
  servicePhone: '063-972-2228',
  email: '',
  line: '',
  hours: '',
}

// เมนู: to ว่าง = หัวข้อที่กดไม่ได้ (เปิดเมนูย่อยอย่างเดียว) · to ขึ้นต้น https:// = ลิงก์ออกไปเว็บอื่น (เปิดแท็บใหม่)
// children ซ้อนได้ 2 ชั้น (ชั้นที่ 2 แสดงเป็นเมนูแตกออกด้านข้าง)
export interface NavLeaf { label: string; to: string }
export interface NavChild extends NavLeaf { children?: NavLeaf[] }
export interface NavItem extends NavLeaf { children?: NavChild[] }

export interface Product {
  slug: string; name: string; short: string; summary: string; icon: LucideIcon; color: string
  features: string[]; modules: { title: string; text: string }[]; forWho: string
}

// บริการ 4 ด้านของ Smart Jigsaw (ชื่อ/คำอธิบายสั้นมาจากเว็บเดิม; รายละเอียดเสริมเป็นร่าง ให้ทีมตรวจและแก้ที่หน้าแอดมิน)
export const PRODUCTS: Product[] = [
  {
    slug: 'consulting', name: 'ที่ปรึกษาด้านธุรกิจ', short: 'วางแผนกลยุทธ์และโครงสร้างระบบธุรกิจ', icon: Briefcase, color: '#1369D5',
    summary: 'วางแผนกลยุทธ์และโครงสร้างระบบธุรกิจ เพื่อการเปลี่ยนผ่านสู่ยุคดิจิทัล โดยทำงานผสมผสานคน กระบวนการ และเทคโนโลยีเข้าด้วยกัน',
    forWho: 'องค์กรที่กำลังจะย้ายงานขึ้นระบบดิจิทัล และอยากได้คำแนะนำที่ตรงไปตรงมาก่อนตัดสินใจลงทุน',
    features: ['วางแผนกลยุทธ์และโครงสร้างระบบธุรกิจ', 'ออกแบบให้เข้ากับคน กระบวนการ และเทคโนโลยีขององค์กร', 'แนะนำเฉพาะโซลูชันที่ต้องใช้จริง ไม่เสนอโปรแกรมที่ไม่จำเป็น', 'วางโครงสร้างให้ขยายต่อได้ในอนาคต'],
    modules: [{ title: 'ทำความเข้าใจธุรกิจ', text: 'ดูกระบวนการทำงานและพฤติกรรมจริงของผู้ใช้งาน' }, { title: 'วางแผนกลยุทธ์', text: 'กำหนดเป้าหมายและลำดับการเปลี่ยนผ่านสู่ดิจิทัล' }, { title: 'ออกแบบโครงสร้างระบบ', text: 'วางผังระบบให้เรียบง่าย ใช้งานง่าย' }, { title: 'ลงมือทดสอบหน้างาน', text: 'ทดสอบร่วมกับบุคลากร แก้ประเด็นติดขัดและดูแลต่อเนื่อง' }],
  },
  {
    slug: 'erp-pos', name: 'พัฒนาระบบ ERP & POS', short: 'ระบบบริหารธุรกิจ พร้อมระบบขายหน้าร้าน', icon: ShoppingCart, color: '#1a3a8f',
    summary: 'ระบบบริหารธุรกิจที่ออกแบบเฉพาะสำหรับแต่ละองค์กร พร้อมระบบขายหน้าร้าน จัดการรับออเดอร์และคุมสต็อกได้ในระบบเดียวกัน',
    forWho: 'ธุรกิจค้าปลีกและองค์กรที่ต้องการให้ยอดขาย สต็อก และการเบิกจ่าย อยู่ในระบบเดียว',
    features: ['แบ่งหน่วยของสินค้าได้ เช่น ซื้อเป็นลัง ขายแยกชิ้น ตัดสต็อกและคำนวณต้นทุนแม่นยำ', 'Dashboard ติดตามยอดขาย รายจ่าย ต้นทุน และยอดสุทธิแบบเรียลไทม์ ผ่านมือถือ', 'รองรับ Cashless Payment และ QR PromptPay', 'ส่งออกรายงานภาษีและบัญชีอัตโนมัติ'],
    modules: [{ title: 'ขายหน้าร้าน (POS)', text: 'รับออเดอร์ รับชำระ และคุมสต็อกในระบบเดียว' }, { title: 'แบ่งหน่วยสินค้า', text: 'ตั้งหน่วยย่อยเพื่อคำนวณสต็อกและกำไรได้แม่นยำ' }, { title: 'คลังครุภัณฑ์และวัสดุ', text: 'ควบคุมสถานะการเบิกจ่าย ประวัติผู้ยืม และตรวจสต็อกประจำปี' }, { title: 'ติดตามการจัดส่ง', text: 'อัปเดตสถานะคิวจัดส่งเรียลไทม์และวางแผนเส้นทาง' }],
  },
  {
    slug: 'ai-agent', name: 'AI Agent & Automation', short: 'นำ AI มาเพิ่มประสิทธิภาพการทำงาน', icon: Bot, color: '#0F4C9A',
    summary: 'นำ AI มาช่วยเพิ่มประสิทธิภาพการทำงาน ลดต้นทุน และเพิ่มความเร็ว รวมถึงช่วยวิเคราะห์ข้อมูลเพื่อเสนอแนวทางการขาย',
    forWho: 'องค์กรที่มีงานซ้ำๆ หรือมีข้อมูลสะสมมาก และอยากให้ AI ช่วยลดภาระทีมงาน',
    features: ['AI วิเคราะห์ข้อมูลและนำเสนอแนวทางการขายอย่างชาญฉลาด', 'ระบบอัตโนมัติลดงานซ้ำและลดต้นทุน', 'เพิ่มความเร็วในการทำงานของทีม', 'ออกแบบให้เชื่อมกับระบบที่องค์กรใช้อยู่'],
    modules: [{ title: 'AI Agent', text: 'ผู้ช่วยอัจฉริยะที่ทำงานตามโจทย์เฉพาะขององค์กร' }, { title: 'Automation', text: 'ลำดับงานอัตโนมัติแทนงานทำมือซ้ำๆ' }, { title: 'วิเคราะห์ข้อมูล', text: 'สรุปข้อมูลเพื่อช่วยตัดสินใจ' }, { title: 'เชื่อมต่อระบบ', text: 'ทำงานร่วมกับ ERP & POS และระบบอื่น' }],
  },
  {
    slug: 'custom-software', name: 'พัฒนาซอฟต์แวร์เฉพาะทาง', short: 'สร้างระบบที่ตอบโจทย์เฉพาะขององค์กร', icon: Code, color: '#2A6FD6',
    summary: 'สร้างระบบเฉพาะที่ตอบโจทย์กระบวนการเฉพาะของแต่ละองค์กร เขียนบนมาตรฐานสากล เน้นระบบโมดูลาร์ที่ขยายได้',
    forWho: 'องค์กรที่โปรแกรมสำเร็จรูปไม่ตอบโจทย์ และต้องการระบบที่ออกแบบตามกระบวนการของตัวเอง',
    features: ['ออกแบบตามกระบวนการเฉพาะขององค์กร', 'เขียนโปรแกรมบนมาตรฐานสากล', 'โครงสร้างโมดูลาร์ รองรับการสเกลอัปในอนาคต', 'ใช้งานง่าย ทีมหน้างานเริ่มใช้ได้ทันที'],
    modules: [{ title: 'วิเคราะห์ความต้องการ', text: 'ทำความเข้าใจกระบวนการและผู้ใช้งานจริง' }, { title: 'ออกแบบและพัฒนา', text: 'สร้างระบบตามโจทย์ด้วยมาตรฐานสากล' }, { title: 'ทดสอบหน้างาน', text: 'ทดสอบร่วมกับบุคลากรและปรับแก้' }, { title: 'ต่อยอดระบบ', text: 'ขยายโมดูลเพิ่มได้เมื่อธุรกิจเติบโต' }],
  },
]

// โปรแกรมสำเร็จรูปของ Smart Jigsaw — แถบปุ่มใต้ Hero หน้าแรก (เพิ่ม/ลบ/แก้ได้ที่แอดมิน หมวด "โปรแกรมของเรา")
// to: ลิงก์เว็บของโปรแกรมนั้น (https://… เปิดแท็บใหม่) — ว่าง = ไปหน้าติดต่อเรา · logo: โลโก้ PNG พื้นโปร่ง (ไม่ใส่ = แสดงชื่อเป็นตัวอักษร)
export interface Program { name: string; tagline: string; color: string; color2: string; logo?: string; to: string }
export const PROGRAMS: Program[] = [
  { name: 'GrowStore', tagline: 'ระบบขายหน้าร้านสำหรับร้านปลีก (POS)', color: '#EA580C', color2: '#F5A623', to: '' },
  { name: 'Yoonai', tagline: 'ระบบเช็กชื่อ ลางาน และ HR ผ่าน LINE', color: '#244B83', color2: '#2DA6DD', to: '' },
  { name: 'Weajer', tagline: 'ระบบบริหารงานหน่วยรถและติดตาม GPS', color: '#0E7C70', color2: '#3DBE8F', to: '' },
  { name: 'SyncZag', tagline: 'ระบบบริหารโปรเจกต์ งาน และเอกสารทีม', color: '#D93A22', color2: '#FF6A3D', to: '' },
]

export interface Article { slug: string; title: string; category: 'ERP' | 'POS' | 'ข่าวสาร'; date: string; excerpt: string; body: string[] }

// บทความตัวอย่างเชิงความรู้ทั่วไป (ไม่ได้อ้างถึงลูกค้าหรือรางวัลของบริษัท) — แก้/ลบ/เพิ่มของจริงที่หน้าแอดมิน
export const ARTICLES: Article[] = [
  { slug: 'pos-promotion-tips', title: '5 วิธีตั้งโปรโมชันหน้าร้านโดยไม่ขาดทุน', category: 'POS', date: '2569-10-05', excerpt: 'ตั้งส่วนลดอย่างไรให้ยอดขายเพิ่มแต่ยังรักษากำไรขั้นต้น', body: ['โปรโมชันที่ดีควรเริ่มจากต้นทุนจริงของสินค้า ไม่ใช่ราคาป้าย ตรวจกำไรขั้นต้นหลังหักส่วนลดก่อนเปิดใช้เสมอ', 'ใช้ระบบสมาชิกเพื่อให้ส่วนลดเฉพาะกลุ่ม แทนการลดทั้งร้าน และกำหนดวันหมดอายุของโปรโมชันทุกครั้ง', 'ดูรายงานยอดขายตามโปรโมชันรายสัปดาห์ แล้วยกเลิกรายการที่ไม่ทำให้ปริมาณขายเพิ่มจริง'] },
  { slug: 'stock-count-tips', title: 'ตรวจนับสต็อกอย่างไรไม่ให้ร้านหยุดขาย', category: 'ERP', date: '2569-09-12', excerpt: 'แบ่งโซนนับ-นับสลับรอบ และใช้ส่วนต่างเป็นสัญญาณหาจุดรั่ว', body: ['การนับทั้งคลังพร้อมกันทำให้ต้องปิดร้าน ลองแบ่งเป็นโซนและนับต่อเนื่องตามรอบสัปดาห์ แทนการนับใหญ่ปีละครั้ง', 'เมื่อพบส่วนต่าง อย่าปรับยอดทันที ให้ย้อนดูเอกสารรับ-จ่ายของสินค้านั้นก่อน เพราะส่วนใหญ่มาจากการคีย์ผิดหน่วย', 'ระบบที่บันทึกผู้ทำรายการและเวลาจะช่วยไล่หาต้นเหตุได้เร็วขึ้นมาก'] },
  { slug: 'month-end-close-checklist', title: 'เช็กลิสต์ปิดงบสิ้นเดือนให้เสร็จใน 3 วัน', category: 'ERP', date: '2569-10-10', excerpt: 'ลำดับงานที่ฝ่ายบัญชีควรทำก่อน-หลัง เพื่อไม่ต้องย้อนแก้ตัวเลขตอนใกล้ส่ง', body: ['การปิดงบที่ช้ามักไม่ได้เกิดจากจำนวนรายการ แต่เกิดจากข้อมูลต้นทางที่ยังไม่นิ่ง เช่น ใบส่งของที่ยังไม่ออกบิล หรือสต็อกที่ยังไม่ตรวจนับ', 'เริ่มจากล็อกช่วงบัญชีฝั่งขายและซื้อก่อน แล้วจึงกระทบยอดธนาคาร ตามด้วยปรับปรุงรายการค้างรับค้างจ่าย และตรวจรายงานงบทดลองอีกรอบ', 'ระบบ ERP ที่ผูกงานขาย ซื้อ และคลังเข้ากับบัญชีโดยตรง ช่วยตัดขั้นตอนคีย์ซ้ำ และทำให้ตัวเลขที่ผู้บริหารเห็นตรงกับที่บัญชีปิด'] },
]

// วิธีทำงานของเรา — จากค่านิยม 4 ข้อของ Smart Jigsaw
export const SERVICES = [
  { title: 'ความเรียบง่าย (Simplicity)', text: 'คิดค้นและออกแบบโครงสร้างระบบให้เข้าใจง่าย ใช้งานง่าย ไม่สลับซับซ้อน เพื่อให้ทีมงานหน้างานเริ่มใช้ได้ทันที' },
  { title: 'ความจริงใจ (Sincerity)', text: 'แนะนำโซลูชันที่ต้องการใช้งานจริงอย่างเปิดเผย ตรงไปตรงมา ปราศจากโปรแกรมที่ไม่จำเป็น เพื่อประหยัดงบและรักษาความไว้วางใจ' },
  { title: 'การลงมือทำจริง (Action-Oriented)', text: 'ลงมือทดสอบระบบหน้างานจริงร่วมกับบุคลากร ช่วยแก้ไขประเด็นติดขัด และดูแลอย่างเป็นกันเองเสมอ' },
  { title: 'ความยั่งยืน (Sustainability)', text: 'เขียนโปรแกรมบนมาตรฐานสากล มุ่งเน้นระบบโมดูลาร์ที่ขยายได้ เพื่อรองรับการสเกลอัปหรือต่อยอดในอนาคตอย่างราบรื่น' },
]

// ยังไม่มีหลักสูตรอบรม — เพิ่มที่หน้าแอดมินเมื่อพร้อม (ว่าง = หน้าอบรมแสดงข้อความ "เร็วๆ นี้")
export const COURSES: { id: string; title: string; level: string; hours: number; price: string; topics: string[] }[] = []

export const NAV: NavItem[] = [
  { label: 'บริการของเรา', to: '/products', children: PRODUCTS.map(p => ({ label: p.name, to: `/products/${p.slug}` })) },
  { label: 'ผลงาน', to: '/#works' },
  { label: 'วิธีทำงาน', to: '/services' },
  { label: 'เกี่ยวกับ', to: '', children: [{ label: 'เกี่ยวกับเรา', to: '/about' }, { label: 'ศูนย์ความรู้', to: '/knowledge' }] },
  { label: 'ติดต่อเรา', to: '/contact' },
]

// ช่องทางโซเชียลบน topbar — ใส่ลิงก์จริงที่หน้าแอดมิน (ว่าง = ไม่แสดง)
export const SOCIAL: { label: string; href: string }[] = []

// ตัวอย่างผลงาน/การใช้งานระบบ — ใส่ youtubeId (ส่วนท้ายของลิงก์ YouTube) เพื่อให้กดเล่นได้ ถ้าเว้นว่างจะแสดงป้าย "เร็วๆ นี้"
export interface Video { title: string; text: string; duration: string; product: string; youtubeId: string; file?: string; thumb?: string }
export const VIDEOS: Video[] = [
  { title: 'ระบบ POS ที่ออกแบบมาเพื่อธุรกิจของคุณ', text: 'จัดการรับออเดอร์และคุมสต็อกได้ในระบบเดียวกัน', duration: '', product: 'erp-pos', youtubeId: '' },
  { title: 'แบ่งหน่วยของสินค้าได้', text: 'ซื้อเป็นลัง ขายแยกชิ้น ตัดสต็อกและคำนวณต้นทุนแม่นยำ', duration: '', product: 'erp-pos', youtubeId: '' },
  { title: 'Dashboard ที่เข้าใจง่าย', text: 'ติดตามยอดขาย รายจ่าย ต้นทุน และยอดสุทธิรายวันผ่านมือถือ', duration: '', product: 'erp-pos', youtubeId: '' },
  { title: 'จัดการคลังครุภัณฑ์และวัสดุ', text: 'ควบคุมการเบิกจ่าย ประวัติผู้ยืม และร่นเวลาทำสต็อกประจำปี', duration: '', product: 'erp-pos', youtubeId: '' },
  { title: 'ติดตามการจัดส่งได้ทุกขั้นตอน', text: 'อัปเดตสถานะคิวจัดส่งเรียลไทม์ วางแผนเส้นทางอัตโนมัติ', duration: '', product: 'erp-pos', youtubeId: '' },
  { title: 'AI เข้าช่วยเพิ่มยอดขาย', text: 'วิเคราะห์ข้อมูลและนำเสนอแนวทางการขายอย่างชาญฉลาด', duration: '', product: 'ai-agent', youtubeId: '' },
]

// พื้นที่โฆษณา/โปรโมชัน — ใส่ image (ไฟล์ใน public/ เช่น '/img/ad1.jpg') เพื่อใช้ภาพจริง; ไม่ใส่จะใช้สีไล่เฉด
export interface Ad { title: string; text: string; cta: string; to: string; color: string; image?: string }
export const ADS: Ad[] = [
  { title: 'ระบบ POS ที่ออกแบบมาเพื่อธุรกิจของคุณ', text: 'จัดการรับออเดอร์และคุมสต็อกได้ในระบบเดียวกัน ครบจบในระบบเดียว', cta: 'ดูรายละเอียด', to: '/products/erp-pos', color: '#1369D5' },
  { title: 'AI เข้าช่วยเพิ่มยอดขาย', text: 'วิเคราะห์ข้อมูลและนำเสนอแนวทางการขายอย่างชาญฉลาด', cta: 'ดู AI Agent', to: '/products/ai-agent', color: '#0B1E36' },
  { title: 'ติดตามการจัดส่งได้ทุกขั้นตอน', text: 'อัปเดตสถานะคิวจัดส่งเรียลไทม์ วางแผนเส้นทางอัตโนมัติ', cta: 'ปรึกษาทีมงาน', to: '/contact', color: '#0F4C9A' },
]

export const COMPANY = {
  heading: 'เทคโนโลยีคือชิ้นส่วนจิ๊กซอว์ที่ทรงพลัง',
  text: ['Smart Jigsaw คือบริษัทที่ปรึกษาด้านเทคโนโลยีดิจิทัล ก่อตั้งขึ้นบนความเชื่อว่าเทคโนโลยีไม่ใช่เพียงเครื่องมือ แต่คือชิ้นส่วนจิ๊กซอว์ที่ช่วยขับเคลื่อนธุรกิจสู่ยุคดิจิทัลอย่างยั่งยืน', 'เราไม่ได้พัฒนาระบบลอยๆ แต่ทำงานผสมผสานคน กระบวนการ และเทคโนโลยี ออกแบบฟังก์ชันที่หยิบจับง่าย เข้าใจพฤติกรรมจริงของผู้ใช้งาน เพื่อให้ทุกชิ้นส่วนทางธุรกิจประกบเข้าหากันได้อย่างสวยงาม'],
  stats: [{ n: 'เรียบง่าย', label: 'Simplicity' }, { n: 'จริงใจ', label: 'Sincerity' }, { n: 'ลงมือทำจริง', label: 'Action-Oriented' }, { n: 'ยั่งยืน', label: 'Sustainability' }],
  image: undefined as string | undefined,
}

// ลูกค้า/กิจกรรม/ข่าว — ยังไม่มีข้อมูลจริง ปล่อยว่างไว้ (ส่วนนั้นจะไม่แสดงบนเว็บ) เพิ่มที่หน้าแอดมินเมื่อพร้อม
export interface Customer { name: string; logo?: string; place?: string; text?: string; image?: string; color?: string }
export const CUSTOMERS: Customer[] = []

export interface EventItem { title: string; date: string; place: string; text: string; image?: string; color: string }
export const EVENTS: EventItem[] = []

export interface NewsItem { title: string; outlet: string; date: string; text: string; image?: string; color: string }
export const NEWS: NewsItem[] = []

// สไลด์ Hero หน้าแรก — image (ไม่บังคับ) จะแสดงเป็นภาพพื้นหลัง/ภาพประกอบแทนไอคอน
export interface HeroSlide {
  tag: string; title: string; lead: string; color: string; image?: string
  imageZoom?: number; imageX?: number; imageY?: number     // โหมดแบนเนอร์: ซูม (%) และจุดโฟกัส (% ซ้าย→ขวา / บน→ล่าง) บนเดสก์ท็อป
  mobileZoom?: number; mobileX?: number; mobileY?: number // เช่นเดียวกัน สำหรับมือถือ/แท็บเล็ต (จอ ≤ 920px)
  buttons?: 'show' | 'hide'      // ปุ่มบนสไลด์ (ไม่ใส่ = แสดง)
  overlayText?: 'show' | 'hide'  // ป้าย/หัวข้อ/คำอธิบายบนสไลด์ (ซ่อน = ยังคงไว้ให้โปรแกรมอ่านหน้าจอและ SEO)
  shade?: 'on' | 'off' // โหมดแบนเนอร์เต็มจอ: เงาทึบทับภาพ (ไม่ใส่ = เปิด)
  imageMobile?: string // โหมดโปสเตอร์: ภาพสำหรับมือถือ (ถ้าไม่ใส่ ใช้ภาพหลักย่อลง)
  primaryLabel: string; primaryTo: string; secondaryLabel: string; secondaryTo: string
  chip1: string; chip2: string
}
export const HERO: HeroSlide[] = [
  { tag: 'ที่ปรึกษาด้านธุรกิจ', title: 'เปลี่ยนผ่านสู่ยุคดิจิทัลอย่างมั่นใจ ด้วยแผนที่เหมาะกับธุรกิจคุณ', lead: 'วางแผนกลยุทธ์และโครงสร้างระบบธุรกิจ ผสมผสานคน กระบวนการ และเทคโนโลยี', color: '#1369D5', primaryLabel: 'เรียนรู้เพิ่มเติม', primaryTo: '/products/consulting', secondaryLabel: 'ติดต่อเรา', secondaryTo: '/contact', chip1: 'กลยุทธ์', chip2: 'โครงสร้างระบบ' },
  { tag: 'ERP & POS', title: 'ขายหน้าร้านและคุมสต็อกได้ในระบบเดียว', lead: 'ระบบบริหารธุรกิจที่ออกแบบเฉพาะสำหรับแต่ละองค์กร พร้อมระบบขายหน้าร้าน', color: '#1a3a8f', primaryLabel: 'เรียนรู้เพิ่มเติม', primaryTo: '/products/erp-pos', secondaryLabel: 'ติดต่อเรา', secondaryTo: '/contact', chip1: 'QR PromptPay', chip2: 'Dashboard' },
  { tag: 'AI Agent & Automation', title: 'ให้ AI ช่วยเพิ่มประสิทธิภาพ ลดต้นทุน และเพิ่มความเร็ว', lead: 'นำ AI มาช่วยงานซ้ำๆ และวิเคราะห์ข้อมูลเพื่อเสนอแนวทางการขาย', color: '#0F4C9A', primaryLabel: 'เรียนรู้เพิ่มเติม', primaryTo: '/products/ai-agent', secondaryLabel: 'ติดต่อเรา', secondaryTo: '/contact', chip1: 'AI Agent', chip2: 'Automation' },
  { tag: 'ซอฟต์แวร์เฉพาะทาง', title: 'ระบบที่สร้างตามกระบวนการของคุณโดยเฉพาะ', lead: 'พัฒนาบนมาตรฐานสากล เน้นระบบโมดูลาร์ที่ขยายต่อได้', color: '#2A6FD6', primaryLabel: 'เรียนรู้เพิ่มเติม', primaryTo: '/products/custom-software', secondaryLabel: 'ติดต่อเรา', secondaryTo: '/contact', chip1: 'โมดูลาร์', chip2: 'มาตรฐานสากล' },
]

// หัวข้อและคำอธิบายของแต่ละส่วนในหน้าแรก
export const HOME = {
  programsTitle: 'โปรแกรมสำเร็จรูปของ Smart Jigsaw',
  videosTitle: 'ตัวอย่างผลงานและการใช้งานระบบ', videosText: 'ฟังก์ชันที่ใช้งานจริงในระบบของเรา',
  companyTag: 'Smart Jigsaw',
  customersTitle: 'ลูกค้าของเรา', customersText: 'ธุรกิจที่ไว้วางใจให้เราดูแลระบบ',
  eventsTitle: 'กิจกรรมและงานสัมมนา', eventsText: 'เข้าร่วมเพื่อเรียนรู้การใช้ระบบและพบทีมงานของเรา',
  newsTitle: 'ข่าวและสื่อ', newsText: 'ข่าวประชาสัมพันธ์และบทสัมภาษณ์ล่าสุด',
  contactTitle: 'คุยกับทีมงานของเรา', contactText: 'บอกโจทย์ธุรกิจของคุณ แล้วเราจะแนะนำโซลูชันที่เหมาะสม',
}

// ---- ธีม: สี ฟอนต์ ขนาด — แอดมินปรับได้ (หมวด "ธีม") แล้ว applyTheme() เขียนลงตัวแปร CSS ที่ :root ----
export const FONT_CHOICES = ['Kanit', 'Prompt', 'Sarabun', 'Noto Sans Thai', 'IBM Plex Sans Thai', 'Mitr', 'Athiti', 'Mali', 'Pridi', 'Chonburi'] as const
export const THEME = {
  primary: '#1369d5', primaryInk: '#0d52ad', accent: '#e0641f', ink: '#0b1e36', ink2: '#44546f', ground: '#f5f7fa',
  surface: '#ffffff',   // พื้นการ์ด/แถบเมนู/ช่องกรอก (ธีมเข้ม = กรมท่าอ่อน)
  text: '#0b1e36',      // สีตัวอักษรเนื้อความ (ธีมเข้ม = ขาว)
  onPrimary: '#ffffff', // สีตัวอักษรบนปุ่มสีหลัก/สีเน้น (สีส้มสว่างควรใช้ตัวอักษรกรมท่า)
  buttonShape: 'rounded' as 'rounded' | 'pill', // ปุ่มมุมโค้ง หรือทรงแคปซูล
  heroStyle: 'split' as 'split' | 'banner' | 'poster',      // Hero แบบข้อความ+ภาพข้าง หรือแบบแบนเนอร์เต็มจอ ข้อความชิดล่างซ้าย
  fontHead: 'Kanit', fontBody: 'Kanit',
  bodyWeight: 400,   // น้ำหนักตัวอักษรเนื้อความ 400/500/600 (ธีมเข้มควรใช้ 500 ขึ้นไปให้อ่านชัด)
  textScale: 100,    // % ขนาดตัวอักษรทั้งเว็บ (80–130)
  headScale: 100,    // % ขนาดหัวข้อเพิ่มเติม (70–140)
  radius: 14,        // px ความโค้งของการ์ด/ปุ่ม (0–28)
  sectionSpace: 84,  // px ระยะบน-ล่างของแต่ละส่วน ค่าสูงสุดบนจอกว้าง (40–140)
  maxWidth: 1180,    // px ความกว้างเนื้อหาสูงสุด (1000–1400)
}
const clampNum = (v: unknown, min: number, max: number, d: number) => { const n = Number(v); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : d }
const okColor = (v: unknown, d: string) => (typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v) ? v : d)
const okFont = (v: unknown, d: string) => ((FONT_CHOICES as readonly string[]).includes(String(v)) ? String(v) : d)

function loadFont(name: string) {
  if (name === 'Kanit' || typeof document === 'undefined') return // Kanit โหลดอยู่ใน index.html แล้ว
  const id = `font-${name.replace(/\s+/g, '-')}`
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id; link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${name.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`
  document.head.appendChild(link)
}

// ค่าที่ไม่ถูกต้อง (สีผิดรูปแบบ ฟอนต์นอกรายการ ตัวเลขเกินช่วง) จะถูกแทนด้วยค่าเริ่มต้น/ตัดให้อยู่ในช่วง — กันค่าที่แอดมินกรอกผิดทำให้เว็บพัง
export function applyTheme(t: Partial<typeof THEME> = THEME) {
  if (typeof document === 'undefined') return
  const D = { primary: '#1369d5', primaryInk: '#0d52ad', accent: '#e0641f', ink: '#0b1e36', ink2: '#44546f', ground: '#f5f7fa', fontHead: 'Kanit', fontBody: 'Kanit' }
  const st = document.documentElement.style
  st.setProperty('--primary', okColor(t.primary, D.primary))
  st.setProperty('--primary-ink', okColor(t.primaryInk, D.primaryInk))
  st.setProperty('--accent', okColor(t.accent, D.accent))
  st.setProperty('--ink', okColor(t.ink, D.ink))
  st.setProperty('--ink-2', okColor(t.ink2, D.ink2))
  st.setProperty('--ground', okColor(t.ground, D.ground))
  const surface = okColor(t.surface, '#ffffff')
  st.setProperty('--surface', surface)
  st.setProperty('--card', surface)
  st.setProperty('--text', okColor(t.text, D.ink))
  st.setProperty('--on-primary', okColor(t.onPrimary, '#ffffff'))
  const rad = clampNum(t.radius, 0, 28, 14)
  st.setProperty('--btn-radius', t.buttonShape === 'pill' ? '999px' : `${Math.round(rad * 0.8)}px`)
  document.documentElement.dataset.hero = t.heroStyle === 'banner' || t.heroStyle === 'poster' ? t.heroStyle : 'split'
  // กลับสีโลโก้ (โลโก้เป็นสีเข้ม) ให้เห็นบนพื้นเข้ม
  const lumOf = (h: string) => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] }
  const dark = lumOf(surface) < 0.25
  st.setProperty('--logo-filter', dark ? 'brightness(0) invert(1)' : 'none')
  // ธีมเข้ม: เส้นขอบสว่างชัดขึ้น · แถบ/หัวหน้าย่อยเป็นไล่เฉดน้ำเงินสว่างกว่าพื้น · ท้ายเว็บมีเส้นสีเน้นด้านบน · การ์ดมีเงา — กันทุกอย่างกลืนเป็นสีเดียวกัน
  if (dark) {
    st.setProperty('--line', 'color-mix(in srgb, #ffffff 24%, var(--surface))')
    st.setProperty('--band-bg', 'linear-gradient(120deg, color-mix(in srgb, #4f6bd6 45%, var(--surface)), color-mix(in srgb, #4f6bd6 75%, var(--surface)))')
    st.setProperty('--footer-border', '4px solid var(--accent)')
    st.setProperty('--card-shadow', '0 10px 28px rgba(0, 0, 0, 0.35)')
  } else {
    ;['--line', '--band-bg', '--footer-border', '--card-shadow'].forEach(k => st.removeProperty(k))
  }
  st.setProperty('--body-weight', String([400, 500, 600].includes(Number(t.bodyWeight)) ? Number(t.bodyWeight) : 400))
  const fh = okFont(t.fontHead, D.fontHead), fb = okFont(t.fontBody, D.fontBody)
  loadFont(fh); loadFont(fb)
  st.setProperty('--font-head', `'${fh}', 'Noto Sans Thai', system-ui, sans-serif`)
  st.setProperty('--font-body', `'${fb}', 'Noto Sans Thai', system-ui, sans-serif`)
  st.setProperty('--text-scale', String(clampNum(t.textScale, 80, 130, 100) / 100))
  st.setProperty('--head-scale', String(clampNum(t.headScale, 70, 140, 100) / 100))
  st.setProperty('--radius', `${clampNum(t.radius, 0, 28, 14)}px`)
  st.setProperty('--section-y', `${clampNum(t.sectionSpace, 40, 140, 84)}px`)
  st.setProperty('--maxw', `${clampNum(t.maxWidth, 1000, 1400, 1180)}px`)
}

// ---- ระบบแอดมิน: ค่าที่แอดมินแก้ไขได้ เก็บที่ server และถูกนำมาทับค่าเริ่มต้นข้างบนตอนเปิดเว็บ ----
// แก้ค่าใน object/array เดิมโดยตรง (ไม่สร้างใหม่) เพื่อให้ทุกหน้าที่ import อยู่แล้วเห็นค่าใหม่
export const EDITABLE: Record<string, unknown> = { THEME, PROGRAMS, NAV, BRAND, SOCIAL, HERO, HOME, VIDEOS, ADS, COMPANY, CUSTOMERS, EVENTS, NEWS, PRODUCTS, ARTICLES, SERVICES, COURSES }

let navCustom = false
export function applyOverride(key: string, value: unknown) {
  if (key === 'NAV') navCustom = true
  const target = EDITABLE[key]
  if (target === undefined) return
  if (key === 'PRODUCTS' && Array.isArray(value)) {
    // สินค้าจับคู่ด้วย slug และคงไอคอนเดิมไว้ (ไอคอนเป็นคอมโพเนนต์ เก็บเป็น JSON ไม่ได้)
    for (const v of value as Partial<Product>[]) {
      const p = PRODUCTS.find(x => x.slug === v.slug)
      if (p) Object.assign(p, { ...v, icon: p.icon, slug: p.slug })
    }
  } else if (Array.isArray(target) && Array.isArray(value)) {
    target.splice(0, target.length, ...value)
  } else if (target && typeof target === 'object' && value && typeof value === 'object' && !Array.isArray(value)) {
    Object.assign(target, value)
  }
  if (key === 'PRODUCTS' && !navCustom) {
    const nav = NAV.find(n => n.to === '/products')
    if (nav) nav.children = PRODUCTS.map(p => ({ label: p.name, to: `/products/${p.slug}` }))
  }
}

export function applyOverrides(all: Record<string, unknown>) {
  navCustom = 'NAV' in all
  // NAV ใช้ทีหลังสุด เพื่อให้เมนูที่แอดมินจัดเองไม่ถูกสร้างทับจากรายชื่อสินค้า
  for (const [k, v] of Object.entries(all)) if (k !== 'NAV') applyOverride(k, v)
  if ('NAV' in all) applyOverride('NAV', all.NAV)
}

// กันลิงก์/รูปที่แอดมินกรอกมาไม่ปลอดภัย (javascript: ฯลฯ) — ใช้กับทุก href และ url ที่มาจากข้อมูล
// หน้าแอดมินอยู่คนละโดเมน (VITE_API_URL) — ไฟล์ที่อัปโหลดจึงต้องโหลดจากโดเมนนั้น
export const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '')
export const safeUrl = (u?: string) => {
  if (!u || !/^(\/(?!\/)|https?:\/\/|tel:|mailto:)/.test(u)) return undefined
  return u.startsWith('/uploads/') ? API_BASE + u : u
}
export const cssUrl = (u?: string) => { const s = safeUrl(u); return s ? `url("${encodeURI(s).replace(/"/g, '%22')}")` : undefined }

export const thaiDate =(iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  const M = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  return `${d} ${M[m - 1]} ${y}`
}
