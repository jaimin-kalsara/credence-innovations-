import { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

/* ============================================================================
   TheUpside — "What you gain as part of the team."

   An editorial "ledger / index" of benefits. A sticky headline rail on the
   left (with a live scroll-progress spine + count) is paired with full-width
   numbered perk rows on the right: big ghost-serif index numerals, hairline
   dividers instead of boxes, an accent wash that wipes across on hover, the
   numeral igniting in its accent, and an arrow sliding in. Masked headline,
   staggered clip-reveals, parallax background. Theme-adaptive · no GSAP.
============================================================================ */

const EXPO = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 130, damping: 21, mass: 1 };

const ICONS = [
  // Training Programs — graduation cap
  (<g><path d="M3 9l9-4 9 4-9 4z" /><path d="M7.5 10.8V15c0 1 2 2.2 4.5 2.2S16.5 16 16.5 15v-4.2" /><path d="M21 9v4.5" /></g>),
  // Career Growth — trending up
  (<g><path d="M4 16l5-5 3 3 7-7" /><path d="M16 7h4v4" /></g>),
  // Travel — plane
  (<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" fill="currentColor" stroke="none" />),
  // Mentorship — people
  (<g><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><path d="M16 6a3 3 0 0 1 0 5.6" /><path d="M20.5 20a5.5 5.5 0 0 0-4-5.3" /></g>),
  // Management — ascending steps
  (<g><path d="M3 21h4v-4H3z" fill="currentColor" stroke="none" /><path d="M9.5 21h4v-8.5h-4z" fill="currentColor" stroke="none" /><path d="M16 21h4V8h-4z" fill="currentColor" stroke="none" /></g>),
  // Future — shield + check
  (<g><path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z" /><path d="M9 12l2.2 2.2L15 10.5" /></g>),
];

function Row({ item, icon, i, entered, reduce }) {
  const num = String(i + 1).padStart(2, '0');
  return (
    <motion.div
      className="up-row"
      style={{ '--acc': item.accent }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, clipPath: 'inset(0 0 100% 0)' }}
      animate={entered ? { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' } : {}}
      transition={{ duration: 0.72, delay: 0.1 + i * 0.09, ease: EXPO }}
    >
      <span className="up-wash" aria-hidden="true" />
      <span className="up-num" aria-hidden="true">{num}</span>
      <div className="up-main">
        <div className="up-top">
          <span className="up-chip" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
          </span>
          <span className="up-tag">{item.tag}</span>
        </div>
        <h3 className="up-title">{item.title}</h3>
        <p className="up-desc">{item.desc}</p>
      </div>
      <span className="up-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13" /><path d="M12.5 6l6 6-6 6" /></svg>
      </span>
    </motion.div>
  );
}

export default function TheUpside({ items = [] }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const headIn = useInView(headRef, { once: true, margin: '-12% 0px' });
  const inView = useInView(sectionRef, { margin: '-10% 0px -10% 0px' });
  const [entered, setEntered] = useState(false);
  useEffect(() => { if (inView) setEntered(true); }, [inView]);
  useEffect(() => {
    const id = setTimeout(() => { const el = sectionRef.current; if (!el) return; const r = el.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) setEntered(true); }, 800);
    return () => clearTimeout(id);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-5%', '6%']);
  const spineRaw = useTransform(scrollYProgress, [0.12, 0.72], [0, 1]);
  const spineScale = useSpring(spineRaw, { stiffness: 120, damping: 28, mass: 0.6 });

  const lineV = reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : { hidden: { y: '120%' }, show: { y: '0%' } };

  return (
    <section ref={sectionRef} className="up-section paper relative overflow-hidden pad-lg" aria-label="The upside">
      <style>{`
        .up-section { isolation: isolate;
          background:
            radial-gradient(56% 42% at 86% 4%, color-mix(in srgb, var(--electric) 9%, transparent), transparent 60%),
            radial-gradient(52% 40% at 4% 96%, color-mix(in srgb, var(--ember) 7%, transparent), transparent 62%),
            var(--ink); }
        .up-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .up-orb { position: absolute; border-radius: 50%; filter: blur(96px); }
        .up-orb-1 { width: 34vw; max-width: 500px; aspect-ratio: 1; right: -8%; top: -6%; background: radial-gradient(circle, color-mix(in srgb, var(--electric) 13%, transparent), transparent 64%); }
        .up-orb-2 { width: 30vw; max-width: 440px; aspect-ratio: 1; left: -8%; bottom: -10%; background: radial-gradient(circle, color-mix(in srgb, var(--ember) 11%, transparent), transparent 64%); }
        .up-dots { position: absolute; inset: 0; opacity: 0.5;
          background-image: radial-gradient(color-mix(in srgb, var(--bone) 8%, transparent) 1px, transparent 1px); background-size: 34px 34px;
          -webkit-mask: radial-gradient(circle at 70% 18%, #000, transparent 76%); mask: radial-gradient(circle at 70% 18%, #000, transparent 76%); }
        .up-grain { position: absolute; inset: 0; opacity: 0.035; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 140px 140px; }

        .up-inner { position: relative; z-index: 2; }
        .up-wrap { display: grid; grid-template-columns: 1fr; gap: clamp(34px, 4vw, 56px); align-items: start; }
        @media (min-width: 980px) {
          .up-wrap { grid-template-columns: minmax(270px, 0.8fr) 1.2fr; gap: clamp(48px, 5.4vw, 100px); }
          .up-aside { position: sticky; top: clamp(96px, 15vh, 148px); }
        }

        /* ---- left rail ---- */
        .up-pill { display: inline-flex; align-items: center; gap: 9px; padding: 7px 15px; border-radius: 999px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--bone);
          background: color-mix(in srgb, var(--graphite) 52%, transparent); border: 1px solid color-mix(in srgb, var(--electric) 26%, var(--hair)); }
        .up-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--electric); box-shadow: 0 0 10px var(--electric); }
        .up-h { font-family: var(--font-display); color: var(--bone); line-height: 1.0; letter-spacing: -0.02em; font-size: clamp(34px, 4vw, 58px); margin-top: clamp(16px, 1.6vw, 22px); }
        .up-h .ln { display: block; overflow: hidden; padding: 0.02em 0.06em 0.1em; }
        .up-h .ln > span { display: inline-block; will-change: transform; }
        .up-hi { font-style: italic; font-weight: 500; background: linear-gradient(100deg, var(--electric), #6FB6D9 55%, var(--electric)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: var(--electric); }
        .up-sub { color: var(--smoke); font-size: clamp(15px, 1.1vw, 17px); line-height: 1.62; max-width: 42ch; margin-top: clamp(16px, 1.5vw, 20px); }

        .up-meta { display: flex; align-items: center; gap: 18px; margin-top: clamp(30px, 3.2vw, 46px); }
        .up-meta-track { width: 2px; height: clamp(54px, 5vw, 72px); border-radius: 2px; background: var(--hair); position: relative; overflow: hidden; flex: none; }
        .up-meta-fill { position: absolute; inset: 0; transform-origin: top; background: linear-gradient(var(--electric), var(--ember)); border-radius: 2px; }
        .up-meta-num { font-family: var(--font-display); font-weight: 500; font-size: clamp(36px, 3.6vw, 50px); color: var(--bone); line-height: 0.9; letter-spacing: -0.02em; }
        .up-meta-label { display: block; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--smoke); line-height: 1.5; margin-top: 8px; }

        /* ---- right ledger ---- */
        .up-rows { position: relative; }
        .up-row { position: relative; display: grid; grid-template-columns: auto 1fr auto; align-items: start;
          gap: clamp(16px, 2.2vw, 38px); padding: clamp(24px, 2.7vw, 38px) clamp(10px, 1.4vw, 22px);
          border-top: 1px solid var(--hair); overflow: hidden;
          transition: padding-left .55s var(--ease-out-expo); }
        .up-row:last-child { border-bottom: 1px solid var(--hair); }
        .up-wash { position: absolute; inset: 0; z-index: 0; transform-origin: left center; transform: scaleX(0);
          background: linear-gradient(90deg, color-mix(in srgb, var(--acc) 13%, transparent), color-mix(in srgb, var(--acc) 4%, transparent) 46%, transparent 78%);
          transition: transform .6s var(--ease-out-expo); }
        .up-row:hover .up-wash { transform: scaleX(1); }
        .up-row:hover { padding-left: clamp(18px, 2vw, 32px); }

        .up-num { position: relative; z-index: 1; font-family: var(--font-display); font-weight: 500; line-height: 0.86;
          font-size: clamp(34px, 4vw, 60px); letter-spacing: -0.03em; font-feature-settings: 'tnum' 1; min-width: 1.5em;
          color: transparent; -webkit-text-stroke: 1px color-mix(in srgb, var(--bone) 32%, transparent);
          transition: color .45s ease, -webkit-text-stroke-color .45s ease, transform .5s var(--ease-out-expo); }
        .up-row:hover .up-num { color: var(--acc); -webkit-text-stroke-color: var(--acc); transform: translateY(-2px); }

        .up-main { position: relative; z-index: 1; min-width: 0; }
        .up-top { display: flex; align-items: center; gap: 12px; }
        .up-chip { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 11px; flex: none; color: var(--acc);
          background: color-mix(in srgb, var(--acc) 14%, transparent); border: 1px solid color-mix(in srgb, var(--acc) 26%, transparent);
          transition: transform .45s var(--ease-out-expo), box-shadow .45s ease, background .4s ease; }
        .up-chip svg { width: 21px; height: 21px; }
        .up-row:hover .up-chip { transform: translateY(-3px) scale(1.06); background: color-mix(in srgb, var(--acc) 20%, transparent); box-shadow: 0 14px 28px -14px color-mix(in srgb, var(--acc) 65%, transparent); }
        .up-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.17em; text-transform: uppercase; color: color-mix(in srgb, var(--acc) 78%, var(--smoke)); }
        .up-title { font-family: var(--font-display); font-weight: 600; color: var(--bone); font-size: clamp(23px, 2.3vw, 34px); line-height: 1.08; letter-spacing: -0.015em; margin-top: clamp(13px, 1.3vw, 17px); transition: color .35s ease; }
        .up-desc { color: var(--smoke); font-size: clamp(14.5px, 1.05vw, 16px); line-height: 1.62; margin-top: 10px; max-width: 48ch; }

        .up-arrow { position: relative; z-index: 1; align-self: center; display: grid; place-items: center; width: 46px; height: 46px; border-radius: 50%; flex: none;
          border: 1px solid var(--hair); color: var(--smoke); background: transparent; opacity: 0; transform: translateX(-10px);
          transition: opacity .5s ease, transform .5s var(--ease-out-expo), color .4s ease, border-color .4s ease, background .4s ease; }
        .up-arrow svg { width: 19px; height: 19px; }
        .up-row:hover .up-arrow { opacity: 1; transform: translateX(0); color: var(--acc); border-color: color-mix(in srgb, var(--acc) 42%, var(--hair)); background: color-mix(in srgb, var(--acc) 10%, transparent); }
        @media (max-width: 560px) { .up-arrow { display: none; } .up-row { grid-template-columns: auto 1fr; } }

        @media (prefers-reduced-motion: reduce) {
          .up-row, .up-wash, .up-num, .up-chip, .up-arrow { transition: none; }
        }
      `}</style>

      <motion.div className="up-bg" aria-hidden="true" style={{ y: bgY }}>
        <span className="up-orb up-orb-1" /><span className="up-orb up-orb-2" />
        <span className="up-dots" /><span className="up-grain" />
      </motion.div>

      <div className="shell up-inner">
        <div className="up-wrap">
          <aside className="up-aside" ref={headRef}>
            <motion.span className="up-pill" initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }} animate={headIn ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EXPO }}>
              <span className="dot" aria-hidden="true" />The upside
            </motion.span>
            <h2 className="up-h">
              <span className="ln"><motion.span initial="hidden" animate={headIn ? 'show' : 'hidden'} variants={lineV} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.1 }}>What you gain</motion.span></span>
              <span className="ln"><motion.span initial="hidden" animate={headIn ? 'show' : 'hidden'} variants={lineV} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.17 }}>as part of</motion.span></span>
              <span className="ln"><motion.span className="up-hi" initial="hidden" animate={headIn ? 'show' : 'hidden'} variants={lineV} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.24 }}>the team.</motion.span></span>
            </h2>
            <motion.p className="up-sub" initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(4px)' }} animate={headIn ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}} transition={{ duration: 0.7, delay: 0.32, ease: EXPO }}>
              Training, mentorship, travel, and a real plan for your future — here&apos;s everything that comes with the work.
            </motion.p>
            <motion.div className="up-meta" initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }} animate={headIn ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.42, ease: EXPO }}>
              <span className="up-meta-track"><motion.span className="up-meta-fill" style={{ scaleY: spineScale }} /></span>
              <span>
                <span className="up-meta-num">{String(items.length).padStart(2, '0')}</span>
                <span className="up-meta-label">ways we invest<br />in your growth</span>
              </span>
            </motion.div>
          </aside>

          <div className="up-rows">
            {items.map((item, i) => (
              <Row key={item.title} item={item} icon={ICONS[i % ICONS.length]} i={i} entered={entered} reduce={reduce} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
