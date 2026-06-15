import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load environment variables dari .env
load_dotenv()

# Ambil DATABASE_URL dari environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback: SQLite local file untuk testing/development
    DATABASE_URL = "sqlite:///./kangbejo.db"

# Gunakan argument check_same_thread khusus untuk SQLite
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

# Buat engine (koneksi ke database)
engine = create_engine(DATABASE_URL, connect_args=connect_args)

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
