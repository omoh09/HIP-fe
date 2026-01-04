'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { FcLock } from 'react-icons/fc';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setMessage('Check your email for reset instructions!');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <FcLock className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-green-600">
          Forgot your password?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email and we’ll send you instructions to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </Label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="off"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-green-600 focus:border-green-600 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {message && <div className="text-green-600 text-sm">{message}</div>}

          <div>
            <Button
              type="submit"
              disabled={pending}
              className="w-full flex justify-center items-center py-3 px-4 rounded-full bg-green-600 hover:bg-green-700 text-white text-lg sm:text-xl"
            >
              {pending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Remembered your password?{' '}
          <Link href="/sign-in" className="text-green-600 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
