import { cache } from 'react';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import PaymentPageClient, { type PublicInvoice } from '@/components/payments/public-payment-client';

export const dynamic = 'force-dynamic';

const loadInvoice = cache(async (token: string): Promise<PublicInvoice | null> => {
  const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, '');
  if (!baseUrl) throw new Error('API_BASE_URL is not configured');

  const response = await fetch(`${baseUrl}/api/v1/public/invoices/${encodeURIComponent(token)}`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Unable to load invoice');

  const payload = await response.json();
  return payload?.data ?? null;
});

function businessSlug(invoice: PublicInvoice) {
  return invoice.merchant.slug || invoice.merchant.username || invoice.merchant.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'business';
}

export async function generateMetadata({ params }: { params: Promise<{ business: string; token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const invoice = await loadInvoice(token);
  if (!invoice) return { title: 'Invoice not found', robots: { index: false, follow: false } };

  return {
    title: `Pay invoice to ${invoice.merchant.name}`,
    description: `Review ${invoice.invoice_number} from ${invoice.merchant.name} and continue to secure payment.`,
    robots: { index: false, follow: false },
    openGraph: {
      title: `Invoice from ${invoice.merchant.name}`,
      description: `Review ${invoice.invoice_number} and pay securely.`,
      type: 'website',
    },
  };
}

export default async function PaymentPage({ params }: { params: Promise<{ business: string; token: string }> }) {
  const { business, token } = await params;
  const invoice = await loadInvoice(token);
  if (!invoice) notFound();

  const canonicalBusiness = businessSlug(invoice);
  if (business !== canonicalBusiness) {
    redirect(`/pay/${encodeURIComponent(canonicalBusiness)}/${encodeURIComponent(token)}`);
  }

  return <PaymentPageClient initialInvoice={invoice} />;
}
