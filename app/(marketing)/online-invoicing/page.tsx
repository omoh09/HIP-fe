import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, FileText, MessageCircle, PieChart, Smartphone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Online invoicing for freelancers and small businesses',
  description: 'Create professional invoices, share them with clients, track partial payments and follow up on outstanding balances with Hip Homorrd.',
  alternates: { canonical: '/online-invoicing' },
};

const steps = [
  ['Create the invoice', 'Add the client, services, quantities, rates, taxes, due date and payment terms in one structured document.'],
  ['Send it where the client responds', 'Share the invoice through WhatsApp, email, PDF or a payment-ready link instead of rebuilding the details in each channel.'],
  ['Track what happens next', 'Keep paid, partial and outstanding invoices visible so follow-up begins from the latest balance—not from memory.'],
];

export default function OnlineInvoicingPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="page-container grid gap-10 py-16 lg:grid-cols-[1fr_.75fr] lg:items-center lg:py-24">
          <div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">Online invoicing</p><h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-6xl">Invoice clients without turning invoicing into an accounting project.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">Hip Homorrd gives independent professionals and growing businesses a focused place to create invoices, share them with clients and keep payment follow-up connected to the amount that is actually due.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/create-invoice" className="inline-flex items-center rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-800">Start invoicing <ArrowRight className="ml-2 h-4 w-4" /></Link><Link href="/whatsapp-invoicing" className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Explore WhatsApp invoicing</Link></div></div>
          <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-45px_rgba(15,23,42,.4)]"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Invoice INV-0048</p><p className="mt-2 text-lg font-semibold text-slate-950">David Adebayo</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Partial</span></div><div className="mt-8 grid grid-cols-3 gap-2">{[['Total','₦250k'],['Paid','₦100k'],['Due','₦150k']].map(([l,v])=><div key={l} className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">{l}</p><p className="mt-1 text-sm font-bold text-slate-900">{v}</p></div>)}</div><div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs font-medium text-emerald-800">Payment activity stays attached to the invoice.</div></div>
        </div>
      </section>

      <section className="page-container py-16 lg:py-20"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">One repeatable workflow</p><h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">From work completed to money collected.</h2><p className="mt-4 text-base leading-7 text-slate-600">The product is designed around the small number of actions that happen every time you bill a client.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3">{steps.map(([title,text],index)=><article key={title} className="rounded-[22px] border border-slate-200 bg-white p-6"><span className="text-xs font-bold text-emerald-600">0{index+1}</span><h3 className="mt-5 text-xl font-semibold text-slate-950">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p></article>)}</div></section>

      <section className="border-y border-slate-200 bg-slate-50 py-16"><div className="page-container grid gap-5 md:grid-cols-2 lg:grid-cols-4"><Feature icon={FileText} title="Professional documents" text="Keep client, service, tax and payment details in a consistent invoice format."/><Feature icon={MessageCircle} title="Flexible sharing" text="Use the client channel that makes sense without losing the invoice context."/><Feature icon={PieChart} title="Balance visibility" text="See what is paid, partially paid or still outstanding before you follow up."/><Feature icon={Smartphone} title="Responsive workflow" text="Review and manage invoices from a workspace designed for desktop and mobile."/></div></section>

      <section className="page-container py-16 lg:py-20"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><h2 className="text-3xl font-bold tracking-tight text-slate-950">Built for businesses that need invoicing—not an accounting department.</h2><p className="mt-4 text-base leading-7 text-slate-600">You should not need to configure a large finance system just to send a clean invoice and know whether it has been paid. Hip Homorrd keeps the workflow narrow enough to understand and useful enough to run every week.</p></div><div className="grid gap-3 sm:grid-cols-2">{['Clear invoice status','Partial payment tracking','Client records','Payment-ready sharing'].map(item=><div key={item} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-3.5 w-3.5"/></span>{item}</div>)}</div></div></section>
    </main>
  );
}

function Feature({icon:Icon,title,text}:{icon:typeof FileText;title:string;text:string}){return <div className="rounded-2xl border border-slate-200 bg-white p-5"><Icon className="h-5 w-5 text-emerald-700"/><h3 className="mt-4 font-semibold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>}
