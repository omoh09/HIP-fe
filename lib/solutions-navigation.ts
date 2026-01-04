import {
  Layers,
  Building2,
  Rocket,
  Bot,
  Bitcoin,
  ShoppingCart,
  Wallet,
  RefreshCcw,
  Globe,
  CreditCard,
  Store,
  Boxes,
  Cpu,
  Users,
  Plane,
  Shield,
  Film,
  HeartHandshake,
  ShoppingBag,
  Grid,
  Puzzle,
} from 'lucide-react';

export const solutions = {
  stage: [
    { label: 'Enterprises', icon: Building2, href: '/solutions/enterprise' },
    { label: 'Startups', icon: Rocket, href: '/solutions/startups' },
  ],

  useCases: [
    { label: 'Agentic Commerce', icon: Bot, href: '/solutions/agentic-commerce' },
    { label: 'Crypto', icon: Bitcoin, href: '/solutions/crypto' },
    { label: 'Ecommerce', icon: ShoppingCart, href: '/solutions/ecommerce' },
    { label: 'Embedded Finance', icon: Wallet, href: '/solutions/embedded-finance' },
    { label: 'Finance Automation', icon: RefreshCcw, href: '/solutions/finance-automation' },
    { label: 'Global Businesses', icon: Globe, href: '/solutions/global-businesses' },
    { label: 'In-app Payments', icon: CreditCard, href: '/solutions/in-app-payments' },
    { label: 'Marketplaces', icon: Store, href: '/solutions/marketplaces' },
    { label: 'Platforms', icon: Boxes, href: '/solutions/platforms' },
    { label: 'SaaS', icon: Layers, href: '/solutions/saas' },
  ],

  industry: [
    { label: 'AI Companies', icon: Cpu, href: '/solutions/ai' },
    { label: 'Creator Economy', icon: Users, href: '/solutions/creators' },
    { label: 'Hospitality & Travel', icon: Plane, href: '/solutions/hospitality' },
    { label: 'Insurance', icon: Shield, href: '/solutions/insurance' },
    { label: 'Media & Entertainment', icon: Film, href: '/solutions/media' },
    { label: 'Nonprofits', icon: HeartHandshake, href: '/solutions/nonprofits' },
    { label: 'Retail', icon: ShoppingBag, href: '/solutions/retail' },
  ],

  ecosystem: [
    // { label: 'Stripe App Marketplace', icon: Grid, href: '/apps' },
    { label: 'Partners', icon: Puzzle, href: '/partners' },
  ],
};
