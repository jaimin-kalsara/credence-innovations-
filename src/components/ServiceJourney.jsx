import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useInView, useReducedMotion } from 'framer-motion';
import Odometer from './Odometer';
import MagneticButton from './MagneticButton';

/* ServiceJourney — the Home › Services section as ONE continuous, scroll-driven
   graphic. A single ember token TRAVELS a rail and DRAWS it as it goes (it rides the
   leading edge of the line it is drawing); three bare points light the moment the
   token reaches them; one clear sentence headline + its single ember category label
   advance per act; the journey resolves into the real numbers and a CTA.
   Desktop = pinned scroll-scrub. Mobile / reduced-motion = a clean vertical timeline.

   Brand tokens only; hero untouched. One small uppercase label (the act category).
   No eyebrow, no station labels, no step numbers. The only perpetual loop is the
   token's soft pulse. */

const EXPO = [0.16, 1, 0.3, 1];

const ACTS = [
  { cat: 'Retail Activation', head: 'We put your brand on the floor.', line: "Trained brand reps inside Walmart, Target, Costco, Lowe's, and BJ's, face to face with your next customer." },
  { cat: 'National Rollout', head: 'We scale what works.', line: 'From one market to forty, the same brand experience and the same standard in every store.' },
  { cat: 'New Product Launch', head: 'We turn unknown into bought.', line: 'Education, demo, and trial at the exact moment a customer reaches the aisle.' },
];
const NODE_X = [20, 50, 80];      // station positions along the rail (%)
const REACH = [0.2, 0.5, 0.8];    // scroll progress at which the token reaches each station
const METRICS = [{ v: '40+', l: 'cities' }, { v: '211', l: 'campaigns' }, { v: '99%', l: 'U.S. reach' }];

/* clear, readable headline: sentence-case brand serif, key last word in accent
   italic of the SAME family (no all-caps, no font mixing) */
function ClearHead({ head, size }) {
  const parts = head.split(' ');
  const last = parts.pop();
  return (
    <h2 className={size} style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--bone)', margin: 0, lineHeight: 1.05 }}>
      {parts.length ? parts.join(' ') + ' ' : ''}
      <span className="d-ital" style={{ color: 'var(--electric)' }}>{last}</span>
    </h2>
  );
}

/* ───────────────────────── DESKTOP — pinned scroll-scrub ───────────────────────── */
function Pinned() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);
  const [lit, setLit] = useState(0);
  const [showNums, setShowNums] = useState(false);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive((p) => { const i = v < 0.34 ? 0 : v < 0.67 ? 1 : 2; return p === i ? p : i; });
    setLit((p) => { const n = REACH.filter((r) => v >= r).length; return p === n ? p : n; });
    setShowNums((s) => { const n = v > 0.82; return s === n ? s : n; });
  });

  // the token rides the leading edge of the rail it draws (rail scaleX = progress)
  const tokenLeft = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={ref} className="paper relative" style={{ height: '300vh' }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* atmosphere — one faint brand glow that drifts toward the active station so
            the airy canvas never feels empty (not a loop, not neon) */}
        <div aria-hidden className="absolute pointer-events-none" style={{
          left: `${20 + active * 30}%`, top: '46%', width: '60vw', height: '60vw',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, var(--glow-soft), transparent 60%)',
          transition: 'left 0.8s cubic-bezier(0.16,1,0.3,1)',
        }} />

        <div className="shell w-full relative">

          {/* the advancing act statement — single ember label + clear headline */}
          <div className="relative" style={{ minHeight: 'clamp(160px, 25vh, 252px)' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -26 }}
                transition={{ duration: 0.5, ease: EXPO }}
              >
                <p className="font-mono text-[11px] tracking-[0.22em] uppercase mb-4" style={{ color: 'var(--ember)' }}>{ACTS[active].cat}</p>
                <ClearHead head={ACTS[active].head} size="t-display-l" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* supporting line + CTA */}
          <div className="mt-7 flex flex-col gap-7 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="relative flex-1" style={{ minHeight: 62, maxWidth: '48ch' }}>
              <AnimatePresence mode="wait">
                <motion.p key={active} className="body-lg" style={{ color: 'var(--smoke)' }}
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.45, ease: EXPO }}>
                  {ACTS[active].line}
                </motion.p>
              </AnimatePresence>
            </div>
            <MagneticButton to="/what-we-do" className="shrink-0">See how we work</MagneticButton>
          </div>

          {/* the journey spine — a line the token draws, three bare points it lights */}
          <div className="relative mt-14 lg:mt-16" style={{ height: 28, marginInline: 13 }}>
            <div className="absolute" style={{ left: 0, right: 0, top: 13, height: 2, background: 'var(--hair)' }} />
            <motion.div className="absolute" style={{ left: 0, right: 0, top: 13, height: 2, background: 'var(--electric)', transformOrigin: 'left', scaleX: scrollYProgress }} />

            {NODE_X.map((x, i) => {
              const on = i < lit;
              return (
                <span key={i} className="absolute rounded-full" style={{
                  left: `${x}%`, top: 14, transform: 'translate(-50%, -50%)',
                  width: on ? 13 : 9, height: on ? 13 : 9,
                  background: on ? 'var(--electric)' : 'var(--graphite)',
                  border: `2px solid ${on ? 'var(--electric)' : 'var(--hair)'}`,
                  boxShadow: on ? '0 0 0 5px var(--brand-soft)' : 'none',
                  transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
                }} />
              );
            })}

            {/* travelling token — the one allowed perpetual loop (a soft pulse) */}
            <motion.div className="absolute" style={{ left: tokenLeft, top: 14, transform: 'translate(-50%, -50%)' }}>
              <span className="relative grid place-items-center" style={{ width: 24, height: 24 }}>
                <motion.span aria-hidden className="absolute rounded-full" style={{ width: 22, height: 22, background: 'var(--ember)' }}
                  animate={{ scale: [1, 2.1], opacity: [0.36, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }} />
                <span className="relative rounded-full" style={{ width: 18, height: 18, background: 'var(--ember)', boxShadow: '0 0 18px var(--glow-strong)' }} />
              </span>
            </motion.div>
          </div>

          {/* payoff numbers — mount and roll in, one by one, as the journey resolves */}
          <div className="mt-14" style={{ minHeight: 84 }}>
            <AnimatePresence>
              {showNums && (
                <motion.div key="nums" className="flex flex-wrap gap-x-14 gap-y-6" initial="h" animate="v" exit={{ opacity: 0, y: 12 }}>
                  {METRICS.map((m, i) => (
                    <motion.div key={m.l}
                      variants={{ h: { opacity: 0, y: 18 }, v: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.12, ease: EXPO } } }}>
                      <div className="stat-num leading-none" style={{ fontSize: 'clamp(28px, 3.2vw, 44px)' }}><Odometer value={m.v} /></div>
                      <p className="mt-2 text-[13px]" style={{ color: 'var(--smoke)' }}>{m.l}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ───────────────── MOBILE / reduced-motion — vertical timeline ───────────────── */
function TimelineAct({ a, last, reduce }) {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: '-70px' });
  const show = reduce || iv;
  return (
    <motion.div
      ref={ref} className="grid gap-5" style={{ gridTemplateColumns: '16px 1fr', paddingBottom: last ? 0 : 46 }}
      initial={reduce ? false : { opacity: 0, y: 22 }} animate={show ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EXPO }}
    >
      <div className="relative flex flex-col items-center">
        <span className="block rounded-full" style={{ width: 13, height: 13, background: 'var(--electric)', boxShadow: '0 0 0 5px var(--brand-soft)', marginTop: 6 }} />
        {!last && <span className="flex-1 mt-2" style={{ width: 2, background: 'var(--hair)' }} />}
      </div>
      <div style={{ marginTop: -2 }}>
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase mb-2" style={{ color: 'var(--ember)' }}>{a.cat}</p>
        <ClearHead head={a.head} size="t-display-s" />
        <p className="body mt-3" style={{ color: 'var(--smoke)', maxWidth: '42ch' }}>{a.line}</p>
      </div>
    </motion.div>
  );
}

function Timeline({ reduce }) {
  return (
    <section className="paper pad-lg">
      <div className="shell">
        <ClearHead head={'From the floor to the whole country.'} size="t-display-m" />
        <div className="mt-10">
          {ACTS.map((a, i) => <TimelineAct key={a.cat} a={a} last={i === ACTS.length - 1} reduce={reduce} />)}
        </div>
        <div className="mt-12 flex flex-wrap gap-x-12 gap-y-6">
          {METRICS.map((m) => (
            <div key={m.l}>
              <div className="stat-num leading-none" style={{ fontSize: 'clamp(28px, 7vw, 36px)' }}>{reduce ? m.v : <Odometer value={m.v} />}</div>
              <p className="mt-2 text-[13px]" style={{ color: 'var(--smoke)' }}>{m.l}</p>
            </div>
          ))}
        </div>
        <div className="mt-10"><MagneticButton to="/what-we-do">See how we work</MagneticButton></div>
      </div>
    </section>
  );
}

export default function ServiceJourney() {
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const upd = () => setWide(mq.matches);
    upd();
    mq.addEventListener('change', upd);
    return () => mq.removeEventListener('change', upd);
  }, []);

  if (reduce || !wide) return <Timeline reduce={reduce} />;
  return <Pinned />;
}
