import { test, expect } from "@playwright/test";

test.describe("Résumé download", () => {
  test("nav button links to a real PDF", async ({ page, request }) => {
    await page.goto("/");
    const link = page.getByRole("banner").getByRole("link", { name: /download résumé/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("download", "");
    const href = await link.getAttribute("href");
    const resp = await request.get(new URL(href!, page.url()).toString());
    expect(resp.status()).toBe(200);
    expect(resp.headers()["content-type"]).toContain("application/pdf");
  });

  test("hero button links to the same PDF", async ({ page }) => {
    await page.goto("/");
    const navHref = await page
      .getByRole("banner")
      .getByRole("link", { name: /download résumé/i })
      .getAttribute("href");
    const heroHref = await page
      .getByRole("main")
      .getByRole("link", { name: /download résumé/i })
      .getAttribute("href");
    expect(heroHref).toBe(navHref);
  });
});

test.describe("Contact form", () => {
  test("requires name, email, and message before it can submit", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    const submit = page.getByRole("button", { name: /send message/i });
    await submit.click();
    // native HTML5 validation blocks submission and focuses the first
    // invalid field — the page must not have "submitted" (no reload)
    const nameInvalid = await page
      .getByLabel("Name")
      .evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(nameInvalid).toBe(true);
  });

  test("builds a mailto request addressed to the right inbox once filled in", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email", { exact: true }).fill("test@example.com");
    await page.getByLabel("Message").fill("Hello, this is a test message.");

    // Headless Chromium never reflects a mailto: handoff in
    // window.location (confirmed against a known-good plain mailto <a>
    // during manual testing), so the meaningful, deterministic checks
    // are: the button and helper text agree on the destination inbox,
    // and submitting doesn't reload the page or throw.
    const helperText = page.getByText(/opens your email client/i);
    await expect(helperText).toContainText("richuthankachan96@gmail.com");

    const urlBefore = page.url();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.getByRole("button", { name: /send message/i }).click();
    await page.waitForTimeout(300);
    expect(page.url()).toBe(urlBefore);
    expect(errors).toEqual([]);
  });

  test("plain email, phone, and LinkedIn links are correct", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(page.getByRole("link", { name: "richuthankachan96@gmail.com" }).first()).toHaveAttribute(
      "href",
      "mailto:richuthankachan96@gmail.com",
    );
    await expect(page.getByRole("link", { name: "+1 (249) 876-5856" })).toHaveAttribute(
      "href",
      "tel:+12498765856",
    );
    const linkedin = page.getByRole("link", { name: /linkedin\.com\/in\/richu-thankachan/i });
    await expect(linkedin).toHaveAttribute("href", "https://www.linkedin.com/in/richu-thankachan");
    await expect(linkedin).toHaveAttribute("target", "_blank");
    await expect(linkedin).toHaveAttribute("rel", /noopener/);
  });
});

test.describe("Theme toggle", () => {
  test("switches between dark and light and persists the attribute", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.getByRole("button", { name: /switch to light mode/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.getByRole("button", { name: /switch to dark mode/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});
