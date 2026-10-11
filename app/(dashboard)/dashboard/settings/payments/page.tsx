'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bitcoin, Building2, CheckCircle2, CreditCard, Loader2, RefreshCw, ShieldCheck, Smartphone, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { showToast } from '@/lib/toast';

type PaymentAccount = {
  id: string;
  provider: string;
  status: 'pending' | 'active' | 'disabled' | string;
  provider_account_id?: string | null;
  platform_fee_percent: number;
  country?: string | null;
  default_currency?: string | null;
  metadata?: Record<string, any> | null;
  activated_at?: string | null;
  credentials_configured?: boolean;
};

type Provider = { key: string; label: string; platform_fee_percent: number };
type Plan = { code: string; name: string; platform_fee_percent: number; payment_provider_limit?: number; crypto_payments?: boolean };
type Bank = { name: string; code: string; currency?: string | null; country?: string | null };

export default function PaymentSettingsPage() {
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingPaystack, setSavingPaystack] = useState(false);
  const [savingStripe, setSavingStripe] = useState(false);
  const [savingMoonPay, setSavingMoonPay] = useState(false);
  const [moonPayWallet, setMoonPayWallet] = useState('');
  const [moonPayNetwork, setMoonPayNetwork] = useState('BASE');
  const [moonPayAsset, setMoonPayAsset] = useState('USDC');
  const [moonPaySettlementPreference, setMoonPaySettlementPreference] = useState<'crypto' | 'fiat'>('crypto');
  const [moonPayFiatCurrency, setMoonPayFiatCurrency] = useState('NGN');
  const [savingHipCrypto, setSavingHipCrypto] = useState(false);
  const [hipCryptoWallet, setHipCryptoWallet] = useState('');
  const [hipCryptoNetwork, setHipCryptoNetwork] = useState('BASE');
  const [hipCryptoAsset, setHipCryptoAsset] = useState('USDC');
  const [savingMomo, setSavingMomo] = useState(false);
  const [momoSettlementMsisdn, setMomoSettlementMsisdn] = useState('');

  const loadAccounts = useCallback(async () => {
    const response = await fetch('/api/payment-accounts', { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Unable to load payment accounts');
    setAccounts(Array.isArray(data?.data) ? data.data : []);
    setProviders(Array.isArray(data?.available_providers) ? data.available_providers : []);
    setPlan(data?.plan ?? null);
    return data;
  }, []);

  useEffect(() => {
    loadAccounts()
      .catch((error) => showToast(error?.message || 'Unable to load payment accounts.', 'error'))
      .finally(() => setLoading(false));
  }, [loadAccounts]);

  const paystackEnabled = providers.some((provider) => provider.key === 'paystack');
  const stripeEnabled = providers.some((provider) => provider.key === 'stripe');
  const moonPayEnabled = providers.some((provider) => provider.key === 'moonpay_commerce');
  const hipCryptoEnabled = providers.some((provider) => provider.key === 'hip_crypto');
  const momoEnabled = providers.some((provider) => provider.key === 'mtn_momo');
  const paystack = accounts.find((account) => account.provider === 'paystack');
  const stripe = accounts.find((account) => account.provider === 'stripe');
  const moonPay = accounts.find((account) => account.provider === 'moonpay_commerce');
  const hipCrypto = accounts.find((account) => account.provider === 'hip_crypto');
  const momo = accounts.find((account) => account.provider === 'mtn_momo');

  useEffect(() => {
    const payout = moonPay?.metadata?.payout_wallet;
    if (payout?.address && !moonPayWallet) setMoonPayWallet(String(payout.address));
    if (payout?.network) setMoonPayNetwork(String(payout.network));
    if (payout?.asset) setMoonPayAsset(String(payout.asset));
    if (moonPay?.metadata?.settlement_preference === 'fiat') setMoonPaySettlementPreference('fiat');
    if (moonPay?.metadata?.fiat_settlement_currency) setMoonPayFiatCurrency(String(moonPay.metadata.fiat_settlement_currency));
    const hipPayout = hipCrypto?.metadata?.payout_wallet;
    if (hipPayout?.address && !hipCryptoWallet) setHipCryptoWallet(String(hipPayout.address));
    if (hipPayout?.network) setHipCryptoNetwork(String(hipPayout.network));
    if (hipPayout?.asset) setHipCryptoAsset(String(hipPayout.asset));
    if (momo?.metadata?.settlement_msisdn && !momoSettlementMsisdn) setMomoSettlementMsisdn(String(momo.metadata.settlement_msisdn));
  }, [moonPay, hipCrypto, momo, moonPayWallet, hipCryptoWallet, momoSettlementMsisdn]);

  useEffect(() => {
    if (!paystackEnabled || paystack?.status === 'active' || banks.length) return;
    fetch('/api/payment-accounts/paystack/banks')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Unable to load banks');
        setBanks(Array.isArray(data?.data) ? data.data : []);
      })
      .catch((error) => showToast(error?.message || 'Unable to load settlement banks.', 'error'));
  }, [paystackEnabled, paystack?.status, banks.length]);

  useEffect(() => {
    if (typeof window === 'undefined' || savingStripe) return;
    const searchParams = new URLSearchParams(window.location.search);
    const provider = searchParams.get('provider');
    const onboarding = searchParams.get('onboarding');
    if (provider !== 'stripe' || onboarding !== 'complete') return;

    setSavingStripe(true);
    fetch('/api/payment-accounts/stripe/refresh', { method: 'POST' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Unable to refresh Stripe status');
        showToast(data?.message || 'Stripe status refreshed.', 'success');
        await loadAccounts();
        window.history.replaceState({}, '', window.location.pathname);
      })
      .catch((error) => showToast(error?.message || 'Unable to refresh Stripe status.', 'error'))
      .finally(() => setSavingStripe(false));
  }, [savingStripe, loadAccounts]);

  const activeCount = useMemo(() => accounts.filter((account) => account.status === 'active').length, [accounts]);

  async function activatePaystack() {
    if (!bankCode || !/^\d{10,12}$/.test(accountNumber)) {
      showToast('Choose a bank and enter a valid settlement account number.', 'error');
      return;
    }

    try {
      setSavingPaystack(true);
      const response = await fetch('/api/payment-accounts/paystack/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bank_code: bankCode, account_number: accountNumber }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to activate Paystack');
      showToast('Paystack payment collection is active.', 'success');
      setAccountNumber('');
      await loadAccounts();
    } catch (error: any) {
      showToast(error?.message || 'Unable to activate Paystack.', 'error');
    } finally {
      setSavingPaystack(false);
    }
  }

  async function startStripeOnboarding() {
    try {
      setSavingStripe(true);
      const response = await fetch('/api/payment-accounts/stripe/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to start Stripe onboarding');
      const onboardingUrl = data?.data?.onboarding_url;
      if (!onboardingUrl) throw new Error('Stripe did not return an onboarding URL.');
      window.location.assign(onboardingUrl);
    } catch (error: any) {
      showToast(error?.message || 'Unable to start Stripe onboarding.', 'error');
      setSavingStripe(false);
    }
  }


  async function activateMoonPayCommerce() {
    if (!moonPayWallet.trim()) {
      showToast('Add the wallet address that should receive crypto settlements.', 'error');
      return;
    }
    try {
      setSavingMoonPay(true);
      const response = await fetch('/api/payment-accounts/moonpay-commerce/activate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: moonPayWallet.trim(), wallet_network: moonPayNetwork, settlement_asset: moonPayAsset, settlement_preference: moonPaySettlementPreference, fiat_currency: moonPaySettlementPreference === 'fiat' ? moonPayFiatCurrency : undefined }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save crypto payout wallet');
      showToast(data?.message || 'Crypto payout wallet saved.', 'success');
      await loadAccounts();
    } catch (error: any) { showToast(error?.message || 'Unable to save crypto payout wallet.', 'error'); }
    finally { setSavingMoonPay(false); }
  }


  async function activateHipCrypto() {
    if (!hipCryptoWallet.trim()) {
      showToast('Add the verified wallet that should receive Hip Crypto settlements.', 'error');
      return;
    }
    try {
      setSavingHipCrypto(true);
      const response = await fetch('/api/payment-accounts/hip-crypto/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: hipCryptoWallet.trim(),
          wallet_network: hipCryptoNetwork,
          settlement_asset: hipCryptoAsset,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to register settlement wallet');
      showToast(data?.message || 'Hip Crypto settlement wallet saved.', 'success');
      await loadAccounts();
    } catch (error: any) {
      showToast(error?.message || 'Unable to register Hip Crypto settlement wallet.', 'error');
    } finally {
      setSavingHipCrypto(false);
    }
  }

  async function activateMtnMomo() {
    if (!momoSettlementMsisdn.trim()) { showToast('Add the MTN MoMo number that should receive merchant settlements.', 'error'); return; }
    try {
      setSavingMomo(true);
      const response = await fetch('/api/payment-accounts/mtn-momo/activate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ settlement_msisdn: momoSettlementMsisdn.trim() }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save MTN MoMo payout number');
      showToast(data?.message || 'MTN MoMo payout number saved.', 'success');
      await loadAccounts();
    } catch (error: any) { showToast(error?.message || 'Unable to save MTN MoMo payout number.', 'error'); }
    finally { setSavingMomo(false); }
  }

  if (loading) {
    return <section className="page-container py-10"><div className="flex items-center gap-3 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Loading payment settings…</div></section>;
  }

  return (
    <section className="page-container py-8 lg:py-10">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-medium text-emerald-700">Payment collection</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Connect where client payments settle</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Hip Homorrd keeps one stable invoice payment link while the backend routes each checkout through an active provider account connected to your business.</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="border-slate-200 shadow-sm"><CardContent className="p-5"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Active providers</p><p className="mt-2 text-3xl font-bold text-slate-950">{activeCount}<span className="text-base font-medium text-slate-400"> / {plan?.payment_provider_limit ?? 1}</span></p></CardContent></Card>
        <Card className="border-slate-200 shadow-sm"><CardContent className="p-5"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Payment link</p><p className="mt-2 text-sm font-semibold text-slate-900">One Hip Homorrd URL</p><p className="mt-1 text-xs text-slate-500">Clients choose an available provider on the payment page.</p></CardContent></Card>
        <Card className="border-slate-200 shadow-sm"><CardContent className="p-5"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{plan?.name ?? 'Current'} plan fee</p><p className="mt-2 text-3xl font-bold text-slate-950">{Number(plan?.platform_fee_percent ?? 0).toFixed(2)}%</p><p className="mt-1 text-xs text-slate-500">Snapshotted when each invoice is created.</p></CardContent></Card>
      </div>

      <div className="grid max-w-4xl gap-5">
        {paystackEnabled && (
          <Card className="overflow-hidden border-slate-200 shadow-sm">
            <CardContent className="p-0">
              <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700"><CreditCard className="h-5 w-5" /></span><div><h2 className="font-semibold text-slate-950">Paystack</h2><p className="mt-1 text-sm text-slate-500">Local settlement account for Paystack invoice collections.</p></div></div>
                <StatusBadge status={paystack?.status ?? 'not_connected'} />
              </div>

              {paystack?.status === 'active' ? (
                <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                  <Info label="Settlement account" value={paystack.metadata?.account_number_last4 ? `•••• ${paystack.metadata.account_number_last4}` : 'Connected'} />
                  <Info label={`${plan?.name ?? 'Current'} plan collection fee`} value={`${Number(plan?.platform_fee_percent ?? paystack.platform_fee_percent ?? 0).toFixed(2)}%`} />
                  <div className="sm:col-span-2 flex gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /><p>Paystack can now appear as a payment option on your dedicated client invoice pages.</p></div>
                </div>
              ) : (
                <div className="p-5 sm:p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label><span className="mb-2 block text-sm font-medium text-slate-700">Settlement bank</span><select value={bankCode} onChange={(event) => setBankCode(event.target.value)} className="field bg-white"><option value="">Choose bank</option>{banks.map((bank) => <option key={`${bank.code}-${bank.name}`} value={bank.code}>{bank.name}</option>)}</select></label>
                    <label><span className="mb-2 block text-sm font-medium text-slate-700">Account number</span><input value={accountNumber} onChange={(event) => setAccountNumber(event.target.value.replace(/\D/g, '').slice(0, 12))} inputMode="numeric" placeholder="0123456789" className="field bg-white" /></label>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-xl text-xs leading-5 text-slate-500">Activation creates a provider subaccount tied to your settlement details. Hip Homorrd never asks your client to send money to a generic platform bank account.</p><Button onClick={activatePaystack} disabled={savingPaystack || !bankCode || accountNumber.length < 10} className="bg-emerald-600 text-white hover:bg-emerald-700">{savingPaystack && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Activate Paystack</Button></div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {stripeEnabled && (
          <Card className="overflow-hidden border-slate-200 shadow-sm">
            <CardContent className="p-0">
              <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><WalletCards className="h-5 w-5" /></span><div><h2 className="font-semibold text-slate-950">Stripe Connect</h2><p className="mt-1 text-sm text-slate-500">Optional connected-account checkout for supported markets.</p></div></div>
                <StatusBadge status={stripe?.status ?? 'not_connected'} />
              </div>
              <div className="p-5 sm:p-6">
                {stripe?.status === 'active' ? (
                  <div className="flex gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /><p>Stripe is active and can appear beside your other payment options.</p></div>
                ) : (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-xl text-sm leading-6 text-slate-500">Continue to Stripe’s onboarding flow. Stripe controls eligibility, verification and payout requirements for the connected account.</p><Button onClick={startStripeOnboarding} disabled={savingStripe} variant="outline">{savingStripe ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}{stripe ? 'Continue onboarding' : 'Connect Stripe'}</Button></div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {moonPayEnabled && (
          <Card className="overflow-hidden border-slate-200 shadow-sm"><CardContent className="p-0">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Bitcoin className="h-5 w-5" /></span><div><h2 className="font-semibold text-slate-950">Crypto · MoonPay Commerce</h2><p className="mt-1 text-sm text-slate-500">Hip Homorrd manages the MoonPay platform connection. You only whitelist where your settlement should go.</p></div></div>
              <StatusBadge status={moonPay?.status ?? 'not_connected'} />
            </div>
            <div className="space-y-5 p-5 sm:p-6">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900"><strong>No MoonPay account or API keys required.</strong> Hip Homorrd owns the platform integration. Your payout wallet is stored as a settlement destination; private keys and seed phrases are never requested.</div>
              {moonPay?.metadata?.payout_wallet?.address ? <div className="grid gap-3 sm:grid-cols-3"><Info label="Wallet" value={`${String(moonPay.metadata.payout_wallet.address).slice(0,8)}…${String(moonPay.metadata.payout_wallet.address).slice(-6)}`} /><Info label="Network" value={moonPay.metadata.payout_wallet.network || '—'} /><Info label="Asset" value={moonPay.metadata.payout_wallet.asset || 'USDC'} /></div> : null}
              {plan?.crypto_payments ? <div className="grid gap-4 sm:grid-cols-3"><label className="sm:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Whitelisted payout wallet</span><input value={moonPayWallet} onChange={(e)=>setMoonPayWallet(e.target.value)} placeholder="0x… / BTC / Solana wallet" className="field bg-white dark:bg-slate-950" /></label><label><span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Network</span><select value={moonPayNetwork} onChange={(e)=>setMoonPayNetwork(e.target.value)} className="field bg-white dark:bg-slate-950"><option>BASE</option><option>ETH</option><option>SOL</option><option>TRON</option><option>BITCOIN</option><option>POLYGON</option></select></label><label><span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Preferred settlement</span><select value={moonPaySettlementPreference} onChange={(e)=>setMoonPaySettlementPreference(e.target.value as 'crypto' | 'fiat')} className="field bg-white dark:bg-slate-950"><option value="crypto">Crypto to wallet</option><option value="fiat">Eligible fiat auto-offramp</option></select></label><label><span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Settlement asset</span><select value={moonPayAsset} onChange={(e)=>setMoonPayAsset(e.target.value)} className="field bg-white dark:bg-slate-950"><option>USDC</option><option>USDT</option><option>BTC</option><option>ETH</option></select></label>{moonPaySettlementPreference === 'fiat' ? <label><span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Preferred fiat currency</span><select value={moonPayFiatCurrency} onChange={(e)=>setMoonPayFiatCurrency(e.target.value)} className="field bg-white dark:bg-slate-950"><option>NGN</option><option>USD</option><option>EUR</option><option>GBP</option><option>GHS</option><option>KES</option><option>ZAR</option></select></label> : null}<div className="sm:col-span-3 flex items-end"><Button onClick={activateMoonPayCommerce} disabled={savingMoonPay} className="bg-slate-950 text-white hover:bg-slate-800 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300">{savingMoonPay ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Bitcoin className="mr-2 h-4 w-4"/>}Save settlement preference</Button></div><p className="sm:col-span-3 text-xs leading-5 text-slate-500 dark:text-slate-400">Fiat auto-offramp is only activated where MoonPay Commerce supports the merchant, currency and platform payout arrangement. Your whitelisted wallet remains the crypto settlement destination/fallback; Hip Homorrd never asks for its private key.</p></div> : <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-400/10 dark:text-amber-200">Base or Plus is required for crypto checkout.</div>}
              <p className="text-xs leading-5 text-slate-500">MoonPay platform merchant provisioning is partnership-only. Until Hip Homorrd has production platform approval, this account remains pending and crypto will not be shown to clients.</p>
            </div>
          </CardContent></Card>
        )}

        {hipCryptoEnabled && (
          <Card className="overflow-hidden border-slate-200 shadow-sm"><CardContent className="p-0">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700"><Bitcoin className="h-5 w-5" /></span><div><h2 className="font-semibold text-slate-950">Crypto · Hip Crypto</h2><p className="mt-1 text-sm text-slate-500">Hip-controlled transaction addresses, on-chain confirmation, reconciliation, fee accounting and settlement to your approved wallet.</p></div></div>
              <StatusBadge status={hipCrypto?.status ?? 'not_connected'} />
            </div>
            <div className="space-y-5 p-5 sm:p-6">
              <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950"><strong>Your settlement wallet is allowlisted; its private key is never stored by this app.</strong> Each client payment gets a unique Hip transaction address. Hip confirms and reconciles the blockchain payment before deducting the configured platform fee and sending the merchant net amount to the verified wallet.</div>
              {hipCrypto?.metadata?.payout_wallet?.address ? <div className="grid gap-3 sm:grid-cols-3"><Info label="Whitelisted wallet" value={`${String(hipCrypto.metadata.payout_wallet.address).slice(0,8)}…${String(hipCrypto.metadata.payout_wallet.address).slice(-6)}`} /><Info label="Network" value={hipCrypto.metadata.payout_wallet.network || '—'} /><Info label="Asset" value={hipCrypto.metadata.payout_wallet.asset || 'USDC'} /></div> : null}
              {plan?.crypto_payments ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="sm:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Merchant settlement wallet</span><input value={hipCryptoWallet} onChange={(e)=>setHipCryptoWallet(e.target.value)} placeholder="Verified wallet address" className="field bg-white dark:bg-slate-950" /></label>
                  <label><span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Network</span><select value={hipCryptoNetwork} onChange={(e)=>setHipCryptoNetwork(e.target.value)} className="field bg-white dark:bg-slate-950"><option>BASE</option><option>POLYGON</option><option>ETH</option><option>SOL</option></select></label>
                  <label><span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Settlement asset</span><select value={hipCryptoAsset} onChange={(e)=>setHipCryptoAsset(e.target.value)} className="field bg-white dark:bg-slate-950"><option>USDC</option><option>USDT</option></select></label>
                  <div className="sm:col-span-2 flex items-end"><Button onClick={activateHipCrypto} disabled={savingHipCrypto} className="bg-slate-950 text-white hover:bg-slate-800 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300">{savingHipCrypto ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ShieldCheck className="mr-2 h-4 w-4"/>}{hipCrypto ? 'Update settlement wallet' : 'Register settlement wallet'}</Button></div>
                  <p className="sm:col-span-3 text-xs leading-5 text-slate-500 dark:text-slate-400">The secure wallet/signing service must verify and whitelist this address before the account becomes active. Pending or unverified wallets are not exposed to clients for checkout.</p>
                </div>
              ) : <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-400/10 dark:text-amber-200">Base or Plus is required for crypto checkout.</div>}
            </div>
          </CardContent></Card>
        )}

        {momoEnabled && (
          <Card className="overflow-hidden border-slate-200 shadow-sm"><CardContent className="p-0">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-yellow-700"><Smartphone className="h-5 w-5"/></span><div><h2 className="font-semibold text-slate-950">MTN MoMo</h2><p className="mt-1 text-sm text-slate-500">Collect from a client&apos;s MTN MoMo wallet and reconcile the payment to the invoice.</p></div></div><StatusBadge status={momo?.status ?? 'not_connected'} /></div>
            <div className="space-y-4 p-5 sm:p-6"><div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">Hip Homorrd uses its platform collection integration. Merchant payout uses the whitelisted MTN MoMo number after provider approval and treasury/disbursement setup.</div><label className="block max-w-md"><span className="mb-2 block text-sm font-medium text-slate-700">Merchant MTN MoMo payout number</span><input value={momoSettlementMsisdn} onChange={(e)=>setMomoSettlementMsisdn(e.target.value)} placeholder="e.g. 23324… / 23480…" className="field bg-white" /></label><Button onClick={activateMtnMomo} disabled={savingMomo} variant="outline">{savingMomo ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Smartphone className="mr-2 h-4 w-4"/>}Save MoMo payout</Button><p className="text-xs leading-5 text-slate-500">MTN MoMo platform collections/disbursements require commercial onboarding. Pending accounts are never exposed on client payment pages.</p></div>
          </CardContent></Card>
        )}

        {!paystackEnabled && !stripeEnabled && !moonPayEnabled && !hipCryptoEnabled && !momoEnabled && (
          <Card className="border-amber-200 bg-amber-50 shadow-none"><CardContent className="flex gap-3 p-5 text-sm text-amber-900"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" /><p>No payment providers are enabled on the server yet. Configure at least one provider before clients can pay online.</p></CardContent></Card>
        )}

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <div className="flex gap-3"><Building2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" /><p><strong className="text-slate-800">How monetization works:</strong> normal collection rails keep the invoice&apos;s snapshotted Hip Homorrd collection fee where the provider supports a documented split/application fee. MoonPay, Hip Crypto and MTN MoMo are platform-managed rails. Hip Crypto uses the internal reconciliation/ledger path and settles only to a verified whitelisted merchant wallet. Subscription access is immediate revenue; transaction fees are recorded only when Hip Homorrd has a signed provider arrangement that actually lets the platform retain them. MTN merchant payout can also support a disclosed settlement fee once the commercial disbursement model is approved.</p></div>
        </div>
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const active = status === 'active';
  const pending = status === 'pending';
  return <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ${active ? 'bg-emerald-50 text-emerald-700' : pending ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{active ? 'Active' : pending ? 'Onboarding' : 'Not connected'}</span>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-slate-200 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-2 text-sm font-semibold text-slate-900">{value}</p></div>;
}
