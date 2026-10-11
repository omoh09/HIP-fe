import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, FileText, MessageCircle, RefreshCw, Smartphone, WalletCards } from 'lucide-react';
import WhatsAppOverviewExperience, { WhatsAppMessageTemplates } from '@/components/marketing/whatsapp/whatsapp-overview-experience';

export const metadata: Metadata = {
  title: 'WhatsApp invoicing for freelancers and small businesses',
  description: 'Create an invoice once, share it through WhatsApp, collect payments and keep the remaining balance visible in Hip Homorrd.',
  alternates: { canonical: '/whatsapp-invoicing' },
};

const workflows = [
  ['Send an invoice on WhatsApp', 'Share a professional invoice with the invoice number, amount due and payment path already connected.', '/whatsapp-invoicing/send-invoice-on-whatsapp', FileText],
  ['Send payment reminders', 'Follow up on an unpaid or partially paid invoice without rebuilding the message from scratch.', '/whatsapp-invoicing/whatsapp-payment-reminders', RefreshCw],
  ['Share the invoice PDF', 'Give clients the document they expect while keeping the payment link in the same conversation.', '/whatsapp-invoicing/whatsapp-invoice-pdf', Smartphone],
  ['WhatsApp invoicing in Nigeria', 'Create naira invoices, handle Nigerian client numbers and keep balances easy to understand.', '/whatsapp-invoicing/nigeria', MessageCircle],
] as const;

export default function WhatsAppPage() {
  return (
    <main className="overflow-hidden bg-white dark:bg-[#07111f]">
      <section className="relative border-b border-emerald-100 bg-[linear-gradient(180deg,#f0fdf4_0%,#ffffff_88%)] dark:border-white/10 dark:bg-[linear-gradient(180deg,#0b2a24_0%,#07111f_88%)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(16,185,129,.12),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(37,211,102,.12),transparent_26%)] dark:bg-[radial-gradient(circle_at_20%_15%,rgba(16,185,129,.16),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(37,211,102,.08),transparent_26%)]" />
        <div className="page-container relative grid gap-12 py-16 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp invoicing
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-[-0.045em] text-slate-950 dark:text-white sm:text-6xl lg:text-[68px] lg:leading-[1.02]">Create the invoice once. Keep the client conversation moving.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">Hip Homorrd connects the professional invoice to the place many clients already respond fastest: WhatsApp. Share the amount due, send the payment path, follow up on what remains and keep the invoice status in one workflow.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/create-invoice" className="inline-flex items-center rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800">Create an invoice <ArrowRight className="ml-2 h-4 w-4" /></Link>
              <Link href="/whatsapp-invoicing/send-invoice-on-whatsapp" className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">See the workflow</Link>
            </div>
            <div className="mt-9 grid max-w-xl gap-3 sm:grid-cols-3">
              {['No copy-pasting totals', 'Partial balances stay clear', 'PDF + payment path'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs font-medium text-slate-600"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-3 w-3" /></span>{item}</div>
              ))}
            </div>
          </div>
          <WhatsAppOverviewExperience />
        </div>
      </section>

      <section className="page-container py-18 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Why it matters</p>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-5xl">WhatsApp should be the conversation layer—not your accounting system.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Chat is great for getting a response. It is not great for remembering invoice totals, deposits, due dates and what is still outstanding. Hip Homorrd keeps the financial record structured while WhatsApp stays fast and familiar.</p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <ValueCard icon={FileText} title="The invoice stays professional" text="Your client gets a proper invoice with your business details, services, totals and payment terms—not a price typed into chat." />
          <ValueCard icon={MessageCircle} title="The message stays contextual" text="Share the invoice number, amount due and payment route without manually recreating the important details each time." />
          <ValueCard icon={WalletCards} title="The balance stays accurate" text="When a client pays part of the invoice, follow up on the remaining amount instead of repeatedly asking for the original total." />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-18 lg:py-24">
        <div className="page-container"><WhatsAppMessageTemplates /></div>
      </section>

      <section className="page-container py-18 lg:py-24">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Explore the workflow</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-4xl">Use WhatsApp at each point where the client needs a nudge.</h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-slate-600">From first send to final balance, each workflow begins with the invoice so your message stays tied to the latest payment status.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {workflows.map(([title, text, href, Icon], index) => (
            <Link key={href} href={href} className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_22px_55px_-32px_rgba(15,23,42,.35)]">
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white"><Icon className="h-5 w-5" /></span>
                <span className="text-xs font-semibold text-slate-300">0{index + 1}</span>
              </div>
              <h3 className="mt-7 text-2xl font-semibold text-slate-950">{title}</h3>
              <p className="mt-3 max-w-xl leading-7 text-slate-600">{text}</p>
              <span className="mt-6 inline-flex items-center text-sm font-semibold text-emerald-700">Explore <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 py-18 text-white lg:py-24">
        <div className="page-container grid gap-10 lg:grid-cols-[1fr_.8fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">One source of truth</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-[-0.035em] sm:text-5xl">Your client can stay in WhatsApp. Your business does not have to.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Hip Homorrd keeps invoices, payments, partial balances and follow-up organized behind the conversation, so you can communicate naturally without losing financial clarity.</p>
            <Link href="/create-invoice" className="mt-8 inline-flex items-center rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">Start invoicing <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Create', 'Build the invoice with client, service, taxes and terms.'],
              ['Share', 'Open WhatsApp with the payment-ready invoice message.'],
              ['Collect', 'Record or reflect payments against the invoice.'],
              ['Follow up', 'Send the remaining balance—not an outdated total.'],
            ].map(([title, text]) => <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-sm font-semibold text-white">{title}</p><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></div>)}
          </div>
        </div>
      </section>
    </main>
  );
}

function ValueCard({ icon: Icon, title, text }: { icon: typeof FileText; title: string; text: string }) {
  return <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-35px_rgba(15,23,42,.35)]"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white"><Icon className="h-5 w-5" /></span><h3 className="mt-6 text-xl font-semibold text-slate-950">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p></article>;
}
