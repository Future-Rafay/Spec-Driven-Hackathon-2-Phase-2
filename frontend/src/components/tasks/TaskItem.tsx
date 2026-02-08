/**
 * TaskItem component for displaying individual tasks
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { Task } from '@/types/task'
import { formatDistanceToNow } from 'date-fns'

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

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
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
            className={`font-medium text-gray-900 ${
              task.completed ? 'line-through text-gray-500' : ''
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>
              Created {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
            </span>
            {task.completed && task.completed_at && (
              <span>
                ✓ Completed {formatDistanceToNow(new Date(task.completed_at), { addSuffix: true })}
              </span>
            )}
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
