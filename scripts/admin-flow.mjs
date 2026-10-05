import { chromium } from "playwright";
const base = "http://localhost:3001";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 2 });
const errs = [];
p.on("pageerror", e => errs.push("pageerror: " + e.message));
p.on("console", m => { if (m.type() === "error") errs.push("console: " + m.text()); });

await p.goto(base + "/admin", { waitUntil: "networkidle" });
await p.waitForTimeout(600);
await p.screenshot({ path: "/tmp/ad-login.png" });

await p.locator("#email").fill("andrea@theimpactlab.co");
await p.locator("#password").fill("demo1234");
await p.getByRole("button", { name: /Sign In/i }).click();
await p.waitForURL("**/admin/dashboard", { timeout: 10000 });
await p.waitForTimeout(900);
await p.screenshot({ path: "/tmp/ad-dash.png" });

// expand first appointment
await p.locator("main ul > li button").first().click();
await p.waitForTimeout(700);
await p.screenshot({ path: "/tmp/ad-appt.png" });

// availability tab
await p.getByRole("button", { name: "Availability", exact: true }).click();
await p.waitForTimeout(700);
await p.screenshot({ path: "/tmp/ad-avail.png", fullPage: true });

// notifications tab
await p.getByRole("button", { name: "Notifications", exact: true }).click();
await p.waitForTimeout(700);
await p.screenshot({ path: "/tmp/ad-notif.png" });

await b.close();
console.log("admin flow ok");
if (errs.length) console.log("ERRORS:\n" + errs.join("\n"));
