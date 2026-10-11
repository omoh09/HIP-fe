import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export type SolutionPageData = {
  eyebrow: string;
  title: string;
  description: string;
  pain: string;
  outcomes: { title: string; text: string }[];
  workflow: { title: string; text: string }[];
  goodFor: string[];
  faqs: { q: string; a: string }[];
};

export default function SeoSolutionPage({ data }: { data: SolutionPageData }) {
  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="page-container py-16 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">{data.eyebrow}</p>
          <h1 className="mt-4 max-w-5xl text-4xl font-bold tracking-[-0.045em] text-slate-950 sm:text-6xl">{data.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{data.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/create-invoice" className="inline-flex items-center rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white shadow-sm hover:bg-slate-800">Try it with an invoice <ArrowRight className="ml-2 h-4 w-4" /></Link>
            <Link href="/pricing" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100">View pricing</Link>
          </div>
        </div>
      </section>

      <section className="page-container py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
          <div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">The friction</p><h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">The invoice should not become another project.</h2><p className="mt-4 text-base leading-7 text-slate-600">{data.pain}</p></div>
          <div className="grid gap-5 md:grid-cols-3">{data.outcomes.map((item) => <article key={item.title} className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5 h-2 w-12 rounded-full bg-emerald-500"/><h3 className="text-lg font-semibold text-slate-950">{item.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p></article>)}</div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white lg:py-20">
        <div className="page-container"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-400">A simpler collection workflow</p><h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Create the invoice. Put it in front of the client. Keep the balance current.</h2><div className="mt-10 grid gap-5 md:grid-cols-3">{data.workflow.map((step,index)=><article key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-6"><span className="text-sm font-semibold text-emerald-400">0{index+1}</span><h3 className="mt-4 text-lg font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{step.text}</p></article>)}</div></div>
      </section>

      <section className="page-container py-16 lg:py-20"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">A good fit when you</p><h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">Need payment clarity more than accounting complexity.</h2></div><div className="grid gap-3 sm:grid-cols-2">{data.goodFor.map(item => <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium leading-6 text-slate-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{item}</div>)}</div></div></section>

      <section className="border-y border-slate-200 bg-slate-50 py-16 lg:py-20"><div className="page-container"><div className="mx-auto max-w-4xl"><h2 className="text-3xl font-bold tracking-tight text-slate-950">Frequently asked questions</h2><div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">{data.faqs.map(faq=><article key={faq.q} className="py-6"><h3 className="font-semibold text-slate-950">{faq.q}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{faq.a}</p></article>)}</div></div></div></section>

      <section className="bg-emerald-50 py-16"><div className="page-container text-center"><h2 className="text-3xl font-bold text-slate-950">Try the workflow before you create an account.</h2><p className="mx-auto mt-3 max-w-2xl text-slate-600">Build the invoice first. When you are ready to save or share it, Hip Homorrd will ask you to sign in or create a free account.</p><Link href="/create-invoice" className="mt-7 inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700">Create an invoice <ArrowRight className="ml-2 h-4 w-4" /></Link></div></section>
    </main>
  );
}
