'use client';

import { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, EyeOff, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Review = {
  id: string;
  rating: number;
  comment: string;
  reviewer_name?: string | null;
  is_public: boolean;
  status: 'pending' | 'approved' | 'hidden';
  verified_at?: string | null;
  published_at?: string | null;
  invoice?: { invoice_number?: string; client_name?: string; client_email?: string } | null;
};

export default function ReviewManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'hidden'>('all');
  const [working, setWorking] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadReviews() {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load reviews');
      setReviews(Array.isArray(data?.data) ? data.data : []);
    } catch (error: any) {
      setMessage(error?.message || 'Unable to load reviews.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadReviews(); }, []);

  async function updateReview(id: string, status: 'approved' | 'hidden') {
    try {
      setWorking(id);
      setMessage(null);
      const response = await fetch(`/api/reviews/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to update review');
      setReviews((current) => current.map((review) => review.id === id ? { ...review, status, published_at: status === 'approved' ? (review.published_at || new Date().toISOString()) : null } : review));
      setMessage(data?.message || 'Review updated.');
    } catch (error: any) {
      setMessage(error?.message || 'Unable to update review.');
    } finally {
      setWorking(null);
    }
  }

  const visible = useMemo(() => filter === 'all' ? reviews : reviews.filter((review) => review.status === filter), [filter, reviews]);
  const published = reviews.filter((review) => review.status === 'approved').length;
  const pending = reviews.filter((review) => review.status === 'pending').length;

  return (
    <section className="page-container py-8 lg:py-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="text-sm font-medium text-emerald-700">Social proof</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Client reviews</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Reviews can only be submitted from fully paid invoice links. Publish client-approved reviews to the Hip Homorrd review stream, or keep them private.</p></div>
        <div className="flex gap-2"><span className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">{pending} pending</span><span className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">{published} live</span></div>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">{(['all','pending','approved','hidden'] as const).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize ${filter === item ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>{item}</button>)}</div>
      {message && <div className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">{message}</div>}

      {loading ? <div className="mt-10 flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Loading reviews…</div> : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {visible.map((review) => (
            <article key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4"><div className="flex gap-0.5 text-amber-500">{[1,2,3,4,5].map((star) => <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'fill-current' : 'text-slate-200'}`} />)}</div><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${review.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : review.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{review.status}</span></div>
              <p className="mt-4 text-sm leading-7 text-slate-700">“{review.comment}”</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500"><span className="font-semibold text-slate-900">{review.reviewer_name || review.invoice?.client_name || 'Client'}</span><span className="inline-flex items-center gap-1 text-emerald-700"><BadgeCheck className="h-3.5 w-3.5" />Paid invoice</span>{review.invoice?.invoice_number && <span>{review.invoice.invoice_number}</span>}</div>
              <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">{review.is_public ? 'Client allowed public display.' : 'Private feedback — client did not allow public display.'}</div>
              <div className="mt-4 flex gap-2">
                {review.status !== 'approved' && review.is_public && <Button size="sm" onClick={() => updateReview(review.id, 'approved')} disabled={working === review.id} className="bg-emerald-600 text-white hover:bg-emerald-700">{working === review.id ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <BadgeCheck className="mr-1.5 h-3.5 w-3.5" />}Publish</Button>}
                {review.status !== 'hidden' && <Button size="sm" variant="outline" onClick={() => updateReview(review.id, 'hidden')} disabled={working === review.id}><EyeOff className="mr-1.5 h-3.5 w-3.5" />Hide</Button>}
              </div>
            </article>
          ))}
          {!visible.length && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">No reviews in this view yet. A client can leave one after fully paying an invoice.</div>}
        </div>
      )}
    </section>
  );
}
