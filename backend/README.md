# KosanHub API

REST API NestJS dengan PostgreSQL dan Prisma ORM. API memakai port `3001` dan prefix `/api`, termasuk endpoint `/api/penghuni` yang digunakan halaman **Data Penghuni** pada aplikasi React.

## Menyiapkan database dan menjalankan API

1. Buat database `kosanhub` di PostgreSQL.
2. Salin `.env.example` ke `.env` dan sesuaikan `DATABASE_URL` dengan kredensial PostgreSQL lokal.
3. Jalankan perintah berikut dari folder `backend`:

```powershell
npm.cmd install
npx.cmd prisma migrate dev --name KosanHub
npx.cmd prisma generate
npm.cmd run db:seed
npm.cmd run start:dev
```

API tersedia di `http://localhost:3001/api`. Data disimpan permanen di PostgreSQL dan tidak hilang saat server dimulai ulang.

Di terminal kedua, jalankan frontend dari root project dengan `npm.cmd run dev`, lalu buka `http://localhost:5173`. Menu **Data Penghuni** tersambung ke endpoint `/api/penghuni`. Halaman tambahan untuk CRUD kamar, penghuni, pembayaran, filter, dan statistik ada di `http://localhost:5173/kosanhub-api.html`.

Untuk PostgreSQL via Docker, file `docker-compose.yml` menyiapkan PostgreSQL 16 di port `5432` dengan volume persisten. Jika PostgreSQL lokal sudah berjalan, tidak perlu menjalankan Docker Compose.

## Endpoint

Semua endpoint menerima dan mengembalikan JSON; ID resource adalah UUID.

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| GET, POST | `/api/penghuni` | Daftar dan tambah penghuni dengan room, tanggal masuk, dan status |
| GET, PATCH, DELETE | `/api/penghuni/:id` | Baca, ubah, dan hapus penghuni |
| GET, POST | `/api/rooms` | Daftar/filter dan tambah kamar |
| GET, PATCH, DELETE | `/api/rooms/:id` | Baca, ubah, dan hapus kamar |
| GET, POST | `/api/residents` | Daftar/filter dan tambah penghuni relasional |
| GET, PATCH, DELETE | `/api/residents/:id` | Baca, ubah, dan hapus penghuni |
| GET, POST | `/api/payments` | Daftar/filter dan tambah pembayaran |
| GET, PATCH, DELETE | `/api/payments/:id` | Baca, ubah, dan hapus pembayaran |
| GET | `/api/stats` | Ringkasan jumlah dan total pembayaran lunas |

Filter: `GET /api/rooms?type=standar`, `GET /api/residents?search=andi`, `GET /api/payments?status=LUNAS`.

Kamar yang sudah dihuni menghasilkan `409 Conflict`; kamar yang tidak ada menghasilkan `404 Not Found`. Penghuni yang punya riwayat pembayaran tidak bisa dihapus sebelum transaksi tersebut dikelola.

## Migrasi dan data awal

`prisma/schema.prisma` berisi model `Room`, `Resident`, dan `Payment`. Migrasi tersimpan di `prisma/migrations/`; `npm.cmd run db:seed` mengisi data contoh KosanHub secara idempotent. Request API penghuni tersedia di `requests.http`.

Screenshot desktop dan mobile untuk halaman API ada di `../screenshots/`. Panduan screenshot request/response ada di `../docs/screenshots/README.md`.
