/**
 * DeleteTaskModal component for confirming task deletion
 * Handles long task titles/descriptions with proper overflow
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

interface DeleteTaskModalProps {
  task: Task
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
}

export function DeleteTaskModal({ task, onConfirm, onCancel, isDeleting }: DeleteTaskModalProps) {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Task Title:</p>
            <p className="text-sm text-foreground break-words">{task.title}</p>
          </div>

          {task.description && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Description:</p>
              <p className="text-sm text-foreground break-words whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
