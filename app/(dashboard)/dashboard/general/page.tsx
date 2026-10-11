'use client';

import { useUser } from '@/app/context/UserContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function GeneralPage() {
  const { user, isLoading } = useUser();
  return <section className="page-container py-8 lg:py-10"><div className="mb-8"><p className="text-sm font-medium text-emerald-700">Settings</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Profile</h1><p className="mt-2 text-sm text-slate-500">Your account information.</p></div><Card className="max-w-2xl border-slate-200 shadow-sm"><CardHeader><h2 className="font-semibold text-slate-950">Account information</h2></CardHeader><CardContent className="grid gap-5 sm:grid-cols-2"><Info label="Name" value={isLoading ? 'Loading…' : user?.name || 'Not provided'} /><Info label="Email" value={isLoading ? 'Loading…' : user?.email || 'Not available'} /><Info label="Role" value={user?.role || '—'} /><Info label="Account ID" value={user?.id ? String(user.id) : '—'} /></CardContent></Card></section>;
}
function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 font-medium text-slate-900">{value}</p></div>; }
