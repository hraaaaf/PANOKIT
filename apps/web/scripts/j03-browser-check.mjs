import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

// Same isolated browser installation as J02; no product runtime dependency.
const { chromium } = await import("file:///tmp/panokit-playwright/node_modules/playwright/index.mjs");
const origin = process.env.PANOKIT_PREVIEW_URL || "http://127.0.0.1:3000";
const widths = [320, 375, 390, 414, 1440];
const languages = ["fr", "ar"];
const models = [
  "lettres-frontales",
  "lettres-retroeclairees",
  "caisson-rectangulaire",
  "neon-led-flexible",
];
const proofDir = path.resolve("proof");
await fs.mkdir(proofDir, { recursive: true });
let assertions = 0;
function ok(condition, message) {
  assertions += 1;
  assert.ok(condition, message);
}
function equal(actual, expected, message) {
  assertions += 1;
  assert.equal(actual, expected, message);
}
const errors = [];
const browser = await chromium.launch({ headless: true });
try {
  for (const language of languages) {
    for (const width of widths) {
      const page = await browser.newPage({ viewport: { width, height: width <= 600 ? 844 : 1050 } });
      page.on("pageerror", (error) => errors.push(`${language}/${width}: ${error.message}`));
      const response = await page.goto(`${origin}/catalogue/enseignes/lumineuses?lang=${language}`, { waitUntil: "networkidle" });
      equal(response?.status(), 200, `HTTP 200 for ${language}/${width}`);
      equal(await page.locator(".j03-model-card").count(), 4, `Four model cards ${language}/${width}`);
      equal(await page.locator(".j03-art__image").count(), 4, `Four real art assets ${language}/${width}`);
      const data = await page.evaluate(() => {
        const root = document.querySelector(".j03-main");
        const cards = Array.from(document.querySelectorAll(".j03-model-card"));
        const images = Array.from(document.querySelectorAll(".j03-art__image"));
        const grid = document.querySelector(".j03-models");
        const labels = Array.from(document.querySelectorAll(".j03-model-card__text h2"));
        return {
          viewport: window.innerWidth, pageWidth: document.documentElement.scrollWidth,
          direction: root ? getComputedStyle(root).direction : "",
          columnCount: grid ? getComputedStyle(grid).gridTemplateColumns.trim().split(/\\s+/).length : -1,
          boxes: cards.map((item) => {
            const b = item.getBoundingClientRect();
            return { left: b.left, top: b.top, width: b.width, height: b.height };
          }),
          loaded: images.every((img) => img.complete && img.naturalWidth >= 500 && img.naturalHeight >= 300),
          alt: images.every((img) => (img.getAttribute("alt") || "").length > 4),
          labelFits: labels.every((item) => item.scrollWidth <= item.clientWidth + 1),
          tapTargets: cards.every((item) => item.querySelector("a")?.getBoundingClientRect().height >= 44),
        };
      });
      ok(data.pageWidth <= width + 1, `No horizontal overflow ${language}/${width}: ${JSON.stringify(data)}`);
      equal(data.direction, language === "ar" ? "rtl" : "ltr", `Direction ${language}/${width}`);
      equal(data.columnCount, 2, `Exactly 2 gallery columns ${language}/${width}`);
      ok(data.loaded, `Real WebP artwork loaded ${language}/${width}`);
      ok(data.alt, `Image alternative labels ${language}/${width}`);
      ok(data.labelFits, `Model labels not clipped ${language}/${width}`);
      ok(data.tapTargets, `Cards are tappable ${language}/${width}`);
      ok(Math.abs(data.boxes[0].top - data.boxes[1].top) <= 1, `First two cards share row ${language}/${width}`);
      ok(data.boxes[2].top > data.boxes[1].top, `Third card on second row ${language}/${width}`);
      ok(language !== "ar" ? data.boxes[0].left < data.boxes[1].left : data.boxes[0].left > data.boxes[1].left,
        `Card order corresponds to FR/RTL ${language}/${width}`);
      await page.screenshot({ path: path.join(proofDir, `j03-catalogue-${language}-${width}.png`), fullPage: true });
      await page.close();
    }
  }

  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on("pageerror", (error) => errors.push(`journey: ${error.message}`));
  const entry = await page.goto(`${origin}/catalogue/enseignes?lang=fr`, { waitUntil: "networkidle" });
  equal(entry?.status(), 200, "Family landing returns HTTP 200");
  equal(await page.locator(".j03-family-card").count(), 2, "Family chooser offers two options");
  equal(await page.locator(".j03-family-card--disabled a").count(), 0, "Non-lumineuses cannot be purchased");
  await page.locator('.j03-family-card[href*="/lumineuses"]').click();
  ok(page.url().includes("/catalogue/enseignes/lumineuses"), "Lumineuses selection opens gallery");

  const firstLink = page.locator(".j03-model-card__link").first();
  await firstLink.focus();
  await firstLink.press("Enter");
  ok(page.url().includes("/lettres-frontales"), "Keyboard Enter opens model selection");
  equal(await page.locator('input[type="radio"][name="activity"]').count(), 3, "Activity selection has 3 categories");
  equal(await page.locator(".j03-action").isDisabled(), true, "Continue disabled until activity selected");
  await page.locator('input[value="other"]').check();
  equal(await page.locator(".j03-action").isDisabled(), true, "Other requires custom text");
  await page.locator(".j03-other input").fill("Cabinet dentaire");
  equal(await page.locator(".j03-action").isEnabled(), true, "Custom activity permits continuation");
  await page.locator(".j03-action").click();
  equal(await page.locator(".j03-no-format").count(), 1, "Confirmed factory formats absent = blocking stage");
  equal(await page.locator(".j03-form-panel a[href*='studio']").count(), 0, "No Studio link without factory validation");
  equal(await page.locator(".j03-form-panel a[href*='devis']").count(), 0, "No quotation link from blocked format");
  await page.screenshot({ path: path.join(proofDir, "j03-journey-fr-390-blocked-format.png"), fullPage: true });
  await page.locator(".j03-back").click();
  equal(await page.locator(".j03-activity").count(), 3, "Back to activity selection");
  await page.close();

  const pageAr = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const modelAr = await pageAr.goto(`${origin}/catalogue/enseignes/lumineuses/caisson-rectangulaire?lang=ar`, { waitUntil: "networkidle" });
  equal(modelAr?.status(), 200, "Arabic model route HTTP 200");
  equal(await pageAr.locator(".j03-main").getAttribute("dir"), "rtl", "Arabic model step RTL");
  ok((await pageAr.locator(".j03-form-panel h2").textContent() || "").length > 4, "Arabic model step populated");
  await pageAr.screenshot({ path: path.join(proofDir, "j03-journey-ar-390.png"), fullPage: true });
  await pageAr.close();

  for (const model of models) {
    const response = await browser.newPage().then(async p => {
      try { return await p.request.get(`${origin}/visuals/catalogue/CAT-ENS-${String(models.indexOf(model) + 1).padStart(2, "0")}.webp`); }
      finally { await p.close(); }
    });
    equal(response.status(), 200, `Asset for ${model} served with HTTP 200`);
    ok((response.headers()["content-type"] || "").includes("image/webp"), `Correct MIME for ${model}`);
  }
  equal(errors.length, 0, `No client exceptions: ${errors.join("; ")}`);
  console.log(`J03 browser proof PASS: 10 responsive scenarios (FR/AR, 320/375/390/414/1440), journey, 4 WebP assets, ${assertions} assertions`);
} finally {
  await browser.close();
}
