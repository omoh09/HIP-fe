'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Plus, FileText, Users, BarChart3, CreditCard, Settings, LogOut, LineChart, Star, Crown, ShoppingBag, ReceiptText } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@/app/context/UserContext';
import { Button } from './ui/button';
import ThemeToggle from '@/components/theme/theme-toggle';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: BarChart3 },
  { href: '/dashboard/invoices', label: 'Invoices', icon: FileText },
  { href: '/dashboard/bills', label: 'Bills', icon: ReceiptText },
  { href: '/dashboard/shop', label: 'Shop add-on', icon: ShoppingBag },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/dashboard/transactions', label: 'Transactions', icon: CreditCard },
  { href: '/dashboard/reviews', label: 'Reviews', icon: Star },
  { href: '/dashboard/reports', label: 'Reports', icon: LineChart },
  { href: '/dashboard/settings/billing', label: 'Plan', icon: Crown },
];

export default function DashboardHeader() {
  const pathname = usePathname();
  const { user, logout } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = (user?.name || user?.email || 'H')
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#07111f]/95">
      <div className="page-container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold tracking-tight text-slate-950 dark:text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white dark:bg-emerald-400 dark:text-slate-950">H</span>
            <span>Hip Homorrd</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-700">
            <Link href="/dashboard/invoices/new"><Plus className="mr-2 h-4 w-4" />Create invoice</Link>
          </Button>
          <ThemeToggle /><Link href="/dashboard/settings" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </Link>
          <button onClick={logout} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-100" aria-label="Sign out">
            {initials}
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden"><ThemeToggle /><button
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button></div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white dark:border-white/10 dark:bg-[#07111f] lg:hidden">
          <nav className="page-container space-y-1 py-3" aria-label="Mobile navigation">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5">
                <Icon className="h-5 w-5" />{label}
              </Link>
            ))}
            <Link href="/dashboard/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5">
              <Settings className="h-5 w-5" />Settings
            </Link>
            <Link href="/dashboard/invoices/new" onClick={() => setMobileOpen(false)} className="mt-2 flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">
              <Plus className="mr-2 h-4 w-4" />Create invoice
            </Link>
            <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50">
              <LogOut className="h-5 w-5" />Sign out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
