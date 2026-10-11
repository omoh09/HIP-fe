import { Suspense } from 'react';
import BillingSettingsClient from './billing-client';

export default function BillingSettingsPage() {
  return (
    <Suspense
      fallback={
        <section className="page-container py-10">
          <div className="mx-auto h-56 max-w-6xl animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
        </section>
      }
    >
      <BillingSettingsClient />
    </Suspense>
  );
}
