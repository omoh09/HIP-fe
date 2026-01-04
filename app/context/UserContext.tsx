'use client';

import { createContext, useContext, ReactNode } from 'react';
import useSWR, { mutate } from 'swr';
import type { User } from '@/lib/types/user';

type UserContextValue = {
  user: User | null;
  isLoading: boolean;
  isError: unknown;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(
  undefined
);

const fetchUser = async (): Promise<User | null> => {
  const res = await fetch('/api/auth/me', {
    credentials: 'include',
  });
  if (!res.ok) return null;
  return res.json();
};

export const UserProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { data, error } = useSWR('/api/auth/me', fetchUser, {
    revalidateOnFocus: false,
  });

  const logout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    });

    mutate('/api/auth/me', null, false);
  };

  return (
    <UserContext.Provider
      value={{
        user: data ?? null,
        isLoading: !data && !error,
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
  if (!ctx) {
    throw new Error(
      'useUser must be used within UserProvider'
    );
  }
  return ctx;
};
