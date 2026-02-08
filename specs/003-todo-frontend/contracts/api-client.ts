/**
 * API Client Contracts
 *
 * TypeScript interfaces defining the API client structure and all endpoint contracts.
 * This file serves as the contract between frontend and backend API.
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * User entity from backend
 */
export interface User {
  id: string              // UUID format
  email: string           // User's email address
  created_at: string      // ISO 8601 datetime
  updated_at: string      // ISO 8601 datetime
}

/**
 * Task entity from backend
 */
export interface Task {
  id: string                    // UUID format
  user_id: string               // UUID format (owner)
  title: string                 // 1-500 characters
  description: string | null    // 0-2000 characters or null
  completed: boolean            // Completion status
  completed_at: string | null   // ISO 8601 datetime or null
  created_at: string            // ISO 8601 datetime
  updated_at: string            // ISO 8601 datetime
}

/**
 * Request payload for creating a new task
 */
export interface TaskCreate {
  title: string           // Required, 1-500 characters
  description?: string    // Optional, max 2000 characters
}

/**
 * Request payload for updating an existing task
 */
export interface TaskUpdate {
  title?: string          // Optional, 1-500 characters
  description?: string    // Optional, max 2000 characters
}

/**
 * Authentication credentials
 */
export interface AuthCredentials {
  email: string
  password: string
}

/**
 * Authentication response from backend
 */
export interface AuthResponse {
  user: User
  token: string           // JWT token
}

/**
 * API error response
 */
export interface ApiError {
  detail: string | ValidationError[]
}

/**
 * Validation error detail
 */
export interface ValidationError {
  loc: string[]           // Field location (e.g., ["body", "title"])
  msg: string             // Error message
  type: string            // Error type (e.g., "value_error")
}

// ============================================================================
// API Client Interface
// ============================================================================

/**
 * Main API client interface
 *
 * Provides typed methods for all backend API endpoints.
 * All methods return Promises and handle authentication automatically.
 */
export interface ApiClient {
  /**
   * Authentication endpoints
   */
  auth: {
    /**
     * Sign up a new user
     *
     * @param email - User's email address
     * @param password - User's password (min 8 chars, uppercase, lowercase, digit)
     * @returns Promise resolving to user data and JWT token
     * @throws ApiError on validation failure or duplicate email
     */
    signup(email: string, password: string): Promise<AuthResponse>

    /**
     * Sign in an existing user
     *
     * @param email - User's email address
     * @param password - User's password
     * @returns Promise resolving to user data and JWT token
     * @throws ApiError on invalid credentials
     */
    signin(email: string, password: string): Promise<AuthResponse>

    /**
     * Get current authenticated user
     *
     * @returns Promise resolving to current user data
     * @throws ApiError if not authenticated (401)
     */
    getMe(): Promise<User>
  }

  /**
   * Task management endpoints
   */
  tasks: {
    /**
     * List all tasks for authenticated user
     *
     * @returns Promise resolving to array of tasks (newest first)
     * @throws ApiError if not authenticated (401)
     */
    list(): Promise<Task[]>

    /**
     * Get a specific task by ID
     *
     * @param id - Task UUID
     * @returns Promise resolving to task data
     * @throws ApiError if not found (404) or not authorized (403)
     */
    get(id: string): Promise<Task>

    /**
     * Create a new task
     *
     * @param data - Task creation data (title required, description optional)
     * @returns Promise resolving to created task
     * @throws ApiError on validation failure (422) or not authenticated (401)
     */
    create(data: TaskCreate): Promise<Task>

    /**
     * Update an existing task
     *
     * @param id - Task UUID
     * @param data - Task update data (title and/or description)
     * @returns Promise resolving to updated task
     * @throws ApiError if not found (404), not authorized (403), or validation failure (422)
     */
    update(id: string, data: TaskUpdate): Promise<Task>

    /**
     * Delete a task
     *
     * @param id - Task UUID
     * @returns Promise resolving to void (204 No Content)
     * @throws ApiError if not found (404) or not authorized (403)
     */
    delete(id: string): Promise<void>

    /**
     * Toggle task completion status
     *
     * If task is incomplete, marks as complete with timestamp.
     * If task is complete, marks as incomplete and clears timestamp.
     *
     * @param id - Task UUID
     * @returns Promise resolving to updated task
     * @throws ApiError if not found (404) or not authorized (403)
     */
    toggleComplete(id: string): Promise<Task>
  }
}

// ============================================================================
// Endpoint Specifications
// ============================================================================

/**
 * Backend API Endpoints
 *
 * Base URL: process.env.NEXT_PUBLIC_API_URL (e.g., http://localhost:8080)
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH_SIGNUP: '/auth/signup',
  AUTH_SIGNIN: '/auth/signin',
  AUTH_ME: '/auth/me',

  // Tasks
  TASKS_LIST: '/api/tasks',
  TASKS_CREATE: '/api/tasks',
  TASKS_GET: (id: string) => `/api/tasks/${id}`,
  TASKS_UPDATE: (id: string) => `/api/tasks/${id}`,
  TASKS_DELETE: (id: string) => `/api/tasks/${id}`,
  TASKS_TOGGLE_COMPLETE: (id: string) => `/api/tasks/${id}/complete`,
} as const

// ============================================================================
// HTTP Status Codes
// ============================================================================

/**
 * Expected HTTP status codes from backend
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const

// ============================================================================
// Error Messages
// ============================================================================

/**
 * User-friendly error messages for common API errors
 */
export const ERROR_MESSAGES = {
  [HTTP_STATUS.UNAUTHORIZED]: "Your session has expired. Please sign in again.",
  [HTTP_STATUS.FORBIDDEN]: "You don't have permission to access this resource.",
  [HTTP_STATUS.NOT_FOUND]: "The requested resource could not be found.",
  [HTTP_STATUS.UNPROCESSABLE_ENTITY]: "Please check your input and try again.",
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: "Something went wrong on our end. Please try again later.",
  NETWORK_ERROR: "Unable to connect. Please check your internet connection.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
} as const

// ============================================================================
// Request/Response Examples
// ============================================================================

/**
 * Example: Create Task Request
 *
 * POST /api/tasks
 * Authorization: Bearer <jwt_token>
 * Content-Type: application/json
 *
 * Body:
 * {
 *   "title": "Buy groceries",
 *   "description": "Milk, eggs, bread"
 * }
 *
 * Response: 201 Created
 * {
 *   "id": "550e8400-e29b-41d4-a716-446655440000",
 *   "user_id": "123e4567-e89b-12d3-a456-426614174000",
 *   "title": "Buy groceries",
 *   "description": "Milk, eggs, bread",
 *   "completed": false,
 *   "completed_at": null,
 *   "created_at": "2026-02-08T12:00:00Z",
 *   "updated_at": "2026-02-08T12:00:00Z"
 * }
 */

/**
 * Example: List Tasks Request
 *
 * GET /api/tasks
 * Authorization: Bearer <jwt_token>
 *
 * Response: 200 OK
 * [
 *   {
 *     "id": "550e8400-e29b-41d4-a716-446655440000",
 *     "user_id": "123e4567-e89b-12d3-a456-426614174000",
 *     "title": "Buy groceries",
 *     "description": "Milk, eggs, bread",
 *     "completed": false,
 *     "completed_at": null,
 *     "created_at": "2026-02-08T12:00:00Z",
 *     "updated_at": "2026-02-08T12:00:00Z"
 *   }
 * ]
 */

/**
 * Example: Toggle Task Completion Request
 *
 * PATCH /api/tasks/{task_id}/complete
 * Authorization: Bearer <jwt_token>
 *
 * Response: 200 OK
 * {
 *   "id": "550e8400-e29b-41d4-a716-446655440000",
 *   "user_id": "123e4567-e89b-12d3-a456-426614174000",
 *   "title": "Buy groceries",
 *   "description": "Milk, eggs, bread",
 *   "completed": true,
 *   "completed_at": "2026-02-08T12:10:00Z",
 *   "created_at": "2026-02-08T12:00:00Z",
 *   "updated_at": "2026-02-08T12:10:00Z"
 * }
 */

/**
 * Example: Authentication Error Response
 *
 * Response: 401 Unauthorized
 * {
 *   "detail": "Could not validate credentials"
 * }
 */

/**
 * Example: Validation Error Response
 *
 * Response: 422 Unprocessable Entity
 * {
 *   "detail": [
 *     {
 *       "loc": ["body", "title"],
 *       "msg": "Title cannot be empty or whitespace only",
 *       "type": "value_error"
 *     }
 *   ]
 * }
 */
