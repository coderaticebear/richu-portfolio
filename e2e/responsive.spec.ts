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

    test("Experience cards never overflow their scroll wrapper", async ({ page }) => {
      // Regression check for the overlap bug: a card's rendered height
      // must never exceed the wrapper it sticks within, since sticky
      // positioning doesn't clip a card to its container.
      await page.goto("/");
      await page.locator("#experience").scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      const results = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll("#experience ol > li"));
        return items.map((li) => {
          const card = li.querySelector(":scope > div") as HTMLElement;
          return {
            wrapperHeight: li.getBoundingClientRect().height,
            cardHeight: card.getBoundingClientRect().height,
          };
        });
      });
      expect(results.length).toBe(3);
      for (const r of results) {
        expect(r.wrapperHeight).toBeGreaterThanOrEqual(r.cardHeight);
      }
    });
  });
}
