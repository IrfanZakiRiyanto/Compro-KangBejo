# 🛠️ Panduan Pemeliharaan & Update Produksi — Kang Bejo

Dokumen ini berisi panduan langkah-demi-langkah bagi tim pengembang untuk memperbarui kode website **Desa Wisata Kang Bejo Balikpapan** setelah website aktif di production hosting cPanel.

---

## 🐍 Skenario A: Memperbarui Backend (Python / FastAPI)

Gunakan alur ini jika Anda melakukan perubahan pada logika database, skema, router API, autentikasi admin, atau file `.py` lainnya.

### Langkah-langkah Update Backend:
1. **Edit Kode di Lokal**: Lakukan perubahan kode di folder `backend` komputer lokal Anda (misal mengedit `main.py` atau `admin_routes.py`).
2. **Unggah File ke cPanel**:
   * Buka **File Manager cPanel**.
   * Masuk ke direktori backend: `/home/desawi13/api.desawisatakangbejo.id/`.
   * Unggah file `.py` yang baru saja Anda edit langsung ke folder tersebut (timpa / *overwrite* file lama).
     > [!TIP]
     > Anda tidak perlu mengunggah ulang seluruh folder backend. Cukup unggah file-file spesifik yang baru saja Anda ubah kodenya.
3. **Restart Aplikasi Python**:
   * Buka **Terminal cPanel** (atau lewat SSH).
   * Jalankan perintah berikut untuk memberi tahu Passenger agar memuat ulang kode backend baru:
     ```bash
     touch /home/desawi13/api.desawisatakangbejo.id/tmp/restart.txt
     ```
   * *Alternatif*: Masuk ke menu **Setup Python App** di cPanel dan klik tombol **Restart** pada aplikasi Python Anda.
4. **Verifikasi**: Buka `https://api.desawisatakangbejo.id/health` untuk memastikan API merespons dengan normal.

---

## 💻 Skenario B: Memperbarui Frontend (React / Vite)

Gunakan alur ini jika Anda melakukan perubahan tampilan UI, gaya CSS, penambahan halaman baru, modifikasi teks, atau logika JavaScript di sisi klien.

### Langkah-langkah Update Frontend:
1. **Ubah Sementara Konfigurasi API**:
   * Buka file `frontend/.env` di komputer lokal Anda.
   * Ubah variabel `VITE_API_URL` agar mengarah ke API hosting:
     ```env
     VITE_API_URL=https://api.desawisatakangbejo.id
     ```
2. **Jalankan Perintah Build**:
   * Buka terminal di folder `frontend` lokal Anda, lalu jalankan:
     ```bash
     npm run build
     ```
   * Perintah ini akan menghasilkan folder bernama `dist` yang berisi file HTML, JS, dan CSS statis. URL API hosting kini telah "dipanggang" secara permanen di dalam file JS tersebut.
3. **Kembalikan `.env` Lokal ke Localhost**:
   * Setelah build selesai, segera kembalikan file `frontend/.env` Anda ke localhost untuk development di kemudian hari:
     ```env
     VITE_API_URL=http://localhost:8000
     ```
4. **Kompres Hasil Build**:
   * Masuk ke folder `frontend/dist` di laptop Anda.
   * Blokir seluruh isi di dalam folder `dist` tersebut (misal file `index.html`, folder `assets/`, dll).
   * Kompres seluruh isi tersebut menjadi sebuah file `.zip` (misal: `frontend_update.zip`).
     > [!IMPORTANT]
     > Ingat untuk men-zip **isi di dalam** folder `dist`, bukan men-zip folder `dist` itu sendiri.
5. **Unggah ke cPanel**:
   * Buka **File Manager cPanel** dan masuk ke folder **`public_html`**.
   * Unggah file `frontend_update.zip` ke folder tersebut.
   * Ekstrak file `.zip` tersebut untuk menimpa file frontend yang lama.
   * Hapus file `frontend_update.zip` dari server setelah diekstrak untuk menghemat penyimpanan hosting.
6. **Verifikasi**: Buka `https://desawisatakangbejo.id` dan tekan `Ctrl + F5` (hard reload) di browser Anda untuk memastikan tampilan baru termuat tanpa terganggu cache browser.

---

## ⚠️ Tips & Pemecahan Masalah
* **Perubahan Struktur Database**: Jika Anda menambah atau mengubah kolom tabel di `models.py`, database SQLite (`kangbejo.db`) di hosting tidak akan terupdate otomatis. Anda perlu masuk ke terminal cPanel dan menjalankan migrasi, atau jika database boleh di-reset, hapus file `kangbejo.db` di server lalu jalankan restart python app agar seeder berjalan kembali membuat database baru yang bersih.
* **Error 404 pada Refresh Halaman**: Jika setelah update file frontend terhapus, pastikan file `.htaccess` di dalam folder `public_html` tetap ada dan berisi aturan pengalihan React (React Routing).
