import { chromium } from "playwright";
const base = "http://localhost:3001";
const routes = ["/", "/about", "/services", "/booking", "/contact", "/privacy", "/admin"];
const sizes = [{ n: "mob", w: 390, h: 844 }, { n: "tab", w: 834, h: 1100 }];
const b = await chromium.launch();
const problems = [];

for (const s of sizes) {
  for (const r of routes) {
    const p = await b.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 2 });
    const errs = [];
    p.on("pageerror", e => errs.push(`${r} @${s.n} pageerror: ${e.message}`));
    p.on("console", m => { if (m.type() === "error") errs.push(`${r} @${s.n} console: ${m.text()}`); });
    await p.goto(base + r, { waitUntil: "networkidle" });
    await p.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
    await p.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.6);
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise(r => requestAnimationFrame(() => setTimeout(r, 60)));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await p.waitForTimeout(500);

    // horizontal overflow check
    const over = await p.evaluate(() => {
      const docW = document.documentElement.clientWidth;
      const out = [];
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        if (r.right > docW + 2 || r.left < -2) {
          const cs = getComputedStyle(el);
          if (cs.position === "fixed" || cs.position === "absolute") continue; // decorative bleeds
          out.push(el.tagName.toLowerCase() + "." + String(el.className).slice(0, 60) + ` [${Math.round(r.left)},${Math.round(r.right)}]`);
        }
      }
      return { scrollW: document.documentElement.scrollWidth, docW, out: out.slice(0, 6) };
    });
    if (over.scrollW > over.docW + 2) {
      problems.push(`OVERFLOW ${r} @${s.n}: scrollW=${over.scrollW} vs ${over.docW}\n   ` + over.out.join("\n   "));
    }
    problems.push(...errs);
    const name = r === "/" ? "home" : r.replace(/\//g, "");
    await p.screenshot({ path: `/tmp/sw-${s.n}-${name}.png`, fullPage: s.n === "mob" });
    await p.close();
  }
}
await b.close();
console.log(problems.length ? "PROBLEMS:\n" + problems.join("\n") : "no overflow, no console errors");
