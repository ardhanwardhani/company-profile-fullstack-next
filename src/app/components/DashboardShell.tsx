'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { LogOut, Settings, Bell, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface DashboardShellProps {
  children: React.ReactNode;
  userRole: string;
  userName: string;
  userEmail?: string;
}

export default function DashboardShell({
  children,
  userRole,
  userName,
  userEmail,
}: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      <Sidebar
        userRole={userRole}
        userName={userName}
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        }`}
      >
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 dark:bg-dark-900 dark:border-dark-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="hidden sm:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 text-sm bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-gray-200 focus:bg-white dark:bg-dark-800 dark:text-gray-200 dark:focus:ring-dark-600 dark:focus:bg-dark-700"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 dark:text-gray-400 dark:hover:bg-dark-700">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <ThemeToggle />

              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-dark-700">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userRole?.replace('_', ' ')}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {userName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <Link
                  href="/api/auth/signout"
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 dark:text-gray-400 dark:hover:bg-dark-700"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
