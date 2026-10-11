'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Bitcoin,
  Check,
  CheckCircle2,
  CreditCard,
  Loader2,
  LockKeyhole,
  ReceiptText,
  ShieldCheck,
  Star,
  MessageSquareText,
  WalletCards,
  Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CURRENCY_SYMBOLS, SUPPORTED_CURRENCIES, formatMoney } from '@/lib/currency';

export type PublicInvoice = {
  token: string;
  invoice_number: string;
  description?: string | null;
  currency: string;
  status: string;
  total_amount: number;
  amount_paid: number;
  amount_due: number;
  overpaid_amount?: number;
  due_date?: string | null;
  created_at?: string | null;
  client: { name: string; email: string };
  merchant: {
    name: string;
    username?: string | null;
    slug?: string | null;
    logo_url?: string | null;
    average_rating?: number | null;
    review_count?: number;
    recent_reviews?: Array<{ id: string; rating: number; comment: string; reviewer_name: string; verified: boolean; published_at?: string | null }>;
  };
  items: Array<{
    id?: number | string;
    name: string;
    description?: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
  payment_providers: Array<{ key: string; label: string }>;
  payment_enabled: boolean;
  payment_features?: { partial_payments?: boolean };
  review?: { can_submit: boolean; submitted: boolean; status?: string | null; is_public?: boolean };
};

function money(value: number, currency: string) {
  return formatMoney(value, currency);
}

function providerDescription(key: string) {
  if (key === 'paystack') return 'Card, bank, transfer and other methods enabled by Paystack.';
  if (key === 'stripe') return 'Continue to Stripe Checkout to choose an available payment method.';
  if (key === 'moonpay_commerce') return 'Pay with Bitcoin, USDC, ETH or other supported crypto through Hip Homorrd’s managed MoonPay Commerce rail.';
  if (key === 'hip_crypto') return 'Pay to a unique Hip-controlled transaction wallet. Hip confirms the blockchain payment, reconciles it, deducts the platform fee and settles the business to its whitelisted wallet.';
  if (key === 'mtn_momo') return 'Approve the payment from your MTN MoMo wallet. Hip Homorrd verifies it before updating the invoice.';
  return 'Continue securely with this payment provider.';
}

export default function PaymentPageClient({ initialInvoice }: { initialInvoice: PublicInvoice }) {
  const [invoice, setInvoice] = useState(initialInvoice);
  const [provider, setProvider] = useState(initialInvoice.payment_providers[0]?.key ?? '');
  const [mode, setMode] = useState<'full' | 'partial'>('full');
  const [partialAmount, setPartialAmount] = useState(String(initialInvoice.amount_due || ''));
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPublic, setReviewPublic] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);
  const [momoPhone, setMomoPhone] = useState('');
  const [cryptoPayment, setCryptoPayment] = useState<{ reference: string; address: string; network: string; asset: string; assetAmount: number; expiresAt?: string | null; memo?: string | null } | null>(null);
  const verificationStarted = useRef(false);

  const amountDue = Number(invoice.amount_due || 0);
  const currencyDecimals = SUPPORTED_CURRENCIES.find((item) => item.code === invoice.currency)?.decimals ?? 2;
  const currencyStep = 1 / (10 ** currencyDecimals);
  const partialAllowed = Boolean(invoice.payment_features?.partial_payments);
  const selectedAmount = mode === 'full' || !partialAllowed ? amountDue : Number(partialAmount || 0);
  const selectedProvider = useMemo(
    () => invoice.payment_providers.find((item) => item.key === provider),
    [invoice.payment_providers, provider],
  );

  useEffect(() => {
    if (!invoice.payment_providers.some((item) => item.key === provider)) {
      setProvider(invoice.payment_providers[0]?.key ?? '');
    }
  }, [invoice.payment_providers, provider]);

  useEffect(() => {
    setPartialAmount(String(invoice.amount_due || ''));
  }, [invoice.amount_due]);

  useEffect(() => {
    if (verificationStarted.current) return;
    const params = new URLSearchParams(window.location.search);
    const paymentRef = params.get('payment_ref');
    const status = params.get('status');

    if (!paymentRef || status === 'cancelled') {
      if (status === 'cancelled') setMessage('Payment was cancelled. No invoice balance was changed.');
      return;
    }

    verificationStarted.current = true;
    setVerifying(true);
    setMessage('Confirming your payment…');

    fetch(`/api/public/payments/${encodeURIComponent(paymentRef)}/verify`, { method: 'POST' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Unable to confirm payment');
        if (data?.invoice) setInvoice(data.invoice);
        if (data?.status === 'success') {
          setMessage('Payment confirmed. The invoice balance has been updated.');
        } else {
          setMessage('The payment is still being confirmed. You can refresh this page shortly.');
        }
      })
      .catch((error) => setMessage(error?.message || 'Unable to confirm payment.'))
      .finally(() => {
        setVerifying(false);
        const cleanUrl = `${window.location.origin}${window.location.pathname}`;
        window.history.replaceState({}, '', cleanUrl);
      });
  }, []);

  async function pollPayment(reference: string) {
    setVerifying(true);
    for (let attempt = 0; attempt < 20; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, attempt === 0 ? 1800 : 3000));
      const response = await fetch(`/api/public/payments/${encodeURIComponent(reference)}/verify`, { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to confirm payment');
      if (data?.invoice) setInvoice(data.invoice);
      if (data?.status === 'success') { setMessage('Payment confirmed. The invoice balance has been updated and merchant settlement is being processed.'); setCryptoPayment(null); setVerifying(false); setLoading(false); return; }
      if (data?.crypto?.status === 'underpaid') { setMessage('A crypto payment was detected but it is under the exact quoted amount. It is held for reconciliation and will not auto-settle.'); setVerifying(false); setLoading(false); return; }
      if (data?.crypto?.status === 'overpaid') { setMessage('A crypto payment was detected above the exact quoted amount. It is held for reconciliation and will not auto-settle.'); setVerifying(false); setLoading(false); return; }
      if (data?.status === 'failed') { setMessage('The payment was not completed. You can try again.'); setVerifying(false); setLoading(false); return; }
    }
    setMessage('Payment is still pending. If you approved it, refresh shortly to confirm the invoice balance.');
    setVerifying(false);
    setLoading(false);
  }

  async function startPayment() {
    setMessage(null);

    if (!provider) {
      setMessage('Choose a payment provider.');
      return;
    }

    if (provider === 'mtn_momo' && momoPhone.replace(/\D/g, '').length < 9) {
      setMessage('Enter the MTN MoMo number that will approve this payment.');
      return;
    }

    if (!Number.isFinite(selectedAmount) || selectedAmount <= 0 || selectedAmount > amountDue) {
      setMessage(`Enter an amount between ${money(0.01, invoice.currency)} and ${money(amountDue, invoice.currency)}.`);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/public/invoices/${encodeURIComponent(invoice.token)}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, amount: selectedAmount, payer_phone: provider === 'mtn_momo' ? momoPhone.trim() : undefined }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to start payment');

      const checkoutMode = data?.data?.checkout_mode ?? 'redirect';
      const paymentReference = data?.data?.payment_reference;
      if (checkoutMode === 'crypto_address') {
        const instructions = data?.data?.instructions ?? {};
        if (!paymentReference || !instructions?.address) throw new Error('Crypto payment address was not returned.');
        setCryptoPayment({
          reference: paymentReference,
          address: String(instructions.address),
          network: String(instructions.network || ''),
          asset: String(instructions.asset || ''),
          assetAmount: Number(instructions.asset_amount || 0),
          expiresAt: instructions.expires_at ?? null,
          memo: instructions.memo ?? null,
        });
        setMessage('Send the exact crypto amount to the transaction wallet below, then check the payment status.');
        setLoading(false);
        return;
      }
      if (checkoutMode === 'approval') {
        setMessage(data?.data?.instructions || 'Approve the MTN MoMo prompt on your phone.');
        if (!paymentReference) throw new Error('Payment reference missing.');
        await pollPayment(paymentReference);
        return;
      }
      const checkoutUrl = data?.data?.checkout_url;
      if (!checkoutUrl) throw new Error('The payment provider did not return a checkout URL.');
      window.location.assign(checkoutUrl);
    } catch (error: any) {
      setMessage(error?.message || 'Unable to start payment.');
      setLoading(false);
    }
  }


  async function submitReview() {
    setReviewMessage(null);
    if (reviewComment.trim().length < 12) {
      setReviewMessage('Please write at least a short sentence about your experience.');
      return;
    }

    try {
      setReviewLoading(true);
      const response = await fetch(`/api/public/invoices/${encodeURIComponent(invoice.token)}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment.trim(), is_public: reviewPublic }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to submit your review');
      setInvoice((current) => ({
        ...current,
        review: { can_submit: false, submitted: true, status: data?.data?.status ?? 'pending', is_public: Boolean(data?.data?.is_public) },
      }));
      setReviewMessage(data?.message || 'Thank you for your feedback.');
    } catch (error: any) {
      setReviewMessage(error?.message || 'Unable to submit your review.');
    } finally {
      setReviewLoading(false);
    }
  }

  const isPaid = invoice.status === 'paid' || amountDue <= 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-sm font-black text-white">H</div>
            <div>
              <p className="text-sm font-bold tracking-tight">Hip Homorrd</p>
              <p className="text-xs text-slate-500">Secure invoice payment</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-xs font-medium text-slate-500 sm:flex">
            <LockKeyhole className="h-3.5 w-3.5" /> Secure invoice checkout
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-7 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-12">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                {invoice.merchant.logo_url ? (
                  // Merchant logos can come from user-configured storage providers.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={invoice.merchant.logo_url} alt="" className="h-12 w-12 rounded-xl border border-slate-200 object-contain p-1" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-lg font-bold text-white">
                    {invoice.merchant.name?.slice(0, 1)?.toUpperCase() || 'H'}
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Invoice from</p>
                  <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">{invoice.merchant.name}</h1>
                </div>
              </div>
              <div className="sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Invoice</p>
                <p className="mt-1 font-semibold text-slate-800">{invoice.invoice_number}</p>
                {invoice.due_date && <p className="mt-1 text-sm text-slate-500">Due {invoice.due_date}</p>}
              </div>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Invoice total</p>
                <p className="mt-2 text-lg font-bold">{money(invoice.total_amount, invoice.currency)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Paid</p>
                <p className="mt-2 text-lg font-bold text-emerald-700">{money(invoice.amount_paid, invoice.currency)}</p>
              </div>
              <div className="rounded-2xl bg-slate-950 p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Balance due</p>
                <p className="mt-2 text-lg font-bold">{money(amountDue, invoice.currency)}</p>
              </div>
            </div>

            <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200">
              <div className="grid grid-cols-[1fr_auto] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid-cols-[1fr_90px_130px]">
                <span>Item</span><span className="hidden text-right sm:block">Qty</span><span className="text-right">Amount</span>
              </div>
              <div className="divide-y divide-slate-100">
                {invoice.items.map((item) => (
                  <div key={String(item.id ?? item.name)} className="grid grid-cols-[1fr_auto] gap-3 px-4 py-4 sm:grid-cols-[1fr_90px_130px]">
                    <div>
                      <p className="font-medium text-slate-900">{item.name}</p>
                      {item.description && <p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p>}
                    </div>
                    <span className="hidden text-right text-sm text-slate-500 sm:block">{item.quantity}</span>
                    <span className="text-right text-sm font-semibold">{money(item.total_price, invoice.currency)}</span>
                  </div>
                ))}
              </div>
            </div>

            {invoice.description && (
              <div className="mt-6 rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">About this invoice</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{invoice.description}</p>
              </div>
            )}
          </div>
        </section>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            {isPaid ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h2 className="mt-5 text-2xl font-bold tracking-tight">Invoice paid</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">The recorded balance for this invoice is now zero.</p>
                <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-left text-sm text-emerald-900">
                  <div className="flex gap-3"><ReceiptText className="mt-0.5 h-5 w-5 shrink-0" /><span>Payment activity is recorded against invoice {invoice.invoice_number}.</span></div>
                </div>
                {message && <div className="mt-4 rounded-xl bg-emerald-50 px-3 py-3 text-left text-sm text-emerald-800">{message}</div>}

                {invoice.review?.can_submit && (
                  <div className="mt-7 border-t border-slate-100 pt-6 text-left">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><MessageSquareText className="h-5 w-5" /></span>
                      <div><h3 className="font-bold text-slate-950">How was your experience?</h3><p className="mt-1 text-xs leading-5 text-slate-500">This review is verified because it is attached to a paid invoice. Your invoice amount and email are never shown publicly.</p></div>
                    </div>
                    <div className="mt-4 flex gap-1" aria-label="Review rating">
                      {[1,2,3,4,5].map((star) => <button key={star} type="button" onClick={() => setReviewRating(star)} aria-label={`${star} star${star === 1 ? '' : 's'}`} className={`rounded-md p-1 ${star <= reviewRating ? 'text-amber-500' : 'text-slate-300'}`}><Star className="h-6 w-6" fill="currentColor" /></button>)}
                    </div>
                    <textarea value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} maxLength={800} rows={4} placeholder={`Tell ${invoice.merchant.name} what went well…`} className="mt-3 w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                    <label className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-500"><input type="checkbox" checked={reviewPublic} onChange={(event) => setReviewPublic(event.target.checked)} className="mt-1" /><span>Allow {invoice.merchant.name} and Hip Homorrd to display this review publicly. Only your shortened name, rating and comment will be shown.</span></label>
                    {reviewMessage && <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-600">{reviewMessage}</p>}
                    <Button type="button" onClick={submitReview} disabled={reviewLoading} className="mt-4 h-11 w-full bg-slate-950 text-white hover:bg-slate-800">{reviewLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Star className="mr-2 h-4 w-4" />}Submit verified review</Button>
                  </div>
                )}

                {invoice.review?.submitted && (
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                    <p className="text-sm font-semibold text-slate-900">Thanks for your review.</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{invoice.review.is_public ? 'It will appear publicly after the business approves it.' : 'It was sent privately to the business.'}</p>
                    {reviewMessage && <p className="mt-2 text-xs text-emerald-700">{reviewMessage}</p>}
                  </div>
                )}
              </div>
            ) : !invoice.payment_enabled ? (
              <div className="py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><WalletCards className="h-5 w-5" /></div>
                <h2 className="mt-5 text-xl font-bold tracking-tight">Online payment is not active yet</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{invoice.merchant.name} has not connected an active payment account for this invoice. Contact them for another payment method.</p>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Pay this invoice</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">{money(amountDue, invoice.currency)} remaining</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{partialAllowed ? 'Choose how much to pay.' : 'This business accepts the full remaining balance online on its current plan.'} Hip Homorrd will send you to the selected provider’s secure checkout.</p>

                <div className={`mt-6 grid ${partialAllowed ? 'grid-cols-2' : 'grid-cols-1'} gap-2 rounded-xl bg-slate-100 p-1`}>
                  <button type="button" onClick={() => setMode('full')} className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${mode === 'full' || !partialAllowed ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Pay full</button>
                  {partialAllowed && <button type="button" onClick={() => setMode('partial')} className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${mode === 'partial' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Pay partial</button>}
                </div>
                {!partialAllowed && <p className="mt-2 text-xs leading-5 text-slate-400">Partial online payments are available when the business is on a plan that includes them.</p>}

                {partialAllowed && mode === 'partial' && (
                  <label className="mt-4 block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">Amount to pay</span>
                    <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
                      <span className="text-sm font-semibold text-slate-400">{CURRENCY_SYMBOLS[invoice.currency] ?? invoice.currency}</span>
                      <input type="number" min={currencyStep} max={amountDue} step={currencyStep} value={partialAmount} onChange={(event) => setPartialAmount(event.target.value)} className="w-full bg-transparent px-2 py-3 text-base font-semibold outline-none" />
                    </div>
                    <div className="mt-2 flex gap-2">
                      {[0.25, 0.5, 0.75].map((ratio) => (
                        <button key={ratio} type="button" onClick={() => setPartialAmount(String(Math.max(currencyStep, Number((amountDue * ratio).toFixed(currencyDecimals)))))} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:border-emerald-200 hover:text-emerald-700">{ratio * 100}%</button>
                      ))}
                    </div>
                  </label>
                )}

                <div className="mt-5">
                  <p className="mb-2 text-sm font-semibold text-slate-700">Payment provider</p>
                  <div className="space-y-2">
                    {invoice.payment_providers.map((item) => {
                      const active = provider === item.key;
                      return (
                        <button key={item.key} type="button" onClick={() => setProvider(item.key)} className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${active ? 'border-emerald-400 bg-emerald-50/60 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'}`}>
                          <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{['moonpay_commerce', 'hip_crypto'].includes(item.key) ? <Bitcoin className="h-4 w-4" /> : item.key === 'mtn_momo' ? <Smartphone className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}</span>
                          <span className="flex-1"><span className="block text-sm font-semibold text-slate-900">{item.label}</span><span className="mt-0.5 block text-xs leading-5 text-slate-500">{providerDescription(item.key)}</span></span>
                          {active && <span className="mt-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white"><Check className="h-3 w-3" /></span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {provider === 'mtn_momo' && (
                  <label className="mt-4 block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">MTN MoMo number</span>
                    <input value={momoPhone} onChange={(event) => setMomoPhone(event.target.value)} inputMode="tel" placeholder="Country code + mobile number" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                    <span className="mt-1.5 block text-xs text-slate-400">You will receive an MTN MoMo approval prompt on this number.</span>
                  </label>
                )}

                {cryptoPayment && (
                  <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                    <div className="flex items-start gap-3"><Bitcoin className="mt-0.5 h-5 w-5 text-emerald-700" /><div><p className="font-semibold text-emerald-950">Hip transaction wallet</p><p className="mt-1 text-xs leading-5 text-emerald-800">Send exactly <strong>{cryptoPayment.assetAmount} {cryptoPayment.asset}</strong> on <strong>{cryptoPayment.network}</strong>. A wrong network or unsupported asset cannot be automatically reconciled.</p></div></div>
                    <div className="mt-4 rounded-xl bg-white p-3 ring-1 ring-emerald-200"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Payment address</p><div className="mt-2 flex items-center gap-2"><code className="min-w-0 flex-1 break-all text-xs font-semibold text-slate-800">{cryptoPayment.address}</code><button type="button" onClick={() => navigator.clipboard.writeText(cryptoPayment.address)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Copy</button></div></div>
                    {cryptoPayment.expiresAt && <p className="mt-3 text-xs text-emerald-800">Quote expires {new Date(cryptoPayment.expiresAt).toLocaleString()}.</p>}
                  </div>
                )}

                {message && <div className={`mt-4 rounded-xl px-3 py-3 text-sm ${message.toLowerCase().includes('confirmed') ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>{message}</div>}

                <Button onClick={() => cryptoPayment ? pollPayment(cryptoPayment.reference) : startPayment()} disabled={loading || verifying} className="mt-5 h-12 w-full bg-emerald-600 text-white hover:bg-emerald-700">
                  {loading || verifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {verifying ? 'Confirming payment…' : loading ? 'Preparing payment…' : cryptoPayment ? 'I’ve sent it — check payment' : selectedProvider?.key === 'hip_crypto' ? 'Generate crypto payment address' : selectedProvider?.key === 'moonpay_commerce' ? 'Pay with crypto' : selectedProvider?.key === 'mtn_momo' ? 'Pay with MTN MoMo' : `Continue with ${selectedProvider?.label ?? 'payment'}`}
                  {!loading && !verifying && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>

                <div className="mt-5 grid gap-3 text-xs leading-5 text-slate-500">
                  <div className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /><span>Payment credentials are entered with the selected provider, not into this invoice page.</span></div>
                  <div className="flex gap-2"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /><span>Hip Homorrd updates the invoice only after server-side payment confirmation.</span></div>
                </div>
              </>
            )}
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">Invoice payment powered by Hip Homorrd</p>
        </aside>
      </div>

      {(invoice.merchant.recent_reviews?.length ?? 0) > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Verified client reviews</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Clients who paid {invoice.merchant.name}</h2></div>
              {invoice.merchant.average_rating ? <div className="flex items-center gap-2 text-sm font-semibold text-slate-700"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{invoice.merchant.average_rating.toFixed(1)} <span className="font-normal text-slate-400">({invoice.merchant.review_count ?? 0} published)</span></div> : null}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {invoice.merchant.recent_reviews?.map((review) => <article key={review.id} className="rounded-2xl bg-slate-50 p-5"><div className="flex gap-0.5 text-amber-500">{[1,2,3,4,5].map((star) => <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'fill-current' : 'text-slate-200'}`} />)}</div><p className="mt-3 text-sm leading-6 text-slate-700">“{review.comment}”</p><div className="mt-4 flex items-center gap-2 text-xs"><span className="font-semibold text-slate-900">{review.reviewer_name}</span><span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700">Verified payment</span></div></article>)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
