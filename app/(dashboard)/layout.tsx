import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/dashboard-header';
import SiteFooter from '@/components/site-footer';
import { UserProvider } from '../context/UserContext';
import { getCurrentUser } from '@/lib/auth/current-user';
import ActivationChecklist from '@/components/onboarding/activation-checklist';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in?reason=session-expired&clear_session=1');
  }

  return (
    <UserProvider initialUser={user}>
      <div className="app-shell flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="min-h-[calc(100vh-65px)] flex-1 pt-16">{children}</main>
        <SiteFooter />
        <ActivationChecklist userId={user.id} />
      </div>
    </UserProvider>
  );
}
