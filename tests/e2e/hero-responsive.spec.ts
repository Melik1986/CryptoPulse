import { test, expect } from '@playwright/test';

test.describe('Hero Section Responsiveness', () => {
  test('should render correctly on Desktop (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // Check for Canvas existence
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Check for Logo visibility (using alt text as selector)
    const logoIcon = page.getByAltText('CoinPulse Icon');
    await expect(logoIcon).toBeVisible();

    const logoText = page.getByAltText('CoinPulse Text');
    await expect(logoText).toBeVisible();
  });

  test('should render correctly on Mobile (iPhone 13 - 390x844)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Check for Canvas existence
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Check for Logo visibility
    const logoIcon = page.getByAltText('CoinPulse Icon');
    await expect(logoIcon).toBeVisible();

    // Verify no horizontal overflow
    // Evaluate if body scrollWidth equals viewport width
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test('should render correctly on Tablet (iPad - 768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    const logoIcon = page.getByAltText('CoinPulse Icon');
    await expect(logoIcon).toBeVisible();

    // Check that layout is stable (visual check implies we just ensure elements are there)
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
  });
});
