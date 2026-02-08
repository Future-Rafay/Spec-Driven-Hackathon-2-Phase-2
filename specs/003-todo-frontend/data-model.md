# Data Model: Todo Frontend Application

**Feature**: 003-todo-frontend
**Date**: 2026-02-08
**Purpose**: Define frontend entities, state structure, and data flow

## Overview

This document defines the data structures used in the frontend application, including entities from the backend API, frontend-specific state, and data transformations.

## 1. Backend Entities (from API)

### User

**Source**: Backend API `/auth/signup`, `/auth/signin`, `/auth/me`

**Structure**:
```typescript
interface User {
  id: string              // UUID format
  email: string           // User's email address
  created_at: string      // ISO 8601 datetime
  updated_at: string      // ISO 8601 datetime
}
```

**Usage**:
- Stored in Better Auth session after authentication
- Displayed in header/user menu
- Used for identifying current user

**Validation**:
- `id`: Valid UUID format
- `email`: Valid email format
- `created_at`, `updated_at`: Valid ISO 8601 datetime strings

### Task

**Source**: Backend API `/api/tasks/*`

**Structure**:
```typescript
interface Task {
  id: string                    // UUID format
  user_id: string               // UUID format (owner)
  title: string                 // 1-500 characters
  description: string | null    // 0-2000 characters or null
  completed: boolean            // Completion status
  completed_at: string | null   // ISO 8601 datetime or null
  created_at: string            // ISO 8601 datetime
  updated_at: string            // ISO 8601 datetime
}
```

**Usage**:
- Displayed in task list
- Edited in task forms
- Cached by React Query

**Validation**:
- `id`, `user_id`: Valid UUID format
- `title`: Non-empty, max 500 characters
- `description`: Max 2000 characters or null
- `completed`: Boolean
- `completed_at`: Valid ISO 8601 datetime or null
- `created_at`, `updated_at`: Valid ISO 8601 datetime strings

**State Transitions**:
```
[New Task]
  ↓ (create)
[Incomplete Task] ←→ (toggle) ←→ [Complete Task]
  ↓ (update)              ↓ (update)
[Incomplete Task]       [Complete Task]
  ↓ (delete)              ↓ (delete)
[Deleted]               [Deleted]
```

## 2. Request/Response Schemas

### TaskCreate

**Purpose**: Create new task

**Structure**:
```typescript
interface TaskCreate {
  title: string           // Required, 1-500 characters
  description?: string    // Optional, max 2000 characters
}
```

**Validation**:
- `title`: Required, non-empty after trim, max 500 characters
- `description`: Optional, max 2000 characters

**Example**:
```typescript
const newTask: TaskCreate = {
  title: "Buy groceries",
  description: "Milk, eggs, bread"
}
```

### TaskUpdate

**Purpose**: Update existing task

**Structure**:
```typescript
interface TaskUpdate {
  title?: string          // Optional, 1-500 characters
  description?: string    // Optional, max 2000 characters
}
```

**Validation**:
- `title`: If provided, non-empty after trim, max 500 characters
- `description`: If provided, max 2000 characters
- At least one field must be provided

**Example**:
```typescript
const update: TaskUpdate = {
  title: "Buy groceries and cook dinner"
}
```

### AuthCredentials

**Purpose**: User authentication

**Structure**:
```typescript
interface AuthCredentials {
  email: string
  password: string
}
```

**Validation**:
- `email`: Valid email format
- `password`: Min 8 characters, at least one uppercase, one lowercase, one digit

### AuthResponse

**Purpose**: Authentication result

**Structure**:
```typescript
interface AuthResponse {
  user: User
  token: string           // JWT token
}
```

**Usage**:
- Returned from `/auth/signup` and `/auth/signin`
- Token stored in Better Auth session
- User data displayed in UI

## 3. Frontend State

### AuthState

**Purpose**: Authentication session state (managed by Better Auth)

**Structure**:
```typescript
interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  loading: boolean
}
```

**State Transitions**:
```
[Unauthenticated]
  ↓ (signup/signin)
[Authenticated]
  ↓ (signout/token expired)
[Unauthenticated]
```

**Usage**:
- Checked by middleware for route protection
- Displayed in header (user email, logout button)
- Used to determine if API calls should include token

### TaskListState

**Purpose**: Task list state (managed by React Query)

**Structure**:
```typescript
interface TaskListState {
  data: Task[] | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}
```

**State Transitions**:
```
[Initial]
  ↓ (fetch)
[Loading] → [Success] → [Stale] → [Refetching] → [Success]
  ↓           ↓
[Error]     [Error]
```

**Usage**:
- Displayed in TaskList component
- Shows loading skeleton when isLoading
- Shows error message when isError
- Shows empty state when data is empty array

### TaskMutationState

**Purpose**: Task mutation state (create/update/delete/toggle)

**Structure**:
```typescript
interface TaskMutationState {
  isPending: boolean
  isError: boolean
  error: Error | null
  mutate: (variables: any) => void
  mutateAsync: (variables: any) => Promise<any>
}
```

**Usage**:
- Disable buttons while isPending
- Show error messages when isError
- Trigger optimistic updates on mutate

## 4. Form State

### CreateTaskFormState

**Purpose**: Create task form state

**Structure**:
```typescript
interface CreateTaskFormState {
  title: string
  description: string
  errors: {
    title?: string
    description?: string
  }
  isSubmitting: boolean
}
```

**Validation Rules**:
- `title`: Required, max 500 characters
- `description`: Optional, max 2000 characters

**State Flow**:
```
[Empty Form]
  ↓ (user input)
[Filled Form]
  ↓ (submit)
[Submitting] → [Success] → [Reset to Empty]
  ↓
[Error] → [Show Errors]
```

### EditTaskFormState

**Purpose**: Edit task form state

**Structure**:
```typescript
interface EditTaskFormState {
  title: string
  description: string
  errors: {
    title?: string
    description?: string
  }
  isSubmitting: boolean
  originalTask: Task
}
```

**Validation Rules**: Same as CreateTaskFormState

**State Flow**:
```
[Load Original Task]
  ↓ (user edits)
[Modified Form]
  ↓ (submit)
[Submitting] → [Success] → [Close Modal]
  ↓
[Error] → [Show Errors]
```

## 5. UI State

### ModalState

**Purpose**: Modal visibility state

**Structure**:
```typescript
interface ModalState {
  isOpen: boolean
  data?: any              // Modal-specific data (e.g., task to edit)
}
```

**Usage**:
- EditTaskModal: `{ isOpen: boolean, data: Task }`
- DeleteConfirmDialog: `{ isOpen: boolean, data: Task }`

### ToastState

**Purpose**: Toast notification state

**Structure**:
```typescript
interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
  isVisible: boolean
}
```

**Usage**:
- Show success message after task created
- Show error message on API failure
- Auto-dismiss after 3 seconds

## 6. Data Flow

### Authentication Flow

```
User Input (email, password)
  ↓
SigninForm Component
  ↓
Better Auth authorize()
  ↓
FastAPI /auth/signin
  ↓
AuthResponse { user, token }
  ↓
Better Auth Session (stores token)
  ↓
Redirect to /dashboard
```

### Task List Flow

```
Dashboard Page Load
  ↓
useTasks() hook
  ↓
React Query fetch
  ↓
API Client (with JWT token)
  ↓
FastAPI /api/tasks
  ↓
Task[] response
  ↓
React Query cache
  ↓
TaskList Component renders
```

### Task Creation Flow

```
User Input (title, description)
  ↓
CreateTaskForm Component
  ↓
useCreateTask() mutation
  ↓
Optimistic Update (add to cache)
  ↓
API Client POST /api/tasks
  ↓
Task response
  ↓
React Query invalidate
  ↓
Refetch task list
  ↓
UI updates with real task
```

### Task Toggle Flow

```
User Click (checkbox)
  ↓
TaskItem Component
  ↓
useToggleTask() mutation
  ↓
Optimistic Update (toggle in cache)
  ↓
API Client PATCH /api/tasks/{id}/complete
  ↓
Task response
  ↓
React Query invalidate
  ↓
UI confirms update
```

## 7. Error States

### API Error

**Structure**:
```typescript
interface ApiError {
  status: number
  message: string
  detail?: string | ValidationError[]
}
```

**Types**:
- `401`: Authentication error
- `403`: Authorization error
- `404`: Resource not found
- `422`: Validation error
- `500`: Server error
- `Network`: Connection error

### Validation Error

**Structure**:
```typescript
interface ValidationError {
  loc: string[]           // Field location
  msg: string             // Error message
  type: string            // Error type
}
```

**Example**:
```typescript
{
  loc: ["body", "title"],
  msg: "Title cannot be empty or whitespace only",
  type: "value_error"
}
```

## 8. Type Definitions File Structure

```
frontend/src/types/
├── auth.ts              # User, AuthCredentials, AuthResponse, AuthState
├── task.ts              # Task, TaskCreate, TaskUpdate, TaskListState
├── api.ts               # ApiError, ValidationError
└── ui.ts                # ModalState, ToastState
```

## 9. Data Transformations

### Date Formatting

**Input**: ISO 8601 string from backend
**Output**: Human-readable format

```typescript
import { formatDistanceToNow, format } from 'date-fns'

// Relative time: "2 hours ago"
const relativeTime = formatDistanceToNow(new Date(task.created_at), {
  addSuffix: true
})

// Absolute time: "Feb 8, 2026 at 2:30 PM"
const absoluteTime = format(new Date(task.created_at), "MMM d, yyyy 'at' h:mm a")
```

### Task Sorting

**Default**: Sort by `created_at` descending (newest first)

```typescript
const sortedTasks = tasks.sort((a, b) =>
  new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
)
```

### Task Filtering

**By Completion Status**:
```typescript
const incompleteTasks = tasks.filter(task => !task.completed)
const completedTasks = tasks.filter(task => task.completed)
```

## 10. Cache Strategy

### React Query Cache Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 10 * 60 * 1000,         // 10 minutes (garbage collection)
      retry: 3,                        // Retry failed requests 3 times
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})
```

### Cache Invalidation Rules

- **After Create**: Invalidate `["tasks"]`
- **After Update**: Invalidate `["tasks"]` and `["tasks", taskId]`
- **After Delete**: Invalidate `["tasks"]`
- **After Toggle**: Optimistic update + invalidate on settled
- **On 401 Error**: Clear all queries and redirect to signin

## Summary

This data model provides:
- ✅ Clear entity definitions matching backend API
- ✅ Frontend-specific state structures
- ✅ Data flow documentation
- ✅ Error handling patterns
- ✅ Type safety with TypeScript
- ✅ Cache strategy for optimal performance
- ✅ Data transformation utilities

All entities are designed to work seamlessly with React Query for server state management and Better Auth for authentication state.
