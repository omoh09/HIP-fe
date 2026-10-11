'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from '@/components/theme/theme-toggle';
import PwaInstallButton from '@/components/pwa/pwa-install-button';

const groups = [
  { label: 'Product', links: [['Overview','/features'],['Invoice generator','/invoice-generator'],['Online invoicing','/online-invoicing'],['WhatsApp invoicing','/whatsapp-invoicing'],['Payments','/payments'],['Shop add-on','/shop-addon']] },
  { label: 'Solutions', links: [['Freelancers','/for-freelancers'],['Consultants','/solutions/consultants'],['Designers & creatives','/solutions/designers-creatives'],['Developers','/solutions/developers'],['Agencies','/solutions/agencies'],['Contractors','/solutions/contractors']] },
  { label: 'Resources', links: [['Guides','/guides'],['Verified reviews','/reviews'],['Insights','/blog'],['About','/about'],['Contact','/contact']] },
];

export default function SiteHeader() {
  const pathname = usePathname(); const [open,setOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#07111f]/85">
    <div className="page-container flex h-[70px] items-center justify-between gap-4">
      <Link href="/" className="flex shrink-0 items-center gap-2.5 font-bold tracking-tight text-slate-950 dark:text-white"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-sm font-black text-[#07111f] shadow-sm">H</span><span>Hip Homorrd</span></Link>
      <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
        {groups.map(group => <div key={group.label} className="group relative"><button type="button" className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white">{group.label}<ChevronDown className="h-3.5 w-3.5" /></button><div className="invisible absolute left-0 top-full w-64 translate-y-2 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-2xl transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 dark:border-white/10 dark:bg-slate-950">{group.links.map(([label,href]) => <Link key={href} href={href} className={`block rounded-xl px-3 py-2.5 text-sm ${pathname === href ? 'bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'}`}>{label}</Link>)}</div></div>)}
        <Link href="/pricing" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white">Pricing</Link>
      </nav>
      <div className="hidden items-center gap-2 md:flex"><PwaInstallButton /><ThemeToggle /><Link href="/sign-in" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5">Sign in</Link><Link href="/create-invoice" className="inline-flex items-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-[#07111f] shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-400">Create invoice <ArrowRight className="ml-2 h-4 w-4" /></Link></div>
      <div className="flex items-center gap-2 md:hidden"><ThemeToggle /><button type="button" className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5" onClick={() => setOpen(v => !v)} aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button></div>
    </div>
    {open && <div className="border-t border-slate-200 bg-white dark:border-white/10 dark:bg-[#07111f] md:hidden"><nav className="page-container max-h-[calc(100vh-4.5rem)] overflow-y-auto py-3">{groups.map(group => <details key={group.label} className="border-b border-slate-100 py-1 dark:border-white/10"><summary className="cursor-pointer list-none rounded-lg px-3 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100">{group.label}</summary><div className="pb-2 pl-3">{group.links.map(([label,href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5">{label}</Link>)}</div></details>)}<Link href="/pricing" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100">Pricing</Link><div className="grid grid-cols-2 gap-2 py-4"><Link href="/sign-in" className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold dark:border-white/10">Sign in</Link><Link href="/create-invoice" className="rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-bold text-[#07111f]">Create invoice</Link></div></nav></div>}
  </header>;
}
