import Link from 'next/link';

const links = [
  ['Online invoice generator', '/invoice-generator', 'Create branded invoices with the details your clients need.'],
  ['Online invoicing', '/online-invoicing', 'Keep invoices, balances and payment collection in one focused workflow.'],
  ['Invoice payments', '/payments', 'Give every invoice a clear path from amount due to payment.'],
  ['WhatsApp invoicing', '/whatsapp-invoicing', 'Share invoices and payment links through a channel clients already use.'],
  ['Invoicing for freelancers', '/for-freelancers', 'A simple invoice-to-payment workflow for independent professionals.'],
  ['Features', '/features', 'See what you can do with Hip Homorrd before you create an account.'],
];

export default function LandingSeoLinks() {
  return <section className="border-y border-slate-200 bg-slate-50 py-20"><div className="page-container"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">Built around your workflow</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">One focused place to invoice, share and get paid.</h2><p className="mt-4 text-lg leading-8 text-slate-600">Explore the workflows that matter most, whether you are sending your first invoice or managing recurring client payments.</p></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{links.map(([title, href, text]) => <Link key={href} href={href} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"><h3 className="font-semibold text-slate-950 group-hover:text-emerald-700">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p><span className="mt-4 inline-block text-sm font-semibold text-emerald-700">Learn more →</span></Link>)}</div></div></section>;
}
