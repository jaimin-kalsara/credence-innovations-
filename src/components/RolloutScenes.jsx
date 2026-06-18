import { motion } from 'framer-motion';
import Odometer from './Odometer';

/* ============================================================
   ROLLOUT SCENES — bold, minimal-text illustrations, one per stage.

   These replace the old "dashboard rows of text" with a single strong
   graphic metaphor per step, so a visitor reads the meaning at a glance
   instead of scanning labels:

     rep   → a trained rep on the aisle floor, shoppers converging
     doors → five retail doors unlocking
     map   → a national network lighting coast to coast (99%)
     scale → one store multiplying into a national grid

   Each scene is an SVG illustration with a crisp HTML stat overlaid, it
   re-plays its build on every stage change (the parent keys it by the
   active stage), and it collapses to a static, labelled, reduced-motion
   safe state. Pure brand tokens (electric / ember / bone / graphite).
   ============================================================ */

const EXPO = [0.16, 1, 0.3, 1];
const E_IN = (delay = 0, reduce) => ({
  initial: reduce ? false : { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay: reduce ? 0 : delay, ease: EXPO },
});

/* ───────── 01 · On the floor ───────── */
function SceneRep({ reduce }) {
  const rows = [0, 1, 2, 3];
  const shoppers = [{ x: 150, y: 232, fx: 196, fy: 192 }, { x: 300, y: 238, fx: 244, fy: 192 }, { x: 230, y: 268, fx: 224, fy: 200 }];
  return (
    <div className="relative w-full" role="img" aria-label="A trained brand representative on the store floor between the shelves, with shoppers converging — live conversations climbing through the day.">
      <svg viewBox="0 0 440 300" className="w-full" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
        <line x1="28" y1="250" x2="412" y2="250" stroke="var(--hair)" strokeWidth="1.5" />
        {/* shelves */}
        {[34, 326].map((sx, si) => (
          <motion.g key={si} initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: reduce ? 0 : 0.1 + si * 0.08, ease: EXPO }}>
            <rect x={sx} y="72" width="80" height="178" rx="9" fill="var(--graphite)" stroke="var(--hair)" />
            {rows.map((r) => (
              <g key={r}>
                <rect x={sx + 8} y={92 + r * 40} width="64" height="9" rx="3" fill="var(--hair-faint)" />
                {[0, 1, 2].map((c) => (
                  <rect key={c} x={sx + 11 + c * 21} y={80 + r * 40} width="15" height="13" rx="2"
                    fill={(r + c) % 2 ? 'var(--electric)' : 'var(--ember)'} opacity="0.45" />
                ))}
              </g>
            ))}
          </motion.g>
        ))}
        {/* shoppers converging along dashed trails */}
        {shoppers.map((s, i) => (
          <g key={i}>
            <motion.line x1={s.x} y1={s.y} x2={s.fx} y2={s.fy} stroke="var(--smoke)" strokeWidth="1.2" strokeDasharray="3 5"
              initial={reduce ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.5 }} transition={{ duration: 0.6, delay: reduce ? 0 : 0.5 + i * 0.12, ease: EXPO }} />
            <motion.circle cx={s.x} cy={s.y} r="6" fill="var(--smoke)"
              initial={reduce ? false : { scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.85 }} transition={{ duration: 0.4, delay: reduce ? 0 : 0.55 + i * 0.12, ease: EXPO }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
          </g>
        ))}
        {/* the rep */}
        <motion.g initial={reduce ? false : { scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.55, delay: reduce ? 0 : 0.32, ease: EXPO }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          {!reduce && <motion.circle cx="220" cy="178" r="30" fill="none" stroke="var(--ember)" strokeWidth="1.5" animate={{ r: [29, 48], opacity: [0.55, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }} />}
          <circle cx="220" cy="178" r="29" fill="var(--electric)" />
          <circle cx="220" cy="169" r="7.5" fill="var(--ink)" />
          <path d="M205 196 a15 15 0 0 1 30 0 Z" fill="var(--ink)" />
        </motion.g>
        {/* conversation bubble */}
        <motion.g initial={reduce ? false : { scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, delay: reduce ? 0 : 0.7, ease: EXPO }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <rect x="250" y="120" width="56" height="30" rx="11" fill="var(--graphite)" stroke="var(--electric)" />
          <path d="M262 150 l-6 10 l12 -6 Z" fill="var(--graphite)" stroke="var(--electric)" />
          {[266, 278, 290].map((cx, i) => (
            <motion.circle key={cx} cx={cx} cy="135" r="3" fill="var(--electric)"
              animate={reduce ? {} : { opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }} />
          ))}
        </motion.g>
      </svg>

      <motion.div className="absolute left-0 bottom-0 flex items-baseline gap-2" {...E_IN(0.8, reduce)}>
        <span className="stat-num" style={{ fontSize: 36, color: 'var(--electric)', lineHeight: 1 }}><Odometer value="148" /></span>
        <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--smoke)', maxWidth: 76, lineHeight: 1.3 }}>conversations today</span>
      </motion.div>
    </div>
  );
}

/* ───────── 02 · Five doors ───────── */
const DOORS = [
  { L: 'W', name: 'Walmart' }, { L: 'T', name: 'Target' }, { L: 'C', name: 'Costco' },
  { L: 'L', name: "Lowe's" }, { L: 'B', name: "BJ's" },
];
function SceneDoors({ reduce }) {
  const w = 62, gap = 14, total = DOORS.length * w + (DOORS.length - 1) * gap;
  const startX = (440 - total) / 2;
  return (
    <div className="relative w-full" role="img" aria-label="Five retail doors — Walmart, Target, Costco, Lowe's and BJ's — unlocking, granting access to all five national retailers.">
      <svg viewBox="0 0 440 300" className="w-full" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
        <line x1={startX - 6} y1="248" x2={startX + total + 6} y2="248" stroke="var(--hair)" strokeWidth="1.5" />
        {DOORS.map((d, i) => {
          const x = startX + i * (w + gap), y = 70, h = 178;
          return (
            <motion.g key={d.L} initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: reduce ? 0 : 0.1 + i * 0.1, ease: EXPO }}>
              {/* glow when unlocked */}
              <motion.path d={`M${x} ${y + h} V${y + 26} a${w / 2} ${w / 2} 0 0 1 ${w} 0 V${y + h} Z`} fill="none" stroke="var(--ember)" strokeWidth="2"
                initial={reduce ? false : { opacity: 0 }} animate={{ opacity: [0, 0.9, 0.5] }} transition={{ duration: 0.8, delay: reduce ? 0 : 0.5 + i * 0.1, ease: EXPO }} style={{ filter: 'blur(0.4px)' }} />
              <path d={`M${x} ${y + h} V${y + 26} a${w / 2} ${w / 2} 0 0 1 ${w} 0 V${y + h} Z`} fill="var(--graphite)" stroke="var(--hair)" />
              {/* sign letter */}
              <text x={x + w / 2} y={y + 50} textAnchor="middle" className="font-mono" style={{ fill: 'var(--bone)', fontSize: 16, fontWeight: 600 }}>{d.L}</text>
              {/* handle */}
              <circle cx={x + w - 12} cy={y + h / 2 + 18} r="3" fill="var(--ember)" />
              {/* unlock check */}
              <g transform={`translate(${x + w / 2 - 11} ${y + h / 2})`}>
                <motion.circle cx="11" cy="11" r="13" fill="color-mix(in srgb, var(--electric) 16%, transparent)" stroke="var(--electric)"
                  initial={reduce ? false : { scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, delay: reduce ? 0 : 0.55 + i * 0.1, ease: EXPO }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
                <motion.path d="M6 11 l4 4 l7 -8" fill="none" stroke="var(--electric)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: reduce ? 0 : 0.7 + i * 0.1, ease: EXPO }} />
              </g>
            </motion.g>
          );
        })}
      </svg>

      <motion.div className="absolute left-0 bottom-0 flex items-baseline gap-2" {...E_IN(0.85, reduce)}>
        <span className="stat-num" style={{ fontSize: 30, color: 'var(--electric)', lineHeight: 1 }}>9,000+</span>
        <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--smoke)', maxWidth: 70, lineHeight: 1.3 }}>store floors</span>
      </motion.div>
    </div>
  );
}

/* ───────── 03 · Coast to coast — a dotted U.S. that fills with reach ─────────
   A recognizable continental-U.S. silhouette (viewBox 440×300): a grid of dots
   is clipped to the country and a brand-colored coverage wash sweeps west→east
   to "fill" the map, the Indianapolis hub arcs out to both coasts, and key
   cities pop in. Reads instantly as NATIONAL REACH, not an abstract scatter. */
// recognizable continental U.S.: flat-ish top w/ a Great Lakes notch, angled
// California coast, a Texas dip, and a Florida peninsula hooking down-right.
const US_PATH = 'M70,100 Q150,90 252,88 Q280,96 318,92 Q360,90 392,84 L404,92 Q392,112 372,152 Q362,172 361,180 L367,188 Q374,196 375,206 L373,240 Q364,220 351,196 Q320,202 286,206 Q272,206 268,210 L256,244 Q244,216 240,210 Q196,212 150,214 Q120,214 100,210 Q80,202 74,190 Q62,168 58,126 Q62,108 70,100 Z';
// key cities placed inside the silhouette (west → east); hub = Indianapolis
const MAP_CITIES = [
  { x: 80, y: 116 }, { x: 84, y: 188 }, { x: 132, y: 158 }, { x: 156, y: 196 },
  { x: 196, y: 134 }, { x: 244, y: 202 }, { x: 252, y: 112 }, { x: 300, y: 128 },
  { x: 340, y: 184 }, { x: 372, y: 130 }, { x: 366, y: 226 },
];
const MAP_HUB = { x: 314, y: 150 };
const MAP_COASTS = [{ x: 80, y: 116 }, { x: 84, y: 188 }, { x: 372, y: 130 }, { x: 366, y: 226 }];
const DOTS = (() => {
  const out = [];
  for (let gx = 56; gx <= 404; gx += 11) for (let gy = 84; gy <= 242; gy += 11) out.push([gx, gy]);
  return out;
})();

function SceneMap({ reduce }) {
  return (
    <div className="relative w-full" role="img" aria-label="A dotted map of the United States filling coast to coast from the Indianapolis hub — reaching ninety-nine percent of the U.S. population.">
      <svg viewBox="0 0 440 300" className="w-full" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
        <defs>
          <clipPath id="rj-us"><path d={US_PATH} /></clipPath>
          <linearGradient id="rj-cover" x1="0" x2="1">
            <stop offset="0" stopColor="var(--electric)" stopOpacity="0.42" />
            <stop offset="1" stopColor="var(--ember)" stopOpacity="0.30" />
          </linearGradient>
        </defs>

        {/* dotted country + coverage wash, both clipped to the U.S. shape */}
        <g clipPath="url(#rj-us)">
          <rect x="54" y="80" width="356" height="170" fill="color-mix(in srgb, var(--electric) 8%, transparent)" />
          {DOTS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.5" fill="var(--electric)" opacity="0.32" />
          ))}
          {/* west→east "coverage" reveal */}
          <motion.rect y="80" height="170" fill="url(#rj-cover)"
            initial={reduce ? { width: 356, x: 54 } : { width: 0, x: 54 }} animate={{ width: 356 }}
            transition={{ duration: 1.5, delay: reduce ? 0 : 0.45, ease: EXPO }} />
        </g>

        {/* country outline — draws in */}
        <motion.path d={US_PATH} fill="none" stroke="var(--electric)" strokeWidth="1.4" strokeOpacity="0.7" strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.1, ease: EXPO }} />

        {/* arcs from the hub out to both coasts */}
        {MAP_COASTS.map((c, i) => {
          const mx = (MAP_HUB.x + c.x) / 2, my = (MAP_HUB.y + c.y) / 2 - 26;
          return (
            <motion.path key={'arc' + i} d={`M${MAP_HUB.x},${MAP_HUB.y} Q${mx},${my} ${c.x},${c.y}`} fill="none" stroke="var(--ember)" strokeWidth="1.1" strokeOpacity="0.55"
              initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: reduce ? 0 : 0.7 + i * 0.12, ease: EXPO }} />
          );
        })}

        {/* city nodes (west → east) */}
        {MAP_CITIES.map((c, i) => (
          <motion.circle key={'c' + i} cx={c.x} cy={c.y} r="3.4" fill="var(--electric)" stroke="var(--ink)" strokeWidth="1"
            initial={reduce ? false : { scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: reduce ? 0 : 0.5 + (c.x / 440) * 0.9, ease: EXPO }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
        ))}

        {/* Indianapolis hub */}
        <motion.g initial={reduce ? false : { scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: reduce ? 0 : 0.4, ease: EXPO }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          {!reduce && <motion.circle cx={MAP_HUB.x} cy={MAP_HUB.y} fill="none" stroke="var(--ember)" strokeWidth="1.4" initial={{ r: 7, opacity: 0.6 }} animate={{ r: [7, 26], opacity: [0.6, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }} />}
          <circle cx={MAP_HUB.x} cy={MAP_HUB.y} r="6.5" fill="var(--ember)" stroke="var(--ink)" strokeWidth="1" />
        </motion.g>

        {/* coast-to-coast labels */}
        <text x="30" y="270" className="font-mono" style={{ fill: 'var(--smoke)', fontSize: 9, letterSpacing: '0.14em' }}>PACIFIC</text>
        <text x="410" y="270" textAnchor="end" className="font-mono" style={{ fill: 'var(--smoke)', fontSize: 9, letterSpacing: '0.14em' }}>ATLANTIC</text>
      </svg>

      <motion.div className="absolute left-0 bottom-0 flex items-baseline gap-2" {...E_IN(0.7, reduce)}>
        <span className="stat-num" style={{ fontSize: 44, color: 'var(--electric)', lineHeight: 0.9 }}><Odometer value="99%" /></span>
        <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--smoke)', maxWidth: 64, lineHeight: 1.3 }}>U.S. population</span>
      </motion.div>
    </div>
  );
}

/* ───────── 04 · One → hundreds ───────── */
function SceneScale({ reduce }) {
  const cx = 220, cy = 150;
  const rings = [
    { r: 58, n: 8, s: 5.5 },
    { r: 104, n: 14, s: 4.5 },
  ];
  return (
    <div className="relative w-full" role="img" aria-label="One converting store at the center multiplying outward into a national network of hundreds of locations across forty-plus cities.">
      <svg viewBox="0 0 440 300" className="w-full" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
        {/* spokes + replicated nodes, blooming outward */}
        {rings.map((ring, ri) =>
          Array.from({ length: ring.n }).map((_, i) => {
            const a = (i / ring.n) * Math.PI * 2 + (ri ? 0.22 : 0);
            const x = cx + Math.cos(a) * ring.r, y = cy + Math.sin(a) * ring.r * 0.74;
            const delay = 0.3 + ri * 0.35 + i * 0.03;
            return (
              <g key={`${ri}-${i}`}>
                <motion.line x1={cx} y1={cy} x2={x} y2={y} stroke="var(--electric)" strokeWidth="1" opacity="0.18"
                  initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: reduce ? 0 : delay, ease: EXPO }} />
                <motion.circle cx={x} cy={y} r={ring.s} fill="var(--electric)"
                  initial={reduce ? false : { scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.6 + 0.4 * (1 - ri / rings.length) }}
                  transition={{ duration: 0.4, delay: reduce ? 0 : delay + 0.1, ease: EXPO }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
              </g>
            );
          }),
        )}
        {/* the seed */}
        <motion.g initial={reduce ? false : { scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: reduce ? 0 : 0.2, ease: EXPO }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          {!reduce && <motion.circle cx={cx} cy={cy} r="16" fill="none" stroke="var(--ember)" strokeWidth="1.5" animate={{ r: [16, 40], opacity: [0.5, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }} />}
          <circle cx={cx} cy={cy} r="16" fill="var(--ember)" />
          <text x={cx} y={cy + 5} textAnchor="middle" style={{ fill: 'var(--ink)', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16, fontWeight: 600 }}>1</text>
        </motion.g>
      </svg>

      <motion.div className="absolute left-0 bottom-0 flex items-baseline gap-2" {...E_IN(0.85, reduce)}>
        <span className="stat-num" style={{ fontSize: 36, color: 'var(--electric)', lineHeight: 1 }}><Odometer value="40+" /></span>
        <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--smoke)', maxWidth: 70, lineHeight: 1.3 }}>cities reached</span>
      </motion.div>
    </div>
  );
}

export default function RolloutScene({ visual, reduce }) {
  if (visual === 'rep') return <SceneRep reduce={reduce} />;
  if (visual === 'doors') return <SceneDoors reduce={reduce} />;
  if (visual === 'map') return <SceneMap reduce={reduce} />;
  return <SceneScale reduce={reduce} />;
}
