/**
 * DashboardPreview component for landing page
 * Visual preview of the dashboard interface
 */

import { LayoutDashboard, CheckCircle2, Circle, Clock } from 'lucide-react'

export function DashboardPreview() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-montserrat text-foreground">
            Your Personal Dashboard
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A clean, intuitive interface that puts your tasks front and center.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl border-2 border-border p-8 shadow-2xl">
          {/* Mock Header */}
          <div className="bg-background rounded-lg border border-border p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">AR</span>
              </div>
            </div>
          </div>

          {/* Mock Task Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-background rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Circle className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
              <p className="text-2xl font-bold text-foreground">12</p>
            </div>
            <div className="bg-background rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <p className="text-2xl font-bold text-foreground">48</p>
            </div>
            <div className="bg-background rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">This Week</span>
              </div>
              <p className="text-2xl font-bold text-foreground">8</p>
            </div>
          </div>

          {/* Mock Task List */}
          <div className="bg-background rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
              <Circle className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">Complete project proposal</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
              <Circle className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">Review team feedback</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors opacity-50">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-foreground line-through">Update documentation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
