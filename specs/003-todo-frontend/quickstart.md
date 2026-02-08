# Quickstart Guide: Todo Frontend Application

**Feature**: 003-todo-frontend
**Date**: 2026-02-08
**Purpose**: Setup instructions and testing guide for developers

## Prerequisites

Before starting, ensure you have:

- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager
- ✅ Backend API running on http://localhost:8080 (or configured port)
- ✅ PostgreSQL database configured and migrations applied
- ✅ Git repository cloned

## Environment Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

**Expected packages**:
- next@16.1.6
- react@19.2.3
- better-auth@^1.0.0
- @tanstack/react-query@^5.0.0
- tailwindcss@^4
- typescript@^5

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080

# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here-must-match-backend
BETTER_AUTH_URL=http://localhost:3000
```

**Important**: The `BETTER_AUTH_SECRET` must match the secret in your backend `.env` file.

### 3. Verify Backend is Running

Check that the backend API is accessible:

```bash
curl http://localhost:8080/auth/me
```

Expected response: `401 Unauthorized` (this is correct - means API is running)

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at: http://localhost:3000

## Testing the Application

### Manual Testing Flow

#### 1. Sign Up New User

1. Navigate to http://localhost:3000
2. Click "Sign Up" (or navigate to http://localhost:3000/signup)
3. Enter email: `test@example.com`
4. Enter password: `SecurePass123!` (must meet requirements)
5. Click "Sign Up"

**Expected Result**:
- ✅ Account created successfully
- ✅ Automatically signed in
- ✅ Redirected to `/dashboard`
- ✅ JWT token stored in Better Auth session

**Troubleshooting**:
- ❌ "Email already exists" → Use different email or sign in instead
- ❌ "Password too weak" → Ensure 8+ chars, uppercase, lowercase, digit
- ❌ "Connection error" → Check backend is running on correct port

#### 2. Sign In Existing User

1. Navigate to http://localhost:3000/signin
2. Enter email: `test@example.com`
3. Enter password: `SecurePass123!`
4. Click "Sign In"

**Expected Result**:
- ✅ Successfully authenticated
- ✅ Redirected to `/dashboard`
- ✅ User email displayed in header

**Troubleshooting**:
- ❌ "Invalid credentials" → Check email/password are correct
- ❌ "Session expired" → Token may have expired (7 days), sign in again

#### 3. Create Task

1. On dashboard, locate "Create Task" form
2. Enter title: `Buy groceries`
3. Enter description: `Milk, eggs, bread` (optional)
4. Click "Create" or press Enter

**Expected Result**:
- ✅ Task appears at top of list (newest first)
- ✅ Task shows title and description
- ✅ Task is marked as incomplete (unchecked)
- ✅ Success message displayed

**Troubleshooting**:
- ❌ "Title required" → Enter a non-empty title
- ❌ "Title too long" → Max 500 characters
- ❌ "Description too long" → Max 2000 characters

#### 4. Toggle Task Completion

1. Locate task in list
2. Click checkbox next to task title

**Expected Result**:
- ✅ Checkbox toggles immediately (optimistic update)
- ✅ Task title shows strikethrough when complete
- ✅ Completion timestamp displayed
- ✅ Change persists after page refresh

**Troubleshooting**:
- ❌ Checkbox reverts → API call failed, check network tab
- ❌ Change doesn't persist → Backend not saving, check backend logs

#### 5. Edit Task

1. Locate task in list
2. Click "Edit" button
3. Modify title or description
4. Click "Save"

**Expected Result**:
- ✅ Modal opens with current task data
- ✅ Changes saved successfully
- ✅ Task list updates immediately
- ✅ Modal closes automatically

**Troubleshooting**:
- ❌ Modal doesn't open → Check console for errors
- ❌ Changes don't save → Check validation errors

#### 6. Delete Task

1. Locate task in list
2. Click "Delete" button
3. Confirm deletion in dialog

**Expected Result**:
- ✅ Confirmation dialog appears
- ✅ Task removed from list after confirmation
- ✅ Task does not reappear after page refresh

**Troubleshooting**:
- ❌ Task reappears → Backend deletion failed, check backend logs

#### 7. Sign Out

1. Click user menu in header
2. Click "Sign Out"

**Expected Result**:
- ✅ Session cleared
- ✅ Redirected to `/signin`
- ✅ Cannot access `/dashboard` without signing in

**Troubleshooting**:
- ❌ Still can access dashboard → Check middleware configuration

### Protected Routes Testing

#### Test Unauthenticated Access

1. Sign out (if signed in)
2. Try to access http://localhost:3000/dashboard directly

**Expected Result**:
- ✅ Automatically redirected to `/signin`
- ✅ Cannot view dashboard content

#### Test Authenticated Redirect

1. Sign in
2. Try to access http://localhost:3000/signin directly

**Expected Result**:
- ✅ Automatically redirected to `/dashboard`
- ✅ Cannot view signin page while authenticated

### Error Handling Testing

#### Test Invalid Credentials

1. Navigate to `/signin`
2. Enter incorrect email or password
3. Click "Sign In"

**Expected Result**:
- ✅ Error message: "Invalid email or password"
- ✅ Form remains on signin page
- ✅ No redirect occurs

#### Test Network Error

1. Stop backend server
2. Try to create a task

**Expected Result**:
- ✅ Error message: "Connection error, please check your internet"
- ✅ Task not added to list
- ✅ Form remains editable

#### Test Token Expiration

1. Sign in
2. Wait 7 days (or manually expire token in backend)
3. Try to perform any action

**Expected Result**:
- ✅ Error message: "Session expired. Please sign in again."
- ✅ Automatically redirected to `/signin`
- ✅ Session cleared

### Responsive Design Testing

#### Mobile Testing (< 640px)

1. Open Chrome DevTools
2. Toggle device toolbar (Cmd+Shift+M / Ctrl+Shift+M)
3. Select iPhone or Android device
4. Test all features

**Expected Result**:
- ✅ Layout adapts to small screen
- ✅ Touch targets are large enough (min 44px)
- ✅ No horizontal scrolling
- ✅ Modals are mobile-friendly
- ✅ Forms are easy to use

#### Desktop Testing (> 1024px)

1. Resize browser to full screen
2. Test all features

**Expected Result**:
- ✅ Layout uses available space efficiently
- ✅ Max-width container prevents excessive width
- ✅ Hover states work on buttons
- ✅ Modals are centered

## Running Tests

### Unit Tests (Vitest)

```bash
npm run test
```

**Expected Output**:
```
✓ src/components/tasks/TaskItem.test.tsx (5)
✓ src/components/tasks/CreateTaskForm.test.tsx (4)
✓ src/hooks/useTasks.test.ts (3)

Test Files  3 passed (3)
Tests  12 passed (12)
```

### E2E Tests (Playwright)

```bash
npm run test:e2e
```

**Expected Output**:
```
Running 8 tests using 4 workers

✓ auth.spec.ts:3:1 › user can sign up (2s)
✓ auth.spec.ts:12:1 › user can sign in (1s)
✓ tasks.spec.ts:3:1 › user can create task (2s)
✓ tasks.spec.ts:15:1 › user can toggle task completion (1s)
✓ tasks.spec.ts:25:1 › user can edit task (2s)
✓ tasks.spec.ts:35:1 › user can delete task (1s)
✓ tasks.spec.ts:45:1 › protected routes redirect (1s)
✓ tasks.spec.ts:55:1 › error handling works (2s)

8 passed (12s)
```

## Common Issues & Solutions

### Issue: "Module not found: Can't resolve 'better-auth'"

**Solution**:
```bash
npm install better-auth
```

### Issue: "CORS error when calling backend"

**Solution**:
1. Check backend CORS configuration includes `http://localhost:3000`
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local` is correct
3. Ensure backend is running on the configured port

### Issue: "JWT token verification failed"

**Solution**:
1. Verify `BETTER_AUTH_SECRET` matches between frontend and backend
2. Check token hasn't expired (7 days)
3. Clear browser storage and sign in again

### Issue: "Tasks not loading"

**Solution**:
1. Check browser console for errors
2. Verify backend `/api/tasks` endpoint is working:
   ```bash
   curl -H "Authorization: Bearer <token>" http://localhost:8080/api/tasks
   ```
3. Check React Query DevTools for query status

### Issue: "Middleware not protecting routes"

**Solution**:
1. Verify `middleware.ts` is in the correct location (`src/middleware.ts`)
2. Check middleware config matcher pattern
3. Restart dev server after middleware changes

## Development Workflow

### 1. Start Backend

```bash
cd backend
uvicorn src.main:app --reload --port 8080
```

### 2. Start Frontend

```bash
cd frontend
npm run dev
```

### 3. Make Changes

- Edit files in `src/`
- Hot reload automatically updates browser
- Check console for errors

### 4. Run Tests

```bash
npm run test        # Unit tests
npm run test:e2e    # E2E tests
```

### 5. Build for Production

```bash
npm run build
npm run start
```

## API Endpoints Reference

### Authentication

- `POST /auth/signup` - Create new user account
- `POST /auth/signin` - Authenticate existing user
- `GET /auth/me` - Get current user info

### Tasks

- `GET /api/tasks` - List all tasks for authenticated user
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/complete` - Toggle task completion

## Browser DevTools Tips

### React Query DevTools

React Query DevTools are automatically enabled in development:

1. Look for floating React Query icon in bottom-right corner
2. Click to open DevTools panel
3. View query status, cached data, and mutations

### Network Tab

Monitor API calls:

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Check request/response for each API call

### Console Tab

Check for errors:

1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Check warnings (yellow)

## Next Steps

After verifying the application works:

1. ✅ All manual tests pass
2. ✅ Unit tests pass
3. ✅ E2E tests pass
4. ✅ Responsive design works on mobile and desktop
5. ⏭️ Ready for code review
6. ⏭️ Ready for deployment

## Support

If you encounter issues not covered in this guide:

1. Check browser console for errors
2. Check backend logs for API errors
3. Review the implementation plan in `specs/003-todo-frontend/plan.md`
4. Review technical research in `specs/003-todo-frontend/research.md`
5. Check data model in `specs/003-todo-frontend/data-model.md`

## Useful Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```
