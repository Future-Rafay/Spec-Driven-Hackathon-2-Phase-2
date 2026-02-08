/**
 * React Query mutations for task operations
 * Includes optimistic updates and cache invalidation
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask, updateTask, deleteTask, toggleTaskComplete } from '@/lib/api/tasks'
import type { Task, TaskCreate, TaskUpdate } from '@/types/task'

/**
 * Hook for creating a new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TaskCreate) => createTask(data),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

/**
 * Hook for updating a task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskUpdate }) => updateTask(id, data),
    onSuccess: (updatedTask) => {
      // Invalidate tasks list and specific task
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['tasks', updatedTask.id] })
    },
  })
}

/**
 * Hook for deleting a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] })

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])

      // Optimistically remove task from cache
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          ['tasks'],
          previousTasks.filter((task) => task.id !== id)
        )
      }

      return { previousTasks }
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks)
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

/**
 * Hook for toggling task completion
 */
export function useToggleTaskComplete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => toggleTaskComplete(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] })

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])

      // Optimistically update task in cache
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          ['tasks'],
          previousTasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  completed_at: !task.completed ? new Date().toISOString() : null,
                }
              : task
          )
        )
      }

      return { previousTasks }
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks)
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
