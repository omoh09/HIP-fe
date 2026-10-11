import {
  LifeBuoy,
  ShieldCheck,
  Briefcase,
  Phone,
  BookOpen,
  Users,
  FileText,
  Mic,
  Building2,
  Newspaper,
  Book,
  Handshake,
} from 'lucide-react';

export const resources = [
  { label: 'Support Center', icon: LifeBuoy, href: '/support' },
  { label: 'Managed Support Plans', icon: ShieldCheck, href: '/support-plans' },
  { label: 'Professional Services', icon: Briefcase, href: '/services' },
  { label: 'Guides', icon: FileText, href: '/guides' },
  { label: 'Blog', icon: BookOpen, href: '/blog' },
  { label: 'Customer Stories', icon: Users, href: '/customers' },
  { label: 'Sessions Conference', icon: Mic, href: '/sessions' },
];

export const company = [
  { label: 'Contact Sales', icon: Phone, href: '/contact-sales' },
  { label: 'Jobs', icon: Building2, href: '/careers' },
  { label: 'Newsroom', icon: Newspaper, href: '/newsroom' },
//   { label: 'Stripe Press', icon: Book, href: '/press' },
  { label: 'Become a Partner', icon: Handshake, href: '/partners' },
];
