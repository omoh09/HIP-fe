'use client';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted'|'dismissed' }> };
export default function PwaInstallButton() {
  const [event, setEvent] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setInstalled(standalone);
    const before = (e: Event) => { e.preventDefault(); setEvent(e as InstallEvent); };
    const done = () => { setInstalled(true); setEvent(null); };
    window.addEventListener('beforeinstallprompt', before); window.addEventListener('appinstalled', done);
    return () => { window.removeEventListener('beforeinstallprompt', before); window.removeEventListener('appinstalled', done); };
  }, []);
  if (!event || installed) return null;
  return <button type="button" onClick={async () => { await event.prompt(); const choice = await event.userChoice; if (choice.outcome === 'accepted') setEvent(null); }} className="hidden items-center rounded-xl border border-slate-200 bg-white/70 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 lg:inline-flex dark:border-white/10 dark:bg-white/5 dark:text-slate-200"><Download className="mr-1.5 h-3.5 w-3.5" />Install</button>;
}
