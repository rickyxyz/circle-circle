import { Page, test as base, expect } from '@playwright/test';
import { tester } from 'tests/e2e/assets/mockUsers';

export interface LoggedInFixture {
  testerPage: Page;
  username: string;
  email: string;
  password: string;
}

export const loggedInFixture = base.extend<LoggedInFixture>({
  page: async ({ page }, use) => {
    await page.goto('/');

    await page.getByLabel(/^login email$/i).fill(tester.email);
    await page.getByLabel(/^login password$/i).fill(tester.password);

    await page.getByRole('button', { name: 'login' }).click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      tester.username
    );
    await use(page);
  },
  username: tester.username,
  email: tester.email,
  password: tester.password,
});
