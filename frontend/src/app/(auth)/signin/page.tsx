'use client'

/**
 * Signin page for user authentication.
 * Redirects to dashboard after successful signin.
 * Redirects to dashboard if already authenticated.
 */

import { redirect } from 'next/navigation'
import SigninForm from '@/components/auth/SigninForm'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function SigninPage() {
  const { isAuthenticated } = useAuth()

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:text-primary/80">
              Sign up
            </Link>
          </p>
        </div>
        <SigninForm />
      </div>
    </div>
  )
}
