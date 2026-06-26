import { useRef, useState, useEffect } from 'react';
import {
  motion, AnimatePresence, useReducedMotion,
  useInView, useScroll, useTransform, useSpring, useMotionValue,
} from 'framer-motion';
import Odometer from './Odometer';
import { CULTURE } from '../data/media';

const EXPO = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 140, damping: 22, mass: 1 };
const ROTATE_MS = 4200;

/* ============================================================================
   TEAM CULTURE — "We don't hire a team. We build one."

   A non-boxy "culture constellation": the active value drives a large,
   soft-feathered photo that crossfades value-by-value, layered over a
   tilted ambient memory and a ghost number. Depth parallax, cursor-reactive
   drift, idle float, sparkles and a refined value rail with a live timer.
   Auto-advances while in view; the rail takes over on interaction.
   Scroll-triggered, theme-adaptive, reduced-motion aware. No GSAP.
============================================================================ */

// CULTURE = [dinner1, beach1, ferriswheel, janetwater, thumbsup]
const VALUES = [
  { n: '01', title: 'Collaboration first', accent: 'one floor', line: 'We win side by side — one team, never alone.', photo: CULTURE[4] },
  { n: '02', title: 'Mentorship & growth', accent: 'rep → owner', line: 'A real path from the floor to ownership, coached the whole way.', photo: CULTURE[0] },
  { n: '03', title: 'People over numbers', accent: 'like family', line: 'Diverse voices, open doors, a team treated like family.', photo: CULTURE[1] },
  { n: '04', title: 'Recognition & rewards', accent: 'celebrated', line: 'Every win celebrated — loudly, and always together.', photo: CULTURE[2] },
];
const AMBIENT = CULTURE[3]; // janetwater — never an active value, pure depth

export default function CultureStory() {
  const reduce = useReducedMotion();
  const n = VALUES.length;
  const [active, setActive] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { amount: 0.3 });
  const [entered, setEntered] = useState(false);
  useEffect(() => { if (inView) setEntered(true); }, [inView]);
  useEffect(() => {
    const id = setTimeout(() => { const el = sectionRef.current; if (!el) return; const r = el.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) setEntered(true); }, 800);
    return () => clearTimeout(id);
  }, []);

  // auto-advance while in view, until the visitor takes over
  useEffect(() => {
    if (reduce || engaged || !inView) return undefined;
    const id = setInterval(() => setActive((a) => (a + 1) % n), ROTATE_MS);
    return () => clearInterval(id);
  }, [reduce, engaged, inView, n]);
  const pick = (i) => { setActive(i); setEngaged(true); };

  // scroll parallax — every layer at its own rate
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.4 });
  const mainY = useTransform(smooth, [0, 1], reduce ? ['0px', '0px'] : ['64px', '-68px']);
  const backY = useTransform(smooth, [0, 1], reduce ? ['0px', '0px'] : ['-54px', '74px']);
  const numY = useTransform(smooth, [0, 1], reduce ? ['0px', '0px'] : ['84px', '-84px']);
  // scroll-linked Ken Burns — the main memory slowly settles as you scroll through
  const mainScale = useTransform(smooth, [0, 1], reduce ? [1, 1] : [1.07, 0.95]);
  const backScale = useTransform(smooth, [0, 1], reduce ? [1, 1] : [0.96, 1.05]);

  // cursor-reactive depth drift on the stage
  const mx = useMotionValue(0.5); const my = useMotionValue(0.5);
  const cmx = useSpring(useTransform(mx, [0, 1], [-14, 14]), SPRING);
  const cbx = useSpring(useTransform(mx, [0, 1], [12, -12]), SPRING);
  const onMove = (e) => { if (reduce) return; const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height); };
  const onLeave = () => { mx.set(0.5); my.set(0.5); };

  const v = VALUES[active];
  const reveal = (delay = 0, y = 22) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y, filter: 'blur(5px)' },
    animate: entered ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {},
    transition: { duration: 0.7, delay, ease: EXPO },
  });

  return (
    <section ref={sectionRef} className="cs-section paper relative overflow-hidden pad-lg" aria-label="Team culture">
      <style>{`
        .cs-section { isolation: isolate; background-color: var(--ink); }
        .cs-bg { display: none; position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .cs-orb { position: absolute; border-radius: 50%; filter: blur(94px); }
        .cs-orb-1 { width: 38vw; max-width: 560px; aspect-ratio: 1; right: -8%; top: -6%; background: radial-gradient(circle, color-mix(in srgb, var(--ember) 14%, transparent), transparent 64%); }
        .cs-orb-2 { width: 34vw; max-width: 480px; aspect-ratio: 1; left: -10%; bottom: -10%; background: radial-gradient(circle, color-mix(in srgb, var(--electric) 13%, transparent), transparent 64%); }
        .cs-grain { position: absolute; inset: 0; opacity: 0.035; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 140px 140px; }

        .cs-inner { position: relative; z-index: 2; }

        /* header */
        .cs-eyebrow { display: inline-flex; align-items: center; gap: 9px; padding: 7px 15px; border-radius: 999px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--bone);
          background: color-mix(in srgb, var(--graphite) 52%, transparent); border: 1px solid color-mix(in srgb, var(--ember) 26%, var(--hair)); }
        .cs-eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ember); box-shadow: 0 0 10px var(--ember); }
        .cs-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 20px 40px; margin-top: clamp(16px, 1.8vw, 22px); }
        .cs-title { font-family: var(--font-display); color: var(--bone); line-height: 1.02; letter-spacing: -0.02em; font-size: clamp(30px, 4vw, 56px); max-width: 15ch; }
        .cs-title .ln { display: block; overflow: hidden; padding-bottom: 0.06em; }
        .cs-title .ln > span { display: inline-block; will-change: transform; }
        .cs-ital { font-style: italic; font-weight: 500;
          background: linear-gradient(100deg, var(--electric), #6FB6D9 55%, var(--electric)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: var(--electric); }
        .cs-stat { display: inline-flex; align-items: center; gap: 16px; padding-bottom: 6px; }
        .cs-stat-n { font-family: var(--font-display); font-weight: 600; font-size: clamp(26px, 3vw, 40px); line-height: 1; color: var(--electric); }
        .cs-stat-l { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--smoke); }
        .cs-stat-sep { width: 1px; height: 28px; background: var(--hair); }
        .cs-stat-flow { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; }

        /* stage */
        .cs-grid { display: grid; grid-template-columns: 1fr; gap: clamp(44px, 5vw, 60px); margin-top: clamp(38px, 4.6vw, 60px); align-items: center; }
        @media (min-width: 1024px) { .cs-grid { grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr); column-gap: clamp(48px, 5vw, 88px); } }

        /* value rail */
        .cs-rail { position: relative; padding-left: 26px; }
        .cs-rail-track { position: absolute; left: 6px; top: 10px; bottom: 10px; width: 2px; background: var(--hair); border-radius: 2px; }
        .cs-rail-fill { position: absolute; left: 6px; top: 10px; width: 2px; border-radius: 2px; transform-origin: top;
          background: linear-gradient(var(--electric), var(--ember)); }
        .cs-step { position: relative; display: block; width: 100%; text-align: left; padding: clamp(12px, 1.5vw, 17px) 0; cursor: pointer; -webkit-tap-highlight-color: transparent; }
        .cs-step-dot { position: absolute; left: -26px; top: 50%; width: 14px; height: 14px; margin-top: -7px; }
        .cs-step-dot .core { position: absolute; inset: 0; margin: auto; border-radius: 50%; background: var(--hair); transition: all .4s var(--ease-out-expo); width: 9px; height: 9px; }
        .cs-step[data-on="true"] .cs-step-dot .core { width: 14px; height: 14px; background: var(--ember); box-shadow: 0 0 0 4px color-mix(in srgb, var(--ember) 16%, transparent); }
        .cs-step-ring { position: absolute; inset: 0; margin: auto; width: 14px; height: 14px; border-radius: 50%; border: 1px solid var(--ember); }
        .cs-step-row { display: flex; align-items: baseline; gap: 12px; }
        .cs-step-n { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.14em; color: var(--smoke); transition: color .35s ease; }
        .cs-step[data-on="true"] .cs-step-n { color: var(--ember); }
        .cs-step-t { font-family: var(--font-display); font-weight: 600; letter-spacing: -0.01em; line-height: 1.08; font-size: clamp(20px, 2.1vw, 29px);
          color: var(--bone); opacity: 0.42; transition: color .4s ease, opacity .4s ease; }
        .cs-step[data-on="true"] .cs-step-t { color: var(--electric); opacity: 1; }
        .cs-step:hover .cs-step-t { opacity: 0.8; }
        .cs-timer { height: 2px; margin-top: 11px; border-radius: 2px; background: color-mix(in srgb, var(--electric) 22%, transparent); overflow: hidden; }
        .cs-timer span { display: block; height: 100%; transform-origin: left; background: linear-gradient(90deg, var(--electric), var(--ember)); }

        /* the constellation */
        .cs-stage { position: relative; aspect-ratio: 4 / 3.15; }
        .cs-ghost { position: absolute; right: 2%; top: -16%; z-index: 0; font-family: var(--font-display); font-weight: 600; font-size: clamp(140px, 20vw, 280px);
          line-height: 0.8; color: transparent; -webkit-text-stroke: 1.4px color-mix(in srgb, var(--bone) 13%, transparent); pointer-events: none; user-select: none; }
        .cs-photo { position: absolute; overflow: hidden; will-change: transform; }
        .cs-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        /* ambient memory behind, tilted */
        .cs-back { z-index: 1; width: 46%; aspect-ratio: 3/4; right: -3%; top: -7%; transform: rotate(6deg); border-radius: 22px;
          box-shadow: 0 30px 64px -38px var(--shadow-card); filter: saturate(0.95) brightness(0.92); }
        .cs-back::after { content: ''; position: absolute; inset: 0; background: linear-gradient(160deg, transparent, color-mix(in srgb, var(--ink) 55%, transparent)); }
        .cs-back-float { display: block; width: 100%; height: 100%; animation: cs-float-a 9s ease-in-out infinite; }
        /* main feathered memory — no hard frame */
        .cs-main { z-index: 2; width: 82%; left: 0; bottom: 0; aspect-ratio: 4/3.4; border-radius: clamp(26px, 3vw, 40px);
          box-shadow: 0 54px 120px -54px var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.08);
          -webkit-mask-image: radial-gradient(128% 122% at 42% 30%, #000 76%, transparent 100%); mask-image: radial-gradient(128% 122% at 42% 30%, #000 76%, transparent 100%); }
        .cs-main-img { position: absolute; inset: 0; filter: saturate(1.05) contrast(1.03); }
        .cs-main-scrim { position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background: linear-gradient(to top, color-mix(in srgb, var(--ink) 84%, transparent) 2%, transparent 46%); }
        .cs-cap { position: absolute; left: clamp(18px, 2.2vw, 30px); right: clamp(18px, 2.2vw, 30px); bottom: clamp(16px, 2vw, 26px); z-index: 3; }
        .cs-cap-line { color: #F4F1EA; font-size: clamp(15px, 1.4vw, 18px); line-height: 1.4; max-width: 30ch; text-shadow: 0 2px 18px rgba(0,0,0,0.4); }
        .cs-cap-accent { display: inline-flex; align-items: center; gap: 8px; margin-top: 11px; font-family: var(--font-display); font-style: italic; font-size: clamp(15px, 1.5vw, 19px); color: #BFE0EE; }
        .cs-cap-accent::before { content: ''; width: 22px; height: 1px; background: var(--electric); }

        /* floating glass credential */
        .cs-chip { position: absolute; z-index: 4; top: 5%; left: -3%; display: inline-flex; align-items: center; gap: 9px; padding: 9px 14px; border-radius: 999px;
          background: color-mix(in srgb, var(--graphite) 66%, transparent); border: 1px solid var(--hair);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: 0 22px 48px -32px var(--shadow-card); }
        [data-theme="dark"] .cs-chip { background: linear-gradient(158deg, rgba(255,255,255,0.05), transparent 58%), linear-gradient(158deg, #1b262d, #151d23); border-color: rgba(255,255,255,0.1); }
        .cs-chip .star { color: var(--ember); font-size: 13px; line-height: 1; }
        .cs-chip-t { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--bone); }
        .cs-chip-float { animation: cs-float-b 7.5s ease-in-out infinite; }

        .cs-spark { position: absolute; z-index: 3; border-radius: 50%; background: var(--electric); box-shadow: 0 0 12px var(--electric); }

        @keyframes cs-float-a { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(-1.5deg); } }
        @keyframes cs-float-b { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        @keyframes cs-twinkle { 0%,100% { opacity: 0.25; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1.1); } }

        @media (max-width: 1023px) { .cs-chip { left: 2%; } .cs-back { right: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .cs-back-float, .cs-chip-float, .cs-spark { animation: none !important; }
        }
      `}</style>

      <div className="cs-bg" aria-hidden="true">
        <span className="cs-orb cs-orb-1" />
        <span className="cs-orb cs-orb-2" />
        <span className="cs-grain" />
      </div>

      <div className="shell cs-inner">
        {/* header */}
        <motion.span className="cs-eyebrow" {...reveal(0, 12)}>
          <span className="dot" aria-hidden="true" />Team culture
        </motion.span>
        <div className="cs-head">
          <h2 className="cs-title">
            <span className="ln"><motion.span initial="hidden" animate={entered ? 'show' : 'hidden'} variants={reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : { hidden: { y: '120%' }, show: { y: '0%' } }} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.1 }}>We don&apos;t hire a team.</motion.span></span>
            <span className="ln"><motion.span className="cs-ital" initial="hidden" animate={entered ? 'show' : 'hidden'} variants={reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : { hidden: { y: '120%' }, show: { y: '0%' } }} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.18 }}>We build one.</motion.span></span>
          </h2>
          <motion.div className="cs-stat" {...reveal(0.22, 16)}>
            <span className="cs-stat-n"><Odometer value="450+" /></span>
            <span className="cs-stat-l">on the<br />floor</span>
            <span className="cs-stat-sep" aria-hidden="true" />
            <span className="cs-stat-flow"><span style={{ color: 'var(--ember)' }}>rep</span><span style={{ color: 'var(--smoke)' }}> → </span><span style={{ color: 'var(--electric)' }}>owner</span></span>
          </motion.div>
        </div>

        {/* stage */}
        <div className="cs-grid">
          {/* value rail */}
          <motion.div className="cs-rail" {...reveal(0.3, 24)}>
            <span className="cs-rail-track" aria-hidden="true" />
            <motion.span className="cs-rail-fill" aria-hidden="true"
              animate={{ height: `calc((100% - 20px) * ${(active + 1) / n})` }}
              transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 22 }} />
            {VALUES.map((item, i) => {
              const on = active === i;
              return (
                <motion.button key={item.n} type="button" className="cs-step" data-on={on} data-cursor="expand"
                  onMouseEnter={() => pick(i)} onFocus={() => pick(i)} onClick={() => pick(i)}
                  aria-current={on ? 'true' : undefined} aria-label={`${item.title}. ${item.line}`}
                  initial={reduce ? false : { opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: EXPO }}>
                  <span className="cs-step-dot" aria-hidden="true">
                    {on && !reduce && (
                      <motion.span className="cs-step-ring" initial={{ scale: 0.7, opacity: 0.6 }} animate={{ scale: [0.7, 1.9], opacity: [0.6, 0] }} transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut' }} />
                    )}
                    <span className="core" />
                  </span>
                  <span className="cs-step-row">
                    <span className="cs-step-n">{item.n}</span>
                    <span className="cs-step-t">{item.title}</span>
                  </span>
                  {on && !reduce && !engaged && inView && (
                    <div className="cs-timer"><motion.span key={active} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: ROTATE_MS / 1000, ease: 'linear' }} /></div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          {/* constellation */}
          <motion.div className="cs-stage" onMouseMove={onMove} onMouseLeave={onLeave} {...reveal(0.34, 30)}>
            <motion.span className="cs-ghost" aria-hidden="true" style={reduce ? undefined : { y: numY }}>
              <AnimatePresence mode="wait"><motion.span key={v.n} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.5, ease: EXPO }} style={{ display: 'inline-block' }}>{v.n}</motion.span></AnimatePresence>
            </motion.span>

            {/* ambient memory */}
            <motion.div className="cs-photo cs-back" style={reduce ? undefined : { y: backY, x: cbx, rotate: 6, scale: backScale }}>
              <span className="cs-back-float"><img src={AMBIENT} alt="" aria-hidden="true" loading="lazy" draggable="false" /></span>
            </motion.div>

            {/* main feathered memory */}
            <motion.div className="cs-photo cs-main" style={reduce ? undefined : { y: mainY, x: cmx, scale: mainScale }}>
              <AnimatePresence mode="wait">
                <motion.img key={active} src={v.photo} alt={`Credence team — ${v.title}`} className="cs-main-img" loading="lazy" draggable="false"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.08, clipPath: 'inset(0 0 0 100%)' }}
                  animate={{ opacity: 1, scale: 1, clipPath: 'inset(0 0 0 0%)' }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.7, ease: EXPO }} />
              </AnimatePresence>
              <span className="cs-main-scrim" aria-hidden="true" />
              <div className="cs-cap">
                <AnimatePresence mode="wait">
                  <motion.div key={active} initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: EXPO }}>
                    <p className="cs-cap-line">{v.line}</p>
                    <span className="cs-cap-accent">{v.accent}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* credential */}
            <div className="cs-chip"><span className="cs-chip-float" style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}><span className="star" aria-hidden="true">★</span><span className="cs-chip-t">A+ BBB accredited</span></span></div>

            {/* sparkles */}
            {!reduce && [{ l: '14%', t: '30%', s: 5, d: '0s' }, { l: '90%', t: '54%', s: 4, d: '1.1s' }, { l: '60%', t: '6%', s: 6, d: '0.5s' }].map((p, i) => (
              <span key={i} className="cs-spark" style={{ left: p.l, top: p.t, width: p.s, height: p.s, animation: `cs-twinkle 3.4s ease-in-out ${p.d} infinite` }} aria-hidden="true" />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
