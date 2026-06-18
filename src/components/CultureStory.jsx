import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { FadeUp } from './AnimatedSection';
import CinematicImage from './CinematicImage';
import Odometer from './Odometer';
import { CULTURE } from '../data/media';

const EXPO = [0.16, 1, 0.3, 1];
const ROTATE_MS = 3800;

/* ============================================================
   TEAM CULTURE — "Built, not hired" (compact scroll story).

   One screen-tall stage: a value stepper on the left drives a large
   team photo on the right that crossfades the culture, value by value.
   It reveals on scroll, parallaxes gently, and auto-advances while in
   view (manual via the stepper). Warm, energetic, people-first — far
   shorter than a stack of full scenes. Reduced motion → static + nav.
   ============================================================ */

// CULTURE = [dinner1, beach1, ferriswheel, janetwater, thumbsup]
const VALUES = [
  { n: '01', title: 'Collaboration first', accent: 'one floor', line: 'We win side by side — one team, never alone.', photo: CULTURE[4], tone: 'var(--electric)' },
  { n: '02', title: 'Mentorship & growth', accent: 'rep → owner', line: 'A real path from the floor to ownership, coached the whole way.', photo: CULTURE[0], tone: 'var(--ember)' },
  { n: '03', title: 'People over numbers', accent: 'like family', line: 'Diverse voices, open doors, a team treated like family.', photo: CULTURE[1], tone: 'var(--electric)' },
  { n: '04', title: 'Recognition & rewards', accent: 'celebrated', line: 'Every win celebrated — loudly, and always together.', photo: CULTURE[2], tone: 'var(--ember)' },
];

export default function CultureStory() {
  const reduce = useReducedMotion();
  const n = VALUES.length;
  const [active, setActive] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.35 });

  useEffect(() => {
    if (reduce || engaged || !inView) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), ROTATE_MS);
    return () => clearInterval(id);
  }, [reduce, engaged, inView, n]);

  const pick = (i) => { setActive(i); setEngaged(true); };

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // spring-smooth the scroll value so the parallax glides with Lenis instead of stepping
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.4 });
  const photoY = useTransform(smooth, [0, 1], reduce ? ['0px', '0px'] : ['26px', '-26px']);

  const v = VALUES[active];

  return (
    <section ref={ref} className="pad-md paper relative overflow-hidden">
      {/* warm ambient energy */}
      <div aria-hidden="true" className="pointer-events-none absolute" style={{
        width: 'min(50vw, 620px)', height: 'min(50vw, 620px)', right: '-8%', top: '2%',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--ember) 16%, transparent), transparent 64%)', filter: 'blur(78px)',
      }} />
      <div aria-hidden="true" className="pointer-events-none absolute" style={{
        width: 'min(44vw, 560px)', height: 'min(44vw, 560px)', left: '-8%', bottom: '0%',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--electric) 13%, transparent), transparent 64%)', filter: 'blur(78px)',
      }} />

      <div className="shell relative">
        {/* ── compact header ── */}
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5 mb-10 md:mb-14">
          <div>
            <FadeUp><span className="eyebrow block mb-4">Team culture</span></FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="t-display-m" style={{ color: 'var(--bone)', maxWidth: '16ch' }}>
                <span className="d-caps">We don&apos;t hire a team. </span>
                <span className="d-ital" style={{ color: 'var(--electric)' }}>We build one.</span>
              </h2>
            </FadeUp>
          </div>
          <FadeUp delay={0.1}>
            <div className="flex items-center gap-5">
              <span className="inline-flex items-baseline gap-2">
                <span className="stat-num" style={{ fontSize: 'clamp(26px, 3vw, 38px)', lineHeight: 1, color: 'var(--electric)' }}><Odometer value="450+" /></span>
                <span className="font-mono" style={{ fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--smoke)' }}>on the floor</span>
              </span>
              <span aria-hidden="true" style={{ width: 1, height: 26, background: 'var(--hair)' }} />
              <span className="font-mono" style={{ fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                <span style={{ color: 'var(--ember)' }}>rep</span><span style={{ color: 'var(--smoke)' }}> → </span><span style={{ color: 'var(--electric)' }}>owner</span>
              </span>
            </div>
          </FadeUp>
        </div>

        {/* ── stage: stepper | photo ── */}
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-center">

          {/* LEFT — value stepper */}
          <FadeUp delay={0.12}>
            <ol className="relative" style={{ paddingLeft: 2 }}>
              <span aria-hidden="true" className="absolute" style={{ left: 14, top: 12, bottom: 12, width: 2, background: 'var(--hair)' }} />
              <motion.span
                aria-hidden="true" className="absolute" style={{ left: 14, top: 12, width: 2, background: 'linear-gradient(var(--electric), var(--ember))', borderRadius: 2, transformOrigin: 'top' }}
                initial={{ height: 0 }} animate={{ height: `calc((100% - 24px) * ${(active + 1) / n})` }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 22 }}
              />
              {VALUES.map((item, i) => {
                const on = active === i;
                return (
                  <li key={i}>
                    <button type="button" className="cult-step flex items-center gap-4" data-cursor="expand"
                      onMouseEnter={() => pick(i)} onFocus={() => pick(i)} onClick={() => pick(i)}
                      aria-current={on ? 'true' : undefined} aria-label={`${item.title}. ${item.line}`}
                      style={{ padding: 'clamp(12px, 1.5vw, 18px) 0' }}>
                      <span className="relative grid place-items-center shrink-0" style={{ width: 30, height: 26 }} aria-hidden="true">
                        {on && !reduce && (
                          <motion.span className="absolute rounded-full" style={{ width: 26, height: 26, border: '1px solid var(--ember)' }}
                            initial={{ scale: 0.6, opacity: 0.6 }} animate={{ scale: [0.7, 1.25], opacity: [0.6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }} />
                        )}
                        <motion.span className="rounded-full" animate={{ width: on ? 13 : 9, height: on ? 13 : 9, backgroundColor: on ? 'var(--ember)' : 'var(--hair)' }} transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 30 }} />
                      </span>
                      <span className="flex items-baseline gap-3 min-w-0">
                        <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: on ? 'var(--ember)' : 'var(--smoke)', transition: 'color 0.35s ease' }}>{item.n}</span>
                        <span className="cult-step-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.1, fontSize: 'clamp(20px, 2.2vw, 30px)', color: on ? 'var(--electric)' : 'var(--bone)', opacity: on ? 1 : 0.45 }}>{item.title}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </FadeUp>

          {/* RIGHT — crossfading photo stage */}
          <FadeUp delay={0.18}>
            <motion.div className="relative" style={{ y: reduce ? undefined : photoY }}>
              <div className="cult-frame" style={{ aspectRatio: '4 / 3' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active} className="absolute inset-0"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06, clipPath: 'inset(0 0 0 100%)' }}
                    animate={{ opacity: 1, scale: 1, clipPath: 'inset(0 0 0 0%)' }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                    transition={{ duration: 0.6, ease: EXPO }}
                  >
                    <CinematicImage src={v.photo} aspect="4/3" />
                  </motion.div>
                </AnimatePresence>

                <span className="cult-grad" aria-hidden="true" />

                {/* ghost number crossfades */}
                <AnimatePresence mode="wait">
                  <motion.span key={`num-${active}`} className="cult-num" aria-hidden="true"
                    initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EXPO }}>
                    {v.n}
                  </motion.span>
                </AnimatePresence>

                {/* active value caption on the photo */}
                <div className="absolute left-0 right-0 bottom-0 p-6 md:p-8" style={{ zIndex: 2 }}>
                  <AnimatePresence mode="wait">
                    <motion.div key={`cap-${active}`}
                      initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: EXPO }}>
                      <h3 className="t-display-s" style={{ fontFamily: 'var(--font-display)', color: '#F4F1EA', margin: 0, lineHeight: 1.1 }}>{v.title}</h3>
                      <p className="mt-2" style={{ color: 'rgba(244,241,234,0.82)', fontSize: 'clamp(14px, 1.3vw, 16px)', maxWidth: '40ch' }}>{v.line}</p>
                      <span className="d-ital inline-block mt-3" style={{ color: 'var(--electric)', fontSize: 15 }}>{v.accent}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* floating credential badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full px-3 py-1.5" style={{ background: 'rgba(10,12,12,0.5)', border: '1px solid rgba(244,241,234,0.18)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', zIndex: 2 }}>
                  <span aria-hidden="true" style={{ color: 'var(--ember)', fontSize: 13, lineHeight: 1 }}>★</span>
                  <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F4F1EA' }}>A+ BBB accredited</span>
                </div>

                {/* auto-advance beat */}
                <div className="absolute left-0 right-0 bottom-0" style={{ height: 3, background: 'rgba(244,241,234,0.18)', zIndex: 3 }}>
                  {!reduce && !engaged && inView && (
                    <motion.div key={active} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: ROTATE_MS / 1000, ease: 'linear' }} style={{ height: '100%', transformOrigin: 'left', background: 'linear-gradient(90deg, var(--electric), var(--ember))' }} />
                  )}
                </div>
              </div>
            </motion.div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
