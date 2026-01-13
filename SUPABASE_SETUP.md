# Supabase 데이터베이스 연결 정보

## 프로젝트 정보

- **프로젝트 ID**: `gwntknjohqljnwxyajcr`
- **프로젝트 URL**: `https://gwntknjohqljnwxyajcr.supabase.co`
- **리전**: `ap-northeast-2` (서울)

## API 키

### Publishable Key (권장)
```
sb_publishable_2OhgSxXZlnyjqozvikSyUw_JgI872IZ
```

### Legacy Anon Key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3bnRrbmpvaHFsam53eHlhamNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTIyNDMsImV4cCI6MjA4MjA2ODI0M30.DLopxpl1Vx3H_PSmDDwBW_NcT3goD2Ob95TnxEnWGls
```

## 환경변수 설정

`.env.local` 파일에 다음 내용을 추가하세요:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://gwntknjohqljnwxyajcr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_2OhgSxXZlnyjqozvikSyUw_JgI872IZ
# 또는 Legacy Key 사용 시:
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3bnRrbmpvaHFsam53eHlhamNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTIyNDMsImV4cCI6MjA4MjA2ODI0M30.DLopxpl1Vx3H_PSmDDwBW_NcT3goD2Ob95TnxEnWGls

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**중요**: Service Role Key는 Supabase 대시보드에서 직접 가져와야 합니다.
- [Supabase 대시보드](https://supabase.com/dashboard/project/gwntknjohqljnwxyajcr/settings/api) → API Settings → `service_role` key

## 생성된 테이블

간트차트 플랫폼을 위한 다음 테이블들이 생성되었습니다:

- `gantt_organizations` - 조직 정보
- `gantt_users` - 사용자 정보
- `gantt_projects` - 프로젝트
- `gantt_tasks` - 태스크
- `gantt_task_dependencies` - 태스크 의존성
- `gantt_comments` - 댓글
- `gantt_activities` - 활동 로그

## 코드 업데이트 필요

현재 코드는 `organizations`, `users`, `projects`, `tasks` 등의 테이블 이름을 사용하고 있지만, 실제 데이터베이스에는 `gantt_` 접두사가 붙은 테이블이 생성되었습니다.

다음 파일들을 업데이트해야 합니다:
- `app/api/projects/route.ts`
- `app/api/tasks/route.ts`
- `app/(dashboard)/**/*.tsx`
- `components/gantt/**/*.tsx`
- 기타 Supabase 쿼리를 사용하는 모든 파일

또는 데이터베이스 마이그레이션을 다시 실행하여 `gantt_` 접두사 없이 테이블을 생성할 수도 있습니다 (기존 테이블과 충돌 가능).

## 다음 단계

1. `.env.local` 파일에 환경변수 추가
2. 코드에서 테이블 이름을 `gantt_` 접두사가 붙은 이름으로 업데이트
3. 개발 서버 재시작
4. 테스트
