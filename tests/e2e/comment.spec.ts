import { test, expect, Page } from '@playwright/test';
import createNewUser from 'tests/e2e/fixtures/createNewUser.utils';
import testerLogin from 'tests/e2e/fixtures/testerLogin.utils';

const newComment = {
  text: `Hello, this is a randomly generated comment number ${Math.random().toFixed(
    5
  )}`,
};

test.describe('As Unauthed user', () => {
  test('post comment button should be hidden', async ({ page }) => {
    await page.goto('/circle/testCircle1/post/testPost1');

    await expect(page.getByText('testPost1')).toBeVisible();
    await expect(page.getByText('post a comment')).toBeHidden();
  });
});

test.describe('As Non-member', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();

    page = await context.newPage();
    await createNewUser(page);
  });

  test('post comment button should be visible', async () => {
    await page.goto('/circle/testCircle1/post/testPost1');

    await expect(page.getByText('testPost1')).toBeVisible();
    await expect(page.getByText('post a comment')).toBeVisible();
  });

  test('comment form can show input error', async () => {
    await page.goto('/circle/testCircle1/post/testPost1');

    await page.getByRole('button', { name: 'post' }).click();

    await expect(page.getByText(/comment can't be empty/i)).toBeVisible();
  });

  test('Create post form can successfully submit', async () => {
    await page.goto('/circle/testCircle1/post/testPost1');

    await page.getByLabel(/^post a comment$/i).fill(newComment.text);
    await page.getByRole('button', { name: 'post' }).click();

    await expect(page.getByText(newComment.text)).toBeVisible();
  });
});

test.describe('As Member', () => {
  test.beforeEach(async ({ page }) => {
    await testerLogin(page);
  });

  test('post comment button should be visible', async ({ page }) => {
    await page.goto('/circle/testCircle1/post/testPost1');

    await expect(page.getByText('testPost1')).toBeVisible();
    await expect(page.getByText('post a comment')).toBeVisible();
  });
});
