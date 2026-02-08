/**
 * Task types for task management
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

export interface TaskCreate {
  title: string           // Required, 1-500 characters
  description?: string    // Optional, max 2000 characters
}

export interface TaskUpdate {
  title?: string          // Optional, 1-500 characters
  description?: string    // Optional, max 2000 characters
}
