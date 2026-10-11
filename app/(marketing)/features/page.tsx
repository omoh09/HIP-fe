import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BarChart3, BellRing, FileText, MessageCircle, ReceiptText, WalletCards } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Invoice and payment features',
  description: 'Explore Hip Homorrd features for creating invoices, collecting payments, sending reminders, sharing through WhatsApp and tracking balances.',
  alternates: { canonical: '/features' },
};

const features = [
  { icon: FileText, stage: 'Create', title: 'Professional invoices', text: 'Build invoices with client details, line items, taxes, due dates, notes and your business branding—without starting from a blank document.' },
  { icon: MessageCircle, stage: 'Share', title: 'WhatsApp invoicing', text: 'Move the invoice into the conversation your client already checks while keeping the amount, invoice reference and payment path together.' },
  { icon: WalletCards, stage: 'Collect', title: 'Payment collection', text: 'Give clients a direct next step from invoice to payment, with payment status confirmed through the server-side flow.' },
  { icon: ReceiptText, stage: 'Track', title: 'Partial payments', text: 'Record what has been received and keep the remaining balance visible instead of treating every instalment as a separate invoice.' },
  { icon: BellRing, stage: 'Follow up', title: 'Payment reminders', text: 'Follow up from the latest invoice status so a reminder asks for the amount actually outstanding—not an old total copied from chat.' },
  { icon: BarChart3, stage: 'Review', title: 'Reports and activity', text: 'See paid revenue, outstanding balances and invoice activity from a responsive workspace built for quick decisions.' },
];

export default function FeaturesPage() {
  return (
    <main className="bg-white dark:bg-[#07111f]">
      <section className="border-b border-slate-200 bg-[linear-gradient(180deg,#ecfdf5_0%,#ffffff_92%)] dark:border-white/10 dark:bg-[linear-gradient(180deg,#0b2a24_0%,#07111f_92%)]"><div className="page-container py-16 lg:py-24"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">Product features</p><h1 className="mt-4 max-w-5xl text-4xl font-bold tracking-[-0.045em] text-slate-950 dark:text-white sm:text-6xl">Everything around the invoice, without everything an accounting suite can do.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">Hip Homorrd focuses on the actions that move a client invoice forward: create it, share it, collect payment, update the balance and know what needs attention next.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/create-invoice" className="inline-flex items-center rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-800">Try the invoice builder <ArrowRight className="ml-2 h-4 w-4" /></Link><Link href="/pricing" className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10">View pricing</Link></div></div></section>

      <section className="page-container py-14 lg:py-20"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{features.map(({ icon: Icon, stage, title, text }) => <article key={title} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[.035]"><div className="flex items-center justify-between gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5" /></span><span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{stage}</span></div><h2 className="mt-6 text-xl font-semibold text-slate-950 dark:text-white">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{text}</p></article>)}</div></section>

      <section className="border-y border-slate-200 bg-slate-50 py-16 dark:border-white/10 dark:bg-[#0a1524] lg:py-20"><div className="page-container"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">The product logic</p><h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Each feature should remove a handoff.</h2><p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">The goal is not to collect features. It is to reduce the number of times you copy an amount, search for an old message, check a bank alert, reopen a spreadsheet or wonder whether the client paid part of an invoice.</p></div><div className="mt-10 grid gap-3 md:grid-cols-5">{['Create once','Share anywhere','Collect','Update balance','Follow up'].map((item,index)=><div key={item} className="rounded-xl bg-white p-4 text-center text-sm font-semibold text-slate-800 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"><span className="mb-2 block text-xs text-emerald-600">0{index+1}</span>{item}</div>)}</div></div></section>

      <section className="page-container py-16 lg:py-20"><div className="rounded-[28px] bg-slate-950 p-8 text-white sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10"><div><h2 className="text-3xl font-bold tracking-tight">Do not take our word for the workflow. Build one.</h2><p className="mt-3 max-w-2xl text-slate-300">You can fill out the invoice form before creating an account. Sign in only when you are ready to save, download or share it.</p></div><Link href="/create-invoice" className="mt-7 inline-flex shrink-0 items-center rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-slate-950 hover:bg-emerald-300 lg:mt-0">Create an invoice <ArrowRight className="ml-2 h-4 w-4" /></Link></div></section>
    </main>
  );
}
