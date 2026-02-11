/**
 * Auth layout for signin/signup pages
 * Uses PublicLayout with centered content
 */

import { PublicLayout } from '@/components/layout/PublicLayout'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PublicLayout>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </PublicLayout>
  )
}
