import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

// Counts requestAnimationFrame callbacks so a test can prove nothing is looping.
const countFrames = () => {
  const w = window as unknown as { __frames: number };
  w.__frames = 0;
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => {
    w.__frames++;
    return raf(cb);
  };
};

test.describe("prefers-reduced-motion: reduce", () => {
  test("hero content is fully visible immediately, no entrance animation", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(150);
    const styles = await page.evaluate(() =>
      Array.from(document.querySelectorAll("#top .hero-in")).map((el) => {
        const s = getComputedStyle(el);
        return { opacity: s.opacity, animation: s.animationName };
      }),
    );
    expect(styles.length).toBeGreaterThan(0);
    for (const s of styles) {
      expect(s.opacity).toBe("1");
      expect(s.animation).toBe("none");
    }
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

  test("canvas effects start paused and nothing animates on its own", async ({ page }) => {
    await page.addInitScript(countFrames);
    await page.goto("/");
    const hero = page.locator("#top");
    await expect(hero.getByRole("button", { name: /play background animation/i })).toBeVisible();

    for (const id of ["process", "skills", "experience"]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${id}`).getByRole("button", { name: /^play /i }).first()).toBeVisible();
    }

    // Settle, then measure an idle second: a paused page schedules (almost) no frames.
    await page.waitForTimeout(500);
    await page.evaluate(() => ((window as unknown as { __frames: number }).__frames = 0));
    await page.waitForTimeout(1000);
    const frames = await page.evaluate(() => (window as unknown as { __frames: number }).__frames);
    expect(frames).toBeLessThan(10);
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
