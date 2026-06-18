# 📖 Panduan Menjalankan Website & Masuk Admin Panel Secara Lokal

Panduan ini ditujukan untuk rekan tim yang baru pertama kali mendownload/clone repository proyek ini dan ingin menjalankan website secara lokal untuk memasukkan konten-konten Desa Wisata Kang Bejo.

---

## 🛠️ Prasyarat (Prerequisites)
Sebelum memulai, pastikan komputer/laptop Anda sudah terinstall:
1. **Git**: Untuk mendownload source code. [Download Git](https://git-scm.com/)
2. **Python (versi 3.10 ke atas)**: Untuk menjalankan server backend. [Download Python](https://www.python.org/)
3. **Node.js (versi 18 ke atas)**: Untuk menjalankan server frontend. [Download Node.js](https://nodejs.org/)

---

## 🚀 Langkah-Langkah Setup (Tanpa Ribet / Nol Konfigurasi)

Database default lokal telah dikonfigurasi menggunakan **SQLite** (file lokal `.db` otomatis dibuat). Jadi, Anda **tidak perlu menginstall PostgreSQL** di laptop lokal hanya untuk sekedar mengedit/memasukkan konten.

### Langkah 1: Clone atau Download Repository
Buka terminal (Git Bash, Command Prompt, atau PowerShell), kemudian clone project ini:
```bash
git clone <URL_REPOSITORY_ANDA>
cd Compro-KangBejo
```

---

### Langkah 2: Setup & Jalankan Backend (FastAPI)
1. Masuk ke folder `backend`:
   ```bash
   cd backend
   ```
2. Salin file environment template `.env.example` menjadi `.env`:
   * **Windows (CMD/PowerShell)**:
     ```powershell
     copy .env.example .env
     ```
   * **Linux / macOS**:
     ```bash
     cp .env.example .env
     ```
3. *(Opsional)* Buka file `backend/.env` dan pastikan isinya:
   ```env
   DATABASE_URL=sqlite:///./kangbejo.db
   ```
4. Install semua library Python yang dibutuhkan:
   ```bash
   pip install -r requirements.txt
   ```
5. Jalankan server backend:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   * Server backend sekarang aktif di: **http://localhost:8000**
   * Database baru `kangbejo.db` akan dibuat otomatis di dalam folder `backend/` lengkap dengan data awal (seed).

---

### Langkah 3: Setup & Jalankan Frontend (React + Vite)
1. Buka terminal baru (pastikan berada di root directory `Compro-KangBejo`), lalu masuk ke folder `frontend`:
   ```bash
   cd frontend
   ```
2. Salin file environment template `.env.example` menjadi `.env`:
   * **Windows (CMD/PowerShell)**:
     ```powershell
     copy .env.example .env
     ```
   * **Linux / macOS**:
     ```bash
     cp .env.example .env
     ```
3. Install package javascript:
   ```bash
   npm install
   ```
4. Jalankan server frontend:
   ```bash
   npm run dev
   ```
   * Aplikasi web sekarang aktif di: **http://localhost:5173** (atau port lain yang tertera pada terminal).

---

## 🔑 Cara Masuk ke Panel Admin (CMS)

Setelah frontend dan backend berjalan:
1. Buka browser dan pergi ke halaman: **http://localhost:5173/admin**
2. Masukkan kredensial login default berikut:
   * **Username**: `admin`
   * **Password**: `kangbejo2024`
3. Klik **Login**. Anda sekarang berada di dashboard admin panel dan siap mengelola konten!

---

## 📝 Panduan Memasukkan Konten

### A. Mengunggah Gambar Baru
Jika ingin mengganti gambar slide utama, ikon fasilitas/kegiatan, atau menyisipkan gambar di berita:
1. Buka menu **Media** di bilah navigasi admin.
2. Klik tombol **Upload Gambar** lalu pilih file dari laptop Anda.
3. Gambar yang sukses terunggah akan masuk ke perpustakaan media dan memiliki **ID Media** unik.

### B. Menyisipkan Gambar di Tengah Berita
Berita di web ini mendukung penyisipan gambar di paragraf manapun:
1. Masuk ke menu **Berita** > pilih berita atau klik **Tambah Berita**.
2. Pada form isi berita, klik tombol **🖼️ Sisipkan Gambar**.
3. Pilih gambar dari library media Anda.
4. Sistem akan otomatis menulis tag shortcode seperti `[gambar:3]` di posisi kursor Anda.
5. Saat berita disimpan dan dibuka di website utama, tag `[gambar:3]` tersebut otomatis berubah menjadi gambar asli dengan tata letak yang rapi.
