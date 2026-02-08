/**
 * TaskEmptyState component for when there are no tasks
 */

import { Button } from '@/components/ui/button'

interface TaskEmptyStateProps {
  onCreateClick: () => void
}

export function TaskEmptyState({ onCreateClick }: TaskEmptyStateProps) {
  return (
    <div className="bg-white rounded-lg shadow p-12 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <div className="text-6xl">📝</div>
        <h3 className="text-xl font-semibold text-gray-900">
          No tasks yet
        </h3>
        <p className="text-gray-600">
          Get started by creating your first task. Stay organized and track your progress!
        </p>
        <Button onClick={onCreateClick} size="lg">
          Create Your First Task
        </Button>
      </div>
    </div>
  )
}
