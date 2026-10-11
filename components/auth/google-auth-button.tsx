'use client';

import Script from 'next/script';
import { useCallback, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export function GoogleAuthButton({ countryCode }: { countryCode?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCredential = useCallback(async (response: { credential: string }) => {
    if (!response?.credential) {
      setError('Google did not return a valid credential. Please try again.');
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential, ...(countryCode ? { country_code: countryCode } : {}) }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.message || 'Unable to continue with Google.');
      router.replace(searchParams.get('next') || '/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to continue with Google.');
      setPending(false);
    }
  }, [router, searchParams, countryCode]);

  const initialize = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google?.accounts?.id) {
      setError('Google sign-in is not configured.');
      return;
    }
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredential,
      ux_mode: 'popup',
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    const target = document.getElementById('google-signin-button');
    if (target) {
      target.innerHTML = '';
      window.google.accounts.id.renderButton(target, {
        type: 'standard', theme: 'outline', size: 'large', width: 360,
        text: 'continue_with', shape: 'rectangular',
      });
    }
    setReady(true);
  }, [handleCredential]);

  return (
    <div className="space-y-2">
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={initialize} />
      <div className="relative min-h-11">
        {!ready && !error && (
          <div className="flex h-11 w-full items-center justify-center rounded-lg border border-slate-200 bg-white text-sm text-slate-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading Google…
          </div>
        )}
        <div id="google-signin-button" className={ready ? 'flex justify-center' : 'hidden'} />
        {pending && <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80"><Loader2 className="h-5 w-5 animate-spin text-emerald-600" /></div>}
      </div>
      {error && <p role="alert" className="text-center text-sm text-red-600">{error}</p>}
    </div>
  );
}
