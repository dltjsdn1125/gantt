import { test, expect } from '@playwright/test';

test.describe('대시보드', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 후 대시보드 접근 (실제 인증이 필요하므로 스킵 가능)
    // await page.goto('http://localhost:3000/login');
    // await page.fill('input[type="email"]', 'test@example.com');
    // await page.fill('input[type="password"]', 'password123');
    // await page.click('button[type="submit"]');
  });

  test('대시보드 페이지 구조 확인', async ({ page }) => {
    // 인증이 필요한 경우 스킵
    test.skip(true, '인증이 필요합니다');
    
    await page.goto('http://localhost:3000/dashboard');
    
    // 사이드바 확인
    await expect(page.locator('aside')).toBeVisible();
    
    // 헤더 확인
    await expect(page.locator('header')).toBeVisible();
    
    // 통계 카드 확인
    await expect(page.locator('text=진행 중인 프로젝트')).toBeVisible();
  });
});
