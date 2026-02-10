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
        {/* Visual differentiation: distinct heading and accent */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {/* Icon/illustration for signin */}
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-foreground">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
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
