/**
 * Dashboard page - main task management interface
 * Protected route that requires authentication
 */

'use client'

import { TaskList } from '@/components/tasks/TaskList'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage your tasks and stay organized
        </p>
      </div>

      <TaskList />
    </div>
  )
}
