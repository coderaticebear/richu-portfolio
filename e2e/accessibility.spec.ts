import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import type { Result } from "axe-core";

// Decorative text is allowed to be low-contrast: the footer's closing
// wordmark and the canvas effects' stage labels are aria-hidden="true"
// backdrops, not content anyone is meant to read — WCAG 1.4.3 explicitly
// exempts pure decoration from its contrast requirement. Raising the
// wordmark to 3:1 would turn a quiet sign-off into a second headline.
// Matching on aria-hidden="true" itself (not a class name or selector,
// which would silently stop matching the moment a class changes) is the
// actual semantic signal that something was deliberately marked
// decorative — every *other* color-contrast node still fails the test.
const ACCEPTED_RULE_IDS = new Set(["color-contrast"]);

function isAcceptedViolation(violation: Result) {
  if (!ACCEPTED_RULE_IDS.has(violation.id)) return false;
  return violation.nodes.every((n) => n.html.includes('aria-hidden="true"'));
}

// axe reads colors as they are at scan time, so let the hero's CSS
// entrance (a fade from transparent) finish first.
async function settle(page: Page) {
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every((a) => !(a instanceof CSSAnimation && a.animationName === "hero-in") || a.playState === "finished"),
  );
}

test.describe("Automated accessibility scan (axe-core, WCAG 2.1 A/AA)", () => {
  for (const theme of ["dark", "light"] as const) {
    test(`no unexpected violations in ${theme} mode`, async ({ page }) => {
      await page.goto("/");
      await settle(page);
      if (theme === "light") {
        await page.getByRole("button", { name: /switch to light mode/i }).click();
        await page.waitForTimeout(200);
      }
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const unexpected = results.violations.filter((v) => !isAcceptedViolation(v));
      if (unexpected.length > 0) {
        console.log(JSON.stringify(unexpected, null, 2));
      }
      expect(unexpected).toEqual([]);
    });
  }

  test("no critical or serious violations at all, including the accepted one", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const critical = results.violations.filter((v) => v.impact === "critical");
    expect(critical).toEqual([]);
  });
});
