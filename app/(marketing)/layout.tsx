import type { ReactNode } from 'react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import WhatsAppSupportWidget from '@/components/support/whatsapp-support-widget';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
  const socialProfiles = [process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK, process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM, process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN, process.env.NEXT_PUBLIC_SOCIAL_X, process.env.NEXT_PUBLIC_SOCIAL_TIKTOK, process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE].filter(Boolean);
  const structuredData = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', name: 'Hip Homorrd', url: appUrl, ...(socialProfiles.length ? { sameAs: socialProfiles } : {}) },
    { '@type': 'WebSite', name: 'Hip Homorrd', url: appUrl, description: 'Invoicing and payment collection for freelancers and small businesses.' },
    { '@type': 'SoftwareApplication', name: 'Hip Homorrd', applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: appUrl, description: 'Create professional invoices, share them through WhatsApp and email, collect payments and track outstanding balances.' },
  ]};
  return <div className="marketing-shell min-h-screen bg-white text-slate-900 transition-colors dark:bg-[#07111f] dark:text-slate-100"><SiteHeader /><main>{children}</main><SiteFooter /><WhatsAppSupportWidget /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /></div>;
}
