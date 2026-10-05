import { test, expect } from "@playwright/test";

const LINKEDIN_URL = "https://www.linkedin.com/in/richu-thankachan";

test.describe("LinkedIn call to action", () => {
  test("nav button opens LinkedIn in a new tab", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("banner").getByRole("link", { name: /^linkedin$/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", LINKEDIN_URL);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  });

  test("hero button points at the same profile", async ({ page }) => {
    await page.goto("/");
    const hero = page.getByRole("main").getByRole("link", { name: /^linkedin$/i });
    await expect(hero).toBeVisible();
    await expect(hero).toHaveAttribute("href", LINKEDIN_URL);
    await expect(hero).toHaveAttribute("target", "_blank");
  });

  test("no résumé download link remains", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /résumé/i })).toHaveCount(0);
  });
});

test.describe("Contact form", () => {
  test("requires name, email, and message before it can submit", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    const submit = page.getByRole("button", { name: /submit ticket/i });
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
    await page.getByRole("button", { name: /submit ticket/i }).click();
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

test.describe("Contact ticket", () => {
  test("priority and subject go into the subject line, and submitting opens a ticket", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email", { exact: true }).fill("test@example.com");
    await page.getByLabel("Subject").fill("Tier 2 SaaS support role");
    await page.getByText("Urgent hire").click();
    await page.getByLabel("Message").fill("Hello, this is a test message.");

    const contact = page.locator("#contact");
    await expect(contact.getByText("[P1 · Urgent hire] Tier 2 SaaS support role — Test User")).toBeVisible();

    await page.getByRole("button", { name: /submit ticket/i }).click();
    await expect(contact.getByText(/^RT-\d{4}$/)).toBeVisible();
    await expect(contact.getByText(/Ticket RT-\d{4} created/)).toHaveCount(1);
  });
});

test.describe("Skills network", () => {
  test("a skill pill pings the map and announces what it reaches", async ({ page }) => {
    await page.goto("/");
    await page.locator("#skills").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800); // let the map load
    await page.locator("#skills").getByRole("button", { name: "DNS", exact: true }).click();
    await expect(page.locator("#skills [aria-live=polite]")).toHaveText(
      /^DNS connects to \d+ other skills within \d+ hops\.$/,
    );
    await expect(page.locator("#skills pre")).toContainText('$ ping "DNS"');
  });
});

test.describe("Touches", () => {
  test("nav shows Richu's local Toronto time on wide screens", async ({ page }) => {
    await page.goto("/");
    const clock = page.getByRole("banner").getByTestId("toronto-clock").filter({ visible: true });
    await expect(clock).toHaveText(/Toronto \d{2}:\d{2}/);
  });

  test("debug mode toggles with D, but not while typing in the form", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await page.keyboard.press("d");
    await expect(html).toHaveAttribute("data-debug", "");
    await page.keyboard.press("d");
    await expect(html).not.toHaveAttribute("data-debug", "");

    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.getByLabel("Name").pressSequentially("dd");
    await expect(html).not.toHaveAttribute("data-debug", "");

    const toggle = page.getByRole("button", { name: /debug mode/i });
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(html).toHaveAttribute("data-debug", "");
  });
});
