/**
 * Global loading screen shown during auth state resolution
 * Theme-aware with animated loading indicator
 */

'use client'

export function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="text-4xl font-bold text-foreground">Todo App</div>
        <div className="flex items-center justify-center gap-2">
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
        <div className="text-sm text-muted-foreground">Checking authentication...</div>
      </div>
    </div>
  )
}
