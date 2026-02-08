/**
 * TaskList component - main container for task management
 */

'use client'

import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { useToggleTaskComplete, useDeleteTask } from '@/hooks/useTaskMutations'
import { TaskItem } from './TaskItem'
import { TaskSkeleton } from './TaskSkeleton'
import { TaskEmptyState } from './TaskEmptyState'
import { CreateTaskForm } from './CreateTaskForm'
import { EditTaskModal } from './EditTaskModal'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import type { Task } from '@/types/task'

export function TaskList() {
  const { data: tasks, isLoading, isError, error } = useTasks()
  const toggleComplete = useToggleTaskComplete()
  const deleteTask = useDeleteTask()

  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  const handleToggleComplete = (id: string) => {
    toggleComplete.mutate(id)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
  }

  const handleDelete = (task: Task) => {
    setDeletingTask(task)
  }

  const handleConfirmDelete = () => {
    if (deletingTask) {
      deleteTask.mutate(deletingTask.id)
      setDeletingTask(null)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <TaskSkeleton />
        <TaskSkeleton />
        <TaskSkeleton />
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
        <p className="font-medium">Error loading tasks</p>
        <p className="text-sm mt-1">{error?.message || 'An unexpected error occurred'}</p>
      </div>
    )
  }

  // Empty state
  if (!tasks || tasks.length === 0) {
    return (
      <>
        <TaskEmptyState onCreateClick={() => setIsCreateFormOpen(true)} />
        {isCreateFormOpen && (
          <CreateTaskForm onClose={() => setIsCreateFormOpen(false)} />
        )}
      </>
    )
  }

  // Task list
  return (
    <div className="space-y-6">
      {/* Create Task Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">
          Your Tasks ({tasks.length})
        </h2>
        <button
          onClick={() => setIsCreateFormOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          + New Task
        </button>
      </div>

      {/* Task Items */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Modals */}
      {isCreateFormOpen && (
        <CreateTaskForm onClose={() => setIsCreateFormOpen(false)} />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      {deletingTask && (
        <DeleteConfirmDialog
          task={deletingTask}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingTask(null)}
        />
      )}
    </div>
  )
}
