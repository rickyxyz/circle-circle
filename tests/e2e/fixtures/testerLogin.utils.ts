import { Page, expect } from '@playwright/test';
import { tester } from 'tests/e2e/assets/mockUsers';

export default async function testerLogin(page: Page) {
  await page.goto('/');

  await page.getByLabel(/^login email$/i).fill(tester.email);
  await page.getByLabel(/^login password$/i).fill(tester.password);

  await page.getByRole('button', { name: 'login' }).click();

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    tester.username
  );
}
