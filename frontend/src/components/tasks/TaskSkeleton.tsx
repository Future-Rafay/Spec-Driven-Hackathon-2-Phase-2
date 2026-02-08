/**
 * TaskSkeleton component for loading state
 */

export function TaskSkeleton() {
  return (
    <div className="bg-card rounded-lg shadow border border-border p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 bg-muted rounded"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-muted rounded"></div>
          <div className="w-8 h-8 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  )
}
