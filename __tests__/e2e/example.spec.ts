import { test, expect } from '@playwright/test';

/**
 * Example E2E test
 * Tests the home page loads correctly
 */
test('home page loads and displays content', async ({ page }) => {
  await page.goto('/');

  // Verify page title
  await expect(page).toHaveTitle(/HabitFlow/);

  // Verify main heading is visible
  const heading = page.getByRole('heading', { name: 'HabitFlow' });
  await expect(heading).toBeVisible();

  // Verify Phase 1 completion message
  await expect(page.getByText(/Phase 1/)).toBeVisible();
});
