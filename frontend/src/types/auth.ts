/**
 * Authentication types for Better Auth integration
 */

export interface User {
  id: string              // UUID format
  email: string           // User's email address
  created_at: string      // ISO 8601 datetime
  updated_at?: string     // ISO 8601 datetime
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string           // JWT token
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  loading: boolean
}

/**
 * Decoded JWT token payload structure
 */
export interface DecodedToken {
  user_id: string         // UUID of authenticated user
  email: string           // User's email address
  exp: number             // Expiration timestamp (Unix epoch seconds)
  iat: number             // Issued at timestamp (Unix epoch seconds)
}
