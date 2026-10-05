import { chromium } from "playwright";
const base = "http://localhost:3001";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
const errs = [];
p.on("pageerror", e => errs.push("pageerror: " + e.message));
p.on("console", m => { if (m.type() === "error") errs.push("console: " + m.text()); });

await p.goto(base + "/booking", { waitUntil: "networkidle" });
await p.waitForTimeout(800);
await p.screenshot({ path: "/tmp/bk-1.png" });

// Step 1 -> 2
await p.getByRole("button", { name: /Choose a Time/i }).click();
await p.waitForTimeout(700);
// jump to next opening
const jump = p.getByRole("button", { name: /Jump to the next opening/i });
if (await jump.count()) { await jump.click(); await p.waitForTimeout(500); }
await p.screenshot({ path: "/tmp/bk-2.png" });

// pick first time slot
const slot = p.locator("button", { hasText: /^\d{1,2}:\d{2} (AM|PM)$/ }).first();
await slot.click();
await p.waitForTimeout(500);
await p.screenshot({ path: "/tmp/bk-2b.png" });

await p.getByRole("button", { name: /^Continue$/i }).click();
await p.waitForTimeout(700);
await p.screenshot({ path: "/tmp/bk-3.png" });

// fill form
await p.locator("#f-full-name").fill("Jordan Ellis");
await p.locator("#f-email").fill("jordan@riversideliteracy.org");
await p.locator("#f-organization").fill("Riverside Literacy Project");
await p.locator("#f-your-role").fill("Executive Director");
await p.getByRole("button", { name: /Confirm Booking/i }).click();
await p.waitForTimeout(900);
await p.screenshot({ path: "/tmp/bk-4.png" });

await b.close();
console.log("flow ok");
if (errs.length) console.log("ERRORS:\n" + errs.join("\n"));
