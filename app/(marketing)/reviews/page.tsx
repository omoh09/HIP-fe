import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, ShieldCheck } from 'lucide-react';
import VerifiedReviewStream from '@/components/reviews/verified-review-stream';

export const metadata: Metadata = {
  title: 'Verified client reviews — Hip Homorrd',
  description: 'Read client reviews verified through completed Hip Homorrd invoice payments.',
  alternates: { canonical: '/reviews' },
};

export default function ReviewsPage() {
  return (
    <>
      <section className="bg-white dark:bg-[#07111f]"><div className="page-container py-16 text-center lg:py-24"><span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800"><BadgeCheck className="h-3.5 w-3.5" />Paid-invoice verified</span><h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-6xl">What clients say after the invoice is paid.</h1><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">These reviews come from Hip Homorrd payment links. A client can submit one only after full payment, and nothing is published without public-display permission.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/create-invoice" className="inline-flex items-center rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white">Create an invoice <ArrowRight className="ml-2 h-4 w-4" /></Link><span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300"><ShieldCheck className="h-4 w-4 text-emerald-600" />No invoice amounts or client emails shown</span></div></div></section>
      <VerifiedReviewStream limit={60} layout="grid" showHeader={false} />
    </>
  );
}
