import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { SWRConfig } from 'swr';
import { demoUser, demoTeam } from '@/lib/demo';

import './globals.css';

export const metadata: Metadata = {
  title: 'Creator Invoice App - Simple Invoicing for Creators & Freelancers',
  description:
    'Manage invoices, track payments, and simplify billing for creators and freelancers. Fast, secure, and easy-to-use.',
  keywords: [
    'creator invoice app',
    'freelancer billing',
    'invoice management',
    'creator payments',
    'SaaS invoicing',
    'Next.js invoice app'
  ],
  authors: [{ name: 'Dr Omoh', url: 'https://yourcompany.com' }],
  openGraph: {
    title: 'Creator Invoice App - Simple Invoicing for Creators & Freelancers',
    description:
      'Manage invoices, track payments, and simplify billing for creators and freelancers. Fast, secure, and easy-to-use.',
    url: 'https://yourdomain.com',
    siteName: 'Creator Invoice App',
    images: [
      {
        url: 'https://yourdomain.com/og-invoice.png',
        width: 1200,
        height: 630,
        alt: 'Creator Invoice App'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creator Invoice App',
    description:
      'Manage invoices, track payments, and simplify billing for creators and freelancers.',
    images: ['https://yourdomain.com/og-invoice.png'],
    site: '@YourCompany',
    creator: '@YourCompany'
  },
};


export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
