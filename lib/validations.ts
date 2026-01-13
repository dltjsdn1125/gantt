import { z } from 'zod';

// Auth validations
export const registerSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
  fullName: z.string().min(2, '이름은 최소 2자 이상이어야 합니다').max(50),
  orgName: z.string().min(2, '조직명은 최소 2자 이상이어야 합니다').max(50),
});

export const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
});

// Project validations
export const projectSchema = z.object({
  name: z.string().min(1, '프로젝트명을 입력하세요').max(200),
  description: z.string().max(1000).optional(),
  start_date: z.string().min(1, '시작일을 선택하세요'),
  end_date: z.string().min(1, '종료일을 선택하세요'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, '유효한 색상 코드를 입력하세요'),
}).refine((data) => {
  const start = new Date(data.start_date);
  const end = new Date(data.end_date);
  return end >= start;
}, {
  message: '종료일은 시작일보다 이후여야 합니다',
  path: ['end_date'],
});

// Task validations
export const taskSchema = z.object({
  project_id: z.string().uuid().optional(),
  title: z.string().min(1, '태스크명을 입력하세요').max(300),
  description: z.string().max(2000).optional(),
  assigned_to: z.string().uuid().optional().nullable(),
  start_date: z.string().min(1, '시작일을 선택하세요'),
  end_date: z.string().min(1, '종료일을 선택하세요'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  parent_id: z.string().uuid().optional().nullable(),
}).refine((data) => {
  const start = new Date(data.start_date);
  const end = new Date(data.end_date);
  return end >= start;
}, {
  message: '종료일은 시작일보다 이후여야 합니다',
  path: ['end_date'],
});

// Comment validations
export const commentSchema = z.object({
  content: z.string().min(1, '댓글을 입력하세요').max(5000),
  mentions: z.array(z.string().uuid()).default([]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
