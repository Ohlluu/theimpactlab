/**
 * Dev-only asset prep — generates the texture layer. Run once, commit output.
 *   node scripts/texture.mjs
 *
 * Two pieces:
 *
 * 1. `grain.png` — fine monochrome noise, tiled across the whole site at very
 *    low opacity in `overlay` blend mode. This is the single highest-return
 *    change for making flat colour read as material: #171b0e on its own is a
 *    CSS value, the same olive with grain is ink on stock. Mid-grey (128) is
 *    the neutral point for overlay blending, so the noise is generated around
 *    that and only lightens/darkens by a hair.
 *
 *    Pure white noise tiles seamlessly in practice — there is no low-frequency
 *    structure for the eye to catch at the seam.
 *
 * 2. `bracket-tile-*.svg` — Andrea's corner bracket, repeated at large scale
 *    as a faint background field. A generic pattern would read as stock; this
 *    one could only belong to The Impact Lab. Two variants because the dark
 *    and sand sections need opposite ink.
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";

/* ------------------------------------------------------------------ grain */

const N = 160;
const SPREAD = 46; // ± around mid-grey. Higher = coarser, more obvious.

const noise = Buffer.alloc(N * N);
// Deterministic PRNG so re-running produces the identical file and the repo
// doesn't churn. (Math.random would make every run a new binary diff.)
let seed = 0x9e3779b9;
const rand = () => {
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return ((seed >>> 0) % 10000) / 10000;
};

for (let i = 0; i < noise.length; i++) {
  noise[i] = Math.max(0, Math.min(255, Math.round(128 + (rand() * 2 - 1) * SPREAD)));
}

await sharp(noise, { raw: { width: N, height: N, channels: 1 } })
  .png({ compressionLevel: 9 })
  .toFile("public/img/grain.png");

/* --------------------------------------------------------------- brackets */

/**
 * One bracket per tile, on a large tile.
 *
 * The first attempt put both the top-right and bottom-left bracket on a 280px
 * tile, matching the logo. Tiled, the bottom-left of one repeat lined up with
 * the top-right of its neighbour and the eye closed them into a grid of
 * rectangles — it read as stray wireframe boxes behind the text, not as a
 * watermark. One mark on a much bigger tile keeps each bracket reading as an
 * individual mark with air around it.
 */
const SIZE = 460;
const tile = (stroke, width) => `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <g stroke="${stroke}" stroke-width="${width}" fill="none">
    <path d="M330 120 L330 206 M330 120 L244 120"/>
  </g>
</svg>`;

// Opacity is baked into the stroke colour — a background-image can't be dimmed
// from CSS without an extra wrapper element.
writeFileSync("public/img/bracket-tile-light.svg", tile("rgba(251,249,249,0.05)", 1.5));
writeFileSync("public/img/bracket-tile-dark.svg", tile("rgba(23,27,14,0.07)", 1.5));

console.log(`grain.png (${N}×${N}, ±${SPREAD}) + 2 bracket tiles written`);
