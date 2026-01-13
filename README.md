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
- **상태관리**: Zustand
- **폼 처리**: React Hook Form + Zod

## 로컬 개발

1. 의존성 설치
```bash
npm install
```

2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Supabase Configuration
# Get these values from: https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Service Role Key (for admin operations - keep this secret!)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**중요**: Supabase 프로젝트를 생성한 후, [Supabase 대시보드](https://supabase.com/dashboard/project/_/settings/api)에서 URL과 키를 가져와서 `.env.local` 파일에 입력하세요.

3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 http://localhost:3000 열기

## 프로젝트 구조

```
gantt-platform/
├── app/                  # Next.js App Router
├── components/           # 재사용 컴포넌트
├── lib/                  # 유틸리티 함수
├── types/                # TypeScript 타입
└── supabase/             # 데이터베이스 마이그레이션
```

## 배포

### Vercel 배포

1. [Vercel](https://vercel.com)에 로그인
2. 새 프로젝트 생성
3. GitHub 리포지토리 연결
4. 환경변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL`
5. 배포 완료!

### GitHub Actions를 통한 자동 배포

`.github/workflows/deploy.yml` 파일이 포함되어 있어 main 브랜치에 푸시 시 자동으로 Vercel에 배포됩니다.

필요한 GitHub Secrets:
- `VERCEL_TOKEN`: Vercel API 토큰
- `VERCEL_ORG_ID`: Vercel 조직 ID
- `VERCEL_PROJECT_ID`: Vercel 프로젝트 ID
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anon Key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Service Role Key

## 라이선스

MIT
