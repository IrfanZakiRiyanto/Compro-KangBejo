"""
conftest.py — Pytest fixtures untuk backend Kang Bejo
Modul 10: CI Pipeline
"""
import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# ── Set TESTING=true SEBELUM import main ────────────────────────────────────
# Ini mencegah startup event seeder mengisi data ke DB test
os.environ["TESTING"] = "true"


from main import app
from database import get_db
from models import Base

# ── Database SQLite in-memory untuk testing ──────────────────────
# Tidak butuh PostgreSQL asli saat CI
SQLALCHEMY_TEST_URL = "sqlite:///./test.db"

engine_test = create_engine(
    SQLALCHEMY_TEST_URL,
    connect_args={"check_same_thread": False},  # SQLite requires this
)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine_test
)


@pytest.fixture(scope="function")
def db_session():
    """Buat tabel + session baru untuk setiap test, hapus setelah selesai."""
    Base.metadata.create_all(bind=engine_test)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine_test)


@pytest.fixture(scope="function")
def client(db_session):
    """FastAPI TestClient dengan dependency override ke test DB."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
