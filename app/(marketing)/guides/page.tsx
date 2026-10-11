import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, MessageCircle, WalletCards } from 'lucide-react';
import GuidesLibrary from '@/components/marketing/guides/guides-library';
import { marketingGuides } from '@/lib/marketing-guides';

export const metadata: Metadata = {
  title: 'Invoice guides for freelancers and small businesses',
  description: 'Practical, original guides for professional invoicing, WhatsApp invoice sharing, payment follow-up, partial payments and freelance collection workflows.',
  alternates: { canonical: '/guides' },
};

export default function GuidesPage() {
  const featured = marketingGuides[1];
  return (
    <main className="overflow-hidden bg-white dark:bg-[#07111f]">
      <section className="relative border-b border-slate-200 bg-slate-950 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(16,185,129,.22),transparent_30%),radial-gradient(circle_at_15%_60%,rgba(16,185,129,.09),transparent_26%)]" />
        <div className="page-container relative grid gap-10 py-16 lg:grid-cols-[1fr_.75fr] lg:items-end lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">Hip Homorrd Resources</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-[-0.045em] sm:text-6xl">Better invoicing is mostly better clarity.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Practical guides for creating invoices clients understand, sharing them through WhatsApp, following up professionally and knowing exactly what is still due.</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">Start here</p>
            <h2 className="mt-3 text-2xl font-semibold">From invoice created to payment collected.</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">The library is organized around the moments that create friction: writing the invoice, sending it, handling partial payment and following up.</p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold text-slate-300">
              <div className="rounded-xl bg-white/5 p-3"><BookOpen className="mx-auto mb-2 h-4 w-4 text-emerald-300" />Create</div>
              <div className="rounded-xl bg-white/5 p-3"><MessageCircle className="mx-auto mb-2 h-4 w-4 text-emerald-300" />Share</div>
              <div className="rounded-xl bg-white/5 p-3"><WalletCards className="mx-auto mb-2 h-4 w-4 text-emerald-300" />Collect</div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container py-12 lg:py-16">
        <Link href={`/guides/${featured.slug}`} className="group grid overflow-hidden rounded-[28px] border border-emerald-200 bg-emerald-50/70 dark:border-emerald-400/15 dark:bg-emerald-400/[.07] lg:grid-cols-[.9fr_1.1fr]">
          <div className="p-7 sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Featured guide · {featured.readTime}</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">{featured.title}</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">{featured.description}</p>
            <span className="mt-6 inline-flex items-center text-sm font-semibold text-emerald-700">Read the guide <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" /></span>
          </div>
          <div className="relative min-h-[260px] bg-[#e9f8ef] p-6 dark:bg-[#0d1d1a]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(37,211,102,.25),transparent_35%)]" />
            <div className="relative mx-auto max-w-sm rounded-[22px] border border-slate-200 bg-white p-4 shadow-xl">
              <div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white"><MessageCircle className="h-4 w-4" /></span><div><p className="text-xs font-semibold text-slate-900">Client conversation</p><p className="text-[10px] text-slate-400">Invoice attached to context</p></div></div>
              <div className="ml-auto mt-6 max-w-[92%] rounded-2xl rounded-tr-sm bg-[#d9fdd3] p-3"><p className="text-xs leading-5 text-slate-800">Hi David, your invoice INV-0048 for <strong>₦250,000</strong> is ready.</p><div className="mt-2 rounded-xl bg-white/80 p-2.5"><p className="text-[9px] uppercase tracking-wider text-slate-400">Invoice</p><p className="mt-1 text-xs font-semibold">₦250,000 due</p><p className="mt-2 text-[10px] font-bold text-emerald-700">View invoice →</p></div></div>
            </div>
          </div>
        </Link>
      </section>

      <section className="page-container pb-18 lg:pb-24">
        <div className="mb-7 max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">Browse the library</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Find the part of your payment workflow you want to improve.</h2></div>
        <GuidesLibrary guides={marketingGuides} />
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="page-container flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-2xl font-bold text-slate-950">Ready to put the workflow into practice?</h2><p className="mt-2 text-sm leading-6 text-slate-600">Create the invoice, share it with the client and keep the remaining balance visible in one place.</p></div><Link href="/create-invoice" className="inline-flex w-fit items-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">Try the invoice builder <ArrowRight className="ml-2 h-4 w-4" /></Link></div>
      </section>
    </main>
  );
}
