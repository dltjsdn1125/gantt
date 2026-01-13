'use client';

import { useState } from 'react';
import type { Task, User } from '@/types/database.types';
import { formatDate } from '@/lib/utils';
import TaskModal from './TaskModal';

interface TaskListProps {
  tasks: Task[];
  projectId: string;
  users: User[];
  onTaskUpdate?: () => void;
}

const statusColors: Record<string, string> = {
  completed: 'bg-green-500',
  in_progress: 'bg-blue-500',
  pending: 'bg-slate-400',
  delayed: 'bg-rose-500',
};

const statusLabels: Record<string, string> = {
  completed: '완료',
  in_progress: '진행중',
  pending: '대기',
  delayed: '지연',
};

export default function TaskList({ tasks, projectId, users, onTaskUpdate }: TaskListProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['all']));
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Group tasks by parent or status
  const groupedTasks = tasks.reduce((acc, task) => {
    const groupKey = task.parent_id || 'root';
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const getAssignee = (userId?: string | null) => {
    if (!userId) return null;
    return users.find((u) => u.id === userId);
  };

  const getStatusColor = (status: string) => {
    return statusColors[status] || 'bg-slate-400';
  };

  const getStatusLabel = (status: string) => {
    return statusLabels[status] || status;
  };

  return (
    <div className="flex flex-col h-full">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
          <tr>
            <th className="py-3 px-4 font-semibold text-slate-500 w-10">#</th>
            <th className="py-3 px-2 font-semibold text-slate-500">태스크명</th>
            <th className="py-3 px-2 font-semibold text-slate-500 w-24">상태</th>
            <th className="py-3 px-2 font-semibold text-slate-500 w-16">담당자</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {Object.entries(groupedTasks).map(([groupId, groupTasks], groupIndex) => {
            const isExpanded = expandedGroups.has(groupId);
            return (
              <>
                {groupId !== 'root' && (
                  <tr
                    key={`group-${groupId}`}
                    className="bg-pink-50/30 dark:bg-pink-900/10 cursor-pointer"
                    onClick={() => toggleGroup(groupId)}
                  >
                    <td className="py-2 px-4" colSpan={4}>
                      <div className="flex items-center gap-2 font-bold text-pink-600 text-xs">
                        <span className="material-symbols-rounded text-xs">
                          {isExpanded ? 'expand_more' : 'chevron_right'}
                        </span>
                        GROUP {groupIndex + 1}
                      </div>
                    </td>
                  </tr>
                )}
                {isExpanded &&
                  groupTasks.map((task, index) => {
                    const assignee = getAssignee(task.assigned_to);
                    return (
                      <tr
                        key={task.id}
                        className={`group hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer ${
                          selectedTask === task.id ? 'bg-primary/10' : ''
                        }`}
                        onClick={() => {
                          setSelectedTask(task.id);
                          setEditingTask(task);
                          setIsTaskModalOpen(true);
                        }}
                      >
                        <td className="py-3 px-4 text-slate-400">{index + 1}</td>
                        <td className="py-3 px-2 font-medium">{task.title}</td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-1 rounded ${getStatusColor(
                              task.status
                            )} text-white text-[10px] font-bold uppercase tracking-tight`}
                          >
                            {getStatusLabel(task.status)}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          {assignee ? (
                            <div className="w-6 h-6 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center text-white text-[10px] font-bold">
                              {assignee.full_name.charAt(0)}
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-300 ring-2 ring-white dark:ring-slate-900"></div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </>
            );
          })}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-slate-400">
                태스크가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          className="text-xs font-medium text-slate-400 hover:text-primary flex items-center gap-1"
        >
          <span className="material-symbols-rounded text-sm">add</span>
          태스크 추가
        </button>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        projectId={projectId}
        task={editingTask}
        users={users}
        onSuccess={() => {
          onTaskUpdate?.();
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
      />
    </div>
  );
}
