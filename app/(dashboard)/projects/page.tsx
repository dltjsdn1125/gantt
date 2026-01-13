'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import type { Project, Task } from '@/types/database.types';
import { calculateProgress, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<(Project & { tasks?: Task[]; avgProgress?: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push('/login');
        return;
      }

      // Get user's organization
      const { data: user } = await supabase
        .from('users')
        .select('org_id')
        .eq('id', session.user.id)
        .single();

      if (!user) return;

      // Load projects with tasks
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select(`
          *,
          tasks (
            id,
            progress,
            status
          )
        `)
        .eq('org_id', user.org_id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate average progress for each project
      const projectsWithProgress = (projectsData || []).map((project) => {
        const tasks = (project.tasks as Task[]) || [];
        const avgProgress = calculateProgress(tasks);
        return {
          ...project,
          tasks,
          avgProgress,
        };
      });

      setProjects(projectsWithProgress);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('프로젝트를 불러오는데 실패했습니다.');
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">내 프로젝트</h1>
          <p className="text-slate-500 mt-1">전체 {projects.length}개 프로젝트</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="bg-primary text-white font-bold px-6 py-2.5 rounded-full shadow-lg shadow-primary/25 hover:scale-105 transition-all">
            + 새 프로젝트
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/dashboard/projects/${project.id}`}
            className="block p-6 rounded-lg border hover:shadow-lg transition-shadow bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            style={{
              borderLeftColor: project.color,
              borderLeftWidth: '4px',
            }}
          >
            <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
            {project.description && (
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{project.description}</p>
            )}

            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
              <span className="material-symbols-rounded text-sm">calendar_today</span>
              <span>
                {formatDate(project.start_date)} ~ {formatDate(project.end_date)}
              </span>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>진행률</span>
                <span className="font-semibold">{project.avgProgress || 0}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${project.avgProgress || 0}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  project.status === 'active'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                    : project.status === 'completed'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {project.status === 'active'
                  ? '진행중'
                  : project.status === 'completed'
                  ? '완료'
                  : project.status === 'planning'
                  ? '계획중'
                  : '보류'}
              </span>
            </div>
          </Link>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-500 mb-4">프로젝트가 없습니다.</p>
            <Link href="/dashboard/projects/new">
              <Button variant="outline">첫 프로젝트 만들기</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
