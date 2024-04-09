import { test, expect, Page } from '@playwright/test';
import createNewUser from 'tests/e2e/fixtures/createNewUser.utils';

const randomNumber = Math.random().toFixed(5);
const newComment = {
  text: `Hello, this is a randomly generated comment number ${randomNumber}`,
};

test.describe('Comment', () => {
  let page: Page;
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();

    page = await context.newPage();
    await createNewUser(page);
  });

  test('comment form can show input error', async () => {
    await page.goto('/c/testCircle1/p/testPost1');

    await page.getByRole('button', { name: 'post' }).click();

    await expect(page.getByText(/comment cannot be empty/i)).toBeVisible();
  });

  test('can successfully create a new comment', async () => {
    await page.goto('/c/testCircle1/p/testPost1');

    await page.locator('#post-comment div').nth(2).fill(newComment.text);
    await page.getByRole('button', { name: 'post' }).click();

    await expect(page.getByText(newComment.text)).toBeVisible();
  });
});
