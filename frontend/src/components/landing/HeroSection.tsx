/**
 * HeroSection component for landing page
 * Features: Value proposition, CTA buttons
 */

import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="py-12 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Simple. Powerful. Organized.
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-montserrat text-foreground leading-tight">
              Manage Your Tasks
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                With Confidence
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay organized, boost productivity, and never miss a deadline.
              Your personal task manager that adapts to your workflow.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/signin">
                Sign In
              </Link>
            </Button>
          </div>

          {/* Social Proof */}
          <p className="text-sm text-muted-foreground">
            No credit card required • Free forever • Secure & Private
          </p>
        </div>
      </div>
    </section>
  )
}
