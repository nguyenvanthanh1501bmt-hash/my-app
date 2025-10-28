# app/auth_utils.py
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
import os
from typing import Any, Dict, Optional

# ====== CẤU HÌNH TOKEN ======
SECRET_KEY = os.getenv("JWT_SECRET", "super_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = int(os.getenv("ACCESS_TOKEN_EXPIRE_DAYS", "30"))

# ====== Pydantic SecretStr (nếu có) ======
try:
    from pydantic import SecretStr
except Exception:
    class SecretStr:  # fallback nếu không dùng Pydantic
        pass

# ====== PASSWORD CONTEXT (KHÔNG GIỚI HẠN 72 BYTES) ======
# pbkdf2_sha256 là chuẩn phổ biến, không phụ thuộc gói bcrypt, chạy ổn cross-platform
pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto",
)

MIN_PASSWORD_LEN = int(os.getenv("MIN_PASSWORD_LEN", "6"))

def _normalize_password(pw: Any) -> str:
    if isinstance(pw, SecretStr):
        try:
            pw = pw.get_secret_value()
        except Exception:
            pw = str(pw)
    elif not isinstance(pw, str):
        pw = str(pw)
    return pw.strip()

# ====== HASH & VERIFY ======
def hash_pw(password: Any) -> str:
    pw = _normalize_password(password)
    if len(pw) < MIN_PASSWORD_LEN:
        raise ValueError(f"Password must be at least {MIN_PASSWORD_LEN} characters")
    return pwd_context.hash(pw)

def verify_pw(password: Any, hashed_pw: str) -> bool:
    return pwd_context.verify(_normalize_password(password), hashed_pw)

# ====== TOKEN ======
def issue_token(data: Dict[str, Any], expires_days: int = ACCESS_TOKEN_EXPIRE_DAYS) -> str:
    to_encode = data.copy()
    to_encode.update({"exp": datetime.now(timezone.utc) + timedelta(days=expires_days)})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None

def get_user_id_from_token(token: str) -> Optional[int]:
    payload = decode_token(token)
    return payload.get("id") if payload else None
