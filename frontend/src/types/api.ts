/**
 * API error types for error handling
 */

export interface ApiError {
  status: number
  message: string
  detail?: string | ValidationError[]
}

export interface ValidationError {
  loc: string[]           // Field location
  msg: string             // Error message
  type: string            // Error type
}
