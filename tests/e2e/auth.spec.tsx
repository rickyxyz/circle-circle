import { test, expect, BrowserContext, Page } from '@playwright/test';
import { loggedInFixture as loggedInTest } from 'tests/e2e/fixtures/loggedIn';

// need to test sequentially, register -> logout -> login -> ...other
// cause the loggedIn fixture does not keep the same user credential between test
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

  test('register button works', async () => {
    await page.getByLabel('register username').fill(testUser.username);
    await page.getByLabel('register email').fill(testUser.email);
    await page.getByLabel('register password').fill(testUser.password);
    await page.getByRole('button', { name: 'register' }).click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      testUser.username
    );
  });

  loggedInTest('logout button works', async () => {
    const logoutButton = page.getByRole('button', { name: 'logout' });

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

  loggedInTest('auth state persists between pages', async () => {
    const otherPage = await context.newPage();

    await page.goto('/');
    await otherPage.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      testUser.username
    );
    await expect(otherPage.getByRole('heading', { level: 1 })).toHaveText(
      testUser.username
    );
  });
});
