'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { MarketingGuide } from '@/lib/marketing-guides';

const categories = ['All', 'Invoicing', 'WhatsApp', 'Payments', 'Freelancing', 'Nigeria'] as const;

export default function GuidesLibrary({ guides }: { guides: MarketingGuide[] }) {
  const [category, setCategory] = useState<(typeof categories)[number]>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guides.filter((guide) => (category === 'All' || guide.category === category) && (!q || `${guide.title} ${guide.description} ${guide.category}`.toLowerCase().includes(q)));
  }, [category, guides, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${category === item ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{item}</button>)}
        </div>
        <label className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 md:w-72">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search guides" className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400" />
        </label>
      </div>

      <motion.div layout className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((guide, index) => (
          <motion.article layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.035, 0.18) }} key={guide.slug} className="group flex min-h-[310px] flex-col rounded-[24px] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_22px_55px_-35px_rgba(15,23,42,.35)]">
            <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">{guide.category}</span><span className="text-xs text-slate-400">{guide.readTime}</span></div>
            <BookOpen className="mt-7 h-6 w-6 text-slate-300 transition group-hover:text-emerald-600" />
            <h2 className="mt-4 text-xl font-semibold leading-7 text-slate-950">{guide.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{guide.description}</p>
            <Link href={`/guides/${guide.slug}`} className="mt-auto inline-flex items-center pt-6 text-sm font-semibold text-emerald-700">Read guide <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" /></Link>
          </motion.article>
        ))}
      </motion.div>

      {filtered.length === 0 && <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center"><p className="font-semibold text-slate-900">No guide matches that search yet.</p><button type="button" onClick={() => { setQuery(''); setCategory('All'); }} className="mt-3 text-sm font-semibold text-emerald-700">View all guides</button></div>}
    </div>
  );
}
