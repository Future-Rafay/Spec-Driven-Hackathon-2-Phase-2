'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiCall } from '@/lib/api-client'
import { useAuth } from '@/hooks/useAuth'
import type { AuthResponse } from '@/types/auth'

export default function SignupForm() {
  const router = useRouter()
  const { refreshAuth } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)

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

    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    if (!isEmailValid || !isPasswordValid) return

    setLoading(true)

    try {
      const response = await apiCall<AuthResponse>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      localStorage.setItem('auth_token', response.token)
      await refreshAuth()
      await new Promise(resolve => setTimeout(resolve, 100))
      router.push('/dashboard')
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('already exists')) {
          setError('An account with this email already exists. Please sign in instead.')
        } else {
          setError(err.message)
        }
      } else {
        setError('An unexpected error occurred')
      }
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <Label htmlFor="email" className="text-sm">Email</Label>
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
          className="border-border bg-background"
        />
        {emailError && (
          <p className="text-sm text-muted-foreground">{emailError}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password" className="text-sm">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (passwordError) validatePassword(e.target.value)
            }}
            onBlur={() => validatePassword(password)}
            placeholder="••••••••"
            disabled={loading}
            required
            className="pr-10 border-border bg-background"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 
            text-muted-foreground hover:text-foreground"
            disabled={loading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {passwordError && (
          <p className="text-sm text-muted-foreground">{passwordError}</p>
        )}

        <p className="text-xs text-muted-foreground">
          At least 8 characters with uppercase, lowercase, and a number
        </p>
      </div>

      {error && (
        <div className="border border-border bg-muted px-3 py-2 text-sm rounded-md">
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating account...' : 'Sign Up'}
      </Button>
    </form>
  )
}
