import { Page } from '@playwright/test';
import { tester } from 'tests/assets/mockUsers';

export default async function testerLogin(page: Page) {
  await page.goto('/account/login');

  await page.getByLabel(/^email$/i).fill(tester.email);
  await page.getByLabel(/^password$/i).fill(tester.password);

  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await page.waitForURL('**/');
}
