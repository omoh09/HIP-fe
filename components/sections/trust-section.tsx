import { CheckCircle2, LockKeyhole, ReceiptText, Smartphone } from 'lucide-react';

const points = [
  { icon: ReceiptText, title: 'Professional by default', text: 'Branded invoices that are clear, consistent and easy for clients to understand.' },
  { icon: Smartphone, title: 'Built for the way you work', text: 'Create and share invoices from your phone or desktop without a complicated accounting workflow.' },
  { icon: LockKeyhole, title: 'Payments stay explicit', text: 'Payment status, references and balances are shown clearly so you know what has actually been collected.' },
  { icon: CheckCircle2, title: 'Designed for real cash flow', text: 'Support partial payments and outstanding balances instead of treating every invoice as all-or-nothing.' },
];

export default function TrustSection() {
  return <section className="border-y border-slate-200 bg-white py-20"><div className="page-container"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">Built for trust</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Your invoice is part of your reputation.</h2><p className="mt-4 text-lg leading-8 text-slate-600">Every client interaction should feel professional — from the first invoice to the final payment confirmation.</p></div><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{points.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5" /></span><h3 className="mt-5 font-semibold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}</div></div></section>;
}
