import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';
import { NavigationProgress } from '@/components/navigation-progress';
import PwaRegister from '@/components/pwa/pwa-register';
import OfflineBanner from '@/components/pwa/offline-banner';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Hip Homorrd — Invoicing and payments for independent professionals',
    template: '%s · Hip Homorrd',
  },
  description:
    'Create professional invoices, share payment links and track payments in one simple workspace.',
  applicationName: 'Hip Homorrd',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Hip Homorrd',
  },
  keywords: [
    'invoice generator',
    'online invoicing',
    'invoice payment',
    'freelancer invoicing',
    'WhatsApp invoicing',
    'payment collection',
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    {
      media: '(prefers-color-scheme: light)',
      color: '#ffffff',
    },
    {
      media: '(prefers-color-scheme: dark)',
      color: '#07111f',
    },
  ],
};

const themeScript = `(function(){try{var saved=localStorage.getItem('hip-theme');var dark=saved==='dark'||(!saved&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',dark);}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>

      <body>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>

        {children}

        <PwaRegister />
        <OfflineBanner />

        <Toaster
          position="top-right"
          toastOptions={{ duration: 4000 }}
        />
      </body>
    </html>
  );
}