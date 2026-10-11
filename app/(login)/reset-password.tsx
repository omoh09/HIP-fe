'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { FcLock } from 'react-icons/fc';

export default function ResetPasswordPage() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const OTP_LENGTH = 6;
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ================= VERIFY OTP ================= */
  const validateOtp = async (code: string) => {
    setPending(true);
    setError(null);
    setMessage(null);

    try {
      // const res = await fetch('/api/auth/verify-reset-code', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ code }), // no email needed
      // });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.message || 'Invalid OTP');

      setIsCodeVerified(true);
      setMessage('OTP verified. You can now reset your password.');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
      setOtp(Array(OTP_LENGTH).fill(''));
      otpRefs.current[0]?.focus();
    } finally {
      setPending(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== '')) {
      validateOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  /* ================= RESET PASSWORD ================= */
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setPending(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp: otp.join(''),
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password reset failed');

      setMessage('Your password has been reset successfully. You can now sign in.');
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
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter the OTP sent to you.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {!isCodeVerified ? (
          /* ================= OTP INPUTS ================= */
          <div className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((value, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpRefs.current[index] = el;
                  }}
                  value={value}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  maxLength={1}
                  inputMode="numeric"
                  className="w-12 h-12 text-center text-xl border rounded-lg focus:ring-2 focus:ring-green-600"
                  placeholder="-"
                />
              ))}
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            {message && <div className="text-green-600 text-sm text-center">{message}</div>}
          </div>
        ) : (
          /* ================= RESET PASSWORD ================= */
          <div className="space-y-6">
            <p className="text-center text-sm text-gray-600">
              Enter your new password below.
            </p>

            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-full"
              />
            </div>

            <div>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-full"
              />
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            {message && <div className="text-green-600 text-sm text-center">{message}</div>}

            <Button
              onClick={handleResetPassword}
              disabled={pending}
              className="w-full rounded-full bg-green-600"
            >
              {pending ? <Loader2 className="animate-spin" /> : 'Reset Password'}
            </Button>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link href="/sign-in" className="text-green-600 hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
