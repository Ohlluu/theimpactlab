/**
 * Dev-only asset prep — generates the favicon, apple touch icon and the
 * Open Graph card from the brand logo. Run once; the output is committed.
 *   node icons.mjs
 */
import sharp from "sharp";

const OLIVE = "#2d361c";
const SRC = "public/img/logo-square.png";
const WORD = "public/img/logo-wordmark-white.png";

// --- favicon / app icons ----------------------------------------------------
await sharp(SRC).resize(512, 512).png().toFile("src/app/icon.png");
await sharp(SRC)
  .resize(180, 180)
  .flatten({ background: "#506031" })
  .png()
  .toFile("src/app/apple-icon.png");

// --- Open Graph card --------------------------------------------------------
const W = 1200;
const H = 630;

const wordmark = await sharp(WORD).resize({ width: 520 }).toBuffer();
const wm = await sharp(wordmark).metadata();

// Strapline + a single brass rule. No corner brackets here on purpose — the
// wordmark already carries them, and a second pair just fights with the text.
const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <path d="M 80 ${H / 2 + 52} L 164 ${H / 2 + 52}" stroke="#b7a35c" stroke-width="3"/>
  <text x="80" y="${H / 2 + 118}"
        font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="32" fill="#e8e6e0" letter-spacing="0.3">
    Fundraising strategy and capacity building
  </text>
  <text x="80" y="${H / 2 + 166}"
        font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="32" fill="#b7a35c" letter-spacing="0.3">
    for nonprofits and foundations.
  </text>
  <text x="80" y="${H - 64}"
        font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="21" fill="#8d9079" letter-spacing="2.6">
    ANDREA PORTER · FOUNDER &amp; PRINCIPAL
  </text>
</svg>`);

await sharp({
  create: { width: W, height: H, channels: 4, background: OLIVE },
})
  .composite([
    { input: wordmark, left: 80, top: Math.round(H / 2 - (wm.height ?? 0) - 30) },
    { input: overlay, left: 0, top: 0 },
  ])
  .png()
  .toFile("src/app/opengraph-image.png");

await sharp("src/app/opengraph-image.png").toFile("src/app/twitter-image.png");

console.log("icons + og card written");
