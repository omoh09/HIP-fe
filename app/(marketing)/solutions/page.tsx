import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Invoicing solutions for freelancers and service businesses',
  description: 'Explore Hip Homorrd invoicing workflows for freelancers, consultants, creatives, developers, agencies, contractors and coaches.',
  alternates: { canonical: '/solutions' },
};

const items = [
  ['Freelancers', 'Turn one-off projects, retainers and milestones into a repeatable invoice-and-follow-up routine.', '/solutions/freelancers'],
  ['Consultants', 'Present advisory work clearly, bill retainers and keep payment follow-up professional.', '/solutions/consultants'],
  ['Designers & creatives', 'Invoice deposits, milestones and final delivery without losing the project story.', '/solutions/designers-creatives'],
  ['Developers', 'Bill fixed-price builds, hourly work, maintenance and technical retainers with less admin.', '/solutions/developers'],
  ['Agencies', 'Keep client billing consistent across campaigns, retainers and project work.', '/solutions/agencies'],
  ['Contractors', 'Track deposits, job balances and final payments from one invoice record.', '/solutions/contractors'],
  ['Coaches', 'Invoice programmes, packages and sessions with a payment path clients can act on.', '/solutions/coaches'],
];

export default function SolutionsPage() {
  return (
    <main className="bg-white">
      <section className="overflow-hidden border-b border-slate-200 bg-slate-50">
        <div className="page-container grid gap-12 py-16 lg:grid-cols-[1fr_.8fr] lg:items-center lg:py-24">
          <div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">Solutions</p><h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-6xl">One invoice workflow, adapted to the way you sell your service.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">A designer bills differently from a contractor. A consultant may work on retainers while a developer bills milestones. Hip Homorrd keeps the core process consistent while leaving room for the details that make each service business different.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/create-invoice" className="inline-flex items-center rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-800">Try it with your next invoice <ArrowRight className="ml-2 h-4 w-4" /></Link><Link href="/features" className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">Explore features</Link></div></div>
          <div className="relative overflow-hidden rounded-[28px] bg-slate-900 p-3 shadow-xl"><div className="relative aspect-[3/4] max-h-[520px] overflow-hidden rounded-[20px]"><Image src="/images/marketing/client-phone.webp" alt="Professional using a smartphone during a client conversation" fill sizes="(max-width: 1024px) 100vw, 38vw" className="object-cover" /></div><div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Designed around client behavior</p><p className="mt-2 text-sm font-semibold text-slate-950">Keep the invoice structured even when the conversation happens on your phone.</p></div></div>
        </div>
      </section>

      <section className="page-container py-14 lg:py-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{items.map(([title, text, href]) => <Link key={href} href={href} className="group rounded-[22px] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"><h2 className="text-xl font-semibold text-slate-950">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p><span className="mt-6 inline-flex items-center font-semibold text-emerald-700">See the workflow <ArrowRight className="ml-1.5 h-4 w-4 transition group-hover:translate-x-1" /></span></Link>)}</div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 py-16 text-white"><div className="page-container grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-300">Across every service business</p><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">The outcome is the same: make it easier for the client to understand, act and pay.</h2></div><div className="grid gap-3 sm:grid-cols-2">{['A professional invoice','A familiar sharing channel','A visible payment status','A clear remaining balance'].map(item => <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-semibold"><CheckCircle2 className="h-4 w-4 text-emerald-300" />{item}</div>)}</div></div></section>
    </main>
  );
}
