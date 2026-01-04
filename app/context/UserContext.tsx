'use client';

import { createContext, useContext } from 'react';
import useSWR, { mutate } from 'swr';

const UserContext = createContext({
  user: null,
  isLoading: true,
  isError: null,
  logout: async () => {},
});

const fetchUser = async () => {
  const res = await fetch('/api/auth/me', { credentials: 'include' });
  if (!res.ok) return null;
  return res.json();
};

export const UserProvider = ({ children }) => {
  const { data, error } = useSWR('/api/auth/me', fetchUser, {
    revalidateOnFocus: false,
  });

  const user = data ?? null;
  const isLoading = !data && !error;
  const isError = error;

  // ✅ New logout function that clears context
  const logout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Logout failed');

      // Clear SWR cache and context
      mutate('/api/auth/me', null, false); 
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, isError, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
