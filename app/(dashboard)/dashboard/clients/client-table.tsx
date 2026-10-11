'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { Archive, ChevronLeft, ChevronRight, Plus, UserPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { archiveClient, createClient } from '../actions';
import { showToast } from '@/lib/toast';
import Link from 'next/link';
import { formatMoney } from '@/lib/currency';

type Client = {
  id: string | number;
  client_name: string;
  client_email: string;
  phone?: string | null;
  invoice_count: number;
  total_paid: number;
  total_outstanding?: number;
  preferred_currency?: string;
  balances_by_currency?: { currency: string; paid: number; outstanding: number; invoice_count: number }[];
  last_paid_at: string | null;
  archived?: boolean;
};

type PlanUsage = {
  plan?: { code: string; name: string; active_client_limit?: number; platform_fee_percent?: number };
  clients?: { used: number; limit: number | null; remaining: number | null; unlimited: boolean };
};

const EMPTY_CLIENT = { name: '', email: '', phone: '' };

export default function ClientTable({ clients = [], usage = null }: { clients?: Client[]; usage?: PlanUsage | null }) {
  const [clientList, setClientList] = useState<Client[]>(Array.isArray(clients) ? clients : []);
  const [localUsage, setLocalUsage] = useState<PlanUsage | null>(usage);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'total_paid'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [newClient, setNewClient] = useState(EMPTY_CLIENT);
  const [isPending, startTransition] = useTransition();
  const clientsPerPage = 25;

  // router.refresh() delivers new server props after an archive/create; keep the
  // local optimistic copy in sync with those authoritative props.
  useEffect(() => setClientList(Array.isArray(clients) ? clients : []), [clients]);
  useEffect(() => setLocalUsage(usage), [usage]);

  const clientUsage = localUsage?.clients;
  const atLimit = Boolean(clientUsage && !clientUsage.unlimited && Number(clientUsage.remaining ?? 0) <= 0);

  const filteredClients = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return clientList;
    return clientList.filter((client) => (client.client_name || '').toLowerCase().includes(q) || (client.client_email || '').toLowerCase().includes(q));
  }, [clientList, search]);

  const sortedClients = useMemo(() => [...filteredClients].sort((a, b) => sortBy === 'name'
    ? (a.client_name || '').localeCompare(b.client_name || '')
    : Number(b.total_paid || 0) - Number(a.total_paid || 0)), [filteredClients, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedClients.length / clientsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * clientsPerPage;
  const paginatedClients = sortedClients.slice(startIndex, startIndex + clientsPerPage);

  const totalsByCurrency = useMemo(() => {
    const map = new Map<string, { paid: number; outstanding: number }>();
    filteredClients.forEach((client) => {
      const balances = client.balances_by_currency?.length
        ? client.balances_by_currency
        : [{ currency: client.preferred_currency || 'NGN', paid: client.total_paid || 0, outstanding: client.total_outstanding || 0, invoice_count: client.invoice_count || 0 }];
      balances.forEach((balance) => {
        const current = map.get(balance.currency) || { paid: 0, outstanding: 0 };
        current.paid += Number(balance.paid || 0);
        current.outstanding += Number(balance.outstanding || 0);
        map.set(balance.currency, current);
      });
    });
    return [...map.entries()].map(([currency, values]) => ({ currency, ...values }));
  }, [filteredClients]);

  const handleArchive = (client: Client) => {
    startTransition(async () => {
      try {
        const response = await archiveClient(client.id);
        setClientList((current) => current.filter((item) => String(item.id) !== String(client.id)));
        if (response?.usage) setLocalUsage(response.usage);
        setCurrentPage(1);
        showToast(`${client.client_name} archived. The client slot is available again.`, 'success');
      } catch (error: any) {
        showToast(error?.message || 'Unable to archive client.', 'error');
      }
    });
  };

  const submitClient = () => {
    if (!newClient.name.trim()) return showToast('Client name is required.', 'error');
    if (newClient.email && !/^\S+@\S+\.\S+$/.test(newClient.email)) return showToast('Enter a valid email address.', 'error');
    startTransition(async () => {
      try {
        const response = await createClient({ name: newClient.name.trim(), email: newClient.email.trim() || undefined, phone: newClient.phone.trim() || undefined });
        const raw = response?.data;
        if (raw) {
          const created: Client = {
            id: raw.id,
            client_name: raw.client_name ?? raw.name ?? newClient.name,
            client_email: raw.client_email ?? raw.email ?? newClient.email,
            phone: raw.phone ?? newClient.phone,
            invoice_count: Number(raw.invoice_count ?? 0),
            total_paid: Number(raw.total_paid ?? 0),
            total_outstanding: Number(raw.total_outstanding ?? 0),
            preferred_currency: raw.preferred_currency ?? 'NGN',
            balances_by_currency: raw.balances_by_currency ?? [],
            last_paid_at: raw.last_paid_at ?? null,
          };
          setClientList((current) => [created, ...current.filter((item) => String(item.id) !== String(created.id))]);
        }
        if (response?.usage) setLocalUsage(response.usage);
        setNewClient(EMPTY_CLIENT);
        setCreateOpen(false);
        setCurrentPage(1);
        showToast('Client created.', 'success');
      } catch (error: any) {
        showToast(error?.message || 'Unable to create client.', 'error');
      }
    });
  };

  return (
    <section className="page-container min-w-0 space-y-6 py-8 lg:py-10">
      {clientUsage && <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">{localUsage?.plan?.name ?? 'Free'} plan</p><h1 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">Know every client. Know what they owe.</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{clientUsage.unlimited ? `${clientUsage.used} active clients · unlimited capacity` : `${clientUsage.used} of ${clientUsage.limit} active client slots used`}</p></div>
          <div className="flex flex-wrap gap-2">
            {atLimit ? <Link href="/pricing" className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300">Upgrade capacity</Link> : <Button onClick={() => setCreateOpen(true)} className="bg-emerald-600 text-white hover:bg-emerald-700"><UserPlus className="mr-2 h-4 w-4" />Add client</Button>}
          </div>
        </div>
        {!clientUsage.unlimited && clientUsage.limit ? <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, (clientUsage.used / clientUsage.limit) * 100)}%` }} /></div> : null}
      </div>}

      {!clientUsage && <div className="flex justify-end"><Button onClick={() => setCreateOpen(true)} className="bg-emerald-600 text-white hover:bg-emerald-700"><Plus className="mr-2 h-4 w-4" />Add client</Button></div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"><CardHeader><CardTitle>Total Clients</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold">{filteredClients.length}</p></CardContent></Card>
        <Card className="border-slate-200 bg-white sm:col-span-2 dark:border-white/10 dark:bg-slate-900"><CardHeader><CardTitle>Client money by currency</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-3">{totalsByCurrency.length ? totalsByCurrency.map((total) => <div key={total.currency} className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{total.currency}</p><p className="mt-1 font-semibold text-slate-950 dark:text-white">{formatMoney(total.paid, total.currency)} paid</p><p className="mt-1 text-xs text-amber-700 dark:text-amber-300">{formatMoney(total.outstanding, total.currency)} outstanding</p></div>) : <p className="text-sm text-slate-500 dark:text-slate-400">No invoice balances yet.</p>}</CardContent></Card>
      </div>

      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <Input placeholder="Search client name or email" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="w-full lg:max-w-md" />
        <select value={sortBy} onChange={(e) => { setSortBy(e.target.value as 'name' | 'total_paid'); setCurrentPage(1); }} className="field w-full lg:w-auto"><option value="name">Sort by Name</option><option value="total_paid">Sort by Total Paid</option></select>
      </div>

      <div className="grid gap-3 md:hidden">
        {paginatedClients.map((client) => <Card key={String(client.id)} className="border-slate-200 dark:border-white/10 dark:bg-slate-900"><CardContent className="p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-slate-950 dark:text-white">{client.client_name}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{client.client_email || 'No email'}</p></div><button disabled={isPending} onClick={() => handleArchive(client)} className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"><Archive className="mr-1.5 h-3.5 w-3.5" />Archive</button></div><div className="mt-4 grid grid-cols-2 gap-2 text-xs"><div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800"><span className="text-slate-400">Paid</span><p className="mt-1 font-semibold text-slate-900 dark:text-white">{formatMoney(Number(client.total_paid || 0), client.preferred_currency || 'NGN')}</p></div><div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800"><span className="text-slate-400">Outstanding</span><p className="mt-1 font-semibold text-amber-700 dark:text-amber-300">{formatMoney(Number(client.total_outstanding || 0), client.preferred_currency || 'NGN')}</p></div></div></CardContent></Card>)}
        {!paginatedClients.length && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400">No clients found.</div>}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900 md:block">
        <table className="min-w-full text-sm"><thead className="bg-slate-100 dark:bg-slate-800"><tr><th className="px-4 py-3 text-left">S/N</th><th className="px-4 py-3 text-left">Client</th><th className="px-4 py-3 text-left">Email</th><th className="px-4 py-3 text-right">Invoices</th><th className="px-4 py-3 text-right">Total Paid</th><th className="px-4 py-3 text-right">Outstanding</th><th className="px-4 py-3 text-right">Manage</th></tr></thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/10">{paginatedClients.map((client, index) => <tr key={String(client.id)} className="hover:bg-slate-50 dark:hover:bg-white/[.03]"><td className="px-4 py-3">{startIndex + index + 1}</td><td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{client.client_name}</td><td className="px-4 py-3 text-slate-600 dark:text-slate-400">{client.client_email}</td><td className="px-4 py-3 text-right">{client.invoice_count}</td><td className="px-4 py-3 text-right font-semibold">{formatMoney(Number(client.total_paid || 0), client.preferred_currency || 'NGN')}</td><td className="px-4 py-3 text-right font-semibold text-amber-700 dark:text-amber-300">{formatMoney(Number(client.total_outstanding || 0), client.preferred_currency || 'NGN')}</td><td className="px-4 py-3 text-right"><button disabled={isPending} onClick={() => handleArchive(client)} className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"><Archive className="mr-1.5 h-3.5 w-3.5" />Archive</button></td></tr>)}</tbody></table>
      </div>

      <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between"><span>Showing {sortedClients.length ? startIndex + 1 : 0}–{Math.min(startIndex + clientsPerPage, sortedClients.length)} of {sortedClients.length}</span><div className="flex items-center gap-2"><Button variant="outline" disabled={safePage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}><ChevronLeft /></Button><span>Page {safePage} of {totalPages}</span><Button variant="outline" disabled={safePage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}><ChevronRight /></Button></div></div>

      {createOpen && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !isPending) setCreateOpen(false); }}><div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">New client</p><h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">Add to your client workspace</h2></div><button type="button" onClick={() => setCreateOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"><X className="h-5 w-5" /></button></div><div className="mt-6 space-y-4"><label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Client name *</span><input className="field" value={newClient.name} onChange={(e) => setNewClient((c) => ({ ...c, name: e.target.value }))} autoFocus /></label><label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Email</span><input type="email" className="field" value={newClient.email} onChange={(e) => setNewClient((c) => ({ ...c, email: e.target.value }))} /></label><label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">WhatsApp / phone</span><input className="field" value={newClient.phone} onChange={(e) => setNewClient((c) => ({ ...c, phone: e.target.value }))} /></label></div><div className="mt-6 flex justify-end gap-2"><Button variant="outline" disabled={isPending} onClick={() => setCreateOpen(false)}>Cancel</Button><Button disabled={isPending || !newClient.name.trim()} onClick={submitClient} className="bg-emerald-600 text-white hover:bg-emerald-700">{isPending ? 'Creating…' : 'Create client'}</Button></div></div></div>}
    </section>
  );
}
