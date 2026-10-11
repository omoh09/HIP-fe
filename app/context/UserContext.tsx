'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import type { User } from '@/lib/types/user';

type UserContextValue = {
  user: User | null;
  isLoading: boolean;
  isError: unknown;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

const fetchUser = async (): Promise<User | null> => {
  const res = await fetch('/api/auth/me', {
    credentials: 'include',
    cache: 'no-store',
  });

  if (res.status === 401) return null;
  if (!res.ok) throw new Error('Unable to load account');

  const payload = await res.json();
  const account = (payload?.user ?? payload) as User & { business_logo?: string; business_name?: string };
  return {
    ...account,
    logo: account.logo ?? account.business_logo,
    businessName: account.businessName ?? account.business_name ?? account.name,
  };
};

export const UserProvider = ({ children, initialUser = null }: { children: ReactNode; initialUser?: User | null }) => {
  const { data, error } = useSWR<User | null>('/api/auth/me', fetchUser, {
    fallbackData: initialUser,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  // Keep the authenticated business identity available to client-only invoice previews.
  // The backend remains the source of truth; localStorage is only a presentation cache.
  useEffect(() => {
    if (!data || typeof window === 'undefined') return;
    if (data.logo) window.localStorage.setItem('business_logo', data.logo);
    if (data.businessName || data.name) window.localStorage.setItem('business_name', data.businessName || data.name || '');
  }, [data]);

  const logout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
    await mutate('/api/auth/me', null, false);
    window.location.href = '/sign-in';
  };

  return (
    <UserContext.Provider
      value={{
        user: data ?? null,
        isLoading: data === undefined && !error,
        isError: error,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
