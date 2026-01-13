'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@/types/database.types';
import { formatDate } from '@/lib/utils';

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  async function loadTeamMembers() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      const { data: user } = await supabase
        .from('users')
        .select('org_id')
        .eq('id', session.user.id)
        .single();

      if (!user) return;

      const { data: teamMembers, error } = await supabase
        .from('users')
        .select('*')
        .eq('org_id', user.org_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(teamMembers || []);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">팀원 관리</h1>
          <p className="text-slate-500 mt-1">조직의 모든 멤버를 확인하고 관리하세요</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                alt={user.full_name}
                className="h-12 w-12 rounded-full object-cover"
                src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.full_name}&background=6366f1&color=fff`}
              />
              <div>
                <h3 className="font-semibold">{user.full_name}</h3>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  user.role === 'admin'
                    ? 'bg-primary/10 text-primary'
                    : user.role === 'member'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {user.role === 'admin' ? '관리자' : user.role === 'member' ? '멤버' : '뷰어'}
              </span>
              {user.last_login && (
                <span className="text-xs text-slate-500">
                  마지막 로그인: {formatDate(user.last_login)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
