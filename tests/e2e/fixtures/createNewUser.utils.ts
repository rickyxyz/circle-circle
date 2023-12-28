import { Page, expect } from '@playwright/test';

async function createNewUser(page: Page) {
  await page.goto('/');

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

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    newUser.username
  );
}

export default createNewUser;
