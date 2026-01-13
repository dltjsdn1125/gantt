# 배포 가이드

## Vercel 배포

### 1. Vercel 계정 준비

1. [Vercel](https://vercel.com)에 로그인 (GitHub 계정으로 로그인 권장)
2. 대시보드로 이동

### 2. 새 프로젝트 생성

1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. GitHub 리포지토리 목록에서 `dltjsdn1125/gantt` 선택
3. **"Import"** 클릭

### 3. 프로젝트 설정

**Framework Preset**: Next.js (자동 감지됨)

**Root Directory**: `./` (기본값)

**Build Command**: `npm run build` (기본값)

**Output Directory**: `.next` (기본값)

**Install Command**: `npm install` (기본값)

### 4. 환경변수 설정

**Environment Variables** 섹션에서 다음 변수들을 추가하세요:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

**중요**: 
- Supabase 프로젝트가 없다면 먼저 [Supabase](https://supabase.com)에서 프로젝트를 생성하세요
- [Supabase 대시보드](https://supabase.com/dashboard/project/_/settings/api)에서 URL과 키를 가져오세요
- `NEXT_PUBLIC_APP_URL`은 배포 후 Vercel이 제공하는 URL로 업데이트하세요

### 5. 배포 실행

1. **"Deploy"** 버튼 클릭
2. 배포가 완료될 때까지 대기 (약 2-3분)
3. 배포 완료 후 제공되는 URL로 접속하여 확인

### 6. 배포 후 확인 사항

- [ ] 랜딩 페이지가 정상적으로 로드되는지
- [ ] 회원가입/로그인이 작동하는지
- [ ] 대시보드가 정상적으로 표시되는지
- [ ] 프로젝트 생성이 가능한지
- [ ] 간트차트가 렌더링되는지

## 자동 배포 설정

### GitHub Actions를 통한 자동 배포

`.github/workflows/deploy.yml` 파일이 포함되어 있어 main 브랜치에 푸시 시 자동으로 배포할 수 있습니다.

**필요한 GitHub Secrets 설정:**

1. GitHub 리포지토리 → **Settings** → **Secrets and variables** → **Actions**
2. 다음 Secrets 추가:

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Vercel 토큰 및 ID 가져오기:**

1. Vercel 대시보드 → **Settings** → **Tokens**
2. 새 토큰 생성
3. 프로젝트 설정에서 **General** → **Project ID** 확인
4. 조직 설정에서 **General** → **Organization ID** 확인

## 도메인 연결 (선택사항)

1. Vercel 프로젝트 → **Settings** → **Domains**
2. 원하는 도메인 추가
3. DNS 설정 안내에 따라 도메인 설정

## 문제 해결

### 빌드 실패

- 환경변수가 제대로 설정되었는지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인
- Vercel 빌드 로그 확인

### 런타임 오류

- 브라우저 콘솔에서 에러 확인
- Vercel 함수 로그 확인
- Supabase 연결 상태 확인

## 참고 링크

- [Vercel 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Supabase 문서](https://supabase.com/docs)
