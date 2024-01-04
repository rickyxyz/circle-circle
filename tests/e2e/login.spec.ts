import { test, expect, BrowserContext, Page } from '@playwright/test';
import { tester } from 'tests/assets/mockUsers';

test.describe('Login Form and Logout Button', () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('/account/login');
  });

  test('login form displays error on invalid input', async () => {
    await page.getByRole('button', { name: 'login' }).click();

    await expect(page.getByText('Email is required')).toBeVisible();
  });

  test('login form can show login error', async () => {
    await page.getByLabel(/^login email$/i).fill(tester.email);
    await page.getByLabel(/^login password$/i).fill('wrong password');

    await page.getByRole('button', { name: 'login' }).click();

    await expect(
      page.getByText('User not found or invalid credentials')
    ).toBeVisible();
  });

  test('login form can successfully submit', async () => {
    await page.getByLabel(/^login email$/i).fill(tester.email);
    await page.getByLabel(/^login password$/i).fill(tester.password);

    await page.getByRole('button', { name: 'login' }).click();
    await page.waitForURL('**/');

    await expect(page.getByRole('heading', { level: 3 })).toHaveText(
      tester.username
    );
  });
});
