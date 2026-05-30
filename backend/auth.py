"""
auth.py — Utilitas autentikasi admin (JWT + bcrypt)
"""
import os
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from database import get_db
from models import AdminUser

# ── Konfigurasi ──────────────────────────────────────────
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production-32chars!")
ALGORITHM  = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# ── Password hashing (bcrypt) ────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ── Bearer token scheme ──────────────────────────────────
security = HTTPBearer()


def hash_password(password: str) -> str:
    """Hash password menggunakan bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifikasi password terhadap hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Buat JWT access token."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    """Decode dan validasi JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid atau sudah kadaluarsa",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> AdminUser:
    """
    FastAPI dependency — ambil admin user dari JWT token di header Authorization.
    Digunakan di endpoint yang butuh autentikasi admin.
    """
    payload = decode_token(credentials.credentials)
    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid",
        )

    admin = db.query(AdminUser).filter(AdminUser.username == username).first()
    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin tidak ditemukan",
        )
    return admin
