'use client';

import { useMemo, useState, useTransition } from 'react';
import { Globe2, BadgeDollarSign, CheckCircle2 } from 'lucide-react';
import { updateMarketSettings } from '../../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { showToast } from '@/lib/toast';

type Market = { country_code: string; name: string; currency: string; locale?: string; region?: string };
type Currency = { code: string; name: string; symbol: string };

export default function MarketSettingsClient({ initialData }: { initialData: any }) {
  const markets: Market[] = initialData?.markets || [];
  const currencies: Currency[] = initialData?.currencies || [];
  const [country, setCountry] = useState(initialData?.country_code || 'NG');
  const [baseCurrency, setBaseCurrency] = useState(initialData?.base_currency || 'NGN');
  const [billingCurrency, setBillingCurrency] = useState(initialData?.billing_currency || 'NGN');
  const [isPending, startTransition] = useTransition();
  const selectedMarket = useMemo(() => markets.find((market) => market.country_code === country), [country, markets]);

  const changeCountry = (nextCountry: string) => {
    setCountry(nextCountry);
    const market = markets.find((item) => item.country_code === nextCountry);
    if (market) {
      setBaseCurrency(market.currency);
      setBillingCurrency(market.currency);
    }
  };

  const save = () => startTransition(async () => {
    try {
      await updateMarketSettings({ country_code: country, base_currency: baseCurrency, billing_currency: billingCurrency, locale: selectedMarket?.locale });
      showToast('Market and currency preferences updated.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to update market settings.', 'error');
    }
  });

  return (
    <section className="page-container py-8 lg:py-10">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-medium text-emerald-700">Settings</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Market & currency</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Choose where your business is based and the currency you want Hip Homorrd to use for your main dashboard. You can still choose a different currency on each invoice.</p>
      </div>
      <div className="grid max-w-4xl gap-5 lg:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Globe2 className="h-5 w-5" /></span><div><h2 className="font-semibold text-slate-950">Business market</h2><p className="text-sm text-slate-500">Controls local plan pricing and payment-market defaults.</p></div></div></CardHeader>
          <CardContent className="space-y-5">
            <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Country / market</span><select className="field" value={country} onChange={(event) => changeCountry(event.target.value)}>{markets.map((market) => <option key={market.country_code} value={market.country_code}>{market.name} · {market.currency}</option>)}</select></label>
            <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600"><strong className="text-slate-900">Nigeria remains the default.</strong> If Hip Homorrd cannot determine a market, new accounts start with Nigeria / NGN and can change it here.</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><BadgeDollarSign className="h-5 w-5" /></span><div><h2 className="font-semibold text-slate-950">Currency preferences</h2><p className="text-sm text-slate-500">Keep reporting and subscription billing understandable.</p></div></div></CardHeader>
          <CardContent className="space-y-5">
            <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Dashboard base currency</span><select className="field" value={baseCurrency} onChange={(event) => setBaseCurrency(event.target.value)}>{currencies.map((currency) => <option key={currency.code} value={currency.code}>{currency.symbol} {currency.code} — {currency.name}</option>)}</select><span className="mt-2 block text-xs leading-5 text-slate-500">Other invoice currencies remain separate rather than being mixed using an invented FX rate.</span></label>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><span className="block text-sm font-medium text-slate-700">Subscription billing currency</span><p className="mt-2 text-lg font-bold text-slate-950">{selectedMarket?.currency || billingCurrency}</p><p className="mt-1 text-xs leading-5 text-slate-500">Plan billing follows the selected local market price book. Change the business market to change subscription currency; invoice currency stays independent.</p></div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-5 flex max-w-4xl flex-col items-start justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 sm:flex-row sm:items-center">
        <div className="flex gap-3 text-sm text-emerald-950"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /><p><strong>Invoice currency stays flexible.</strong> Changing your dashboard currency does not rewrite existing invoices or transactions.</p></div>
        <Button onClick={save} disabled={isPending} className="shrink-0 bg-emerald-600 text-white hover:bg-emerald-700">{isPending ? 'Saving…' : 'Save preferences'}</Button>
      </div>
    </section>
  );
}
