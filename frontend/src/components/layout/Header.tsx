/**
 * Header component with user menu, theme toggle, and logout
 */

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container } from './Container'
import { ThemeToggle } from './ThemeToggle'
import { useSignout } from '@/lib/auth'

interface HeaderProps {
  userEmail: string
}

export function Header({ userEmail }: HeaderProps) {
  const signout = useSignout()

  const handleLogout = () => {
    signout()
  }

  return (
    <header className="border-b bg-background">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <Link href="/dashboard" className="text-xl font-bold font-montserrat text-foreground">
            Todo App
          </Link>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {userEmail}
            </span>
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </Container>
    </header>
  )
}
