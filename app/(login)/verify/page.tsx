'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { FcCheckmark } from 'react-icons/fc';

const OTP_LENGTH = 6;

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const [resendTimer, setResendTimer] = useState(60); // 1 min countdown
  const [canResend, setCanResend] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next input
    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all OTP digits are filled
    if (newOtp.every((d) => d !== '')) {
      validateOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const validateOtp = async (code: string) => {
    setPending(true);
    setError(null);
    setMessage(null);
    try {
    //   const res = await fetch('/api/auth/verify-otp', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ otp: code }),
    //   });
    //   const data = await res.json();
    //   if (!res.ok) throw new Error(data.message || 'Invalid OTP');

      setIsVerified(true);
      setMessage('OTP verified successfully! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
      setOtp(Array(OTP_LENGTH).fill(''));
      otpRefs.current[0]?.focus();
    } finally {
      setPending(false);
    }
  };

  const handleResend = async () => {
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch('/api/auth/resend-otp', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to resend OTP');

      setMessage('OTP resent successfully!');
      setCanResend(false);
      setResendTimer(60);
      setOtp(Array(OTP_LENGTH).fill(''));
      otpRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {isVerified && <FcCheckmark className="mx-auto h-12 w-12 text-green-600" />}
        <h2 className="mt-6 text-3xl font-extrabold text-green-600">
          {isVerified ? 'Verified!' : 'Verify your account'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter the OTP sent to your email to complete registration.
        </p>
      </div>

      {!isVerified && (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md space-y-6">
          {/* OTP Inputs */}
          <div className="flex justify-center gap-2">
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(el) => (otpRefs.current[index] = el)}
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

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {message && <div className="text-green-600 text-sm">{message}</div>}

          {/* Resend OTP */}
          <div className="text-center mt-4">
            {canResend ? (
              <button
                className="text-green-600 hover:underline text-sm"
                onClick={handleResend}
                disabled={pending}
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-gray-500 text-sm">Resend in {resendTimer}s</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
