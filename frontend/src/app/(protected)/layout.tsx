/**
 * Protected layout for authenticated routes
 * Includes Header and authentication check
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Container } from '@/components/layout/Container'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [user, setUser] = useState<{ email: string } | null>(null)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('auth_token')

    if (!token) {
      // No token, redirect to signin
      router.push('/signin')
    } else {
      // Token exists, user is authenticated
      // In a real app, you might want to verify the token with the backend
      setIsAuthenticated(true)

      // Try to get user info from token (JWT decode) or make API call
      // For now, we'll just set a placeholder
      setUser({ email: 'user@example.com' })
      setIsChecking(false)
    }
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <main className="py-8">
        <Container>{children}</Container>
      </main>
    </div>
  )
}
