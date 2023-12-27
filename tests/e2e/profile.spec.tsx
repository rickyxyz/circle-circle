import { test, expect, Page, BrowserContext } from '@playwright/test';

// run test sequentially, cause test depends on previous test
test.describe.configure({ mode: 'serial' });

const testUser = {
  username: `username${Math.random()}`,
  email: `email${Math.random()}@test.com`,
  password: `password${Math.random()}`,
};

test.describe('Profile features', () => {
  let page: Page;
  let context: BrowserContext;
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('/');
    await page.getByLabel('register username').fill(testUser.username);
    await page.getByLabel('register email').fill(testUser.email);
    await page.getByLabel('register password').fill(testUser.password);
    await page.getByRole('button', { name: 'register' }).click();
  });

  test('user can upload profile picture', async () => {
    await page.goto('/auth');

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByLabel('upload image').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('./assets/testimage.jpg');

    await page.getByRole('button', { name: 'upload' }).click();

    await expect(page.getByAltText('profile picture')).toBeVisible();
  });

  test('user can only upload image file', async () => {
    await page.reload();
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByLabel('upload image').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('./assets/testtext.txt');

    await page.getByRole('button', { name: 'upload' }).click();

    await expect(page.getByAltText('profile picture')).toBeHidden();
  });
});
