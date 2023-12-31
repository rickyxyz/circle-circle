import { test, expect, BrowserContext, Page } from '@playwright/test';
import { alice, tester } from 'tests/e2e/assets/mockUsers';
import testerLogin from 'tests/e2e/fixtures/testerLogin.utils';

test.describe('protectedRoute', () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await testerLogin(page);
  });

  test('protected route can be accessed by authenticated user', async () => {
    await page.goto('/auth');

    await expect(page.getByRole('heading', { level: 2 })).toHaveText(
      'authorized'
    );
  });

  test('protected route cannot be accessed by unauthenticated user', async ({
    page,
  }) => {
    await page.goto('/auth');

    await expect(page.getByRole('heading', { level: 2 })).toHaveText('404');
  });
});

test.describe('profile routing', () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await testerLogin(page);
  });

  test('unauthed user go to /profile will redirect to 404', async ({
    page,
  }) => {
    await page.goto('/profile');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Oops!');
    await expect(page.getByRole('heading', { level: 2 })).toHaveText('404');
  });

  test("unauthed user go to /profile/a will go to a's profile", async ({
    page,
  }) => {
    await page.goto(`/profile/${alice.uid}`);

    await expect(page.getByRole('heading', { level: 2 })).toHaveText(
      `this is ${alice.username} profile page`
    );
  });

  test('auth user go to /profile will redirect to own profile', async () => {
    await page.goto('/profile');

    await expect(page.getByRole('heading', { level: 2 })).toHaveText(
      `this is ${tester.username} profile page`
    );
  });

  test("auth user go to /profile/a will go to a's profile", async () => {
    await page.goto(`/profile/${alice.uid}`);

    await expect(page.getByRole('heading', { level: 2 })).toHaveText(
      `this is ${alice.username} profile page`
    );
  });

  test('going to non-existent profile will throw 404', async ({ page }) => {
    await page.goto('/profile/non-existent-uid');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Oops!');
    await expect(page.getByRole('heading', { level: 2 })).toHaveText('404');
  });
});
