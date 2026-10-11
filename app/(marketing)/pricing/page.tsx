import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { ArrowRight, Check } from 'lucide-react';
import PricingExperience from '@/components/marketing/pricing/pricing-experience';
import MarketSelector from '@/components/marketing/pricing/market-selector';

export const metadata: Metadata = {
  title: 'Hip Homorrd pricing',
  description: 'Local-first pricing for Nigeria, Africa and international businesses, with unlimited invoicing and lower collection fees as you grow.',
  alternates: { canonical: '/pricing' },
};

const faqs = [
  ['Why is pricing shown in local currency?', 'Hip Homorrd uses a market-specific price book rather than forcing every business through a USD conversion. Nigeria defaults to Naira, while supported expansion markets use their own local billing currency.'],
  ['Can I invoice in a different currency from my plan?', 'Yes. Subscription billing currency and invoice currency are separate. A Nigerian business can keep an NGN workspace and create a USD, GBP, GHS, KES, ZAR or PHP invoice when the client relationship requires it.'],
  ['What counts as an active client?', 'An active client is someone you can currently invoice. Archive an old client to free a slot without losing invoices, payments or history.'],
  ['What is the collection fee?', 'When a client successfully pays through a Hip Homorrd payment link, Hip Homorrd keeps the plan-specific platform fee. The payment provider may also charge its own processing fee.'],
  ['Does upgrading change old invoices?', 'No. Each invoice snapshots the plan and platform-fee percentage that applied when it was created, so already-issued invoices keep consistent economics.'],
  ['Can clients pay with Bitcoin or other crypto?', 'On Base and Plus, a business can whitelist its crypto payout wallet in Hip Homorrd. After Hip Homorrd’s MoonPay platform provisioning is approved for that merchant, clients can pay supported crypto without the merchant managing MoonPay credentials directly.'],
  ['What about MTN MoMo?', 'Where Hip Homorrd has approved MTN MoMo collection and disbursement access, a client can approve an invoice payment from an MTN MoMo wallet. Hip Homorrd reconciles the collection and can settle the merchant net amount to the payout MoMo number saved in the business settings. Provider and Hip Homorrd fees are shown separately in the ledger.'],
];

async function loadPricing(country: string) {
  const base = process.env.API_BASE_URL?.replace(/\/$/, '');
  if (!base) return { plans: [], market: null, markets: [] };
  try {
    const [plansResponse, marketsResponse] = await Promise.all([
      fetch(`${base}/api/v1/public/plans?country=${encodeURIComponent(country)}`, { next: { revalidate: 300 } }),
      fetch(`${base}/api/v1/public/markets?country=${encodeURIComponent(country)}`, { next: { revalidate: 300 } }),
    ]);
    const plansPayload = plansResponse.ok ? await plansResponse.json() : {};
    const marketsPayload = marketsResponse.ok ? await marketsResponse.json() : {};
    return {
      plans: Array.isArray(plansPayload?.data) ? plansPayload.data : [],
      market: plansPayload?.market || marketsPayload?.data?.selected || null,
      markets: Array.isArray(marketsPayload?.data?.markets) ? marketsPayload.data.markets : [],
    };
  } catch {
    return { plans: [], market: null, markets: [] };
  }
}

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ country?: string }> }) {
  const params = await searchParams;
  const requestHeaders = await headers();
  const detected = (params.country || requestHeaders.get('x-vercel-ip-country') || requestHeaders.get('cf-ipcountry') || 'NG').toUpperCase();
  const { plans, market, markets } = await loadPricing(detected);
  const selectedCountry = market?.country_code || 'NG';

  return <main className="overflow-hidden bg-white dark:bg-[#07111f]">
    <section className="relative border-b border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_92%)] dark:border-white/10 dark:bg-[linear-gradient(180deg,#0a1524_0%,#07111f_92%)]"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,.10),transparent_42%)]" /><div className="page-container relative py-16 text-center lg:py-24"><div className="mx-auto max-w-4xl"><div className="flex justify-center">{markets.length > 0 && <MarketSelector markets={markets} selected={selectedCountry} />}</div><p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Nigeria first. Africa ready. International capable.</p><h1 className="mt-5 text-4xl font-bold tracking-[-0.045em] text-slate-950 sm:text-6xl">Price locally. Invoice globally. Keep more as you grow.</h1><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">Hip Homorrd defaults to Nigeria and Naira, then adapts plan pricing by market. Your invoice currency remains flexible so local businesses can serve local and international clients from the same workspace.</p><div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-600">{['Local plan pricing', 'Unlimited invoices', 'Multi-currency invoicing', 'Lower collection fees as you grow'].map((item) => <span key={item} className="inline-flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-3 w-3" /></span>{item}</span>)}</div></div></div></section>
    <section className="page-container py-12 lg:py-18"><PricingExperience plansData={plans} market={market || undefined} /></section>
    <section className="border-y border-slate-200 bg-slate-50 py-16 lg:py-20"><div className="page-container grid gap-10 lg:grid-cols-[.75fr_1.25fr]"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Questions, answered</p><h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Built for local economics without creating a local-only product.</h2><p className="mt-4 text-base leading-7 text-slate-600">The subscription price book can be tuned by country while the core product, client records, invoice currencies and payment architecture remain shared across markets.</p></div><div className="space-y-3">{faqs.map(([question, answer]) => <details key={question} className="group rounded-2xl border border-slate-200 bg-white p-5 open:shadow-sm"><summary className="cursor-pointer list-none pr-8 font-semibold text-slate-950 marker:hidden">{question}</summary><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{answer}</p></details>)}</div></div></section>
    <section className="page-container py-16 text-center lg:py-20"><h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Start in Naira. Grow across borders without rebuilding your invoicing workflow.</h2><p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">Create a free account, choose your home market and issue each invoice in the currency that fits the client.</p><Link href="/sign-up" className="mt-7 inline-flex items-center rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800">Start free <ArrowRight className="ml-2 h-4 w-4" /></Link></section>
  </main>;
}
