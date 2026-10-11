import type { MetadataRoute } from 'next';
const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/dashboard', '/api/', '/sign-in', '/sign-up', '/forget-password', '/reset-password'] }], sitemap: `${baseUrl}/sitemap.xml` };
}
