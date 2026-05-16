from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db
from models import Base, Facility, Activity
from schemas import (
    FacilityCreate, FacilityUpdate, FacilityResponse, FacilityListResponse,
    ActivityCreate, ActivityUpdate, ActivityResponse, ActivityListResponse,
)
import crud

# ── Buat semua tabel di database (jika belum ada) ──
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kang Bejo API",
    description=(
        "REST API untuk Website Company Profile "
        "Desa Wisata Kang Bejo Balikpapan — "
        "Mata Kuliah Komputasi Awan, Institut Teknologi Kalimantan"
    ),
    version="0.2.0",
)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Untuk development saja
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ════════════════════════════════════════════════════════
#  AUTO-SEED: Isi data awal jika tabel masih kosong
# ════════════════════════════════════════════════════════

def seed_initial_data(db: Session):
    """Isi data fasilitas & kegiatan awal jika database masih kosong."""

    if db.query(Facility).count() == 0:
        facilities = [
            Facility(
                name="Kebun Kangkung",
                description="Hamparan kebun kangkung segar yang menjadi ikon utama desa wisata ini.",
                icon="🌿",
            ),
            Facility(
                name="Pujasera",
                description="Pusat Jajanan Serba Ada — nikmati kuliner lokal dan olahan kangkung khas Kang Bejo.",
                icon="🍽️",
            ),
            Facility(
                name="Edukasi Pertanian Kangkung",
                description="Program edukasi interaktif tentang budidaya kangkung dari tanam hingga panen.",
                icon="📚",
            ),
            Facility(
                name="Spot Foto",
                description="Spot-spot foto instagramable di tengah kebun kangkung yang asri dan segar.",
                icon="📸",
            ),
        ]
        db.add_all(facilities)
        db.commit()

    if db.query(Activity).count() == 0:
        activities = [
            Activity(
                name="Bazar Murah",
                description="Pasar murah produk lokal dan hasil pertanian kangkung Kang Bejo.",
                icon="🛒",
            ),
            Activity(
                name="Jelajah Wisata",
                description="Tur keliling area desa wisata dipandu pemandu berpengalaman.",
                icon="🗺️",
            ),
            Activity(
                name="Tari Daerah",
                description="Pertunjukan tari daerah Kalimantan Timur yang memukau.",
                icon="💃",
            ),
            Activity(
                name="Geber Kang Bejo",
                description="Olahraga bersama yang menyenangkan di alam terbuka desa wisata.",
                icon="🏃",
            ),
            Activity(
                name="Ruang Pintar",
                description="Ruang belajar interaktif tentang pertanian modern dan lingkungan hidup.",
                icon="🔬",
            ),
            Activity(
                name="Tanam Kangkung",
                description="Pengalaman seru menanam kangkung langsung di lahan kebun bersama petani lokal.",
                icon="🌱",
            ),
        ]
        db.add_all(activities)
        db.commit()


@app.on_event("startup")
def on_startup():
    """Jalankan seeder saat aplikasi pertama kali start."""
    db = next(get_db())
    try:
        seed_initial_data(db)
    finally:
        db.close()


# ════════════════════════════════════════════════════════
#  GENERAL ENDPOINTS
# ════════════════════════════════════════════════════════

@app.get("/")
def root():
    """Info dasar API."""
    return {
        "message": "Selamat datang di API Desa Wisata Kang Bejo Balikpapan!",
        "status": "running",
        "version": "0.2.0",
        "docs": "/docs",
    }


@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Health check — verifikasi API & koneksi database berjalan."""
    try:
        db.execute(__import__("sqlalchemy").text("SELECT 1"))
        db_status = "connected"
    except Exception:
        db_status = "disconnected"

    return {
        "status": "healthy",
        "version": "0.2.0",
        "database": db_status,
    }


@app.get("/about")
def about():
    """Informasi umum Desa Wisata Kang Bejo."""
    return {
        "name": "Desa Wisata Kang Bejo",
        "tagline": "Desa Wisata Edukasi Penghasil Kangkung di Balikpapan",
        "location": "Balikpapan, Kalimantan Timur",
        "description": (
            "Desa Wisata Kang Bejo adalah destinasi wisata edukasi unggulan di Balikpapan "
            "yang menghadirkan pengalaman belajar dan berwisata di tengah kebun kangkung. "
            "Pengunjung dapat menikmati berbagai fasilitas dan kegiatan seru yang memadukan "
            "alam, budaya, dan edukasi pertanian."
        ),
    }


@app.get("/team")
def team_info():
    """Informasi tim KKN — hanya untuk keperluan internal/backend."""
    return {
        "team": "KKN Desa Wisata Kang Bejo",
        "members": [
            {"name": "Anggota Satu",    "nim": "10011001", "role": "Lead Backend"},
            {"name": "Anggota Dua",     "nim": "10011002", "role": "Lead Frontend"},
            {"name": "Anggota Tiga",    "nim": "10011003", "role": "Lead DevOps"},
            {"name": "Anggota Empat",   "nim": "10011004", "role": "Lead QA & Docs"},
            {"name": "Anggota Lima",    "nim": "10011005", "role": "Anggota"},
            {"name": "Anggota Enam",    "nim": "10011006", "role": "Anggota"},
            {"name": "Anggota Tujuh",   "nim": "10011007", "role": "Anggota"},
            {"name": "Anggota Delapan", "nim": "10011008", "role": "Anggota"},
            {"name": "Anggota Sembilan","nim": "10011009", "role": "Anggota"},
        ],
    }


@app.get("/stats")
def stats(db: Session = Depends(get_db)):
    """Statistik konten Desa Wisata Kang Bejo."""
    total_facilities  = db.query(Facility).count()
    active_facilities = db.query(Facility).filter(Facility.is_active == True).count()
    total_activities  = db.query(Activity).count()
    active_activities = db.query(Activity).filter(Activity.is_active == True).count()

    return {
        "facilities": {
            "total": total_facilities,
            "active": active_facilities,
        },
        "activities": {
            "total": total_activities,
            "active": active_activities,
        },
    }


# ════════════════════════════════════════════════════════
#  FACILITIES ENDPOINTS
# ════════════════════════════════════════════════════════

@app.post("/facilities", response_model=FacilityResponse, status_code=201,
          summary="Tambah fasilitas baru")
def create_facility(facility: FacilityCreate, db: Session = Depends(get_db)):
    """
    Tambah fasilitas baru ke database.

    - **name**: Nama fasilitas (wajib, 1-100 karakter)
    - **description**: Deskripsi fasilitas (opsional)
    - **icon**: Emoji icon (opsional, max 10 karakter)
    - **is_active**: Status aktif (default: true)
    """
    return crud.create_facility(db=db, data=facility)


@app.get("/facilities", response_model=FacilityListResponse,
         summary="Daftar fasilitas")
def list_facilities(
    skip: int = Query(0, ge=0, description="Offset untuk pagination"),
    limit: int = Query(20, ge=1, le=100, description="Jumlah item per halaman"),
    search: str = Query(None, description="Cari berdasarkan nama/deskripsi"),
    active_only: bool = Query(False, description="Hanya tampilkan yang aktif"),
    db: Session = Depends(get_db),
):
    """Ambil daftar fasilitas dengan pagination dan search."""
    return crud.get_facilities(db=db, skip=skip, limit=limit, search=search, active_only=active_only)


@app.get("/facilities/{facility_id}", response_model=FacilityResponse,
         summary="Detail fasilitas")
def get_facility(facility_id: int, db: Session = Depends(get_db)):
    """Ambil detail satu fasilitas berdasarkan ID."""
    facility = crud.get_facility(db=db, facility_id=facility_id)
    if not facility:
        raise HTTPException(
            status_code=404,
            detail=f"Fasilitas dengan id={facility_id} tidak ditemukan"
        )
    return facility


@app.put("/facilities/{facility_id}", response_model=FacilityResponse,
         summary="Update fasilitas")
def update_facility(
    facility_id: int, facility: FacilityUpdate, db: Session = Depends(get_db)
):
    """Update fasilitas berdasarkan ID. Hanya field yang dikirim yang diubah."""
    updated = crud.update_facility(db=db, facility_id=facility_id, data=facility)
    if not updated:
        raise HTTPException(
            status_code=404,
            detail=f"Fasilitas dengan id={facility_id} tidak ditemukan"
        )
    return updated


@app.delete("/facilities/{facility_id}", status_code=204,
            summary="Hapus fasilitas")
def delete_facility(facility_id: int, db: Session = Depends(get_db)):
    """Hapus fasilitas berdasarkan ID."""
    success = crud.delete_facility(db=db, facility_id=facility_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Fasilitas dengan id={facility_id} tidak ditemukan"
        )
    return None


# ════════════════════════════════════════════════════════
#  ACTIVITIES ENDPOINTS
# ════════════════════════════════════════════════════════

@app.post("/activities", response_model=ActivityResponse, status_code=201,
          summary="Tambah kegiatan baru")
def create_activity(activity: ActivityCreate, db: Session = Depends(get_db)):
    """
    Tambah kegiatan baru ke database.

    - **name**: Nama kegiatan (wajib, 1-100 karakter)
    - **description**: Deskripsi kegiatan (opsional)
    - **icon**: Emoji icon (opsional, max 10 karakter)
    - **is_active**: Status aktif (default: true)
    """
    return crud.create_activity(db=db, data=activity)


@app.get("/activities", response_model=ActivityListResponse,
         summary="Daftar kegiatan")
def list_activities(
    skip: int = Query(0, ge=0, description="Offset untuk pagination"),
    limit: int = Query(20, ge=1, le=100, description="Jumlah item per halaman"),
    search: str = Query(None, description="Cari berdasarkan nama/deskripsi"),
    active_only: bool = Query(False, description="Hanya tampilkan yang aktif"),
    db: Session = Depends(get_db),
):
    """Ambil daftar kegiatan dengan pagination dan search."""
    return crud.get_activities(db=db, skip=skip, limit=limit, search=search, active_only=active_only)


@app.get("/activities/{activity_id}", response_model=ActivityResponse,
         summary="Detail kegiatan")
def get_activity(activity_id: int, db: Session = Depends(get_db)):
    """Ambil detail satu kegiatan berdasarkan ID."""
    activity = crud.get_activity(db=db, activity_id=activity_id)
    if not activity:
        raise HTTPException(
            status_code=404,
            detail=f"Kegiatan dengan id={activity_id} tidak ditemukan"
        )
    return activity


@app.put("/activities/{activity_id}", response_model=ActivityResponse,
         summary="Update kegiatan")
def update_activity(
    activity_id: int, activity: ActivityUpdate, db: Session = Depends(get_db)
):
    """Update kegiatan berdasarkan ID. Hanya field yang dikirim yang diubah."""
    updated = crud.update_activity(db=db, activity_id=activity_id, data=activity)
    if not updated:
        raise HTTPException(
            status_code=404,
            detail=f"Kegiatan dengan id={activity_id} tidak ditemukan"
        )
    return updated


@app.delete("/activities/{activity_id}", status_code=204,
            summary="Hapus kegiatan")
def delete_activity(activity_id: int, db: Session = Depends(get_db)):
    """Hapus kegiatan berdasarkan ID."""
    success = crud.delete_activity(db=db, activity_id=activity_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Kegiatan dengan id={activity_id} tidak ditemukan"
        )
    return None
