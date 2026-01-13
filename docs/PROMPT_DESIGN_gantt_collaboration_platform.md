# PROMPT DESIGN: 부서 협업 간트차트 플랫폼 - AI 코딩 가이드

## 📌 문서 개요

이 문서는 Cursor, Claude, GitHub Copilot 등 AI 코딩 도구를 활용하여 부서 협업 간트차트 플랫폼을 구현하기 위한 **마스터 프롬프트 설계서**입니다.

**목표**: 이 문서의 프롬프트를 AI에게 제공하면 전체 프로젝트 구조와 핵심 기능을 한 번에 생성할 수 있도록 설계

---

## 1. 마스터 프롬프트 (전체 프로젝트 생성)

### 1.1 프로젝트 초기화 프롬프트

```
당신은 30년 경력의 풀스택 개발자입니다. 아래 요구사항에 따라 부서 협업 간트차트 플랫폼을 개발하세요.

## 기술 스택
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Backend: Supabase (PostgreSQL, Auth, Realtime)
- 간트차트: frappe-gantt (오픈소스)
- 상태관리: Zustand
- 폼 처리: React Hook Form + Zod

## 프로젝트 구조
gantt-platform/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── projects/
│   │   │   └── [id]/
│   │   │       ├── page.tsx (간트차트 메인)
│   │   │       └── layout.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   ├── projects/
│   │   └── tasks/
│   ├── layout.tsx
│   └── page.tsx (랜딩)
├── components/
│   ├── ui/ (shadcn 컴포넌트)
│   ├── gantt/
│   │   ├── GanttChart.tsx
│   │   └── TaskList.tsx
│   ├── dashboard/
│   │   └── ProjectCard.tsx
│   └── shared/
│       ├── Header.tsx
│       └── Sidebar.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── utils.ts
│   └── validations.ts
├── types/
│   └── database.types.ts
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
└── package.json

## 핵심 기능 구현 순서
1. Supabase 데이터베이스 스키마 생성
2. 인증 시스템 (회원가입/로그인)
3. 대시보드 (프로젝트 목록)
4. 프로젝트/태스크 CRUD
5. 간트차트 렌더링 (frappe-gantt)
6. 실시간 동기화 (Supabase Realtime)
7. 댓글/알림 시스템

## 디자인 가이드
- 컬러 팔레트: Primary=#5B4FFF, Success=#00C875, Warning=#FDAB3D
- Monday.com 스타일의 깔끔한 UI
- 모바일 반응형 (Tailwind breakpoints)
- 다크모드 미지원 (Phase 2)

## 즉시 실행할 작업
1. package.json 생성 (필요한 모든 의존성 포함)
2. Supabase 마이그레이션 SQL 파일 작성
3. 환경변수 설정 가이드 (.env.example)
4. 기본 레이아웃 및 라우팅 구조 생성

시작하세요!
```

---

## 2. 단계별 세부 프롬프트

### 2.1 데이터베이스 스키마 생성 프롬프트

```
Supabase PostgreSQL 데이터베이스 스키마를 생성하세요.

## 요구사항
- organizations, users, projects, tasks, task_dependencies, comments, activities 테이블
- UUID 기본 키 사용
- created_at, updated_at 타임스탬프 자동 관리
- Row Level Security (RLS) 정책 포함
- 인덱스 최적화 (조회 성능 고려)

## 테이블 관계
- organizations 1:N users
- organizations 1:N projects
- projects 1:N tasks
- tasks M:N task_dependencies (자기 참조)
- tasks 1:N comments
- tasks 1:N activities

## 예시 코드 요청
- 001_initial_schema.sql 파일 생성
- 각 테이블마다 CREATE TABLE, INDEX, RLS 정책 포함
- 샘플 데이터 INSERT 문 (테스트용)

파일 경로: supabase/migrations/001_initial_schema.sql
```

**기대 출력**:
```sql
-- organizations 테이블
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own organization"
  ON organizations FOR SELECT
  USING (id IN (SELECT org_id FROM users WHERE id = auth.uid()));

-- ... (나머지 테이블 동일 패턴)
```

---

### 2.2 Next.js 프로젝트 설정 프롬프트

```
Next.js 14 프로젝트를 설정하세요.

## package.json 생성
- next: ^14.2.0
- react: ^18.3.0
- typescript: ^5.4.0
- tailwindcss: ^3.4.0
- @supabase/supabase-js: ^2.39.0
- @supabase/auth-helpers-nextjs: ^0.10.0
- frappe-gantt: ^0.6.1
- zustand: ^4.5.0
- react-hook-form: ^7.50.0
- zod: ^3.22.0
- date-fns: ^3.3.0
- lucide-react: ^0.344.0
- react-hot-toast: ^2.4.1

## 설정 파일 생성
1. tsconfig.json (strict 모드)
2. tailwind.config.ts (shadcn 호환)
3. next.config.js (이미지 최적화)
4. .env.example (환경변수 템플릿)

## 폴더 구조
- app/ (App Router)
- components/ (재사용 컴포넌트)
- lib/ (유틸리티)
- types/ (TypeScript 타입)

파일 생성 시작!
```

---

### 2.3 인증 시스템 구현 프롬프트

```
Supabase Auth를 사용한 회원가입/로그인 페이지를 구현하세요.

## 파일 구조
app/(auth)/
├── login/page.tsx
├── register/page.tsx
└── layout.tsx

## 요구사항
1. 이메일/비밀번호 인증
2. React Hook Form + Zod 유효성 검사
3. 회원가입 시 조직 자동 생성
4. 로그인 성공 시 /dashboard 리다이렉트
5. shadcn/ui Input, Button 컴포넌트 사용

## 유효성 검사 규칙
- 이메일: 유효한 형식, 필수
- 비밀번호: 최소 8자, 영문+숫자 조합, 필수
- 이름: 2~50자, 필수
- 조직명: 2~50자, 필수

## 예시 코드
```typescript
// app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const registerSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
  fullName: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
  orgName: z.string().min(2, '조직명은 최소 2자 이상이어야 합니다')
});

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    // 1. Supabase Auth 회원가입
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password
    });

    if (authError) {
      toast.error(authError.message);
      return;
    }

    // 2. 조직 생성
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: data.orgName,
        slug: data.orgName.toLowerCase().replace(/\s+/g, '-')
      })
      .select()
      .single();

    // 3. 사용자 정보 저장
    await supabase.from('users').insert({
      id: authData.user.id,
      email: data.email,
      full_name: data.fullName,
      org_id: org.id,
      role: 'admin'
    });

    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 폼 필드 구현 */}
    </form>
  );
}
```

완성된 코드를 생성하세요!
```

---

### 2.4 간트차트 구현 프롬프트

```
frappe-gantt를 사용하여 간트차트 컴포넌트를 구현하세요.

## 파일 위치
components/gantt/GanttChart.tsx

## 기능 요구사항
1. 프로젝트 ID를 props로 받아 태스크 데이터 로드
2. 드래그&드롭으로 일정 조정
3. 의존성 화살표 표시
4. 뷰 모드 전환 (일간/주간/월간)
5. 오늘 날짜 하이라이트
6. 태스크 클릭 시 상세 정보 표시

## 데이터 구조
```typescript
interface GanttTask {
  id: string;
  name: string;
  start: string; // ISO 8601
  end: string;
  progress: number; // 0-100
  dependencies: string; // 선행 태스크 ID (쉼표로 구분)
  custom_class?: string; // CSS 클래스
}
```

## 예시 코드
```typescript
'use client';

import { useEffect, useRef, useState } from 'react';
import Gantt from 'frappe-gantt';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface GanttChartProps {
  projectId: string;
}

export default function GanttChart({ projectId }: GanttChartProps) {
  const ganttRef = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  async function loadTasks() {
    const { data } = await supabase
      .from('tasks')
      .select(`
        id,
        title,
        start_date,
        end_date,
        progress,
        task_dependencies (
          depends_on_task_id
        )
      `)
      .eq('project_id', projectId);

    const ganttTasks = data.map(task => ({
      id: task.id,
      name: task.title,
      start: task.start_date,
      end: task.end_date,
      progress: task.progress,
      dependencies: task.task_dependencies
        .map(d => d.depends_on_task_id)
        .join(',')
    }));

    setTasks(ganttTasks);
  }

  useEffect(() => {
    if (!ganttRef.current || tasks.length === 0) return;

    const gantt = new Gantt(ganttRef.current, tasks, {
      view_mode: 'Week',
      date_format: 'YYYY-MM-DD',
      on_click: (task) => {
        console.log('Task clicked:', task);
      },
      on_date_change: async (task, start, end) => {
        await supabase
          .from('tasks')
          .update({ start_date: start, end_date: end })
          .eq('id', task.id);
      },
      on_progress_change: async (task, progress) => {
        await supabase
          .from('tasks')
          .update({ progress })
          .eq('id', task.id);
      }
    });

    return () => {
      gantt.destroy();
    };
  }, [tasks]);

  return <div ref={ganttRef}></div>;
}
```

완성된 컴포넌트를 생성하세요!
```

---

### 2.5 실시간 동기화 구현 프롬프트

```
Supabase Realtime을 사용하여 태스크 변경사항을 실시간 동기화하세요.

## 구현 위치
app/(dashboard)/projects/[id]/page.tsx

## 요구사항
1. 프로젝트 내 모든 태스크 변경사항 구독
2. INSERT, UPDATE, DELETE 이벤트 처리
3. 낙관적 UI 업데이트
4. 충돌 처리 (last-write-wins)

## 예시 코드
```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import GanttChart from '@/components/gantt/GanttChart';

export default function ProjectPage({ params }) {
  const [tasks, setTasks] = useState([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // 초기 데이터 로드
    loadTasks();

    // 실시간 구독
    const channel = supabase
      .channel(`project-${params.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${params.id}`
        },
        (payload) => {
          handleRealtimeEvent(payload);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [params.id]);

  function handleRealtimeEvent(payload) {
    if (payload.eventType === 'INSERT') {
      setTasks((prev) => [...prev, payload.new]);
    } else if (payload.eventType === 'UPDATE') {
      setTasks((prev) =>
        prev.map((t) => (t.id === payload.new.id ? payload.new : t))
      );
    } else if (payload.eventType === 'DELETE') {
      setTasks((prev) => prev.filter((t) => t.id !== payload.old.id));
    }
  }

  async function loadTasks() {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', params.id);
    setTasks(data);
  }

  return (
    <div>
      <GanttChart tasks={tasks} />
    </div>
  );
}
```

완성된 코드를 생성하세요!
```

---

### 2.6 대시보드 구현 프롬프트

```
프로젝트 카드 그리드 대시보드를 구현하세요.

## 파일 위치
app/(dashboard)/dashboard/page.tsx

## 요구사항
1. 사용자 조직의 모든 프로젝트 표시
2. 프로젝트별 진행률 표시 (진행률 바)
3. 최근 활동 피드
4. "+ 새 프로젝트" 버튼
5. 프로젝트 카드 클릭 시 상세 페이지 이동

## 디자인
- 그리드 레이아웃 (데스크탑: 3열, 태블릿: 2열, 모바일: 1열)
- 프로젝트 색상별 배경
- 진행률 바 (애니메이션)

## 예시 코드
```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ProjectCard from '@/components/dashboard/ProjectCard';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session }
  } = await supabase.auth.getSession();

  const { data: user } = await supabase
    .from('users')
    .select('org_id')
    .eq('id', session.user.id)
    .single();

  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      tasks (
        id,
        progress
      )
    `)
    .eq('org_id', user.org_id);

  // 각 프로젝트의 평균 진행률 계산
  const projectsWithProgress = projects.map((project) => ({
    ...project,
    avgProgress:
      project.tasks.length > 0
        ? project.tasks.reduce((sum, t) => sum + t.progress, 0) / project.tasks.length
        : 0
  }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">내 프로젝트</h1>
        <button className="btn-primary">+ 새 프로젝트</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsWithProgress.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
```

완성된 코드를 생성하세요!
```

---

## 3. 변수 정의 및 설정

### 3.1 환경변수 (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 이메일 (Resend - 선택)
RESEND_API_KEY=re_xxx
```

### 3.2 타입 정의 (types/database.types.ts)

```typescript
export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  org_id: string;
  role: 'admin' | 'member' | 'viewer';
  created_at: string;
  last_login?: string;
}

export interface Project {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  color: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  parent_id?: string;
  title: string;
  description?: string;
  assigned_to?: string;
  start_date: string;
  end_date: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  mentions: string[];
  created_at: string;
  updated_at: string;
}
```

---

## 4. Few-shot 예시

### 4.1 CRUD 함수 패턴

**프롬프트**:
```
아래 패턴을 따라 프로젝트 CRUD API 라우트를 생성하세요.

## 파일 구조
app/api/projects/
├── route.ts (GET, POST)
└── [id]/route.ts (GET, PUT, DELETE)

## 패턴
1. createRouteHandlerClient 사용
2. 세션 검증
3. 조직 권한 확인
4. Zod 스키마 유효성 검사
5. 에러 핸들링

## 예시
```typescript
// app/api/projects/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

const projectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  start_date: z.string(),
  end_date: z.string(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i)
});

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  // 1. 세션 검증
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. 요청 바디 파싱
  const body = await request.json();

  // 3. 유효성 검사
  const validation = projectSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // 4. 사용자 조직 확인
  const { data: user } = await supabase
    .from('users')
    .select('org_id')
    .eq('id', session.user.id)
    .single();

  // 5. 프로젝트 생성
  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...validation.data,
      org_id: user.org_id,
      created_by: session.user.id
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
```

이 패턴을 따라 태스크 API도 생성하세요!
```

---

### 4.2 컴포넌트 생성 패턴

**프롬프트**:
```
아래 패턴을 따라 재사용 가능한 컴포넌트를 생성하세요.

## 패턴
1. TypeScript Props 인터페이스 정의
2. shadcn/ui 기본 컴포넌트 활용
3. Tailwind CSS 스타일링
4. 접근성 (ARIA 라벨)
5. 로딩/에러 상태 처리

## 예시: 프로젝트 카드
```typescript
// components/dashboard/ProjectCard.tsx
import Link from 'next/link';
import { Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    color: string;
    start_date: string;
    end_date: string;
    avgProgress: number;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="block p-6 rounded-lg border hover:shadow-lg transition-shadow"
      style={{ borderLeftColor: project.color, borderLeftWidth: '4px' }}
    >
      <h3 className="text-xl font-semibold mb-2">{project.name}</h3>

      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Calendar className="w-4 h-4" />
        <span>
          {new Date(project.start_date).toLocaleDateString()} ~{' '}
          {new Date(project.end_date).toLocaleDateString()}
        </span>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span>진행률</span>
          <span className="font-semibold">{project.avgProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${project.avgProgress}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
```

이 패턴을 따라 TaskCard 컴포넌트도 생성하세요!
```

---

## 5. 자동화 전략

### 5.1 Cursor Rules 설정

`.cursorrules` 파일 생성:

```
# 프로젝트 컨텍스트
이 프로젝트는 Next.js 14 + Supabase 기반 간트차트 협업 플랫폼입니다.

## 코딩 스타일
- TypeScript strict 모드
- 함수형 컴포넌트 + Hooks
- async/await 사용 (Promise.then 금지)
- 명확한 변수명 (약어 최소화)

## 파일 구조 규칙
- 서버 컴포넌트: async function, cookies() 사용
- 클라이언트 컴포넌트: 'use client' 지시어
- API 라우트: NextResponse 반환

## 필수 패턴
1. 모든 API 호출에 에러 핸들링
2. 낙관적 UI 업데이트 (Zustand)
3. RLS 정책으로 권한 제어
4. Zod로 입력 유효성 검사

## 금지 사항
- 인라인 스타일 (Tailwind 사용)
- any 타입 (명시적 타입 정의)
- console.log (프로덕션 코드)
```

---

### 5.2 GitHub Copilot Chat 템플릿

```
@workspace 아래 작업을 수행하세요:

1. /api/tasks 엔드포인트 생성
   - GET: 프로젝트별 태스크 목록 조회
   - POST: 새 태스크 생성 (담당자에게 이메일 알림)

2. components/tasks/TaskModal.tsx 생성
   - React Hook Form + Zod
   - 태스크 제목, 설명, 담당자, 날짜 입력
   - 선행 태스크 선택 드롭다운

3. 실시간 알림 시스템
   - Supabase Realtime으로 태스크 변경사항 구독
   - react-hot-toast로 알림 표시

기존 패턴을 참고하여 일관성 있게 구현하세요.
```

---

### 5.3 Claude Code 워크플로우

**단계별 지시**:

```
Phase 1: 기반 구축 (1-2시간)
1. npm create next-app@latest 실행
2. shadcn/ui 초기화: npx shadcn-ui@latest init
3. Supabase 클라이언트 설정
4. 마이그레이션 SQL 실행

Phase 2: 인증 구현 (1-2시간)
1. app/(auth)/login/page.tsx 생성
2. app/(auth)/register/page.tsx 생성
3. 미들웨어로 보호된 라우트 설정
4. 테스트: 회원가입 → 로그인 → 대시보드 이동

Phase 3: 프로젝트 관리 (2-3시간)
1. 대시보드 페이지 구현
2. 프로젝트 CRUD API 생성
3. 프로젝트 생성 모달
4. 프로젝트 카드 그리드

Phase 4: 간트차트 (3-4시간)
1. frappe-gantt 통합
2. 태스크 CRUD API
3. 드래그&드롭 일정 조정
4. 의존성 설정

Phase 5: 실시간 기능 (2-3시간)
1. Supabase Realtime 구독
2. 낙관적 UI 업데이트
3. 댓글 시스템
4. 알림 시스템

각 단계마다 코드 생성 후 테스트하세요.
```

---

## 6. 성능 최적화 프롬프트

```
아래 성능 최적화를 적용하세요:

## 1. 이미지 최적화
- Next.js Image 컴포넌트 사용
- 아바타: 32x32, 64x64, 128x128 크기 생성
- WebP 포맷

## 2. 코드 스플리팅
```typescript
// 간트차트는 클라이언트 전용
const GanttChart = dynamic(() => import('@/components/gantt/GanttChart'), {
  loading: () => <Skeleton className="h-96" />,
  ssr: false
});
```

## 3. 데이터 페치 최적화
- React Query (또는 SWR) 캐싱
- 페이지네이션 (50개씩 로드)
- 가상 스크롤링 (react-window)

## 4. 번들 사이즈 최적화
- date-fns에서 필요한 함수만 import
- lodash 대신 개별 유틸 함수 작성
- next/bundle-analyzer로 분석

적용 후 Lighthouse 점수 측정하세요.
```

---

## 7. 테스트 자동화 프롬프트

```
Playwright 테스트 스크립트를 생성하세요.

## 테스트 시나리오
1. 회원가입 플로우
2. 프로젝트 생성
3. 태스크 추가 및 간트차트 업데이트
4. 실시간 동기화 (2개 브라우저)

## 예시
```typescript
// e2e/project.spec.ts
import { test, expect } from '@playwright/test';

test('프로젝트 생성 및 간트차트 확인', async ({ page }) => {
  // 로그인
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // 프로젝트 생성
  await page.click('text=+ 새 프로젝트');
  await page.fill('[name="name"]', '테스트 프로젝트');
  await page.fill('[name="start_date"]', '2026-01-13');
  await page.fill('[name="end_date"]', '2026-03-31');
  await page.click('button:has-text("프로젝트 생성")');

  // 프로젝트 페이지로 이동 확인
  await expect(page).toHaveURL(/\/projects\/[a-z0-9-]+/);

  // 간트차트 렌더링 확인
  await expect(page.locator('.gantt')).toBeVisible();
});
```

전체 E2E 테스트 스위트를 생성하세요.
```

---

## 8. 배포 자동화 프롬프트

```
Vercel 배포 설정을 생성하세요.

## 파일 생성
1. vercel.json (설정 파일)
2. .github/workflows/deploy.yml (GitHub Actions)

## 요구사항
- main 브랜치 푸시 시 자동 배포
- PR 생성 시 프리뷰 배포
- 환경변수 자동 주입

## 예시: vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

## GitHub Actions
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

설정 파일을 생성하세요!
```

---

## 9. 문서 자동 생성 프롬프트

```
프로젝트 README.md를 생성하세요.

## 포함 내용
1. 프로젝트 소개
2. 주요 기능
3. 기술 스택
4. 로컬 개발 환경 설정
5. 배포 가이드
6. 스크린샷 (향후 추가)
7. 라이선스

## 예시
```markdown
# 간트차트 협업 플랫폼

부서 간 프로젝트를 실시간으로 관리하는 간트차트 기반 협업 도구입니다.

## 주요 기능

- 🗓️ 간트차트 타임라인 뷰
- 👥 부서별 태스크 할당
- ⚡ 실시간 동기화
- 💬 태스크별 댓글
- 📧 알림 시스템

## 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **차트**: frappe-gantt
- **배포**: Vercel

## 로컬 개발

1. 레포지토리 클론
```bash
git clone https://github.com/yourusername/gantt-platform.git
cd gantt-platform
```

2. 의존성 설치
```bash
npm install
```

3. 환경변수 설정
```bash
cp .env.example .env.local
# .env.local에 Supabase 정보 입력
```

4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 http://localhost:3000 열기

## 라이선스

MIT
```

완성된 README를 생성하세요!
```

---

## 10. 통합 마스터 프롬프트 (원샷 완성)

```
당신은 30년 경력의 풀스택 개발자입니다. 아래 요구사항에 따라 부서 협업 간트차트 플랫폼의 완전한 MVP를 생성하세요.

## 최종 목표
프로젝트를 생성하고, npm install → npm run dev만으로 즉시 실행 가능한 상태로 만들기

## 생성할 파일 (우선순위 순)

### 1단계: 프로젝트 설정
- [ ] package.json (모든 의존성 포함)
- [ ] tsconfig.json
- [ ] tailwind.config.ts
- [ ] next.config.js
- [ ] .env.example

### 2단계: 데이터베이스
- [ ] supabase/migrations/001_initial_schema.sql
- [ ] types/database.types.ts

### 3단계: 인증
- [ ] app/(auth)/login/page.tsx
- [ ] app/(auth)/register/page.tsx
- [ ] app/(auth)/layout.tsx
- [ ] middleware.ts (보호된 라우트)

### 4단계: 대시보드
- [ ] app/(dashboard)/dashboard/page.tsx
- [ ] app/(dashboard)/layout.tsx (헤더, 사이드바)
- [ ] components/dashboard/ProjectCard.tsx

### 5단계: 프로젝트 관리
- [ ] app/(dashboard)/projects/[id]/page.tsx
- [ ] app/api/projects/route.ts
- [ ] app/api/projects/[id]/route.ts

### 6단계: 간트차트
- [ ] components/gantt/GanttChart.tsx
- [ ] components/gantt/TaskList.tsx
- [ ] app/api/tasks/route.ts
- [ ] app/api/tasks/[id]/route.ts

### 7단계: 실시간 기능
- [ ] lib/supabase/realtime.ts
- [ ] app/api/comments/route.ts

### 8단계: UI 컴포넌트
- [ ] components/ui/button.tsx (shadcn)
- [ ] components/ui/input.tsx
- [ ] components/ui/dialog.tsx
- [ ] components/shared/Header.tsx
- [ ] components/shared/Sidebar.tsx

### 9단계: 유틸리티
- [ ] lib/utils.ts
- [ ] lib/validations.ts
- [ ] lib/supabase/client.ts
- [ ] lib/supabase/server.ts

### 10단계: 문서
- [ ] README.md
- [ ] .cursorrules

## 코딩 원칙
1. TypeScript strict 모드
2. 모든 컴포넌트에 Props 인터페이스
3. async/await + try-catch 에러 핸들링
4. Tailwind CSS만 사용 (인라인 스타일 금지)
5. 접근성 (ARIA 라벨, 키보드 네비게이션)

## 완료 조건
- npm install 성공
- npm run dev 실행 시 에러 없이 서버 구동
- http://localhost:3000 접속 시 랜딩 페이지 표시
- 회원가입 → 로그인 → 대시보드 → 프로젝트 생성 → 간트차트 표시까지 작동

지금 바로 시작하세요!
```

---

## 11. 체크리스트 (개발 완료 확인)

```markdown
## MVP 개발 체크리스트

### 인프라
- [ ] Supabase 프로젝트 생성
- [ ] 환경변수 설정
- [ ] 데이터베이스 마이그레이션 실행
- [ ] RLS 정책 활성화

### 인증
- [ ] 회원가입 기능
- [ ] 로그인 기능
- [ ] 로그아웃 기능
- [ ] 이메일 인증
- [ ] 보호된 라우트

### 프로젝트 관리
- [ ] 프로젝트 생성
- [ ] 프로젝트 수정
- [ ] 프로젝트 삭제
- [ ] 프로젝트 목록 조회

### 태스크 관리
- [ ] 태스크 생성
- [ ] 태스크 수정
- [ ] 태스크 삭제
- [ ] 태스크 할당
- [ ] 진행률 업데이트

### 간트차트
- [ ] 간트차트 렌더링
- [ ] 드래그&드롭 일정 조정
- [ ] 의존성 표시
- [ ] 뷰 모드 전환 (일/주/월)
- [ ] 오늘 날짜 하이라이트

### 실시간 기능
- [ ] WebSocket 연결
- [ ] 태스크 변경사항 실시간 반영
- [ ] 댓글 실시간 업데이트
- [ ] 현재 편집 중 표시

### 협업
- [ ] 댓글 작성
- [ ] 멘션 기능
- [ ] 알림 시스템
- [ ] 멤버 초대

### UI/UX
- [ ] 반응형 디자인
- [ ] 로딩 스켈레톤
- [ ] 에러 핸들링
- [ ] 토스트 알림
- [ ] 다크모드 (선택)

### 성능
- [ ] Lighthouse 점수 80+ (Performance)
- [ ] 이미지 최적화
- [ ] 코드 스플리팅
- [ ] 캐싱 전략

### 배포
- [ ] Vercel 배포 성공
- [ ] 환경변수 설정
- [ ] 프로덕션 URL 확인
```

---

**문서 버전**: 1.0  
**작성일**: 2026-01-13  
**다음 단계**: 이 프롬프트를 AI 코딩 도구에 제공하여 즉시 개발 시작!
