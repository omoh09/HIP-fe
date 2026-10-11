import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgeDollarSign, BookOpen, MessageCircle, ReceiptText, WalletCards } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Invoicing and payment collection insights',
  description: 'Practical guides on invoices, WhatsApp follow-up, partial payments, client collections and cash-flow visibility for service businesses.',
  alternates: { canonical: '/blog' },
};

const featured = {
  title: 'The invoice is not the hard part. Getting the money is.',
  text: 'A practical way to think about receivables when the invoice, WhatsApp conversation, payment alert and outstanding balance usually live in different places.',
  href: '/guides/how-to-follow-up-on-an-unpaid-invoice',
};

const posts = [
  { icon: MessageCircle, category: 'WhatsApp', title: 'How to send an invoice on WhatsApp without making the payment request feel informal', text: 'Keep the conversation familiar while the invoice, amount due and payment link stay structured.', href: '/guides/how-to-send-an-invoice-on-whatsapp' },
  { icon: WalletCards, category: 'Payments', title: 'Partial payments without losing track of what remains', text: 'Use one invoice as the source of truth across deposits, milestones and multiple confirmed payments.', href: '/guides/how-to-handle-partial-invoice-payments' },
  { icon: ReceiptText, category: 'Invoicing', title: 'What makes an invoice professional enough for a serious client?', text: 'Clarity beats decoration: client identity, work performed, due date, totals, terms and a clear next step.', href: '/guides/how-to-create-a-professional-invoice' },
  { icon: BadgeDollarSign, category: 'Collections', title: 'A simple invoice-to-payment workflow for Nigerian small businesses', text: 'Reduce the gap between “invoice sent” and “money received” without adopting a full accounting suite.', href: '/guides/invoice-workflow-for-nigerian-businesses' },
  { icon: BookOpen, category: 'Freelancing', title: 'A lightweight invoicing system for freelancers who would rather do the work', text: 'Build a repeatable billing routine for projects, retainers, deposits and final balances.', href: '/guides/invoicing-tips-for-freelancers' },
  { icon: MessageCircle, category: 'Follow-up', title: 'How to follow up on an unpaid invoice without damaging the client relationship', text: 'Use the latest outstanding balance, a calm tone and a payment path the client can act on immediately.', href: '/guides/how-to-follow-up-on-an-unpaid-invoice' },
];

export default function BlogPage() {
  return (
    <main className="bg-white dark:bg-[#07111f]">
      <section className="border-b border-slate-200 bg-slate-950 text-white dark:border-white/10">
        <div className="page-container py-16 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">Insights</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.045em] sm:text-6xl">Better invoicing is useful. Better collections change cash flow.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Practical thinking for freelancers, agencies, consultants and service businesses that want less friction between finished work, the invoice, the client conversation and the money actually received.</p>
        </div>
      </section>

      <section className="page-container py-14 lg:py-20">
        <Link href={featured.href} className="group grid gap-8 overflow-hidden rounded-[30px] border border-slate-200 bg-emerald-50 p-7 transition hover:border-emerald-300 hover:shadow-xl dark:border-white/10 dark:bg-emerald-400/[.07] sm:p-10 lg:grid-cols-[1fr_.42fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.17em] text-emerald-700 dark:text-emerald-300">Featured perspective</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-[-.04em] text-slate-950 dark:text-white sm:text-4xl">{featured.title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">{featured.text}</p>
          </div>
          <span className="inline-flex items-center font-bold text-emerald-700 dark:text-emerald-300 lg:justify-end">Read the guide <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" /></span>
        </Link>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(({ icon: Icon, category, title, text, href }) => (
            <Link key={`${category}-${title}`} href={href} className="group rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg dark:border-white/10 dark:bg-white/[.035] dark:hover:border-emerald-400/20 dark:hover:bg-white/[.055]">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"><Icon className="h-5 w-5" /></span>
              <p className="mt-6 text-xs font-bold uppercase tracking-[.14em] text-emerald-700 dark:text-emerald-300">{category}</p>
              <h2 className="mt-2 text-xl font-bold leading-7 text-slate-950 dark:text-white">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{text}</p>
              <span className="mt-6 inline-flex items-center text-sm font-bold text-emerald-700 dark:text-emerald-300">Read more <ArrowRight className="ml-1.5 h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16 dark:border-white/10 dark:bg-[#0a1524]">
        <div className="page-container grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">The problem we keep returning to</p><h2 className="mt-4 text-3xl font-black tracking-[-.04em] text-slate-950 dark:text-white">The invoice, payment alert and client conversation should not tell three different stories.</h2></div>
          <div className="grid gap-3 sm:grid-cols-2">{['Know the latest amount due','Follow up from the real balance','Keep payment history attached to the invoice','Give the client one stable payment link'].map(item => <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[.035] dark:text-slate-200">{item}</div>)}</div>
        </div>
      </section>

      <section className="page-container py-16 text-center lg:py-20">
        <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-[-.04em] text-slate-950 dark:text-white">Prefer to learn by doing?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">Build a real invoice before signing up. Create an account only when you are ready to save and use the client payment workflow.</p>
        <Link href="/create-invoice" className="mt-7 inline-flex items-center rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-[#07111f] hover:bg-emerald-400">Create an invoice <ArrowRight className="ml-2 h-4 w-4" /></Link>
      </section>
    </main>
  );
}
