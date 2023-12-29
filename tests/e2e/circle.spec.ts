import { test, expect } from '@playwright/test';
import { loggedInFixture as loggedInTest } from 'tests/e2e/fixtures/loggedIn';

test.describe('circle create form', () => {
  test('circle page is accessible', async ({ page }) => {
    await page.goto('/circle');

    await expect(page.getByRole('heading', { level: 2 })).toHaveText(
      'circle page',
      { ignoreCase: true }
    );
  });

  loggedInTest('circle creation form can show error', async ({ page }) => {
    await page.goto('/circle');
    await page.getByRole('button', { name: 'create' }).click();

    await expect(page.getByText('Name is required')).toBeVisible();
  });

  loggedInTest(
    'circle creation form can show network error',
    async ({ page }) => {
      // TODO: seed the database with circle
      await page.goto('/circle');

      await page.getByLabel('circle name').click();
      await page.getByLabel('circle name').fill('circle');
      await page.getByLabel('circle description').click();
      await page.getByLabel('circle description').fill('description');
      await page.getByRole('button', { name: 'create' }).click();

      await expect(page.getByText('already exists')).toBeVisible();
    }
  );

  loggedInTest('circle can be created', async ({ page }) => {
    const testCircle = {
      name: `round bois ${Math.random().toFixed(10)}`,
      description: `we are the round bois`,
    };

    await page.goto('/circle');
    await page.getByLabel('circle name').click();
    await page.getByLabel('circle name').fill(testCircle.name);
    await page.getByLabel('circle description').click();
    await page.getByLabel('circle description').fill(testCircle.description);
    await page.getByRole('button', { name: 'create' }).click();

    await expect(page.getByText(testCircle.name)).toBeVisible();
  });
});
