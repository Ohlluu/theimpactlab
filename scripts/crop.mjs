import sharp from 'sharp';
const [,, src, prefix, nStr] = process.argv;
const n = Number(nStr || 4);
const m = await sharp(src).metadata();
const h = Math.ceil(m.height / n);
for (let i = 0; i < n; i++) {
  const top = i * h;
  const height = Math.min(h, m.height - top);
  await sharp(src).extract({ left: 0, top, width: m.width, height })
    .resize({ width: 1400 }).toFile(`${prefix}-${i + 1}.png`);
}
console.log('ok', n, 'slices of', m.width + 'x' + m.height);
