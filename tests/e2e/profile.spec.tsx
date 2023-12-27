import { test, expect } from '@playwright/test';
import { loggedInFixture as loggedInTest } from 'tests/e2e/fixtures/loggedIn';

test.describe('Profile features', () => {
  loggedInTest('user can upload profile picture', async ({ page }) => {
    await page.goto('/auth');

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByLabel('upload image').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('./assets/testimage.jpg');

    await page.getByRole('button', { name: 'upload' }).click();

    await expect(page.getByAltText('profile picture')).toBeVisible();
  });

  loggedInTest('user can only upload image file', async ({ page }) => {
    await page.goto('/auth');

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByLabel('upload image').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('./assets/testtext.txt');

    await page.getByRole('button', { name: 'upload' }).click();

    await expect(page.getByAltText('profile picture')).toBeHidden();
  });
});
