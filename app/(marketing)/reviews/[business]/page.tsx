import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Star } from 'lucide-react';

type BusinessReviews = {
  business: { name: string; username: string; logo_url?: string | null; average_rating?: number | null; review_count: number };
  reviews: Array<{ id: string; rating: number; comment: string; reviewer_name: string; verified: boolean; published_at?: string | null }>;
};

const loadBusinessReviews = cache(async (business: string): Promise<BusinessReviews | null> => {
  const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, '');
  if (!baseUrl) return null;
  const response = await fetch(`${baseUrl}/api/v1/public/businesses/${encodeURIComponent(business)}/reviews?limit=24`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 60 },
  });
  if (response.status === 404) return null;
  if (!response.ok) return null;
  const payload = await response.json();
  return payload?.data ?? null;
});

export async function generateMetadata({ params }: { params: Promise<{ business: string }> }): Promise<Metadata> {
  const { business } = await params;
  const data = await loadBusinessReviews(business);
  if (!data) return { title: 'Business reviews', robots: { index: false, follow: false } };
  const indexable = Number(data.business.review_count || 0) >= 2;
  return {
    title: `${data.business.name} reviews — Hip Homorrd`,
    description: `Verified client reviews for ${data.business.name}, collected after paid Hip Homorrd invoices.`,
    alternates: { canonical: `/reviews/${data.business.username}` },
    robots: { index: indexable, follow: true },
    openGraph: { title: `${data.business.name} — verified client reviews`, description: `${data.business.review_count} approved paid-invoice review${data.business.review_count === 1 ? '' : 's'}.`, type: 'website' },
  };
}

export default async function BusinessReviewPage({ params }: { params: Promise<{ business: string }> }) {
  const { business } = await params;
  const data = await loadBusinessReviews(business);
  if (!data) notFound();

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50"><div className="page-container py-14 lg:py-20"><div className="flex flex-col gap-6 sm:flex-row sm:items-center"><div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white text-xl font-bold text-slate-900">{data.business.logo_url ? <img src={data.business.logo_url} alt="" className="h-full w-full object-contain p-2" /> : data.business.name.slice(0,1).toUpperCase()}</div><div><div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700"><BadgeCheck className="h-4 w-4" />Verified client reviews</div><h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{data.business.name}</h1><div className="mt-3 flex items-center gap-2 text-sm text-slate-600">{data.business.average_rating ? <><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><strong className="text-slate-900">{data.business.average_rating.toFixed(1)}</strong></> : null}<span>{data.business.review_count} published review{data.business.review_count === 1 ? '' : 's'}</span></div></div></div></div></section>
      <section className="page-container py-12 lg:py-16"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{data.reviews.map((review) => <article key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><div className="flex gap-0.5 text-amber-500">{[1,2,3,4,5].map((star) => <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'fill-current' : 'text-slate-200'}`} />)}</div><span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700"><BadgeCheck className="h-3 w-3" />Verified payment</span></div><p className="mt-4 text-sm leading-7 text-slate-700">“{review.comment}”</p><p className="mt-5 border-t border-slate-100 pt-4 text-sm font-semibold text-slate-900">{review.reviewer_name}</p></article>)}</div>{!data.reviews.length && <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">No public reviews have been approved yet.</div>}<div className="mt-12 rounded-3xl bg-emerald-50 p-8 text-center"><h2 className="text-2xl font-bold text-slate-950">Run your invoice-to-payment flow on Hip Homorrd.</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">Create professional invoices, share payment-ready links and build verified social proof after clients pay.</p><Link href="/create-invoice" className="mt-6 inline-flex items-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Create an invoice <ArrowRight className="ml-2 h-4 w-4" /></Link></div></section>
    </main>
  );
}
