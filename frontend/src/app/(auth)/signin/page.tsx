'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SigninForm from '@/components/auth/SigninForm'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function SigninPage() {
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
          <h2 className="text-2xl font-semibold">Sign in</h2>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to continue
          </p>
        </div>

        {/* Form */}
        <SigninForm />

        {/* Footer */}
        <div className="text-center text-sm border-t border-border pt-4">
          <span className="text-muted-foreground">No account?</span>{' '}
          <Link href="/signup" className="underline">
            Create one
          </Link>
        </div>
      </div>
    </div>
  )
}
