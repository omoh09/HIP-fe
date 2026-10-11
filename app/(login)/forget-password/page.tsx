// import { Suspense } from 'react';
import ForgotPasswordPage from '../forget-password';
import { AuthForm } from '../login';

export default function ForgetPassword() {
  return (
    // <Suspense>
      <>
        <ForgotPasswordPage />
        {/* <AuthForm mode="forgot-password" /> */}
      </>
    // </Suspense>
  );
}
