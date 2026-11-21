# KosanHub

Aplikasi pengelolaan rumah kos dengan React, Vite, NestJS, PostgreSQL, dan Prisma ORM. Halaman **Data Penghuni** memakai REST API; halaman tambahan `kosanhub-api.html` mengelola kamar, penghuni, dan pembayaran.

## Kebutuhan

- Node.js 20 atau lebih baru
- PostgreSQL 16 atau lebih baru, berjalan di port `5432`

## Menjalankan project

Siapkan koneksi database backend:

```powershell
cd backend
Copy-Item .env.example .env
```

Sesuaikan `DATABASE_URL` di `.env` dengan username dan password PostgreSQL lokal, lalu jalankan:

```powershell
npm.cmd install
npx.cmd prisma migrate dev --name KosanHub
npm.cmd run db:seed
npm.cmd run start:dev
```

API berjalan di `http://localhost:3001/api`.

Di terminal kedua, dari root project:

```powershell
npm.cmd install
npm.cmd run dev
```

Buka `http://localhost:5173`. Menu **Data Penghuni** menggunakan endpoint `/api/penghuni`. Halaman manajemen lengkap yang membaca data PostgreSQL ada di `http://localhost:5173/kosanhub-api.html`.

## Endpoint

Semua endpoint menggunakan JSON. ID menggunakan UUID.

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| GET, POST | `/api/penghuni` | Daftar dan tambah penghuni |
| GET, PATCH, DELETE | `/api/penghuni/:id` | Baca, ubah, dan hapus penghuni |
| GET, POST | `/api/rooms` | Daftar dan tambah kamar |
| GET, PATCH, DELETE | `/api/rooms/:id` | Baca, ubah, dan hapus kamar |
| GET, POST | `/api/residents` | Daftar dan tambah penghuni model relasional |
| GET, PATCH, DELETE | `/api/residents/:id` | Baca, ubah, dan hapus penghuni model relasional |
| GET, POST | `/api/payments` | Daftar dan tambah pembayaran |
| GET, PATCH, DELETE | `/api/payments/:id` | Baca, ubah, dan hapus pembayaran |
| GET | `/api/stats` | Ringkasan kamar, penghuni, pembayaran, dan total pembayaran lunas |

Filter tersedia di `GET /api/rooms?type=standar`, `GET /api/residents?search=andi`, dan `GET /api/payments?status=LUNAS`.

DTO memvalidasi request. Kamar yang sudah ditempati menghasilkan `409 Conflict`; data yang tidak ditemukan menghasilkan `404 Not Found`. Riwayat pembayaran mencegah penghuni dihapus sebelum pembayaran dikelola.

## Skema dan bukti

Skema Prisma dan migrasi ada di `backend/prisma/`. Request untuk endpoint penghuni tersedia di `backend/requests.http`. Screenshot tampilan desktop dan mobile ada di `screenshots/`; panduan screenshot request API ada di `docs/screenshots/README.md`.

Panduan backend lebih lengkap tersedia di [`backend/README.md`](backend/README.md).
