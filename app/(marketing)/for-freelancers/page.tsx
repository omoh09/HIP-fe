import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, MessageCircle, ReceiptText, WalletCards } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Freelance invoicing and payment collection',
  description: 'Invoice freelance projects, retainers and one-off work with professional invoices, WhatsApp sharing, payment tracking and clear outstanding balances.',
  alternates: { canonical: '/for-freelancers' },
};

const cases = [
  ['Project invoices','Invoice a completed milestone or final project balance with clear line items and terms.','/solutions/freelancers'],
  ['Retainers','Keep recurring client work organised with a consistent invoice and follow-up workflow.','/solutions/consultants'],
  ['Creative services','Use your branding on invoices for design, photography, writing and other creative work.','/solutions/designers-creatives'],
  ['Development work','Invoice software projects, maintenance and technical services with clear descriptions.','/solutions/developers'],
  ['Client deposits','Track a deposit or partial payment while keeping the remaining balance visible.','/payments'],
  ['WhatsApp clients','Share invoices and reminders from the same invoice record instead of retyping amounts into chat.','/whatsapp-invoicing'],
];

export default function FreelancersPage() {
  return (
    <main className="bg-white dark:bg-[#07111f]">
      <section className="bg-slate-950 text-white">
        <div className="page-container grid gap-10 py-16 lg:grid-cols-[.92fr_1.08fr] lg:items-center lg:py-24">
          <div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-400">For freelancers</p><h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-.045em] sm:text-6xl">Finished the work? Make the path to payment just as clear.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Create a professional invoice, share one client payment link, record deposits and partial payments, and know exactly what is still outstanding without rebuilding the story from chats and bank alerts.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/create-invoice" className="inline-flex items-center rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-emerald-300">Try the invoice builder <ArrowRight className="ml-2 h-4 w-4" /></Link><Link href="/pricing" className="rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10">See freelancer-friendly pricing</Link></div></div>
          <div className="rounded-[28px] border border-white/10 bg-white/[.045] p-6"><p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-300">Typical freelance collection</p><div className="mt-6 space-y-3">{[['Invoice sent','₦500,000 due'],['Deposit received','+₦200,000'],['Balance','₦300,000 remaining'],['Follow-up','Send latest balance, not old total']].map(([title,text],i)=><div key={title} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.035] p-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-xs font-black text-slate-950">0{i+1}</span><div><p className="text-sm font-bold text-white">{title}</p><p className="mt-1 text-xs text-slate-400">{text}</p></div></div>)}</div></div>
        </div>
      </section>

      <section className="page-container py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[.74fr_1.26fr]">
          <div><p className="text-sm font-semibold uppercase tracking-[.14em] text-emerald-700 dark:text-emerald-300">The freelance pain</p><h2 className="mt-4 text-3xl font-black tracking-[-.04em] text-slate-950 dark:text-white">The invoice is rarely where the admin ends.</h2><p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">The proposal may be in email, the client conversation in WhatsApp, the invoice in a PDF and the payment in a bank alert. Hip Homorrd keeps the financial part connected so you can see the current balance before you contact the client again.</p></div>
          <div className="grid gap-4 sm:grid-cols-3"><Mini icon={ReceiptText} title="Create once" text="Keep service, rates, terms and client details in one professional invoice."/><Mini icon={MessageCircle} title="Share clearly" text="Send a stable client link through WhatsApp, email or another channel."/><Mini icon={WalletCards} title="Track the money" text="Full or partial payments update what is still owed."/></div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16 dark:border-white/10 dark:bg-[#0a1524] lg:py-20">
        <div className="page-container"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">Different work. Same collection loop.</p><h2 className="mt-4 text-3xl font-black tracking-[-.04em] text-slate-950 dark:text-white">Built around the jobs freelancers actually invoice.</h2><p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">You might charge a fixed project fee today, a retainer next month or a deposit before starting work. The invoice structure changes; the need to know what has been paid does not.</p></div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{cases.map(([title,text,href])=><Link href={href} key={title} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md dark:border-white/10 dark:bg-white/[.035] dark:hover:border-emerald-400/20"><h3 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{text}</p><span className="mt-5 inline-flex items-center text-sm font-bold text-emerald-700 dark:text-emerald-300">Explore <ArrowRight className="ml-1.5 h-4 w-4 transition group-hover:translate-x-1" /></span></Link>)}</div></div>
      </section>

      <section className="page-container py-16 lg:py-20">
        <div className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-white/[.035] sm:p-9 lg:grid-cols-2">
          <div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">A useful freelancer workspace should answer</p><h2 className="mt-4 text-3xl font-black tracking-[-.04em] text-slate-950 dark:text-white">Who owes me, how much, and what should I do next?</h2></div>
          <div className="grid gap-3">{['Which clients still have an outstanding balance?','Did this client pay a deposit already?','What link should I send them now?','What amount belongs in the next reminder?'].map(item=><div key={item} className="flex gap-3 rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-200"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" />{item}</div>)}</div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-center text-white"><div className="page-container"><h2 className="mx-auto max-w-3xl text-3xl font-black tracking-[-.04em] sm:text-4xl">Spend your time on the client work, not reconstructing payment history.</h2><p className="mx-auto mt-4 max-w-2xl text-slate-300">Build the invoice first. Sign up only when you are ready to save it, share the client link and use the collection workflow.</p><Link href="/create-invoice" className="mt-7 inline-flex items-center rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-emerald-300">Create an invoice <ArrowRight className="ml-2 h-4 w-4" /></Link></div></section>
    </main>
  );
}

function Mini({ icon: Icon, title, text }: { icon: typeof ReceiptText; title: string; text: string }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[.035]"><Icon className="h-5 w-5 text-emerald-700 dark:text-emerald-300"/><h3 className="mt-4 font-bold text-slate-950 dark:text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{text}</p></article>;
}
