import Link from 'next/link';
import { BadgeCheck, Star } from 'lucide-react';

export type PublicReview = {
  id: string;
  rating: number;
  comment: string;
  reviewer_name: string;
  verified: boolean;
  published_at?: string | null;
  business?: { name?: string | null; username?: string | null; logo_url?: string | null };
};

async function loadReviews(limit: number): Promise<PublicReview[]> {
  const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, '');
  if (!baseUrl) return [];

  try {
    const response = await fetch(`${baseUrl}/api/v1/public/reviews?limit=${limit}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch {
    return [];
  }
}

function ReviewCard({ review, compact = false }: { review: PublicReview; compact?: boolean }) {
  return (
    <article className={`${compact ? 'w-[300px] shrink-0 sm:w-[340px]' : 'h-full'} rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[.045]`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-0.5 text-amber-500">
          {[1,2,3,4,5].map((star) => <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} />)}
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"><BadgeCheck className="h-3 w-3" />Verified payment</span>
      </div>
      <p className={`${compact ? 'line-clamp-5' : ''} mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300`}>“{review.comment}”</p>
      <div className="mt-5 border-t border-slate-100 pt-4 dark:border-white/10">
        <p className="text-sm font-semibold text-slate-950 dark:text-white">{review.reviewer_name}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Client of {review.business?.username ? <Link href={`/reviews/${review.business.username}`} className="font-medium text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300">{review.business?.name || review.business.username}</Link> : (review.business?.name || 'a Hip Homorrd business')}</p>
      </div>
    </article>
  );
}

export default async function VerifiedReviewStream({
  limit = 9,
  layout = 'marquee',
  showHeader = true,
}: {
  limit?: number;
  layout?: 'marquee' | 'grid';
  showHeader?: boolean;
}) {
  const reviews = await loadReviews(limit);
  const marqueeReviews = reviews.length > 1 ? [...reviews, ...reviews] : reviews;

  return (
    <section className="border-y border-slate-200 bg-slate-50 py-20 dark:border-white/10 dark:bg-[#0a1524] lg:py-24">
      <div className="page-container">
        {showHeader && (
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,.12)]" />Verified review stream</div>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-slate-950 dark:text-white sm:text-4xl">Real feedback attached to real paid invoices.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">Clients can leave feedback only after a fully paid invoice. Public reviews appear here only when the client allows public display and the business approves them.</p>
            </div>
            {layout === 'marquee' && <Link href="/reviews" className="text-sm font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200">View more feedback →</Link>}
          </div>
        )}

        {reviews.length ? (
          layout === 'grid' ? (
            <div className={`${showHeader ? 'mt-9' : ''} grid gap-4 md:grid-cols-2 xl:grid-cols-3`}>
              {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
            </div>
          ) : (
            <div className={`${showHeader ? 'mt-9' : ''} review-marquee-shell overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]`} aria-label="Verified client reviews">
              <div className={`review-marquee-track flex w-max gap-4 ${reviews.length <= 1 ? '!animate-none' : ''}`}>
                {marqueeReviews.map((review, index) => <ReviewCard key={`${review.id}-${index}`} review={review} compact />)}
              </div>
            </div>
          )
        ) : (
          <div className={`${showHeader ? 'mt-9' : ''} rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-white/15 dark:bg-white/[.035]`}><p className="font-semibold text-slate-900 dark:text-white">The verified stream starts with your first published client review.</p><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Hip Homorrd will not invent testimonials to make this section look busy.</p></div>
        )}
      </div>
    </section>
  );
}
