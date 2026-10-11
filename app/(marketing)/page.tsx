import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Bitcoin, Check, CircleDollarSign, FileText, MessageCircleMore, RefreshCcw, ShieldCheck, Smartphone, Star, WalletCards, WifiOff } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa6';
import { SiGmail, SiStripe } from 'react-icons/si';
import HeroWorkflowDemo from '@/components/marketing/home/hero-workflow-demo';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import SocialFollow from '@/components/marketing/social-follow';
import TrustPeel from '@/components/marketing/home/trust-peel';

export const metadata: Metadata = {
  title: 'Hip Homorrd — Turn invoices into paid balances',
  description: 'Create invoices, share them through WhatsApp, collect client payments, track balances and build verified trust. Nigeria-first, Africa-ready.',
  alternates: { canonical: '/' },
};

const problems = [
  ['Invoice sent. But did they open it?', 'Move from a PDF attachment to a dedicated client link that stays connected to the invoice.'],
  ['Client paid part. What is still due?', 'Every confirmed payment updates the remaining balance instead of making you reconstruct it from chats and alerts.'],
  ['Payment received. Can you prove the history?', 'Keep invoice, checkout attempt and transaction records connected for clearer reconciliation.'],
  ['Job finished. Where does trust go next?', 'Invite a paid client to leave verified-payment feedback you can turn into public social proof.'],
];

const steps = [
  ['01','Create','Build a professional invoice in the client’s currency.'],
  ['02','Share','Send the dedicated invoice link in WhatsApp, email or the conversation you already use.'],
  ['03','Open','The client sees a clean, branded payment page without creating an account.'],
  ['04','Collect','Offer the payment providers enabled for that merchant and invoice currency.'],
  ['05','Update','Confirmed full or partial payments update the invoice and transaction ledger.'],
  ['06','Build proof','After full payment, invite verified feedback and publish approved reviews.'],
];

export default function LandingPage() {
  return <>
    <section className="relative overflow-hidden bg-white dark:bg-[#07111f]">
      <TrustPeel />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,.10)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[920px] -translate-x-1/2 rounded-full bg-emerald-300/15 blur-[130px] dark:bg-emerald-400/10" />
      <div className="page-container relative grid gap-14 py-16 sm:py-20 lg:grid-cols-[.88fr_1.12fr] lg:items-center lg:gap-12 lg:py-24 xl:py-28">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-500" />Nigeria first · Africa ready · invoice globally</div>
          <h1 className="mt-7 text-5xl font-black tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[4.4rem] lg:leading-[.96] dark:text-white">Turn an invoice into a <span className="text-emerald-600 dark:text-emerald-400">paid balance.</span></h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">Create once. Share where clients already reply. Collect through a dedicated payment link. Track what is left—and turn successful work into verified trust.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/create-invoice" className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-[#07111f] shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-400">Create an invoice <ArrowRight className="ml-2 h-4 w-4" /></Link><Link href="#workflow" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-6 py-3.5 text-sm font-semibold text-slate-700 backdrop-blur transition hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10">See the workflow</Link></div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">{['Free to start','No card required for Free','NGN + multi-currency invoices','Installable web app'].map(item => <span key={item} className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{item}</span>)}</div>
        </div>
        <HeroWorkflowDemo />
      </div>
      <div className="page-container relative pb-10 lg:pb-14"><p className="text-center text-[11px] font-bold uppercase tracking-[.18em] text-slate-400">Designed around the channels clients already use</p><div className="mx-auto mt-5 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-5 text-slate-400 dark:text-slate-500"><Channel icon={FaWhatsapp} label="WhatsApp" /><Channel icon={SiGmail} label="Email" /><Channel icon={FaInstagram} label="Instagram" /><Channel icon={FaFacebookF} label="Facebook" /><Channel icon={CircleDollarSign} label="Paystack" /><Channel icon={SiStripe} label="Stripe" /><Channel icon={Smartphone} label="MTN MoMo" /><Channel icon={Bitcoin} label="Bitcoin / crypto" /></div></div>
    </section>

    <section className="border-y border-slate-200 bg-slate-950 py-20 text-white dark:border-white/10" id="workflow"><div className="page-container"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-300">The operational gap</p><h2 className="mt-4 text-4xl font-black tracking-[-.045em] sm:text-5xl">Invoice sent. <span className="text-slate-500">Now what?</span></h2><p className="mt-5 max-w-xl text-base leading-7 text-slate-300">Hip Homorrd is designed around what happens after the document is created—not just the document itself.</p></div><div className="grid gap-3 sm:grid-cols-2">{problems.map(([title,text]) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[.045] p-5"><p className="font-semibold text-white">{title}</p><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></article>)}</div></div></div></section>

    <section className="bg-white py-20 dark:bg-[#07111f] lg:py-28"><div className="page-container"><div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-700 dark:text-emerald-300">One invoice-to-cash workspace</p><h2 className="mt-4 text-4xl font-black tracking-[-.045em] text-slate-950 sm:text-5xl dark:text-white">Three jobs that should never feel disconnected.</h2></div><div className="mt-12 grid gap-5 lg:grid-cols-3"><Pillar icon={FileText} number="01" title="Invoice" text="Clients, line items, local or international currency, branding and a permanent client-facing link." /><Pillar icon={CircleDollarSign} number="02" title="Collect" text="Merchant payment accounts, provider-aware checkout, full or partial payments and a real transaction ledger." /><Pillar icon={Star} number="03" title="Trust" text="Verified-payment reviews connect good work to public proof without exposing invoice amounts or private client data." /></div></div></section>

    <section className="border-y border-slate-200 bg-slate-50 py-20 dark:border-white/10 dark:bg-[#0a1524] lg:py-28"><div className="page-container"><div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]"><div className="lg:sticky lg:top-28 lg:self-start"><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-700 dark:text-emerald-300">How it moves</p><h2 className="mt-4 text-4xl font-black tracking-[-.045em] text-slate-950 dark:text-white">From “please see attached” to a payment you can track.</h2><p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400">A numbered operational story—simple enough for a solo freelancer, structured enough to grow into a finance workflow.</p></div><div className="divide-y divide-slate-200 rounded-[28px] border border-slate-200 bg-white px-6 dark:divide-white/10 dark:border-white/10 dark:bg-white/[.035] sm:px-8">{steps.map(([n,title,text]) => <div key={n} className="grid gap-3 py-7 sm:grid-cols-[60px_150px_1fr] sm:items-start"><span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-300">{n}</span><h3 className="font-bold text-slate-950 dark:text-white">{title}</h3><p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{text}</p></div>)}</div></div></div></section>

    <section className="bg-white py-20 dark:bg-[#07111f] lg:py-28"><div className="page-container grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16"><div className="relative overflow-hidden rounded-[30px] bg-slate-100 shadow-2xl shadow-slate-950/10 dark:bg-slate-900"><Image src="/images/marketing/business-owner.webp" alt="Independent business owner working from a laptop" width={1400} height={934} sizes="(max-width: 1024px) 100vw, 52vw" className="aspect-[4/3] w-full object-cover" /><div className="absolute bottom-4 left-4 right-4 max-w-sm rounded-2xl border border-white/60 bg-white/95 p-4 shadow-xl backdrop-blur sm:bottom-6 sm:left-6"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">Invoice INV-0048</p><p className="mt-1 text-lg font-bold text-slate-950">₦150,000 remaining</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Part paid</span></div></div></div><div><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-700 dark:text-emerald-300">Made for real client conversations</p><h2 className="mt-4 text-4xl font-black tracking-[-.045em] text-slate-950 dark:text-white">WhatsApp is the conversation. Hip Homorrd is the financial source of truth.</h2><p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400">Share the invoice into the chat, but keep amounts paid, outstanding balances and transaction status inside the product. You stay conversational without letting financial records disappear into a message thread.</p><Link href="/whatsapp-invoicing" className="mt-7 inline-flex items-center text-sm font-bold text-emerald-700 dark:text-emerald-300">Explore WhatsApp invoicing <ArrowRight className="ml-2 h-4 w-4" /></Link></div></div></section>

    <section className="border-y border-slate-200 bg-slate-950 py-20 text-white dark:border-white/10 lg:py-28">
      <div className="page-container grid gap-10 lg:grid-cols-[.92fr_1.08fr] lg:items-center lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-amber-200"><Bitcoin className="h-3.5 w-3.5" />Crypto checkout · Base & Plus</span>
          <h2 className="mt-5 text-4xl font-black tracking-[-.045em] sm:text-5xl">Let clients pay with the crypto they already hold.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">Hip Homorrd can provide a managed MoonPay Commerce crypto checkout alongside cards, transfers and mobile money, so the merchant does not need to create or manage MoonPay Commerce credentials directly. Buyers can use supported digital currencies including Bitcoin; Hip Homorrd routes the payment through its approved platform integration to the merchant payout wallet whitelisted in Hip Homorrd, subject to provider onboarding and market availability.</p>
          <div className="mt-7 flex flex-wrap gap-2 text-xs font-semibold text-slate-300"><span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">BTC</span><span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">USDC</span><span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">ETH</span><span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">+ supported crypto</span></div>
          <p className="mt-6 text-xs leading-5 text-slate-500">Crypto assets, networks and settlement options depend on MoonPay Commerce platform approval and supported markets. Merchants whitelist a payout wallet in Hip Homorrd; they never provide a seed phrase or private key. Hip Homorrd does not invent FX rates.</p>
        </div>
        <div className="rounded-[30px] border border-white/10 bg-white/[.045] p-5 shadow-2xl shadow-black/20 sm:p-7">
          <div className="flex items-center justify-between border-b border-white/10 pb-5"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">INV-0048</p><p className="mt-1 text-2xl font-black">$1,250 due</p></div><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-200">Client checkout</span></div>
          <div className="mt-5 space-y-3">
            <CryptoFlow icon={FileText} title="Invoice" text="One permanent Hip Homorrd client link" />
            <CryptoFlow icon={Bitcoin} title="Pay with crypto" text="Bitcoin, USDC, ETH and supported assets" accent />
            <CryptoFlow icon={WalletCards} title="Merchant settlement" text="Whitelisted merchant wallet or eligible provider-managed local payout" />
            <CryptoFlow icon={Smartphone} title="MTN MoMo" text="Collect through approved MoMo rails and settle to the merchant payout number configured in Hip Homorrd" />
            <CryptoFlow icon={Check} title="Balance updated" text="Only after server-side payment verification" />
          </div>
        </div>
      </div>
    </section>

    <section className="bg-emerald-50 py-20 dark:bg-emerald-400/[.06] lg:py-24"><div className="page-container grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm dark:bg-white/10 dark:text-emerald-300"><WifiOff className="h-5 w-5" /></span><h2 className="mt-5 text-3xl font-black tracking-[-.04em] text-slate-950 dark:text-white">Spotty data should not erase your work.</h2><p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">Hip Homorrd is PWA-ready with a safe offline mode: the invoice-builder draft stays on the device and the app shell can remain available. Sensitive actions—authentication, server sync, payments, settlements and subscriptions—stay online by design.</p></div><div className="grid gap-3 sm:grid-cols-3"><OfflineCard icon={FileText} title="Draft offline" text="Keep editing the local invoice draft." /><OfflineCard icon={RefreshCcw} title="Reconnect to sync" text="Create the server invoice when connectivity returns." /><OfflineCard icon={ShieldCheck} title="Money stays online" text="Never fake a payment or settlement while disconnected." /></div></div></section>

    <TestimonialsSection />

    <SocialFollow />

    <section className="bg-white py-20 dark:bg-[#07111f] lg:py-28"><div className="page-container"><div className="relative overflow-hidden rounded-[34px] bg-slate-950 px-6 py-16 text-center text-white sm:px-10 lg:py-20"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,.18),transparent_45%)]" /><div className="relative mx-auto max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-300">Create → share → collect → prove</p><h2 className="mt-4 text-4xl font-black tracking-[-.045em] sm:text-5xl">Your next invoice can do more than look professional.</h2><p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300">Start in Naira, invoice in the currency that fits the client, and upgrade only when your client book and collection workflow need more.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/create-invoice" className="inline-flex items-center rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-emerald-300">Create an invoice <ArrowRight className="ml-2 h-4 w-4" /></Link><Link href="/pricing" className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10">View local pricing</Link></div></div></div></div></section>
  </>;
}

function Channel({ icon: Icon, label }: { icon: any; label: string }) { return <div className="flex items-center gap-2 text-sm font-bold"><Icon className="h-5 w-5" /><span>{label}</span></div>; }
function Pillar({ icon: Icon, number, title, text }: { icon: any; number: string; title: string; text: string }) { return <article className="rounded-[28px] border border-slate-200 bg-slate-50/60 p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl dark:border-white/10 dark:bg-white/[.035] dark:hover:bg-white/[.06]"><div className="flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-emerald-400 dark:text-slate-950"><Icon className="h-5 w-5" /></span><span className="font-mono text-xs font-bold text-slate-400">{number}</span></div><h3 className="mt-7 text-2xl font-black text-slate-950 dark:text-white">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{text}</p></article>; }
function CryptoFlow({ icon: Icon, title, text, accent = false }: { icon: any; title: string; text: string; accent?: boolean }) { return <div className={`flex items-center gap-4 rounded-2xl border p-4 ${accent ? 'border-amber-300/20 bg-amber-300/[.08]' : 'border-white/10 bg-white/[.025]'}`}><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent ? 'bg-amber-300 text-slate-950' : 'bg-white/10 text-white'}`}><Icon className="h-4 w-4" /></span><div><p className="text-sm font-bold text-white">{title}</p><p className="mt-1 text-xs leading-5 text-slate-400">{text}</p></div></div>; }
function OfflineCard({ icon: Icon, title, text }: { icon: any; title: string; text: string }) { return <article className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-emerald-400/10 dark:bg-white/5"><Icon className="h-5 w-5 text-emerald-700 dark:text-emerald-300" /><h3 className="mt-4 font-bold text-slate-950 dark:text-white">{title}</h3><p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">{text}</p></article>; }
