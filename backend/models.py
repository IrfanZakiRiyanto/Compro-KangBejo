from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, LargeBinary, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


# ════════════════════════════════════════════════════════
#  ADMIN USER
# ════════════════════════════════════════════════════════

class AdminUser(Base):
    """Model untuk tabel 'admin_users' — akun admin CMS."""
    __tablename__ = "admin_users"

    id            = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username      = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<AdminUser(id={self.id}, username='{self.username}')>"


# ════════════════════════════════════════════════════════
#  MEDIA (gambar/video disimpan di database)
# ════════════════════════════════════════════════════════

class Media(Base):
    """
    Model untuk tabel 'media' — file gambar/video disimpan sebagai binary di DB.
    PostgreSQL: BYTEA, SQLite: BLOB.
    """
    __tablename__ = "media"

    id         = Column(Integer, primary_key=True, index=True, autoincrement=True)
    filename   = Column(String(255), nullable=False)
    mime_type  = Column(String(100), nullable=False)  # e.g. image/jpeg, image/png, video/mp4
    data       = Column(LargeBinary, nullable=False)   # Binary data file
    size       = Column(Integer, nullable=False)        # Ukuran file dalam bytes
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Media(id={self.id}, filename='{self.filename}', size={self.size})>"


# ════════════════════════════════════════════════════════
#  SITE CONTENT (key-value store per section)
# ════════════════════════════════════════════════════════

class SiteContent(Base):
    """
    Model untuk tabel 'site_content' — key-value store konten tiap section.
    Contoh: section='hero', key='title', value='Selamat Datang di Kang Bejo'
    """
    __tablename__ = "site_content"

    id         = Column(Integer, primary_key=True, index=True, autoincrement=True)
    section    = Column(String(50), nullable=False, index=True)   # hero, about, contact, footer, navbar
    key        = Column(String(100), nullable=False)
    value      = Column(Text, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<SiteContent(section='{self.section}', key='{self.key}')>"


# ════════════════════════════════════════════════════════
#  HERO SLIDES
# ════════════════════════════════════════════════════════

class HeroSlide(Base):
    """Model untuk tabel 'hero_slides' — gambar background hero yang bisa ditambah/hapus."""
    __tablename__ = "hero_slides"

    id         = Column(Integer, primary_key=True, index=True, autoincrement=True)
    media_id   = Column(Integer, ForeignKey("media.id", ondelete="SET NULL"), nullable=True)
    sort_order = Column(Integer, default=0, nullable=False)
    is_active  = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    media = relationship("Media", lazy="joined")

    def __repr__(self):
        return f"<HeroSlide(id={self.id}, media_id={self.media_id}, order={self.sort_order})>"


# ════════════════════════════════════════════════════════
#  FACILITY
# ════════════════════════════════════════════════════════

class Facility(Base):
    """
    Model untuk tabel 'facilities' — fasilitas yang tersedia di Desa Wisata Kang Bejo.
    """
    __tablename__ = "facilities"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name        = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    icon        = Column(String(10), nullable=True)   # emoji icon
    media_id    = Column(Integer, ForeignKey("media.id", ondelete="SET NULL"), nullable=True)
    is_active   = Column(Boolean, default=True, nullable=False)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    updated_at  = Column(DateTime(timezone=True), onupdate=func.now())

    media = relationship("Media", lazy="joined")

    def __repr__(self):
        return f"<Facility(id={self.id}, name='{self.name}')>"


# ════════════════════════════════════════════════════════
#  ACTIVITY
# ════════════════════════════════════════════════════════

class Activity(Base):
    """
    Model untuk tabel 'activities' — kegiatan yang bisa diikuti di Desa Wisata Kang Bejo.
    """
    __tablename__ = "activities"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name        = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    icon        = Column(String(10), nullable=True)   # emoji icon
    media_id    = Column(Integer, ForeignKey("media.id", ondelete="SET NULL"), nullable=True)
    is_active   = Column(Boolean, default=True, nullable=False)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    updated_at  = Column(DateTime(timezone=True), onupdate=func.now())

    media = relationship("Media", lazy="joined")

    def __repr__(self):
        return f"<Activity(id={self.id}, name='{self.name}')>"


# ════════════════════════════════════════════════════════
#  NEWS
# ════════════════════════════════════════════════════════

class News(Base):
    """Model untuk tabel 'news' — berita/artikel desa wisata (menggantikan data dummy)."""
    __tablename__ = "news"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title       = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    date        = Column(String(50), nullable=True)
    media_id    = Column(Integer, ForeignKey("media.id", ondelete="SET NULL"), nullable=True)
    is_active   = Column(Boolean, default=True, nullable=False)
    sort_order  = Column(Integer, default=0, nullable=False)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    updated_at  = Column(DateTime(timezone=True), onupdate=func.now())

    media = relationship("Media", lazy="joined")

    def __repr__(self):
        return f"<News(id={self.id}, title='{self.title}')>"
