'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains('dark')), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    window.localStorage.setItem('hip-theme', next ? 'dark' : 'light');
  };
  return <button type="button" onClick={toggle} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-600 transition hover:border-emerald-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-600 dark:hover:text-white" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>;
}
