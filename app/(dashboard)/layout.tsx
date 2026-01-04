'use client';

import { ReactNode } from 'react';
import useSWR from 'swr';
import DashboardHeader from '@/components/dashboard-header';
import SiteFooter from '@/components/site-footer';
import type { User } from '@/lib/types/user';
import { UserProvider } from '../context/UserContext';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useSWR<User | null>(
    '/api/user',
    fetcher
  );

  if (isLoading) return null; // or skeleton

  return (
    <UserProvider user={user ?? null}>
      <section className="flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </section>
    </UserProvider>
  );
}
