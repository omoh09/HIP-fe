'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Check, CreditCard, ExternalLink, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatMoney } from '@/lib/currency';

type Plan = {
  code: 'free' | 'base' | 'plus'; name: string; active_client_limit: number; monthly_invoice_limit: number;
  platform_fee_percent: number; payment_provider_limit?: number; features?: Record<string, boolean>;
  price?: { amount: number; currency: string; country_code?: string; market_name?: string };
};
type Subscription = { provider: string; plan_code: string; currency: string; amount: number; interval: string; status: string; current_period_end?: string | null; next_payment_at?: string | null; cancel_at_period_end: boolean };
type BillingPayload = { plan: Plan; usage: any; subscription: Subscription | null; provider: string; available_plans: Plan[] };

async function jsonRequest(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) }, cache: 'no-store' });
  const text = await response.text();
  let payload: any = {}; try { payload = text ? JSON.parse(text) : {}; } catch { payload = {}; }
  if (!response.ok) throw new Error(payload?.error || payload?.message || 'Request failed.');
  return payload;
}

export default function BillingSettingsClient() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<BillingPayload | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const load = useCallback(async () => { try { const payload = await jsonRequest('/api/billing/subscription'); setData(payload.data); } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to load billing.'); } }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const ref = searchParams.get('subscription_ref');
    if (!ref) return;
    let active = true;
    (async () => { try { setBusy('verify'); await jsonRequest('/api/billing/subscription/verify', { method: 'POST', body: JSON.stringify({ reference: ref }) }); if (active) { toast.success('Subscription confirmed. Your plan is active.'); await load(); window.history.replaceState({}, '', '/dashboard/settings/billing'); } } catch (error) { if (active) toast.error(error instanceof Error ? error.message : 'Unable to verify subscription.'); } finally { if (active) setBusy(null); } })();
    return () => { active = false; };
  }, [searchParams, load]);

  const plans = useMemo(() => data?.available_plans || [], [data]);
  const requested = searchParams.get('plan');

  async function subscribe(plan: 'base' | 'plus') {
    try { setBusy(plan); const payload = await jsonRequest('/api/billing/subscription/checkout', { method: 'POST', body: JSON.stringify({ plan_code: plan }) }); const url = payload?.data?.checkout_url || payload?.data?.manage_url; if (url) { window.location.href = url; return; } if (payload?.data?.already_subscribed) toast.success('You already have this plan.'); await load(); } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to start checkout.'); } finally { setBusy(null); }
  }

  async function cancel() { if (!window.confirm('Stop renewal at the end of the current paid period?')) return; try { setBusy('cancel'); await jsonRequest('/api/billing/subscription/cancel', { method: 'POST' }); toast.success('Auto-renewal has been stopped.'); await load(); } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to cancel subscription.'); } finally { setBusy(null); } }
  async function manage() { try { setBusy('manage'); const payload = await jsonRequest('/api/billing/subscription/manage'); const url = payload?.data?.url; if (!url) throw new Error('The provider has not generated a management link yet.'); window.open(url, '_blank', 'noopener,noreferrer'); } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to open provider billing.'); } finally { setBusy(null); } }

  if (!data) return <section className="page-container py-10"><div className="h-56 animate-pulse rounded-3xl bg-slate-200" /></section>;
  const current = data.plan;
  return <section className="page-container py-8 lg:py-10">
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-sm font-semibold text-emerald-700">Subscription</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Plan & billing</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Your subscription controls product access. Client payment processing stays separate from Hip Homorrd subscription billing.</p></div><span className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">{current.name} plan</span></div>

      {busy === 'verify' && <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900"><Loader2 className="h-4 w-4 animate-spin" />Confirming your subscription with {data.provider}…</div>}

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {plans.map(plan => { const paid = plan.code !== 'free'; const isCurrent = current.code === plan.code; const highlight = requested === plan.code || plan.code === 'base'; return <article key={plan.code} className={`relative rounded-[26px] border p-6 ${highlight ? 'border-emerald-300 bg-white shadow-xl shadow-emerald-950/5' : 'border-slate-200 bg-white'}`}>
          {plan.code === 'base' && <span className="absolute right-5 top-5 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800">Popular</span>}
          <h2 className="text-xl font-bold text-slate-950">{plan.name}</h2><div className="mt-4 flex items-end gap-2"><span className="text-3xl font-black tracking-tight text-slate-950">{paid ? formatMoney(Number(plan.price?.amount || 0), plan.price?.currency || 'NGN', { compact: true }) : 'Free'}</span>{paid && <span className="pb-1 text-xs text-slate-400">/month</span>}</div>
          <div className="mt-5 space-y-2.5 text-sm text-slate-600"><Feature text={Number(plan.active_client_limit) === 0 ? 'Unlimited active clients' : `${plan.active_client_limit} active clients`} /><Feature text="Unlimited invoices" /><Feature text={`${Number(plan.platform_fee_percent).toFixed(2).replace(/0+$/,'').replace(/\.$/,'')}% Hip Homorrd collection fee`} /><Feature text={`${plan.payment_provider_limit || 1} active payment provider${(plan.payment_provider_limit || 1) > 1 ? 's' : ''}`} />{plan.features?.partial_payments && <Feature text="Partial client payments" />}{plan.features?.reports && <Feature text="Reports" />}{plan.features?.custom_branding && <Feature text="Custom invoice branding" />}</div>
          <div className="mt-6">{isCurrent ? <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"><Check className="h-4 w-4 text-emerald-600" />Current plan</div> : paid ? <button type="button" onClick={() => subscribe(plan.code as 'base'|'plus')} disabled={busy !== null} className="inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">{busy === plan.code ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}{current.code === 'free' ? 'Subscribe' : 'Change plan'} <ArrowRight className="ml-2 h-4 w-4" /></button> : <div className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-500">Free is always available when paid access ends.</div>}</div>
        </article>; })}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6"><div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><CreditCard className="h-5 w-5" /></span><div><h2 className="font-bold text-slate-950">Subscription status</h2><p className="mt-1 text-sm text-slate-500">Recurring billing is handled by {data.provider}.</p></div></div>{data.subscription ? <div className="mt-5 grid gap-3 sm:grid-cols-2"><Stat label="Status" value={data.subscription.cancel_at_period_end ? 'Cancels after paid period' : data.subscription.status.replace('_',' ')} /><Stat label="Plan" value={data.subscription.plan_code.toUpperCase()} /><Stat label="Billed" value={`${formatMoney(data.subscription.amount, data.subscription.currency, { compact: true })} / ${data.subscription.interval}`} /><Stat label="Paid through" value={data.subscription.current_period_end ? new Date(data.subscription.current_period_end).toLocaleDateString() : 'Awaiting provider cycle'} /></div> : <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">You do not currently have a recurring paid subscription. Free-plan entitlements remain active.</p>}{data.subscription && <div className="mt-5 flex flex-wrap gap-2"><button onClick={manage} disabled={busy !== null} className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><ExternalLink className="mr-2 h-4 w-4" />Manage with {data.provider}</button>{!data.subscription.cancel_at_period_end && <button onClick={cancel} disabled={busy !== null} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">Stop renewal</button>}</div>}</div>
        <div className="rounded-3xl bg-slate-950 p-6 text-white"><Sparkles className="h-5 w-5 text-emerald-300" /><h2 className="mt-5 text-xl font-bold">Entitlements are server-enforced.</h2><p className="mt-3 text-sm leading-7 text-slate-300">Client limits, partial payments, reports, branding and provider capacity are checked by Laravel. Changing browser state cannot unlock a paid feature.</p><div className="mt-5 flex gap-2 text-xs text-slate-400"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />Webhook and verification events control paid-plan activation and renewal.</div></div>
      </div>
    </div>
  </section>;
}
function Feature({ text }: { text: string }) { return <div className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /><span>{text}</span></div>; }
function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 font-semibold capitalize text-slate-900">{value}</p></div>; }
