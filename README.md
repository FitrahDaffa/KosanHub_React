# KosanHub

Aplikasi React + Vite untuk mengelola rumah kos, dengan REST API NestJS untuk data penghuni.

## Menjalankan aplikasi

Terminal 1 — backend:

```powershell
cd backend
npm install
npm run start:dev
```

API berjalan di `http://localhost:3001`. Data disimpan sementara dalam array memori dan kembali ke data awal saat server dimulai ulang.

Terminal 2 — frontend:

```powershell
npm install
npm run dev
```

Buka `http://localhost:5173`, lalu masuk ke menu **Data Penghuni** untuk menambah, mengubah, atau menghapus data melalui API.

## Endpoint penghuni

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| GET | `/penghuni` | Mengambil semua penghuni |
| GET | `/penghuni/:id` | Mengambil satu penghuni |
| POST | `/penghuni` | Menambahkan penghuni |
| PATCH | `/penghuni/:id` | Mengubah penghuni |
| DELETE | `/penghuni/:id` | Menghapus penghuni |

Request REST Client tersedia di `backend/requests.http`. DTO memvalidasi nama, nomor kamar, nomor telepon, tanggal masuk, dan status. Kamar yang sudah terisi menghasilkan `409 Conflict`; ID yang tidak ditemukan menghasilkan `404 Not Found`.

## Bukti tugas

Simpan screenshot request dan response GET semua, GET satu, POST, PATCH, DELETE, validasi gagal, serta konflik/404 di `docs/screenshots/`.
