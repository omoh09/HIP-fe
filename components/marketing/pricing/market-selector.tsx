'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Globe2 } from 'lucide-react';

type Market = { country_code: string; name: string; currency: string; region?: string };

export default function MarketSelector({ markets, selected }: { markets: Market[]; selected: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const change = (country: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('country', country);
    router.replace(`/pricing?${params.toString()}`, { scroll: false });
  };
  return <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"><Globe2 className="h-4 w-4 text-emerald-700" /><span className="hidden text-slate-500 sm:inline">Pricing for</span><select aria-label="Pricing market" value={selected} onChange={(event) => change(event.target.value)} className="bg-transparent font-semibold text-slate-900 outline-none">{markets.map((market) => <option key={market.country_code} value={market.country_code}>{market.name} · {market.currency}</option>)}</select></label>;
}
