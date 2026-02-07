---
id: 001
title: Initialize Todo App Constitution
stage: constitution
date: 2026-02-08
surface: agent
model: claude-sonnet-4-5
feature: none
branch: master
user: Abdul Rafay
command: /sp.constitution
labels: ["constitution", "initialization", "governance", "principles"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A (documentation only)
---

## Prompt

/sp.constitution

Project: Todo Full-Stack Web Application (Spec-Driven, Agentic Dev Stack)

Objective:
Transform an existing console-based todo application into a modern, multi-user, full-stack web application using Claude Code and Spec-Kit Plus, with persistent storage, secure authentication, and strict spec-driven development. No manual coding is permitted; all implementation must be generated through structured prompts and plans.

Core principles:
- Spec-driven development first (spec → plan → tasks → implementation)
- Security-by-design (authentication, authorization, data isolation)
- Deterministic, reproducible outputs from prompts
- Clear separation of concerns (frontend, backend, auth, data)
- Zero manual coding (all code generated via Claude Code)
- Production-oriented architecture (even at basic feature level)

Key standards:
- All features must map directly to written specs
- Every API endpoint must be explicitly defined before implementation
- Authentication must be enforced on all backend routes
- User data isolation is mandatory at query level
- JWT-based auth verification must be stateless and deterministic
- Frontend and backend must communicate only via documented REST APIs
- Environment variables must be used for all secrets and configuration
- Generated code must be readable, consistent, and framework-idiomatic

Technology constraints:
- Frontend: Next.js 16+ using App Router
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth (JWT-based)
- Spec tooling: Claude Code + Spec-Kit Plus only

API constraints:
- RESTful design only (no GraphQL, no RPC)
- All endpoints must require a valid JWT after authentication is enabled
- JWT must be passed via `Authorization: Bearer <token>` header
- Backend must verify JWT signature using shared secret
- Backend must extract user identity from JWT, not from client trust
- All task operations must be filtered by authenticated user ID
- Unauthorized requests must return HTTP 401
- Forbidden cross-user access must return HTTP 403

Security constraints:
- Shared JWT secret must be provided via environment variable (BETTER_AUTH_SECRET)
- No hardcoded secrets in frontend or backend
- Token expiry must be enforced (e.g., 7 days)
- Backend must not rely on frontend sessions or cookies
- Task ownership must be enforced on every read/write/delete operation

Data constraints:
- Persistent storage required (no in-memory storage)
- Each task must be associated with a user identifier
- Database schema must be explicitly defined in specs
- Migrations or schema initialization must be reproducible
- No cross-user data leakage under any circumstances

Development process constraints:
- Follow Agentic Dev Stack workflow strictly:
  1. Write spec
  2. Generate plan
  3. Break into tasks
  4. Implement via Claude Code
- No step may be skipped
- Each phase must be reviewable independently
- Prompts, plans, and iterations are part of evaluation

Success criteria:
- All 5 basic todo features implemented as a web application
- Multi-user support with strict data isolation
- Fully functional authentication (signup/signin)
- Secure REST API with JWT verification
- Responsive frontend UI connected to backend APIs
- Neon PostgreSQL used as the single source of truth
- No manual code written outside Claude Code
- Project can be rebuilt end-to-end from specs and prompts alone

## Response snapshot

Created comprehensive constitution v1.0.0 for Todo Full-Stack Web Application with 6 core principles:

1. **Spec-Driven Development First**: Strict workflow enforcement (spec → plan → tasks → implementation)
2. **Security-by-Design**: JWT authentication, user data isolation, authorization enforcement
3. **Deterministic & Reproducible**: Environment-based configuration, reproducible builds
4. **Separation of Concerns**: Clear layer boundaries, REST API communication only
5. **Zero Manual Coding**: All code generated via Claude Code and Spec-Kit Plus
6. **Production-Oriented Architecture**: Production-grade patterns from the start

Additional sections defined:
- **Technology Stack**: Mandatory tech choices (Next.js 16+, FastAPI, SQLModel, Neon PostgreSQL, Better Auth)
- **API Standards**: RESTful design, JWT authentication, error handling
- **Security Standards**: Secrets management, token management, data isolation
- **Data Standards**: Persistence requirements, data integrity
- **Development Workflow**: Agentic Dev Stack workflow, quality gates
- **Governance**: Amendment process, compliance requirements, runtime guidance

Constitution includes Sync Impact Report and is ready for use. All placeholders filled with concrete values. Version 1.0.0 ratified 2026-02-08.

## Outcome

- ✅ Impact: Established foundational governance document defining all development principles, standards, and workflows for the Todo Full-Stack Web Application project
- 🧪 Tests: N/A (documentation artifact)
- 📁 Files: Created/updated .specify/memory/constitution.md (177 lines)
- 🔁 Next prompts: /sp.specify to create feature specifications following constitutional principles
- 🧠 Reflection: Constitution successfully captures all security, architectural, and process requirements. Ready to guide spec-driven development workflow.

## Evaluation notes (flywheel)

- Failure modes observed: None - constitution created successfully on first attempt
- Graders run and results (PASS/FAIL): Manual validation - PASS (all placeholders filled, principles clearly defined, governance established)
- Prompt variant (if applicable): Standard /sp.constitution with comprehensive project requirements
- Next experiment (smallest change to try): Validate constitution compliance during first feature specification creation
