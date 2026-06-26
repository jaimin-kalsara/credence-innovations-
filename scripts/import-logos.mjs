// One-off: import the client/retailer transparent PNG logos into public/logos,
// resized + compressed (the originals are 0.3–1.3 MB each). Run: node scripts/import-logos.mjs
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import path from 'path';

const SRC = 'E:/client/credence innovations/client logo/transperent';
const OUT = 'E:/credence website/public/logos';
mkdirSync(OUT, { recursive: true });

const map = {
  'walmart.png': 'walmart.png',
  'traget.png': 'target.png',
  'costoco.png': 'costco.png',
  'bjs.png': 'bjs.png',
  'apple.png': 'apple.png',
  'ATT-logo-removebg-preview.png': 'att.png',
  'Primo-Water-Logo-Horz.png': 'primo.png',
  'images-removebg-preview.png': 'leaffilter.png',
  // drop transparent PNGs with these source names into the folder above:
  'lowes.png': 'lowes.png',
  'just-energy.png': 'just-energy.png',
};

for (const [src, out] of Object.entries(map)) {
  try {
    const info = await sharp(path.join(SRC, src))
      .trim()                                  // crop away the transparent padding
      .resize({ width: 480, height: 480, fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 9, palette: true })
      .toFile(path.join(OUT, out));
    console.log(`wrote ${out}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
  } catch (e) {
    console.log(`skip ${src} — ${String(e.message).split('\n')[0]}`);
  }
}
