/**
 * Landing page with modern SaaS-style design
 * Features: Hero section, features grid, dashboard preview, task preview
 */

import { PublicLayout } from '@/components/layout/PublicLayout'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { DashboardPreview } from '@/components/landing/DashboardPreview'
import { TaskPreview } from '@/components/landing/TaskPreview'

export default function Home() {
  return (
    <PublicLayout>
      <HeroSection />
      <FeaturesSection />
      <DashboardPreview />
      <TaskPreview />
    </PublicLayout>
  )
}
