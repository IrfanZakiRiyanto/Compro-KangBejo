from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


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
    is_active: bool = Field(True, examples=[True])


class FacilityCreate(FacilityBase):
    """Schema untuk membuat fasilitas baru (POST)."""
    pass


class FacilityUpdate(BaseModel):
    """Schema untuk update fasilitas — semua field opsional (partial update)."""
    name: Optional[str]        = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    icon: Optional[str]        = Field(None, max_length=10)
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
    is_active: bool = Field(True, examples=[True])


class ActivityCreate(ActivityBase):
    """Schema untuk membuat kegiatan baru (POST)."""
    pass


class ActivityUpdate(BaseModel):
    """Schema untuk update kegiatan — semua field opsional (partial update)."""
    name: Optional[str]        = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    icon: Optional[str]        = Field(None, max_length=10)
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
