"""
FastAPI dependency for extracting and verifying authenticated user from JWT.
"""
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .jwt_handler import extract_user_id_from_token

# HTTP Bearer token security scheme
security = HTTPBearer()


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
) -> str:
    """
    Extract and verify JWT token, return authenticated user_id.

    This dependency should be used on all protected endpoints to ensure
    the request is authenticated and to get the user's identity.

    Args:
        credentials: HTTP Bearer token from Authorization header

    Returns:
        User ID (UUID as string) extracted from verified token

    Raises:
        HTTPException: 401 if token is missing, invalid, or expired
    """
    token = credentials.credentials

    # Extract user_id from token
    user_id = extract_user_id_from_token(token)

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id
