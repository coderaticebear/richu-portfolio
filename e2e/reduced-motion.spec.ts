import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test.describe("prefers-reduced-motion: reduce", () => {
  test("hero content is fully visible immediately, no entrance stagger", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(150);
    const stuck = await page.evaluate(() => {
      const found: string[] = [];
      document.querySelectorAll("h1 span").forEach((span) => {
        const t = getComputedStyle(span).transform;
        if (t && t !== "none" && !t.startsWith("matrix(1, 0, 0, 1, 0, 0)")) {
          found.push(t);
        }
      });
      return found;
    });
    expect(stuck).toEqual([]);
    await expect(page.getByRole("link", { name: "View Projects" })).toBeVisible();
  });

  test("every section heading resolves instantly on scroll, nothing stuck mid-animation", async ({
    page,
  }) => {
    await page.goto("/");
    let last = -1;
    for (let i = 0; i < 40; i++) {
      await page.mouse.wheel(0, 350);
      await page.waitForTimeout(50);
      const y = await page.evaluate(() => window.scrollY);
      if (y === last) break;
      last = y;
    }
    await page.waitForTimeout(300);

    const stuck = await page.evaluate(() => {
      const found: string[] = [];
      document.querySelectorAll("h1, h2, h3").forEach((heading) => {
        heading.querySelectorAll("span").forEach((span) => {
          const t = getComputedStyle(span).transform;
          if (t && t !== "none" && !t.startsWith("matrix(1, 0, 0, 1, 0, 0)")) {
            found.push(`${heading.tagName}:"${heading.textContent?.slice(0, 20)}" -> ${t}`);
          }
        });
      });
      return found;
    });
    expect(stuck).toEqual([]);
  });

  test("Experience cards render without the scroll-linked scale/opacity transform applied", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator("#experience").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const style = await page
      .locator("#experience ol > li")
      .first()
      .locator(":scope > div")
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(style).toBe("1");
  });

  test("credentials progress bars still land on the right value instantly", async ({ page }) => {
    await page.goto("/");
    await page.locator("#credentials").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const transforms = await page
      .locator('[role="progressbar"] > div')
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).transform));
    expect(transforms.length).toBeGreaterThan(0);
    for (const t of transforms) {
      expect(t).not.toBe("none");
      expect(t).not.toContain("matrix(0, 0"); // never stuck at scaleX(0)
    }
  });
});
