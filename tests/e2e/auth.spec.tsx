import { test, expect, Page } from '@playwright/test';

// run test sequentially, cause test depends on previous test
test.describe.configure({ mode: 'serial' });

const testUser = {
  username: `username${Math.random()}`,
  email: `email${Math.random()}@test.com`,
  password: `password${Math.random()}`,
};

test.describe('Auth provider', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto('/');
  });

  test('register button works', async () => {
    await page.getByLabel('register username').fill(testUser.username);
    await page.getByLabel('register email').fill(testUser.email);
    await page.getByLabel('register password').fill(testUser.password);
    await page.getByRole('button', { name: 'register' }).click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      testUser.username
    );
  });

  test('logout button works', async () => {
    const logoutButton = page.getByRole('button', { name: 'logout' });

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      testUser.username
    );
    await logoutButton.click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('NULL');
  });

  test('login button works', async () => {
    await page.getByLabel('login email').fill(testUser.email);
    await page.getByLabel('login password').fill(testUser.password);
    await page.getByRole('button', { name: 'login' }).click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      testUser.username
    );
  });
});
