import type { MetadataRoute } from 'next';
import { marketingGuides } from '@/lib/marketing-guides';

const baseUrl=(process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000').replace(/\/$/,'');
const routes=[
 '', '/create-invoice', '/features','/invoice-generator','/online-invoicing','/payments','/pricing','/for-freelancers','/solutions','/whatsapp-invoicing',
 '/whatsapp-invoicing/send-invoice-on-whatsapp','/whatsapp-invoicing/whatsapp-payment-reminders','/whatsapp-invoicing/whatsapp-invoice-pdf','/whatsapp-invoicing/nigeria',
 '/solutions/freelancers','/solutions/consultants','/solutions/designers-creatives','/solutions/developers','/solutions/agencies','/solutions/contractors','/solutions/coaches',
 '/guides', ...marketingGuides.map((guide)=>`/guides/${guide.slug}`), '/reviews', '/blog','/about','/contact','/privacy','/terms'
];

export default function sitemap():MetadataRoute.Sitemap{
  return routes.map(route=>({url:`${baseUrl}${route}`,changeFrequency:route===''?'weekly':'monthly',priority:route===''?1:route.startsWith('/guides/')?0.65:0.7}));
}
