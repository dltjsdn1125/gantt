'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import type { Project, Task, User } from '@/types/database.types';
import GanttChart from '@/components/gantt/GanttChart';
import TaskList from '@/components/gantt/TaskList';
import TaskModal from '@/components/gantt/TaskModal';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'gantt' | 'kanban' | 'dashboard'>('gantt');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (projectId) {
      loadProjectData();
      subscribeToRealtime();
    }

    return () => {
      // Cleanup subscription
    };
  }, [projectId]);

  async function loadProjectData() {
    try {
      // Load project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Load tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true });

      if (tasksError) throw tasksError;
      setTasks(tasksData || []);

      // Load users for assignment
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('org_id')
          .eq('id', session.user.id)
          .single();

        if (userData) {
          const { data: orgUsers } = await supabase
            .from('users')
            .select('*')
            .eq('org_id', userData.org_id);
          setUsers(orgUsers || []);
        }
      }
    } catch (error) {
      console.error('Error loading project data:', error);
      toast.error('프로젝트 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  function subscribeToRealtime() {
    const channel = supabase
      .channel(`project-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks((prev) => [...prev, payload.new as Task]);
          } else if (payload.eventType === 'UPDATE') {
            setTasks((prev) =>
              prev.map((t) => (t.id === payload.new.id ? (payload.new as Task) : t))
            );
          } else if (payload.eventType === 'DELETE') {
            setTasks((prev) => prev.filter((t) => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }

  async function handleTaskUpdate(taskId: string, start: Date, end: Date) {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          start_date: start.toISOString().split('T')[0],
          end_date: end.toISOString().split('T')[0],
        })
        .eq('id', taskId);

      if (error) throw error;
      toast.success('태스크 일정이 업데이트되었습니다.');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('태스크 업데이트에 실패했습니다.');
    }
  }

  async function handleProgressUpdate(taskId: string, progress: number) {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ progress })
        .eq('id', taskId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('진행률 업데이트에 실패했습니다.');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-500">로딩 중...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-500">프로젝트를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-slate-400 hover:text-primary"
          >
            <span className="material-symbols-rounded">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold">{project.name}</h1>
          <Link href="/dashboard/projects" className="text-sm text-slate-500 hover:text-primary">
            프로젝트 목록
          </Link>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('gantt')}
              className={`px-3 py-1 text-xs font-semibold rounded shadow-sm ${
                viewMode === 'gantt'
                  ? 'bg-white dark:bg-slate-700 text-primary'
                  : 'text-slate-500'
              }`}
            >
              Gantt
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 text-xs font-semibold ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-700 text-primary'
                  : 'text-slate-500'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('dashboard')}
              className={`px-3 py-1 text-xs font-semibold ${
                viewMode === 'dashboard'
                  ? 'bg-white dark:bg-slate-700 text-primary'
                  : 'text-slate-500'
              }`}
            >
              Dashboard
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary">
            <span className="material-symbols-rounded text-lg">filter_list</span>
            필터
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary">
            <span className="material-symbols-rounded text-lg">sort</span>
            정렬
          </button>
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>
          <Button
            onClick={() => {
              setSelectedTask(null);
              setIsTaskModalOpen(true);
            }}
            className="bg-primary px-4 py-1.5 text-white rounded-md text-sm font-medium flex items-center gap-1"
          >
            <span className="material-symbols-rounded text-sm">add</span>
            새 태스크
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Task List Sidebar */}
        <div className="w-[450px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark overflow-y-auto custom-scrollbar flex-shrink-0">
          <TaskList
            tasks={tasks}
            projectId={projectId}
            users={users}
            onTaskUpdate={loadProjectData}
          />
        </div>

        {/* Gantt Chart */}
        <div className="flex-1 bg-white dark:bg-background-dark overflow-auto custom-scrollbar p-6">
          {viewMode === 'gantt' && (
            <GanttChart
              tasks={tasks}
              onTaskUpdate={handleTaskUpdate}
              onProgressUpdate={handleProgressUpdate}
            />
          )}
          {viewMode === 'kanban' && (
            <div className="text-center text-slate-500 mt-20">
              칸반 뷰는 곧 제공될 예정입니다.
            </div>
          )}
          {viewMode === 'dashboard' && (
            <div className="text-center text-slate-500 mt-20">
              대시보드 뷰는 곧 제공될 예정입니다.
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        projectId={projectId}
        task={selectedTask}
        users={users}
        onSuccess={loadProjectData}
      />
    </div>
  );
}
