from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Facility, Activity
from schemas import FacilityCreate, FacilityUpdate, ActivityCreate, ActivityUpdate


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
