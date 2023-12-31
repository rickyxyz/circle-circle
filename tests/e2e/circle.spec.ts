import { Circle } from '@/types/db';
import { test, expect } from '@playwright/test';
import { loggedInFixture as loggedInTest } from 'tests/e2e/fixtures/loggedIn';

const newCircle: Circle = {
  name: `randomCircle_${Math.random().toFixed(5)}`,
  description: `this is randomCircle_${Math.random().toFixed(5)} description`,
};

test.describe('circle create form', () => {
  loggedInTest('circle creation form can show error', async ({ page }) => {
    await page.goto('/circle');
    await page.getByRole('button', { name: 'create' }).click();

    await expect(page.getByText('Name is required')).toBeVisible();
  });

  loggedInTest(
    'circle creation form can show network error',
    async ({ page }) => {
      await page.goto('/circle');

      await page.getByLabel('circle name').click();
      await page.getByLabel('circle name').fill('testCircle1');
      await page.getByLabel('circle description').click();
      await page.getByLabel('circle description').fill('description');
      await page.getByRole('button', { name: 'create' }).click();

      await expect(page.getByText('already exists')).toBeVisible();
    }
  );

  loggedInTest('circle can be created', async ({ page }) => {
    await page.goto('/circle');
    await page.getByLabel('circle name').click();
    await page.getByLabel('circle name').fill(newCircle.name);
    await page.getByLabel('circle description').click();
    await page.getByLabel('circle description').fill(newCircle.description);
    await page.getByRole('button', { name: 'create' }).click();

    await expect(page.getByText(newCircle.name)).toBeVisible();
  });
});

loggedInTest('circle edit can be edited', async ({ page }) => {
  await page.goto('/circle/testCircle1');
  await page.getByLabel('Circle Description').click();
  await page
    .getByLabel('Circle Description')
    .fill('this is a newly edited description');
  await page.getByRole('button', { name: 'Edit' }).click();

  await page.goto('/circle');

  await expect(
    page.getByText('this is a newly edited description')
  ).toBeVisible();
});
