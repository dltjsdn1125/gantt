'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Project, Task } from '@/types/database.types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

export default function AnalyticsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  async function loadAnalyticsData() {
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

      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('org_id', user.org_id);

      setProjects(projectsData || []);

      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .in('project_id', projectsData?.map((p) => p.id) || []);

      setTasks(tasksData || []);
    } catch (error) {
      console.error('Error loading analytics data:', error);
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

  const statusData = {
    labels: ['완료', '진행 중', '대기', '지연'],
    datasets: [
      {
        data: [
          tasks.filter((t) => t.status === 'completed').length,
          tasks.filter((t) => t.status === 'in_progress').length,
          tasks.filter((t) => t.status === 'pending').length,
          tasks.filter((t) => t.status === 'delayed').length,
        ],
        backgroundColor: ['#00C875', '#3B82F6', '#94a3b8', '#E2445C'],
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">분석</h1>
        <p className="text-slate-500 mt-1">프로젝트 및 태스크 통계를 확인하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold dark:text-white mb-6">태스크 상태 분포</h3>
          <div className="h-64">
            <Doughnut
              data={statusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold dark:text-white mb-6">프로젝트별 태스크 수</h3>
          <div className="h-64">
            <Bar
              data={{
                labels: projects.map((p) => p.name),
                datasets: [
                  {
                    label: '태스크 수',
                    data: projects.map(
                      (p) => tasks.filter((t) => t.project_id === p.id).length
                    ),
                    backgroundColor: '#5B4FFF',
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
