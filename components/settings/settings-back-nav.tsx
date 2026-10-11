'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function SettingsBackNav() {
  const pathname = usePathname();
  const onRoot = pathname === '/dashboard/settings';
  const href = onRoot ? '/dashboard' : '/dashboard/settings';
  const label = onRoot ? 'Back to dashboard' : 'Back to settings';

  return (
    <div className="page-container pt-6">
      <Link href={href} className="inline-flex items-center rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white">
        <ArrowLeft className="mr-1.5 h-4 w-4" />{label}
      </Link>
    </div>
  );
}
