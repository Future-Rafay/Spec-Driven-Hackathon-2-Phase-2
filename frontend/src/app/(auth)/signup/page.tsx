'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SignupForm from '@/components/auth/SignupForm'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function SignupPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || isAuthenticated) return null

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-background text-foreground px-4">
      
      <div className="w-full max-w-md 
      border border-border 
      bg-background 
      rounded-xl p-8 space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Create account</h2>
          <p className="text-sm text-muted-foreground">
            Start managing your tasks
          </p>
        </div>

        {/* Form */}
        <SignupForm />

        {/* Footer */}
        <div className="text-center text-sm border-t border-border pt-4">
          <span className="text-muted-foreground">Already registered?</span>{' '}
          <Link href="/signin" className="underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
