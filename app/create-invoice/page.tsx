import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import ClientInvoice from '@/app/(dashboard)/dashboard/invoices/new/client-page';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { defaultCurrencyForCountry } from '@/lib/markets';

export const metadata: Metadata = {
  title: 'Create an invoice online',
  description: 'Try the Hip Homorrd invoice builder before creating an account. Add client details, line items, tax and branding, then sign in only when you are ready to save or share.',
  alternates: { canonical: '/create-invoice' },
};

export default async function CreateInvoicePage({ searchParams }: { searchParams: Promise<{ resume?: string }> }) {
  const params = await searchParams;
  const hasAuthCookie = Boolean((await cookies()).get('auth')?.value);
  const requestHeaders = await headers();
  const defaultCurrency = defaultCurrencyForCountry(requestHeaders.get('x-vercel-ip-country') || requestHeaders.get('cf-ipcountry') || 'NG');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <div className="border-b border-emerald-100 bg-emerald-50/70">
        <div className="page-container flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 text-sm text-emerald-950">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <p><strong>Try everything first.</strong> Build and preview your invoice now. Your draft stays on this device, and we only ask you to sign in when you are ready to save, download or share it.</p>
          </div>
          {!hasAuthCookie && <Link href="/sign-in?next=%2Fcreate-invoice" className="shrink-0 text-sm font-semibold text-emerald-800 hover:text-emerald-950">Already have an account? Sign in →</Link>}
        </div>
      </div>
      <ClientInvoice initialData={{ currency: defaultCurrency }} publicMode isAuthenticated={hasAuthCookie} resuming={hasAuthCookie && params.resume === '1'} />
      <SiteFooter />
    </div>
  );
}
