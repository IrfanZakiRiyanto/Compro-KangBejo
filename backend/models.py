from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base


class Facility(Base):
    """
    Model untuk tabel 'facilities' — fasilitas yang tersedia di Desa Wisata Kang Bejo.
    """
    __tablename__ = "facilities"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name        = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    icon        = Column(String(10), nullable=True)   # emoji icon
    is_active   = Column(Boolean, default=True, nullable=False)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    updated_at  = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Facility(id={self.id}, name='{self.name}')>"


class Activity(Base):
    """
    Model untuk tabel 'activities' — kegiatan yang bisa diikuti di Desa Wisata Kang Bejo.
    """
    __tablename__ = "activities"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name        = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    icon        = Column(String(10), nullable=True)   # emoji icon
    is_active   = Column(Boolean, default=True, nullable=False)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    updated_at  = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Activity(id={self.id}, name='{self.name}')>"
