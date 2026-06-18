import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import Odometer from './Odometer';

const EXPO = [0.16, 1, 0.3, 1];
const DUR = 5500; // auto-advance ms

export const STAGES = [
  {
    n: '01', title: 'Product & Market Entry', teaser: 'Trained reps on the floor', caption: 'LIVE · IN-STORE', visual: 'rep',
    body: 'We place trained brand representatives directly inside high-traffic retail environments. No passive shelf placement. Real people, real conversations, real selling.',
  },
  {
    n: '02', title: 'Fortune 500 Retail Access', teaser: 'Five doors, unlocked', caption: "WALMART · TARGET · COSTCO · LOWE'S · BJ'S", visual: 'doors',
    body: "Our operating partnerships with Walmart, Target, Costco, Lowe's, and BJ's give your brand immediate access to the country's highest-volume store floors, where buying decisions happen every day.",
  },
  {
    n: '03', title: '99% Population Reach', teaser: 'Coast to coast', caption: 'U.S. POPULATION REACHED', visual: 'map',
    body: 'Through our retail network, we reach over 99% of the U.S. population. Your campaign runs across the full breadth of the American market.',
  },
  {
    n: '04', title: 'National Scale', teaser: 'One → hundreds', caption: 'ONE MARKET → NATIONWIDE', visual: 'scale',
    body: 'Once a campaign is converting, we replicate it. From one retail location to hundreds, from one city to every major market. National without losing quality or consistency.',
  },
];

/* shared row-entrance — fires once per stage switch (parent remounts each panel
   via AnimatePresence, so initial/animate replay on every stage change). */
const rowIn = (i, reduce) => ({
  initial: reduce ? false : { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: EXPO, delay: reduce ? 0 : 0.1 + i * 0.1 },
});

/* ───────────────── Stage 01 — live in-store activity feed ───────────────── */
function RepStore({ reduce }) {
  const rows = [
    { dot: 'var(--electric)', label: 'Trained rep on floor', meta: 'Aisle 7' },
    { dot: 'var(--ember)', label: 'Demo active — shoppers engaging', meta: 'now' },
  ];
  return (
    <div
      role="img"
      aria-label="Live in-store activity: a trained rep is on the floor, a product demo is active, and customer conversations are climbing through the day."
      className="w-full" style={{ maxWidth: 420, margin: '0 auto' }}
    >
      {/* header — the single allowed perpetual motion: the live status dot */}
      <div className="flex items-center justify-between mb-4" aria-hidden="true">
        <div className="flex items-center gap-2.5">
          <span className="relative grid place-items-center" style={{ width: 12, height: 12 }}>
            {!reduce && (
              <motion.span className="absolute rounded-full" style={{ width: 8, height: 8, background: 'var(--ember)' }}
                animate={{ scale: [1, 2.6], opacity: [0.5, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }} />
            )}
            <span className="relative rounded-full" style={{ width: 7, height: 7, background: 'var(--ember)' }} />
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--bone)' }}>In-store · Live</span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.16em] uppercase px-2.5 py-1 rounded-full"
          style={{ color: 'var(--smoke)', border: '1px solid var(--hair)' }}>Store floor</span>
      </div>

      <div className="flex flex-col gap-2.5" aria-hidden="true">
        {rows.map((r, i) => (
          <motion.div key={i} {...rowIn(i, reduce)} className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'var(--ink)', border: '1px solid var(--hair)' }}>
            <span className="rounded-full shrink-0" style={{ width: 8, height: 8, background: r.dot }} />
            <span className="text-sm flex-1" style={{ color: 'var(--bone)' }}>{r.label}</span>
            <span className="font-mono text-[9px] tracking-[0.14em] uppercase" style={{ color: 'var(--smoke)' }}>{r.meta}</span>
          </motion.div>
        ))}
        <motion.div {...rowIn(2, reduce)} className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{ background: 'var(--brand-soft)', border: '1px solid var(--electric)' }}>
          <span className="text-sm" style={{ color: 'var(--bone)' }}>Conversations today</span>
          <span className="stat-num" style={{ fontSize: 24, color: 'var(--electric)' }}><Odometer value="148" /></span>
        </motion.div>
      </div>
    </div>
  );
}

/* ───────────────── Stage 02 — Fortune 500 retail access ───────────────── */
const RETAILERS = [
  { name: 'Walmart', count: '4,600+' },
  { name: 'Target', count: '1,900+' },
  { name: 'Costco', count: '600+' },
  { name: "Lowe's", count: '1,700+' },
  { name: "BJ's", count: '240+' },
];
function Doors({ reduce }) {
  return (
    <div
      role="img"
      aria-label="Retail access granted across Walmart, Target, Costco, Lowe's and BJ's — thousands of high-volume store floors nationwide."
      className="w-full flex flex-col gap-2" style={{ maxWidth: 430, margin: '0 auto' }}
    >
      {RETAILERS.map((r, i) => (
        <motion.div key={r.name} {...rowIn(i, reduce)} aria-hidden="true"
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: 'var(--ink)', border: '1px solid var(--hair)' }}>
          <span className="text-base flex-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)' }}>{r.name}</span>
          <span className="font-mono text-[10px] tracking-[0.04em] px-2 py-1 rounded-md hidden sm:inline-block"
            style={{ color: 'var(--smoke)', background: 'var(--graphite)', border: '1px solid var(--hair-faint)' }}>{r.count} stores</span>
          <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full"
            style={{ color: 'var(--electric)', background: 'var(--brand-soft)' }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <motion.path d="M2.5 6.2 L5 8.6 L9.5 3.6" style={{ stroke: 'var(--electric)' }} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
                initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: reduce ? 0 : 0.35 + i * 0.1, ease: EXPO }} />
            </svg>
            Access
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ───────────────── Stage 03 — national coverage map + 99% population reach ─────────────────
   City coordinates copied from USMap (1000×600 viewBox) — rendered statically here
   (no pulse rings) as a clean dashboard read-out. */
const MAP_CITIES = [
  { x: 660, y: 250, hq: true },
  { x: 130, y: 95 }, { x: 120, y: 130 }, { x: 90, y: 270 }, { x: 145, y: 330 },
  { x: 200, y: 290 }, { x: 235, y: 350 }, { x: 365, y: 270 }, { x: 270, y: 230 },
  { x: 470, y: 400 }, { x: 510, y: 440 }, { x: 510, y: 270 }, { x: 540, y: 160 },
  { x: 620, y: 210 }, { x: 640, y: 330 }, { x: 700, y: 380 }, { x: 800, y: 510 },
  { x: 690, y: 200 }, { x: 850, y: 215 }, { x: 885, y: 180 }, { x: 840, y: 240 },
  { x: 815, y: 270 }, { x: 745, y: 340 }, { x: 720, y: 220 },
];
function MapStage({ reduce }) {
  const hq = MAP_CITIES[0];
  const near = MAP_CITIES.slice(1)
    .map((c) => ({ c, d: Math.hypot(c.x - hq.x, c.y - hq.y) }))
    .sort((a, b) => a.d - b.d).slice(0, 7).map((o) => o.c);
  return (
    <div
      role="img"
      aria-label="United States coverage map: the retail network reaches over 99 percent of the U.S. population, coast to coast across 50 states."
      className="w-full" style={{ maxWidth: 460, margin: '0 auto' }}
    >
      <div className="flex items-center justify-between mb-2" aria-hidden="true">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--smoke)' }}>Coverage map</span>
        <span className="font-mono text-[9px] tracking-[0.16em] uppercase" style={{ color: 'var(--electric)' }}>Coast to coast</span>
      </div>
      <svg viewBox="0 0 1000 600" className="w-full" style={{ display: 'block' }} aria-hidden="true">
        <rect x="60" y="70" width="850" height="480" rx="40" fill="none" style={{ stroke: 'var(--hair-faint)' }} strokeWidth="1.5" />
        <g style={{ fill: 'var(--hair-faint)' }}>
          {Array.from({ length: 17 }).map((_, r) =>
            Array.from({ length: 29 }).map((_, c) => (
              <circle key={`${r}-${c}`} cx={78 + c * 29} cy={92 + r * 26} r="1.5" />
            ))
          )}
        </g>
        {near.map((c, i) => (
          <motion.line key={'cl' + i} x1={hq.x} y1={hq.y} x2={c.x} y2={c.y}
            style={{ stroke: 'var(--electric)' }} strokeWidth="1.4" opacity="0.32" vectorEffect="non-scaling-stroke"
            initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: reduce ? 0 : 0.25 + i * 0.07, ease: EXPO }} />
        ))}
        {MAP_CITIES.map((c, i) => (
          <motion.circle key={'ct' + i} cx={c.x} cy={c.y} r={c.hq ? 10 : 5}
            style={{ fill: c.hq ? 'var(--ember)' : 'var(--electric)', transformOrigin: `${c.x}px ${c.y}px` }}
            initial={reduce ? false : { scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: c.hq ? 1 : 0.9 }}
            transition={{ duration: 0.4, delay: reduce ? 0 : 0.2 + i * 0.04, ease: EXPO }} />
        ))}
      </svg>
      <div className="flex items-end justify-between mt-3" aria-hidden="true">
        <div>
          <span className="stat-num leading-none" style={{ fontSize: 'clamp(34px, 5vw, 52px)', color: 'var(--electric)' }}><Odometer value="99%" /></span>
          <p className="font-mono text-[9px] tracking-[0.18em] uppercase mt-1" style={{ color: 'var(--smoke)' }}>U.S. population reached</p>
        </div>
        <span className="font-mono text-[9px] tracking-[0.14em] uppercase mb-1" style={{ color: 'var(--smoke)' }}>50 states</span>
      </div>
      <div className="mt-2 h-[6px] w-full rounded-full overflow-hidden" style={{ background: 'var(--hair)' }} aria-hidden="true">
        <motion.div className="h-full rounded-full" style={{ background: 'var(--electric)' }}
          initial={reduce ? false : { width: 0 }} animate={{ width: '99%' }} transition={{ duration: 1.1, delay: reduce ? 0 : 0.3, ease: EXPO }} />
      </div>
    </div>
  );
}

/* ───────────────── Stage 04 — one location replicating into a national network ───────────────── */
function ScaleGrid({ reduce }) {
  const COLS = 8, ROWS = 4, N = COLS * ROWS;
  return (
    <div
      role="img"
      aria-label="National scale: one converting store location replicates into hundreds, spanning more than 40 cities and 211 campaigns."
      className="w-full" style={{ maxWidth: 440, margin: '0 auto' }}
    >
      <div className="flex items-center justify-between mb-3" aria-hidden="true">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--smoke)' }}>Replication</span>
        <span className="font-mono text-[11px] tracking-[0.02em]">
          <span style={{ color: 'var(--ember)' }}>1</span>
          <span style={{ color: 'var(--smoke)' }}> → </span>
          <span style={{ color: 'var(--electric)' }}>hundreds of locations</span>
        </span>
      </div>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }} aria-hidden="true">
        {Array.from({ length: N }).map((_, i) => {
          const seed = i === 0;
          return (
            <motion.div key={i} className="grid place-items-center rounded-md"
              style={{
                aspectRatio: '1',
                background: seed ? 'var(--brand-soft)' : 'var(--ink)',
                border: `1px solid ${seed ? 'var(--electric)' : 'var(--hair)'}`,
                color: seed ? 'var(--ember)' : 'var(--electric)',
              }}
              initial={reduce ? false : { scale: 0.2, opacity: 0 }}
              animate={{ scale: 1, opacity: seed ? 1 : 0.45 + 0.5 * (1 - i / N) }}
              transition={{ duration: 0.4, delay: reduce ? 0 : (seed ? 0 : 0.15 + i * 0.03), ease: EXPO }}
            >
              <StageIcon name="rep" size={13} />
            </motion.div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4" aria-hidden="true">
        <div className="px-4 py-3 rounded-xl" style={{ background: 'var(--ink)', border: '1px solid var(--hair)' }}>
          <span className="stat-num" style={{ fontSize: 28, color: 'var(--electric)' }}><Odometer value="40+" /></span>
          <p className="font-mono text-[9px] tracking-[0.16em] uppercase mt-1" style={{ color: 'var(--smoke)' }}>Cities</p>
        </div>
        <div className="px-4 py-3 rounded-xl" style={{ background: 'var(--ink)', border: '1px solid var(--hair)' }}>
          <span className="stat-num" style={{ fontSize: 28, color: 'var(--electric)' }}><Odometer value="211" /></span>
          <p className="font-mono text-[9px] tracking-[0.16em] uppercase mt-1" style={{ color: 'var(--smoke)' }}>Campaigns</p>
        </div>
      </div>
    </div>
  );
}

export function StageGraphic({ visual, reduce }) {
  if (visual === 'rep') return <RepStore reduce={reduce} />;
  if (visual === 'doors') return <Doors reduce={reduce} />;
  if (visual === 'map') return <MapStage reduce={reduce} />;
  return <ScaleGrid reduce={reduce} />;
}

/* draining countdown ring + play/pause toggle */
function AutoRing({ active, auto, paused, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={paused ? 'Resume auto-advance' : 'Pause auto-advance'}
      className="grid place-items-center rounded-full"
      style={{ width: 26, height: 26, cursor: 'pointer' }}
    >
      <svg width="22" height="22" viewBox="0 0 22 22">
        <circle cx="11" cy="11" r="9" fill="none" stroke="var(--hair)" strokeWidth="1.5" />
        {auto && (
          <motion.circle
            key={active} cx="11" cy="11" r="9" fill="none" stroke="var(--electric)" strokeWidth="1.5" strokeLinecap="round"
            pathLength="1" transform="rotate(-90 11 11)"
            initial={{ pathLength: 1 }} animate={{ pathLength: 0 }} transition={{ duration: DUR / 1000, ease: 'linear' }}
          />
        )}
        {paused
          ? <path d="M9 7 L15 11 L9 15 Z" fill="var(--smoke)" />
          : <g fill="var(--smoke)"><rect x="8" y="7.5" width="2" height="7" /><rect x="12" y="7.5" width="2" height="7" /></g>}
      </svg>
    </button>
  );
}

/* small recognizable line icon per stage — instant comprehension */
export function StageIcon({ name, size = 18 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'rep') return (<svg {...p}><path d="M3 9.5 L4 6 L20 6 L21 9.5" /><path d="M5 9.5 V20 H19 V9.5" /><path d="M10 20 V14 H14 V20" /></svg>);
  if (name === 'doors') return (<svg {...p}><rect x="6" y="3" width="12" height="18" rx="1" /><path d="M14 12 h0.01" /></svg>);
  if (name === 'map') return (<svg {...p}><path d="M12 22 s7-7 7-12a7 7 0 1 0-14 0 c0 5 7 12 7 12z" /><circle cx="12" cy="10" r="2.4" /></svg>);
  return (<svg {...p}><circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /><circle cx="12" cy="12" r="2" /><path d="M7.5 7.5 L10.5 10.5 M16.5 7.5 L13.5 10.5 M7.5 16.5 L10.5 13.5 M16.5 16.5 L13.5 13.5" /></svg>);
}

export default function FourStepModel() {
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { margin: '-15%' });
  const tabRefs = useRef([]);
  const [active, setActive] = useState(0);
  const [userTook, setUserTook] = useState(false);
  const [hovered, setHovered] = useState(false);

  const canHover = typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches;
  const auto = inView && !userTook && !hovered && !reduce && canHover;

  useEffect(() => {
    if (!auto) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % STAGES.length), DUR);
    return () => clearTimeout(id);
  }, [active, auto]);

  const go = (i) => { setActive(((i % STAGES.length) + STAGES.length) % STAGES.length); setUserTook(true); };
  const onKey = (e) => {
    let n = null;
    if (['ArrowDown', 'ArrowRight'].includes(e.key)) n = (active + 1) % STAGES.length;
    else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) n = (active - 1 + STAGES.length) % STAGES.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = STAGES.length - 1;
    if (n !== null) { e.preventDefault(); go(n); tabRefs.current[n]?.focus(); }
  };

  const cur = STAGES[active];

  return (
    <div ref={rootRef} className="grid lg:grid-cols-[minmax(300px,380px)_1fr] gap-8 lg:gap-14 items-start">
      {/* LEFT RAIL */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: 'var(--smoke)' }}>Stage {cur.n} / 04</span>
          <AutoRing active={active} auto={auto} paused={userTook} onToggle={() => setUserTook((t) => !t)} />
        </div>

        <div role="tablist" aria-orientation="vertical" aria-label="Rollout stages" onKeyDown={onKey} className="flex flex-col gap-1">
          {STAGES.map((s, i) => {
            const on = active === i;
            return (
              <button
                key={s.n} ref={(el) => (tabRefs.current[i] = el)} role="tab" id={`tab-${s.n}`}
                aria-selected={on} aria-controls={`panel-${s.n}`} tabIndex={on ? 0 : -1}
                onClick={() => go(i)}
                className="rollout-tab block w-full text-left px-4 py-3.5"
                style={{ cursor: 'pointer' }}
              >
                <div className="flex items-center gap-3">
                  <span className="stat-num" style={{ fontSize: 24, color: on ? 'var(--electric)' : 'var(--smoke)' }}>{s.n}</span>
                  <span style={{ color: on ? 'var(--electric)' : 'var(--smoke)', lineHeight: 0 }}><StageIcon name={s.visual} /></span>
                  <span className="text-lg flex-1" style={{ fontFamily: 'var(--font-display)', color: on ? 'var(--bone)' : 'var(--smoke)' }}>{s.title}</span>
                  <motion.span aria-hidden className="text-lg" style={{ color: 'var(--electric)' }}
                    animate={{ opacity: on ? 1 : 0, x: on ? 0 : -6 }} transition={{ duration: 0.3, ease: EXPO }}>→</motion.span>
                </div>
                <span className="block text-sm mt-1" style={{ color: 'var(--smoke)', paddingLeft: 58 }}>{s.teaser}</span>

                {/* mobile accordion */}
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      key="acc" className="lg:hidden overflow-hidden"
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.4, ease: EXPO }}
                    >
                      <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--smoke)' }}>{s.body}</p>
                      <div className="mt-4 rounded-xl overflow-hidden p-4 dot-grid" style={{ background: 'var(--graphite)', border: '1px solid var(--hair)' }}>
                        <StageGraphic visual={s.visual} reduce={reduce} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
        <p className="hidden lg:flex font-mono text-[10px] tracking-[0.15em] uppercase mt-4 px-4 items-center gap-2" style={{ color: 'var(--smoke)' }}>
          <span className="inline-block w-4 h-px" style={{ background: 'var(--electric)' }} />
          Click any stage to explore
        </p>
      </div>

      {/* RIGHT PANEL (desktop) */}
      <div className="hidden lg:block">
        <div
          role="tabpanel" id={`panel-${cur.n}`} aria-labelledby={`tab-${cur.n}`}
          className="relative rounded-2xl overflow-hidden dot-grid"
          style={{ border: '1px solid var(--hair)', background: 'var(--graphite)' }}
          onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        >
          <div className="relative flex items-center justify-center px-10 py-12" style={{ minHeight: 420 }}>
            <AnimatePresence>
              <motion.div
                key={active} className="absolute inset-0 flex items-center justify-center px-10"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: reduce ? 0 : 0.4, ease: EXPO }}
              >
                <StageGraphic visual={cur.visual} reduce={reduce} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between px-6 py-3" style={{ borderTop: '1px solid var(--hair-faint)' }}>
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase" style={{ color: 'var(--smoke)' }}>{cur.caption}</span>
            <div className="flex gap-1.5" style={{ width: 128 }}>
              {STAGES.map((_, i) => (
                <div key={i} className="h-[3px] flex-1 rounded-full overflow-hidden" style={{ background: 'var(--hair)' }}>
                  <motion.div className="h-full" style={{ background: 'var(--electric)' }} animate={{ width: active >= i ? '100%' : '0%' }} transition={{ duration: 0.4 }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.p
          key={active} className="text-base leading-relaxed mt-6 max-w-xl" style={{ color: 'var(--smoke)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 0.3 }}
        >
          {cur.body}
        </motion.p>
      </div>
    </div>
  );
}
