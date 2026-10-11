'use client';

import Link from 'next/link';
import { ChevronRight, LockKeyhole, UserRound, ShieldCheck, Palette, WalletCards, Globe2, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function SettingsPage() {
  const items = [
    { href: '/dashboard/general', icon: UserRound, title: 'Profile', text: 'Manage your name and account details.' },
    { href: '/dashboard/settings/branding', icon: Palette, title: 'Branding', text: 'Upload the logo that appears on your invoices.' },
    { href: '/dashboard/settings/market', icon: Globe2, title: 'Market & currency', text: 'Set your business country, dashboard currency and local pricing market.' },
    { href: '/dashboard/settings/billing', icon: Crown, title: 'Plan & billing', text: 'Manage your Hip Homorrd subscription, entitlements and renewal.' },
    { href: '/dashboard/settings/payments', icon: WalletCards, title: 'Payment collection', text: 'Connect settlement accounts and payment providers for client payments.' },
    { href: '/dashboard/security', icon: LockKeyhole, title: 'Security', text: 'Review password and account security settings.' },
  ];

  return <section className="page-container py-8 lg:py-10"><div className="mb-8"><p className="text-sm font-medium text-emerald-700">Workspace</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Settings</h1><p className="mt-2 text-sm text-slate-500">Manage your account and security preferences.</p></div><div className="grid max-w-3xl gap-4">{items.map(({ href, icon: Icon, title, text }) => <Link key={href} href={href}><Card className="border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"><CardContent className="flex items-center gap-4 p-5"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><Icon className="h-5 w-5" /></span><div className="flex-1"><h2 className="font-semibold text-slate-950">{title}</h2><p className="mt-1 text-sm text-slate-500">{text}</p></div><ChevronRight className="h-5 w-5 text-slate-400" /></CardContent></Card></Link>)}<div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-900"><div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" /><p>Payment processing is handled by the connected payment backend. Keep your account credentials private and use only the official payment flow.</p></div></div></div></section>;
}
