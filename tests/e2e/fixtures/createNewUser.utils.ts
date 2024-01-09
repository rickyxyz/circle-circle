import { Page, expect } from '@playwright/test';

export default async function createNewUser(page: Page) {
  await page.goto('/account/register');

  const newUser = {
    username: `username${Math.random()}`,
    email: `email${Math.random()}@test.com`,
    password: `password${Math.random()}`,
  };

  await page.getByLabel('username').fill(newUser.username);
  await page.getByLabel(/^email$/i).fill(newUser.email);
  await page.getByLabel(/^password$/i).fill(newUser.password);
  await page.getByLabel('confirm password').fill(newUser.password);

  await page.getByRole('button', { name: 'register' }).click();

  await page.waitForURL('**/');
  await expect(page.getByRole('heading', { level: 3 })).toHaveText(
    newUser.username
  );
}
