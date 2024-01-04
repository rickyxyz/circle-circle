import { Page, expect } from '@playwright/test';
import { tester } from 'tests/assets/mockUsers';

export default async function testerLogin(page: Page) {
  await page.goto('/account/login');

  await page.getByLabel(/^login email$/i).fill(tester.email);
  await page.getByLabel(/^login password$/i).fill(tester.password);

  await page.getByRole('button', { name: 'login' }).click();

  await page.waitForURL('**/');
  await expect(page.getByRole('heading', { level: 3 })).toHaveText(
    tester.username
  );
}
