'use client'

/**
 * SigninForm component for user authentication.
 * Handles credential validation, API calls, and error display.
 */

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiCall } from '@/lib/api-client'
import { useAuth } from '@/hooks/useAuth'
import type { AuthResponse } from '@/types/auth'

export default function SigninForm() {
  const router = useRouter()
  const { refreshAuth } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      // Call signin API
      const response = await apiCall<AuthResponse>('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      // CRITICAL: Store token FIRST, then refresh auth, then redirect
      // This ensures auth state is fully resolved before navigation
      localStorage.setItem('auth_token', response.token)

      // Wait for auth state to update
      await refreshAuth()

      // Small delay to ensure state propagation (prevents flicker)
      await new Promise(resolve => setTimeout(resolve, 100))

      // Now safe to redirect
      router.push('/dashboard')
    } catch (err) {
      // CRITICAL: Keep loading false and display error
      // Do NOT redirect on error
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
      // Ensure loading is false so user can retry
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={loading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={loading}
          required
        />
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  )
}
