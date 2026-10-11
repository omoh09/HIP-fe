import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CircleHelp, Handshake, LockKeyhole, Mail, ReceiptText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Hip Homorrd',
  description: 'Get help with Hip Homorrd, account access, invoices, payments, privacy or partnership enquiries.',
  alternates: { canonical: '/contact' },
};

const reasons = [
  { icon: CircleHelp, title: 'Product support', text: 'Questions about creating invoices, clients, reports, sharing or day-to-day product use.', subject: 'Product support' },
  { icon: ReceiptText, title: 'Invoice or payment issue', text: 'Tell us the invoice number or payment reference where available so the issue is easier to trace.', subject: 'Invoice or payment support' },
  { icon: LockKeyhole, title: 'Privacy or security', text: 'Report a privacy request, suspicious activity or a potential security issue without posting sensitive details publicly.', subject: 'Privacy or security' },
  { icon: Handshake, title: 'Partnerships', text: 'For business partnerships, integrations and commercial enquiries.', subject: 'Partnership enquiry' },
];

export default function ContactPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="page-container py-16 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Contact</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-6xl">Get to the right help without getting passed around.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Send us enough context to understand what you are trying to do. For account or payment issues, never email your password, one-time code, full card number or other authentication secrets.</p>
        </div>
      </section>

      <section className="page-container py-14 lg:py-20">
        <div className="grid gap-5 md:grid-cols-2">
          {reasons.map(({ icon: Icon, title, text, subject }) => (
            <article key={title} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5" /></span>
              <h2 className="mt-5 text-xl font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
              <a href={`mailto:support@hiphomorrd.com?subject=${encodeURIComponent(subject)}`} className="mt-5 inline-flex items-center text-sm font-semibold text-emerald-700">Email this team <ArrowRight className="ml-1.5 h-4 w-4" /></a>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-6 rounded-[28px] bg-slate-950 p-7 text-white sm:p-10 lg:grid-cols-[1fr_.7fr] lg:items-center">
          <div><Mail className="h-6 w-6 text-emerald-300" /><h2 className="mt-5 text-3xl font-bold tracking-tight">One inbox. Clear context.</h2><p className="mt-4 max-w-2xl text-slate-300">Email <strong className="text-white">support@hiphomorrd.com</strong>. Include the email on your account and, where relevant, the invoice number or payment reference. Do not include passwords, OTPs or complete payment-card details.</p></div>
          <div className="flex flex-col gap-3"><a href="mailto:support@hiphomorrd.com" className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-slate-950 hover:bg-emerald-300">Email support</a><Link href="/guides" className="inline-flex items-center justify-center rounded-xl border border-white/15 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10">Browse guides</Link></div>
        </div>
      </section>
    </main>
  );
}
