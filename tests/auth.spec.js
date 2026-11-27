import { test, expect } from '@playwright/test';

// AUTH_UI001 - Verify login page display
test('AUTH_UI001 - Verify login page display', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();

  await expect(
    page.getByRole('button', { name: /sign in/i })
  ).toBeVisible();
});

// AUTH_UI002 - Verify registration page display
test('AUTH_UI002 - Verify registration page display', async ({ page }) => {
  await page.goto('/register');

  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();

  await expect(
    page.getByRole('button', { name: /create account/i })
  ).toBeVisible();
});


// AUTH_FN003 - Verify invalid login
test('AUTH_FN003 - Verify invalid login', async ({ page }) => {
  await page.goto('/login');

  await page.locator('input[type="email"]').fill('wrong@example.com');

  await page.locator('input[name="password"]').fill('WrongPassword123');

  await page.getByRole('button', { name: /sign in/i }).click();

  // Verify that an error message is displayed
  await expect(
    page.locator('.auth-error')
  ).toBeVisible();
});

// AUTH_FN004 - Verify valid login
test('AUTH_FN004 - Verify valid login', async ({ page }) => {
  await page.goto('/login');

  await page.locator('input[type="email"]').fill('hirunijayalath74@gmail.com');

  await page.locator('input[name="password"]').fill('Hn2026hn!@#$');

  await page.getByRole('button', { name: /sign in/i }).click();

  // Customer should be redirected to the home page
  await page.waitForURL(url => url.pathname === '/', {
    timeout: 10000,
  });

  await expect(page).toHaveURL(/\/$/);
});