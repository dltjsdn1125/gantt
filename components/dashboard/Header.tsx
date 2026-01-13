'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User } from '@/types/database.types';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (data) setUser(data);
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-10">
      <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
        <h1 className="text-xl font-bold dark:text-white">실행 대시보드</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">실시간 플랫폼 성능 개요</p>
      </Link>
      <div className="flex items-center space-x-6">
        <div className="relative">
          <span className="material-symbols-rounded text-slate-400">notifications</span>
          <span className="absolute top-0 right-0 h-2 w-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </div>
        <div className="flex items-center space-x-3">
          <img
            alt="User avatar"
            className="h-9 w-9 rounded-full object-cover"
            src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.full_name || 'User'}&background=6366f1&color=fff`}
          />
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold dark:text-white">{user?.full_name || '사용자'}</p>
            <p className="text-xs text-slate-500">
              {user?.role === 'admin' ? '관리자' : user?.role === 'member' ? '멤버' : '뷰어'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-primary"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
