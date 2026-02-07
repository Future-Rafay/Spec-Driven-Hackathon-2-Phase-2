<!--
Sync Impact Report:
- Version change: [TEMPLATE] → 1.0.0
- Modified principles: N/A (initial constitution)
- Added sections: All core principles, Technology Stack, API Standards, Security Standards, Data Standards, Development Workflow
- Removed sections: None
- Templates requiring updates:
  ✅ .specify/templates/plan-template.md (to be verified)
  ✅ .specify/templates/spec-template.md (to be verified)
  ✅ .specify/templates/tasks-template.md (to be verified)
  ✅ .specify/templates/commands/*.md (to be verified)
- Follow-up TODOs: None
-->

# Todo Full-Stack Web Application Constitution

## Core Principles

### I. Spec-Driven Development First

All features MUST follow the strict workflow: spec → plan → tasks → implementation. No implementation may begin without a written specification. Every feature must map directly to its specification document. No step in the workflow may be skipped. Each phase must be independently reviewable. Prompts, plans, and iterations are considered part of the deliverable and evaluation criteria.

**Rationale**: Ensures reproducibility, traceability, and alignment between requirements and implementation. Enables deterministic outputs from AI-assisted development.

### II. Security-by-Design

Authentication MUST be enforced on all backend routes after auth is enabled. User data isolation is MANDATORY at the query level. JWT-based authentication MUST be stateless and deterministic. Backend MUST verify JWT signatures using a shared secret. Backend MUST extract user identity from JWT, never from client-provided data. Task ownership MUST be enforced on every read/write/delete operation. Unauthorized requests MUST return HTTP 401. Forbidden cross-user access MUST return HTTP 403.

**Rationale**: Prevents security vulnerabilities from being introduced during rapid development. Multi-user systems require strict data isolation to prevent data leakage.

### III. Deterministic & Reproducible

All code generation MUST produce consistent, reproducible outputs from structured prompts. Environment variables MUST be used for all secrets and configuration. No hardcoded secrets in frontend or backend. Generated code MUST be readable, consistent, and framework-idiomatic. The entire project MUST be rebuildable end-to-end from specs and prompts alone.

**Rationale**: Enables reliable AI-assisted development, facilitates debugging, and ensures project maintainability.

### IV. Separation of Concerns

Clear boundaries MUST exist between frontend, backend, authentication, and data layers. Frontend and backend MUST communicate only via documented REST APIs. Database schema MUST be explicitly defined in specifications. Migrations or schema initialization MUST be reproducible.

**Rationale**: Reduces coupling, improves testability, and enables independent evolution of system components.

### V. Zero Manual Coding

No manual coding is permitted outside Claude Code and Spec-Kit Plus. All implementation MUST be generated through structured prompts and plans. All code changes MUST be traceable to a specification and plan.

**Rationale**: Ensures consistency with the spec-driven approach and validates the effectiveness of AI-assisted development workflows.

### VI. Production-Oriented Architecture

Even basic features MUST follow production-grade architectural patterns. Persistent storage is REQUIRED (no in-memory storage). Token expiry MUST be enforced. Error handling MUST be comprehensive. All operations MUST be designed for multi-user scenarios from the start.

**Rationale**: Prevents technical debt and costly refactoring. Building production-ready from the start is more efficient than retrofitting quality later.

## Technology Stack

The following technology choices are MANDATORY and MUST NOT be substituted:

- **Frontend**: Next.js 16+ using App Router
- **Backend**: Python FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth (JWT-based)
- **Spec Tooling**: Claude Code + Spec-Kit Plus only

**Rationale**: These technologies are selected for their compatibility with AI-assisted development, strong typing, and modern architectural patterns.

## API Standards

### RESTful Design

- RESTful design ONLY (no GraphQL, no RPC)
- Every API endpoint MUST be explicitly defined before implementation
- All endpoints MUST require a valid JWT after authentication is enabled
- JWT MUST be passed via `Authorization: Bearer <token>` header

### Authentication & Authorization

- Backend MUST verify JWT signature using shared secret from environment variable
- Backend MUST extract user identity from JWT payload
- Backend MUST NOT rely on frontend sessions or cookies
- All task operations MUST be filtered by authenticated user ID

### Error Handling

- Unauthorized requests MUST return HTTP 401
- Forbidden cross-user access MUST return HTTP 403
- All error responses MUST follow consistent format

**Rationale**: Standardized API design ensures predictable behavior, simplifies client implementation, and enables secure multi-user operations.

## Security Standards

### Secrets Management

- Shared JWT secret MUST be provided via environment variable (`BETTER_AUTH_SECRET`)
- No hardcoded secrets in frontend or backend code
- All configuration MUST use environment variables

### Token Management

- Token expiry MUST be enforced (e.g., 7 days)
- JWT signatures MUST be verified on every protected endpoint
- Backend MUST NOT trust client-provided user identifiers

### Data Isolation

- Each task MUST be associated with a user identifier
- Task ownership MUST be enforced on every operation
- No cross-user data leakage under any circumstances
- All queries MUST filter by authenticated user ID

**Rationale**: Security cannot be added later. These standards prevent common vulnerabilities (broken authentication, insecure direct object references, privilege escalation).

## Data Standards

### Persistence Requirements

- Persistent storage REQUIRED (no in-memory storage)
- Database schema MUST be explicitly defined in specs
- Migrations MUST be reproducible and version-controlled

### Data Integrity

- Each task MUST be associated with a user identifier
- Foreign key relationships MUST be enforced at database level
- Data validation MUST occur at both API and database layers

**Rationale**: Data integrity and persistence are non-negotiable for production applications. Explicit schema definitions enable reproducible deployments.

## Development Workflow

### Agentic Dev Stack Workflow

The following workflow MUST be followed strictly:

1. **Write Spec**: Document feature requirements, acceptance criteria, and constraints
2. **Generate Plan**: Create architectural plan with decisions, interfaces, and NFRs
3. **Break into Tasks**: Decompose plan into testable, atomic tasks
4. **Implement via Claude Code**: Execute tasks using AI-assisted development

No step may be skipped. Each phase must be reviewable independently.

### Quality Gates

- All features MUST have written specifications before implementation
- All API endpoints MUST be documented before coding
- All security requirements MUST be verified before deployment
- All generated code MUST be reviewed for framework idioms and readability

**Rationale**: Structured workflow ensures quality, traceability, and successful AI-assisted development outcomes.

## Governance

This constitution supersedes all other development practices and guidelines. All specifications, plans, tasks, and implementations MUST comply with these principles.

### Amendment Process

- Amendments require documented rationale and impact analysis
- Version number MUST be incremented according to semantic versioning:
  - **MAJOR**: Backward incompatible governance/principle removals or redefinitions
  - **MINOR**: New principle/section added or materially expanded guidance
  - **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements
- All dependent templates MUST be updated to reflect amendments
- Sync Impact Report MUST be generated for all amendments

### Compliance

- All PRs and code reviews MUST verify compliance with constitutional principles
- Deviations MUST be explicitly justified and documented
- Security principles are NON-NEGOTIABLE and cannot be waived

### Runtime Guidance

For day-to-day development guidance, refer to `CLAUDE.md` and `.specify/templates/commands/` for agent-specific instructions.

**Version**: 1.0.0 | **Ratified**: 2026-02-08 | **Last Amended**: 2026-02-08
