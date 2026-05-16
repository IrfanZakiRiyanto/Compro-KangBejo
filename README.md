# ☁️ Kang Bejo — Company Profile Desa Wisata

Website **Company Profile Desa Wisata Kang Bejo Balikpapan** yang dibangun sebagai bagian dari kegiatan **Kuliah Kerja Nyata (KKN)** dan mata kuliah **Komputasi Awan (Cloud Computing)** — Institut Teknologi Kalimantan.

Desa Wisata Kang Bejo adalah destinasi wisata edukasi unggulan di Balikpapan yang menghadirkan pengalaman belajar dan berwisata di tengah kebun kangkung. Pengunjung dapat menikmati berbagai fasilitas dan kegiatan seru yang memadukan alam, budaya, dan edukasi pertanian.

---

## 👥 Tim KKN

| Nama            | NIM      | Peran           |
|-----------------|----------|-----------------|
| Anggota Satu    | 10011001 | Lead Backend    |
| Anggota Dua     | 10011002 | Lead Frontend   |
| Anggota Tiga    | 10011003 | Lead DevOps     |
| Anggota Empat   | 10011004 | Lead QA & Docs  |
| Anggota Lima    | 10011005 | Anggota         |
| Anggota Enam    | 10011006 | Anggota         |
| Anggota Tujuh   | 10011007 | Anggota         |
| Anggota Delapan | 10011008 | Anggota         |
| Anggota Sembilan| 10011009 | Anggota         |

---

## 🛠️ Tech Stack

| Teknologi        | Fungsi                          |
|------------------|---------------------------------|
| FastAPI          | Backend REST API                |
| React + Vite     | Frontend SPA                    |
| PostgreSQL       | Database (Modul 2)              |
| Docker           | Containerisasi (Modul 5)        |
| Docker Compose   | Multi-container (Modul 7)       |
| GitHub Actions   | CI/CD Pipeline (Modul 10)       |
| Railway / Render | Cloud Deployment (Modul 11)     |
| Nginx            | API Gateway (Modul 13)          |

---

## 🏗️ Architecture

```
[React Frontend :5173] <-- HTTP --> [FastAPI Backend :8000] <-- SQL --> [PostgreSQL :5432]
          ↕                                    ↕
       /facilities                    facilities table
       /activities                    activities table
```

> Diagram ini akan berkembang setiap modul seiring penambahan komponen baru.

---

## 🚀 Getting Started

### Prasyarat
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Git

### Setup Database
```bash
# 1. Login ke PostgreSQL
psql -U postgres

# 2. Buat database
CREATE DATABASE kangbejo;
\q

# 3. Buat file backend/.env
# Isi dengan:
DATABASE_URL=postgresql://postgres:PASSWORD_KAMU@localhost:5432/kangbejo
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Data fasilitas & kegiatan otomatis ter-seed saat pertama kali start

# Buka browser: http://localhost:8000
# Swagger UI: http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
npm install
npm run dev

# Buka browser: http://localhost:5173
```

---

## 🌿 Konten Desa Wisata Kang Bejo

### Fasilitas
| Fasilitas                    | Deskripsi                                                  |
|------------------------------|------------------------------------------------------------|
| 🌿 Kebun Kangkung            | Hamparan kebun kangkung segar, ikon utama desa wisata      |
| 🍽️ Pujasera                  | Pusat Jajanan Serba Ada — kuliner lokal & olahan kangkung  |
| 📚 Edukasi Pertanian Kangkung | Program edukasi interaktif budidaya kangkung               |
| 📸 Spot Foto                 | Area foto instagramable di tengah kebun kangkung           |

### Kegiatan
| Kegiatan                    | Deskripsi                                               |
|-----------------------------|---------------------------------------------------------|
| 🛒 Bazar Murah              | Pasar murah produk lokal & hasil pertanian              |
| 🗺️ Jelajah Wisata           | Tur keliling area desa wisata dengan pemandu            |
| 💃 Tari Daerah              | Pertunjukan tari daerah Kalimantan Timur                |
| 🏃 Geber Kang Bejo          | Olahraga bersama di alam terbuka                        |
| 🔬 Ruang Pintar             | Ruang belajar interaktif pertanian modern               |
| 🌱 Tanam Kangkung           | Pengalaman menanam kangkung bersama petani lokal        |

---

## 📅 Roadmap Pengembangan

| Modul | Fokus                     | Status |
|-------|---------------------------|--------|
| 1     | Setup & Hello World       | ✅     |
| 2     | REST API + Database        | ✅     |
| 3     | React Frontend Lengkap    | ⬜     |
| 4     | Full-Stack Integration    | ⬜     |
| 5-7   | Docker & Compose          | ⬜     |
| 8     | UTS Demo                  | ⬜     |
| 9-11  | CI/CD Pipeline            | ⬜     |
| 12-14 | Microservices + Gateway   | ⬜     |
| 15    | Polish & Final UAS        | ⬜     |

---

## 📁 Struktur Proyek

```
Compro-KangBejo/
├── backend/
│   ├── main.py              # FastAPI app + endpoints CRUD
│   ├── database.py          # Koneksi PostgreSQL (SQLAlchemy)
│   ├── models.py            # Model: Facility, Activity
│   ├── schemas.py           # Pydantic schemas validasi
│   ├── crud.py              # Fungsi CRUD
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # ⚠️ JANGAN di-commit! (DATABASE_URL)
│   └── .env.example         # Template .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # React app utama
│   │   ├── App.css          # Styling premium
│   │   └── main.jsx         # Entry point React
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docs/
├── .gitignore
└── README.md
```

---

*Proyek ini dikembangkan secara bertahap mengikuti kurikulum Modul 1–15 mata kuliah Komputasi Awan, Institut Teknologi Kalimantan.*
