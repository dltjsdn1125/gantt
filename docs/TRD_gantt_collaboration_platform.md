# TRD: 부서 협업 간트차트 자동화 플랫폼

## 1. 시스템 아키텍처

### 1.1 전체 구조도
```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Web App    │  │  Mobile Web  │  │   Tablet     │  │
│  │  (React.js)  │  │ (Responsive) │  │   (iPadOS)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                    HTTPS / WSS
                            │
┌─────────────────────────────────────────────────────────┐
│                   API Gateway Layer                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Next.js API Routes (Edge Functions)             │  │
│  │  - REST API Endpoints                            │  │
│  │  - WebSocket Handler (실시간 동기화)             │  │
│  │  - Rate Limiting (100 req/min)                   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
┌───────────────▼───────────┐  ┌───────▼──────────────┐
│   Application Layer       │  │   Real-time Layer    │
│  ┌─────────────────────┐  │  │  ┌───────────────┐  │
│  │  Business Logic     │  │  │  │  Supabase     │  │
│  │  - Auth Service     │  │  │  │  Realtime     │  │
│  │  - Project Service  │  │  │  │  (WebSocket)  │  │
│  │  - Task Service     │  │  │  └───────────────┘  │
│  │  - Gantt Engine     │  │  │                      │
│  └─────────────────────┘  │  └──────────────────────┘
└───────────────────────────┘
                │
┌───────────────▼───────────────────────────────────────┐
│               Data Layer                               │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  PostgreSQL  │  │   Redis      │  │   S3       │  │
│  │  (Supabase)  │  │  (Caching)   │  │  (Files)   │  │
│  │  - Users     │  │  - Sessions  │  │  - Avatars │  │
│  │  - Projects  │  │  - WSS State │  │  - Exports │  │
│  │  - Tasks     │  │              │  │            │  │
│  └──────────────┘  └──────────────┘  └────────────┘  │
└───────────────────────────────────────────────────────┘
```

### 1.2 기술 선택 근거

**Frontend: Next.js 14 + TypeScript + Tailwind CSS**
- 이유: SSR/SSG로 초기 로딩 최적화, 최신 트렌드 반영
- 간트차트 라이브러리: `@bryntum/gantt` 또는 `dhtmlx-gantt` (상용), `frappe-gantt` (오픈소스)
- 상태관리: Zustand (Redux보다 심플)
- 실시간 통신: Supabase Realtime (WebSocket 추상화)

**Backend: Supabase (PostgreSQL + Auth + Realtime)**
- 이유: 백엔드 개발 시간 80% 단축, 실시간 기능 내장
- Auth: 이메일 로그인, JWT 자동 관리
- Database: PostgreSQL 14+ (Row Level Security)
- Storage: 파일 업로드 (향후 확장)

**Deployment**
- Frontend: Vercel (Next.js 최적화)
- Backend: Supabase Cloud (무료 티어로 시작)
- CDN: Cloudflare (정적 자산)

### 1.3 개발 우선순위
```
Phase 1 (4주): 핵심 기능
- 로그인/회원가입
- 프로젝트/태스크 CRUD
- 간트차트 기본 렌더링
- 실시간 동기화

Phase 2 (2주): 협업 기능
- 댓글/멘션
- 알림 시스템
- 권한 관리

Phase 3 (2주): 최적화
- 성능 튜닝
- 모바일 반응형
- 대시보드
```

---

## 2. 기술 스택 상세

### 2.1 Frontend Stack
```json
{
  "framework": "Next.js 14.2+",
  "language": "TypeScript 5.0+",
  "styling": "Tailwind CSS 3.4+",
  "gantt_library": "frappe-gantt (MIT License)",
  "state_management": "Zustand 4.5+",
  "form_handling": "React Hook Form 7.0+",
  "validation": "Zod 3.22+",
  "date_handling": "date-fns 3.0+",
  "ui_components": "shadcn/ui (Radix UI 기반)",
  "icons": "lucide-react",
  "charts": "recharts 2.10+",
  "notifications": "react-hot-toast"
}
```

### 2.2 Backend Stack
```json
{
  "database": "PostgreSQL 14+ (Supabase)",
  "auth": "Supabase Auth (JWT)",
  "realtime": "Supabase Realtime (WebSocket)",
  "storage": "Supabase Storage (S3 호환)",
  "api": "Next.js API Routes",
  "caching": "Redis (Upstash - 무료 티어)",
  "email": "Resend.com (트랜잭션 이메일)"
}
```

### 2.3 DevOps Stack
```json
{
  "hosting": "Vercel (Frontend)",
  "database_hosting": "Supabase Cloud",
  "cdn": "Cloudflare",
  "monitoring": "Vercel Analytics + Sentry",
  "ci_cd": "GitHub Actions",
  "version_control": "Git + GitHub"
}
```

---

## 3. 데이터베이스 설계

### 3.1 ERD (Entity Relationship Diagram)
```
┌─────────────────┐         ┌──────────────────┐
│  organizations  │◄────────│   users          │
│─────────────────│  1    * │──────────────────│
│ id (uuid)       │         │ id (uuid)        │
│ name            │         │ email            │
│ slug            │         │ full_name        │
│ created_at      │         │ avatar_url       │
└─────────────────┘         │ org_id (FK)      │
                            │ role (enum)      │
        │                   └──────────────────┘
        │ 1                          │
        │                            │ *
        │ *                          │
┌───────▼─────────┐         ┌────────▼─────────┐
│   projects      │         │   comments       │
│─────────────────│         │──────────────────│
│ id (uuid)       │         │ id (uuid)        │
│ org_id (FK)     │         │ task_id (FK)     │
│ name            │         │ user_id (FK)     │
│ description     │         │ content          │
│ color           │         │ created_at       │
│ status (enum)   │         └──────────────────┘
│ start_date      │
│ end_date        │
│ created_by (FK) │
└─────────────────┘
        │
        │ 1
        │
        │ *
┌───────▼─────────┐         ┌──────────────────┐
│     tasks       │─────────│  task_dependencies│
│─────────────────│  *    * │──────────────────│
│ id (uuid)       │         │ task_id (FK)     │
│ project_id (FK) │         │ depends_on (FK)  │
│ parent_id (FK)  │         │ type (enum)      │
│ title           │         └──────────────────┘
│ description     │
│ assigned_to(FK) │         ┌──────────────────┐
│ start_date      │         │   activities     │
│ end_date        │         │──────────────────│
│ progress (int)  │         │ id (uuid)        │
│ status (enum)   │◄────────│ user_id (FK)     │
│ priority (enum) │  1    * │ task_id (FK)     │
│ order (int)     │         │ action (enum)    │
└─────────────────┘         │ created_at       │
                            └──────────────────┘
```

### 3.2 테이블 정의 (PostgreSQL)

#### **organizations** (조직)
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_org_slug ON organizations(slug);
```

#### **users** (사용자)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

CREATE INDEX idx_user_org ON users(org_id);
CREATE INDEX idx_user_email ON users(email);
```

#### **projects** (프로젝트)
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#5B4FFF',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('planning', 'active', 'completed', 'on_hold')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_project_org ON projects(org_id);
CREATE INDEX idx_project_status ON projects(status);
CREATE INDEX idx_project_dates ON projects(start_date, end_date);
```

#### **tasks** (태스크)
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  title VARCHAR(300) NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_task_project ON tasks(project_id);
CREATE INDEX idx_task_assigned ON tasks(assigned_to);
CREATE INDEX idx_task_parent ON tasks(parent_id);
CREATE INDEX idx_task_dates ON tasks(start_date, end_date);
```

#### **task_dependencies** (태스크 의존성)
```sql
CREATE TABLE task_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  depends_on_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  dependency_type VARCHAR(20) DEFAULT 'finish_to_start' 
    CHECK (dependency_type IN ('finish_to_start', 'start_to_start', 'finish_to_finish')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(task_id, depends_on_task_id)
);

CREATE INDEX idx_dependency_task ON task_dependencies(task_id);
```

#### **comments** (댓글)
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  mentions UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comment_task ON comments(task_id);
CREATE INDEX idx_comment_user ON comments(user_id);
```

#### **activities** (활동 로그)
```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_task ON activities(task_id);
CREATE INDEX idx_activity_project ON activities(project_id);
CREATE INDEX idx_activity_created ON activities(created_at DESC);
```

### 3.3 Row Level Security (RLS) 정책

```sql
-- organizations: 자신의 조직만 접근
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own organization"
  ON organizations FOR SELECT
  USING (id IN (SELECT org_id FROM users WHERE id = auth.uid()));

-- projects: 같은 조직의 프로젝트만 접근
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view org projects"
  ON projects FOR SELECT
  USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage projects"
  ON projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND org_id = projects.org_id 
      AND role IN ('admin', 'member')
    )
  );

-- tasks: 같은 조직의 태스크만 접근
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view org tasks"
  ON tasks FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE org_id IN (SELECT org_id FROM users WHERE id = auth.uid())
    )
  );

-- comments, activities도 동일한 패턴 적용
```

---

## 4. API 설계

### 4.1 API 엔드포인트 목록

#### **Authentication**
```
POST   /api/auth/register          # 회원가입
POST   /api/auth/login             # 로그인
POST   /api/auth/logout            # 로그아웃
GET    /api/auth/me                # 현재 사용자 정보
POST   /api/auth/invite            # 멤버 초대 (Admin only)
```

#### **Projects**
```
GET    /api/projects               # 프로젝트 목록 조회
POST   /api/projects               # 프로젝트 생성
GET    /api/projects/:id           # 프로젝트 상세 조회
PUT    /api/projects/:id           # 프로젝트 수정
DELETE /api/projects/:id           # 프로젝트 삭제
GET    /api/projects/:id/gantt     # 간트차트 데이터
```

#### **Tasks**
```
GET    /api/tasks                  # 태스크 목록 조회 (프로젝트별)
POST   /api/tasks                  # 태스크 생성
GET    /api/tasks/:id              # 태스크 상세 조회
PUT    /api/tasks/:id              # 태스크 수정 (일정/진행률/상태)
DELETE /api/tasks/:id              # 태스크 삭제
POST   /api/tasks/:id/dependencies # 의존성 추가
PATCH  /api/tasks/:id/progress     # 진행률 업데이트
```

#### **Comments**
```
GET    /api/tasks/:id/comments     # 댓글 목록
POST   /api/tasks/:id/comments     # 댓글 작성
PUT    /api/comments/:id           # 댓글 수정
DELETE /api/comments/:id           # 댓글 삭제
```

#### **Dashboard**
```
GET    /api/dashboard              # 대시보드 통계
GET    /api/dashboard/activities   # 최근 활동
```

### 4.2 API 응답 포맷 (JSON)

#### 성공 응답
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "프로젝트명"
  },
  "message": "프로젝트가 생성되었습니다."
}
```

#### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "시작일은 종료일보다 앞서야 합니다.",
    "details": {
      "field": "start_date"
    }
  }
}
```

### 4.3 간트차트 데이터 구조

```typescript
// GET /api/projects/:id/gantt 응답
interface GanttData {
  tasks: GanttTask[];
  links: GanttLink[];
  metadata: {
    projectId: string;
    dateRange: {
      start: string; // ISO 8601
      end: string;
    };
    criticalPath: string[]; // task IDs
  };
}

interface GanttTask {
  id: string;
  text: string;
  start_date: string;
  duration: number; // days
  progress: number; // 0-1
  parent: string | null;
  type: 'task' | 'milestone';
  assignee: {
    id: string;
    name: string;
    avatar: string;
  };
  color: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
}

interface GanttLink {
  id: string;
  source: string; // task ID
  target: string; // task ID
  type: 'finish_to_start' | 'start_to_start' | 'finish_to_finish';
}
```

---

## 5. 실시간 동기화 (WebSocket)

### 5.1 Supabase Realtime 활용

```typescript
// 클라이언트 측 구독 예시
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 특정 프로젝트의 태스크 변경사항 구독
const channel = supabase
  .channel('project-123')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'tasks',
      filter: `project_id=eq.${projectId}`
    },
    (payload) => {
      console.log('Task changed:', payload);
      // UI 업데이트 로직
      updateGanttChart(payload.new);
    }
  )
  .subscribe();

// 누가 어떤 태스크를 편집 중인지 표시 (Presence)
channel.track({
  userId: currentUser.id,
  editingTaskId: 'task-456',
  timestamp: new Date().toISOString()
});
```

### 5.2 Optimistic UI Update 전략

```typescript
// 낙관적 업데이트 패턴
async function updateTaskProgress(taskId: string, progress: number) {
  // 1. UI 즉시 업데이트 (낙관적)
  setTasks((prev) =>
    prev.map((t) => (t.id === taskId ? { ...t, progress } : t))
  );

  try {
    // 2. 서버에 요청
    await supabase
      .from('tasks')
      .update({ progress })
      .eq('id', taskId);

    // 3. 성공 - 이미 UI 업데이트됨
  } catch (error) {
    // 4. 실패 - 롤백
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, progress: originalProgress } : t))
    );
    toast.error('업데이트 실패. 다시 시도해주세요.');
  }
}
```

---

## 6. 성능 최적화 전략

### 6.1 Frontend 최적화
```typescript
// 1. 간트차트 가상 스크롤링 (100개+ 태스크 대응)
import { FixedSizeList } from 'react-window';

// 2. 이미지 최적화 (Next.js Image)
import Image from 'next/image';
<Image src={avatar} width={32} height={32} alt="Avatar" />

// 3. 컴포넌트 Lazy Loading
const GanttChart = dynamic(() => import('@/components/GanttChart'), {
  loading: () => <Skeleton />,
  ssr: false // 간트차트는 클라이언트에서만 렌더링
});

// 4. 데이터 페치 최적화 (SWR)
import useSWR from 'swr';
const { data, error } = useSWR(`/api/projects/${id}`, fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 60000 // 1분간 중복 요청 방지
});
```

### 6.2 Backend 최적화
```sql
-- 1. 인덱스 최적화 (이미 위에서 정의됨)
-- 2. 쿼리 최적화 (N+1 문제 해결)
SELECT 
  t.*,
  u.full_name AS assignee_name,
  u.avatar_url AS assignee_avatar,
  (SELECT COUNT(*) FROM comments WHERE task_id = t.id) AS comment_count
FROM tasks t
LEFT JOIN users u ON t.assigned_to = u.id
WHERE t.project_id = $1
ORDER BY t.order_index;

-- 3. Materialized View (대시보드 통계)
CREATE MATERIALIZED VIEW dashboard_stats AS
SELECT 
  org_id,
  COUNT(DISTINCT p.id) AS total_projects,
  COUNT(DISTINCT t.id) AS total_tasks,
  AVG(t.progress) AS avg_progress
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
GROUP BY org_id;

-- 매일 새벽 3시 갱신
REFRESH MATERIALIZED VIEW dashboard_stats;
```

### 6.3 캐싱 전략
```typescript
// Redis 캐싱 (Upstash)
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_URL,
  token: process.env.UPSTASH_TOKEN
});

// 프로젝트 목록 캐싱 (5분)
export async function getProjects(orgId: string) {
  const cacheKey = `projects:${orgId}`;
  
  // 1. 캐시 확인
  const cached = await redis.get(cacheKey);
  if (cached) return cached;

  // 2. DB 조회
  const projects = await supabase
    .from('projects')
    .select('*')
    .eq('org_id', orgId);

  // 3. 캐시 저장 (5분)
  await redis.set(cacheKey, projects, { ex: 300 });

  return projects;
}
```

---

## 7. 보안 구현

### 7.1 인증 플로우
```typescript
// Supabase Auth 활용
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

// 서버 사이드에서 세션 확인
export async function getServerSideProps(context) {
  const supabase = createServerSupabaseClient(context);
  
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }

  return { props: { session } };
}
```

### 7.2 XSS 방어
```typescript
// React는 기본적으로 XSS 방어
// 사용자 입력 HTML 렌더링 시 DOMPurify 사용
import DOMPurify from 'isomorphic-dompurify';

function Comment({ content }) {
  const cleanHTML = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
}
```

### 7.3 CSRF 방어
```typescript
// Next.js는 자동으로 CSRF 토큰 처리
// API 라우트에서 확인
import { csrf } from '@/lib/csrf';

export default csrf(async function handler(req, res) {
  // CSRF 토큰 검증 완료 후 실행
});
```

---

## 8. 배포 및 CI/CD

### 8.1 환경 변수 (.env)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Upstash Redis
UPSTASH_URL=https://xxx.upstash.io
UPSTASH_TOKEN=xxx

# Resend (이메일)
RESEND_API_KEY=re_xxx

# Sentry (에러 모니터링)
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 8.2 GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 9. 테스트 전략

### 9.1 Unit Test (Vitest)
```typescript
// __tests__/utils/dateCalculator.test.ts
import { describe, it, expect } from 'vitest';
import { calculateTaskDuration } from '@/utils/dateCalculator';

describe('calculateTaskDuration', () => {
  it('should calculate working days correctly', () => {
    const start = new Date('2026-01-13');
    const end = new Date('2026-01-17');
    expect(calculateTaskDuration(start, end)).toBe(5);
  });
});
```

### 9.2 Integration Test (Playwright)
```typescript
// e2e/gantt.spec.ts
import { test, expect } from '@playwright/test';

test('should create task and update gantt chart', async ({ page }) => {
  await page.goto('/projects/123');
  
  // 태스크 추가
  await page.click('[data-testid="add-task-btn"]');
  await page.fill('[name="title"]', '새 태스크');
  await page.click('[data-testid="save-btn"]');
  
  // 간트차트에 표시 확인
  await expect(page.locator('.gantt-task:has-text("새 태스크")')).toBeVisible();
});
```

---

## 10. 모니터링 및 로깅

### 10.1 에러 추적 (Sentry)
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV
});
```

### 10.2 성능 모니터링 (Vercel Analytics)
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 11. 기술 리스크 및 대응

### 11.1 리스크 매트릭스

| 리스크 | 발생 확률 | 영향도 | 대응 방안 |
|--------|-----------|--------|-----------|
| 간트차트 라이브러리 성능 저하 | 중 | 높음 | 가상 스크롤링, 100개 제한, 페이지네이션 |
| 동시 편집 충돌 | 높음 | 중 | Operational Transform, Last-write-wins |
| Supabase 무료 티어 한계 | 중 | 중 | 사용량 모니터링, 유료 전환 계획 |
| 실시간 연결 끊김 | 중 | 중 | 자동 재연결, Offline-first 캐싱 |

### 11.2 확장성 고려사항
- **사용자 증가 시**: Supabase Pro ($25/월) 업그레이드
- **간트차트 성능**: 프로젝트당 태스크 500개 제한 권장
- **파일 업로드**: 태스크당 10MB, 프로젝트당 100MB 제한

---

## 12. 개발 가이드

### 12.1 프로젝트 구조
```
gantt-platform/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── projects/
│   │   │   └── [id]/
│   │   │       └── gantt/
│   │   └── dashboard/
│   ├── api/
│   │   ├── auth/
│   │   ├── projects/
│   │   └── tasks/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (shadcn)
│   ├── GanttChart/
│   ├── TaskList/
│   └── CommentPanel/
├── lib/
│   ├── supabase/
│   ├── utils/
│   └── validations/
├── types/
│   └── database.types.ts
├── public/
├── supabase/
│   ├── migrations/
│   └── seed.sql
└── package.json
```

### 12.2 코딩 컨벤션
```typescript
// 파일명: kebab-case
// 컴포넌트: PascalCase
// 함수/변수: camelCase
// 상수: UPPER_SNAKE_CASE

// 타입 정의 예시
interface Project {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

// API 함수 네이밍
export async function getProjects() { ... }
export async function createProject(data: ProjectInput) { ... }
```

---

## 13. 참고 자료

- **Supabase 공식 문서**: https://supabase.com/docs
- **Next.js 공식 문서**: https://nextjs.org/docs
- **Frappe Gantt**: https://frappe.io/gantt
- **shadcn/ui**: https://ui.shadcn.com
- **Monday.com API Docs** (벤치마킹): https://developer.monday.com/api-reference

---

**문서 버전**: 1.0  
**작성일**: 2026-01-13  
**업데이트 예정**: Phase 1 개발 완료 후 성능 측정 결과 반영
