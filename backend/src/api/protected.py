"""
Example protected API endpoints demonstrating authentication enforcement.
"""
from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session
from ..auth.dependencies import get_current_user
from ..core.database import get_session

router = APIRouter(prefix="/api", tags=["Protected"])


@router.get("/example")
async def get_example_protected_resource(
    user_id: Annotated[str, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    """
    Example protected endpoint demonstrating authentication enforcement.

    This endpoint requires a valid JWT token and demonstrates:
    - Token verification via get_current_user dependency
    - User identity extraction from token
    - Data filtering by authenticated user_id

    Returns:
        Example data filtered by authenticated user
    """
    return {
        "message": "This is a protected resource",
        "user_id": user_id,
        "data": {
            "example": "This data is filtered by authenticated user_id",
            "note": "In a real application, this would query the database with user_id filter"
        }
    }


@router.get("/profile")
async def get_user_profile(
    user_id: Annotated[str, Depends(get_current_user)]
):
    """
    Get authenticated user's profile.

    Demonstrates protected endpoint pattern with user_id from token.
    """
    return {
        "user_id": user_id,
        "message": "User profile data would be returned here",
        "note": "All queries must filter by this user_id to ensure data isolation"
    }
