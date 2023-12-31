import { test, expect, Page } from '@playwright/test';
import createNewUser from 'tests/e2e/fixtures/createNewUser.utils';
import testerLogin from 'tests/e2e/fixtures/testerLogin.utils';

const newPost = {
  title: `Post${Math.random().toFixed(5)}`,
  text: 'Hello, this is a randomly generated post by Playwright',
};

test.describe('As Unauthed user', () => {
  test('Create post form is not visible to unauthed user', async ({ page }) => {
    await page.goto('/circle/testCircle1');

    await expect(page.getByText('Circle Description')).toBeVisible();
    await expect(page.getByText('create a new post')).toBeHidden();
  });
});

test.describe('As Non-member', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();

    page = await context.newPage();
    await createNewUser(page);
  });

  test('Create post form is not visible to non circle member', async () => {
    await page.goto('/circle/testCircle1');

    await expect(page.getByText('Circle Description')).toBeVisible();
    await expect(page.getByText('create a new post')).toBeHidden();
  });

  test('Post edit button is not visible to other user', async () => {
    await page.goto('/circle/testCircle1/post/testPost1');

    await expect.soft(page.getByText('testPost1')).toBeVisible();
    await expect(page.getByText('edit post')).toBeHidden();
  });
});

test.describe('As Member', () => {
  test.beforeEach(async ({ page }) => {
    await testerLogin(page);
  });

  test('Create post form is visible to the circle member', async ({ page }) => {
    await page.goto('/circle/testCircle1');

    await expect(page.getByText('Circle Description')).toBeVisible();
    await expect(page.getByText('create a new post')).toBeVisible();
  });

  test('Create post form can show input error', async ({ page }) => {
    await page.goto('/circle/testCircle1');

    await page.getByRole('button', { name: 'post' }).click();

    await expect(page.getByText(/title is required/i)).toBeVisible();
  });

  test('Create post form can successfully submit', async ({ page }) => {
    await page.goto('/circle/testCircle1');

    await page.getByLabel(/^post title$/i).fill(newPost.title);
    await page.getByLabel(/^post description$/i).fill(newPost.text);
    await page.getByRole('button', { name: 'post' }).click();

    await expect(page.getByText(newPost.title)).toBeVisible();
  });

  test('Post edit button is visible to its author', async ({ page }) => {
    await page.goto('/circle/testCircle1/post/testPost1');

    await expect(page.getByText('testPost1')).toBeVisible();
    await expect(page.getByText('edit post')).toBeVisible();
  });

  test('Existing post form can be edited', async ({ page }) => {
    await page.goto('/circle/testCircle1/post/testPost1');
    const newPostDescription = `This is a new post description number ${Math.random().toFixed(
      5
    )}`;

    await page.getByRole('button', { name: 'edit post' }).click();

    await page.getByLabel(/^edit post description$/i).fill(newPostDescription);
    await page.getByRole('button', { name: 'update post' }).click();

    await expect(page.getByRole('heading', { level: 3 })).toHaveText(
      newPostDescription
    );
  });
});
