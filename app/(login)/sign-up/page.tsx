import { Suspense } from 'react';
import { AuthForm } from '../login';

export default function SignUpPage() {
  return (
    <Suspense>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
