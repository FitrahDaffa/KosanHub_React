# KosanHub API

Backend REST API terpisah untuk project KosanHub. API memakai NestJS, PostgreSQL, dan Prisma ORM. Backend ini ditambahkan di folder `backend/`; project React di root tidak diubah.

## Kebutuhan

- Node.js 20 atau lebih baru
- Docker Desktop (atau server PostgreSQL lokal)

## Menjalankan

Dari folder project:

```powershell
cd backend
Copy-Item .env.example .env
docker compose up -d postgres
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run db:seed
npm run start:dev
```

API aktif di `http://localhost:3000/api`. Database memakai volume Docker agar isinya tetap ada setelah API atau container direstart. Untuk PostgreSQL lokal tanpa Docker, sesuaikan `DATABASE_URL` di `.env`.

## Halaman KosanHub yang memakai API

Frontend awal tetap utuh. Halaman tambahan yang terhubung langsung ke API tersedia sebagai entry point terpisah. Jalankan Vite dari folder project utama di terminal lain:

```powershell
cd ..
npm.cmd run dev
```

Buka `http://localhost:5173/kosanhub-api.html`. Halaman ini menampilkan ringkasan dari PostgreSQL dan menyediakan tambah, ubah, hapus, serta pencarian untuk kamar, penghuni, dan pembayaran.

Untuk membangun halaman API sebagai output mandiri:

```powershell
npx.cmd vite build --config vite.kosanhub-api.config.js
```

Screenshot desktop dan mobile tersimpan di `../screenshots/`.

## Endpoint

Semua endpoint menerima dan mengembalikan JSON. ID resource adalah UUID.

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| GET | `/api/rooms` | Daftar kamar; filter opsional `?type=standar` |
| GET, POST | `/api/rooms/:id`, `/api/rooms` | Detail dan tambah kamar |
| PATCH, DELETE | `/api/rooms/:id` | Ubah dan hapus kamar |
| GET | `/api/residents?search=andi` | Daftar/filter penghuni berdasarkan nama, telepon, atau nomor kamar |
| GET, POST | `/api/residents/:id`, `/api/residents` | Detail dan tambah penghuni |
| PATCH, DELETE | `/api/residents/:id` | Ubah dan hapus penghuni |
| GET | `/api/payments?status=LUNAS` | Daftar/filter pembayaran (`LUNAS`, `MENUNGGU`, `TERTUNDA`) |
| GET, POST | `/api/payments/:id`, `/api/payments` | Detail dan tambah pembayaran |
| PATCH, DELETE | `/api/payments/:id` | Ubah dan hapus pembayaran |
| GET | `/api/stats` | Jumlah kamar, penghuni, pembayaran, dan total pembayaran lunas |

Contoh tambah kamar:

```json
{ "number": "D01", "type": "Standar", "price": 500000 }
```

Contoh tambah penghuni (roomId boleh tidak diisi):

```json
{ "name": "Fajar Nugraha", "phone": "081234567890", "roomId": "UUID_KAMAR" }
```

Contoh pembayaran:

```json
{ "code": "BYR-006", "amount": 500000, "paidAt": "2026-10-06T00:00:00.000Z", "status": "MENUNGGU", "residentId": "UUID_PENGHUNI" }
```

Validasi request menolak properti yang tidak dikenal dan data yang tidak sesuai. Kamar yang dihapus akan melepaskan penghuni dari kamar; penghuni yang masih memiliki riwayat pembayaran tidak dapat dihapus sebelum pembayaran itu dikelola.

## Skema dan data awal

`prisma/schema.prisma` memuat model `Room`, `Resident`, dan `Payment` beserta relasinya. Jalankan `npx prisma migrate dev --name init` untuk membuat tabel dan menyimpan migrasi. `npm run db:seed` mengisi kamar dan penghuni awal KosanHub secara idempotent.
