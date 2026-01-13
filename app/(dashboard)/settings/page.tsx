'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User, Organization } from '@/types/database.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userData) {
        setUser(userData);

        const { data: orgData } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', userData.org_id)
          .single();

        setOrganization(orgData);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      // 사용자 정보 업데이트는 향후 구현
      toast.success('설정이 저장되었습니다.');
    } catch (error) {
      toast.error('설정 저장에 실패했습니다.');
    } finally {
      setSaving(false);
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
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">설정</h1>
        <p className="text-slate-500 mt-1">계정 및 조직 설정을 관리하세요</p>
      </div>

      {/* 프로필 설정 */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-4">프로필</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">이름</label>
            <Input value={user?.full_name || ''} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">이메일</label>
            <Input value={user?.email || ''} disabled />
          </div>
        </div>
      </div>

      {/* 조직 설정 */}
      {organization && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold mb-4">조직 정보</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">조직명</label>
              <Input value={organization.name} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">조직 슬러그</label>
              <Input value={organization.slug} disabled />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-primary text-white">
          {saving ? '저장 중...' : '저장'}
        </Button>
      </div>
    </div>
  );
}
