'use client';

import { ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { InvoiceData } from './types';
import { formatMoney } from '@/lib/currency';

export default function InvoicePayNow({
  invoice,
  total,
  currency,
}: {
  invoice: InvoiceData;
  total: number;
  currency: string;
  onPaymentSuccess?: (updatedInvoice: InvoiceData) => void;
}) {
  if (invoice.status === 'paid' || total <= 0) return null;

  const paymentLink = invoice.paymentLink || invoice.payment_link || invoice.publicUrl || invoice.public_url || '';

  if (!paymentLink) {
    return (
      <div className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Payment collection</p>
        <p className="mt-1 text-sm font-medium text-slate-900">A dedicated payment link is created when this invoice is saved.</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Balance due</p>
          <p className="mt-1 text-xl font-bold text-slate-950">
            {formatMoney(Number(total), currency)}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-800/70"><ShieldCheck className="h-3.5 w-3.5" />Provider choices are handled on the secure client payment page.</p>
        </div>
        <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-700">
          <a href={paymentLink} target="_blank" rel="noreferrer">Open payment page <ExternalLink className="ml-2 h-4 w-4" /></a>
        </Button>
      </div>
    </div>
  );
}
