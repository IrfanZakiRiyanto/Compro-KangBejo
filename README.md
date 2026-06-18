# 🌿 Kang Bejo — Company Profile & CMS Desa Wisata

Website **Company Profile & CMS Desa Wisata Kang Bejo Balikpapan** adalah platform digital interaktif yang dirancang untuk memperkenalkan potensi wisata alam, pertanian kangkung, edukasi budaya, serta fasilitas pendukung yang ada di Desa Wisata Kang Bejo, Balikpapan.

Website ini dilengkapi dengan **Admin Content Management System (CMS)** yang memungkinkan pengelola desa untuk memperbarui informasi website secara langsung (dinamis) tanpa perlu menyentuh kode program.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

Sistem ini dibangun menggunakan arsitektur modern berbasis client-server:

### 1. Backend (Server & API)
*   **FastAPI**: Framework Python yang berkinerja tinggi dan cepat untuk membuat REST API.
*   **SQLAlchemy ORM**: Untuk manajemen database dan pemetaan objek relasional.
*   **SQLite**: Database lokal default untuk pengembangan (development) tanpa perlu konfigurasi server database tambahan.
*   **PostgreSQL**: Database relasional berskala produksi yang didukung penuh untuk deployment cloud.
*   **Uvicorn**: Server ASGI yang cepat untuk menjalankan aplikasi FastAPI.
*   **Python-Jose & Bcrypt**: Digunakan untuk sistem otentikasi login admin yang aman (JWT Token).

### 2. Frontend (User Interface)
*   **React (Vite)**: Framework javascript modern untuk membangun antarmuka web SPA (Single Page Application) yang cepat dan responsif.
*   **Vanilla CSS**: Digunakan untuk styling premium bertema alam (*tourism-style*) dengan transisi visual yang halus, slider dinamis, serta tata letak responsif.
*   **HTML5 & Browser APIs**: Termasuk Google Maps Embed API ter-sanitasi dan pemilih tanggal (*Date Picker*) bawaan.

### 3. Deployment & DevOps
*   **Docker & Docker Compose**: Untuk containerisasi seluruh sistem agar mudah dijalankan di lingkungan manapun.
*   **GitHub Actions**: Pipeline integrasi berkelanjutan (CI/CD) untuk otomatisasi pengujian.

---

## 🚀 Cara Menjalankan Secara Lokal (Development)

Sistem ini mendukung setup instan menggunakan **SQLite** secara lokal sehingga Anda dapat menjalankannya dalam hitungan menit tanpa menginstal PostgreSQL.

### 📋 Prasyarat
Sebelum memulai, pastikan komputer Anda telah terinstal:
*   [Git](https://git-scm.com/)
*   [Python 3.10+](https://www.python.org/)
*   [Node.js 18+](https://nodejs.org/)

---

### 1. Jalankan Backend (FastAPI)
1. Buka terminal/command prompt, masuk ke folder `backend`:
   ```bash
   cd backend
   ```
2. Salin template konfigurasi `.env`:
   * **Windows (CMD/PowerShell)**:
     ```powershell
     copy .env.example .env
     ```
   * **Mac/Linux**:
     ```bash
     cp .env.example .env
     ```
3. Pastikan isi `DATABASE_URL` di dalam `backend/.env` menggunakan SQLite:
   ```env
   DATABASE_URL=sqlite:///./kangbejo.db
   ```
4. Instal dependencies Python yang diperlukan:
   ```bash
   pip install -r requirements.txt
   ```
5. Jalankan server FastAPI:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   * Backend berjalan di: **http://localhost:8000**
   * Dokumentasi interaktif Swagger UI: **http://localhost:8000/docs**
   * *Catatan: File database `kangbejo.db` dan data awal (seeding) otomatis terbentuk saat pertama kali backend dijalankan.*

---

### 2. Jalankan Frontend (React + Vite)
1. Buka terminal baru dan masuk ke folder `frontend`:
   ```bash
   cd frontend
   ```
2. Salin template konfigurasi `.env`:
   * **Windows (CMD/PowerShell)**:
     ```powershell
     copy .env.example .env
     ```
   * **Mac/Linux**:
     ```bash
     cp .env.example .env
     ```
3. Instal dependencies javascript:
   ```bash
   npm install
   ```
4. Jalankan server pembangunan lokal:
   ```bash
   npm run dev
   ```
   * Frontend berjalan di: **http://localhost:5173** (atau port lain yang tertera di terminal).

---

## 🔑 Akses Panel Admin (CMS)

Untuk mengelola seluruh konten website (Hero Slide, Profil Tentang Kami, Fasilitas, Kegiatan, Galeri Media, Berita, & Kontak):
1. Buka halaman admin di browser: **http://localhost:5173/admin**
2. Masukkan akun admin default berikut:
   * **Username**: `admin`
   * **Password**: `kangbejo2024`
3. Setelah login berhasil, Anda dapat langsung memperbarui konten website secara dinamis.

---

## 📁 Struktur Folder Proyek

```
Compro-KangBejo/
├── backend/
│   ├── main.py              # Entrypoint utama aplikasi FastAPI & Auto-Seeder
│   ├── admin_routes.py      # Route & logic API admin panel & publik
│   ├── database.py          # Konfigurasi koneksi database & session
│   ├── models.py            # Definisi tabel database (SQLAlchemy)
│   ├── schemas.py           # Skema Pydantic untuk validasi input/output
│   ├── crud.py              # Logika kueri database (Create, Read, Update, Delete)
│   └── requirements.txt     # Daftar dependensi Python
├── frontend/
│   ├── src/
│   │   ├── admin/           # Halaman & komponen Dashboard Admin (CMS)
│   │   ├── components/      # Komponen UI publik (Navbar, Hero, NewsSection, dll)
│   │   ├── pages/           # Halaman utama publik & detail berita
│   │   ├── services/        # Client API untuk request ke Backend
│   │   └── App.jsx          # Root Component React
│   ├── vite.config.js       # Konfigurasi build tool Vite
│   └── package.json         # Daftar dependensi Node.js
├── docs/                    # Dokumentasi tambahan proyek
├── docker-compose.yml       # Konfigurasi orkestrasi Docker
└── README.md                # Dokumentasi utama proyek
```
