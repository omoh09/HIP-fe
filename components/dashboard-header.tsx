'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HiMenu, HiX } from 'react-icons/hi';
import SolutionsMenu from '@/components/solutions-menu';
import ResourcesMenu from '@/components/resources-dropdown';
import { Button } from './ui/button';
import { useUser } from '@/app/context/UserContext';

export default function DashboardHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // const { user , isLoggedIn } = useUser();
  const { user, isLoading } = useUser();
  
  if (isLoading) return null;

  const isLoggedIn = !!user;

  console.log('User context', user, isLoggedIn);

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-semibold text-lg">
            {/* Homord Invoice Payment */}
            HIP
          </Link>

          {/* DESKTOP NAV */}
          {!isLoggedIn ? (
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition">
              Product
            </Link>
            <Link href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition">
              How it works
            </Link>
            <SolutionsMenu desktop />
            <ResourcesMenu desktop />

            {/* Desktop CTA Buttons */}
            <div className="flex gap-2 ml-4">
              <Button asChild className="rounded-full bg-green-600 hover:bg-green-700 text-white px-4 py-2">
                <Link href="/create-invoice">Create Invoice</Link>
              </Button>
              <Button asChild className="rounded-full border border-green-600 text-green-600 hover:bg-green-50 px-4 py-2">
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </div>
          </nav>
          ) : (
            <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {user?.email}
            </span>
            <Link href="/dashboard/invoices">Dashboard</Link>
          </div>
        )}

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-md bg-gray-100"
          >
            <HiMenu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* MOBILE FULLSCREEN TRAY */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] bg-white overflow-y-auto md:hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <span className="font-semibold text-lg">Menu</span>
            <button onClick={() => setMobileOpen(false)}>
              <HiX className="w-6 h-6" />
            </button>
          </div>

          {/* STACKED MOBILE CONTENT */}
          <div className="px-6 py-6 space-y-6">
            {/* Mobile CTA Buttons first */}
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full rounded-full bg-green-600 hover:bg-green-700 text-white px-4 py-3">
                <Link href="/create-invoice" onClick={() => setMobileOpen(false)}>Create Invoice</Link>
              </Button>
              <Button asChild className="w-full rounded-full border border-green-600 text-green-600 hover:bg-green-50 px-4 py-3">
                <Link href="/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
              </Button>
            </div>

            {/* Nav links after buttons */}
            <Link href="#features" onClick={() => setMobileOpen(false)} className="block text-lg">
              Product
            </Link>
            <Link href="#how-it-works" onClick={() => setMobileOpen(false)} className="block text-lg">
              How it works
            </Link>

            {/* Mobile submenus */}
            <SolutionsMenu mobile onNavigate={() => setMobileOpen(false)} />
            <ResourcesMenu mobile onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
