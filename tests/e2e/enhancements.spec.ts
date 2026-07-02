import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("starring:current-profile", "anthony");
    sessionStorage.setItem("starring:profile-chosen", "1");
  });
});

test("mobile cards stay clean: no always-on overlay, quick-add toggles watchlist", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only layout check");

  await page.goto("/");
  const firstCard = page.locator('#trending [role="button"]').first();
  await firstCard.scrollIntoViewIfNeeded();

  // The hover overlay (title + meta text) must not render on phones — it used
  // to print on top of the poster's own title text.
  await expect(firstCard.locator('div[class*="group-hover:opacity-100"]')).toBeHidden();

  // The compact quick-add button replaces it.
  await firstCard.getByRole("button", { name: /Add .+ to Watchlist/ }).click();
  await expect(page.getByText("Added to Watchlist")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Watchlist" })).toBeVisible();
});

test("desktop keeps the hover overlay and hides the mobile quick-add", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Desktop-only layout check");

  await page.goto("/");
  const firstCard = page.locator('#trending [role="button"]').first();
  await firstCard.scrollIntoViewIfNeeded();

  await expect(firstCard.locator('div[class*="group-hover:opacity-100"]')).toBeVisible();
  await expect(firstCard.getByRole("button", { name: /Add .+ to Watchlist/ })).toBeHidden();
});

test("bottom-nav List explains an empty watchlist instead of doing nothing", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only navigation check");

  await page.goto("/");
  await page.getByRole("navigation", { name: "Mobile" }).getByRole("button", { name: "List" }).click();
  await expect(page.getByText(/Watchlist is empty/)).toBeVisible();
});

test("serves robots.txt and a sitemap with title pages", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain("sitemap.xml");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain("/title/");
});
