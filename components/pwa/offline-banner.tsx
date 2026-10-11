'use client';
import { WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';
export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync(); window.addEventListener('online', sync); window.addEventListener('offline', sync);
    return () => { window.removeEventListener('online', sync); window.removeEventListener('offline', sync); };
  }, []);
  if (!offline) return null;
  return <div className="fixed inset-x-0 bottom-3 z-[70] mx-auto flex w-[calc(100%-1.5rem)] max-w-xl items-center justify-center gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-center text-xs font-semibold text-amber-900 shadow-xl dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100"><WifiOff className="h-4 w-4" />You&apos;re offline. Drafting can continue on this device; sign-in, payments, subscriptions and sync resume when you reconnect.</div>;
}
