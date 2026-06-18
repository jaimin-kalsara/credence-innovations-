import { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FadeUp } from './AnimatedSection';
import MagneticButton from './MagneticButton';
import Odometer from './Odometer';
import { FIELD } from '../data/media';

gsap.registerPlugin(ScrollTrigger);
const EXPO = [0.16, 1, 0.3, 1];

/* ============================================================
   IN THE FIELD — a scroll-built editorial masonry.

   Not a gallery: as you scroll the section, a featured moment opens,
   then a varied masonry assembles itself — each card unfolds with a
   clip-reveal (never a plain fade), and every card parallaxes at its
   OWN speed (big cards drift slow, small cards fast) for layered depth.
   A cursor-follow glow lights the wall, cards tilt + zoom on hover, a
   stat counts up on the feature, and a scroll rail tracks progress.

   Engine: GSAP ScrollTrigger (scrubbed, synced to Lenis) drives the
   per-card parallax + progress on one update — transforms only, 60fps,
   zero per-frame React. Framer handles the one-shot reveals. Reduced
   motion → a calm, static, fully-readable wall.
   ============================================================ */

const FEATURE = {
  src: FIELD[8], cat: 'On the floor', cap: 'Where the buying decision actually happens',
  stat: '40+', statLabel: 'cities, coast to coast', status: 'Live',
};

// curated wall — varied aspects + parallax speeds so no two cards move alike
const WALL = [
  { src: FIELD[0], cat: 'Retail activation', cap: 'Doors open', aspect: '3/4', speed: 96, status: 'Live' },
  { src: FIELD[2], cat: 'Market launch', cap: 'A new city, day one', aspect: '4/3', speed: 38 },
  { src: FIELD[5], cat: 'Team training', cap: 'The morning brief', aspect: '1/1', speed: 70 },
  { src: FIELD[1], cat: 'Brand demo', cap: 'In the aisle', aspect: '4/5', speed: 52 },
  { src: FIELD[10], cat: 'Field day', cap: 'Game time', aspect: '3/4', speed: 104, status: 'Live' },
  { src: FIELD[3], cat: 'On the road', cap: 'Setting up shop', aspect: '4/3', speed: 30 },
  { src: FIELD[12], cat: 'Retail activation', cap: 'Floor walk', aspect: '1/1', speed: 84 },
  { src: FIELD[6], cat: 'Recognition', cap: 'Wrap-up huddle', aspect: '4/5', speed: 46, status: 'Wrapped' },
  { src: FIELD[11], cat: 'Brand demo', cap: 'Eye to eye', aspect: '3/4', speed: 92 },
  { src: FIELD[4], cat: 'Market launch', cap: 'Hands on', aspect: '4/3', speed: 36 },
  { src: FIELD[13], cat: 'Team training', cap: 'One standard', aspect: '1/1', speed: 78 },
  { src: FIELD[7], cat: 'On the floor', cap: 'Every conversation counts', aspect: '4/5', speed: 58 },
];

function Card({ item }) {
  const tilt = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--rx', `${((e.clientX - r.left) / r.width - 0.5) * 9}deg`);
    el.style.setProperty('--ry', `${-((e.clientY - r.top) / r.height - 0.5) * 9}deg`);
  };
  const reset = (e) => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg'); };

  return (
    <div className="fc-reveal">
      <article className="fc-card" data-cursor="expand" onPointerMove={tilt} onPointerLeave={reset}>
        <div className="fc-media" style={{ aspectRatio: item.aspect }}>
          <img src={item.src} alt={`Credence in the field — ${item.cap}`} loading="lazy" className="fc-img" />
          <span className="fc-grad" aria-hidden="true" />

          {/* top row — category + status */}
          <div className="fc-top">
            <span className="fc-chip">{item.cat}</span>
            {item.status && (
              <span className="fc-status">
                <span className={`fc-dot ${item.status === 'Live' ? 'is-live' : ''}`} />
                {item.status}
              </span>
            )}
          </div>

          {/* bottom — caption (reveals on hover) */}
          <div className="fc-cap">
            <p className="fc-cap-text">{item.cap}</p>
          </div>
        </div>
      </article>
    </div>
  );
}

// per-column parallax speeds (px of drift across the section) — no two alike
const COL_SPEEDS = { 3: [28, 74, 46], 2: [30, 66], 1: [0] };

export default function FieldScroll() {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const progressRef = useRef(null);
  const featRef = useRef(null);
  const featIn = useInView(featRef, { once: true, amount: 0.12 });
  const [featReady, setFeatReady] = useState(false);
  const featReadyRef = useRef(false);
  const revealed = featIn || featReady;

  // responsive column count (manual columns → clean per-column parallax)
  const [cols, setCols] = useState(() => {
    if (typeof window === 'undefined') return 3;
    if (window.matchMedia('(min-width: 1024px)').matches) return 3;
    if (window.matchMedia('(min-width: 640px)').matches) return 2;
    return 1;
  });
  useEffect(() => {
    const calc = () => setCols(
      window.matchMedia('(min-width: 1024px)').matches ? 3
        : window.matchMedia('(min-width: 640px)').matches ? 2 : 1,
    );
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // distribute the wall round-robin across the active columns
  const columns = Array.from({ length: cols }, () => []);
  WALL.forEach((item, i) => columns[i % cols].push(item));
  const speeds = COL_SPEEDS[cols] || COL_SPEEDS[3];

  // cursor-follow glow
  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--gx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--gy', `${e.clientY - r.top}px`);
  };

  // GSAP: per-column parallax + section progress (ScrollTrigger.update is driven
  // centrally on Lenis scroll — see SmoothScroll — so we don't add our own listener)
  useEffect(() => {
    if (reduce || !sectionRef.current) return;
    const cards = gsap.utils.toArray(sectionRef.current.querySelectorAll('[data-speed]'));
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          for (const el of cards) {
            const s = parseFloat(el.dataset.speed) || 0;
            el.style.transform = `translate3d(0, ${(p - 0.5) * s}px, 0)`;
          }
          if (progressRef.current) progressRef.current.style.transform = `scaleY(${p})`;
          if (!featReadyRef.current && p > 0.015) { featReadyRef.current = true; setFeatReady(true); }
        },
      });

      // each card unfolds (clip-reveal) as it enters — GSAP batch, reliable + staggered
      ScrollTrigger.batch(sectionRef.current.querySelectorAll('.fc-reveal'), {
        start: 'top 92%',
        once: true,
        onEnter: (els) => els.forEach((el, i) => gsap.delayedCall(0.06 * i, () => el.classList.add('is-in'))),
      });
    }, sectionRef);
    ScrollTrigger.refresh();
    return () => { ctx.revert(); cards.forEach((el) => { el.style.transform = ''; }); };
  }, [reduce, cols]);

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      className="paper relative overflow-hidden pad-lg"
      style={{ background: 'var(--ink)' }}
      onPointerMove={onMove}
    >
      {/* ambient depth */}
      <div aria-hidden="true" className="pointer-events-none absolute" style={{
        width: 'min(60vw, 760px)', height: 'min(60vw, 760px)', left: '-8%', top: '8%',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--electric) 16%, transparent), transparent 64%)', filter: 'blur(80px)',
      }} />
      {/* cursor-follow glow */}
      {!reduce && <div className="fc-cursor-glow" aria-hidden="true" />}

      {/* scroll progress rail */}
      <div aria-hidden="true" className="hidden lg:block absolute" style={{ right: 'clamp(16px, 2vw, 34px)', top: '18%', bottom: '18%', width: 2, background: 'var(--hair)', borderRadius: 2, zIndex: 3 }}>
        <div ref={progressRef} style={{ width: '100%', height: '100%', transformOrigin: 'top', transform: 'scaleY(0)', background: 'linear-gradient(var(--electric), var(--ember))', borderRadius: 2 }} />
      </div>

      <div className="shell relative" style={{ zIndex: 2 }}>
        {/* header */}
        <FadeUp><span className="eyebrow block mb-5">In the field</span></FadeUp>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 mb-10 md:mb-14">
          <FadeUp delay={0.05}>
            <h2 className="t-display-l" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', maxWidth: '15ch' }}>
              The work happens <span className="d-ital" style={{ color: 'var(--electric)' }}>in person.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="font-mono" style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--smoke)', maxWidth: '26ch' }}>
              Real reps, real floors, real conversations — a year of work, scrolled.
            </p>
          </FadeUp>
        </div>

        {/* ── Scene 1 — featured moment (useInView for a rock-solid reveal) ── */}
        <motion.div
          ref={featRef}
          initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
          animate={reduce ? undefined : { clipPath: revealed ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)', opacity: revealed ? 1 : 0 }}
          transition={{ duration: 1, ease: EXPO }}
        >
          <article className="fc-card fc-feature" data-cursor="expand">
            <div className="fc-media" style={{ aspectRatio: '21 / 9' }}>
              <img src={FEATURE.src} alt={`Credence in the field — ${FEATURE.cap}`} loading="eager" className="fc-img" />
              <span className="fc-grad fc-grad--strong" aria-hidden="true" />

              <div className="fc-top">
                <span className="fc-chip">{FEATURE.cat}</span>
                <span className="fc-status"><span className="fc-dot is-live" />{FEATURE.status}</span>
              </div>

              <div className="absolute left-0 right-0 bottom-0 p-6 md:p-9 flex flex-wrap items-end justify-between gap-6">
                <h3 className="t-display-m" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', maxWidth: '18ch', margin: 0 }}>
                  {FEATURE.cap}
                </h3>
                <div className="text-right shrink-0">
                  <Odometer value={FEATURE.stat} className="stat-num" style={{ fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1, color: 'var(--electric)' }} />
                  <p className="font-mono mt-1" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--smoke)' }}>{FEATURE.statLabel}</p>
                </div>
              </div>
            </div>
          </article>
        </motion.div>

        {/* ── Scenes 2–6 — the masonry builds; each column parallaxes at its own speed ── */}
        <div className="fc-cols mt-5 md:mt-6">
          {columns.map((colItems, ci) => (
            <div key={ci} className="fc-col" data-speed={reduce ? 0 : speeds[ci] || 0}>
              {colItems.map((item, i) => (
                <div key={item.src + i} className="fc-cell">
                  <Card item={item} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── Scene 7 — CTA ── */}
        <FadeUp>
          <div className="mt-14 md:mt-20 flex flex-col items-center text-center gap-6">
            <p className="t-display-s" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--bone)', maxWidth: '20ch' }}>
              This is what a launch looks like up close.
            </p>
            <MagneticButton to="/contact">Bring us to your floor</MagneticButton>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
