import { test, expect } from '@playwright/test';

test.describe('Hero Scene Performance', () => {
  test('should load laser and maintain high FPS', async ({ page }) => {
    // 1. Measure Load Time
    const startTime = Date.now();
    await page.goto('/');

    // The loader should be visible initially (or appear very quickly)
    // We wait for it to be attached to DOM first
    const loader = page.locator('.loader-content');
    // It might not be visible if everything loads instantly (unlikely), but let's assume it appears.
    // If it's already hidden, this might fail if we enforce visibility.
    // Instead, we wait for it to be hidden.
    await expect(loader).toBeHidden({ timeout: 60000 });

    const loadTime = Date.now() - startTime;
    console.log(`[Performance] Total Load Time (until loader hidden): ${loadTime}ms`);

    // 2. Check for 3D Canvas presence
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // 3. Measure FPS
    // We allow the scene to stabilize for a second
    await page.waitForTimeout(2000);

    const fps = await page.evaluate(async () => {
      return new Promise<number>((resolve) => {
        let frameCount = 0;
        const start = performance.now();

        const loop = () => {
          frameCount++;
          const now = performance.now();
          if (now - start >= 1000) {
            resolve(frameCount);
          } else {
            requestAnimationFrame(loop);
          }
        };
        requestAnimationFrame(loop);
      });
    });

    console.log(`[Performance] FPS: ${fps}`);

    // Check if we are in a software rendering environment
    const renderer = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
      return debugInfo ? gl?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';
    });
    console.log(`[Performance] Renderer: ${renderer}`);

    // If software renderer, expectation should be lower, but we warn.
    if (renderer.includes('SwiftShader') || renderer.includes('llvmpipe')) {
      console.warn('Warning: Running on Software Renderer. FPS will be low.');
      expect(fps).toBeGreaterThan(0); // Just check it runs
    } else {
      expect(fps).toBeGreaterThan(30); // Baseline expectation for GPU
    }
  });
});
