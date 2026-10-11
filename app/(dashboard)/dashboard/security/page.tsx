'use client';

import { LockKeyhole, LogOut, ShieldCheck } from 'lucide-react';
import { useUser } from '@/app/context/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function SecurityPage() {
  const { logout } = useUser();
  return <section className="page-container py-8 lg:py-10"><div className="mb-8"><p className="text-sm font-medium text-emerald-700">Settings</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Security</h1><p className="mt-2 text-sm text-slate-500">Manage the security of your Hip Homorrd session.</p></div><div className="grid max-w-3xl gap-5"><Card className="border-slate-200 shadow-sm"><CardHeader><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><ShieldCheck className="h-5 w-5" /></span><div><h2 className="font-semibold text-slate-950">Authentication</h2><p className="text-sm text-slate-500">Your login session is stored in an HTTP-only cookie.</p></div></div></CardHeader><CardContent><div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600"><p className="font-medium text-slate-900">Session protection</p><p className="mt-1 leading-6">The browser cannot directly read the authentication token. Requests to protected backend operations are made server-side by the Next.js application.</p></div></CardContent></Card><Card className="border-red-200 shadow-sm"><CardHeader><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-700"><LockKeyhole className="h-5 w-5" /></span><div><h2 className="font-semibold text-slate-950">Sign out</h2><p className="text-sm text-slate-500">End your current session on this device.</p></div></div></CardHeader><CardContent><Button variant="outline" onClick={logout} className="border-red-200 text-red-700 hover:bg-red-50"><LogOut className="mr-2 h-4 w-4" />Sign out</Button></CardContent></Card></div></section>;
}
