'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { registerSchema, type RegisterInput } from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      // 1. Supabase Auth 회원가입
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        toast.error(authError.message);
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        toast.error('회원가입에 실패했습니다.');
        setIsLoading(false);
        return;
      }

      // 2. 조직 생성
      const slug = data.orgName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: data.orgName,
          slug: slug,
        })
        .select()
        .single();

      if (orgError) {
        toast.error(orgError.message);
        setIsLoading(false);
        return;
      }

      // 3. 사용자 정보 저장
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: data.email,
          full_name: data.fullName,
          org_id: org.id,
          role: 'admin',
        });

      if (userError) {
        toast.error(userError.message);
        setIsLoading(false);
        return;
      }

      toast.success('회원가입이 완료되었습니다! 이메일을 확인해주세요.');
      router.push('/login');
    } catch (error) {
      toast.error('예기치 않은 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass-card p-8 rounded-2xl shadow-xl border border-white/10">
        <h1 className="text-3xl font-extrabold mb-2">회원가입</h1>
        <p className="text-slate-500 mb-8">새 계정을 만들어 시작하세요</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              이메일
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register('email')}
              className={errors.email ? 'border-danger' : ''}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-danger">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              비밀번호 (8자 이상)
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={errors.password ? 'border-danger' : ''}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-danger">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">
              이름
            </label>
            <Input
              id="fullName"
              type="text"
              placeholder="홍길동"
              {...register('fullName')}
              className={errors.fullName ? 'border-danger' : ''}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-danger">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="orgName" className="block text-sm font-medium mb-2">
              조직명 (새로 만들기)
            </label>
            <Input
              id="orgName"
              type="text"
              placeholder="우리 회사"
              {...register('orgName')}
              className={errors.orgName ? 'border-danger' : ''}
            />
            {errors.orgName && (
              <p className="mt-1 text-sm text-danger">{errors.orgName.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/25 hover:scale-105 transition-all"
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : '회원가입'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-500">이미 계정이 있으신가요? </span>
          <Link href="/login" className="text-primary font-semibold hover:underline">
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
}
