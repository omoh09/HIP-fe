import { Suspense } from 'react';
import ResetPasswordPage from '../reset-password';
// import { AuthForm } from '../login';

export default function ResetPassword() {
  return (
    <Suspense>
      <ResetPasswordPage />
        {/* <AuthForm mode="reset-password" /> */}
    </Suspense>
  );
}
