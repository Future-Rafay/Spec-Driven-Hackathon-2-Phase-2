/**
 * FeaturesSection component for landing page
 * Features: Feature highlights grid with icons
 */

import { CheckCircle2, Zap, Shield, Smartphone, Clock, Users } from 'lucide-react'

const features = [
  {
    icon: CheckCircle2,
    title: 'Simple Task Management',
    description: 'Create, organize, and complete tasks with an intuitive interface designed for productivity.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Instant sync across all your devices. Your tasks are always up-to-date, wherever you are.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and protected. We take your privacy seriously with industry-standard security.',
  },
  {
    icon: Smartphone,
    title: 'Works Everywhere',
    description: 'Responsive design that works seamlessly on desktop, tablet, and mobile devices.',
  },
  {
    icon: Clock,
    title: 'Never Miss a Deadline',
    description: 'Stay on top of your tasks with smart organization and clear visual indicators.',
  },
  {
    icon: Users,
    title: 'Personal Workspace',
    description: 'Your tasks are yours alone. Secure multi-user system with complete data isolation.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-montserrat text-foreground">
            Everything You Need to Stay Organized
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you manage your tasks efficiently and effectively.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-background rounded-lg p-6 border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
