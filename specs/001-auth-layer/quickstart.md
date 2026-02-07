# Quickstart: Authentication & Identity Layer

**Feature**: 001-auth-layer
**Date**: 2026-02-08
**Purpose**: Step-by-step guide for implementing and testing JWT-based authentication

## Prerequisites

- Node.js 20+ installed
- Python 3.11+ installed
- Neon PostgreSQL database provisioned
- Git repository cloned

## Environment Setup

### 1. Generate Shared Secret

```bash
# Generate a secure random secret (minimum 32 characters)
openssl rand -base64 32
```

### 2. Create Environment Files

**Root `.env` (shared secret)**:
```bash
# .env (add to .gitignore)
BETTER_AUTH_SECRET=your-generated-secret-here-min-32-chars
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

**Backend `.env.example`**:
```bash
# backend/.env.example (commit this)
BETTER_AUTH_SECRET=change-me-in-production
DATABASE_URL=postgresql://user:password@localhost/todo_app
```

**Frontend `.env.local.example`**:
```bash
# frontend/.env.local.example (commit this)
NEXT_PUBLIC_API_URL=http://localhost:8080
BETTER_AUTH_SECRET=change-me-in-production
```

### 3. Copy Examples to Active Files

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with actual values

# Frontend
cp frontend/.env.local.example frontend/.env.local
# Edit frontend/.env.local with actual values
```

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**requirements.txt**:
```
fastapi==0.115.0
sqlmodel==0.0.22
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9
psycopg2-binary==2.9.9
uvicorn[standard]==0.30.0
pydantic-settings==2.5.0
```

### 2. Run Database Migrations

```bash
# Apply initial migration
psql $DATABASE_URL -f backend/migrations/001_create_users_table.sql

# Or use Alembic (if configured)
alembic upgrade head
```

### 3. Start Backend Server

```bash
cd backend
uvicorn src.main:app --reload --port 8080
```

**Verify**: Visit http://localhost:8080/docs for API documentation

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

**package.json dependencies**:
```json
{
  "dependencies": {
    "better-auth": "^1.0.0",
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 2. Start Frontend Server

```bash
cd frontend
npm run dev
```

**Verify**: Visit http://localhost:3000

## Testing the Authentication Flow

### 1. Test Signup (User Story 1)

**Manual Test**:
1. Navigate to http://localhost:3000/signup
2. Enter email: `test@example.com`
3. Enter password: `SecurePass123`
4. Click "Sign Up"
5. ✅ Verify: Account created, JWT token received, redirected to dashboard

**API Test (curl)**:
```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'

# Expected Response (201):
# {
#   "user": {
#     "id": "550e8400-e29b-41d4-a716-446655440000",
#     "email": "test@example.com",
#     "created_at": "2026-02-08T12:00:00Z"
#   },
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# }
```

**Automated Test (pytest)**:
```bash
cd backend
pytest tests/test_auth.py::test_signup_success -v
```

### 2. Test Signin (User Story 2)

**Manual Test**:
1. Navigate to http://localhost:3000/signin
2. Enter email: `test@example.com`
3. Enter password: `SecurePass123`
4. Click "Sign In"
5. ✅ Verify: Authenticated, JWT token received, redirected to dashboard

**API Test (curl)**:
```bash
curl -X POST http://localhost:8080/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'

# Expected Response (200):
# {
#   "user": { ... },
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# }
```

**Automated Test (pytest)**:
```bash
cd backend
pytest tests/test_auth.py::test_signin_success -v
```

### 3. Test Protected API Access (User Story 3)

**Manual Test**:
1. Sign in to get JWT token
2. Open browser DevTools → Network tab
3. Make any API request to protected endpoint
4. ✅ Verify: Authorization header includes `Bearer <token>`
5. ✅ Verify: Request succeeds with 200 status

**API Test (curl)**:
```bash
# Get token from signin
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Test protected endpoint
curl -X GET http://localhost:8080/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "id": "550e8400-e29b-41d4-a716-446655440000",
#   "email": "test@example.com",
#   "created_at": "2026-02-08T12:00:00Z"
# }

# Test without token (should fail)
curl -X GET http://localhost:8080/auth/me

# Expected Response (401):
# {
#   "detail": "Not authenticated"
# }
```

**Automated Test (pytest)**:
```bash
cd backend
pytest tests/test_middleware.py::test_protected_endpoint_with_valid_token -v
pytest tests/test_middleware.py::test_protected_endpoint_without_token -v
```

## Validation Checklist

### Success Criteria Verification

- [ ] **SC-001**: Users can complete account creation in under 2 minutes
  - Test: Time from landing on signup page to account created
  - Expected: < 2 minutes

- [ ] **SC-002**: Users can sign in and access their account in under 30 seconds
  - Test: Time from landing on signin page to dashboard loaded
  - Expected: < 30 seconds

- [ ] **SC-003**: 100% of API requests without valid tokens are rejected
  - Test: `curl http://localhost:8080/auth/me` (no token)
  - Expected: 401 Unauthorized

- [ ] **SC-004**: 100% of attempts to access another user's data are blocked
  - Test: Create two users, try to access User A's data with User B's token
  - Expected: 403 Forbidden

- [ ] **SC-005**: Users remain authenticated for up to 7 days
  - Test: Sign in, wait 6 days, make API request
  - Expected: Request succeeds (token still valid)

- [ ] **SC-006**: System correctly identifies and rejects expired tokens
  - Test: Create token with 1-second expiry, wait 2 seconds, make request
  - Expected: 401 Unauthorized

- [ ] **SC-007**: Zero instances of cross-user data leakage
  - Test: Run full test suite with multiple users
  - Expected: All tests pass, no cross-user data returned

- [ ] **SC-008**: Authentication verification adds less than 50ms latency
  - Test: Measure response time with/without auth middleware
  - Expected: Difference < 50ms

### Security Checklist

- [ ] Shared secret loaded from environment variable (not hardcoded)
- [ ] Passwords hashed with bcrypt before storage
- [ ] JWT tokens signed with HMAC-SHA256
- [ ] Token expiry enforced (7 days)
- [ ] Authorization header required for protected endpoints
- [ ] User ID extracted from verified token (not from client input)
- [ ] 401 returned for missing/invalid tokens
- [ ] 403 returned for cross-user access attempts
- [ ] Generic error messages (no information leakage)
- [ ] Email validation before account creation
- [ ] Password strength validation (min 8 chars, complexity)

### Functional Requirements Verification

Run through all 20 functional requirements (FR-001 to FR-020) from spec.md:

```bash
# Run full test suite
cd backend
pytest tests/ -v --cov=src --cov-report=term-missing

# Expected: All tests pass, >80% coverage
```

## Troubleshooting

### Issue: "Could not validate credentials"

**Cause**: JWT verification failed
**Solutions**:
1. Check that `BETTER_AUTH_SECRET` matches in frontend and backend
2. Verify token is not expired (check `exp` claim)
3. Ensure token format is correct: `Bearer <token>`

### Issue: "Email already registered"

**Cause**: Duplicate email in database
**Solutions**:
1. Use different email for testing
2. Delete test user from database: `DELETE FROM users WHERE email = 'test@example.com'`

### Issue: "Not authenticated"

**Cause**: Missing or invalid Authorization header
**Solutions**:
1. Check that token is stored in localStorage
2. Verify API client includes Authorization header
3. Check browser DevTools → Network → Request Headers

### Issue: Token expires too quickly

**Cause**: Token expiry misconfigured
**Solutions**:
1. Check Better Auth config: `expiresIn: "7d"`
2. Verify JWT payload `exp` claim is 7 days from `iat`

## Next Steps

After completing this quickstart:

1. **Run `/sp.tasks`** to generate implementation tasks
2. **Implement tasks** in priority order (P1 → P2 → P3)
3. **Run validation checklist** after each user story
4. **Document any deviations** from the plan
5. **Create PR** when all user stories complete

## Reference Documentation

- **Spec**: [spec.md](./spec.md) - Feature requirements
- **Plan**: [plan.md](./plan.md) - Implementation architecture
- **Research**: [research.md](./research.md) - Technical decisions
- **Data Model**: [data-model.md](./data-model.md) - Database schema
- **API Contracts**: [contracts/](./contracts/) - Endpoint specifications

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review research.md for technical decisions
3. Consult API contracts for endpoint specifications
4. Verify constitution compliance in plan.md
