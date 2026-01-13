'use client';

import { useEffect, useRef, useState } from 'react';
import Gantt from 'frappe-gantt';
import type { Task, GanttTask as GanttTaskType } from '@/types/database.types';
import { format } from 'date-fns';

interface GanttChartProps {
  tasks: Task[];
  onTaskUpdate?: (taskId: string, start: Date, end: Date) => void;
  onProgressUpdate?: (taskId: string, progress: number) => void;
}

export default function GanttChart({ tasks, onTaskUpdate, onProgressUpdate }: GanttChartProps) {
  const ganttRef = useRef<HTMLDivElement>(null);
  const ganttInstanceRef = useRef<Gantt | null>(null);
  const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'Month'>('Week');

  useEffect(() => {
    if (!ganttRef.current || tasks.length === 0) return;

    // Convert tasks to frappe-gantt format
    const ganttTasks = tasks.map((task) => {
      const start = new Date(task.start_date);
      const end = new Date(task.end_date);
      const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      return {
        id: task.id,
        name: task.title,
        start: format(start, 'YYYY-MM-DD'),
        end: format(end, 'YYYY-MM-DD'),
        progress: task.progress / 100,
        dependencies: '', // Will be populated from task_dependencies
        custom_class: `task-${task.status} task-priority-${task.priority}`,
      };
    });

    // Destroy existing instance
    if (ganttInstanceRef.current) {
      ganttInstanceRef.current.destroy();
    }

    // Create new Gantt instance
    const gantt = new Gantt(ganttRef.current, ganttTasks, {
      view_mode: viewMode,
      date_format: 'YYYY-MM-DD',
      header_height: 50,
      column_width: 30,
      step: 24,
      bar_height: 20,
      bar_corner_radius: 3,
      arrow_curve: 5,
      padding: 18,
      popup_trigger: 'click',
      on_click: (task: any) => {
        console.log('Task clicked:', task);
      },
      on_date_change: async (task: any, start: Date, end: Date) => {
        if (onTaskUpdate) {
          onTaskUpdate(task.id, start, end);
        }
      },
      on_progress_change: async (task: any, progress: number) => {
        if (onProgressUpdate) {
          onProgressUpdate(task.id, progress * 100);
        }
      },
      on_view_change: (mode: string) => {
        setViewMode(mode as 'Day' | 'Week' | 'Month');
      },
    });

    ganttInstanceRef.current = gantt;

    return () => {
      if (ganttInstanceRef.current) {
        ganttInstanceRef.current.destroy();
        ganttInstanceRef.current = null;
      }
    };
  }, [tasks, viewMode, onTaskUpdate, onProgressUpdate]);

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('Day')}
            className={`px-3 py-1 text-xs font-semibold rounded ${
              viewMode === 'Day'
                ? 'bg-primary text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
          >
            일간
          </button>
          <button
            onClick={() => setViewMode('Week')}
            className={`px-3 py-1 text-xs font-semibold rounded ${
              viewMode === 'Week'
                ? 'bg-primary text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
          >
            주간
          </button>
          <button
            onClick={() => setViewMode('Month')}
            className={`px-3 py-1 text-xs font-semibold rounded ${
              viewMode === 'Month'
                ? 'bg-primary text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
          >
            월간
          </button>
        </div>
      </div>
      <div ref={ganttRef} className="gantt-container" />
      <style jsx global>{`
        .gantt-container {
          overflow-x: auto;
        }
        .gantt .bar-wrapper .bar {
          fill: #5B4FFF;
        }
        .gantt .bar-wrapper .bar-progress {
          fill: #00C875;
        }
        .task-pending .bar {
          fill: #94a3b8;
        }
        .task-in_progress .bar {
          fill: #3B82F6;
        }
        .task-completed .bar {
          fill: #00C875;
        }
        .task-delayed .bar {
          fill: #E2445C;
        }
        .task-priority-high .bar {
          stroke: #FDAB3D;
          stroke-width: 2;
        }
        .task-priority-urgent .bar {
          stroke: #E2445C;
          stroke-width: 2;
        }
      `}</style>
    </div>
  );
}
