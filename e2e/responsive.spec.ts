import { test, expect, type Page } from "@playwright/test";

const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 834, height: 1194 },
  desktop: { width: 1440, height: 900 },
  "large-desktop": { width: 1920, height: 1080 },
} as const;

async function scrollThroughWholePage(page: Page) {
  let last = -1;
  for (let i = 0; i < 60; i++) {
    await page.mouse.wheel(0, 350);
    await page.waitForTimeout(60);
    const y = await page.evaluate(() => window.scrollY);
    if (y === last) break;
    last = y;
  }
  await page.waitForTimeout(500);
}

for (const [name, viewport] of Object.entries(VIEWPORTS)) {
  test.describe(`Layout at ${name} (${viewport.width}x${viewport.height})`, () => {
    test.use({ viewport });

    test("no horizontal overflow anywhere on the page", async ({ page }) => {
      await page.goto("/");
      await scrollThroughWholePage(page);
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
    });

    test("nav collapses to a hamburger below the desktop breakpoint", async ({ page }) => {
      await page.goto("/");
      const isCompact = viewport.width < 1024;
      const hamburger = page.getByRole("button", { name: /open menu/i });
      const desktopLinks = page.locator('header nav[aria-label="Section"]');
      if (isCompact) {
        await expect(hamburger).toBeVisible();
      } else {
        await expect(hamburger).toBeHidden();
        await expect(desktopLinks.first()).toBeVisible();
      }
    });

    test("the Experience globe never covers the role cards", async ({ page }) => {
      await page.goto("/");
      await page.locator("#experience").scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      const overlap = await page.evaluate(() => {
        const globe = document.querySelector("#experience canvas")!.parentElement!.getBoundingClientRect();
        const list = document.querySelector("#experience ol")!.getBoundingClientRect();
        const w = Math.min(globe.right, list.right) - Math.max(globe.left, list.left);
        const h = Math.min(globe.bottom, list.bottom) - Math.max(globe.top, list.top);
        return w > 0 && h > 0 ? w * h : 0;
      });
      expect(overlap).toBe(0);
    });
  });
}
