from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
import bcrypt
from app.core.config import get_settings


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def verify_password(plain_password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), password_hash.encode('utf-8'))


def _create_token(subject: str, token_type: str, expires_delta: timedelta) -> str:
    settings = get_settings()
    expires_at = datetime.now(timezone.utc) + expires_delta
    payload = {"sub": subject, "type": token_type, "exp": expires_at}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def create_access_token(subject: str) -> str:
    settings = get_settings()
    return _create_token(subject, "access", timedelta(minutes=settings.access_token_expire_minutes))


def create_refresh_token(subject: str) -> str:
    settings = get_settings()
    return _create_token(subject, "refresh", timedelta(days=settings.refresh_token_expire_days))


def verify_token(token: str, expected_type: str) -> str | None:
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        return None
    subject = payload.get("sub")
    if not isinstance(subject, str) or payload.get("type") != expected_type:
        return None
    return subject
