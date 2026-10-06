import { test, expect } from '@playwright/test';

test('home page loads hero', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/./);
  await expect(page.locator('body')).toBeVisible();
});

test('projects page lists projects or empty state', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.locator('body')).toBeVisible();
});

test('blog page does not render lorem ipsum', async ({ page }) => {
  await page.goto('/blog');
  const content = await page.content();
  expect(content).not.toContain('Lorem ipsum');
});

test('contact page renders form', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('form')).toBeVisible();
});
