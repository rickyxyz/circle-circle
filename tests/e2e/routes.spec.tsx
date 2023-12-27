import { test, expect } from '@playwright/test';
import { loggedInFixture as loggedInTest } from 'tests/e2e/fixtures/loggedIn';

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
