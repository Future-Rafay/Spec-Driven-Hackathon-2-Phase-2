/**
 * Landing page with navigation to signin/signup
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/Container'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Container>
        <div className="flex min-h-screen flex-col items-center justify-center py-12">
          <div className="text-center space-y-8 max-w-2xl">
            {/* Logo/Title */}
            <h1 className="text-5xl font-bold text-gray-900">
              Todo App
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600">
              A secure, multi-user todo application with JWT authentication.
              Manage your tasks efficiently and stay organized.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/signin">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Secure Authentication</h3>
                <p className="text-gray-600 text-sm">
                  JWT-based authentication ensures your data is protected
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Task Management</h3>
                <p className="text-gray-600 text-sm">
                  Create, update, delete, and track your tasks with ease
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Responsive Design</h3>
                <p className="text-gray-600 text-sm">
                  Works seamlessly on desktop, tablet, and mobile devices
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
