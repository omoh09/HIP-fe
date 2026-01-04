'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaTiktok, FaFacebook, FaTwitter } from 'react-icons/fa';

type FormMode = 'signin' | 'signup';

export function AuthForm({ mode }: { mode: FormMode }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/signup';
      const body = mode === 'signin' ? { email, password, remember: rememberMe } : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Action failed');

      setSuccessMsg(data.message || 'Success!');
      router.push('/dashboard/invoices'); // redirect after success
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setPending(false);
    }
  };

  const handleOAuth = (provider: string) => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-green-600">
          {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-full w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-green-600 focus:border-green-600 sm:text-sm"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-full w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-green-600 focus:border-green-600 sm:text-sm"
              placeholder="Enter your password"
            />
          </div>

          {mode === 'signin' && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                Remember me
              </label>
            </div>
          )}

          {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}
          {successMsg && <div className="text-green-600 text-sm">{successMsg}</div>}

          <Button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 rounded-full bg-green-600 hover:bg-green-700 text-white text-lg sm:text-xl"
            disabled={pending}
          >
            {pending ? <Loader2 className="animate-spin h-5 w-5" /> : mode === 'signin' ? 'Sign in' : 'Sign up'}
          </Button>
        </form>

        <div className="mt-6 flex flex-col gap-3">
          <Button onClick={() => handleOAuth('google')} className="w-full flex justify-center items-center py-3 px-4 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 gap-2 text-lg sm:text-xl">
            <FcGoogle className="h-6 w-6" /> Sign in with Google
          </Button>
          <Button onClick={() => handleOAuth('tiktok')} className="w-full flex justify-center items-center py-3 px-4 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 gap-2 text-lg sm:text-xl">
            <FaTiktok className="h-6 w-6" /> Sign in with TikTok
          </Button>
          <Button onClick={() => handleOAuth('facebook')} className="w-full flex justify-center items-center py-3 px-4 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 gap-2 text-lg sm:text-xl">
            <FaFacebook className="h-6 w-6" /> Sign in with Facebook
          </Button>
          <Button onClick={() => handleOAuth('x')} className="w-full flex justify-center items-center py-3 px-4 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 gap-2 text-lg sm:text-xl">
            <FaTwitter className="h-6 w-6" /> Sign in with X
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          {mode === 'signin' ? (
            <>
              New to Creator Invoice Hub?{' '}
              <Link href="/sign-up" className="text-green-600 hover:underline">
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link href="/sign-in" className="text-green-600 hover:underline">
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
