import { test, expect } from "@playwright/test";

// Reduced motion for every visual-baseline shot: content lands in its
// final state immediately, so the screenshot is deterministic instead of
// racing whatever frame of a scroll-reveal or stagger happened to be
// mid-flight.
test.use({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });

const SECTIONS = [
  "top",
  "about",
  "skills",
  "experience",
  "projects",
  "credentials",
  "contact",
] as const;

test.describe("Visual regression baselines", () => {
  test("hero", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(200);
    await expect(page).toHaveScreenshot("hero.png", { fullPage: false });
  });

  for (const id of SECTIONS.filter((s) => s !== "top")) {
    test(`section: ${id}`, async ({ page }) => {
      await page.goto("/");
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await expect(page.locator(`#${id}`)).toHaveScreenshot(`section-${id}.png`);
    });
  }

  test("full page", async ({ page }) => {
    await page.goto("/");
    let last = -1;
    for (let i = 0; i < 60; i++) {
      await page.mouse.wheel(0, 350);
      await page.waitForTimeout(50);
      const y = await page.evaluate(() => window.scrollY);
      if (y === last) break;
      last = y;
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot("full-page.png", { fullPage: true });
  });
});
