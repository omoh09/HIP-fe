import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { AuthForm } from '../login';
import { getCurrentUser } from '@/lib/auth/current-user';

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const requested = params.next || '/dashboard';
  const nextPath = requested.startsWith('/') && !requested.startsWith('//') ? requested : '/dashboard';
  const user = await getCurrentUser();
  if (user) redirect(nextPath);

  return (
    <Suspense>
      <AuthForm mode="signin" />
    </Suspense>
  );
}
