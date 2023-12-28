import { test, expect } from '@playwright/test';
import { newUserFixture as loggedInTest } from 'tests/e2e/fixtures/newUser';
import { getTestAssetPath } from 'tests/e2e/assets.utils';

test.describe('Profile features', () => {
  loggedInTest('user can upload profile picture', async ({ page }) => {
    await page.goto('/profile');

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByLabel('upload image').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(getTestAssetPath('testimage.jpg'));

    await page.getByRole('button', { name: 'upload' }).click();
    console.log(process.cwd());

    await expect(page.getByAltText('profile picture')).toBeVisible();
  });

  loggedInTest('user can only upload image file', async ({ page }) => {
    await page.goto('/profile');

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByLabel('upload image').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(getTestAssetPath('testtext.txt'));

    await page.getByRole('button', { name: 'upload' }).click();

    await expect(page.getByAltText('profile picture')).toBeHidden();
  });

  loggedInTest('user can update username', async ({ page }) => {
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
});
