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

    await page.getByLabel('login email').fill(testUser.email);
    await page.getByLabel('login password').fill(testUser.password);
    await page.getByRole('button', { name: 'login' }).click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      testUser.username
    );
    await use(page);
  },
  username: testUser.username,
  email: testUser.email,
  password: testUser.password,
});
