import { test, expect, BrowserContext, Page } from '@playwright/test';
import { tester } from 'tests/assets/mockUsers';

test.describe('Registration Form', () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('/account/register');
  });

  test('register form displays error on invalid input', async () => {
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByText('Email is required')).toBeVisible();
  });

  test('register form can show registration error', async () => {
    await page.getByLabel('username').fill(tester.username);
    await page.getByLabel(/^email$/i).fill(tester.email);
    await page.getByLabel(/^password$/i).fill(tester.password);
    await page.getByLabel('confirm password').fill(tester.password);

    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByText('Email is already in use')).toBeVisible();
  });
});
