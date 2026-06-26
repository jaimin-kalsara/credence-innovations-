import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView, useScroll, useTransform } from 'framer-motion';
import { PEOPLE, RECOGNITION } from '../data/media';

/* ============================================================================
   TeamNights — "The work day earns the team night."

   A cinematic, un-boxy memory wall: a mosaic of varied-size frames (no borders)
   on a night-toned canvas. Hovering one frame spotlights it and dims the rest;
   frames lift, zoom and ring. Staggered scroll-reveal cascade, soft drifting
   glows, grain and sparkles. Tap any frame for a full lightbox (prev/next +
   keyboard). Always a dark island — built for the after-hours mood. No GSAP.
============================================================================ */

const EXPO = [0.16, 1, 0.3, 1];
const GALLERY = [...PEOPLE, ...RECOGNITION];
const spanOf = (i) => (i % 6 === 0 ? 'tn-big' : i % 6 === 3 ? 'tn-tall' : '');

export default function TeamNights() {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const headIn = useInView(headRef, { once: true, margin: '-12% 0px' });
  const [active, setActive] = useState(null);

  const inView = useInView(sectionRef, { margin: '-10% 0px -10% 0px' });
  const [entered, setEntered] = useState(false);
  useEffect(() => { if (inView) setEntered(true); }, [inView]);
  useEffect(() => {
    const id = setTimeout(() => { const el = sectionRef.current; if (!el) return; const r = el.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) setEntered(true); }, 800);
    return () => clearTimeout(id);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-5%', '5%']);
  const gridY = useTransform(scrollYProgress, [0, 1], reduce ? ['0px', '0px'] : ['26px', '-26px']);

  const close = useCallback(() => setActive(null), []);
  const go = useCallback((dir) => setActive((a) => (a === null ? a : (a + dir + GALLERY.length) % GALLERY.length)), []);
  useEffect(() => {
    if (active === null) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, close, go]);

  const lineV = reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : { hidden: { y: '120%' }, show: { y: '0%' } };

  return (
    <section ref={sectionRef} data-theme="dark" className="tn-section relative overflow-hidden" aria-label="Team Nights">
      <style>{`
        .tn-section { padding-block: clamp(60px, 8vw, 120px); isolation: isolate;
          background:
            radial-gradient(60% 44% at 18% 8%, color-mix(in srgb, var(--electric) 13%, transparent), transparent 60%),
            radial-gradient(56% 42% at 86% 90%, color-mix(in srgb, var(--ember) 11%, transparent), transparent 62%),
            #0c1417; }
        .tn-bg { position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
        .tn-orb { position: absolute; border-radius: 50%; filter: blur(96px); }
        .tn-orb-1 { width: 36vw; max-width: 540px; aspect-ratio: 1; left: -8%; top: -6%; background: radial-gradient(circle, color-mix(in srgb, var(--electric) 20%, transparent), transparent 64%); }
        .tn-orb-2 { width: 32vw; max-width: 470px; aspect-ratio: 1; right: -8%; bottom: -10%; background: radial-gradient(circle, color-mix(in srgb, var(--ember) 16%, transparent), transparent 64%); }
        .tn-grain { position: absolute; inset: 0; opacity: 0.05; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 140px 140px; }
        .tn-spark { position: absolute; width: 4px; height: 4px; border-radius: 50%; opacity: 0; background: radial-gradient(circle, #fff, transparent 70%); box-shadow: 0 0 10px color-mix(in srgb, var(--electric) 70%, #fff); }
        .tn-spark:nth-of-type(1) { left: 22%; top: 26%; animation: tn-tw 5.4s ease-in-out 0.3s infinite; }
        .tn-spark:nth-of-type(2) { right: 26%; top: 18%; animation: tn-tw 6.6s ease-in-out 1.4s infinite; }
        .tn-spark:nth-of-type(3) { left: 64%; bottom: 22%; animation: tn-tw 7.2s ease-in-out 2.3s infinite; }
        .tn-spark:nth-of-type(4) { left: 40%; top: 60%; animation: tn-tw 6s ease-in-out 3.1s infinite; }
        @keyframes tn-tw { 0%,100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 0.9; transform: scale(1); } }

        .tn-inner-wrap { position: relative; z-index: 2; }
        .tn-shell { width: min(1280px, 100%); margin-inline: auto; padding-inline: clamp(16px, 4vw, 44px); }

        /* header */
        .tn-pill { display: inline-flex; align-items: center; gap: 9px; padding: 7px 15px 7px 11px; border-radius: 999px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--bone);
          background: rgba(255,255,255,0.05); border: 1px solid color-mix(in srgb, var(--electric) 30%, rgba(255,255,255,0.1)); backdrop-filter: blur(8px); }
        .tn-pill .moon { width: 13px; height: 13px; color: var(--electric); }
        .tn-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 18px 40px; margin-top: clamp(16px, 1.8vw, 22px); }
        .tn-h { font-family: var(--font-display); color: var(--bone); line-height: 1.0; letter-spacing: -0.02em; font-size: clamp(34px, 4.6vw, 64px); }
        .tn-h .ln { display: block; overflow: hidden; padding-bottom: 0.06em; }
        .tn-h .ln > span { display: inline-block; will-change: transform; }
        .tn-h .hi { font-style: italic; font-weight: 500;
          background: linear-gradient(100deg, var(--electric), #7FC0DD 55%, var(--electric)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .tn-sub { color: color-mix(in srgb, var(--bone) 64%, transparent); font-size: clamp(14px, 1.05vw, 16px); line-height: 1.6; max-width: 40ch; }
        .tn-sub .hint { display: inline-flex; align-items: center; gap: 7px; margin-top: 12px; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--electric); }
        .tn-sub .hint::before { content: ''; width: 18px; height: 1px; background: var(--electric); }

        /* the mosaic memory wall */
        .tn-grid { display: grid; grid-template-columns: repeat(2, 1fr); grid-auto-rows: clamp(112px, 19vw, 150px); grid-auto-flow: dense;
          gap: clamp(8px, 1vw, 14px); margin-top: clamp(34px, 4vw, 56px); }
        @media (min-width: 700px) { .tn-grid { grid-template-columns: repeat(3, 1fr); grid-auto-rows: clamp(130px, 15vw, 170px); } }
        @media (min-width: 1024px) { .tn-grid { grid-template-columns: repeat(4, 1fr); grid-auto-rows: clamp(150px, 11vw, 184px); } }
        .tn-tile { position: relative; cursor: pointer; -webkit-tap-highlight-color: transparent; }
        .tn-big { grid-column: span 2; grid-row: span 2; }
        .tn-tall { grid-row: span 2; }
        .tn-inner { position: absolute; inset: 0; border-radius: clamp(12px, 1vw, 18px); overflow: hidden; background: #11191d;
          box-shadow: 0 18px 40px -26px rgba(0,0,0,0.8);
          transition: transform .55s var(--ease-out-expo), box-shadow .55s ease, opacity .45s ease, filter .45s ease; }
        .tn-inner img { width: 100%; height: 100%; object-fit: cover; object-position: center 30%; display: block; transition: transform .9s var(--ease-out-quart); }
        .tn-grad { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, transparent 40%, rgba(8,14,16,0.66)); opacity: 0.5; transition: opacity .45s ease; }
        .tn-ring { position: absolute; inset: 0; border-radius: inherit; padding: 1px; pointer-events: none; opacity: 0; transition: opacity .45s ease;
          background: linear-gradient(150deg, rgba(255,255,255,0.55), transparent 42%, color-mix(in srgb, var(--electric) 70%, transparent));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
        .tn-exp { position: absolute; right: 12px; bottom: 11px; width: 30px; height: 30px; border-radius: 9px; display: grid; place-items: center;
          background: rgba(10,14,15,0.55); color: #F3EEE2; border: 1px solid rgba(255,255,255,0.16); backdrop-filter: blur(6px);
          opacity: 0; transform: translateY(8px) scale(0.9); transition: opacity .4s ease, transform .4s var(--ease-out-expo); }
        .tn-exp svg { width: 15px; height: 15px; }

        /* spotlight: hovering the wall dims the rest, lifts the focused frame */
        .tn-grid:hover .tn-inner { opacity: 0.42; filter: saturate(0.6) brightness(0.7); }
        .tn-tile:hover { z-index: 3; }
        .tn-tile:hover .tn-inner { opacity: 1; filter: none; transform: translateY(-6px) scale(1.012);
          box-shadow: 0 44px 80px -34px rgba(0,0,0,0.9), 0 0 0 1px color-mix(in srgb, var(--electric) 28%, transparent), 0 26px 70px -28px color-mix(in srgb, var(--electric) 45%, transparent); }
        .tn-tile:hover .tn-inner img { transform: scale(1.09); }
        .tn-tile:hover .tn-grad { opacity: 0.85; }
        .tn-tile:hover .tn-ring { opacity: 1; }
        .tn-tile:hover .tn-exp { opacity: 1; transform: translateY(0) scale(1); }
        .tn-tile:focus-visible .tn-inner { opacity: 1; filter: none; outline: 2px solid var(--electric); outline-offset: 3px; }

        /* lightbox */
        .tn-lb { position: fixed; inset: 0; z-index: 90; display: grid; place-items: center; padding: clamp(16px, 4vw, 48px);
          background: rgba(6,10,12,0.86); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
        .tn-lb-img { display: block; width: 100%; height: auto; max-height: 84vh; object-fit: contain; border-radius: 14px; box-shadow: 0 60px 130px -40px rgba(0,0,0,0.9); }
        .tn-lb-close { position: absolute; top: clamp(16px, 3vw, 28px); right: clamp(16px, 3vw, 28px); width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18); color: var(--bone); cursor: pointer; transition: background .3s, transform .3s; }
        .tn-lb-close:hover { background: rgba(255,255,255,0.16); transform: rotate(90deg); }
        .tn-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; border-radius: 50%; display: grid; place-items: center;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.16); color: var(--bone); cursor: pointer; transition: background .3s, transform .3s; }
        .tn-nav:hover { background: rgba(255,255,255,0.16); }
        .tn-nav.prev { left: clamp(10px, 3vw, 30px); } .tn-nav.prev:hover { transform: translateY(-50%) translateX(-3px); }
        .tn-nav.next { right: clamp(10px, 3vw, 30px); } .tn-nav.next:hover { transform: translateY(-50%) translateX(3px); }
        .tn-lb-meta { position: absolute; bottom: clamp(18px, 4vw, 34px); left: 0; right: 0; text-align: center;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: color-mix(in srgb, var(--bone) 70%, transparent); }
        .tn-lb-meta b { color: var(--electric); font-weight: 600; }

        @media (max-width: 699px) { .tn-tile:hover .tn-inner { transform: none; } }
        @media (prefers-reduced-motion: reduce) { .tn-spark { display: none; } .tn-inner, .tn-inner img { transition: none; } }
      `}</style>

      <motion.div className="tn-bg" aria-hidden="true" style={{ y: bgY }}>
        <span className="tn-orb tn-orb-1" />
        <span className="tn-orb tn-orb-2" />
        <span className="tn-grain" />
        <span className="tn-spark" /><span className="tn-spark" /><span className="tn-spark" /><span className="tn-spark" />
      </motion.div>

      <div className="tn-inner-wrap tn-shell">
        {/* header */}
        <div ref={headRef}>
          <motion.span className="tn-pill"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }} animate={headIn ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EXPO }}>
            <svg className="moon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>Team Nights
          </motion.span>
          <div className="tn-head">
            <h2 className="tn-h">
              <span className="ln"><motion.span initial="hidden" animate={headIn ? 'show' : 'hidden'} variants={lineV} transition={{ ...(reduce ? { duration: 0.5 } : { type: 'spring', stiffness: 130, damping: 21 }), delay: 0.1 }}>The work day earns</motion.span></span>
              <span className="ln"><motion.span className="hi" initial="hidden" animate={headIn ? 'show' : 'hidden'} variants={lineV} transition={{ ...(reduce ? { duration: 0.5 } : { type: 'spring', stiffness: 130, damping: 21 }), delay: 0.18 }}>the team night.</motion.span></span>
            </h2>
            <motion.p className="tn-sub"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }} animate={headIn ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.3, ease: EXPO }}>
              Off the clock, on the same team — a few frames from the nights that keep this team close.
              <span className="hint">Tap any frame to expand</span>
            </motion.p>
          </div>
        </div>

        {/* the memory wall */}
        <motion.div className="tn-grid" style={reduce ? undefined : { y: gridY }}>
          {GALLERY.map((src, i) => (
            <motion.div
              key={i} className={`tn-tile ${spanOf(i)}`} tabIndex={0} role="button" aria-label="Open team night photo"
              data-cursor="expand" onClick={() => setActive(i)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(i); } }}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.92 }}
              animate={entered ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: Math.min(i * 0.045, 0.8), ease: EXPO }}>
              <div className="tn-inner">
                <img src={src} alt="Credence team night" loading="lazy" draggable="false" />
                <span className="tn-grad" aria-hidden="true" />
                <span className="tn-ring" aria-hidden="true" />
                <span className="tn-exp" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg></span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div className="tn-lb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
            <button className="tn-lb-close" onClick={close} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
            <button className="tn-nav prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button className="tn-nav next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
            <div className="w-full" style={{ maxWidth: 'min(92vw, 1000px)' }} onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.img key={active} className="tn-lb-img" src={GALLERY[active]} alt="Credence team night"
                  initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.35, ease: EXPO }} />
              </AnimatePresence>
            </div>
            <div className="tn-lb-meta">Team Nights · <b>{String(active + 1).padStart(2, '0')}</b> / {String(GALLERY.length).padStart(2, '0')}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
