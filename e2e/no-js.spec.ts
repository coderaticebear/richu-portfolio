import { test, expect } from "@playwright/test";

// The whole page must read correctly with JavaScript off (crawlers, link
// previews, locked-down browsers): no text left hidden waiting for a
// script, and real numbers instead of count-up placeholders.
test.use({ javaScriptEnabled: false });

test("every piece of text is visible without JavaScript", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(1200); // the hero's CSS entrance finishes on its own
  const hidden = await page.evaluate(() =>
    Array.from(document.querySelectorAll("main :is(h1, h2, h3, p, li, dt, dd, a)"))
      .filter((el) => !el.closest('[aria-hidden="true"]') && el.textContent?.trim())
      .filter((el) => {
        let node: Element | null = el;
        while (node && node !== document.body) {
          if (getComputedStyle(node).opacity === "0") return true;
          node = node.parentElement;
        }
        return false;
      })
      .map((el) => `${el.tagName}: ${el.textContent!.trim().slice(0, 40)}`),
  );
  expect(hidden).toEqual([]);
});

test("headline numbers are real, not zero placeholders", async ({ page }) => {
  await page.goto("/");
  const about = page.locator("#about");
  await expect(about).toContainText("1,000+");
  await expect(about).toContainText("95%+");
  await expect(about).toContainText("40%");
});
