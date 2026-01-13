'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/dashboard', icon: 'dashboard', label: '대시보드' },
  { href: '/dashboard/projects', icon: 'assignment', label: '프로젝트' },
  { href: '/dashboard/team', icon: 'group', label: '팀원' },
  { href: '/dashboard/analytics', icon: 'analytics', label: '분석' },
  { href: '/dashboard/settings', icon: 'settings', label: '설정' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-20 flex flex-col items-center py-6 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      <Link href="/dashboard" className="mb-10 text-primary hover:opacity-80 transition-opacity">
        <span className="material-symbols-rounded text-4xl">insights</span>
      </Link>
      <nav className="flex-1 space-y-8">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'p-3 rounded-xl flex items-center justify-center transition-all',
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-primary'
                  : 'text-slate-400 hover:text-primary'
              )}
              title={item.label}
            >
              <span className="material-symbols-rounded">{item.icon}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto">
        <button
          className="p-3 text-slate-400 hover:text-primary rounded-xl"
          onClick={() => {
            document.documentElement.classList.toggle('dark');
          }}
        >
          <span className="material-symbols-rounded">dark_mode</span>
        </button>
      </div>
    </aside>
  );
}
