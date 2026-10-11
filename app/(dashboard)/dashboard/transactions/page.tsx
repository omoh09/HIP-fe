import Link from 'next/link';
import { ArrowDownLeft, CheckCircle2, ChevronLeft, ChevronRight, Clock3, CreditCard, XCircle } from 'lucide-react';
import { getTransactions } from '../actions';
import { formatMoney } from '@/lib/currency';

type Transaction = {
  id: string;
  reference?: string;
  provider_reference?: string;
  provider?: string;
  status: 'pending' | 'success' | 'failed' | string;
  amount: number;
  currency?: string;
  platform_fee_amount?: number;
  net_amount?: number | null;
  created_at?: string;
  invoice?: {
    id?: string;
    invoice_number?: string;
    client_name?: string;
    client_email?: string;
  } | null;
};

type Meta = { current_page?: number; last_page?: number; per_page?: number; total?: number; from?: number | null; to?: number | null };

function money(amount: number, currency = 'NGN') { return formatMoney(amount, currency); }

export default async function TransactionsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const requestedPage = Math.max(1, Number.parseInt(params?.page || '1', 10) || 1);
  let transactions: Transaction[] = [];
  let meta: Meta = { current_page: requestedPage, last_page: 1, per_page: 25, total: 0, from: null, to: null };

  try {
    const response = await getTransactions({ per_page: 25, page: requestedPage });
    transactions = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
    if (response?.meta) meta = response.meta;
  } catch {
    transactions = [];
  }

  const currentPage = Number(meta.current_page || requestedPage);
  const lastPage = Math.max(1, Number(meta.last_page || 1));
  const total = Number(meta.total || transactions.length);
  const from = meta.from ?? (transactions.length ? (currentPage - 1) * Number(meta.per_page || 25) + 1 : 0);
  const to = meta.to ?? (transactions.length ? Number(from) + transactions.length - 1 : 0);

  return (
    <section className="page-container py-8 lg:py-10">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Payment ledger</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Transactions</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Every payment attempt is recorded here from the transaction ledger, including partial payments and the provider that processed them.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
        {transactions.length ? (
          <div className="divide-y divide-slate-100 dark:divide-white/10">
            {transactions.map((transaction) => {
              const success = transaction.status === 'success';
              const failed = transaction.status === 'failed';
              const Icon = success ? CheckCircle2 : failed ? XCircle : Clock3;
              const fee = Number(transaction.platform_fee_amount ?? 0);
              const net = transaction.net_amount == null ? Number(transaction.amount || 0) - fee : Number(transaction.net_amount);
              const currency = transaction.currency || 'NGN';

              return (
                <div key={transaction.id} className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,.8fr)_minmax(0,.8fr)] lg:items-center">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${success ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300' : failed ? 'bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300'}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900 dark:text-slate-100">{transaction.invoice?.client_name || 'Client payment'}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{transaction.invoice?.invoice_number || 'Invoice'} · {transaction.reference || transaction.provider_reference || 'Payment'}</p>
                    </div>
                  </div>

                  <div className="lg:text-right">
                    <p className="text-sm font-semibold capitalize text-slate-900 dark:text-slate-100">{transaction.provider || 'Provider'}</p>
                    <p className="mt-1 text-xs capitalize text-slate-500 dark:text-slate-400">{transaction.status}</p>
                    {transaction.created_at && <p className="mt-1 text-xs text-slate-400">{new Date(transaction.created_at).toLocaleString()}</p>}
                  </div>

                  <div className="lg:text-right">
                    <p className="font-semibold text-slate-950 dark:text-white">{money(Number(transaction.amount || 0), currency)}</p>
                    {success && (
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <p>Merchant share {money(net, currency)}</p>
                        {fee > 0 && <p>Platform fee {money(fee, currency)}</p>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <CreditCard className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
            <h2 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">No transactions yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">When a client starts or completes an invoice checkout, the payment activity will appear here.</p>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{total ? `Showing ${from}–${to} of ${total} transactions` : '0 transactions'}</p>
        <div className="flex items-center gap-2">
          <Link aria-disabled={currentPage <= 1} tabIndex={currentPage <= 1 ? -1 : 0} href={currentPage > 1 ? `/dashboard/transactions?page=${currentPage - 1}` : '#'} className={`inline-flex h-9 items-center rounded-lg border px-3 text-sm font-medium ${currentPage <= 1 ? 'pointer-events-none border-slate-200 text-slate-300 dark:border-white/10 dark:text-slate-600' : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5'}`}><ChevronLeft className="mr-1 h-4 w-4" />Previous</Link>
          <span className="px-2 text-sm font-medium text-slate-600 dark:text-slate-300">Page {currentPage} of {lastPage}</span>
          <Link aria-disabled={currentPage >= lastPage} tabIndex={currentPage >= lastPage ? -1 : 0} href={currentPage < lastPage ? `/dashboard/transactions?page=${currentPage + 1}` : '#'} className={`inline-flex h-9 items-center rounded-lg border px-3 text-sm font-medium ${currentPage >= lastPage ? 'pointer-events-none border-slate-200 text-slate-300 dark:border-white/10 dark:text-slate-600' : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5'}`}>Next<ChevronRight className="ml-1 h-4 w-4" /></Link>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
        <ArrowDownLeft className="mt-0.5 h-4 w-4 shrink-0" />
        Successful entries reconcile against the invoice balance. Merchant share is shown after the Hip Homorrd platform fee but before any provider processing or settlement fees. Pending and failed attempts remain visible for audit history.
      </div>
    </section>
  );
}
