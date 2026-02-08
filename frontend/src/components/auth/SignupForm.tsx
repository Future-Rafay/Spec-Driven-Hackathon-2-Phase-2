'use client'

/**
 * SignupForm component for user registration.
 * Handles email/password validation, API calls, and error display.
 */

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiCall } from '@/lib/api-client'
import type { AuthResponse } from '@/types/auth'

export default function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('Email is required')
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format')
      return false
    }
    setEmailError('')
    return true
  }

  // Password strength validation
  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required')
      return false
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return false
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter')
      return false
    }
    if (!/[a-z]/.test(password)) {
      setPasswordError('Password must contain at least one lowercase letter')
      return false
    }
    if (!/\d/.test(password)) {
      setPasswordError('Password must contain at least one digit')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate inputs
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setLoading(true)

    try {
      // Call signup API
      const response = await apiCall<AuthResponse>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      // Store token in localStorage
      localStorage.setItem('auth_token', response.token)

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      // Display error
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
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
          onChange={(e) => {
            setEmail(e.target.value)
            if (emailError) validateEmail(e.target.value)
          }}
          onBlur={() => validateEmail(email)}
          placeholder="you@example.com"
          disabled={loading}
          required
        />
        {emailError && (
          <p className="text-destructive text-sm">{emailError}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (passwordError) validatePassword(e.target.value)
          }}
          onBlur={() => validatePassword(password)}
          placeholder="••••••••"
          disabled={loading}
          required
        />
        {passwordError && (
          <p className="text-destructive text-sm">{passwordError}</p>
        )}
        <p className="text-muted-foreground text-xs">
          Must be at least 8 characters with uppercase, lowercase, and digit
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating account...' : 'Sign Up'}
      </Button>
    </form>
  )
}
