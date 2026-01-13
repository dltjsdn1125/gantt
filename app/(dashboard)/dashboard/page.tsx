'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import type { Project, Task, Activity } from '@/types/database.types';
import { calculateProgress } from '@/lib/utils';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Button } from '@/components/ui/button';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      // Get user's organization
      const { data: user } = await supabase
        .from('users')
        .select('org_id')
        .eq('id', session.user.id)
        .single();

      if (!user) return;

      // Load projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('org_id', user.org_id);

      if (projectsData) setProjects(projectsData);

      // Load tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .in('project_id', projectsData?.map((p) => p.id) || []);

      if (tasksData) setTasks(tasksData);

      // Load activities
      const { data: activitiesData } = await supabase
        .from('activities')
        .select('*')
        .in('project_id', projectsData?.map((p) => p.id) || [])
        .order('created_at', { ascending: false })
        .limit(10);

      if (activitiesData) setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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

  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100 * 10) / 10 : 0;
  const onTimeDelivery = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100 * 10) / 10 : 0;
  const delayedTasks = tasks.filter((t) => t.status === 'delayed').length;

  // Chart data
  const completionData = {
    labels: ['Completed', 'In Progress', 'At Risk'],
    datasets: [
      {
        data: [
          tasks.filter((t) => t.status === 'completed').length,
          tasks.filter((t) => t.status === 'in_progress').length,
          tasks.filter((t) => t.status === 'delayed').length,
        ],
        backgroundColor: ['#6366f1', '#c7d2fe', '#fb7185'],
        borderWidth: 0,
      },
    ],
  };

  const workloadData = {
    labels: ['Eng', 'Design', 'Mktg', 'Sales', 'Ops', 'HR'],
    datasets: [
      {
        label: 'Current Workload',
        data: [85, 45, 60, 30, 75, 20], // TODO: Calculate from actual data
        backgroundColor: '#6366f1',
        borderRadius: 8,
        barThickness: 32,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">대시보드</h1>
        <Link href="/dashboard/projects/new">
          <Button className="bg-primary text-white font-bold px-6 py-2.5 rounded-full shadow-lg shadow-primary/25 hover:scale-105 transition-all">
            + 새 프로젝트
          </Button>
        </Link>
      </div>

      {/* Quick Project Links */}
      {projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">내 프로젝트</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow"
                style={{
                  borderLeftColor: project.color,
                  borderLeftWidth: '4px',
                }}
              >
                <h3 className="font-semibold mb-2">{project.name}</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    {project.tasks?.length || 0}개 태스크
                  </span>
                  <span className="font-semibold">{project.avgProgress || 0}%</span>
                </div>
              </Link>
            ))}
          </div>
          {projects.length > 6 && (
            <div className="mt-4 text-center">
              <Link href="/dashboard/projects">
                <Button variant="outline">모든 프로젝트 보기</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl mr-4">
            <span className="material-symbols-rounded text-primary">rocket_launch</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              진행 중인 프로젝트
            </p>
            <p className="text-2xl font-bold dark:text-white">{activeProjects}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl mr-4">
            <span className="material-symbols-rounded text-emerald-500">trending_up</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              생산성 %
            </p>
            <p className="text-2xl font-bold dark:text-white">{productivity}%</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl mr-4">
            <span className="material-symbols-rounded text-amber-500">schedule</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              정시 납품률
            </p>
            <p className="text-2xl font-bold dark:text-white">{onTimeDelivery}%</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center">
          <div className="p-3 bg-rose-50 dark:bg-rose-900/30 rounded-xl mr-4">
            <span className="material-symbols-rounded text-rose-500">error_outline</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              지연된 태스크
            </p>
            <p className="text-2xl font-bold dark:text-white">{delayedTasks}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold dark:text-white">프로젝트 완료율</h3>
            <button className="text-slate-400 hover:text-primary">
              <span className="material-symbols-rounded">more_horiz</span>
            </button>
          </div>
          <div className="relative h-64 flex items-center justify-center">
            <Doughnut
              data={completionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                cutout: '75%',
              }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-primary mr-2"></span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                완료 ({Math.round((completedTasks / totalTasks) * 100) || 0}%)
              </span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-indigo-200 dark:bg-indigo-700 mr-2"></span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                진행 중 ({Math.round((tasks.filter((t) => t.status === 'in_progress').length / totalTasks) * 100) || 0}%)
              </span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-rose-400 mr-2"></span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                위험 ({Math.round((delayedTasks / totalTasks) * 100) || 0}%)
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold dark:text-white">부서별 업무량</h3>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button className="px-3 py-1 text-xs font-medium bg-white dark:bg-slate-700 rounded-md shadow-sm dark:text-white">
                주간
              </button>
              <button className="px-3 py-1 text-xs font-medium text-slate-500 dark:text-slate-400">월간</button>
            </div>
          </div>
          <div className="h-72">
            <Bar
              data={workloadData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(148, 163, 184, 0.1)',
                      drawBorder: false,
                    },
                    ticks: {
                      color: '#94a3b8',
                      font: { size: 10 },
                    },
                  },
                  x: {
                    grid: { display: false },
                    ticks: {
                      color: '#94a3b8',
                      font: { size: 10 },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Delayed Tasks Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold dark:text-white flex items-center">
            <span className="material-symbols-rounded text-rose-500 mr-2">report_problem</span>
            주의가 필요한 지연 태스크
          </h3>
          <Link href="/dashboard/projects" className="text-sm text-primary font-medium hover:underline">
            모든 태스크 보기
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  태스크 설명
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">프로젝트</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">담당자</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">마감일</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tasks
                .filter((t) => t.status === 'delayed')
                .slice(0, 5)
                .map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 font-medium dark:text-white">{task.title}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {projects.find((p) => p.id === task.project_id)?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-7 w-7 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold mr-2">
                          {task.assigned_to ? task.assigned_to.substring(0, 2).toUpperCase() : 'N/A'}
                        </div>
                        <span className="text-sm dark:text-slate-300">담당자</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-rose-500 font-medium text-sm">
                      {new Date(task.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 rounded-full">
                        지연됨
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-slate-400 hover:text-primary">
                        <span className="material-symbols-rounded text-lg">edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              {tasks.filter((t) => t.status === 'delayed').length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    지연된 태스크가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
