# Qualification Verification System (ระบบตรวจสอบคุณวุฒิ)

เว็บแอปพลิเคชันฟูลสแตกสำหรับบริหารจัดการการตรวจสอบคุณวุฒิระหว่างหน่วยงานภายนอกและเจ้าหน้าที่มหาวิทยาลัย ประกอบด้วยแบ็กเอนด์ Node.js/Express + Prisma (เชื่อมต่อฐานข้อมูล MySQL) และฟรอนต์เอนด์ React (Vite)

## โครงสร้างโปรเจกต์

```
Qualification-Verification-System/
  Client/   ฟรอนต์เอนด์ React (Vite)
  Server/   แบ็กเอนด์ Express + Prisma ORM
```

## สิ่งที่ต้องเตรียมไว้ก่อน

- Node.js เวอร์ชัน 18 ขึ้นไป (แนะนำ LTS)
- npm (ติดมากับ Node.js)
- ฐานข้อมูล MySQL 8.x (อาจอยู่ในเครื่องหรือบนเซิร์ฟเวอร์) พร้อมให้ Prisma ทำ migrations
- ตัวเลือก: Bun หากต้องการใช้งาน `bun install` (ในเอกสารนี้อ้างอิงคำสั่ง npm เป็นหลัก)

## การตั้งค่าแบ็กเอนด์ (Server)

### 1. ติดตั้ง dependencies

```bash
cd Server
npm install
```

### 2. ตั้งค่าไฟล์ Environment

สร้างไฟล์ `.env` ภายในโฟลเดอร์ `Server/` (ไม่มีไฟล์ตัวอย่างให้) ตัวแปรต่อไปนี้ใช้ในระบบ Express, Prisma และบริการส่งอีเมล

| ชื่อตัวแปร | จำเป็น | ตัวอย่างค่า | คำอธิบาย |
| --- | --- | --- | --- |
| `PORT` | ไม่จำเป็น | `3001` | พอร์ตที่ `server.js` ใช้งาน (ค่าเริ่มต้น 3001 ถ้าไม่ระบุ) |
| `DATABASE_URL` | จำเป็น | `mysql://user:pass@localhost:3306/qualification` | สตริงเชื่อมต่อ MySQL ที่ Prisma ใช้งาน |
| `JWT_SECRET` | จำเป็น | `super-secret-key` | คีย์ลับสำหรับลงนามและตรวจสอบ JWT |
| `JWT_EXPIRES_IN` | ไม่จำเป็น | `2h` | อายุของโทเค็น รองรับรูปแบบของ `jsonwebtoken` (เช่น `15m`, `2h`, `1d`) |
| `FRONTEND_URL` | จำเป็น | `http://localhost:5173` | ต้นทางที่อนุญาตผ่าน CORS และใช้ฝังในลิงก์อีเมล |
| `LOGO_URL` | ไม่จำเป็น | `https://example.com/logo.png` | URL รูปภาพโลโก้ที่แนบในอีเมล |
| `SMTP_HOST` | จำเป็น (กรณีส่งอีเมล) | `smtp.mailtrap.io` | โฮสต์ SMTP สำหรับ Nodemailer |
| `SMTP_PORT` | จำเป็น (กรณีส่งอีเมล) | `587` | พอร์ต SMTP ต้องเป็นตัวเลข |
| `SMTP_SECURE` | จำเป็น (กรณีส่งอีเมล) | `false` | กำหนด `true` สำหรับ SMTPS (พอร์ต 465) หรือ `false` สำหรับพอร์ตปกติ |
| `SMTP_USER` | จำเป็น (กรณีส่งอีเมล) | `user@example.com` | ชื่อผู้ใช้/อีเมลผู้ส่ง SMTP |
| `SMTP_PASSWORD` | จำเป็น (กรณีส่งอีเมล) | `smtp-password` | รหัสผ่านหรือโทเค็น SMTP |
| `NODE_ENV` | ไม่จำเป็น | `development` | กำหนดให้ใช้คุกกี้แบบ secure เมื่อเป็น `production` |

ตัวอย่างโครงไฟล์ `.env`:

```env
# Server/.env
PORT=3001
DATABASE_URL=mysql://user:password@localhost:3306/qualification
JWT_SECRET=replace-with-strong-secret
JWT_EXPIRES_IN=2h
FRONTEND_URL=http://localhost:5173
LOGO_URL=https://example.com/logo.png
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=sender@example.com
SMTP_PASSWORD=your-smtp-password
NODE_ENV=development
```

### 3. เตรียมฐานข้อมูล

```bash
# ภายในโฟลเดอร์ Server/
npx prisma generate
npx prisma migrate deploy
```

คำสั่งนี้จะสร้าง Prisma Client และรัน migrations ใน `prisma/migrations` ควรรันเมื่อเริ่มต้นโปรเจกต์ใหม่หรือทุกครั้งที่ schema มีการเปลี่ยนแปลง

### 4. รันเซิร์ฟเวอร์

```bash
# โหมดพัฒนา (watch ไฟล์อัตโนมัติ)
npm run dev

# โหมด production-like
npm start
```

API จะให้บริการที่ `http://localhost:<PORT>` (ค่าเริ่มต้น `http://localhost:3001`) ไฟล์ที่ผู้ใช้ภายนอกอัปโหลดจะอยู่ในโฟลเดอร์ `Server/uploads`, `Server/uploads_certificate` และ `Server/uploads_FileExcel` ตรวจสอบให้โฟลเดอร์เหล่านี้สามารถเขียนได้เสมอ

### 5. คำสั่งเสริมที่มีประโยชน์

- `npm run lint` ตรวจสอบคุณภาพโค้ดด้วย ESLint
- `npx prisma studio` เปิด Prisma Studio เพื่อดูข้อมูลในฐานข้อมูลแบบกราฟิก

## การตั้งค่าฟรอนต์เอนด์ (Client)

### 1. ติดตั้ง dependencies

```bash
cd Client
npm install
```

### 2. ตั้งค่าไฟล์ Environment

สร้างไฟล์ `Client/.env` (Vite จะอ่านค่าที่ขึ้นต้นด้วย `VITE_`)

```env
# Client/.env
VITE_API_BASE_URL=http://localhost:3001
```

กำหนด `VITE_API_BASE_URL` ให้ชี้ไปยังต้นทางของแบ็กเอนด์ที่รันอยู่อย่างถูกต้อง (รวม protocol และ port)

### 3. รันฟรอนต์เอนด์

```bash
npm run dev
```

Vite จะเปิดให้ใช้งานที่ `http://localhost:5173` โดยอัตโนมัติ ใช้ `npm run build` เพื่อสร้างไฟล์ production ใน `Client/dist` และ `npm run preview` เพื่อทดสอบ bundle ดังกล่าว

### 4. คำสั่งเพิ่มเติม

- `npm run lint` ตรวจสอบคุณภาพโค้ด React ด้วย ESLint

## ขั้นตอนการรันระบบแบบครบชุด

1. เปิดบริการ MySQL และตรวจสอบว่าได้รัน `npx prisma migrate deploy` แล้ว
2. สตาร์ทแบ็กเอนด์ด้วย `npm run dev` ภายในโฟลเดอร์ `Server/`
3. สตาร์ทฟรอนต์เอนด์ด้วย `npm run dev` ภายในโฟลเดอร์ `Client/`
4. เข้าใช้งานที่ `http://localhost:5173` แล้วล็อกอินด้วยข้อมูลที่มีในฐานข้อมูล คำขอ API ทั้งหมดจะยิงไปยังปลายทางที่ตั้งไว้ใน `Client/.env`

## เคล็ดลับแก้ไขปัญหา

- **ปัญหา CORS หรือคุกกี้**: ตรวจสอบให้ `FRONTEND_URL` ตรงกับ origin จริงของฟรอนต์เอนด์ (protocol, host, port) หากพัฒนาในเครื่องควรเป็น `http://localhost:5173`
- **อีเมลส่งไม่ออก**: ตรวจค่า SMTP (host, port, secure) และยืนยันว่าข้อมูลผู้ใช้/รหัสผ่านถูกต้อง Nodemailer จะปฏิเสธการเชื่อมต่อที่ตั้งค่า TLS ไม่ตรง
- **JWT หมดอายุหรือไม่ผ่านการตรวจสอบ**: ให้แน่ใจว่า `JWT_SECRET` ใช้ค่าร่วมกันในทุกอินสแตนซ์ และ `JWT_EXPIRES_IN` อยู่ในรูปแบบที่ `jsonwebtoken` รองรับ
- **เชื่อมต่อฐานข้อมูลไม่ได้**: ตรวจสอบสิทธิ์ของผู้ใช้ MySQL ว่ามีสิทธิ์ `CREATE`, `ALTER`, `INSERT` และสิทธิ์อื่น ๆ ตามที่ migrations ต้องการ

หลังตั้งค่าเรียบร้อย คุณพร้อมสำหรับการพัฒนา ทดสอบ และนำระบบตรวจสอบคุณวุฒิไปใช้งานจริงแล้ว
