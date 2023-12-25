import { test, expect, Page, BrowserContext } from '@playwright/test';

// run test sequentially, cause test depends on previous test
test.describe.configure({ mode: 'serial' });

const testUser = {
  username: `username${Math.random()}`,
  email: `email${Math.random()}@test.com`,
  password: `password${Math.random()}`,
};

test.describe('Auth provider', () => {
  let page: Page;
  let context: BrowserContext;
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('/');
  });

  test('protected route cannot be accessed by unauthenticated user', async () => {
    const newPage = await context.newPage();
    await newPage.goto('/auth');

    await expect(newPage.getByRole('heading', { level: 2 })).toHaveText(
      'unauthorized'
    );
  });

  test('register button works', async () => {
    await page.goto('/');

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

  test('auth state persists between pages', async () => {
    const newPage = await context.newPage();
    await newPage.goto('/');

    await expect(newPage.getByRole('heading', { level: 1 })).toHaveText(
      testUser.username
    );
  });

  test('protected route can be accessed by authenticated user', async () => {
    const newPage = await context.newPage();
    await newPage.goto('/auth');

    await expect(newPage.getByRole('heading', { level: 2 })).toHaveText(
      'authorized'
    );
  });
});