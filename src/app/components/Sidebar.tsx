'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  Folder,
  Tags,
  Building2,
  MapPin,
  BookOpen,
} from 'lucide-react';

interface SidebarProps {
  userRole: string;
  userName: string;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

interface NavItem {
  name: string;
  href?: string;
  icon: any;
  roles: string[];
}

interface NavSection {
  name: string;
  roles: string[];
  subsections: {
    name: string;
    icon: any;
    items: {
      name: string;
      href: string;
      icon: any;
      roles: string[];
    }[];
  }[];
}

const topNavItems: NavItem[] = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'editor', 'content_manager', 'hr'],
  },
  {
    name: 'Blog Posts',
    href: '/dashboard/blog/posts',
    icon: FileText,
    roles: ['admin', 'editor', 'content_manager'],
  },
  {
    name: 'Job Listings',
    href: '/dashboard/careers/jobs',
    icon: Briefcase,
    roles: ['admin', 'hr'],
  },
];

const masterDataSections: NavSection = {
  name: 'Master Data',
  roles: ['admin', 'editor', 'content_manager', 'hr'],
  subsections: [
    {
      name: 'Blog',
      icon: BookOpen,
      items: [
        {
          name: 'Categories',
          href: '/dashboard/master-data/categories',
          icon: Folder,
          roles: ['admin', 'editor', 'content_manager'],
        },
        {
          name: 'Tags',
          href: '/dashboard/master-data/tags',
          icon: Tags,
          roles: ['admin', 'editor', 'content_manager'],
        },
        {
          name: 'Authors',
          href: '/dashboard/master-data/authors',
          icon: Users,
          roles: ['admin', 'editor', 'content_manager'],
        },
      ],
    },
    {
      name: 'Careers',
      icon: Building2,
      items: [
        {
          name: 'Departments',
          href: '/dashboard/master-data/departments',
          icon: Building2,
          roles: ['admin', 'hr'],
        },
        {
          name: 'Locations',
          href: '/dashboard/master-data/locations',
          icon: MapPin,
          roles: ['admin', 'hr'],
        },
      ],
    },
  ],
};

const adminNavigation: NavItem[] = [
  {
    name: 'User Management',
    href: '/dashboard/users',
    icon: Users,
    roles: ['admin'],
  },
];

export default function Sidebar({ userRole, userName, collapsed = false, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [masterDataExpanded, setMasterDataExpanded] = useState(false);

  const filteredTopNav = topNavItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const filteredMasterDataSections = masterDataSections.subsections
    .map((subsection) => ({
      ...subsection,
      items: subsection.items.filter((item) => item.roles.includes(userRole)),
    }))
    .filter((subsection) => subsection.items.length > 0);

  const shouldShowMasterData = masterDataSections.roles.includes(userRole) && filteredMasterDataSections.length > 0;

  const filteredAdminNavigation = adminNavigation.filter((item) =>
    item.roles.includes(userRole)
  );

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <Link href="/dashboard" className="text-lg font-semibold text-gray-900">
            Dashboard
          </Link>
        )}
        <button
          onClick={() => onCollapse?.(!collapsed)}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          {filteredTopNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href!);
            return (
              <Link
                key={item.name}
                href={item.href!}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  active
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </div>

        {shouldShowMasterData && (
          <div className="pt-2">
            {!collapsed && (
              <button
                onClick={() => setMasterDataExpanded(!masterDataExpanded)}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600"
              >
                <span>{masterDataSections.name}</span>
                {masterDataExpanded ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRightIcon size={14} />
                )}
              </button>
            )}
            <div className={`space-y-4 ${collapsed ? '' : (masterDataExpanded ? 'mt-2' : 'max-h-0 overflow-hidden')}`}>
              {filteredMasterDataSections.map((subsection) => (
                <div key={subsection.name}>
                  {!collapsed && (
                    <div className="flex items-center gap-2 px-3 py-1.5">
                      <subsection.icon size={14} className="text-gray-400" />
                      <span className="text-xs font-medium text-gray-500">{subsection.name}</span>
                    </div>
                  )}
                  <div className="space-y-0.5">
                    {subsection.items.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            collapsed
                              ? 'justify-center'
                              : ''
                          } ${
                            active
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          {collapsed ? (
                            <item.icon size={18} />
                          ) : (
                            <>
                              <item.icon size={16} />
                              <span className="text-sm">{item.name}</span>
                            </>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredAdminNavigation.length > 0 && (
          <>
            <div className="pt-4 border-t border-gray-200">
              {!collapsed && (
                <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Administration
                </p>
              )}
              <div className="space-y-1">
                {filteredAdminNavigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href!);
                  return (
                    <Link
                      key={item.name}
                      href={item.href!}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        active
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={18} />
                      {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {userName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-lg bg-gray-900 text-white shadow-lg"
      >
        <Menu size={20} />
      </button>

      <div
        className={`${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed inset-y-0 left-0 z-40 lg:z-30 transition-transform duration-300 ease-in-out`}
      >
        <div
          className={`${
            collapsed ? 'w-16' : 'w-64'
          } h-full bg-white border-r border-gray-200 flex flex-col`}
        >
          <SidebarContent />
        </div>
      </div>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
