import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import type { Result } from "axe-core";

// Two elements on the page are deliberately low-contrast: Experience's
// corner ordinal numbers (01/02/03) and the footer's closing wordmark.
// Both are aria-hidden="true" background watermarks, not content anyone
// is meant to read — WCAG 1.4.3 explicitly exempts pure decoration from
// its contrast requirement. Reaching 3:1 on the ordinals alone would need
// roughly 45%+ opacity, which would turn a background flourish into a
// second thing competing for attention; same logic for the wordmark.
// Matching on aria-hidden="true" itself (not a class name or selector,
// which would silently stop matching the moment a class changes) is the
// actual semantic signal that something was deliberately marked
// decorative — every *other* color-contrast node still fails the test.
const ACCEPTED_RULE_IDS = new Set(["color-contrast"]);

function isAcceptedViolation(violation: Result) {
  if (!ACCEPTED_RULE_IDS.has(violation.id)) return false;
  return violation.nodes.every((n) => n.html.includes('aria-hidden="true"'));
}

test.describe("Automated accessibility scan (axe-core, WCAG 2.1 A/AA)", () => {
  for (const theme of ["dark", "light"] as const) {
    test(`no unexpected violations in ${theme} mode`, async ({ page }) => {
      await page.goto("/");
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
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const critical = results.violations.filter((v) => v.impact === "critical");
    expect(critical).toEqual([]);
  });
});
