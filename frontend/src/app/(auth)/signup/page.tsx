'use client';

/**
 * Signup page for user registration.
 * Redirects to dashboard after successful signup.
 */

import { useRouter } from 'next/navigation';
import SignupForm from '@/components/auth/SignupForm';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to dashboard after successful signup
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
        <SignupForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
