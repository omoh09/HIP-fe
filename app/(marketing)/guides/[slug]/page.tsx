import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Clock3 } from 'lucide-react';
import { getMarketingGuide, marketingGuides } from '@/lib/marketing-guides';

export function generateStaticParams() {
  return marketingGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getMarketingGuide(slug);
  if (!guide) return {};
  return { title: guide.title, description: guide.description, alternates: { canonical: `/guides/${guide.slug}` } };
}

export default async function GuideArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getMarketingGuide(slug);
  if (!guide) notFound();

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="page-container py-12 lg:py-18">
          <Link href="/guides" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-950"><ArrowLeft className="mr-2 h-4 w-4" />All guides</Link>
          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">{guide.category}</span><span className="inline-flex items-center gap-1.5 text-xs text-slate-400"><Clock3 className="h-3.5 w-3.5" />{guide.readTime}</span></div>
            <h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-6xl">{guide.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{guide.description}</p>
          </div>
        </div>
      </section>

      <article className="page-container grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:py-18">
        <div className="max-w-3xl">
          <p className="text-xl leading-9 text-slate-700">{guide.intro}</p>
          <div className="mt-12 space-y-12">
            {guide.sections.map((section, index) => (
              <section key={section.heading}>
                <div className="flex items-start gap-4"><span className="mt-1 text-xs font-bold text-emerald-600">0{index + 1}</span><div><h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-base leading-8 text-slate-600">{paragraph}</p>)}{section.bullets && <ul className="mt-5 space-y-3">{section.bullets.map((bullet) => <li key={bullet} className="flex items-start gap-3 text-sm leading-7 text-slate-700"><span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-3 w-3" /></span>{bullet}</li>)}</ul>}</div></div>
              </section>
            ))}
          </div>
          <div className="mt-14 rounded-[24px] border border-emerald-200 bg-emerald-50 p-6 sm:p-7"><p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Key takeaway</p><p className="mt-3 text-lg font-semibold leading-8 text-slate-950">{guide.takeaway}</p></div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Put it into practice</p><h2 className="mt-3 text-xl font-semibold text-slate-950">Create the invoice once. Keep payment follow-up connected.</h2><p className="mt-3 text-sm leading-6 text-slate-600">Hip Homorrd is built around the same create → share → collect workflow covered in these guides.</p><Link href="/create-invoice" className="mt-5 inline-flex items-center text-sm font-semibold text-emerald-700">Try the invoice builder <ArrowRight className="ml-2 h-4 w-4" /></Link></div>
        </aside>
      </article>
    </main>
  );
}
