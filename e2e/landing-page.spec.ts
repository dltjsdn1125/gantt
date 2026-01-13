import { test, expect } from '@playwright/test';

test.describe('랜딩 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('페이지가 정상적으로 로드되어야 함', async ({ page }) => {
    await expect(page).toHaveTitle(/간트차트/);
  });

  test('네비게이션 링크가 작동해야 함', async ({ page }) => {
    // 로고 클릭
    await page.click('text=GanttAI');
    await expect(page).toHaveURL('http://localhost:3000/');

    // 로그인 버튼 클릭
    await page.click('text=로그인');
    await expect(page).toHaveURL('http://localhost:3000/login');

    await page.goBack();

    // 회원가입 버튼 클릭
    await page.click('text=무료로 시작하기');
    await expect(page).toHaveURL('http://localhost:3000/register');
  });

  test('히어로 섹션 버튼이 작동해야 함', async ({ page }) => {
    // AI 에이전트 만들기 버튼
    await page.click('text=AI 에이전트 만들기');
    await expect(page).toHaveURL('http://localhost:3000/register');

    await page.goBack();

    // 라이브 데모 보기 버튼
    await page.click('text=라이브 데모 보기');
    await expect(page).toHaveURL('http://localhost:3000/login');
  });

  test('CTA 섹션 버튼이 작동해야 함', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // 무료로 시작하기 버튼
    await page.click('text=무료로 시작하기');
    await expect(page).toHaveURL('http://localhost:3000/register');
  });

  test('간트차트 프리뷰가 표시되어야 함', async ({ page }) => {
    const ganttPreview = page.locator('text=신제품 출시 2024');
    await expect(ganttPreview).toBeVisible();
  });
});
