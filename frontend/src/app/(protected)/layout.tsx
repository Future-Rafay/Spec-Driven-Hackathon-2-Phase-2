/**
 * Protected layout for authenticated routes
 * Uses centralized AuthProvider for authentication state
 */

'use client'

import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { useAuth } from '@/hooks/useAuth'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, userEmail } = useAuth()

  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    redirect('/signin')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header userEmail={userEmail || 'User'} />
      <main className="flex-1 py-8">
        <Container>{children}</Container>
      </main>
      <Footer />
    </div>
  )
}
