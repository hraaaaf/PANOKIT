import assert from "node:assert/strict";

// Isolated GitHub runner test dependency: installed only for screenshot QA.
// No permanent Playwright dependency is added to the product.
const { chromium } = await import("file:///tmp/panokit-playwright/node_modules/playwright/index.mjs");

const browser = await chromium.launch({ headless: true });
try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await desktop.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  assert.equal(await desktop.locator(".category-card").count(), 6, "Six category cards required");
  assert.equal(await desktop.locator(".panokit-family-icon").count(), 6, "Six custom mockup pictograms are required");
  assert.equal(await desktop.locator(".mobile-hero-action").isVisible(), false, "Mobile CTA must remain hidden on desktop");
  const expectedFamilies = ["enseignes", "drapeaux", "signaletique", "plv", "impression", "habillage"];
  assert.deepEqual(
    await desktop.locator("[data-family-icon]").evaluateAll((elements) => elements.map((element) => element.getAttribute("data-family-icon"))),
    expectedFamilies,
    "Every category must have the matching custom mockup pictogram",
  );
  assert.match(await desktop.title(), /^PANOKIT \| Enseignes et signalétique en kit$/, "Published preview must not retain bootstrap metadata");

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
  const mobileCTA = mobile.locator(".mobile-hero-action");
  assert.equal(await mobileCTA.isVisible(), true, "Mobile entry CTA must be visible");
  assert.equal(await mobileCTA.getAttribute("href"), "#familles", "CTA must point to the real product choices, not an unfinished quote form");
  assert.equal((await mobileCTA.textContent())?.trim().replace(/\\s+/g, " "), "Voir les produits");
  await mobileCTA.tap();
  await mobile.waitForFunction(() => window.location.hash === "#familles");
  const familySection = await mobile.locator("#familles").boundingBox();
  assert.ok(familySection && familySection.y < 845, "Tapping CTA should bring product choices into view");

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

  // Regression: approved tagline must occupy exactly two lines on mobile.
  // In particular, "simple." must not be orphaned on a third line.
  for (const width of [280, 300, 320, 360, 375, 390, 414, 430, 600]) {
    const narrowPage = await browser.newPage({
      viewport: { width, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    await narrowPage.goto("http://127.0.0.1:3000/", { waitUntil: "domcontentloaded" });
    const heading = narrowPage.locator("#home-title");
    const measurement = await heading.evaluate((element) => {
      const style = getComputedStyle(element);
      const lineHeight = Number.parseFloat(style.lineHeight);
      const rect = element.getBoundingClientRect();
      return {
        lines: Math.round(rect.height / lineHeight),
        text: (element.textContent ?? "").replace(/\s+/g, " ").trim(),
        viewport: document.documentElement.clientWidth,
        elementWidth: rect.width,
      };
    });
    assert.equal(measurement.lines, 2, `Tagline must occupy exactly two lines at ${width}px`);
    assert.equal(
      measurement.text,
      "Avoir son enseigne n'a jamais été aussi simple.",
      "Approved tagline wording must not change",
    );
    assert.ok(
      measurement.elementWidth <= measurement.viewport + 1,
      `Tagline container should not overflow at ${width}px`,
    );
    const dimensions = await narrowPage.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    assert.ok(
      dimensions.scrollWidth <= dimensions.viewport + 1,
      `Entire page must not overflow horizontally at ${width}px: ${JSON.stringify(dimensions)}`,
    );
    await narrowPage.close();
  }

  await desktop.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  const mobileCTAColors = await mobileCTA.evaluate((element) => ({
    fg: getComputedStyle(element).color,
    bg: getComputedStyle(element).backgroundColor,
    height: element.getBoundingClientRect().height,
  }));
  assert.ok(mobileCTAColors.height >= 44, "Mobile CTA tap target must be at least 44px high");

  const colorData = await desktop.evaluate(() => {
    const cta = document.querySelector(".primary-action");
    const kicker = document.querySelector(".section-kicker");
    const panel = document.querySelector(".home-secondary");
    if (!cta || !kicker || !panel) throw new Error("Required visual elements missing");
    return {
      ctaFg: getComputedStyle(cta).color,
      ctaBg: getComputedStyle(cta).backgroundColor,
      kickerFg: getComputedStyle(kicker).color,
      kickerBg: getComputedStyle(panel).backgroundColor,
    };
  });
  const luminance = (rgb) => {
    const rgbArray = rgb.match(/\d+(?:\.\d+)?/g)?.slice(0, 3).map(Number);
    if (!rgbArray || rgbArray.length !== 3) throw new Error(`Unexpected CSS color: ${rgb}`);
    const linear = rgbArray.map(v => {
      const c = v / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  };
  const contrast = (a, b) => {
    const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (values[0] + 0.05) / (values[1] + 0.05);
  };
  assert.ok(contrast(colorData.ctaFg, colorData.ctaBg) >= 4.5, "Quote CTA must meet AA text contrast");
  assert.ok(contrast(colorData.kickerFg, colorData.kickerBg) >= 4.5, "Small orange kicker must meet AA text contrast");
  assert.ok(contrast(mobileCTAColors.fg, mobileCTAColors.bg) >= 4.5, "Mobile product CTA must meet AA text contrast");

  console.log("J02 checks passed: images, hover, keyboard, touch, two-line tagline, horizontal overflow, document metadata, CTA/label color contrast.");
} finally {
  await browser.close();
}
