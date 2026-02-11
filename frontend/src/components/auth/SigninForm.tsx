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

export default function SigninForm() {
  const router = useRouter()
  const { refreshAuth } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

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
      const response = await apiCall<AuthResponse>('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      localStorage.setItem('auth_token', response.token)
      await refreshAuth()
      await new Promise(resolve => setTimeout(resolve, 100))
      router.push('/dashboard')
    } catch (err) {
      if (err instanceof Error) setError(err.message)
      else setError('An unexpected error occurred')
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
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={loading}
          required
          className="border-border bg-background"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password" className="text-sm">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
      </div>

      {error && (
        <div className="border border-border bg-muted px-3 py-2 text-sm rounded-md">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  )
}
