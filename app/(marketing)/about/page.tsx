import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, MessageCircle, ReceiptText, WalletCards } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Hip Homorrd',
  description: 'Why Hip Homorrd is building a simpler invoice-to-payment workflow for freelancers and service businesses.',
  alternates: { canonical: '/about' },
};

const principles = [
  ['Start with the job to be done', 'Create the invoice, get it in front of the client, record what came in and know what is still due. Everything else should earn its place.'],
  ['Fit the way clients already communicate', 'For many service businesses, the client conversation already lives in WhatsApp. Hip Homorrd brings structure to the financial side without forcing the conversation into a new habit.'],
  ['Make money status obvious', 'Paid, partial, overdue and remaining balance should be visible at a glance. You should not need to reconstruct the story from messages and bank alerts.'],
];

export default function AboutPage() {
  return (
    <main className="bg-white dark:bg-[#07111f]">
      <section className="overflow-hidden border-b border-slate-200 bg-slate-950 text-white">
        <div className="page-container grid gap-12 py-16 lg:grid-cols-[1fr_.82fr] lg:items-center lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">About Hip Homorrd</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-[-0.045em] sm:text-6xl">Business moves fast. Getting paid should not feel like admin.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Hip Homorrd is built around a simple idea: the path from finished work to collected payment should be clear enough to run without an accounting department.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/create-invoice" className="inline-flex items-center rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-slate-950 hover:bg-emerald-300">Try the invoice builder <ArrowRight className="ml-2 h-4 w-4" /></Link>
              <Link href="/features" className="rounded-xl border border-white/15 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10">See the product</Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/20">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
              <Image src="/images/marketing/business-owner.webp" alt="Independent business owner working from a laptop" fill priority sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover" />
            </div>
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/15 bg-slate-950/85 p-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">The workflow we care about</p>
              <p className="mt-2 text-sm font-medium text-white">Invoice created → shared with client → payment received → balance updated.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Why we exist</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">The gap is not “more accounting software.” It is less friction between invoice and payment.</h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-slate-600">
            <p>Freelancers, consultants, agencies and contractors often do the real work in one place, talk to clients in another, send invoices somewhere else and then manually remember who has paid. That fragmentation creates unnecessary follow-up.</p>
            <p>Hip Homorrd brings the core workflow together: a professional invoice, a client-friendly way to share it, a clear payment path, partial-payment visibility and a single view of what still needs attention.</p>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {principles.map(([title, text], index) => <article key={title} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"><span className="text-xs font-bold text-emerald-600">0{index + 1}</span><h3 className="mt-5 text-xl font-semibold text-slate-950">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p></article>)}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16 lg:py-20">
        <div className="page-container grid gap-8 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200"><ReceiptText className="h-5 w-5 text-emerald-700" /><h3 className="mt-5 text-lg font-semibold text-slate-950">Professional at the client side</h3><p className="mt-2 text-sm leading-6 text-slate-600">Clear invoices, consistent branding and a payment request that feels deliberate—not improvised.</p></div>
          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200"><MessageCircle className="h-5 w-5 text-emerald-700" /><h3 className="mt-5 text-lg font-semibold text-slate-950">Natural in the conversation</h3><p className="mt-2 text-sm leading-6 text-slate-600">Share through channels clients already check, including WhatsApp, while keeping the invoice as the source of truth.</p></div>
          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200"><WalletCards className="h-5 w-5 text-emerald-700" /><h3 className="mt-5 text-lg font-semibold text-slate-950">Clear after money moves</h3><p className="mt-2 text-sm leading-6 text-slate-600">See the amount received and the amount remaining so the next follow-up starts from the right number.</p></div>
        </div>
      </section>

      <section className="page-container py-16 lg:py-24">
        <div className="grid gap-10 rounded-[30px] bg-emerald-50 p-7 dark:bg-emerald-400/[.07] sm:p-10 lg:grid-cols-[1fr_.8fr] lg:items-center">
          <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Intentionally focused</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">We are not trying to make every finance screen your business could ever need.</h2><p className="mt-4 max-w-2xl leading-7 text-slate-600">The product is designed to make the invoice-to-payment loop excellent first. That focus keeps the experience easier to learn, faster to use and more useful for businesses that simply want to bill clients professionally and get paid.</p></div>
          <div className="space-y-3">{['Create without a learning curve','Share without copying totals into chat','Track partial payments without a spreadsheet','Know exactly what still needs follow-up'].map(item => <div key={item} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 ring-1 ring-emerald-100"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />{item}</div>)}</div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] py-16 dark:border-white/10 dark:bg-[linear-gradient(180deg,#0a1524_0%,#07111f_100%)] lg:py-24">
        <div className="page-container grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">Nigeria rooted. International capable.</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Start in Naira. Invoice the client in the currency that fits the work.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">Hip Homorrd is being built from the realities of African service businesses—WhatsApp conversations, local payment rails, mobile money and uneven connectivity—without limiting a growing business to one market. Your business market, dashboard currency and invoice currency can stay separate.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {['Nigeria-first defaults with NGN','African market and currency support','International invoice currencies','Provider-aware payment options'].map(item => <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800 shadow-sm dark:border-white/10 dark:bg-white/[.045] dark:text-slate-100"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" />{item}</div>)}
          </div>
        </div>
      </section>
    </main>
  );
}
