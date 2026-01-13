'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectInput } from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

const colors = [
  { name: 'Purple', value: '#5B4FFF' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#00C875' },
  { name: 'Orange', value: '#FDAB3D' },
  { name: 'Red', value: '#E2445C' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Gray', value: '#6B7280' },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      color: '#5B4FFF',
    },
  });

  const selectedColor = watch('color');

  const onSubmit = async (data: ProjectInput) => {
    setIsLoading(true);
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
        .select('org_id, role')
        .eq('id', session.user.id)
        .single();

      if (!user) {
        toast.error('사용자 정보를 찾을 수 없습니다.');
        return;
      }

      if (user.role !== 'admin' && user.role !== 'member') {
        toast.error('권한이 없습니다.');
        return;
      }

      // Create project
      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          ...data,
          org_id: user.org_id,
          created_by: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('프로젝트가 생성되었습니다!');
      router.push(`/dashboard/projects/${project.id}`);
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast.error(error.message || '프로젝트 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">새 프로젝트</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            프로젝트명 *
          </label>
          <Input
            id="name"
            placeholder="예: 신제품 출시 프로젝트"
            {...register('name')}
            className={errors.name ? 'border-danger' : ''}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-danger">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            설명
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="프로젝트에 대한 설명을 입력하세요"
            {...register('description')}
            className="flex w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
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
          <label className="block text-sm font-medium mb-2">색상 *</label>
          <div className="flex gap-3">
            {colors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setValue('color', color.value)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color.value
                    ? 'border-primary scale-110'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
          {errors.color && (
            <p className="mt-1 text-sm text-danger">{errors.color.message}</p>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-primary text-white"
            disabled={isLoading}
          >
            {isLoading ? '생성 중...' : '프로젝트 생성'}
          </Button>
        </div>
      </form>
    </div>
  );
}
