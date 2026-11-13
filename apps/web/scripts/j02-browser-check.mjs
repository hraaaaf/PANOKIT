import assert from "node:assert/strict";

// Isolated GitHub runner test dependency: installed only for screenshot QA.
// No permanent Playwright dependency is added to the product.
const { chromium } = await import("file:///tmp/panokit-playwright/node_modules/playwright/index.mjs");

const browser = await chromium.launch({ headless: true });
try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await desktop.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  assert.equal(await desktop.locator(".category-card").count(), 6, "Six category cards required");

  await desktop.locator(".card-artwork.has-photo").first().waitFor({ timeout: 8000 });
  const imageCSS = await desktop.locator(".card-artwork.has-photo").first().evaluate(
    element => getComputedStyle(element).backgroundImage,
  );
  assert.match(imageCSS, /panokit-cards\.webp/, "Real mockup artwork must be displayed");

  const firstCard = desktop.locator(".category-card").first();
  const firstButton = firstCard.locator(".category-title-row");
  assert.equal(await firstButton.getAttribute("aria-expanded"), "false", "Subcategories closed initially");

  await firstCard.hover();
  assert.equal(await firstButton.getAttribute("aria-expanded"), "true", "Desktop hover reveals choices");
  assert.equal(await firstCard.locator(".family-option").count(), 2, "Two enseigne choices expected");

  await desktop.mouse.move(4, 4);
  assert.equal(await firstButton.getAttribute("aria-expanded"), "false", "Moving off card closes options");

  await firstButton.focus();
  await firstButton.press("Enter");
  assert.equal(await firstButton.getAttribute("aria-expanded"), "true", "Keyboard Enter reveals choices");

  await desktop.locator(".family-option").first().click();
  assert.match(await desktop.locator("h1").textContent() ?? "", /Enseignes/i, "Category URL should work");

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await mobile.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  assert.equal(await mobile.locator(".category-card").count(), 6, "Mobile shows all six cards");

  const mobileFirst = mobile.locator(".category-card").first().locator(".category-title-row");
  assert.equal(await mobileFirst.getAttribute("aria-expanded"), "false");
  await mobileFirst.tap();
  assert.equal(await mobileFirst.getAttribute("aria-expanded"), "true", "Tap should reveal options");
  await mobileFirst.tap();
  assert.equal(await mobileFirst.getAttribute("aria-expanded"), "false", "Second tap should close options");

  const menuToggle = mobile.locator(".mobile-menu-toggle");
  await menuToggle.tap();
  assert.equal(await menuToggle.getAttribute("aria-expanded"), "true", "Mobile menu opens");
  assert.equal(await mobile.locator(".mobile-nav a").count(), 5, "Mobile menu has five links");

  console.log("J02 browser checks passed: artwork, six cards, desktop hover, keyboard, route and mobile tap/menu.");
} finally {
  await browser.close();
}
