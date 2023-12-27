import { Page, test as base, expect } from '@playwright/test';

const testUser = {
  username: `username${Math.random()}`,
  email: `email${Math.random()}@test.com`,
  password: `password${Math.random()}`,
};

export interface LoggedInFixture {
  page: Page;
  username: string;
  email: string;
  password: string;
}

export const loggedInFixture = base.extend<LoggedInFixture>({
  page: async ({ page }, use) => {
    await page.goto('/');

    await page.getByLabel('register username').fill(testUser.username);
    await page.getByLabel('register email').fill(testUser.email);
    await page.getByLabel('register password').fill(testUser.password);
    await page.getByRole('button', { name: 'register' }).click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      testUser.username
    );
    await use(page);
  },
  username: testUser.username,
  email: testUser.email,
  password: testUser.password,
});
