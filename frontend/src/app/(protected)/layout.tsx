/**
 * Protected layout for authenticated routes
 * Includes Header, Footer, and authentication check with JWT decoding
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { getUserEmailFromToken, isTokenExpired } from '@/lib/auth'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [userEmail, setUserEmail] = useState<string>('User')

  useEffect(() => {
    // Check authentication on mount
    const token = localStorage.getItem('token')

    if (!token || isTokenExpired(token)) {
      // No token or expired, redirect to signin
      router.push('/signin')
      return
    }

    // Token exists and is valid
    setIsAuthenticated(true)

    // Decode JWT to get user email
    const email = getUserEmailFromToken(token)
    setUserEmail(email)

    setIsChecking(false)
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header userEmail={userEmail} />
      <main className="flex-1 py-8">
        <Container>{children}</Container>
      </main>
      <Footer />
    </div>
  )
}
