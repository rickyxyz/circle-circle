import { test, expect, BrowserContext, Page } from '@playwright/test';
import { getTestAssetPath } from 'tests/e2e/assets.utils';
import createNewUser from 'tests/e2e/fixtures/createNewUser.utils';

test.describe('Profile features', () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await createNewUser(page);
  });

  test('user can upload profile picture', async () => {
    await page.goto('/profile');

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByLabel('upload image').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(getTestAssetPath('testimage.jpg'));
    await page.getByRole('button', { name: 'upload' }).click();

    await expect(page.getByAltText('profile picture')).toBeVisible();
  });

  test('user can only upload image file', async () => {
    await page.goto('/profile');

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByLabel('upload image').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(getTestAssetPath('testtext.txt'));
    await page.getByRole('button', { name: 'upload' }).click();

    await expect(page.getByAltText('profile picture')).toBeHidden();
  });

  test('user can update username', async () => {
    await page.goto('/profile');

    await page.getByLabel('update username').fill('new username');
    await page.getByRole('button', { name: 'update' }).click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'new username'
    );

    // make sure username update persists
    await page.goto('/profile');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'new username'
    );
  });

  test.afterAll(async () => {
    await context.close();
  });
});
