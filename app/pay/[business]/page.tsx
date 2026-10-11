import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

/**
 * Backward-compatible handler for the old one-segment payment URL:
 *   /pay/{invoiceToken}
 *
 * The directory is intentionally named [business] so it can coexist with
 * /pay/[business]/[token] in Next.js. On this one-segment route the value is
 * treated as the legacy invoice token, then redirected to the canonical
 * business-branded URL.
 */
export default async function LegacyPaymentLink({
  params,
}: {
  params: Promise<{ business: string }>;
}) {
  const { business: token } = await params;
  const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, '');

  if (!baseUrl) {
    throw new Error('API_BASE_URL is not configured');
  }

  const response = await fetch(
    `${baseUrl}/api/v1/public/invoices/${encodeURIComponent(token)}`,
    {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    },
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error('Unable to load invoice');
  }

  const payload = await response.json();
  const invoice = payload?.data;
  const merchant = invoice?.merchant;
  const canonicalBusiness =
    merchant?.slug ||
    merchant?.username ||
    merchant?.name
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') ||
    'business';

  redirect(
    `/pay/${encodeURIComponent(canonicalBusiness)}/${encodeURIComponent(token)}`,
  );
}
