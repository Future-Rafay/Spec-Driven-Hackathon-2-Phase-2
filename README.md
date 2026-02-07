# Todo Full-Stack Web Application - Authentication & Identity Layer

Secure, stateless JWT-based authentication system for a multi-user todo application built with Next.js and FastAPI.

## Features

✅ **User Sign Up** - Create accounts with email/password validation
✅ **User Sign In** - Authenticate with credentials
✅ **Protected API Access** - JWT token verification and data isolation
✅ **Stateless Authentication** - No server-side sessions
✅ **Security-by-Design** - bcrypt password hashing, JWT signature verification
✅ **Multi-User Support** - Strict per-user data isolation

## Tech Stack

**Frontend:**
- Next.js 16+ (App Router)
- React 19
- TypeScript
- Tailwind CSS

**Backend:**
- Python 3.11+
- FastAPI
- SQLModel
- PostgreSQL (Neon Serverless)

**Authentication:**
- JWT tokens (7-day expiry)
- bcrypt password hashing
- Shared secret verification

## Quick Start

For detailed setup instructions, see [specs/001-auth-layer/quickstart.md](specs/001-auth-layer/quickstart.md)

### Prerequisites

- Node.js 20+
- Python 3.11+
- PostgreSQL database (Neon recommended)

### 1. Environment Setup

Generate a secure secret (minimum 32 characters):

```bash
openssl rand -base64 32
```

Create `.env` file in project root:

```bash
BETTER_AUTH_SECRET=your-generated-secret-here
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Run database migrations
psql $DATABASE_URL -f migrations/001_create_users_table.sql

# Start backend server
uvicorn src.main:app --reload --port 8080
```

Backend API will be available at http://localhost:8080
API documentation at http://localhost:8080/docs

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env.local
cp .env.local.example .env.local
# Edit .env.local with your values

# Start frontend server
npm run dev
```

Frontend will be available at http://localhost:3000

## Testing the Authentication Flow

### 1. Sign Up
- Navigate to http://localhost:3000/signup
- Enter email and password (min 8 chars, uppercase, lowercase, digit)
- Verify account created and redirected to dashboard

### 2. Sign In
- Navigate to http://localhost:3000/signin
- Enter credentials from signup
- Verify authenticated and redirected to dashboard

### 3. Protected API Access
```bash
# Get token from signin
TOKEN="your-jwt-token-here"

# Test protected endpoint
curl -X GET http://localhost:8080/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Test without token (should return 401)
curl -X GET http://localhost:8080/auth/me
```

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── models/          # SQLModel database models
│   │   ├── auth/            # JWT handling and dependencies
│   │   ├── api/             # FastAPI route handlers
│   │   ├── core/            # Config, security, database
│   │   └── main.py          # FastAPI application
│   ├── migrations/          # Database migration scripts
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # React components
│   │   └── lib/             # Utilities (API client, auth)
│   └── package.json         # Node dependencies
│
└── specs/
    └── 001-auth-layer/      # Feature documentation
        ├── spec.md          # Requirements
        ├── plan.md          # Architecture
        ├── tasks.md         # Implementation tasks
        └── quickstart.md    # Detailed setup guide
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/signin` - Authenticate user
- `GET /auth/me` - Get current user info (requires JWT)

### Protected Resources
- `GET /api/example` - Example protected endpoint (requires JWT)
- `GET /api/profile` - User profile (requires JWT)

## Security Features

- ✅ JWT signature verification on every request
- ✅ bcrypt password hashing (cost factor 12)
- ✅ Shared secret from environment variables only
- ✅ User identity extracted from verified token
- ✅ Data isolation enforced at query level
- ✅ Generic error messages (no information leakage)
- ✅ 401 for unauthorized, 403 for forbidden access

## Success Criteria

- ✅ Users can complete account creation in under 2 minutes
- ✅ Users can sign in in under 30 seconds
- ✅ 100% of API requests without valid tokens are rejected
- ✅ 100% of cross-user access attempts are blocked
- ✅ Users remain authenticated for 7 days
- ✅ Authentication adds <50ms latency per request

## Development Workflow

This project follows **Spec-Driven Development**:

1. **Specification** → Define requirements (spec.md)
2. **Planning** → Design architecture (plan.md)
3. **Tasks** → Break down implementation (tasks.md)
4. **Implementation** → Execute tasks via Claude Code

All artifacts are in `specs/001-auth-layer/`

## Troubleshooting

### "Could not validate credentials"
- Check that `BETTER_AUTH_SECRET` matches in frontend and backend
- Verify token is not expired
- Ensure token format is `Bearer <token>`

### "Email already registered"
- Use different email or delete test user from database

### Token expires too quickly
- Check Better Auth config: `expiresIn: "7d"`
- Verify JWT payload `exp` claim

See [quickstart.md](specs/001-auth-layer/quickstart.md) for more troubleshooting.

## Next Steps

After authentication is working:
1. Implement todo CRUD operations
2. Add task ownership enforcement
3. Build todo UI components
4. Deploy to production

## License

This project was built using Claude Code and Spec-Kit Plus following strict spec-driven development principles.
