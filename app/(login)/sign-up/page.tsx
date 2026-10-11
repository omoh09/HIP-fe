import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { AuthForm } from '../login';
import { getCurrentUser } from '@/lib/auth/current-user';
import { normalizeMarketCountry } from '@/lib/markets';

export default async function SignUpPage() {
  const user = await getCurrentUser();
  if (user) redirect('/dashboard');

  const requestHeaders = await headers();
  const initialCountry = normalizeMarketCountry(
    requestHeaders.get('x-vercel-ip-country') || requestHeaders.get('cf-ipcountry') || 'NG'
  );

  return (
    <Suspense>
      <AuthForm mode="signup" initialCountry={initialCountry} />
    </Suspense>
  );
}
