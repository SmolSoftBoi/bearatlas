import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    // Start at home page
    await page.goto('http://localhost:3000');
    
    // Check home page content
    await expect(page.getByRole('heading', { name: 'Discover Bear Events Worldwide' })).toBeVisible();
    
    // Navigate to list page
    await page.getByRole('link', { name: 'List' }).click();
    await expect(page).toHaveURL(/.*\/list/);
    await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible();
    
    // Navigate to map page
    await page.getByRole('link', { name: 'Map' }).click();
    await expect(page).toHaveURL(/.*\/map/);
    await expect(page.getByRole('heading', { name: 'Map View' })).toBeVisible();
    
    // Navigate to calendar page
    await page.getByRole('link', { name: 'Calendar' }).click();
    await expect(page).toHaveURL(/.*\/calendar/);
    await expect(page.getByRole('heading', { name: 'Calendar' })).toBeVisible();
    
    // Navigate to wizard page
    await page.getByRole('link', { name: 'Trip Wizard' }).click();
    await expect(page).toHaveURL(/.*\/wizard/);
    await expect(page.getByRole('heading', { name: 'Trip Wizard' })).toBeVisible();
  });
  
  test('should search from home page', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Fill search form
    await page.getByPlaceholder('Search events, cities, or countries...').fill('Manchester');
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Should navigate to list page with search query
    await expect(page).toHaveURL(/.*\/list.*q=Manchester/);
  });
});