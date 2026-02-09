/**
 * Centralized Authentication Provider
 * Manages global auth state and blocks UI rendering until auth is resolved
 */

'use client'

import { createContext, useEffect, useState, ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { AuthProviderState, AuthContextValue } from '@/types/auth'
import { getUserEmailFromToken, isTokenExpired } from '@/lib/auth'
import { AuthLoadingScreen } from './AuthLoadingScreen'

// Create auth context
export const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const [authState, setAuthState] = useState<AuthProviderState>({
    isAuthenticated: false,
    isLoading: true,  // Start in loading state
    userEmail: null,
    error: null,
  })

  useEffect(() => {
    // Run auth check ONCE on mount
    checkAuthStatus()
  }, [])

  /**
   * Check authentication status from localStorage
   * Runs once on app initialization
   */
  async function checkAuthStatus() {
    const timeout = new Promise<AuthProviderState>((_, reject) =>
      setTimeout(() => reject(new Error('Auth check timeout')), 5000)
    )

    const authCheck = new Promise<AuthProviderState>((resolve) => {
      try {
        if (typeof window === 'undefined') {
          resolve({
            isAuthenticated: false,
            isLoading: false,
            userEmail: null,
            error: null,
          })
          return
        }

        const token = localStorage.getItem('auth_token')

        if (!token || isTokenExpired(token)) {
          // No valid token
          resolve({
            isAuthenticated: false,
            isLoading: false,
            userEmail: null,
            error: null,
          })
          return
        }

        // Valid token found
        const email = getUserEmailFromToken(token)
        resolve({
          isAuthenticated: true,
          isLoading: false,
          userEmail: email,
          error: null,
        })
      } catch (error) {
        // Error during check - default to unauthenticated
        resolve({
          isAuthenticated: false,
          isLoading: false,
          userEmail: null,
          error: 'Auth check failed',
        })
      }
    })

    try {
      const result = await Promise.race([authCheck, timeout])
      setAuthState(result)
    } catch (error) {
      // Timeout or error - default to unauthenticated
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        userEmail: null,
        error: 'Auth check failed',
      })
    }
  }

  /**
   * Sign out the current user
   * Clears cache, removes token, updates state, and redirects
   */
  async function signout() {
    // Clear React Query cache
    queryClient.clear()

    // Remove token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }

    // Update auth state
    await refreshAuth()

    // Redirect to signin
    router.push('/signin')
  }

  /**
   * Refresh auth state from localStorage
   * Called after login/logout to sync state
   */
  async function refreshAuth() {
    await checkAuthStatus()
  }

  // Don't render children until auth state is resolved
  if (authState.isLoading) {
    return <AuthLoadingScreen />
  }

  return (
    <AuthContext.Provider value={{ ...authState, signout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
