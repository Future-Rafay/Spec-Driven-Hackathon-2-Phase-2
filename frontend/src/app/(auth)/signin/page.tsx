'use client'

/**
 * Signin page for user authentication.
 * Redirects to dashboard after successful signin.
 * Redirects to dashboard if already authenticated.
 */

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import SigninForm from '@/components/auth/SigninForm'
import Link from 'next/link'

export default function SigninPage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('auth_token')
    if (token) {
      // Redirect to dashboard if already signed in
      router.push('/dashboard')
    } else {
      setIsChecking(false)
    }
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Checking authentication...</div>
      </div>
    )
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
