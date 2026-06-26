import { useRef } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FadeUp } from './AnimatedSection';
import Odometer from './Odometer';

/* ============================================================
   THE RECORD — a live scoreboard.

   The static growth curve is gone. The record now reads like a live ops
   board: a pulsing LIVE marker, KPI tiles that count up — each carrying a
   MEANINGFUL mini-chart (sparkline, ring, bars, city dots, a 10-year
   timeline, a rep cluster) that animates in — and a scrolling live-
   activity ticker. It breathes, so the page feels alive, not static.
   Every motion is one-shot on view + the ticker; reduced motion shows a
   calm, static, fully readable board.
   ============================================================ */

const EXPO = [0.16, 1, 0.3, 1];

const STATS = [
  { value: '19,800+', label: 'Customers engaged', sub: 'Face to face', viz: 'spark', live: true },
  { value: '98%', label: 'Repeat partners', sub: 'They come back', viz: 'ring', accent: true },
  { value: '211', label: 'Campaigns executed', sub: 'Across four sectors', viz: 'bars' },
  { value: '40+', label: 'Cities nationwide', sub: 'Coast to coast', viz: 'dots' },
  { value: '10+', label: 'Years on the floor', sub: 'Since 2016', viz: 'timeline' },
  { value: '450+', label: 'Reps trained', sub: 'Built, not hired', viz: 'cluster' },
];

/* ---------- meaningful mini-charts ---------- */
function Viz({ type, live, reduce, accent }) {
  const col = accent ? 'var(--ember)' : 'var(--electric)';
  const on = live || reduce;
  const draw = (d = 0) => (reduce ? { duration: 0 } : { duration: 0.95, delay: 0.15 + d, ease: EXPO });
  const pop = (d = 0) => (reduce ? { duration: 0 } : { duration: 0.42, delay: 0.15 + d, ease: EXPO });

  if (type === 'spark') {
    const line = 'M3,42 C24,40 34,32 50,24 S84,9 117,4';
    return (
      <svg viewBox="0 0 120 48" width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="rk-spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={col} stopOpacity="0.30" />
            <stop offset="1" stopColor={col} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path d={`${line} L117,48 L3,48 Z`} fill="url(#rk-spark)" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: on ? 1 : 0 }} transition={draw(0.35)} />
        <motion.path d={line} fill="none" stroke={col} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: on ? 1 : 0 }} transition={draw()} />
        {!reduce && <motion.circle cx="117" cy="4" r="3" fill={col} animate={{ opacity: [1, 0.35, 1], scale: [1, 1.3, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />}
      </svg>
    );
  }
  if (type === 'ring') {
    // a 270° gauge — reads as a fill-meter, fills to 98%
    const arc = 'M13.8,40.5 A18,18 0 1 1 46.2,40.5';
    return (
      <svg viewBox="0 0 60 48" width="100%" height="100%" aria-hidden="true">
        <path d={arc} fill="none" stroke="var(--hair)" strokeWidth="4" strokeLinecap="round" />
        <motion.path d={arc} fill="none" stroke={col} strokeWidth="4" strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: on ? 0.98 : 0 }} transition={draw()} />
      </svg>
    );
  }
  if (type === 'bars') {
    const h = [0.26, 0.4, 0.33, 0.55, 0.46, 0.68, 0.6, 0.82, 1];
    return (
      <svg viewBox="0 0 120 48" width="100%" height="100%" aria-hidden="true">
        <defs>
          <linearGradient id="rk-bar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={col} />
            <stop offset="1" stopColor={col} stopOpacity="0.42" />
          </linearGradient>
        </defs>
        {h.map((v, i) => {
          const bh = 6 + v * 40;
          return (
            <motion.rect key={i} x={4 + i * 13} y={48 - bh} width="8" height={bh} rx="2.5" fill="url(#rk-bar)"
              initial={reduce ? false : { scaleY: 0 }} animate={{ scaleY: on ? 1 : 0 }} transition={pop(i * 0.06)}
              style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
          );
        })}
      </svg>
    );
  }
  if (type === 'dots') {
    // a coast-to-coast network: a hub linked out to cities
    const hub = [62, 22];
    const pts = [[10, 16], [20, 30], [30, 11], [40, 23], [50, 32], [56, 15], [74, 26], [80, 9], [90, 30], [98, 18], [18, 36], [44, 36], [88, 7], [34, 27]];
    return (
      <svg viewBox="0 0 110 48" width="100%" height="100%" aria-hidden="true">
        {pts.slice(0, 6).map((c, i) => (
          <motion.line key={'l' + i} x1={hub[0]} y1={hub[1]} x2={c[0]} y2={c[1]} stroke={col} strokeWidth="0.7" opacity="0.24"
            initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: on ? 1 : 0 }} transition={draw(0.1 + i * 0.04)} />
        ))}
        {pts.map((c, i) => (
          <motion.circle key={i} cx={c[0]} cy={c[1]} r="2" fill={col} initial={reduce ? false : { scale: 0, opacity: 0 }} animate={{ scale: on ? 1 : 0, opacity: on ? 0.85 : 0 }}
            transition={pop(i * 0.03)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
        ))}
        <motion.circle cx={hub[0]} cy={hub[1]} r="3.4" fill="var(--ember)" initial={reduce ? false : { scale: 0 }} animate={{ scale: on ? 1 : 0 }} transition={pop(0.12)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
        {!reduce && <motion.circle cx={hub[0]} cy={hub[1]} r="3.4" fill="none" stroke="var(--ember)" strokeWidth="1" animate={{ r: [3.4, 11], opacity: [0.55, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }} />}
      </svg>
    );
  }
  if (type === 'timeline') {
    return (
      <svg viewBox="0 0 120 48" width="100%" height="100%" aria-hidden="true">
        <line x1="6" y1="25" x2="114" y2="25" stroke="var(--hair)" strokeWidth="2" strokeLinecap="round" />
        <motion.line x1="6" y1="25" x2="114" y2="25" stroke={col} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: on ? 1 : 0 }} transition={draw()} />
        {[6, 33, 60, 87, 114].map((x, i) => (
          <circle key={i} cx={x} cy="25" r={i === 4 ? 3.6 : 2} fill={i === 4 ? 'var(--ember)' : 'var(--smoke)'} />
        ))}
        {!reduce && <motion.circle cx="114" cy="25" r="3.6" fill="none" stroke="var(--ember)" strokeWidth="1.2" animate={{ r: [3.6, 10], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }} />}
        <text x="6" y="44" className="font-mono" style={{ fill: 'var(--smoke)', fontSize: 8 }}>&apos;16</text>
        <text x="114" y="44" textAnchor="end" className="font-mono" style={{ fill: 'var(--ember)', fontSize: 8 }}>now</text>
      </svg>
    );
  }
  // cluster (reps) — a filled team grid with a few highlighted
  const cols = 16, rows = 3;
  const cells = Array.from({ length: cols * rows });
  return (
    <svg viewBox="0 0 120 48" width="100%" height="100%" aria-hidden="true">
      {cells.map((_, i) => {
        const cx = 5 + (i % cols) * (110 / (cols - 1));
        const cy = 11 + Math.floor(i / cols) * 13;
        const hot = i % 5 === 0;
        return (
          <motion.circle key={i} cx={cx} cy={cy} r={hot ? 2 : 1.5} fill={col} initial={reduce ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: on ? 1 : 0, opacity: on ? (hot ? 0.95 : 0.38) : 0 }} transition={pop(i * 0.012)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
        );
      })}
    </svg>
  );
}

export default function RecordSection() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="pad-md paper relative overflow-hidden">
      {/* ambient depth */}
      <div aria-hidden="true" className="pointer-events-none absolute" style={{
        width: 'min(58vw, 700px)', height: 'min(58vw, 700px)', right: '-8%', top: '4%',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--electric) 14%, transparent), transparent 64%)', filter: 'blur(74px)',
      }} />

      <div className="shell relative">
        {/* ── header ── */}
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 mb-9 md:mb-12">
          <div>
            <FadeUp>
              <span className="inline-flex items-center gap-2 mb-5">
                <span className="rec-livedot" aria-hidden="true" />
                <span className="font-mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ember)' }}>The record · Live</span>
              </span>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="t-display-l" style={{ color: 'var(--bone)', maxWidth: '16ch' }}>
                <span className="d-caps">Ten years on the floor. </span>
                <span className="d-ital" style={{ color: 'var(--electric)' }}>One standard.</span>
              </h2>
            </FadeUp>
          </div>
          <FadeUp delay={0.1}>
            <div className="flex flex-col items-start md:items-end gap-3">
              <span className="font-mono inline-flex items-center gap-2" style={{ fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--smoke)' }}>
                <span className="rec-livedot" aria-hidden="true" /> Updated in real time
              </span>
              <Link to="/about" className="tab-link" style={{ ['--tab']: 'var(--ember)' }}>
                See the full story <span className="arrow">→</span>
              </Link>
            </div>
          </FadeUp>
        </div>

        {/* ── the ledger — cardless rows, hairline dividers ── */}
        <div className="rec-ledger">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className={`rec-row group relative py-7 md:py-8 ${s.accent ? 'rec-row--accent' : ''}`}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: EXPO }}
            >
              {/* left accent tick (grows on hover) */}
              <span aria-hidden="true" className="rec-tick absolute left-0 top-1/2 -translate-y-1/2" style={{ width: 3, height: '52%', borderRadius: 3, background: s.accent ? 'var(--ember)' : 'var(--electric)' }} />

              {/* index */}
              <span className="rec-idx font-mono self-center" style={{ fontSize: 12, letterSpacing: '0.06em', color: 'var(--smoke)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* value */}
              <Odometer
                value={s.value}
                className={`rec-val stat-num ${s.accent ? 'rec-val--accent' : ''}`}
                style={{ fontSize: 'clamp(34px, 4.6vw, 60px)', color: s.accent ? 'var(--ember)' : 'var(--electric)' }}
              />

              {/* label + sub */}
              <div className="col-start-1 col-span-2 md:col-auto md:col-span-1">
                <p className="d-caps" style={{ fontSize: 'clamp(15px, 1.4vw, 19px)', letterSpacing: '0.005em', color: 'var(--bone)', lineHeight: 1.1 }}>{s.label}</p>
                <p className="font-mono mt-1.5 inline-flex items-center gap-2" style={{ fontSize: 9.5, letterSpacing: '0.13em', textTransform: 'uppercase', color: s.accent ? 'var(--ember)' : 'var(--smoke)', opacity: 0.95 }}>
                  {s.sub}
                  {s.live && <span className="rec-livedot" aria-hidden="true" />}
                </p>
              </div>

              {/* mini-chart */}
              <div className="rec-viz col-start-1 col-span-2 md:col-auto md:col-span-1 w-full md:justify-self-end" style={{ height: 46, maxWidth: 200 }}>
                <Viz type={s.viz} live={live} reduce={reduce} accent={s.accent} />
              </div>

              {/* animated bottom divider */}
              <motion.span
                aria-hidden="true"
                className="absolute left-0 right-0 bottom-0 origin-left"
                style={{ height: 1, background: 'var(--hair)' }}
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-70px' }}
                transition={{ duration: 0.9, delay: 0.12 + i * 0.06, ease: EXPO }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
