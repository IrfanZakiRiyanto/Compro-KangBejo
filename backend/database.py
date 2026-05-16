import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load environment variables dari .env
load_dotenv()

# Ambil DATABASE_URL dari environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback: SQLite in-memory untuk testing di CI (tanpa PostgreSQL)
    DATABASE_URL = "sqlite:///./test.db"
    _SQLITE_ARGS = {"check_same_thread": False}
else:
    _SQLITE_ARGS = {}

# Buat engine (koneksi ke database)
engine = create_engine(DATABASE_URL, connect_args=_SQLITE_ARGS)

# Buat session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class untuk models
Base = declarative_base()


def get_db():
    """
    Dependency injection untuk FastAPI.
    Membuka session saat request masuk, menutup saat selesai.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
