'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, KeyRound, Loader2, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';
import { MARKET_OPTIONS, normalizeMarketCountry } from '@/lib/markets';

type FormMode = 'signin' | 'signup';
type SignInMethod = 'otp' | 'password';

export function AuthForm({ mode, initialCountry = 'NG' }: { mode: FormMode; initialCountry?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countryCode, setCountryCode] = useState(normalizeMarketCountry(initialCountry));
  const [pending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [message, setMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const otpLoginEnabled = process.env.NEXT_PUBLIC_OTP_LOGIN_ENABLED !== 'false';
  const [signInMethod, setSignInMethod] = useState<SignInMethod>('otp');
  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendSeconds, setResendSeconds] = useState(0);

  const requestedNext = searchParams.get('next') || '/dashboard';
  const nextPath = requestedNext.startsWith('/') && !requestedNext.startsWith('//') ? requestedNext : '/dashboard';

  const readApiResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json().catch(() => ({}));
    }

    const text = await response.text().catch(() => '');
    return {
      message: response.status === 404
        ? 'The sign-in service could not be reached. Please use password sign-in for now.'
        : text && !text.trim().startsWith('<')
          ? text
          : 'The server returned an unexpected response. Please try again.',
    };
  };

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = window.setInterval(() => setResendSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  const finishSignIn = () => {
    router.replace(nextPath);
    router.refresh();
  };

  const requestOtp = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setErrorMsg('Enter a valid email address.');
      return;
    }

    setPending(true);
    setErrorMsg('');
    setMessage('');
    try {
      const response = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const payload = await readApiResponse(response);
      if (!response.ok) throw new Error(payload?.message || 'Unable to send a sign-in code.');
      setOtpRequested(true);
      setOtp('');
      setResendSeconds(30);
      setMessage(payload?.message || 'We sent a sign-in code to your email.');
    } catch (error: any) {
      setErrorMsg(error?.message || 'Unable to send a sign-in code.');
    } finally {
      setPending(false);
    }
  };

  const verifyOtp = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const cleanOtp = otp.replace(/\D/g, '');
    if (cleanOtp.length !== 6) {
      setErrorMsg('Enter the code from your email.');
      return;
    }

    setPending(true);
    setErrorMsg('');
    try {
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: cleanOtp, remember: rememberMe }),
      });
      const payload = await readApiResponse(response);
      if (!response.ok) throw new Error(payload?.message || 'That code is invalid or has expired.');
      finishSignIn();
    } catch (error: any) {
      setErrorMsg(error?.message || 'That code is invalid or has expired.');
    } finally {
      setPending(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setErrorMsg('');
    setMessage('');

    try {
      if (mode === 'signup' && password !== confirmPassword) throw new Error('Passwords do not match.');

      const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          ...(mode === 'signup' ? { password_confirmation: confirmPassword } : {}),
          remember: rememberMe,
          ...(mode === 'signup' ? { country_code: countryCode } : {}),
        }),
      });
      const payload = await readApiResponse(response);

      if (payload?.requires_verification) {
        const verificationEmail = String(payload?.email || email).trim().toLowerCase();
        router.replace(`/verify?email=${encodeURIComponent(verificationEmail)}&next=${encodeURIComponent(nextPath)}`);
        return;
      }

      if (!response.ok) throw new Error(payload?.message || 'Unable to continue');
      finishSignIn();
    } catch (error: any) {
      setErrorMsg(error?.message || 'Something went wrong. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-slate-950">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">H</span>
            Hip Homorrd
          </Link>
          <h1 className="mt-8 text-3xl font-bold tracking-tight text-slate-950">{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="mt-2 text-sm text-slate-500">{mode === 'signin' ? (otpLoginEnabled ? 'Use a one-time email code, Google, or your password.' : 'Sign in securely with Google or your password.') : 'Create professional invoices and start collecting payments.'}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {mode === 'signup' && <div className="mb-5"><Label htmlFor="signup-market">Business market</Label><select id="signup-market" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="field mt-2 h-11 w-full">{MARKET_OPTIONS.map((market) => <option key={market.country_code} value={market.country_code}>{market.name} · {market.currency}</option>)}</select><p className="mt-2 text-xs leading-5 text-slate-500">Used for local plan pricing and your dashboard default. Every invoice can still use another supported currency.</p></div>}
          <GoogleAuthButton countryCode={mode === 'signup' ? countryCode : undefined} />

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">or continue with email</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {mode === 'signin' && otpLoginEnabled && (
            <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1" aria-label="Sign-in method">
              <button type="button" onClick={() => { setSignInMethod('otp'); setErrorMsg(''); }} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${signInMethod === 'otp' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}><Mail className="mr-1.5 inline h-4 w-4" />Email code</button>
              <button type="button" onClick={() => { setSignInMethod('password'); setErrorMsg(''); setMessage(''); }} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${signInMethod === 'password' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}><KeyRound className="mr-1.5 inline h-4 w-4" />Password</button>
            </div>
          )}

          {mode === 'signin' && otpLoginEnabled && signInMethod === 'otp' ? (
            otpRequested ? (
              <form className="space-y-5" onSubmit={verifyOtp}>
                <button type="button" onClick={() => { setOtpRequested(false); setOtp(''); setMessage(''); setErrorMsg(''); }} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800"><ArrowLeft className="mr-1.5 h-4 w-4" />Change email</button>
                <div>
                  <Label htmlFor="otp">Sign-in code</Label>
                  <Input id="otp" type="text" inputMode="numeric" autoComplete="one-time-code" autoFocus value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="mt-2 h-12 text-center text-xl font-semibold tracking-[0.28em]" placeholder="000000" />
                  <p className="mt-2 text-xs leading-5 text-slate-500">Sent to <strong className="font-semibold text-slate-700">{email.trim()}</strong>. The code should expire quickly for security.</p>
                </div>
                {message && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</div>}
                {errorMsg && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMsg}</div>}
                <Button type="submit" disabled={pending || otp.length !== 6} className="h-11 w-full bg-emerald-600 text-white hover:bg-emerald-700">{pending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign in'}</Button>
                <button type="button" disabled={pending || resendSeconds > 0} onClick={requestOtp} className="w-full text-center text-sm font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:text-slate-400">{resendSeconds > 0 ? `Send another code in ${resendSeconds}s` : 'Send another code'}</button>
              </form>
            ) : (
              <div className="space-y-5">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void requestOtp(); } }} className="mt-2 h-11" placeholder="you@company.com" />
                </div>
                {errorMsg && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMsg}</div>}
                <Button type="button" onClick={requestOtp} disabled={pending} className="h-11 w-full bg-emerald-600 text-white hover:bg-emerald-700">{pending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Email me a sign-in code'}</Button>
                <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-emerald-600" />Keep me signed in on this device</label>
                <p className="text-center text-xs leading-5 text-slate-400">No password to remember. We send a short-lived code to your email.</p>
              </div>
            )
          ) : (
            <form className="space-y-5" onSubmit={handlePasswordSubmit}>
              {mode === 'signup' && <div><Label htmlFor="name">Name or business name</Label><Input id="name" type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-2 h-11" placeholder="Your name or business" /></div>}
              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-11" placeholder="you@company.com" /></div>
              <div><Label htmlFor="password">Password</Label><Input id="password" type="password" required minLength={8} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 h-11" placeholder="At least 8 characters" /></div>
              {mode === 'signup' && <div><Label htmlFor="confirm-password">Confirm password</Label><Input id="confirm-password" type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-2 h-11" placeholder="Enter your password again" /></div>}
              {mode === 'signin' && <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-emerald-600" />Keep me signed in</label>}
              {errorMsg && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMsg}</div>}
              <Button type="submit" disabled={pending} className="h-11 w-full bg-emerald-600 text-white hover:bg-emerald-700">{pending ? <Loader2 className="h-5 w-5 animate-spin" /> : mode === 'signin' ? 'Sign in' : 'Create account'}</Button>
            </form>
          )}

          <div className="mt-6 flex items-center gap-2 text-xs text-slate-500"><ShieldCheck className="h-4 w-4 text-emerald-600" />Your session is protected by an HTTP-only authentication cookie.</div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">{mode === 'signin' ? <>New to Hip Homorrd? <Link href={`/sign-up${nextPath !== '/dashboard' ? `?next=${encodeURIComponent(nextPath)}` : ''}`} className="font-semibold text-emerald-700 hover:underline">Create an account</Link></> : <>Already have an account? <Link href={`/sign-in${nextPath !== '/dashboard' ? `?next=${encodeURIComponent(nextPath)}` : ''}`} className="font-semibold text-emerald-700 hover:underline">Sign in</Link></>}</p>
      </div>
    </main>
  );
}
