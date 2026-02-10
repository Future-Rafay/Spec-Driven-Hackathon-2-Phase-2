'use client'

/**
 * Signup page for user registration.
 * Redirects to dashboard after successful signup.
 */

import SignupForm from '@/components/auth/SignupForm'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Visual differentiation: distinct heading and accent */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {/* Icon/illustration for signup - different from signin */}
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-foreground">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/signin" className="font-medium text-secondary hover:text-secondary/80">
              Sign in
            </Link>
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
