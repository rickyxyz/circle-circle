import { test, expect, BrowserContext, Page } from '@playwright/test';
import { alice, tester } from 'tests/assets/mockUsers';
import testerLogin from 'tests/e2e/fixtures/testerLogin.utils';

test.describe('unauthed user routes', () => {
  test('/ can render successfully', async ({ page }) => {
    await page.goto('/');

    expect(page).toBeDefined();
  });

  test('/account/settings will throw 404', async ({ page }) => {
    await page.goto('/account/settings');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Oops!');
    await expect(page.getByRole('heading', { level: 2 })).toHaveText('404');
  });

  test('/account/register will show the login page', async ({ page }) => {
    await page.goto(`/account/register`);

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      /sign up/i
    );
  });

  test('/account/login will show the login page', async ({ page }) => {
    await page.goto(`/account/login`);

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/login/i);
  });

  test('/c will show browse circle page', async ({ page }) => {
    await page.goto('/c');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      /browse circles/i
    );
  });

  test("/c/testCircle1 will show testCircle1's page", async ({ page }) => {
    await page.goto('/c/testCircle1');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      /testCircle1/gi
    );
  });

  test('/c/non-existent-circle will throw 404', async ({ page }) => {
    await page.goto('/c/non-existent-circle');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Oops!');
    await expect(page.getByRole('heading', { level: 2 })).toHaveText('404');
  });

  test("/c/testCircle1/p/testPost1 will show testPost1's page", async ({
    page,
  }) => {
    await page.goto('/c/testCircle1/p/testPost1');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      /testpost1/i
    );
  });

  test('/c/testCircle1/p/non-existent-post will throw 404', async ({
    page,
  }) => {
    await page.goto('/c/testCircle1/p/non-existent-post');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Oops!');
    await expect(page.getByRole('heading', { level: 2 })).toHaveText('404');
  });

  test('/c/non-existent-circle/p/non-existent-post will throw 404', async ({
    page,
  }) => {
    await page.goto('/c/non-existent-circle/p/non-existent-post');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Oops!');
    await expect(page.getByRole('heading', { level: 2 })).toHaveText('404');
  });

  test('/u will throw 404', async ({ page }) => {
    await page.goto('/u');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Oops!');
    await expect(page.getByRole('heading', { level: 2 })).toHaveText('404');
  });

  test("/u/a will show a's profile page", async ({ page }) => {
    await page.goto(`/u/${alice.uid}`);

    await expect(page.getByRole('heading', { level: 2 })).toHaveText(
      `this is ${alice.username} profile page`
    );
  });
});

test.describe('authed user routes', () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await testerLogin(page);
  });

  test('/u will redirect to own profile', async () => {
    await page.goto('/u');

    await expect(page.getByRole('heading', { level: 2 })).toHaveText(
      `this is ${tester.username} profile page`
    );
  });

  test("/u/a will show a's profile", async () => {
    await page.goto(`/u/${alice.uid}`);

    await expect(page.getByRole('heading', { level: 2 })).toHaveText(
      `this is ${alice.username} profile page`
    );
  });

  test('/profile/non-existent-uid will throw 404', async ({ page }) => {
    await page.goto('/profile/non-existent-uid');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Oops!');
    await expect(page.getByRole('heading', { level: 2 })).toHaveText('404');
  });

  test('/account/login will redirect to homepage', async () => {
    await page.goto(`/account/login`);

    await page.waitForURL('**/');
    await expect(page.getByRole('heading', { level: 3 })).toHaveText(
      tester.username
    );
  });

  test('/account/register will redirect to homepage', async () => {
    await page.goto(`/account/register`);

    await page.waitForURL('**/');
    await expect(page.getByRole('heading', { level: 3 })).toHaveText(
      tester.username
    );
  });

  test('/account/settings will show settings page', async () => {
    await page.goto('/account/settings');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      /settings/i
    );
  });
});
