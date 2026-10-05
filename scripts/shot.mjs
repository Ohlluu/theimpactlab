/**
 * Dev-only screenshot helper. Not part of the app.
 *   node shot.mjs <path> [out] [--w=1440] [--h=900] [--full]
 */
import { chromium } from "playwright";

const [, , route = "/", out = "/tmp/shot.png", ...flags] = process.argv;
const get = (k, d) => {
  const f = flags.find((x) => x.startsWith(`--${k}=`));
  return f ? Number(f.split("=")[1]) : d;
};
const width = get("w", 1440);
const height = get("h", 900);
const full = flags.includes("--full");
const base = process.env.BASE ?? "http://localhost:3001";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: 2,
});

const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`console: ${m.text()}`);
});

await page.goto(base + route, { waitUntil: "networkidle" });
// Trip every IntersectionObserver reveal before capturing.
// `html { scroll-behavior: smooth }` animates scrollTo, so a tight loop never
// actually lands on the target offsets — force instant scrolling first.
await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
await page.evaluate(async () => {
  const step = Math.round(window.innerHeight * 0.6);
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 70)));
  }
  window.scrollTo({ top: 0, behavior: "instant" });
  await new Promise((r) => setTimeout(r, 120));
});
await page.waitForTimeout(900);
await page.screenshot({ path: out, fullPage: full });
await browser.close();

console.log(`shot → ${out}  (${width}×${height}${full ? ", full page" : ""})`);
if (errors.length) console.log("PAGE ERRORS:\n" + errors.join("\n"));
