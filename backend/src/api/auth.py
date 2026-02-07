"""
Authentication API endpoints: signup, signin, and user info.
"""
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from ..models.user import User, UserCreate, UserSignIn, UserResponse, AuthResponse
from ..core.database import get_session
from ..core.security import hash_password, verify_password
from ..auth.jwt_handler import create_jwt_token
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserCreate,
    session: Annotated[Session, Depends(get_session)]
):
    """
    Create a new user account.

    - Validates email format and password strength
    - Checks for duplicate email
    - Hashes password with bcrypt
    - Creates user in database
    - Returns user info and JWT token
    """
    # Normalize email to lowercase
    email = user_data.email.lower()

    # Check if email already exists
    existing_user = session.exec(
        select(User).where(User.email == email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash password
    hashed_password = hash_password(user_data.password)

    # Create user
    user = User(
        email=email,
        hashed_password=hashed_password
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    # Generate JWT token
    token = create_jwt_token(user_id=str(user.id), email=user.email)

    # Return user and token
    return AuthResponse(
        user=UserResponse(
            id=user.id,
            email=user.email,
            created_at=user.created_at
        ),
        token=token
    )


@router.post("/signin", response_model=AuthResponse)
async def signin(
    credentials: UserSignIn,
    session: Annotated[Session, Depends(get_session)]
):
    """
    Authenticate user with email and password.

    - Validates credentials
    - Returns user info and JWT token
    """
    # Normalize email to lowercase
    email = credentials.email.lower()

    # Lookup user by email
    user = session.exec(
        select(User).where(User.email == email)
    ).first()

    # Verify user exists and password is correct
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Generate JWT token
    token = create_jwt_token(user_id=str(user.id), email=user.email)

    # Return user and token
    return AuthResponse(
        user=UserResponse(
            id=user.id,
            email=user.email,
            created_at=user.created_at
        ),
        token=token
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    user_id: Annotated[str, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    """
    Get current authenticated user's information.

    Requires valid JWT token in Authorization header.
    """
    # Lookup user by ID from token
    user = session.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return UserResponse(
        id=user.id,
        email=user.email,
        created_at=user.created_at
    )
