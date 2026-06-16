"""
admin_routes.py — Semua endpoint admin CMS + endpoint publik baru
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
import re
import urllib.parse
import requests

def resolve_and_clean_maps_url(url: str) -> str:
    if not url:
        return ""
    
    url = url.strip()
    
    # 1. Jika itu tag iframe lengkap, ambil isi src="..."
    src_match = re.search(r'src=["\'](https:[^"\']+)["\']', url, re.IGNORECASE)
    if src_match:
        url = src_match.group(1)

    # 2. Jika merupakan short URL (misal maps.app.goo.gl atau goo.gl/maps)
    if "maps.app.goo.gl" in url or "goo.gl/maps" in url:
        try:
            # Gunakan requests.head atau requests.get dengan allow_redirects=True untuk mengikuti redirect
            # Tambahkan User-Agent agar Google Maps melayani permintaan dengan baik
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
            response = requests.get(url, headers=headers, allow_redirects=True, timeout=5.0)
            url = response.url
        except Exception as e:
            print(f"Error resolving redirect for {url}: {e}")
            pass

    # 3. Sekarang url adalah URL panjang Google Maps.
    # Jika sudah merupakan URL embed yang valid
    if "google.com/maps/embed" in url or "google.com/maps/embed?" in url:
        return url

    # Jika itu link Google Maps place, coba ekstrak nama tempat atau koordinat
    # Struktur: /maps/place/PLACE_NAME/@lat,lng,...
    place_match = re.search(r'/maps/place/([^/]+)', url)
    if place_match:
        place_name = urllib.parse.unquote_plus(place_match.group(1))
        # Kembalikan link pencarian embed menggunakan nama tempat agar persis dan akurat!
        return f"https://maps.google.com/maps?q={urllib.parse.quote(place_name)}&t=&z=16&ie=UTF8&iwloc=&output=embed"

    # Jika tidak ada nama tempat tapi ada koordinat (misal /@lat,lng,...)
    coords_match = re.search(r'/@(-?\d+\.\d+,-?\d+\.\d+)', url)
    if coords_match:
        coords = coords_match.group(1)
        return f"https://maps.google.com/maps?q={coords}&t=&z=16&ie=UTF8&iwloc=&output=embed"

    # Jika hanya alamat biasa / string pencarian bebas
    return f"https://maps.google.com/maps?q={urllib.parse.quote(url)}&t=&z=16&ie=UTF8&iwloc=&output=embed"


from database import get_db
from auth import get_current_admin, hash_password, verify_password, create_access_token
from models import AdminUser
import crud
from schemas import (
    AdminLogin, TokenResponse, AdminResponse,
    MediaResponse, MediaListResponse,
    SiteContentUpdate, SiteContentResponse, AllSiteContentResponse,
    HeroSlideCreate, HeroSlideUpdate, HeroSlideResponse, HeroSlideListResponse, HeroSlideReorder,
    NewsCreate, NewsUpdate, NewsResponse, NewsListResponse,
    FacilityCreate, FacilityUpdate, FacilityResponse, FacilityListResponse,
    ActivityCreate, ActivityUpdate, ActivityResponse, ActivityListResponse,
)

# ── Max upload size: 5 MB ────────────────────────────────
MAX_UPLOAD_SIZE = 5 * 1024 * 1024

# ══════════════════════════════════════════════════════════
#  PUBLIC ROUTER — endpoint publik tanpa auth
# ══════════════════════════════════════════════════════════

public_router = APIRouter(tags=["Public Content"])


@public_router.get("/media/{media_id}")
def serve_media(media_id: int, db: Session = Depends(get_db)):
    """Serve file media berdasarkan ID — digunakan oleh frontend untuk menampilkan gambar."""
    media = crud.get_media(db, media_id)
    if not media:
        raise HTTPException(status_code=404, detail="Media tidak ditemukan")
    return Response(
        content=media.data,
        media_type=media.mime_type,
        headers={
            "Cache-Control": "public, max-age=86400",
            "Content-Disposition": f'inline; filename="{media.filename}"',
        },
    )


@public_router.get("/site-content", response_model=AllSiteContentResponse)
def get_all_site_content(db: Session = Depends(get_db)):
    """Ambil semua konten section — dipakai frontend compro."""
    sections = crud.get_all_site_content(db)
    return {"sections": sections}


@public_router.get("/site-content/{section}", response_model=SiteContentResponse)
def get_site_content(section: str, db: Session = Depends(get_db)):
    """Ambil konten satu section."""
    data = crud.get_site_content_by_section(db, section)
    return {"section": section, "data": data}


@public_router.get("/hero-slides", response_model=HeroSlideListResponse)
def list_hero_slides(db: Session = Depends(get_db)):
    """Ambil semua hero slides aktif — dipakai frontend compro."""
    return crud.get_hero_slides(db, active_only=True)


@public_router.get("/news", response_model=NewsListResponse)
def list_news(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Ambil daftar berita aktif — dipakai frontend compro."""
    return crud.get_all_news(db, skip=skip, limit=limit, active_only=True)


@public_router.get("/news/{news_id}", response_model=NewsResponse)
def get_single_news(news_id: int, db: Session = Depends(get_db)):
    """Ambil satu berita berdasarkan ID — dipakai frontend compro."""
    news = crud.get_news(db, news_id)
    if not news:
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")
    return news


# ══════════════════════════════════════════════════════════
#  ADMIN ROUTER — semua endpoint perlu autentikasi
# ══════════════════════════════════════════════════════════

admin_router = APIRouter(prefix="/admin", tags=["Admin"])


# ── AUTH ──────────────────────────────────────────────────

@admin_router.post("/login", response_model=TokenResponse)
def admin_login(data: AdminLogin, db: Session = Depends(get_db)):
    """Login admin — return JWT token."""
    admin = crud.get_admin_by_username(db, data.username)
    if not admin or not verify_password(data.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Username atau password salah")
    token = create_access_token({"sub": admin.username})
    return {"access_token": token, "token_type": "bearer"}


@admin_router.get("/me", response_model=AdminResponse)
def admin_me(admin: AdminUser = Depends(get_current_admin)):
    """Info admin yang sedang login."""
    return admin


# ── MEDIA ─────────────────────────────────────────────────

@admin_router.post("/media", response_model=MediaResponse, status_code=201)
async def upload_media(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Upload file media (gambar/video) ke database. Max 5MB."""
    # Validasi tipe file
    allowed_types = [
        "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
        "video/mp4", "video/webm",
    ]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Tipe file '{file.content_type}' tidak didukung. "
                   f"Gunakan: {', '.join(allowed_types)}",
        )

    # Baca file data
    data = await file.read()
    if len(data) > MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Ukuran file melebihi batas {MAX_UPLOAD_SIZE // (1024*1024)}MB",
        )

    media = crud.create_media(
        db=db,
        filename=file.filename or "unnamed",
        mime_type=file.content_type,
        data=data,
        size=len(data),
    )
    return media


@admin_router.get("/media", response_model=MediaListResponse)
def list_media(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Daftar semua media yang tersimpan."""
    return crud.get_all_media(db, skip=skip, limit=limit)


@admin_router.delete("/media/{media_id}", status_code=204)
def remove_media(
    media_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Hapus media berdasarkan ID."""
    if not crud.delete_media(db, media_id):
        raise HTTPException(status_code=404, detail="Media tidak ditemukan")
    return None


# ── SITE CONTENT ──────────────────────────────────────────

@admin_router.get("/site-content", response_model=AllSiteContentResponse)
def admin_get_all_content(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Ambil semua site content (admin view)."""
    sections = crud.get_all_site_content(db)
    return {"sections": sections}


@admin_router.put("/site-content/{section}", response_model=SiteContentResponse)
def admin_update_content(
    section: str,
    body: SiteContentUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Update konten per section — upsert key-value pairs."""
    payload = dict(body.data)
    if section == "contact" and "maps_embed_url" in payload:
        payload["maps_embed_url"] = resolve_and_clean_maps_url(payload["maps_embed_url"])
        
    data = crud.upsert_site_content(db, section, payload)
    return {"section": section, "data": data}


# ── HERO SLIDES ───────────────────────────────────────────

@admin_router.get("/hero-slides", response_model=HeroSlideListResponse)
def admin_list_slides(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Daftar semua hero slides (termasuk non-aktif)."""
    return crud.get_hero_slides(db, active_only=False)


@admin_router.post("/hero-slides", response_model=HeroSlideResponse, status_code=201)
def admin_create_slide(
    data: HeroSlideCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Tambah hero slide baru."""
    return crud.create_hero_slide(db, data)


@admin_router.put("/hero-slides/{slide_id}", response_model=HeroSlideResponse)
def admin_update_slide(
    slide_id: int,
    data: HeroSlideUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Update hero slide."""
    slide = crud.update_hero_slide(db, slide_id, data)
    if not slide:
        raise HTTPException(status_code=404, detail="Slide tidak ditemukan")
    return slide


@admin_router.delete("/hero-slides/{slide_id}", status_code=204)
def admin_delete_slide(
    slide_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Hapus hero slide."""
    if not crud.delete_hero_slide(db, slide_id):
        raise HTTPException(status_code=404, detail="Slide tidak ditemukan")
    return None


@admin_router.put("/hero-slides-reorder")
def admin_reorder_slides(
    body: HeroSlideReorder,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Reorder hero slides."""
    crud.reorder_hero_slides(db, body.order)
    return {"message": "Urutan slide diperbarui"}


# ── NEWS ──────────────────────────────────────────────────

@admin_router.get("/news", response_model=NewsListResponse)
def admin_list_news(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Daftar semua berita (termasuk non-aktif)."""
    return crud.get_all_news(db, skip=skip, limit=limit, active_only=False)


@admin_router.post("/news", response_model=NewsResponse, status_code=201)
def admin_create_news(
    data: NewsCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Tambah berita baru."""
    return crud.create_news(db, data)


@admin_router.put("/news/{news_id}", response_model=NewsResponse)
def admin_update_news(
    news_id: int,
    data: NewsUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Update berita."""
    news = crud.update_news(db, news_id, data)
    if not news:
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")
    return news


@admin_router.delete("/news/{news_id}", status_code=204)
def admin_delete_news(
    news_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Hapus berita."""
    if not crud.delete_news(db, news_id):
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")
    return None


# ── ADMIN FACILITIES (reuse existing CRUD, tapi dengan auth) ──

@admin_router.get("/facilities", response_model=FacilityListResponse)
def admin_list_facilities(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: str = Query(None),
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Daftar semua fasilitas (admin, termasuk non-aktif)."""
    return crud.get_facilities(db, skip=skip, limit=limit, search=search, active_only=False)


@admin_router.post("/facilities", response_model=FacilityResponse, status_code=201)
def admin_create_facility(
    data: FacilityCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Tambah fasilitas (admin)."""
    return crud.create_facility(db, data)


@admin_router.put("/facilities/{facility_id}", response_model=FacilityResponse)
def admin_update_facility(
    facility_id: int,
    data: FacilityUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Update fasilitas (admin)."""
    result = crud.update_facility(db, facility_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Fasilitas tidak ditemukan")
    return result


@admin_router.delete("/facilities/{facility_id}", status_code=204)
def admin_delete_facility(
    facility_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Hapus fasilitas (admin)."""
    if not crud.delete_facility(db, facility_id):
        raise HTTPException(status_code=404, detail="Fasilitas tidak ditemukan")
    return None


# ── ADMIN ACTIVITIES ──────────────────────────────────────

@admin_router.get("/activities", response_model=ActivityListResponse)
def admin_list_activities(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: str = Query(None),
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Daftar semua kegiatan (admin, termasuk non-aktif)."""
    return crud.get_activities(db, skip=skip, limit=limit, search=search, active_only=False)


@admin_router.post("/activities", response_model=ActivityResponse, status_code=201)
def admin_create_activity(
    data: ActivityCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Tambah kegiatan (admin)."""
    return crud.create_activity(db, data)


@admin_router.put("/activities/{activity_id}", response_model=ActivityResponse)
def admin_update_activity(
    activity_id: int,
    data: ActivityUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Update kegiatan (admin)."""
    result = crud.update_activity(db, activity_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Kegiatan tidak ditemukan")
    return result


@admin_router.delete("/activities/{activity_id}", status_code=204)
def admin_delete_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Hapus kegiatan (admin)."""
    if not crud.delete_activity(db, activity_id):
        raise HTTPException(status_code=404, detail="Kegiatan tidak ditemukan")
    return None


# ── ADMIN STATS (dashboard overview) ─────────────────────

@admin_router.get("/dashboard-stats")
def admin_dashboard_stats(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Statistik untuk dashboard admin."""
    from models import Facility, Activity, News, HeroSlide, Media

    return {
        "facilities": {
            "total": db.query(Facility).count(),
            "active": db.query(Facility).filter(Facility.is_active == True).count(),
        },
        "activities": {
            "total": db.query(Activity).count(),
            "active": db.query(Activity).filter(Activity.is_active == True).count(),
        },
        "news": {
            "total": db.query(News).count(),
            "active": db.query(News).filter(News.is_active == True).count(),
        },
        "hero_slides": {
            "total": db.query(HeroSlide).count(),
            "active": db.query(HeroSlide).filter(HeroSlide.is_active == True).count(),
        },
        "media": {
            "total": db.query(Media).count(),
        },
    }
