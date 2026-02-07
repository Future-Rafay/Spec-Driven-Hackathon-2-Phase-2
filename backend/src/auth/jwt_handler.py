"""
JWT token handling: creation, verification, and user extraction.
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from ..core.config import settings


# JWT configuration
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7


def create_jwt_token(user_id: str, email: str) -> str:
    """
    Create a JWT token with user information and 7-day expiry.

    Args:
        user_id: User's unique identifier (UUID as string)
        email: User's email address

    Returns:
        Encoded JWT token string
    """
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)

    payload = {
        "sub": user_id,
        "user_id": user_id,
        "email": email,
        "exp": expire,
        "iat": datetime.utcnow(),
        "iss": "todo-app"
    }

    encoded_jwt = jwt.encode(
        payload,
        settings.BETTER_AUTH_SECRET,
        algorithm=ALGORITHM
    )

    return encoded_jwt


def verify_jwt_token(token: str) -> Optional[dict]:
    """
    Verify JWT token signature and decode payload.

    Args:
        token: JWT token string to verify

    Returns:
        Decoded token payload if valid, None if invalid
    """
    try:
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=[ALGORITHM]
        )
        return payload
    except JWTError:
        return None


def extract_user_id_from_token(token: str) -> Optional[str]:
    """
    Extract user_id from verified JWT token.

    Args:
        token: JWT token string

    Returns:
        User ID string if token is valid, None otherwise
    """
    payload = verify_jwt_token(token)
    if payload is None:
        return None

    user_id: Optional[str] = payload.get("user_id")
    return user_id
