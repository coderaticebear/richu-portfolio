import { test, expect } from "@playwright/test";

const SECTIONS = ["about", "skills", "experience", "projects", "credentials", "contact"];

test.describe("Page load", () => {
  test("loads with the right title and landmarks", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Richu Thankachan/);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    // exactly one h1 on the page
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("Richu Thankachan");
  });
});

test.describe("Nav anchor links", () => {
  for (const id of SECTIONS) {
    test(`"${id}" link scrolls to #${id}`, async ({ page }) => {
      await page.goto("/");
      const nav = page.locator('header nav[aria-label="Section"]:visible');
      await nav.getByRole("link", { name: new RegExp(`^${id}$`, "i") }).click();
      await page.waitForTimeout(700); // Lenis eases the scroll in
      const top = await page.evaluate((sectionId) => {
        const el = document.getElementById(sectionId);
        return el ? el.getBoundingClientRect().top : null;
      }, id);
      expect(top).not.toBeNull();
      // the fixed nav is ~64-80px tall; "at the top" means within a
      // generous tolerance of that, not pixel-perfect
      expect(Math.abs(top as number)).toBeLessThan(150);
    });
  }

  test("logo link returns to the top", async ({ page }) => {
    await page.goto("/");
    await page.mouse.wheel(0, 4000);
    await page.waitForTimeout(500);
    await page.getByRole("banner").getByRole("link", { name: "Richu Thankachan" }).click();
    await page.waitForTimeout(700);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });
});
