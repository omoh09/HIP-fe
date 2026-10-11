'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Check, ChevronDown, ChevronUp, Circle, Rocket, X } from 'lucide-react';

type Step = {
  key: string;
  title: string;
  description: string;
  href: string;
  done: boolean;
};

type Payload = {
  steps: Step[];
  completed: number;
  total: number;
  complete: boolean;
};

export default function ActivationChecklist({ userId }: { userId: string | number }) {
  const pathname = usePathname();
  const minimizedKey = `hh_onboarding_minimized_v1:${userId}`;
  const completedDismissedKey = `hh_onboarding_completed_dismissed_v1:${userId}`;
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/onboarding', { cache: 'no-store' });
      if (!response.ok) return;
      const payload = await response.json();
      setData(payload?.data ?? payload);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      setMinimized(localStorage.getItem(minimizedKey) === '1');
      setDismissed(localStorage.getItem(completedDismissedKey) === '1');
    } catch {}
    refresh();

    const poll = window.setInterval(refresh, 15000);
    const onFocus = () => refresh();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(poll);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [refresh, minimizedKey, completedDismissedKey]);

  useEffect(() => {
    refresh();
  }, [pathname, refresh]);

  const progress = useMemo(() => {
    if (!data?.total) return 0;
    return Math.round((data.completed / data.total) * 100);
  }, [data]);

  const toggleMinimized = () => {
    const next = !minimized;
    setMinimized(next);
    try { localStorage.setItem(minimizedKey, next ? '1' : '0'); } catch {}
  };

  const dismissCompleted = () => {
    setDismissed(true);
    try { localStorage.setItem(completedDismissedKey, '1'); } catch {}
  };

  if (loading || !data || (data.complete && dismissed)) return null;

  if (minimized) {
    return (
      <button
        type="button"
        onClick={toggleMinimized}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-3 rounded-full border border-emerald-200 bg-white px-4 py-3 text-left shadow-2xl shadow-slate-950/15 transition hover:-translate-y-0.5 dark:border-emerald-400/20 dark:bg-slate-900 sm:bottom-6 sm:right-6"
        aria-label="Open getting started checklist"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-slate-950"><Rocket className="h-4 w-4" /></span>
        <span>
          <span className="block text-xs font-bold uppercase tracking-[.12em] text-emerald-700 dark:text-emerald-300">Get to first value</span>
          <span className="block text-sm font-semibold text-slate-900 dark:text-white">{data.completed}/{data.total} complete</span>
        </span>
        <ChevronUp className="h-4 w-4 text-slate-400" />
      </button>
    );
  }

  return (
    <aside className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-white/10 dark:bg-[#0d1726] sm:bottom-6 sm:left-auto sm:right-6 sm:w-[390px] sm:translate-x-0" aria-label="Getting started checklist">
      <div className="border-b border-slate-100 bg-slate-950 px-4 py-4 text-white dark:border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-slate-950"><Rocket className="h-5 w-5" /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-emerald-300">Get to first value</p>
              <h2 className="mt-1 text-base font-bold">One client → one paid invoice</h2>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={toggleMinimized} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Minimize checklist"><ChevronDown className="h-4 w-4" /></button>
            {data.complete ? <button type="button" onClick={dismissCompleted} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Dismiss completed checklist"><X className="h-4 w-4" /></button> : null}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-400 transition-[width] duration-500" style={{ width: `${progress}%` }} /></div>
          <span className="text-xs font-semibold text-slate-300">{progress}%</span>
        </div>
      </div>

      <div className="max-h-[52vh] overflow-y-auto p-2">
        {data.steps.map((step, index) => (
          <Link
            key={step.key}
            href={step.href}
            onClick={() => setTimeout(refresh, 600)}
            className="group flex gap-3 rounded-2xl px-3 py-3 transition hover:bg-slate-50 dark:hover:bg-white/[.045]"
          >
            <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${step.done ? 'border-emerald-500 bg-emerald-500 text-slate-950' : 'border-slate-300 text-slate-400 dark:border-slate-600'}`}>
              {step.done ? <Check className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
            </span>
            <span className="min-w-0">
              <span className={`block text-sm font-semibold ${step.done ? 'text-slate-500 line-through dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>{index + 1}. {step.title}</span>
              <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{step.description}</span>
            </span>
          </Link>
        ))}
      </div>
      {data.complete ? <div className="border-t border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-400/10 dark:bg-emerald-400/[.08] dark:text-emerald-300">You reached the core loop: invoice → share → collect. Keep going with real clients.</div> : null}
    </aside>
  );
}
