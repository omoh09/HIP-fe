'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BadgeCheck, CreditCard, ShieldCheck, X } from 'lucide-react';

const trustPoints = [
  { icon: CreditCard, title: 'Provider-managed payments', text: 'Payment credentials stay with supported payment providers—not inside Hip Homorrd.' },
  { icon: ShieldCheck, title: 'A live financial record', text: 'Confirmed payments, remaining balances and transaction history stay attached to the invoice.' },
  { icon: BadgeCheck, title: 'Verified-payment reviews', text: 'Public review proof can only begin from a real fully paid invoice workflow.' },
];

export default function TrustPeel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute right-0 top-0 z-20 hidden lg:block">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="trust-peel-trigger group relative h-28 w-28 overflow-hidden text-left"
        aria-label="Why businesses can trust Hip Homorrd"
      >
        <span className="trust-peel-fold" />
        <span className="absolute right-2 top-4 w-20 -rotate-45 text-center text-[10px] font-black uppercase tracking-[.12em] text-emerald-950">Why trust us?</span>
      </button>

      {open ? (
        <div className="absolute right-5 top-16 w-[360px] rounded-[24px] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/20 dark:border-white/10 dark:bg-[#0d1726]">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-black uppercase tracking-[.15em] text-emerald-700 dark:text-emerald-300">Trust, before the first invoice</p><h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white">Your client relationship stays connected without pretending Hip Homorrd is the bank.</h2></div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white" aria-label="Close trust panel"><X className="h-4 w-4" /></button>
          </div>
          <div className="mt-5 space-y-4">
            {trustPoints.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"><Icon className="h-4 w-4" /></span><div><p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{text}</p></div></div>)}
          </div>
          <div className="mt-5 flex gap-4 border-t border-slate-100 pt-4 text-xs font-bold dark:border-white/10"><Link href="/privacy" className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-300">Privacy</Link><Link href="/terms" className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-300">Terms</Link><Link href="/about" className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-300">About Hip Homorrd</Link></div>
        </div>
      ) : null}
    </div>
  );
}
