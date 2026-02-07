# Implementation Plan: Authentication & Identity Layer

**Branch**: `001-auth-layer` | **Date**: 2026-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-auth-layer/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement secure, stateless JWT-based authentication between Next.js frontend and FastAPI backend using Better Auth. Enable multi-user support with strict data isolation by verifying user identity on every API request. Users can sign up, sign in, and access protected resources with automatic token-based authentication. Backend middleware extracts and validates user identity from JWT tokens, ensuring no cross-user data access.

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript/Node.js 20+ (frontend)
**Primary Dependencies**: FastAPI, Better Auth, SQLModel, Next.js 16+, PyJWT, python-jose
**Storage**: Neon Serverless PostgreSQL
**Testing**: pytest (backend), Jest + React Testing Library (frontend)
**Target Platform**: Web (browser clients + server deployment)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: <50ms authentication verification latency per request
**Constraints**: Stateless authentication (no server sessions), 7-day token expiry, shared secret from environment only
**Scale/Scope**: Multi-user application with strict per-user data isolation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Spec-Driven Development First
- ✅ Feature specification exists and is complete (spec.md)
- ✅ All user stories prioritized and independently testable
- ✅ Planning phase follows specification phase
- ✅ Implementation will follow plan → tasks → code workflow

### II. Security-by-Design
- ✅ JWT-based stateless authentication specified
- ✅ Backend JWT verification using shared secret required
- ✅ User identity extraction from token (never from client input)
- ✅ Data isolation enforced at query level
- ✅ 401 for unauthorized, 403 for forbidden access
- ✅ No hardcoded secrets (environment variables only)

### III. Deterministic & Reproducible
- ✅ Shared secret from environment variable (BETTER_AUTH_SECRET)
- ✅ Token structure and expiry explicitly defined (7 days)
- ✅ Standard JWT format ensures reproducibility
- ✅ All configuration externalized

### IV. Separation of Concerns
- ✅ Clear frontend/backend boundary via REST API
- ✅ Frontend handles auth UI and token storage
- ✅ Backend handles token verification and user extraction
- ✅ Database schema will be explicitly defined
- ✅ Authentication layer separate from business logic

### V. Zero Manual Coding
- ✅ Implementation via Claude Code and Spec-Kit Plus
- ✅ Auth-specialized agents/skills will be used
- ✅ Better Auth agents preferred for configuration
- ✅ All code traceable to spec and plan

### VI. Production-Oriented Architecture
- ✅ Persistent storage (Neon PostgreSQL)
- ✅ Token expiry enforced (7 days)
- ✅ Comprehensive error handling (401, 403)
- ✅ Multi-user design from start
- ✅ Middleware-based verification for reusability

**Status**: ✅ ALL GATES PASSED - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-auth-layer/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   ├── auth-api.yaml    # Authentication endpoints (signup, signin)
│   └── protected-api.yaml # Protected endpoint patterns
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   └── user.py           # User account model
│   ├── auth/
│   │   ├── jwt_handler.py    # JWT verification and user extraction
│   │   ├── middleware.py     # Authentication middleware
│   │   └── dependencies.py   # FastAPI dependency injection for auth
│   ├── api/
│   │   ├── auth.py           # Signup/signin endpoints
│   │   └── protected.py      # Example protected endpoints
│   ├── core/
│   │   ├── config.py         # Environment configuration
│   │   └── security.py       # Security utilities
│   └── main.py               # FastAPI application entry
├── tests/
│   ├── test_auth.py          # Authentication flow tests
│   ├── test_jwt.py           # JWT verification tests
│   └── test_middleware.py    # Middleware tests
├── .env.example              # Environment variable template
└── requirements.txt          # Python dependencies

frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── signup/
│   │   │   │   └── page.tsx  # Sign-up page
│   │   │   └── signin/
│   │   │       └── page.tsx  # Sign-in page
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   └── auth/
│   │       ├── SignupForm.tsx
│   │       └── SigninForm.tsx
│   ├── lib/
│   │   ├── auth.ts           # Better Auth configuration
│   │   └── api-client.ts     # API client with token injection
│   └── middleware.ts         # Next.js middleware for auth
├── .env.local.example        # Environment variable template
└── package.json              # Node dependencies

.env                          # Shared secrets (gitignored)
```

**Structure Decision**: Web application structure selected. Frontend (Next.js) and backend (FastAPI) are separate projects with clear API boundaries. Authentication logic is centralized in dedicated modules (`backend/src/auth/`, `frontend/src/lib/auth.ts`). Shared secret (`BETTER_AUTH_SECRET`) is stored in root `.env` file and loaded by both frontend and backend.

## Phase 0: Research & Technical Decisions

**Status**: ✅ COMPLETE

**Output**: [research.md](./research.md)

### Key Decisions Documented

1. **Better Auth Configuration**: JWT session strategy with 7-day expiry
2. **JWT Token Structure**: Standard claims (sub, exp, iat) + custom user_id claim
3. **Backend Verification Strategy**: FastAPI dependency injection with `get_current_user`
4. **Password Hashing**: bcrypt via passlib with cost factor 12
5. **Token Storage**: httpOnly cookies + localStorage for API calls
6. **Shared Secret Management**: Root `.env` file, environment variables only
7. **Error Response Format**: Consistent JSON with `detail` field
8. **Token Expiry Handling**: Detect 401, clear token, redirect to signin

### Technology Stack Validated

**Frontend**:
- better-auth ^1.0.0
- next ^16.0.0
- react ^19.0.0
- typescript ^5.0.0

**Backend**:
- fastapi ^0.115.0
- sqlmodel ^0.0.22
- python-jose[cryptography] ^3.3.0
- passlib[bcrypt] ^1.7.4
- psycopg2-binary ^2.9.9

**Database**:
- Neon Serverless PostgreSQL

### Security Considerations

- Password security: bcrypt hashing with adaptive cost
- Token security: HMAC-SHA256 signature, 7-day expiry
- Secret management: Environment variables only
- Input validation: Email format, password strength
- Error messages: Generic to prevent information leakage

### Performance Considerations

- JWT verification: <10ms (cryptographic operation)
- Database user lookup: <50ms (indexed email query)
- Total auth overhead: <50ms (meets SC-008 requirement)

---

## Phase 1: Design & Contracts

**Status**: ✅ COMPLETE

**Outputs**:
- [data-model.md](./data-model.md)
- [contracts/auth-api.yaml](./contracts/auth-api.yaml)
- [contracts/protected-api.yaml](./contracts/protected-api.yaml)
- [quickstart.md](./quickstart.md)

### Data Model

**Entity**: User
- **Fields**: id (UUID), email (VARCHAR), hashed_password (VARCHAR), created_at, updated_at
- **Indexes**: Primary key on id, unique index on email
- **Validation**: Email format, password strength, uniqueness checks
- **Security**: bcrypt hashing, no plain passwords

**Migration Strategy**: SQL migration scripts for create/rollback

### API Contracts

**Authentication Endpoints**:
- `POST /auth/signup` - Create new user account (201 Created)
- `POST /auth/signin` - Authenticate user (200 OK)
- `GET /auth/me` - Get current user info (200 OK, requires JWT)

**Protected Endpoint Pattern**:
- All protected endpoints require `Authorization: Bearer <token>` header
- Backend extracts user_id from verified token
- Queries filtered by authenticated user_id
- 401 for missing/invalid token, 403 for cross-user access

### Quickstart Guide

Comprehensive developer guide covering:
- Environment setup (shared secret generation)
- Backend setup (dependencies, migrations, server start)
- Frontend setup (dependencies, server start)
- Testing flows (signup, signin, protected access)
- Validation checklist (success criteria, security, functional requirements)
- Troubleshooting common issues

---

## Architectural Decisions

### 1. JWT vs Session-Based Authentication

**Decision**: JWT-based stateless authentication

**Rationale**:
- Constitutional requirement: stateless authentication
- No server-side session storage needed
- Scales horizontally without session synchronization
- Frontend and backend can be deployed independently
- Token contains all necessary user information

**Trade-offs**:
- Cannot revoke tokens before expiry (acceptable for 7-day expiry)
- Token size larger than session ID (acceptable for HTTP headers)
- No built-in refresh mechanism (out of scope per spec)

### 2. Middleware vs Dependency Injection

**Decision**: FastAPI dependency injection with `get_current_user`

**Rationale**:
- Idiomatic FastAPI pattern
- Selective protection (not all routes need auth)
- Easier to test in isolation
- Clear dependency declaration in route signatures
- Reusable across all protected endpoints

**Trade-offs**:
- Must explicitly add `Depends(get_current_user)` to each protected route
- Middleware would be automatic but less flexible

### 3. Trust Boundary: Token Claims vs URL Parameters

**Decision**: Always trust token claims, never URL parameters for user identity

**Rationale**:
- Constitutional requirement: backend must extract user identity from JWT
- Prevents privilege escalation attacks
- Token is cryptographically signed and verified
- URL parameters can be manipulated by client

**Implementation**:
- User ID extracted from verified JWT token payload
- User ID from URL/body is ignored for authorization
- All queries filtered by authenticated user_id from token

### 4. Token Expiry Duration

**Decision**: 7-day token expiry

**Rationale**:
- Balances security (limited exposure window) and UX (infrequent re-auth)
- Aligns with spec requirement
- Industry standard for web applications
- No refresh mechanism needed for this scope

**Trade-offs**:
- Longer expiry increases risk if token compromised
- Shorter expiry would require refresh mechanism (out of scope)

---

## Implementation Patterns

### Backend: Protected Endpoint Pattern

```python
from fastapi import APIRouter, Depends
from src.auth.dependencies import get_current_user

router = APIRouter()

@router.get("/api/tasks")
async def get_tasks(
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # user_id is extracted from verified JWT token
    # Query MUST filter by user_id
    tasks = db.query(Task).filter(Task.user_id == user_id).all()
    return {"tasks": tasks}
```

### Frontend: API Call Pattern

```typescript
// frontend/src/lib/api-client.ts
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("auth_token")

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (response.status === 401) {
    localStorage.removeItem("auth_token")
    window.location.href = "/signin"
    throw new Error("Authentication expired")
  }

  return response
}
```

### Database Query Pattern

```python
# CORRECT: Filter by authenticated user_id from token
tasks = db.query(Task).filter(Task.user_id == user_id).all()

# INCORRECT: Trust user_id from request body (NEVER DO THIS)
# user_id = request.body.get("user_id")  # ❌ Security vulnerability
```

---

## Validation & Testing Strategy

### Unit Tests
- JWT encoding/decoding functions
- Password hashing/verification functions
- Token expiry validation logic
- Email validation functions

### Integration Tests
- Signup flow: email validation → password hashing → user creation → token issuance
- Signin flow: credential verification → token issuance
- Protected endpoint: token verification → user extraction → data filtering

### Contract Tests
- API endpoint request/response formats match OpenAPI specs
- Error response structures consistent
- Token payload structure correct

### Security Tests
- Requests without token → 401
- Invalid token → 401
- Expired token → 401
- Cross-user access attempt → 403
- Password strength validation
- Email uniqueness enforcement

---

## Success Criteria Mapping

| Criterion | Validation Method | Target |
|-----------|------------------|--------|
| SC-001: Account creation < 2 min | Manual timing test | < 2 minutes |
| SC-002: Sign-in < 30 sec | Manual timing test | < 30 seconds |
| SC-003: 100% rejection without token | Automated test suite | 100% pass rate |
| SC-004: 100% block cross-user access | Automated test suite | 100% pass rate |
| SC-005: 7-day authentication | Token expiry test | Valid for 7 days |
| SC-006: Reject expired tokens | Token expiry test | Rejected within 1s |
| SC-007: Zero data leakage | Full test suite | 0 failures |
| SC-008: Auth latency < 50ms | Performance benchmark | < 50ms overhead |

---

## Risk Analysis

### High Priority Risks

1. **Shared Secret Mismatch**
   - **Risk**: Frontend and backend use different secrets, tokens fail verification
   - **Mitigation**: Single `.env` file at root, both projects load from same source
   - **Detection**: Integration tests will fail immediately

2. **Token Expiry Confusion**
   - **Risk**: Token expires but frontend doesn't handle gracefully
   - **Mitigation**: 401 detection with automatic redirect to signin
   - **Detection**: Manual testing of expired token scenario

3. **Cross-User Data Leakage**
   - **Risk**: Query doesn't filter by user_id, returns other users' data
   - **Mitigation**: Mandatory `Depends(get_current_user)` pattern, code review
   - **Detection**: Automated tests with multiple users

### Medium Priority Risks

4. **Password Strength Bypass**
   - **Risk**: Weak passwords accepted due to validation bug
   - **Mitigation**: Server-side validation, unit tests for edge cases
   - **Detection**: Automated validation tests

5. **Email Enumeration**
   - **Risk**: Error messages reveal which emails are registered
   - **Mitigation**: Generic error messages ("Invalid credentials")
   - **Detection**: Manual security review

---

## Next Steps

### Immediate (After Plan Approval)

1. **Run `/sp.tasks`** to generate implementation tasks from this plan
2. **Review tasks** for completeness and dependency order
3. **Set up development environment** per quickstart.md

### Implementation Phase

1. **Phase 1: Setup** (T001-T003)
   - Create project structure
   - Initialize dependencies
   - Configure environment variables

2. **Phase 2: Foundational** (T004-T009)
   - Setup database schema and migrations
   - Implement JWT verification utilities
   - Create authentication middleware/dependencies

3. **Phase 3: User Story 1 - Sign Up** (T010-T017)
   - Implement user model
   - Create signup endpoint
   - Add validation and error handling

4. **Phase 4: User Story 2 - Sign In** (T018-T023)
   - Implement signin endpoint
   - Add credential verification
   - Issue JWT tokens

5. **Phase 5: User Story 3 - Protected Access** (T024-T028)
   - Implement protected endpoint pattern
   - Add token verification to all protected routes
   - Enforce data isolation

### Validation Phase

1. Run full test suite (unit + integration + contract)
2. Execute validation checklist from quickstart.md
3. Verify all success criteria (SC-001 to SC-008)
4. Security review (no hardcoded secrets, proper error handling)
5. Performance benchmark (auth latency < 50ms)

### Deployment Preparation

1. Document environment variable setup for production
2. Create database migration scripts
3. Configure HTTPS for production (transport security)
4. Set up monitoring for authentication failures

---

## Constitutional Compliance Re-Check

**Post-Design Validation**: ✅ ALL PRINCIPLES MAINTAINED

### I. Spec-Driven Development First
- ✅ All design decisions traceable to spec requirements
- ✅ No implementation without specification
- ✅ Plan documents all architectural choices

### II. Security-by-Design
- ✅ JWT verification on every protected endpoint
- ✅ User identity from token only (never client input)
- ✅ Data isolation enforced at query level
- ✅ Proper HTTP status codes (401, 403)
- ✅ No hardcoded secrets

### III. Deterministic & Reproducible
- ✅ All configuration externalized
- ✅ Standard JWT format
- ✅ Explicit token structure documented
- ✅ Reproducible setup via quickstart.md

### IV. Separation of Concerns
- ✅ Clear frontend/backend boundaries
- ✅ REST API communication only
- ✅ Database schema explicitly defined
- ✅ Authentication layer isolated

### V. Zero Manual Coding
- ✅ Implementation via Claude Code
- ✅ Auth-specialized agents to be used
- ✅ All code traceable to plan

### VI. Production-Oriented Architecture
- ✅ Persistent storage (Neon PostgreSQL)
- ✅ Token expiry enforced
- ✅ Comprehensive error handling
- ✅ Multi-user from start
- ✅ Reusable patterns (dependency injection)

**Final Status**: ✅ READY FOR TASK GENERATION

---

## Appendix: File Locations

- **Specification**: `specs/001-auth-layer/spec.md`
- **Research**: `specs/001-auth-layer/research.md`
- **Data Model**: `specs/001-auth-layer/data-model.md`
- **API Contracts**: `specs/001-auth-layer/contracts/`
- **Quickstart**: `specs/001-auth-layer/quickstart.md`
- **This Plan**: `specs/001-auth-layer/plan.md`
- **Tasks** (next): `specs/001-auth-layer/tasks.md` (generated by `/sp.tasks`)

---

**Plan Complete**: 2026-02-08
**Ready for**: `/sp.tasks` command to generate implementation tasks
