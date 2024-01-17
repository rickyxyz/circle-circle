import { test, expect, Page } from '@playwright/test';
import createNewUser from 'tests/e2e/fixtures/createNewUser.utils';

const newComment = {
  text: `Hello, this is a randomly generated comment number ${Math.random().toFixed(
    5
  )}`,
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

    await expect(page.getByText(/comment can't be empty/i)).toBeVisible();
  });

  test('can successfully create a new comment', async () => {
    await page.goto('/c/testCircle1/p/testPost1');

    await page.getByLabel(/^put your comment here$/i).fill(newComment.text);
    await page.getByRole('button', { name: 'post' }).click();

    await expect(page.getByText(newComment.text)).toBeVisible();
  });

  test('can successfully edit existing comment', async () => {
    await page.goto('/c/testCircle1/p/testPost1');

    await page.getByTestId('comment-action-trigger').first().click();
    await page.getByRole('menuitem', { name: 'edit' }).first().click();
    await page
      .getByLabel(/^edit this comment$/i)
      .fill(`This is a newly updated ${newComment.text}`);
    await page.getByRole('button', { name: 'save' }).first().click();

    await expect(
      page.getByText(`This is a newly updated ${newComment.text}`)
    ).toBeVisible();
  });
});
