import { ArrowRight, CheckCircle2, CreditCard, FileText, Send } from 'lucide-react';

const steps = [
  { icon: FileText, number: '01', title: 'Create', description: 'Add your client, line items, dates and payment terms.' },
  { icon: Send, number: '02', title: 'Share', description: 'Send a polished invoice by link, email or WhatsApp.' },
  { icon: CreditCard, number: '03', title: 'Collect', description: 'Your client pays through the connected payment flow.' },
  { icon: CheckCircle2, number: '04', title: 'Track', description: 'See paid, partial, pending and overdue balances in one place.' },
];

export default function HipWorksSection() {
  return <section className="bg-white py-24"><div className="page-container"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">How it works</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">From invoice to payment without the busywork.</h2><p className="mt-5 text-lg leading-8 text-slate-600">A focused workflow for people who want to spend time doing the work, not chasing paperwork.</p></div><div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{steps.map(({ icon: Icon, number, title, description }) => <div key={number} className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-lg"><div className="flex items-center justify-between"><span className="text-xs font-bold tracking-wider text-slate-400">{number}</span><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5" /></span></div><h3 className="mt-8 text-lg font-semibold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></div>)}</div><div className="mt-10 flex items-center gap-2 text-sm font-medium text-slate-500"><ArrowRight className="h-4 w-4 text-emerald-600" />The goal is simple: get the invoice out and get paid.</div></div></section>;
}
