import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock3, FileText, Plus, AlertTriangle, type LucideIcon, Coins } from 'lucide-react';
import { getInvoices, getMarketSettings } from './actions';
import { mapInvoiceResponse } from '@/app/utils/mapInvoice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { InvoiceData } from '@/components/invoice/types';
import { formatMoney } from '@/lib/currency';

function statusLabel(status: string) {
  return status === 'partial' || status === 'partially_paid' ? 'Partially paid' : status.charAt(0).toUpperCase() + status.slice(1);
}

function statusClass(status: string) {
  if (status === 'paid') return 'bg-emerald-50 text-emerald-700';
  if (status === 'overdue') return 'bg-red-50 text-red-700';
  if (status === 'partial' || status === 'partially_paid') return 'bg-blue-50 text-blue-700';
  return 'bg-amber-50 text-amber-700';
}

type CurrencyTotals = { currency: string; invoiced: number; collected: number; outstanding: number; overdue: number; count: number };

function groupByCurrency(invoices: InvoiceData[]): CurrencyTotals[] {
  const map = new Map<string, CurrencyTotals>();
  for (const invoice of invoices) {
    const currency = (invoice.currency || 'NGN').toUpperCase();
    const current = map.get(currency) || { currency, invoiced: 0, collected: 0, outstanding: 0, overdue: 0, count: 0 };
    current.invoiced += Number(invoice.amount ?? 0);
    current.collected += Number(invoice.amountPaid ?? 0);
    current.outstanding += Number(invoice.amountDue ?? 0);
    if (invoice.status === 'overdue') current.overdue += Number(invoice.amountDue ?? 0);
    current.count += 1;
    map.set(currency, current);
  }
  return [...map.values()];
}

export default async function DashboardPage() {
  let invoices: InvoiceData[] = [];
  let loadError = '';
  let baseCurrency = 'NGN';
  let marketName = 'Nigeria';

  try {
    const [invoiceResponse, marketResponse] = await Promise.all([getInvoices(), getMarketSettings()]);
    invoices = mapInvoiceResponse(invoiceResponse);
    baseCurrency = marketResponse?.data?.base_currency || 'NGN';
    marketName = marketResponse?.data?.market?.name || 'Nigeria';
  } catch (error) {
    loadError = error instanceof Error ? error.message : 'Unable to load dashboard data';
  }

  const grouped = groupByCurrency(invoices);
  const base = grouped.find((group) => group.currency === baseCurrency) || { currency: baseCurrency, invoiced: 0, collected: 0, outstanding: 0, overdue: 0, count: 0 };
  const otherCurrencies = grouped.filter((group) => group.currency !== baseCurrency);
  const paidCount = invoices.filter((invoice) => invoice.status === 'paid').length;
  const recent = [...invoices].slice(0, 6);

  return (
    <section className="page-container py-8 lg:py-10">
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-emerald-700">Your workspace · {marketName}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Good morning</h1>
          <p className="mt-2 max-w-2xl text-slate-500">Your main dashboard reports in {baseCurrency}. Foreign-currency invoices stay separate so your numbers are not distorted by an assumed exchange rate.</p>
        </div>
        <Button asChild className="w-full bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto">
          <Link href="/dashboard/invoices/new"><Plus className="mr-2 h-4 w-4" />Create invoice</Link>
        </Button>
      </div>

      {loadError ? (
        <Card className="mb-6 border-red-200 bg-red-50"><CardContent className="flex items-start gap-3 p-5 text-red-800"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="font-semibold">We could not load your dashboard.</p><p className="mt-1 text-sm">Refresh the page or try again shortly.</p></div></CardContent></Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CheckCircle2} label={`Collected · ${baseCurrency}`} value={formatMoney(base.collected, baseCurrency)} helper={`${paidCount} fully paid invoice${paidCount === 1 ? '' : 's'} across all currencies`} tone="emerald" />
        <StatCard icon={Clock3} label={`Outstanding · ${baseCurrency}`} value={formatMoney(base.outstanding, baseCurrency)} helper="Balance still to collect in base currency" tone="blue" />
        <StatCard icon={AlertTriangle} label={`Overdue · ${baseCurrency}`} value={formatMoney(base.overdue, baseCurrency)} helper="Base-currency balance needing follow-up" tone="red" />
        <StatCard icon={FileText} label="Invoices" value={String(invoices.length)} helper={`${grouped.length || 1} invoice currenc${grouped.length === 1 ? 'y' : 'ies'} in use`} tone="slate" />
      </div>

      {otherCurrencies.length > 0 && (
        <Card className="mt-5 border-slate-200 shadow-sm">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Coins className="h-5 w-5" /></span><div><h2 className="font-semibold text-slate-950">Other currencies</h2><p className="mt-1 text-sm text-slate-500">Kept separate from {baseCurrency}; no hidden FX conversion is applied.</p></div></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{otherCurrencies.map((group) => <div key={group.currency} className="rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{group.currency}</p><span className="text-xs text-slate-400">{group.count} invoice{group.count === 1 ? '' : 's'}</span></div><p className="mt-3 text-lg font-bold text-slate-950">{formatMoney(group.collected, group.currency)} collected</p><p className="mt-1 text-sm text-slate-600">{formatMoney(group.outstanding, group.currency)} outstanding</p></div>)}</div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 className="font-semibold text-slate-950">Recent invoices</h2><p className="text-sm text-slate-500">Amounts stay in the currency each invoice was issued in.</p></div><Link href="/dashboard/invoices" className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800">View all <ArrowRight className="ml-1 h-4 w-4" /></Link></div>
          {recent.length ? <div className="divide-y divide-slate-100">{recent.map((invoice) => <Link key={invoice.reference || invoice.invoiceNumber} href="/dashboard/invoices" className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50 sm:px-6"><div className="min-w-0"><p className="truncate font-medium text-slate-900">{invoice.clientName || 'Unnamed client'}</p><p className="mt-1 text-xs text-slate-500">{invoice.invoiceNumber || 'Invoice'} · {invoice.dueDate ? `Due ${invoice.dueDate}` : 'No due date'}</p></div><div className="text-right"><p className="font-semibold text-slate-900">{formatMoney(Number(invoice.amount ?? 0), invoice.currency)}</p><span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(invoice.status)}`}>{statusLabel(invoice.status)}</span></div></Link>)}</div> : <div className="px-6 py-16 text-center"><FileText className="mx-auto h-10 w-10 text-slate-300" /><h3 className="mt-4 font-semibold text-slate-900">No invoices yet</h3><p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">Create your first invoice in NGN or another supported currency.</p><Button asChild className="mt-5 bg-emerald-600 hover:bg-emerald-700"><Link href="/dashboard/invoices/new">Create your first invoice</Link></Button></div>}
        </Card>
        <Card className="border-slate-200 shadow-sm"><CardContent className="p-6"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><CheckCircle2 className="h-5 w-5" /></div><h2 className="mt-5 text-lg font-semibold text-slate-950">Invoice locally. Sell globally.</h2><p className="mt-2 text-sm leading-6 text-slate-500">Keep your workspace in {baseCurrency}, then choose a client-facing currency invoice by invoice. Online payment availability follows the connected provider and merchant market.</p><div className="mt-6 space-y-3 text-sm text-slate-700"><p>✓ Nigerian Naira by default</p><p>✓ African currencies supported</p><p>✓ USD, GBP, EUR, PHP and more</p></div><Link href="/dashboard/settings/market" className="mt-6 inline-flex items-center font-semibold text-emerald-700">Manage currencies <ArrowRight className="ml-1 h-4 w-4" /></Link></CardContent></Card>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, label, value, helper, tone }: { icon: LucideIcon; label: string; value: string; helper: string; tone: 'emerald' | 'blue' | 'red' | 'slate' }) {
  const styles = { emerald: 'bg-emerald-50 text-emerald-700', blue: 'bg-blue-50 text-blue-700', red: 'bg-red-50 text-red-700', slate: 'bg-slate-100 text-slate-700' }[tone];
  return <Card className="border-slate-200 shadow-sm"><CardContent className="p-5"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{value}</p></div><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles}`}><Icon className="h-5 w-5" /></span></div><p className="mt-3 text-xs text-slate-500">{helper}</p></CardContent></Card>;
}
