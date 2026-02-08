/**
 * EditTaskModal component for editing existing tasks
 */

'use client'

import { useState, FormEvent, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useUpdateTask } from '@/hooks/useTaskMutations'
import type { Task } from '@/types/task'

interface EditTaskModalProps {
  task: Task
  onClose: () => void
}

export function EditTaskModal({ task, onClose }: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [error, setError] = useState('')

  const updateTask = useUpdateTask()

  // Reset form when task changes
  useEffect(() => {
    setTitle(task.title)
    setDescription(task.description || '')
  }, [task])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    if (title.length > 500) {
      setError('Title must be 500 characters or less')
      return
    }

    if (description.length > 2000) {
      setError('Description must be 2000 characters or less')
      return
    }

    // Check if anything changed
    if (title.trim() === task.title && description.trim() === (task.description || '')) {
      onClose()
      return
    }

    try {
      await updateTask.mutateAsync({
        id: task.id,
        data: {
          title: title.trim(),
          description: description.trim() || undefined,
        },
      })

      // Success - close modal
      onClose()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to update task')
      }
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              disabled={updateTask.isPending}
              maxLength={500}
              required
            />
            <p className="text-xs text-gray-500">
              {title.length}/500 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description (optional)"
              disabled={updateTask.isPending}
              maxLength={2000}
              rows={4}
            />
            <p className="text-xs text-gray-500">
              {description.length}/2000 characters
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateTask.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateTask.isPending}>
              {updateTask.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
