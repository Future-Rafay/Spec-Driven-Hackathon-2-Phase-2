/**
 * TaskItem component for displaying individual tasks
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { Task } from '@/types/task'
import { format } from 'date-fns'

interface TaskItemProps {
  task: Task
  onToggleComplete: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const [isToggling, setIsToggling] = useState(false)

  const handleToggle = async () => {
    setIsToggling(true)
    try {
      await onToggleComplete(task.id)
    } finally {
      setIsToggling(false)
    }
  }

  // Format timestamps as absolute dates
  const formatTimestamp = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Not available'

    try {
      const date = new Date(dateString)
      // Format: "Jan 15, 2026 at 2:30 PM"
      return format(date, 'MMM d, yyyy \'at\' h:mm a')
    } catch (error) {
      console.error('Failed to format timestamp:', error)
      return 'Invalid date'
    }
  }

  return (
    <div className="bg-card rounded-lg shadow border border-border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleToggle}
          disabled={isToggling}
          className="mt-1"
        />

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-medium text-card-foreground ${
              task.completed ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
          )}

          {/* Updated timestamp display */}
          <div className="flex flex-col gap-1 mt-2 text-xs text-muted-foreground">
            <span>
              Created on {formatTimestamp(task.created_at)}
            </span>
            {task.updated_at && task.updated_at !== task.created_at && (
              <span>
                Updated on {formatTimestamp(task.updated_at)}
              </span>
            )}
            {task.completed && task.completed_at ? (
              <span className="text-green-600 dark:text-green-400">
                ✓ Completed on {formatTimestamp(task.completed_at)}
              </span>
            ) : null}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(task)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(task)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
