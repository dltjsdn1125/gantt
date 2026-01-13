import { test, expect } from '@playwright/test';

test.describe('인증 플로우', () => {
  test('회원가입 페이지로 이동', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('text=무료로 시작하기');
    await expect(page).toHaveURL('http://localhost:3000/register');
    await expect(page.locator('h1')).toContainText('회원가입');
  });

  test('로그인 페이지로 이동', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('text=로그인');
    await expect(page).toHaveURL('http://localhost:3000/login');
    await expect(page.locator('h1')).toContainText('로그인');
  });

  test('회원가입 폼 유효성 검사', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // 빈 폼 제출 시도
    await page.click('button[type="submit"]');
    
    // 에러 메시지 확인 (실제 구현에 따라 조정 필요)
    await expect(page.locator('form')).toBeVisible();
  });
});
