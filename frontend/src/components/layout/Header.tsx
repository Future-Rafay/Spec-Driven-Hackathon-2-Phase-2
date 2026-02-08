/**
 * Header component with user menu and logout
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Container } from './Container'

interface HeaderProps {
  user?: {
    email: string
  } | null
}

export function Header({ user }: HeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    // Clear token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
    // Redirect to signin
    router.push('/signin')
  }

  return (
    <header className="border-b bg-white">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <Link href={user ? '/dashboard' : '/'} className="text-xl font-bold text-gray-900">
            Todo App
          </Link>

          {/* User Menu */}
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:inline">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </Container>
    </header>
  )
}
