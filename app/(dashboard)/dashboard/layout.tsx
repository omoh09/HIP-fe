'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Users, Settings, Shield, Activity, Menu, FileText, BarChart, UserPlus, Download, LogOut } from 'lucide-react';
import { useUser } from '@/app/context/UserContext';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useUser();
  const pathname = usePathname();
  const router = useRouter(); // Router to navigate after logout
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { href: '/dashboard/invoices', icon: FileText, label: 'Invoices' },
    { href: '/dashboard/clients', icon: Users, label: 'Clients' },
    { href: '/dashboard/reports', icon: BarChart, label: 'Reports' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/sign-in'); // redirect after logout
  };

  return (
    <div className="flex flex-col min-h-[calc(100dvh-68px)] max-w-7xl mx-auto w-full">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4">
        {/* <div className="flex items-center">
          <span className="font-medium">Dashboard</span>
        </div> */}
        <Button
          className="-mr-3"
          variant="ghost"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden h-full">
        {/* Sidebar */}
        <aside
          className={`w-64 py-4 bg-white lg:bg-gray-50 border-r border-gray-200 lg:block ${isSidebarOpen ? 'block' : 'hidden'} lg:relative absolute inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="h-full overflow-y-auto my-8 p-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Button
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className={`shadow-none my-1 w-full justify-start ${pathname === item.href ? 'bg-gray-100' : ''}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            {/* Logout Button */}
            <Button
              variant="ghost"
              className="shadow-none my-1 w-full justify-start text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 text-red-600" />
              Logout
            </Button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-0 lg:p-4">{children}</main>
      </div>
    </div>
  );
}
