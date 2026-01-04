import { Suspense } from 'react';
import { AuthForm } from '../login';

export default function SignInPage() {
  return (
    <Suspense>
      <AuthForm mode="signin" />
    </Suspense>
  );
}
