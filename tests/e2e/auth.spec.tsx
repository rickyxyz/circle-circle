import { test, expect, Page } from '@playwright/test';

test.describe('Auth provider', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto('/');
  });

  test('register button works', async () => {
    const registerButton = page.getByRole('button', { name: 'register' });

    await registerButton.click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'username'
    );
  });

  test('logout button works', async () => {
    const logoutButton = page.getByRole('button', { name: 'logout' });

    await logoutButton.click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('NULL');
  });

  test('login button works', async () => {
    const loginButton = page.getByRole('button', { name: 'login' });

    await loginButton.click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'username'
    );
  });
});
