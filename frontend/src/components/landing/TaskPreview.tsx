/**
 * TaskPreview component for landing page
 * Visual preview of task management UI
 */

import { Plus, CheckCircle2, Circle, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TaskPreview() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-montserrat text-foreground">
            Powerful Task Management
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create, edit, and complete tasks with ease. Everything you need in one place.
          </p>
        </div>

        {/* Task UI Preview */}
        <div className="max-w-3xl mx-auto">
          {/* Create Task Section */}
          <div className="bg-background rounded-lg border border-border p-6 mb-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Plus className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Create New Task</h3>
            </div>
            <div className="space-y-3">
              <div className="border border-border rounded-md p-3 bg-muted/30">
                <p className="text-sm text-muted-foreground">Task title...</p>
              </div>
              <div className="border border-border rounded-md p-3 bg-muted/30 h-20">
                <p className="text-sm text-muted-foreground">Description (optional)...</p>
              </div>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>

          {/* Task List Section */}
          <div className="bg-background rounded-lg border border-border p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Your Tasks</h3>
              <span className="text-sm text-muted-foreground">3 active</span>
            </div>

            <div className="space-y-3">
              {/* Active Task 1 */}
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors group">
                <button className="mt-0.5">
                  <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium">Finish landing page design</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete the hero section and feature highlights
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created Feb 10, 2026 at 2:30 PM
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-muted rounded-md">
                    <Edit className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-2 hover:bg-destructive/10 rounded-md">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>

              {/* Active Task 2 */}
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors group">
                <button className="mt-0.5">
                  <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium">Review pull requests</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created Feb 10, 2026 at 1:15 PM
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-muted rounded-md">
                    <Edit className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-2 hover:bg-destructive/10 rounded-md">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>

              {/* Completed Task */}
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30 opacity-75">
                <button className="mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium line-through">Update documentation</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Completed Feb 10, 2026 at 12:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
