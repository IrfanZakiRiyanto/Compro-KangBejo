from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Facility, Activity, AdminUser, Media, SiteContent, HeroSlide, News
from schemas import (
    FacilityCreate, FacilityUpdate,
    ActivityCreate, ActivityUpdate,
    NewsCreate, NewsUpdate,
    HeroSlideCreate, HeroSlideUpdate,
)


# ════════════════════════════════════════
#  ADMIN USER CRUD
# ════════════════════════════════════════

def get_admin_by_username(db: Session, username: str) -> AdminUser | None:
    """Ambil admin berdasarkan username."""
    return db.query(AdminUser).filter(AdminUser.username == username).first()


def create_admin(db: Session, username: str, password_hash: str) -> AdminUser:
    """Buat admin baru."""
    admin = AdminUser(username=username, password_hash=password_hash)
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


# ════════════════════════════════════════
#  MEDIA CRUD
# ════════════════════════════════════════

def create_media(db: Session, filename: str, mime_type: str, data: bytes, size: int) -> Media:
    """Simpan file media ke database."""
    media = Media(filename=filename, mime_type=mime_type, data=data, size=size)
    db.add(media)
    db.commit()
    db.refresh(media)
    return media


def get_media(db: Session, media_id: int) -> Media | None:
    """Ambil satu media berdasarkan ID."""
    return db.query(Media).filter(Media.id == media_id).first()


def get_all_media(db: Session, skip: int = 0, limit: int = 50) -> dict:
    """Ambil semua media dengan pagination."""
    query = db.query(Media)
    total = query.count()
    items = query.order_by(Media.created_at.desc()).offset(skip).limit(limit).all()
    return {"total": total, "items": items}


def delete_media(db: Session, media_id: int) -> bool:
    """Hapus media berdasarkan ID."""
    media = db.query(Media).filter(Media.id == media_id).first()
    if not media:
        return False
    db.delete(media)
    db.commit()
    return True


# ════════════════════════════════════════
#  SITE CONTENT CRUD
# ════════════════════════════════════════

def get_site_content_by_section(db: Session, section: str) -> dict[str, str | None]:
    """Ambil semua key-value content untuk satu section."""
    rows = db.query(SiteContent).filter(SiteContent.section == section).all()
    return {row.key: row.value for row in rows}


def get_all_site_content(db: Session) -> dict[str, dict[str, str | None]]:
    """Ambil semua site content grouped by section."""
    rows = db.query(SiteContent).all()
    result: dict[str, dict[str, str | None]] = {}
    for row in rows:
        if row.section not in result:
            result[row.section] = {}
        result[row.section][row.key] = row.value
    return result


def upsert_site_content(db: Session, section: str, data: dict[str, str | None]) -> dict[str, str | None]:
    """Update atau insert konten per section. Mengembalikan data terbaru."""
    for key, value in data.items():
        existing = (
            db.query(SiteContent)
            .filter(SiteContent.section == section, SiteContent.key == key)
            .first()
        )
        if existing:
            existing.value = value
        else:
            db.add(SiteContent(section=section, key=key, value=value))
    db.commit()
    return get_site_content_by_section(db, section)


# ════════════════════════════════════════
#  HERO SLIDE CRUD
# ════════════════════════════════════════

def create_hero_slide(db: Session, data: HeroSlideCreate) -> HeroSlide:
    """Buat hero slide baru."""
    slide = HeroSlide(**data.model_dump())
    db.add(slide)
    db.commit()
    db.refresh(slide)
    return slide


def get_hero_slides(db: Session, active_only: bool = False) -> dict:
    """Ambil semua hero slides."""
    query = db.query(HeroSlide)
    if active_only:
        query = query.filter(HeroSlide.is_active == True)
    total = query.count()
    items = query.order_by(HeroSlide.sort_order.asc()).all()
    return {"total": total, "items": items}


def get_hero_slide(db: Session, slide_id: int) -> HeroSlide | None:
    """Ambil satu hero slide."""
    return db.query(HeroSlide).filter(HeroSlide.id == slide_id).first()


def update_hero_slide(db: Session, slide_id: int, data: HeroSlideUpdate) -> HeroSlide | None:
    """Update hero slide."""
    slide = db.query(HeroSlide).filter(HeroSlide.id == slide_id).first()
    if not slide:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(slide, field, value)
    db.commit()
    db.refresh(slide)
    return slide


def delete_hero_slide(db: Session, slide_id: int) -> bool:
    """Hapus hero slide."""
    slide = db.query(HeroSlide).filter(HeroSlide.id == slide_id).first()
    if not slide:
        return False
    db.delete(slide)
    db.commit()
    return True


def reorder_hero_slides(db: Session, order: list[dict[str, int]]) -> list[HeroSlide]:
    """Reorder hero slides berdasarkan array {id, sort_order}."""
    for item in order:
        slide = db.query(HeroSlide).filter(HeroSlide.id == item["id"]).first()
        if slide:
            slide.sort_order = item["sort_order"]
    db.commit()
    return db.query(HeroSlide).order_by(HeroSlide.sort_order.asc()).all()


# ════════════════════════════════════════
#  FACILITY CRUD
# ════════════════════════════════════════

def create_facility(db: Session, data: FacilityCreate) -> Facility:
    """Buat fasilitas baru di database."""
    facility = Facility(**data.model_dump())
    db.add(facility)
    db.commit()
    db.refresh(facility)
    return facility


def get_facilities(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    search: str = None,
    active_only: bool = False,
) -> dict:
    """
    Ambil daftar fasilitas dengan pagination & search.
    - skip: offset untuk pagination
    - limit: jumlah item per halaman
    - search: cari berdasarkan nama atau deskripsi
    - active_only: jika True, hanya kembalikan fasilitas aktif
    """
    query = db.query(Facility)

    if active_only:
        query = query.filter(Facility.is_active == True)

    if search:
        query = query.filter(
            or_(
                Facility.name.ilike(f"%{search}%"),
                Facility.description.ilike(f"%{search}%"),
            )
        )

    total = query.count()
    items = query.order_by(Facility.id.asc()).offset(skip).limit(limit).all()

    return {"total": total, "items": items}


def get_facility(db: Session, facility_id: int) -> Facility | None:
    """Ambil satu fasilitas berdasarkan ID."""
    return db.query(Facility).filter(Facility.id == facility_id).first()


def update_facility(
    db: Session, facility_id: int, data: FacilityUpdate
) -> Facility | None:
    """Update fasilitas berdasarkan ID — hanya field yang dikirim yang diubah."""
    facility = db.query(Facility).filter(Facility.id == facility_id).first()

    if not facility:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(facility, field, value)

    db.commit()
    db.refresh(facility)
    return facility


def delete_facility(db: Session, facility_id: int) -> bool:
    """Hapus fasilitas berdasarkan ID. Return True jika berhasil."""
    facility = db.query(Facility).filter(Facility.id == facility_id).first()

    if not facility:
        return False

    db.delete(facility)
    db.commit()
    return True


# ════════════════════════════════════════
#  ACTIVITY CRUD
# ════════════════════════════════════════

def create_activity(db: Session, data: ActivityCreate) -> Activity:
    """Buat kegiatan baru di database."""
    activity = Activity(**data.model_dump())
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity


def get_activities(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    search: str = None,
    active_only: bool = False,
) -> dict:
    """
    Ambil daftar kegiatan dengan pagination & search.
    """
    query = db.query(Activity)

    if active_only:
        query = query.filter(Activity.is_active == True)

    if search:
        query = query.filter(
            or_(
                Activity.name.ilike(f"%{search}%"),
                Activity.description.ilike(f"%{search}%"),
            )
        )

    total = query.count()
    items = query.order_by(Activity.id.asc()).offset(skip).limit(limit).all()

    return {"total": total, "items": items}


def get_activity(db: Session, activity_id: int) -> Activity | None:
    """Ambil satu kegiatan berdasarkan ID."""
    return db.query(Activity).filter(Activity.id == activity_id).first()


def update_activity(
    db: Session, activity_id: int, data: ActivityUpdate
) -> Activity | None:
    """Update kegiatan berdasarkan ID — hanya field yang dikirim yang diubah."""
    activity = db.query(Activity).filter(Activity.id == activity_id).first()

    if not activity:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(activity, field, value)

    db.commit()
    db.refresh(activity)
    return activity


def delete_activity(db: Session, activity_id: int) -> bool:
    """Hapus kegiatan berdasarkan ID. Return True jika berhasil."""
    activity = db.query(Activity).filter(Activity.id == activity_id).first()

    if not activity:
        return False

    db.delete(activity)
    db.commit()
    return True


# ════════════════════════════════════════
#  NEWS CRUD
# ════════════════════════════════════════

def create_news(db: Session, data: NewsCreate) -> News:
    """Buat berita baru."""
    news = News(**data.model_dump())
    db.add(news)
    db.commit()
    db.refresh(news)
    return news


def get_all_news(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    active_only: bool = False,
) -> dict:
    """Ambil daftar berita dengan pagination."""
    query = db.query(News)
    if active_only:
        query = query.filter(News.is_active == True)
    total = query.count()
    items = query.order_by(News.date.desc(), News.created_at.desc()).offset(skip).limit(limit).all()
    return {"total": total, "items": items}


def get_news(db: Session, news_id: int) -> News | None:
    """Ambil satu berita."""
    return db.query(News).filter(News.id == news_id).first()


def update_news(db: Session, news_id: int, data: NewsUpdate) -> News | None:
    """Update berita."""
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(news, field, value)
    db.commit()
    db.refresh(news)
    return news


def delete_news(db: Session, news_id: int) -> bool:
    """Hapus berita."""
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        return False
    db.delete(news)
    db.commit()
    return True
