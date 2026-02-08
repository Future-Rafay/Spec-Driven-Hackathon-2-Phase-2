/**
 * Auth layout for signin/signup pages
 * Simple centered layout with footer
 */

import { Footer } from '@/components/layout/Footer'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  )
}
