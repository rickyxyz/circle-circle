import { test, expect, BrowserContext, Page } from '@playwright/test';
import { tester } from 'tests/e2e/assets/mockUsers';

const testUser = {
  username: `username${Math.random()}`,
  email: `email${Math.random()}@test.com`,
  password: `password${Math.random()}`,
};

test.describe('Registration Form', () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('/');
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

  test('register form can successfully submit', async () => {
    await page.getByLabel('username').fill(testUser.username);
    await page.getByLabel(/^email$/i).fill(testUser.email);
    await page.getByLabel(/^password$/i).fill(testUser.password);
    await page.getByLabel('confirm password').fill(testUser.password);

    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      testUser.username
    );
  });

  test.afterAll(async () => {
    await context.close();
  });
});
