/**
 * Dev-only asset prep. Not part of the app — run once, commit the output.
 *
 * The studio headshots sit on a light cool-grey backdrop. Dropped into a dark
 * olive page that reads as a bright rectangle pasted on top of the design.
 *
 * Rather than veil her face with an overlay, this replaces only the backdrop:
 * flood-fill from the image edges across pixels that are bright and
 * desaturated (the seamless), stopping at her hair, skin and top. The mask is
 * then dilated a touch and feathered so curly-hair edges don't leave a light
 * halo, and the backdrop is repainted as a soft vertical olive gradient.
 *
 *   node grade.mjs
 */
import sharp from "sharp";

const SOURCES = ["andrea-1", "andrea-2", "andrea-3", "andrea-4"];

/**
 * Backdrop replacement, top → bottom.
 *
 * Sand rather than olive, deliberately. Matting curly hair is never perfect,
 * and swapping a light grey seamless for a *dark* backdrop turns every missed
 * antialiased pixel into a visible light halo. Swapping it for a light warm
 * sand keeps fringe pixels close in luminance to their new surroundings, so
 * the imperfection disappears — and a warm portrait panel against the dark
 * olive page is the better composition anyway.
 */
const TOP = [244, 228, 208]; // slightly lifted sand
const BOTTOM = [230, 192, 155]; // sand-300, for a little depth

const lum = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
const sat = (r, g, b) => {
  const mx = Math.max(r, g, b);
  return mx === 0 ? 0 : (mx - Math.min(r, g, b)) / mx;
};

/** Grow the mask by `r` px so antialiased hair edges get covered too. */
function dilate(mask, W, H, r) {
  const tmp = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let on = 0;
      for (let d = -r; d <= r && !on; d++) {
        const nx = x + d;
        if (nx >= 0 && nx < W && mask[y * W + nx]) on = 1;
      }
      tmp[y * W + x] = on;
    }
  }
  const out = new Uint8Array(W * H);
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      let on = 0;
      for (let d = -r; d <= r && !on; d++) {
        const ny = y + d;
        if (ny >= 0 && ny < H && tmp[ny * W + x]) on = 1;
      }
      out[y * W + x] = on;
    }
  }
  return out;
}

/** Separable box blur — turns the hard mask into a feathered alpha. */
function blur(mask, W, H, r) {
  const a = new Float32Array(W * H);
  const b = new Float32Array(W * H);
  for (let i = 0; i < mask.length; i++) a[i] = mask[i] ? 1 : 0;

  const win = 2 * r + 1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let s = 0;
      for (let d = -r; d <= r; d++) {
        s += a[y * W + Math.min(W - 1, Math.max(0, x + d))];
      }
      b[y * W + x] = s / win;
    }
  }
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      let s = 0;
      for (let d = -r; d <= r; d++) {
        s += b[Math.min(H - 1, Math.max(0, y + d)) * W + x];
      }
      a[y * W + x] = s / win;
    }
  }
  return a;
}

for (const name of SOURCES) {
  const src = `public/img/${name}.jpg`;
  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  // ---- 1. Flood fill the seamless from the edges -------------------------
  const isBackdrop = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    return lum(r, g, b) > 0.58 && sat(r, g, b) < 0.3;
  };

  const mask = new Uint8Array(W * H);
  const queue = [];
  const push = (x, y) => {
    const p = y * W + x;
    if (mask[p] || !isBackdrop(p * C)) return;
    mask[p] = 1;
    queue.push(p);
  };

  // Seed from top, left and right edges. The bottom edge is her shoulder.
  for (let x = 0; x < W; x++) push(x, 0);
  for (let y = 0; y < H; y++) {
    push(0, y);
    push(W - 1, y);
  }

  while (queue.length) {
    const p = queue.pop();
    const x = p % W;
    const y = (p / W) | 0;
    if (x > 0) push(x - 1, y);
    if (x < W - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < H - 1) push(x, y + 1);
  }

  const covered = mask.reduce((a, v) => a + v, 0) / (W * H);

  // ---- 2. Dilate + feather ----------------------------------------------
  const alpha = blur(dilate(mask, W, H, 2), W, H, 2);

  // Fringe band: pixels just outside the fill. Curly hair antialiases against
  // the old light seamless, so these keep a grey halo unless suppressed.
  const band = dilate(mask, W, H, 7);

  // ---- 3. Repaint the backdrop, suppressing the halo as we go ------------
  const out = Buffer.from(data);
  for (let y = 0; y < H; y++) {
    const t = y / (H - 1);
    const tr = TOP[0] + (BOTTOM[0] - TOP[0]) * t;
    const tg = TOP[1] + (BOTTOM[1] - TOP[1]) * t;
    const tb = TOP[2] + (BOTTOM[2] - TOP[2]) * t;

    for (let x = 0; x < W; x++) {
      const p = y * W + x;
      const i = p * C;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      let a = alpha[p];

      // Despill: inside the band but outside the fill, pull desaturated
      // highlights down toward the backdrop. Her skin is saturated and her
      // hair is dark, so both are left alone.
      if (a < 0.995 && band[p]) {
        const L = lum(r, g, b);
        const grey = 1 - Math.min(1, sat(r, g, b) / 0.3);
        const bright = Math.min(1, Math.max(0, (L - 0.42) / 0.38));
        a = Math.max(a, grey * bright * 0.9);
      }

      if (a <= 0.001) continue;
      out[i] = r * (1 - a) + tr * a;
      out[i + 1] = g * (1 - a) + tg * a;
      out[i + 2] = b * (1 - a) + tb * a;
    }
  }

  // ---- 4. Light grade so she reads warm against the olive ----------------
  await sharp(out, { raw: { width: W, height: H, channels: C } })
    .modulate({ brightness: 1.02, saturation: 1.06 })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(`public/img/${name}-sand.jpg`);

  console.log(
    `${name} → ${name}-sand.jpg   backdrop ${(covered * 100).toFixed(1)}% of frame`,
  );
}
