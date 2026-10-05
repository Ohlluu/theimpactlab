import sharp from 'sharp';
const src = 'public/img/logo-square.png';
const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
// olive bg = #506031 (80,96,49). Make anything near it transparent; keep white marks.
let kept = 0;
for (let i = 0; i < data.length; i += channels) {
  const r = data[i], g = data[i+1], b = data[i+2];
  const d = Math.abs(r-80) + Math.abs(g-96) + Math.abs(b-49);
  if (d < 90) { data[i+3] = 0; }
  else {
    // force remaining pixels to pure white, alpha by how far from bg (antialias-friendly)
    const a = Math.min(255, Math.round(((d - 60) / 350) * 255));
    data[i] = 255; data[i+1] = 255; data[i+2] = 255; data[i+3] = Math.max(a, 0);
    if (a > 200) kept++;
  }
}
await sharp(data, { raw: { width, height, channels } }).png().toFile('public/img/logo-mark-white.png');
console.log('white pixels kept:', kept, `${width}x${height}`);
const t = await sharp('public/img/logo-mark-white.png').trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
await sharp(t.data).toFile('public/img/logo-wordmark-white.png');
console.log('trimmed to', t.info.width + 'x' + t.info.height);
