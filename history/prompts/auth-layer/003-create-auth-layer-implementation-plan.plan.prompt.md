---
id: 003
title: Create Auth Layer Implementation Plan
stage: plan
date: 2026-02-08
surface: agent
model: claude-sonnet-4-5
feature: auth-layer
branch: 001-auth-layer
user: Abdul Rafay
command: /sp.plan
labels: ["planning", "architecture", "authentication", "jwt", "design"]
links:
  spec: specs/001-auth-layer/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-auth-layer/plan.md
  - specs/001-auth-layer/research.md
  - specs/001-auth-layer/data-model.md
  - specs/001-auth-layer/contracts/auth-api.yaml
  - specs/001-auth-layer/contracts/protected-api.yaml
  - specs/001-auth-layer/quickstart.md
  - CLAUDE.md (updated)
tests:
  - N/A (planning artifact)
---

## Prompt

Create:
- Authentication architecture sketch (Next.js ↔ FastAPI using JWT)
- End-to-end auth lifecycle definition:
  signup → signin → token issued → API call → backend verification
- Clear boundary between frontend auth handling and backend verification
- Validation checklist mapped to success criteria

Agent & skill execution:
- Use authentication-specialized agents and skills for:
  - Better Auth setup and configuration
  - JWT handling and integration
  - Auth flow implementation
- Prefer existing Auth / Better Auth agents or skills for token logic, middleware setup, and secure configuration

Architecture & flow:

Frontend:
- Configure Better Auth with JWT support enabled
- Ensure token includes user identifier
- Attach JWT to all API requests using Authorization: Bearer <token>

Backend:
- Add middleware to:
  - Extract token from header
  - Verify signature using shared secret
  - Decode payload and extract user identity
  - Inject authenticated user into request context
- Reject invalid or missing tokens early (401)

Decisions needing documentation:
- JWT vs session-based auth tradeoffs
- Middleware-level verification vs per-route verification
- Trust boundary: token claims vs URL parameters
- Token expiry duration vs user experience

Testing & validation:
- Signup and signin flows work end-to-end
- JWT is issued correctly with expected payload
- Requests without token → 401
- Invalid token → 401
- Valid token → authenticated user resolved
- URL user_id mismatch with token identity → rejected
- No cross-user data access possible

Quality checks:
- No hardcoded secrets
- Shared secret loaded from environment variable
- Auth enforced before business logic runs
- Auth design is reusable for all protected endpoints

Execution order:
- Configure Better Auth
- Define token structure + expiry
- Implement JWT verification middleware
- Connect identity extraction to request lifecycle

## Response snapshot

Created comprehensive implementation plan for Authentication & Identity Layer with complete Phase 0 (Research) and Phase 1 (Design & Contracts).

**Phase 0: Research & Technical Decisions** (research.md):
- 8 key technical decisions documented with rationale and alternatives
- Better Auth JWT configuration pattern
- JWT token structure (standard + custom claims)
- FastAPI dependency injection strategy
- Password hashing (bcrypt), token storage, secret management
- Error response format, token expiry handling
- Technology stack validated (frontend + backend dependencies)
- Security and performance considerations documented

**Phase 1: Design & Contracts** (data-model.md, contracts/, quickstart.md):
- Data model: User entity with UUID, email, hashed_password
- Database schema with indexes and migrations
- API contracts: auth-api.yaml (signup, signin, /me endpoints)
- Protected API pattern: protected-api.yaml (reusable pattern for all protected endpoints)
- Quickstart guide: environment setup, testing flows, validation checklist

**Architectural Decisions**:
1. JWT vs session-based: JWT chosen for stateless requirement
2. Middleware vs dependency injection: Dependency injection for flexibility
3. Trust boundary: Always trust token claims, never URL parameters
4. Token expiry: 7-day duration balances security and UX

**Implementation Patterns**:
- Backend: FastAPI dependency injection with `get_current_user`
- Frontend: API client with automatic token injection
- Database: Query filtering by authenticated user_id

**Project Structure**: Web application (frontend + backend) with clear separation, centralized auth modules

**Constitutional Compliance**: All 6 principles validated post-design

**Agent Context**: Updated CLAUDE.md with technology stack

## Outcome

- ✅ Impact: Complete implementation plan with research, data model, API contracts, and quickstart guide. All architectural decisions documented with rationale. Ready for task generation.
- 🧪 Tests: N/A (planning artifact)
- 📁 Files: plan.md, research.md, data-model.md, contracts/auth-api.yaml, contracts/protected-api.yaml, quickstart.md, CLAUDE.md (updated)
- 🔁 Next prompts: /sp.tasks to generate implementation tasks from this plan
- 🧠 Reflection: Plan successfully captures all authentication requirements with production-grade patterns. 8 technical decisions documented, 4 architectural decisions with tradeoffs, complete API contracts, and developer quickstart guide. Constitutional compliance verified post-design.

## Evaluation notes (flywheel)

- Failure modes observed: None - plan created successfully with all phases complete
- Graders run and results (PASS/FAIL): Constitutional compliance check - PASS (all 6 principles maintained post-design)
- Prompt variant (if applicable): Standard /sp.plan with detailed authentication architecture requirements
- Next experiment (smallest change to try): Generate tasks with /sp.tasks and validate task breakdown matches plan structure
