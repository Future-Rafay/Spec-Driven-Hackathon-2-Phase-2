/**
 * DeleteConfirmDialog component for confirming task deletion
 */

'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import type { Task } from '@/types/task'

interface DeleteConfirmDialogProps {
  task: Task
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmDialog({ task, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 rounded-lg p-4 my-4">
          <p className="font-medium text-gray-900">{task.title}</p>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
