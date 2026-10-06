import { test, expect, type Page } from "@playwright/test";

const SECTIONS = ["about", "experience", "projects", "build", "process", "skills", "credentials", "contact"];

async function sectionOffsets(page: Page) {
  return page.evaluate((ids) => {
    const out: Record<string, number> = {};
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) out[id] = Math.round(el.getBoundingClientRect().top + window.scrollY);
    }
    return out;
  }, SECTIONS);
}

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

  test("no nav item claims to be current while on the hero", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);
    await expect(page.locator('header [aria-current="location"]')).toHaveCount(0);
  });

  test("share card metadata is present", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Richu Thankachan/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
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

test.describe("Links that land", () => {
  // Regression: a post-hydration layout change once pushed everything
  // below Experience down by 1,164px, so /#projects opened on the wrong
  // section. A deep link must land where it points, after the page settles.
  for (const id of ["process", "projects", "credentials", "contact"]) {
    test(`/#${id} opens on its section`, async ({ page }) => {
      await page.goto(`/#${id}`);
      await page.waitForTimeout(1500);
      const top = await page.evaluate((sectionId) => document.getElementById(sectionId)!.getBoundingClientRect().top, id);
      expect(Math.abs(top)).toBeLessThan(150);
    });
  }

  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    test(`section positions are identical with and without JavaScript (${viewport.width}px)`, async ({ browser }) => {
      const noJs = await browser.newContext({ javaScriptEnabled: false, viewport });
      const staticPage = await noJs.newPage();
      await staticPage.goto("/");
      await staticPage.waitForTimeout(500);
      const before = await sectionOffsets(staticPage);
      await noJs.close();

      const withJs = await browser.newContext({ viewport });
      const livePage = await withJs.newPage();
      await livePage.goto("/");
      await livePage.waitForTimeout(2000);
      const after = await sectionOffsets(livePage);
      await withJs.close();

      for (const id of SECTIONS) {
        expect(Math.abs(after[id] - before[id]), `#${id} moved after hydration`).toBeLessThanOrEqual(2);
      }
    });
  }

  test("copy-link button copies a link to its section", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    await page.locator("#about").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Copy link to About" }).click();
    await expect(page.locator("#about").getByRole("status")).toHaveText("Link copied");
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toMatch(/\/#about$/);
  });
});
