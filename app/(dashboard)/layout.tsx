'use client';

import { ReactNode } from 'react';
import DashboardHeader from '@/components/dashboard-header';
import SiteFooter from '@/components/site-footer';
import { UserProvider } from '../context/UserContext';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <UserProvider>
      <section className="flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </section>
    </UserProvider>
  );
}
