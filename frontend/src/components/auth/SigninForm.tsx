'use client';

/**
 * SigninForm component for user authentication.
 * Handles credential validation, API calls, and error display.
 */

import { useState, FormEvent } from 'react';
import { apiCall } from '@/lib/api-client';

interface SigninFormProps {
  onSuccess?: () => void;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    created_at: string;
  };
  token: string;
}

export default function SigninForm({ onSuccess }: SigninFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);

    try {
      // Call signin API
      const response = await apiCall<AuthResponse>('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Store token in localStorage
      localStorage.setItem('auth_token', response.token);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Display error
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          required
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
