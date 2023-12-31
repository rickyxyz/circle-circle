import { test, expect, BrowserContext, Page } from '@playwright/test';
import { tester } from 'tests/e2e/assets/mockUsers';

test.describe('Auth provider', () => {
  let page: Page;
  let context: BrowserContext;
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    await page.goto('/');
    await page.getByLabel(/^login email$/i).fill(tester.email);
    await page.getByLabel(/^login password$/i).fill(tester.password);
    await page.getByRole('button', { name: 'login' }).click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      tester.username
    );
  });

  test('auth state persists between pages', async () => {
    const otherPage = await context.newPage();

    await page.goto('/');
    await otherPage.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      tester.username
    );
    await expect(otherPage.getByRole('heading', { level: 1 })).toHaveText(
      tester.username
    );
  });
});
