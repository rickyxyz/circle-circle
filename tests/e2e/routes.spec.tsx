import { test, expect } from '@playwright/test';
import { loggedInFixture as loggedInTest } from 'tests/e2e/fixtures/loggedIn';
import { alice } from 'tests/e2e/assets/mockUsers';

test.describe('protectedRoute', () => {
  loggedInTest(
    'protected route can be accessed by authenticated user',
    async ({ page }) => {
      await page.goto('/auth');

      await expect(page.getByRole('heading', { level: 2 })).toHaveText(
        'authorized'
      );
    }
  );

  test('protected route cannot be accessed by unauthenticated user', async ({
    page,
  }) => {
    await page.goto('/auth');

    await expect(page.getByRole('heading', { level: 2 })).toHaveText(
      'unauthorized'
    );
  });
});

test.describe('profile routing', () => {
  test('unauthed user go to /profile will redirect to 404', async ({
    page,
  }) => {
    await page.goto('/profile');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Oops!');
  });

  test("unauthed user go to /profile/a will go to a's profile", async ({
    page,
  }) => {
    await page.goto(`/profile/${alice.uid}`);

    await expect(page.getByRole('heading', { level: 2 })).toHaveText(
      `this is ${alice.username} profile page`
    );
  });

  loggedInTest(
    'auth user go to /profile will redirect to own profile',
    async ({ page, username }) => {
      await page.goto('/profile');

      await expect(page.getByRole('heading', { level: 2 })).toHaveText(
        `this is ${username} profile page`
      );
    }
  );

  loggedInTest(
    "auth user go to /profile/a will go to a's profile",
    async ({ page }) => {
      await page.goto(`/profile/${alice.uid}`);

      await expect(page.getByRole('heading', { level: 2 })).toHaveText(
        `this is ${alice.username} profile page`
      );
    }
  );
});
