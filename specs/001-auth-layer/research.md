# Research: Authentication & Identity Layer

**Feature**: 001-auth-layer
**Date**: 2026-02-08
**Purpose**: Document technical decisions, best practices, and implementation patterns for JWT-based authentication

## Research Questions & Decisions

### 1. Better Auth Configuration for JWT

**Question**: How should Better Auth be configured to issue JWT tokens compatible with FastAPI backend verification?

**Decision**: Configure Better Auth with JWT session strategy, custom token expiry, and explicit user ID inclusion in token payload.

**Rationale**:
- Better Auth supports multiple session strategies; JWT is stateless and aligns with constitutional requirements
- Custom token expiry (7 days) balances security and user convenience per spec
- User ID must be in token payload for backend to extract identity without database lookup

**Configuration Pattern**:
```typescript
// frontend/src/lib/auth.ts
import { betterAuth } from "better-auth/client"

export const authClient = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  session: {
    strategy: "jwt",
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
  },
  jwt: {
    secret: process.env.BETTER_AUTH_SECRET,
    expiresIn: "7d",
  },
})
```

**Alternatives Considered**:
- Session-based auth: Rejected - requires server-side session storage, violates stateless requirement
- OAuth-only: Rejected - out of scope per spec, adds complexity

---

### 2. JWT Token Structure & Claims

**Question**: What claims should be included in the JWT token payload?

**Decision**: Include standard claims (iss, sub, exp, iat) plus custom user_id claim.

**Rationale**:
- `sub` (subject): Standard claim for user identifier
- `exp` (expiration): Required for token expiry enforcement
- `iat` (issued at): Enables token age verification
- `user_id`: Explicit custom claim for backend to extract authenticated user

**Token Payload Structure**:
```json
{
  "sub": "user-uuid-here",
  "user_id": "user-uuid-here",
  "email": "user@example.com",
  "exp": 1738972800,
  "iat": 1738368000,
  "iss": "todo-app"
}
```

**Alternatives Considered**:
- Minimal claims (sub only): Rejected - less explicit, harder to debug
- Role-based claims: Rejected - RBAC out of scope per spec

---

### 3. FastAPI JWT Verification Strategy

**Question**: Should JWT verification happen at middleware level or per-route dependency injection?

**Decision**: Use FastAPI dependency injection with a reusable `get_current_user` dependency.

**Rationale**:
- Dependency injection is idiomatic FastAPI pattern
- Allows selective protection (some routes may not need auth)
- Easier to test in isolation
- Middleware would apply globally, harder to exclude routes

**Implementation Pattern**:
```python
# backend/src/auth/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """Extract and verify JWT, return user_id"""
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.BETTER_AUTH_SECRET,
            algorithms=["HS256"]
        )
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401)
        return user_id
    except JWTError:
        raise HTTPException(status_code=401)
```

**Alternatives Considered**:
- Global middleware: Rejected - less flexible, harder to exclude public routes
- Per-route manual verification: Rejected - code duplication, error-prone

---

### 4. Password Hashing Strategy

**Question**: Which password hashing algorithm should be used for storing user passwords?

**Decision**: Use bcrypt via `passlib` library with default cost factor (12 rounds).

**Rationale**:
- bcrypt is industry standard for password hashing
- Adaptive cost factor protects against future hardware improvements
- Well-supported in Python ecosystem via passlib
- Better Auth likely uses bcrypt internally for consistency

**Implementation Pattern**:
```python
# backend/src/core/security.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

**Alternatives Considered**:
- argon2: Rejected - less ecosystem support, overkill for current scale
- SHA256: Rejected - not designed for passwords, no adaptive cost

---

### 5. Token Storage on Frontend

**Question**: Where should the JWT token be stored on the frontend?

**Decision**: Store in httpOnly cookies managed by Better Auth, with fallback to localStorage for API client.

**Rationale**:
- httpOnly cookies prevent XSS attacks from stealing tokens
- Better Auth handles cookie management automatically
- localStorage needed for explicit API calls with Authorization header
- Dual storage provides defense in depth

**Implementation Pattern**:
```typescript
// frontend/src/lib/api-client.ts
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("auth_token") // Better Auth sets this

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}
```

**Alternatives Considered**:
- localStorage only: Rejected - vulnerable to XSS
- sessionStorage: Rejected - lost on tab close, poor UX
- Memory only: Rejected - lost on page refresh

---

### 6. Shared Secret Management

**Question**: How should the shared JWT secret be managed across frontend and backend?

**Decision**: Store in root `.env` file, load via environment variables in both projects, never commit to git.

**Rationale**:
- Single source of truth prevents secret mismatch
- Environment variables are standard for secrets management
- `.env` in `.gitignore` prevents accidental commits
- Both projects can access same secret via their respective env loaders

**File Structure**:
```bash
# Root .env (gitignored)
BETTER_AUTH_SECRET=your-secret-key-here-min-32-chars

# backend/.env.example (committed)
BETTER_AUTH_SECRET=change-me-in-production

# frontend/.env.local.example (committed)
NEXT_PUBLIC_API_URL=http://localhost:8080
BETTER_AUTH_SECRET=change-me-in-production
```

**Alternatives Considered**:
- Separate secrets: Rejected - tokens wouldn't verify across systems
- Hardcoded: Rejected - violates constitutional security principles
- Secret management service: Rejected - overkill for current scope

---

### 7. Error Response Format

**Question**: What format should authentication error responses follow?

**Decision**: Use consistent JSON error format with `detail` field and appropriate HTTP status codes.

**Rationale**:
- FastAPI default error format uses `detail` field
- Consistency simplifies frontend error handling
- HTTP status codes (401, 403) are semantically correct per spec

**Error Response Format**:
```json
{
  "detail": "Could not validate credentials"
}
```

**Status Code Mapping**:
- 401 Unauthorized: Missing token, invalid token, expired token
- 403 Forbidden: Valid token but insufficient permissions (cross-user access)
- 422 Unprocessable Entity: Validation errors (weak password, invalid email)

**Alternatives Considered**:
- Custom error codes: Rejected - HTTP status codes are sufficient
- Verbose error messages: Rejected - security risk (information leakage)

---

### 8. Token Expiry Handling

**Question**: How should the frontend handle expired tokens?

**Decision**: Detect 401 responses, clear stored token, redirect to sign-in page.

**Rationale**:
- 401 indicates authentication failure (including expiry)
- Clearing token prevents retry loops
- Redirect to sign-in provides clear user action
- No automatic refresh (out of scope per spec)

**Implementation Pattern**:
```typescript
// frontend/src/lib/api-client.ts
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(/* ... */)

  if (response.status === 401) {
    localStorage.removeItem("auth_token")
    window.location.href = "/signin"
    throw new Error("Authentication expired")
  }

  return response
}
```

**Alternatives Considered**:
- Automatic token refresh: Rejected - out of scope per spec
- Silent failure: Rejected - poor UX, confusing for users

---

## Technology Stack Validation

### Frontend Dependencies
- `better-auth`: ^1.0.0 - Authentication library with JWT support
- `next`: ^16.0.0 - React framework with App Router
- `react`: ^19.0.0 - UI library
- `typescript`: ^5.0.0 - Type safety

### Backend Dependencies
- `fastapi`: ^0.115.0 - Web framework
- `sqlmodel`: ^0.0.22 - ORM with Pydantic integration
- `python-jose[cryptography]`: ^3.3.0 - JWT encoding/decoding
- `passlib[bcrypt]`: ^1.7.4 - Password hashing
- `python-multipart`: ^0.0.9 - Form data parsing
- `psycopg2-binary`: ^2.9.9 - PostgreSQL driver

### Database
- Neon Serverless PostgreSQL - Managed PostgreSQL with connection pooling

---

## Security Considerations

### Implemented Protections
1. **Password Security**: bcrypt hashing with adaptive cost
2. **Token Security**: HMAC-SHA256 signature, 7-day expiry
3. **Secret Management**: Environment variables only, never in code
4. **Transport Security**: HTTPS required in production (deployment concern)
5. **Input Validation**: Email format, password strength checks
6. **Error Messages**: Generic messages to prevent information leakage

### Known Limitations (Out of Scope)
1. No rate limiting on auth endpoints (brute force protection)
2. No account lockout after failed attempts
3. No password reset flow
4. No multi-factor authentication
5. No token refresh mechanism

---

## Performance Considerations

### Expected Latency
- JWT verification: <10ms (cryptographic operation)
- Database user lookup (signup/signin): <50ms (indexed email query)
- Total auth overhead per request: <50ms (meets SC-008 requirement)

### Optimization Strategies
- JWT verification is stateless (no database lookup per request)
- Password hashing uses appropriate cost factor (not too slow)
- Database indexes on user email for fast lookups

---

## Testing Strategy

### Unit Tests
- JWT encoding/decoding functions
- Password hashing/verification functions
- Token expiry validation logic

### Integration Tests
- Signup flow: email validation, password hashing, user creation
- Signin flow: credential verification, token issuance
- Protected endpoint: token verification, user extraction

### Contract Tests
- API endpoint request/response formats
- Error response structures
- Token payload structure

---

## Summary

All technical decisions documented and aligned with constitutional principles:
- ✅ Security-by-design: JWT verification, password hashing, secret management
- ✅ Stateless authentication: No server-side sessions
- ✅ Separation of concerns: Clear frontend/backend boundaries
- ✅ Production-oriented: Industry-standard libraries and patterns
- ✅ Deterministic: Explicit configuration, reproducible setup

Ready to proceed to Phase 1: Data Model & Contracts.
