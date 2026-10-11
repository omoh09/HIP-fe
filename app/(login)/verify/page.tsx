'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, MailCheck } from 'lucide-react';

const OTP_LENGTH = 6;

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const nextPath = searchParams.get('next') || '/dashboard';
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = window.setInterval(() => setResendTimer((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [resendTimer]);

  const validateOtp = async (code: string) => {
    if (pending) return;
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch('/api/auth/account/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Invalid or expired code.');
      setMessage('Email verified. Taking you back to your invoice…');
      router.replace(nextPath);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Invalid or expired code.');
      setOtp(Array(OTP_LENGTH).fill(''));
      refs.current[0]?.focus();
    } finally {
      setPending(false);
    }
  };

  const changeDigit = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) refs.current[index + 1]?.focus();
    if (next.every(Boolean)) void validateOtp(next.join(''));
  };

  const resend = async () => {
    if (!email || resendTimer > 0) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/account/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Unable to resend the code.');
      setMessage(data?.message || 'A new code has been sent.');
      setResendTimer(60);
    } catch (err: any) {
      setError(err?.message || 'Unable to resend the code.');
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><MailCheck className="h-6 w-6" /></div>
        <h1 className="mt-6 text-2xl font-bold text-slate-950">Verify your email</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Enter the six-digit code sent to <strong className="font-semibold text-slate-700">{email || 'your email'}</strong>. Your invoice draft will still be there when you continue.</p>

        <div className="mt-7 flex justify-between gap-2">
          {otp.map((value, index) => (
            <input
              key={index}
              ref={(element) => { refs.current[index] = element; }}
              value={value}
              onChange={(event) => changeDigit(event.target.value, index)}
              onKeyDown={(event) => { if (event.key === 'Backspace' && !otp[index] && index > 0) refs.current[index - 1]?.focus(); }}
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              disabled={pending}
              className="h-12 w-12 rounded-xl border border-slate-200 text-center text-xl font-bold text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-50"
              aria-label={`Verification digit ${index + 1}`}
            />
          ))}
        </div>

        {error && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        {message && <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</div>}

        <button type="button" onClick={() => void validateOtp(otp.join(''))} disabled={pending || otp.some((digit) => !digit)} className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
          {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify and continue'}
        </button>
        <button type="button" onClick={resend} disabled={pending || resendTimer > 0} className="mt-4 w-full text-center text-sm font-semibold text-emerald-700 disabled:text-slate-400">
          {resendTimer > 0 ? `Send another code in ${resendTimer}s` : 'Send another code'}
        </button>
      </div>
    </main>
  );
}


export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-slate-50" />}>
      <VerifyForm />
    </Suspense>
  );
}
