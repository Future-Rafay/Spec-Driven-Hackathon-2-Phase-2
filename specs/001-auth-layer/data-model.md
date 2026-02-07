# Data Model: Authentication & Identity Layer

**Feature**: 001-auth-layer
**Date**: 2026-02-08
**Purpose**: Define database schema and entity relationships for authentication

## Entities

### User

**Purpose**: Represents a registered user account with authentication credentials and unique identity.

**Attributes**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL, DEFAULT uuid_generate_v4() | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | User's email address (used for sign-in) |
| hashed_password | VARCHAR(255) | NOT NULL | bcrypt-hashed password |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes**:
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email` (for fast lookup during sign-in)

**Validation Rules**:
- Email must match RFC 5322 format
- Email must be unique across all users
- Password must be at least 8 characters
- Password must contain at least one uppercase, one lowercase, one digit
- Password is never stored in plain text (always hashed with bcrypt)

**State Transitions**:
```
[No Account] --signup--> [Active Account]
```

**Relationships**:
- One User has many Tasks (future feature, not in this spec)
- User ID is referenced in JWT token payload for authentication

---

## Database Schema (SQL)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast email lookup during sign-in
CREATE INDEX idx_users_email ON users(email);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## SQLModel Implementation (Python)

```python
# backend/src/models/user.py
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel

class User(SQLModel, table=True):
    """User account model for authentication"""
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(SQLModel):
    """Schema for user signup request"""
    email: str = Field(max_length=255)
    password: str = Field(min_length=8)

class UserSignIn(SQLModel):
    """Schema for user sign-in request"""
    email: str = Field(max_length=255)
    password: str

class UserResponse(SQLModel):
    """Schema for user data in responses (no password)"""
    id: UUID
    email: str
    created_at: datetime
```

---

## Data Integrity Rules

### At Database Level
1. **Uniqueness**: Email must be unique (enforced by UNIQUE constraint)
2. **Non-null**: Email and hashed_password cannot be null
3. **Primary Key**: User ID is auto-generated UUID

### At Application Level
1. **Email Validation**: Must match email regex pattern before insert
2. **Password Strength**: Validated before hashing (min 8 chars, complexity)
3. **Password Hashing**: Always hash with bcrypt before storing
4. **No Plain Passwords**: Never log or return plain passwords

### At API Level
1. **Input Sanitization**: Trim whitespace from email
2. **Case Normalization**: Convert email to lowercase before storage
3. **Duplicate Detection**: Check email uniqueness before insert
4. **Error Messages**: Generic messages to prevent user enumeration

---

## Migration Strategy

### Initial Migration (001_create_users_table.sql)

```sql
-- Migration: 001_create_users_table
-- Description: Create users table for authentication
-- Date: 2026-02-08

BEGIN;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for email lookups
CREATE INDEX idx_users_email ON users(email);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMIT;
```

### Rollback Migration (001_drop_users_table.sql)

```sql
-- Rollback: 001_create_users_table
-- Description: Drop users table and related objects
-- Date: 2026-02-08

BEGIN;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS users;

COMMIT;
```

---

## Data Access Patterns

### Create User (Signup)
```python
# Check if email exists
existing_user = session.exec(
    select(User).where(User.email == email.lower())
).first()

if existing_user:
    raise HTTPException(status_code=400, detail="Email already registered")

# Hash password and create user
hashed_password = hash_password(password)
user = User(email=email.lower(), hashed_password=hashed_password)
session.add(user)
session.commit()
session.refresh(user)
```

### Verify Credentials (Sign-in)
```python
# Lookup user by email
user = session.exec(
    select(User).where(User.email == email.lower())
).first()

if not user or not verify_password(password, user.hashed_password):
    raise HTTPException(status_code=401, detail="Invalid credentials")

# Generate JWT token with user.id
token = create_jwt_token(user_id=str(user.id))
```

### Get User by ID (from JWT)
```python
# Extract user_id from verified JWT token
user_id = get_current_user(token)  # Returns UUID from token

# Lookup user (optional, if user details needed)
user = session.get(User, user_id)
if not user:
    raise HTTPException(status_code=401, detail="User not found")
```

---

## Security Considerations

### Password Storage
- ✅ Never store plain text passwords
- ✅ Use bcrypt with cost factor 12
- ✅ Hash on write, verify on read
- ✅ No password in logs or responses

### Email Privacy
- ✅ Email is indexed but not exposed in error messages
- ✅ Generic "Invalid credentials" message prevents user enumeration
- ✅ Case-insensitive comparison (normalize to lowercase)

### User ID Exposure
- ✅ UUID format prevents sequential enumeration
- ✅ User ID in JWT token is signed and verified
- ✅ User ID used for data isolation in queries

---

## Future Extensions (Out of Current Scope)

### Potential Additional Fields
- `is_active`: Boolean flag for account deactivation
- `email_verified`: Boolean flag for email verification
- `last_login_at`: Timestamp of last successful sign-in
- `failed_login_attempts`: Counter for rate limiting

### Potential Additional Tables
- `password_reset_tokens`: For password reset flow
- `refresh_tokens`: For token refresh strategy
- `user_sessions`: For session management (if moving away from stateless)

---

## Summary

**Entity Count**: 1 (User)
**Table Count**: 1 (users)
**Indexes**: 2 (primary key on id, unique index on email)
**Relationships**: None (self-contained for authentication)

**Validation**: Email format, password strength, uniqueness checks
**Security**: bcrypt hashing, no plain passwords, generic error messages
**Performance**: Indexed email for fast lookups (<50ms per spec)

Ready for API contract definition.
