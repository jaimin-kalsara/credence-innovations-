/* ============================================================
   Brand / retailer logo registry.

   Transparent PNGs live in /public/logos (imported + optimized from the
   client's "client logo/transperent" folder via scripts/import-logos.mjs).
   `logo: null` means no asset was provided yet — <BrandLogo> falls back to a
   clean name plate, so nothing breaks. Drop a /public/logos/<name>.png in and
   set its `logo` here to light it up.
   ============================================================ */
const L = (n) => `/logos/${n}.png?v=3`;
/* SVG variant for vector wordmarks (scales crisply at any size). */
const Lsvg = (n) => `/logos/${n}.svg?v=3`;

/* The five big-box retailers Credence operates inside.
   lowes.png isn't on disk yet → <BrandLogo> shows a graceful fallback until
   you drop the file into /public/logos (then it appears automatically). */
export const RETAILER_LOGOS = [
  { name: 'Walmart', logo: L('walmart') },
  { name: 'Target', logo: L('target') },
  { name: 'Costco', logo: L('costco') },
  { name: "Lowe's", logo: L('lowes') },
  { name: "BJ's", logo: L('bjs') },
  { name: "Sam's Club", logo: Lsvg('sams-club') },
];

/* Client brands represented. just-energy.png isn't on disk yet → graceful
   fallback until you drop the file into /public/logos. */
export const CLIENT_LOGOS = [
  { name: 'AT&T', logo: L('att') },
  { name: 'Apple', logo: L('apple') },
  { name: 'LeafFilter', logo: L('leaffilter') },
  { name: 'Primo Water', logo: L('primo') },
  { name: 'Just Energy', logo: L('just-energy') },
];

const MAP = {};
[...RETAILER_LOGOS, ...CLIENT_LOGOS].forEach((b) => { MAP[b.name] = b.logo; });

/* Resolve a brand/retailer name to its logo path (null if none on file). */
export const logoFor = (name) => MAP[name] ?? null;
