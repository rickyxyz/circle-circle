import { Circle } from '@/types/db';
import { test, expect, BrowserContext, Page } from '@playwright/test';
import testerLogin from 'tests/e2e/fixtures/testerLogin.utils';

const newCircle: Circle = {
  name: `randomCircle_${Math.random().toFixed(5)}`,
  description: `this is randomCircle_${Math.random().toFixed(5)} description`,
};

test.describe('circle create form', () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await testerLogin(page);
  });

  test('circle creation form can show error', async () => {
    await page.goto('/circle');
    await page.getByRole('button', { name: 'create' }).click();

    await expect(page.getByText('Name is required')).toBeVisible();
  });

  test('circle creation form can show network error', async () => {
    await page.goto('/circle');

    await page.getByLabel('circle name').click();
    await page.getByLabel('circle name').fill('testCircle1');
    await page.getByLabel('circle description').click();
    await page.getByLabel('circle description').fill('description');
    await page.getByRole('button', { name: 'create' }).click();

    await expect(page.getByText('already exists')).toBeVisible();
  });

  test('circle can be created', async () => {
    await page.goto('/circle');
    await page.getByLabel('circle name').click();
    await page.getByLabel('circle name').fill(newCircle.name);
    await page.getByLabel('circle description').click();
    await page.getByLabel('circle description').fill(newCircle.description);
    await page.getByRole('button', { name: 'create' }).click();

    await expect(page.getByText(newCircle.name)).toBeVisible();
  });

  test('circle edit can be edited', async () => {
    await page.goto('/circle/testCircle1');
    await page.getByLabel('Circle Description').click();
    await page
      .getByLabel('Circle Description')
      .fill('this is a newly edited description');
    await page.getByRole('button', { name: 'Update' }).click();

    await expect(
      page.getByText('this is a newly edited description')
    ).toBeVisible();
  });
});
