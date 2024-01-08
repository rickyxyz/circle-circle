import { Circle } from '@/types/db';
import { test, expect, BrowserContext, Page } from '@playwright/test';
import testerLogin from 'tests/e2e/fixtures/testerLogin.utils';

const newCircle: Circle = {
  name: `randomCircle_${Math.random().toFixed(3)}`,
  description: `this is randomCircle_${Math.random().toFixed(3)} description`,
  topic: 'entertainment',
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
    await page.getByRole('button', { name: 'create a circle' }).first().click();
    await page
      .getByTestId('modal')
      .getByRole('button', { name: 'Create' })
      .click();
    await expect(page.getByText('Name is required')).toBeVisible();
  });

  test('circle creation form can show network error', async () => {
    await page.getByRole('button', { name: 'create a circle' }).first().click();
    const modal = page.getByTestId('modal');

    await modal.getByLabel('circle name').click();
    await modal.getByLabel('circle name').fill('testCircle1');
    await modal
      .getByLabel(/^topic$/i)
      .first()
      .click();
    await modal.getByText(/^sports$/i).click();
    await modal.getByLabel('circle description').click();
    await modal.getByLabel('circle description').fill('description');
    await modal.getByRole('button', { name: 'create' }).click();

    await expect(page.getByText('already exists')).toBeVisible();
  });

  test('circle can be created', async () => {
    await page.getByRole('button', { name: 'create a circle' }).first().click();
    const modal = page.getByTestId('modal');

    await modal.getByLabel('circle name').click();
    await modal.getByLabel('circle name').fill(newCircle.name);
    await modal
      .getByLabel(/^topic$/i)
      .first()
      .click();
    await modal.getByText(/^sports$/i).click();
    await modal.getByLabel('circle description').click();
    await modal.getByLabel('circle description').fill(newCircle.description);
    await modal.getByRole('button', { name: 'create' }).click();

    await page.waitForURL(`**/c/${newCircle.name}`);

    await expect(page).toHaveURL(`c/${newCircle.name}`);
  });

  // eslint-disable-next-line playwright/no-skipped-test
  test.skip('circle edit can be edited', async () => {
    await page.goto('/c/testCircle1');
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
