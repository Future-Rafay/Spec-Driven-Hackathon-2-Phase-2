/**
 * React Query hook for fetching tasks
 */

import { useQuery } from '@tanstack/react-query'
import { getTasks } from '@/lib/api/tasks'

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
