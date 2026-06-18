import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STAGES, StageIcon } from './FourStepModel';
import { FIELD, CREW } from '../data/media';

gsap.registerPlugin(ScrollTrigger);

const EXPO = [0.16, 1, 0.3, 1];

/* ============================================================
   ROLLOUT — "From one store to a nation" (cinematic scroll journey)

   What this section says: Credence's process is a single, momentum-
   building rollout. A brand starts on ONE store floor, gains a pass to
   the five biggest U.S. retailers, reaches 99% of the country, and then
   replicates the winning play city by city. The point isn't four
   disconnected steps — it's one route that compounds.

   So instead of a stepper of cards, the section is ONE growing route.
   As you scroll, the camera pins and a glowing journey-line draws across
   four milestones; a comet rides its head; each milestone activates and
   its scene assembles itself in real time (live in-store feed → the five
   retail doors → the U.S. coverage map → the replication grid). The
   background drifts in parallax and a scrubbed progress meter tracks the
   journey. Minimal words; the picture carries the meaning.

   Engine: GSAP ScrollTrigger drives every scroll-linked value (line
   fill, comet, node activation, parallax, progress) on a single scrubbed
   update — 60fps, no per-frame React renders (only the integer active
   stage is React state, so a scene swap happens ~4 times total). The pin
   itself is CSS `position: sticky` so it can never fight Lenis; we just
   sync ScrollTrigger to Lenis' scroll for frame-perfect scrubbing.

   Accessibility / reduced motion / mobile fall back to a calm, fully
   readable stacked layout — the scene graphics already carry role="img"
   descriptions, and the milestones are real jump buttons.
   ============================================================ */

// strong, energetic copy layered over the existing STAGES data
const SHORT = [
  { t: 'Market Entry', k: 'On the floor', line: 'We land your brand where buying actually happens.' },
  { t: 'Retail Access', k: 'Five doors', line: "One pass into Walmart, Target, Costco, Lowe's & BJ's." },
  { t: 'National Reach', k: 'Coast to coast', line: 'Ninety-nine percent of America — one network deep.' },
  { t: 'National Scale', k: 'Replication', line: 'What wins in one store, we run in hundreds.' },
];
// a real, energetic photo for each stage (shown in the glass screen)
const PHOTOS = [FIELD[8], FIELD[2], CREW[0], CREW[1]];

// milestone anchor points inside the 1000×200 rail viewBox (gently rising = growth)
const NODES = [
  { x: 70, y: 142 },
  { x: 372, y: 84 },
  { x: 662, y: 120 },
  { x: 940, y: 54 },
];
const RAIL_D = 'M70,142 C200,142 252,84 372,84 C492,84 560,120 662,120 C788,120 842,54 940,54';
// the line reaches the LAST dot at this scroll fraction; the remaining scroll is
// dwell time on the final stage (so stage 04 isn't a blink at the very bottom).
const COMPLETE = 0.82;

export default function RolloutScroll() {
  const reduce = useReducedMotion();

  // pin only where it pays off: desktop, a real pointer, motion allowed
  const [pinned, setPinned] = useState(
    () => typeof window !== 'undefined'
      && window.matchMedia('(min-width: 1024px)').matches
      && window.matchMedia('(hover: hover)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (hover: hover)');
    const upd = () => setPinned(mq.matches && !reduce);
    upd();
    mq.addEventListener('change', upd);
    return () => mq.removeEventListener('change', upd);
  }, [reduce]);

  const wrapRef = useRef(null);
  const pathRef = useRef(null);
  const fillRef = useRef(null);
  const glowRef = useRef(null);
  const cometRef = useRef(null);
  const nodeRefs = useRef([]);
  const blob1 = useRef(null);
  const blob2 = useRef(null);
  const pctRef = useRef(null);
  const hintRef = useRef(null);
  const lenRef = useRef(0);
  const nodeFracsRef = useRef([]);

  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  // ---- GSAP ScrollTrigger: one scrubbed update drives the whole scene ----
  useEffect(() => {
    if (!pinned || !wrapRef.current) return;

    const len = pathRef.current ? pathRef.current.getTotalLength() : 0;
    lenRef.current = len;
    if (fillRef.current) { fillRef.current.style.strokeDasharray = len; fillRef.current.style.strokeDashoffset = len; }
    if (glowRef.current) { glowRef.current.style.strokeDasharray = len; glowRef.current.style.strokeDashoffset = len; }

    // measure each milestone's true position ALONG the path (as a length fraction)
    // so the growing line head sits exactly on a dot at the moment its stage flips.
    const fracs = NODES.map((nd) => {
      let bestS = 0, bestD = Infinity;
      const step = Math.max(1, len / 800);
      for (let s = 0; s <= len; s += step) {
        const pt = pathRef.current.getPointAtLength(s);
        const d = (pt.x - nd.x) ** 2 + (pt.y - nd.y) ** 2;
        if (d < bestD) { bestD = d; bestS = s; }
      }
      return len ? bestS / len : 0;
    });
    nodeFracsRef.current = fracs;

    const draw = (p) => {
      const L = lenRef.current;
      // line completes at COMPLETE; the rest of the scroll is dwell on the last stage
      const fill = Math.min(1, p / COMPLETE);
      if (L && fillRef.current) {
        const off = L * (1 - fill);
        fillRef.current.style.strokeDashoffset = off;
        if (glowRef.current) glowRef.current.style.strokeDashoffset = off;
        if (pathRef.current && cometRef.current) {
          const pt = pathRef.current.getPointAtLength(L * fill);
          cometRef.current.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
          cometRef.current.style.opacity = fill > 0.004 ? 1 : 0;
        }
      }
      // a dot lights — and its stage flips — the instant the line head reaches it
      let idx = 0;
      nodeRefs.current.forEach((g, i) => {
        const f = nodeFracsRef.current[i] ?? i / (NODES.length - 1);
        const reached = fill >= f - 0.004;
        if (reached) idx = i;
        if (g) g.classList.toggle('rj-on', reached);
      });
      if (blob1.current) blob1.current.style.transform = `translate3d(${-fill * 70}px, ${fill * 36}px, 0)`;
      if (blob2.current) blob2.current.style.transform = `translate3d(${fill * 80}px, ${-fill * 28}px, 0)`;
      if (pctRef.current) pctRef.current.textContent = `${Math.round(fill * 100)}%`;
      if (hintRef.current) hintRef.current.style.opacity = p < 0.02 ? '1' : '0';

      if (idx !== activeRef.current) { activeRef.current = idx; setActive(idx); }
    };

    // ScrollTrigger.update is driven centrally (SmoothScroll) on Lenis scroll.
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => draw(self.progress),
        onRefresh: (self) => draw(self.progress),
      });
    }, wrapRef);

    draw(0);
    ScrollTrigger.refresh();

    return () => { ctx.revert(); };
  }, [pinned]);

  // click a milestone → glide to its slice of the pinned track
  const jumpTo = (i) => {
    const el = wrapRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const dist = el.offsetHeight - window.innerHeight;
    const frac = nodeFracsRef.current[i] ?? i / (NODES.length - 1);
    const y = top + Math.min(0.999, frac * COMPLETE + 0.012) * dist;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  /* ───────────────── MOBILE / reduced-motion : calm stacked stages ───────────────── */
  if (!pinned) {
    return (
      <div className="shell">
        <p className="font-mono text-[10px] tracking-[0.16em] uppercase mb-3 flex items-center gap-2" style={{ color: 'var(--smoke)' }}>
          <span style={{ color: 'var(--electric)' }}>↔</span> Swipe through the four stages
        </p>
        <div className="row-scroll pb-1">
          {STAGES.map((s, i) => (
            <div key={s.n} className="paper-card p-5" style={{ borderRadius: 16 }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="stat-num" style={{ fontSize: 24, color: 'var(--electric)' }}>{s.n}</span>
                <span style={{ color: 'var(--electric)', lineHeight: 0 }}><StageIcon name={s.visual} /></span>
                <h3 className="text-base" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)' }}>{SHORT[i].t}</h3>
              </div>
              <div className="relative rounded-xl overflow-hidden mb-3" style={{ border: '1px solid var(--hair)', background: 'var(--ink)' }}>
                <img src={PHOTOS[i]} alt={SHORT[i].t} loading="lazy" style={{ display: 'block', width: '100%', aspectRatio: '4 / 3', objectFit: 'cover' }} />
                <span aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(10,12,12,0.6))' }} />
              </div>
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase mb-2" style={{ color: 'var(--ember)' }}>{s.caption}</p>
              <p className="body-sm" style={{ color: 'var(--smoke)' }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ───────────────── DESKTOP : pinned cinematic journey ───────────────── */
  const cur = STAGES[active];
  const curShort = SHORT[active];
  const glow = active >= 3 ? 'var(--ember)' : 'var(--electric)';

  return (
    <div ref={wrapRef} className="relative" style={{ height: `${NODES.length * 52}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">

        {/* ── ambient parallax backdrop ── */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div ref={blob1} className="absolute rounded-full" style={{
            width: '46%', height: '64%', left: '4%', top: '6%', willChange: 'transform',
            background: 'radial-gradient(circle, color-mix(in srgb, var(--electric) 20%, transparent), transparent 65%)', filter: 'blur(70px)',
          }} />
          <div ref={blob2} className="absolute rounded-full" style={{
            width: '42%', height: '58%', right: '2%', bottom: '4%', willChange: 'transform',
            background: 'radial-gradient(circle, color-mix(in srgb, var(--ember) 16%, transparent), transparent 65%)', filter: 'blur(70px)',
          }} />
          <div className="absolute inset-0 dot-grid" style={{ opacity: 0.5 }} />
        </div>

        <div className="shell w-full relative" style={{ zIndex: 1 }}>

          {/* ── header ── */}
          <div className="flex items-center justify-between mb-6 xl:mb-9">
            <span className="font-mono inline-flex items-center gap-2.5" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--smoke)' }}>
              <span className="relative grid place-items-center" style={{ width: 12, height: 12 }}>
                <motion.span className="absolute rounded-full" style={{ width: 8, height: 8, background: 'var(--ember)' }}
                  animate={reduce ? {} : { scale: [1, 2.6], opacity: [0.5, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }} />
                <span className="relative rounded-full" style={{ width: 7, height: 7, background: 'var(--ember)' }} />
              </span>
              The rollout — live
            </span>
            <span className="font-mono inline-flex items-center gap-4" style={{ fontSize: 11, letterSpacing: '0.16em', color: 'var(--smoke)' }}>
              <span>Stage 0{active + 1} / 0{NODES.length}</span>
              <span ref={pctRef} style={{ color: 'var(--electric)', minWidth: 38, textAlign: 'right' }}>0%</span>
            </span>
          </div>

          {/* ── journey rail ── */}
          <div className="relative" style={{ marginBottom: 'clamp(56px, 7vh, 84px)' }}>
            <svg viewBox="0 0 1000 200" className="w-full" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
              {/* base track */}
              <path d={RAIL_D} fill="none" stroke="var(--hair)" strokeWidth="2" strokeLinecap="round" />
              {/* glow + crisp fill (drawn by scroll) */}
              <path ref={glowRef} d={RAIL_D} fill="none" stroke="var(--electric)" strokeWidth="7" strokeLinecap="round" style={{ opacity: 0.4, filter: 'blur(5px)' }} />
              <path ref={fillRef} d={RAIL_D} fill="none" stroke="var(--electric)" strokeWidth="2.5" strokeLinecap="round" />
              {/* the source path used for comet measurement (invisible) */}
              <path ref={pathRef} d={RAIL_D} fill="none" stroke="none" />

              {/* comet riding the head */}
              <g ref={cometRef} style={{ opacity: 0 }}>
                <circle r="16" fill="var(--electric)" style={{ opacity: 0.18, filter: 'blur(6px)' }} />
                <circle r="7" fill="var(--ember)" />
                <circle r="3" fill="#fff" style={{ opacity: 0.92 }} />
              </g>

              {/* milestone nodes */}
              {NODES.map((n, i) => (
                <g key={i} className="rj-node" ref={(el) => (nodeRefs.current[i] = el)}>
                  <circle className="rj-pulse" cx={n.x} cy={n.y} r="12" fill="none" stroke="var(--ember)" strokeWidth="1.4" />
                  <circle className="rj-ring" cx={n.x} cy={n.y} r="11" fill="var(--ink)" stroke="var(--electric)" strokeWidth="2" />
                  <circle className="rj-core" cx={n.x} cy={n.y} r="4" fill="var(--electric)" />
                </g>
              ))}
            </svg>

            {/* node labels (crisp HTML, aligned to node x%) */}
            {NODES.map((n, i) => {
              const on = i === active;
              return (
                <button
                  key={i}
                  onClick={() => jumpTo(i)}
                  data-cursor="expand"
                  aria-label={`Go to stage ${i + 1}: ${SHORT[i].t}`}
                  className="absolute text-center"
                  style={{
                    left: `${n.x / 10}%`, top: '100%', transform: 'translate(-50%, 14px)',
                    width: 132, cursor: 'pointer', background: 'none', border: 'none',
                  }}
                >
                  <span className="font-mono block" style={{ fontSize: 10, letterSpacing: '0.16em', color: on ? 'var(--ember)' : 'var(--smoke)', transition: 'color .4s ease' }}>
                    {STAGES[i].n}
                  </span>
                  <span className="block mt-1" style={{
                    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(13px, 1vw, 16px)', lineHeight: 1.1,
                    color: on ? 'var(--electric)' : 'var(--bone)', opacity: on ? 1 : 0.5, transition: 'color .4s ease, opacity .4s ease',
                  }}>
                    {SHORT[i].t}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── theater : text + self-building scene ── */}
          <div className="grid lg:grid-cols-[0.82fr_1.18fr] gap-8 xl:gap-14 items-center">

            {/* narrative (minimal) */}
            <div className="relative" style={{ minHeight: 200 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 18, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -18, filter: 'blur(6px)' }}
                  transition={{ duration: 0.5, ease: EXPO }}
                >
                  <span className="font-mono block mb-3" style={{ fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ember)' }}>
                    {curShort.k}
                  </span>
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="stat-num" style={{ fontSize: 'clamp(40px, 5vw, 68px)', lineHeight: 0.8 }}>{cur.n}</span>
                    <h3 className="t-display-m" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', margin: 0 }}>{curShort.t}</h3>
                  </div>
                  <p className="d-ital" style={{ color: 'var(--bone)', fontSize: 'clamp(19px, 2vw, 27px)', lineHeight: 1.28, maxWidth: '20ch' }}>
                    {curShort.line}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* scene panel — a floating glass screen that restages itself at each stop.
                Pointer position feeds --px/--py (-0.5..0.5) so the screen, its depth
                layers and the floating badges parallax at different rates. */}
            <div
              className="paper-card relative overflow-hidden dot-grid"
              style={{ borderRadius: 20 }}
              onPointerMove={(e) => {
                if (reduce) return;
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--px', (((e.clientX - r.left) / r.width) - 0.5).toFixed(3));
                e.currentTarget.style.setProperty('--py', (((e.clientY - r.top) / r.height) - 0.5).toFixed(3));
              }}
              onPointerLeave={(e) => { e.currentTarget.style.setProperty('--px', '0'); e.currentTarget.style.setProperty('--py', '0'); }}
            >
              {/* stage-tinted ambient glow — breathes, and drifts with the cursor */}
              <motion.div
                aria-hidden="true" className="absolute pointer-events-none rounded-full"
                style={{
                  width: '72%', height: '72%', left: '14%', top: '10%', zIndex: 0,
                  background: `radial-gradient(circle, color-mix(in srgb, ${glow} 26%, transparent), transparent 66%)`,
                  filter: 'blur(56px)',
                  transform: 'translate3d(calc(var(--px,0) * 44px), calc(var(--py,0) * 32px), 0)',
                  transition: 'transform 0.4s var(--ease-out-quart), background 0.6s ease',
                }}
                animate={reduce ? {} : { opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* ghost stage number (parallaxes opposite the cursor for depth) */}
              <span aria-hidden="true" className="d-caps" style={{
                position: 'absolute', right: 18, top: -10, fontSize: 'clamp(120px, 15vw, 220px)', lineHeight: 0.8,
                color: 'transparent', WebkitTextStroke: '1px var(--hair)', pointerEvents: 'none', userSelect: 'none', zIndex: 1,
                transform: 'translate3d(calc(var(--px,0) * -16px), calc(var(--py,0) * -12px), 0)', transition: 'transform 0.4s var(--ease-out-quart)',
              }}>{cur.n}</span>

              {/* blueprint corner ticks */}
              {['tl', 'tr', 'bl', 'br'].map((c) => (
                <span key={c} aria-hidden="true" className="absolute" style={{
                  width: 13, height: 13, zIndex: 1, opacity: 0.5,
                  [c[0] === 't' ? 'top' : 'bottom']: 14,
                  [c[1] === 'l' ? 'left' : 'right']: 14,
                  borderTop: c[0] === 't' ? '1px solid var(--hair)' : 'none',
                  borderBottom: c[0] === 'b' ? '1px solid var(--hair)' : 'none',
                  borderLeft: c[1] === 'l' ? '1px solid var(--hair)' : 'none',
                  borderRight: c[1] === 'r' ? '1px solid var(--hair)' : 'none',
                }} />
              ))}

              {/* theater — perspective stage for the floating screen */}
              <div className="relative flex items-center justify-center" style={{ minHeight: 'clamp(330px, 44vh, 460px)', zIndex: 2, padding: 'clamp(26px, 3.4vw, 48px)', perspective: '1200px' }}>

                {/* depth echo panel behind the screen */}
                <div aria-hidden="true" className="absolute rounded-2xl" style={{
                  inset: '16%', zIndex: 0, border: '1px solid var(--hair-faint)',
                  background: 'color-mix(in srgb, var(--graphite) 35%, transparent)',
                  transform: 'translate3d(calc(var(--px,0) * -20px), calc(var(--py,0) * -15px), 0)',
                  transition: 'transform 0.4s var(--ease-out-quart)',
                }} />

                {/* the floating glass screen — the frame persists (revealed once);
                    only the scene inside restages, so infinite in-scene animations
                    never stall a mode="wait" hand-off. */}
                <motion.div
                  className="relative w-full"
                  style={{ maxWidth: 480, zIndex: 2, transformStyle: 'preserve-3d' }}
                  initial={reduce ? false : { opacity: 0, y: 26, rotateX: 7, filter: 'blur(10px)' }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: EXPO }}
                >
                  <div
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                      background: 'var(--ink)',
                      border: '1px solid var(--hair)',
                      boxShadow: '0 1px 0 rgba(255,255,255,0.35) inset, 0 34px 80px -36px var(--shadow-card)',
                      transform: reduce ? undefined : 'rotateY(calc(var(--px,0) * -7deg)) rotateX(calc(var(--py,0) * 7deg))',
                      transformStyle: 'preserve-3d', transition: 'transform 0.4s var(--ease-out-quart)',
                    }}
                  >
                    {/* energetic photo viewport — crossfades + a slow ken-burns per stage */}
                    <div className="relative" style={{ aspectRatio: '4 / 3' }}>
                      <AnimatePresence>
                        <motion.img
                          key={active}
                          src={PHOTOS[active]}
                          alt={curShort.t}
                          loading="eager"
                          className="absolute inset-0 w-full h-full"
                          style={{ objectFit: 'cover', filter: 'saturate(1.04) contrast(1.03)' }}
                          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.0 }}
                          animate={{ opacity: 1, scale: reduce ? 1 : 1.09 }}
                          exit={{ opacity: 0 }}
                          transition={{ opacity: { duration: 0.7, ease: EXPO }, scale: { duration: 7.5, ease: 'linear' } }}
                        />
                      </AnimatePresence>

                      {/* cinematic grade for depth + legibility */}
                      <span aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(10,12,12,0.12) 0%, transparent 34%, rgba(10,12,12,0.55) 70%, rgba(10,12,12,0.85) 100%)' }} />

                      {/* caption */}
                      <div className="absolute left-0 right-0 bottom-0" style={{ padding: 'clamp(16px, 2vw, 24px)' }}>
                        <AnimatePresence mode="wait">
                          <motion.span key={active} className="font-mono block" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#F4F1EA' }}
                            initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease: EXPO }}>
                            {cur.caption}
                          </motion.span>
                        </AnimatePresence>
                      </div>

                      {/* light sweep on change */}
                      {!reduce && (
                        <motion.span
                          key={`sweep-${active}`} aria-hidden="true" className="absolute inset-0 pointer-events-none"
                          initial={{ x: '-120%' }} animate={{ x: '130%' }} transition={{ duration: 1, ease: EXPO }}
                          style={{ background: 'linear-gradient(105deg, transparent 38%, rgba(244,241,234,0.22) 50%, transparent 62%)' }}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* floating glass badge — top-left, shallow depth (a "live" kicker) */}
                <div aria-hidden="true" className="absolute" style={{
                  top: '8%', left: '5%', zIndex: 3,
                  transform: 'translate3d(calc(var(--px,0) * -32px), calc(var(--py,0) * -24px), 0)', transition: 'transform 0.35s var(--ease-out-quart)',
                }}>
                  <motion.div animate={reduce ? {} : { y: [0, -6, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
                    <AnimatePresence mode="wait">
                      <motion.div key={active}
                        initial={reduce ? false : { opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4, ease: EXPO }}
                        className="flex items-center gap-2 rounded-full px-3 py-1.5"
                        style={{ background: 'color-mix(in srgb, var(--graphite) 75%, transparent)', border: '1px solid var(--hair)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', boxShadow: '0 12px 28px -18px var(--shadow-card)' }}>
                        <span className="relative grid place-items-center" style={{ width: 8, height: 8 }}>
                          <motion.span className="absolute rounded-full" style={{ width: 6, height: 6, background: 'var(--ember)' }} animate={reduce ? {} : { scale: [1, 2.4], opacity: [0.5, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }} />
                          <span className="relative rounded-full" style={{ width: 5, height: 5, background: 'var(--ember)' }} />
                        </span>
                        <span className="font-mono" style={{ fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--bone)' }}>{curShort.k}</span>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* floating glass badge — bottom-right, deeper (the stage label) */}
                <div aria-hidden="true" className="absolute" style={{
                  bottom: '9%', right: '6%', zIndex: 3,
                  transform: 'translate3d(calc(var(--px,0) * 26px), calc(var(--py,0) * 20px), 0)', transition: 'transform 0.35s var(--ease-out-quart)',
                }}>
                  <motion.div animate={reduce ? {} : { y: [0, 7, 0] }} transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}>
                    <AnimatePresence mode="wait">
                      <motion.div key={active}
                        initial={reduce ? false : { opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4, ease: EXPO }}
                        className="flex items-center gap-2 rounded-xl px-3 py-2"
                        style={{ background: 'color-mix(in srgb, var(--graphite) 75%, transparent)', border: '1px solid var(--hair)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', boxShadow: '0 12px 28px -18px var(--shadow-card)', color: 'var(--electric)' }}>
                        <StageIcon name={cur.visual} size={16} />
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: 'var(--bone)' }}>{curShort.t}</span>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>

              {/* caption + segmented progress */}
              <div className="relative flex items-center justify-between px-6 py-3" style={{ borderTop: '1px solid var(--hair-faint)', zIndex: 2 }}>
                <AnimatePresence mode="wait">
                  <motion.span key={active} className="font-mono text-[10px] tracking-[0.15em] uppercase" style={{ color: 'var(--smoke)' }}
                    initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
                    {cur.caption}
                  </motion.span>
                </AnimatePresence>
                <div className="flex gap-1.5" style={{ width: 128 }}>
                  {NODES.map((_, i) => (
                    <div key={i} className="h-[3px] flex-1 rounded-full" style={{ background: i <= active ? 'var(--electric)' : 'var(--hair)', transition: 'background-color 0.4s ease' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* scroll hint (fades after the journey begins) */}
          <p ref={hintRef} className="font-mono mt-8 flex items-center gap-2" style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--smoke)', transition: 'opacity .5s ease' }}>
            <motion.span style={{ color: 'var(--electric)', display: 'inline-block' }} animate={reduce ? {} : { y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>↓</motion.span>
            Scroll to watch the rollout build
          </p>
        </div>
      </div>
    </div>
  );
}
