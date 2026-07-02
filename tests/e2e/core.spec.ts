import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("starring:current-profile", "anthony");
    sessionStorage.setItem("starring:profile-chosen", "1");
  });
});

test("opens a card as a URL-backed modal and closes it", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /Redbeard.*open details/i }).first().click();

  await expect(page.getByRole("dialog", { name: "Redbeard" })).toBeVisible();
  await expect(page).toHaveURL(/\/title\/redbeard$/);

  await page.keyboard.press("Escape");

  await expect(page.getByRole("dialog", { name: "Redbeard" })).toBeHidden();
  await expect(page).toHaveURL("/");
});

test("search filters the catalog", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Search" }).first().click();
  await page.getByLabel("Search titles").fill("redbeard");

  await expect(page.getByText(/result.*redbeard/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Redbeard.*open details/i })).toBeVisible();
});

test("watchlist persists a title in the current profile", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /Redbeard.*open details/i }).first().click();
  const dialog = page.getByRole("dialog", { name: "Redbeard" });
  await dialog.getByRole("button", { name: "Add to Watchlist" }).click();
  await dialog.getByRole("button", { name: "Close", exact: true }).click();

  await expect(page.getByRole("heading", { name: "Watchlist" })).toBeVisible();
  await expect(page.locator("#my-list").getByRole("button", { name: /Redbeard.*open details/i })).toBeVisible();
});

test("mobile bottom navigation is available on phone viewports", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only navigation check");

  await page.goto("/");

  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
  await page.getByRole("button", { name: "Search" }).last().click();
  await expect(page.getByLabel("Search titles")).toBeVisible();
});
