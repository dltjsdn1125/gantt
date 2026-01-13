'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type TaskInput } from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import type { User, Task } from '@/types/database.types';
import toast from 'react-hot-toast';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  parentId?: string | null;
  task?: Task | null;
  users: User[];
  onSuccess?: () => void;
}

export default function TaskModal({
  isOpen,
  onClose,
  projectId,
  parentId,
  task,
  users,
  onSuccess,
}: TaskModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!task;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      project_id: projectId,
      priority: 'medium',
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        assigned_to: task.assigned_to || null,
        start_date: task.start_date,
        end_date: task.end_date,
        priority: task.priority,
        parent_id: task.parent_id || null,
      });
    } else {
      reset({
        project_id: projectId,
        parent_id: parentId || null,
        priority: 'medium',
      });
    }
  }, [task, projectId, parentId, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: TaskInput) => {
    setIsLoading(true);
    try {
      if (isEdit) {
        // Update task
        const { error } = await supabase
          .from('tasks')
          .update({
            title: data.title,
            description: data.description,
            assigned_to: data.assigned_to,
            start_date: data.start_date,
            end_date: data.end_date,
            priority: data.priority,
          })
          .eq('id', task!.id);

        if (error) throw error;
        toast.success('태스크가 수정되었습니다.');
      } else {
        // Create task
        const { error } = await supabase
          .from('tasks')
          .insert({
            ...data,
            project_id: projectId,
            parent_id: parentId || null,
          });

        if (error) throw error;
        toast.success('태스크가 생성되었습니다.');
      }

      onSuccess?.();
      onClose();
      reset();
    } catch (error: any) {
      console.error('Error saving task:', error);
      toast.error(error.message || '태스크 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{isEdit ? '태스크 수정' : '새 태스크'}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              태스크명 *
            </label>
            <Input
              id="title"
              placeholder="태스크명을 입력하세요"
              {...register('title')}
              className={errors.title ? 'border-danger' : ''}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-danger">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              설명
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="태스크에 대한 설명을 입력하세요"
              {...register('description')}
              className="flex w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="assigned_to" className="block text-sm font-medium mb-2">
              담당자
            </label>
            <select
              id="assigned_to"
              {...register('assigned_to')}
              className="flex h-10 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <option value="">담당자 선택</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">기간 *</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="date"
                  {...register('start_date')}
                  className={errors.start_date ? 'border-danger' : ''}
                />
                {errors.start_date && (
                  <p className="mt-1 text-sm text-danger">{errors.start_date.message}</p>
                )}
              </div>
              <div>
                <Input
                  type="date"
                  {...register('end_date')}
                  className={errors.end_date ? 'border-danger' : ''}
                />
                {errors.end_date && (
                  <p className="mt-1 text-sm text-danger">{errors.end_date.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-2">
              우선순위
            </label>
            <select
              id="priority"
              {...register('priority')}
              className="flex h-10 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <option value="low">낮음</option>
              <option value="medium">보통</option>
              <option value="high">높음</option>
              <option value="urgent">긴급</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-white"
              disabled={isLoading}
            >
              {isLoading ? (isEdit ? '수정 중...' : '생성 중...') : isEdit ? '수정' : '생성'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
