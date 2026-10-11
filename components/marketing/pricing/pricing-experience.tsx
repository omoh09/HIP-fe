'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Infinity, Sparkles, Users, WalletCards, Zap, Layers3 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { formatMoney } from '@/lib/currency';

const defaultPlans = [
  { key: 'free', name: 'Free', clients: '5 active clients', fee: '1.0%', eyebrow: 'Start and get paid', description: 'For new freelancers and micro businesses starting with professional invoices, WhatsApp sharing and online collection.', icon: Zap },
  { key: 'base', name: 'Base', clients: '50 active clients', fee: '0.6%', eyebrow: 'For established independents', description: 'More client capacity and a lower Hip Homorrd collection fee as your client book and payment volume grow.', icon: Users },
  { key: 'plus', name: 'Plus', clients: 'Unlimited clients', fee: '0.3%', eyebrow: 'For growing businesses', description: 'Remove client limits and keep more of every successful payment collected through Hip Homorrd.', icon: Sparkles },
] as const;

type PlanKey = typeof defaultPlans[number]['key'];
type BackendPlan = { code: string; name: string; price?: { amount: number; currency: string; country_code: string; market_name: string }; active_client_limit: number; platform_fee_percent: number; payment_provider_limit?: number; features?: Record<string, boolean>; automation_level?: string };

export default function PricingExperience({ plansData = [], market }: { plansData?: BackendPlan[]; market?: { country_code?: string; name?: string; currency?: string } }) {
  const plans = defaultPlans.map((plan) => {
    const backend = plansData.find((item) => item.code === plan.key);
    const clients = backend ? (Number(backend.active_client_limit) === 0 ? 'Unlimited active clients' : `${Number(backend.active_client_limit)} active clients`) : plan.clients;
    const fee = backend ? `${Number(backend.platform_fee_percent).toFixed(2).replace(/0+$/, '').replace(/\.$/, '')}%` : plan.fee;
    const amount = backend ? Number(backend.price?.amount ?? 0) : (plan.key === 'free' ? 0 : null);
    const currency = backend?.price?.currency || market?.currency || 'NGN';
    const providerLimit = Number(backend?.payment_provider_limit || 1);
    const flags = backend?.features || {};
    const features = [
      clients,
      'Unlimited invoices',
      'Multi-currency invoicing',
      'Dedicated client payment links',
      'WhatsApp sharing',
      'Verified-payment reviews',
      `${providerLimit} active payment provider${providerLimit > 1 ? 's' : ''}`,
      ...(flags.partial_payments ? ['Partial client payments'] : ['Full client payments']),
      ...(flags.reports ? ['Reports'] : []),
      ...(flags.custom_branding ? ['Custom invoice branding'] : []),
      ...(flags.crypto_payments ? ['Managed crypto checkout via MoonPay Commerce'] : []),
      `Hip Homorrd collection fee: ${fee}`,
    ];
    return { ...plan, name: backend?.name || plan.name, amount, currency, clients, fee, features };
  });
  const [active, setActive] = useState<PlanKey>('base');
  const selected = plans.find((plan) => plan.key === active)!;

  return <div>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Local-first pricing</p><p className="mt-1 text-sm text-emerald-950">{market?.name || 'Nigeria'} plans are billed in <strong>{market?.currency || 'NGN'}</strong>. Invoice currency remains independent.</p></div><span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">No forced USD conversion</span></div>

    <div className="grid gap-5 lg:grid-cols-3">{plans.map((plan) => { const Icon = plan.icon; const isActive = active === plan.key; return <button type="button" key={plan.key} onClick={() => setActive(plan.key)} className={`relative overflow-hidden rounded-[28px] border p-7 text-left transition sm:p-8 ${isActive ? 'border-emerald-300 bg-white shadow-[0_30px_75px_-45px_rgba(5,150,105,.45)]' : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white'}`}>
      {plan.key === 'base' && <span className="absolute right-5 top-5 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">Popular</span>}
      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${isActive ? 'bg-slate-950 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200'}`}><Icon className="h-5 w-5" /></span>
      <p className="mt-7 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">{plan.eyebrow}</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{plan.name}</h2>
      <div className="mt-5 flex items-end gap-2"><span className="text-4xl font-bold tracking-[-0.05em] text-slate-950">{plan.amount === null ? 'Local price' : plan.amount === 0 ? 'Free' : formatMoney(plan.amount, plan.currency, { compact: true })}</span>{plan.amount !== null && plan.amount > 0 && <span className="pb-1 text-sm font-medium text-slate-500">/ month</span>}</div>
      <p className="mt-2 text-xs font-medium text-slate-400">{plan.currency} local plan price</p><p className="mt-5 text-sm leading-7 text-slate-600">{plan.description}</p><div className="mt-6 grid grid-cols-2 gap-2 text-xs"><Metric label="Clients" value={plan.clients} /><Metric label="Collection fee" value={plan.fee} /></div>
    </button>; })}</div>

    <div className="mt-5 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 text-white shadow-[0_30px_80px_-50px_rgba(15,23,42,.65)]"><div className="grid lg:grid-cols-[.8fr_1.2fr]"><div className="border-b border-white/10 p-7 lg:border-b-0 lg:border-r sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">Selected plan</p><AnimatePresence mode="wait"><motion.div key={selected.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}><div className="mt-4 flex flex-wrap items-end gap-3"><h3 className="text-4xl font-bold">{selected.name}</h3><span className="pb-1 text-slate-400">{selected.amount === null ? 'See local price' : selected.amount > 0 ? `${formatMoney(selected.amount, selected.currency, { compact: true })}/month` : 'Free'}</span></div><p className="mt-4 text-sm leading-7 text-slate-300">Upgrade for more active clients and a lower Hip Homorrd collection fee. Your invoice can still be issued in any supported invoice currency.</p><Link href={selected.key === 'free' ? '/sign-up' : `/sign-in?next=${encodeURIComponent(`/dashboard/settings/billing?plan=${selected.key}`)}`} className="mt-7 inline-flex items-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">{selected.key === 'free' ? 'Start free' : `Subscribe to ${selected.name}`} <ArrowRight className="ml-2 h-4 w-4" /></Link><p className="mt-3 text-[11px] leading-5 text-slate-500">Payment-provider processing fees are separate. Managed crypto and mobile-money rails are monetized only through documented, provider-approved subscription or transaction/settlement fees.</p></motion.div></AnimatePresence></div><div className="p-7 sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">What you get</p><AnimatePresence mode="wait"><motion.div key={selected.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-5 grid gap-3 sm:grid-cols-2">{selected.features.map((feature) => <div key={feature} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-slate-950"><Check className="h-3 w-3" /></span><span className="text-sm leading-6 text-slate-200">{feature}</span></div>)}</motion.div></AnimatePresence></div></div></div>

    <div className="mt-5 grid gap-5 md:grid-cols-3"><TrustCard icon={Infinity} title="Subscription revenue" text="Local plan pricing keeps the product accessible while recurring subscriptions create predictable SaaS income." /><TrustCard icon={WalletCards} title="Collection revenue" text="Successful payments add a plan-specific Hip Homorrd fee, while paid plans reward scale with a lower rate." /><TrustCard icon={Layers3} title="Growth add-ons" text="The architecture reserves a third stream for optional automation, team and branded-payment add-ons as those products go live." /></div>
  </div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-100 p-3"><p className="text-slate-400">{label}</p><p className="mt-1 font-semibold text-slate-900">{value}</p></div>; }
function TrustCard({ icon: Icon, title, text }: { icon: typeof Users; title: string; text: string }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5"><Icon className="h-5 w-5 text-emerald-700" /><p className="mt-4 font-semibold text-slate-950">{title}</p><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>; }
