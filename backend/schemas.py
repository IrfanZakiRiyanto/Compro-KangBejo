from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ════════════════════════════════════════
#  AUTH SCHEMAS
# ════════════════════════════════════════

class AdminLogin(BaseModel):
    """Schema untuk login admin."""
    username: str = Field(..., min_length=1, max_length=50)
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    """Schema response setelah login berhasil."""
    access_token: str
    token_type: str = "bearer"


class AdminResponse(BaseModel):
    """Schema response info admin."""
    id: int
    username: str
    created_at: datetime

    class Config:
        from_attributes = True


# ════════════════════════════════════════
#  MEDIA SCHEMAS
# ════════════════════════════════════════

class MediaResponse(BaseModel):
    """Schema response untuk file media yang tersimpan di database."""
    id: int
    filename: str
    mime_type: str
    size: int
    created_at: datetime

    class Config:
        from_attributes = True


class MediaListResponse(BaseModel):
    """Schema response daftar media."""
    total: int
    items: list[MediaResponse]


# ════════════════════════════════════════
#  SITE CONTENT SCHEMAS
# ════════════════════════════════════════

class SiteContentUpdate(BaseModel):
    """Schema untuk update konten section — key-value pairs."""
    data: dict[str, str | int | None] = Field(
        ...,
        examples=[{"title": "Judul Baru", "subtitle": "Subtitle Baru"}],
    )


class SiteContentResponse(BaseModel):
    """Schema response konten satu section."""
    section: str
    data: dict[str, str | None]


class AllSiteContentResponse(BaseModel):
    """Schema response semua konten section."""
    sections: dict[str, dict[str, str | None]]


# ════════════════════════════════════════
#  HERO SLIDE SCHEMAS
# ════════════════════════════════════════

class HeroSlideCreate(BaseModel):
    """Schema untuk membuat hero slide baru."""
    media_id: Optional[int] = None
    sort_order: int = 0
    is_active: bool = True


class HeroSlideUpdate(BaseModel):
    """Schema untuk update hero slide."""
    media_id: Optional[int] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class HeroSlideResponse(BaseModel):
    """Schema response hero slide."""
    id: int
    media_id: Optional[int] = None
    sort_order: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class HeroSlideListResponse(BaseModel):
    """Schema response daftar hero slides."""
    total: int
    items: list[HeroSlideResponse]


class HeroSlideReorder(BaseModel):
    """Schema untuk reorder slides — array of {id, sort_order}."""
    order: list[dict[str, int]] = Field(
        ...,
        examples=[[{"id": 1, "sort_order": 0}, {"id": 2, "sort_order": 1}]],
    )


# ════════════════════════════════════════
#  FACILITY SCHEMAS
# ════════════════════════════════════════

class FacilityBase(BaseModel):
    """Base schema — field yang dipakai untuk create & update Facility."""
    name: str = Field(
        ..., min_length=1, max_length=100,
        examples=["Kebun Kangkung"]
    )
    description: Optional[str] = Field(
        None, examples=["Hamparan kebun kangkung segar, ikon utama desa wisata ini."]
    )
    icon: Optional[str] = Field(
        None, max_length=10, examples=["🌿"]
    )
    media_id: Optional[int] = Field(None, description="ID media untuk gambar fasilitas")
    is_active: bool = Field(True, examples=[True])


class FacilityCreate(FacilityBase):
    """Schema untuk membuat fasilitas baru (POST)."""
    pass


class FacilityUpdate(BaseModel):
    """Schema untuk update fasilitas — semua field opsional (partial update)."""
    name: Optional[str]        = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    icon: Optional[str]        = Field(None, max_length=10)
    media_id: Optional[int]    = None
    is_active: Optional[bool]  = None


class FacilityResponse(FacilityBase):
    """Schema untuk response — termasuk id dan timestamp dari database."""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FacilityListResponse(BaseModel):
    """Schema untuk response list fasilitas dengan metadata pagination."""
    total: int
    items: list[FacilityResponse]


# ════════════════════════════════════════
#  ACTIVITY SCHEMAS
# ════════════════════════════════════════

class ActivityBase(BaseModel):
    """Base schema — field yang dipakai untuk create & update Activity."""
    name: str = Field(
        ..., min_length=1, max_length=100,
        examples=["Tanam Kangkung"]
    )
    description: Optional[str] = Field(
        None, examples=["Pengalaman seru menanam kangkung bersama petani lokal."]
    )
    icon: Optional[str] = Field(
        None, max_length=10, examples=["🌱"]
    )
    media_id: Optional[int] = Field(None, description="ID media untuk gambar kegiatan")
    is_active: bool = Field(True, examples=[True])


class ActivityCreate(ActivityBase):
    """Schema untuk membuat kegiatan baru (POST)."""
    pass


class ActivityUpdate(BaseModel):
    """Schema untuk update kegiatan — semua field opsional (partial update)."""
    name: Optional[str]        = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    icon: Optional[str]        = Field(None, max_length=10)
    media_id: Optional[int]    = None
    is_active: Optional[bool]  = None


class ActivityResponse(ActivityBase):
    """Schema untuk response — termasuk id dan timestamp dari database."""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ActivityListResponse(BaseModel):
    """Schema untuk response list kegiatan dengan metadata pagination."""
    total: int
    items: list[ActivityResponse]


# ════════════════════════════════════════
#  NEWS SCHEMAS
# ════════════════════════════════════════

class NewsBase(BaseModel):
    """Base schema untuk News."""
    title: str = Field(..., min_length=1, max_length=200, examples=["Panen Raya Kangkung"])
    description: Optional[str] = Field(None, examples=["Deskripsi berita."])
    date: Optional[str] = Field(None, max_length=50, examples=["12 Agustus 2026"])
    media_id: Optional[int] = Field(None, description="ID media untuk gambar berita")
    is_active: bool = Field(True)
    sort_order: int = Field(0)


class NewsCreate(NewsBase):
    """Schema untuk membuat berita baru."""
    pass


class NewsUpdate(BaseModel):
    """Schema untuk update berita — semua field opsional."""
    title: Optional[str]       = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    date: Optional[str]        = Field(None, max_length=50)
    media_id: Optional[int]    = None
    is_active: Optional[bool]  = None
    sort_order: Optional[int]  = None


class NewsResponse(NewsBase):
    """Schema response berita."""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class NewsListResponse(BaseModel):
    """Schema response daftar berita."""
    total: int
    items: list[NewsResponse]
