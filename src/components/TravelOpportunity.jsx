import { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, useInView } from 'framer-motion';

/* ============================================================================
   TravelOpportunity — "The work takes you places."

   An un-boxy destination journey: three feathered destination photos staggered
   like a flight route, connected by a dotted path that draws on scroll, with
   location pins and floating glass labels that overlap each photo's edge (no
   hard cards). A faint globe + meridians, soft glows and twinkling stars set
   the travel mood. Masked headline, staggered reveals, parallax, cursor tilt.
   Theme-adaptive · reduced-motion aware · no GSAP.
============================================================================ */

const EXPO = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 130, damping: 21, mass: 1 };

function Pin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" fill="currentColor" />
      <circle cx="12" cy="10" r="2.6" fill="#0e1618" />
    </svg>
  );
}

function Stop({ trip, i, entered, reduce }) {
  const onMove = (e) => {
    if (reduce) return; const el = e.currentTarget; const r = el.getBoundingClientRect();
    el.style.setProperty('--rx', `${((e.clientY - r.top) / r.height - 0.5) * -5}deg`);
    el.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 5}deg`);
  };
  const onLeave = (e) => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg'); };
  return (
    <motion.div className="tr-stop"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 44, scale: 0.95 }}
      animate={entered ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.75, delay: 0.2 + i * 0.14, ease: EXPO }}>
      <motion.span className="tr-pin" aria-hidden="true"
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0, y: -8 }} animate={entered ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={reduce ? { duration: 0.4, delay: 0.4 + i * 0.14 } : { ...SPRING, delay: 0.45 + i * 0.14 }}>
        <span className="tr-pin-pulse" /><Pin />
      </motion.span>

      <div className="tr-photo" onMouseMove={onMove} onMouseLeave={onLeave} data-cursor="expand">
        <div className="tr-photo-clip">
          <img src={trip.img} alt={trip.alt} loading="lazy" draggable="false" />
          <span className="tr-photo-scrim" aria-hidden="true" />
        </div>
        <span className="tr-freq">{trip.freq}</span>
      </div>

      <motion.div className="tr-label"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }} animate={entered ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 + i * 0.14, ease: EXPO }}>
        <div className="tr-place"><span className="tr-place-dot" aria-hidden="true" />{trip.place}</div>
        <h3 className="tr-name">{trip.name}</h3>
        <p className="tr-note">{trip.note}</p>
      </motion.div>
    </motion.div>
  );
}

export default function TravelOpportunity({ items = [] }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const headIn = useInView(headRef, { once: true, margin: '-12% 0px' });
  const journeyRef = useRef(null);
  const inView = useInView(sectionRef, { margin: '-10% 0px -10% 0px' });
  const [entered, setEntered] = useState(false);
  useEffect(() => { if (inView) setEntered(true); }, [inView]);
  useEffect(() => {
    const id = setTimeout(() => { const el = sectionRef.current; if (!el) return; const r = el.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) setEntered(true); }, 800);
    return () => clearTimeout(id);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-5%', '5%']);
  const lineV = reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : { hidden: { y: '120%' }, show: { y: '0%' } };
  const STATS = ['All-expenses-paid', '3 destinations', 'Twice a year'];

  return (
    <section ref={sectionRef} className="tr-section paper relative overflow-hidden pad-lg" aria-label="Travel opportunity">
      <style>{`
        .tr-section { isolation: isolate;
          background:
            radial-gradient(58% 42% at 82% 6%, color-mix(in srgb, var(--electric) 10%, transparent), transparent 60%),
            radial-gradient(54% 40% at 6% 92%, color-mix(in srgb, var(--ember) 8%, transparent), transparent 62%),
            var(--ink); }
        .tr-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .tr-orb { position: absolute; border-radius: 50%; filter: blur(94px); }
        .tr-orb-1 { width: 34vw; max-width: 500px; aspect-ratio: 1; left: -8%; top: -4%; background: radial-gradient(circle, color-mix(in srgb, var(--electric) 13%, transparent), transparent 64%); }
        .tr-orb-2 { width: 30vw; max-width: 440px; aspect-ratio: 1; right: -8%; bottom: -8%; background: radial-gradient(circle, color-mix(in srgb, var(--ember) 11%, transparent), transparent 64%); }
        .tr-grain { position: absolute; inset: 0; opacity: 0.035; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 140px 140px; }
        .tr-globe { position: absolute; right: -6%; top: 8%; width: clamp(280px, 32vw, 520px); aspect-ratio: 1; opacity: 0.5; color: color-mix(in srgb, var(--bone) 12%, transparent);
          -webkit-mask: radial-gradient(circle, #000 60%, transparent 78%); mask: radial-gradient(circle, #000 60%, transparent 78%); }
        .tr-star { position: absolute; width: 4px; height: 4px; border-radius: 50%; opacity: 0; background: radial-gradient(circle, #fff, transparent 70%); box-shadow: 0 0 9px color-mix(in srgb, var(--electric) 60%, #fff); }
        .tr-star-1 { left: 20%; top: 22%; animation: tr-tw 5.4s ease-in-out 0.4s infinite; }
        .tr-star-2 { right: 24%; top: 16%; animation: tr-tw 6.6s ease-in-out 1.5s infinite; }
        .tr-star-3 { left: 62%; bottom: 18%; animation: tr-tw 7.2s ease-in-out 2.4s infinite; }
        @keyframes tr-tw { 0%,100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 0.85; transform: scale(1); } }

        .tr-inner { position: relative; z-index: 2; }
        .tr-head { text-align: center; max-width: 760px; margin-inline: auto; }
        .tr-pill { display: inline-flex; align-items: center; gap: 9px; padding: 7px 15px; border-radius: 999px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--bone);
          background: color-mix(in srgb, var(--graphite) 52%, transparent); border: 1px solid color-mix(in srgb, var(--electric) 26%, var(--hair)); }
        .tr-pill svg { width: 13px; height: 13px; color: var(--electric); }
        .tr-h { font-family: var(--font-display); color: var(--bone); line-height: 1.0; letter-spacing: -0.02em; font-size: clamp(34px, 4.6vw, 62px); margin-top: clamp(14px, 1.6vw, 20px); }
        .tr-h .ln { display: inline-block; overflow: hidden; vertical-align: bottom; padding: 0.02em 0.07em 0.12em; }
        .tr-h .ln > span { display: inline-block; will-change: transform; }
        .tr-hi { font-style: italic; font-weight: 500; background: linear-gradient(100deg, var(--electric), #6FB6D9 55%, var(--electric)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: var(--electric); }
        .tr-sub { color: var(--smoke); font-size: clamp(15px, 1.1vw, 17px); line-height: 1.6; max-width: 52ch; margin: clamp(14px, 1.4vw, 18px) auto 0; }
        .tr-stats { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 22px; margin-top: clamp(18px, 2vw, 24px); }
        .tr-stat { display: inline-flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--bone); }
        .tr-stat::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: var(--electric); box-shadow: 0 0 8px var(--electric); }

        /* the journey */
        .tr-journey { position: relative; margin-top: clamp(48px, 6vw, 84px); }
        .tr-route { position: absolute; left: 0; right: 0; top: -6%; width: 100%; height: 60%; z-index: 1; pointer-events: none; overflow: visible; }
        .tr-route path { fill: none; stroke: color-mix(in srgb, var(--electric) 55%, var(--hair)); stroke-width: 2; stroke-linecap: round; stroke-dasharray: 1 10; }
        @media (max-width: 760px) { .tr-route { display: none; } }
        .tr-grid { position: relative; z-index: 2; display: grid; grid-template-columns: 1fr; gap: clamp(48px, 6vw, 40px); }
        @media (min-width: 760px) { .tr-grid { grid-template-columns: repeat(3, 1fr); gap: clamp(20px, 2.4vw, 34px); align-items: start; }
          .tr-stop:nth-child(2) { margin-top: clamp(-44px, -4vw, -20px); } }

        .tr-stop { position: relative; }
        .tr-pin { position: absolute; left: 50%; top: -18px; transform: translateX(-50%); z-index: 5; width: 26px; height: 26px; color: var(--electric);
          filter: drop-shadow(0 6px 10px rgba(0,0,0,0.4)); }
        .tr-pin svg { width: 100%; height: 100%; }
        .tr-pin-pulse { position: absolute; left: 50%; bottom: 2px; transform: translateX(-50%); width: 10px; height: 10px; border-radius: 50%; border: 1px solid var(--electric); animation: tr-ping 2.4s var(--ease-out-quart) infinite; }
        @keyframes tr-ping { 0% { transform: translateX(-50%) scale(0.6); opacity: 0.6; } 70%,100% { transform: translateX(-50%) scale(2.4); opacity: 0; } }

        .tr-photo { position: relative; aspect-ratio: 4 / 5; border-radius: clamp(18px, 1.6vw, 24px); perspective: 900px;
          transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)); cursor: pointer; will-change: transform;
          box-shadow: 0 44px 90px -46px var(--shadow-card);
          transition: transform 0.45s var(--ease-out-quart), box-shadow 0.5s ease; }
        .tr-photo:hover { box-shadow: 0 60px 110px -44px var(--shadow-card), 0 0 0 1px color-mix(in srgb, var(--electric) 28%, transparent), 0 28px 76px -30px color-mix(in srgb, var(--electric) 40%, transparent); }
        /* inner 2D clip keeps the rounded corners intact under the parent's 3D tilt */
        .tr-photo-clip { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; }
        .tr-photo-clip img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; filter: saturate(1.04) contrast(1.03); transition: transform 0.8s var(--ease-out-quart); }
        .tr-photo:hover .tr-photo-clip img { transform: scale(1.06); }
        .tr-photo-scrim { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(to top, color-mix(in srgb, var(--ink) 72%, transparent) 0%, transparent 46%); }
        .tr-freq { position: absolute; top: 14px; left: 14px; font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: #F3EEE2;
          background: rgba(10,14,15,0.5); border: 1px solid rgba(255,255,255,0.18); border-radius: 999px; padding: 6px 11px; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }

        /* floating glass label — overlaps the photo's bottom edge (un-boxy) */
        .tr-label { position: relative; z-index: 4; margin: -34px clamp(8px, 1.4vw, 18px) 0; padding: clamp(16px, 1.6vw, 20px); border-radius: 16px;
          background: color-mix(in srgb, var(--graphite) 72%, transparent); border: 1px solid var(--hair);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: 0 26px 56px -34px var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.07); }
        [data-theme="dark"] .tr-label { background: linear-gradient(158deg, rgba(255,255,255,0.05), transparent 58%), linear-gradient(158deg, #1c272e, #161f25); border-color: rgba(255,255,255,0.1); }
        .tr-place { display: inline-flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--electric); }
        .tr-place-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--ember); }
        .tr-name { font-family: var(--font-display); font-weight: 600; color: var(--bone); font-size: clamp(20px, 1.8vw, 26px); line-height: 1.08; letter-spacing: -0.01em; margin-top: 9px; }
        .tr-note { color: var(--smoke); font-size: 13.5px; line-height: 1.5; margin-top: 9px; }

        @media (prefers-reduced-motion: reduce) { .tr-star, .tr-pin-pulse { animation: none !important; } .tr-photo, .tr-photo img { transition: none; } }

        /* MOBILE — the destination journey becomes a horizontal snap carousel
           (≤640px only; desktop flight-route layout untouched). Extra top
           padding keeps each card's location pin (top:-18px) from clipping. */
        @media (max-width: 640px) {
          .tr-grid { display: flex; flex-wrap: nowrap; align-items: flex-start;
            overflow-x: auto; overflow-y: visible; scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch; gap: 16px; padding: 24px 0 14px; max-width: 100%;
            -ms-overflow-style: none; scrollbar-width: none; }
          .tr-grid::-webkit-scrollbar { display: none; }
          .tr-stop { flex: 0 0 78%; scroll-snap-align: start; min-width: 0; margin-top: 0 !important; }
        }
      `}</style>

      <motion.div className="tr-bg" aria-hidden="true" style={{ y: bgY }}>
        <span className="tr-orb tr-orb-1" /><span className="tr-orb tr-orb-2" /><span className="tr-grain" />
        <svg className="tr-globe" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.8">
          <circle cx="100" cy="100" r="92" />
          <ellipse cx="100" cy="100" rx="92" ry="36" /><ellipse cx="100" cy="100" rx="92" ry="68" />
          <ellipse cx="100" cy="100" rx="36" ry="92" /><ellipse cx="100" cy="100" rx="68" ry="92" />
          <line x1="8" y1="100" x2="192" y2="100" /><line x1="100" y1="8" x2="100" y2="192" />
        </svg>
        <span className="tr-star tr-star-1" /><span className="tr-star tr-star-2" /><span className="tr-star tr-star-3" />
      </motion.div>

      <div className="shell tr-inner">
        <div className="tr-head" ref={headRef}>
          <motion.span className="tr-pill" initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }} animate={headIn ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EXPO }}>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" /></svg>Travel Opportunity
          </motion.span>
          <h2 className="tr-h">
            <span className="ln"><motion.span initial="hidden" animate={headIn ? 'show' : 'hidden'} variants={lineV} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.1 }}>The work takes you</motion.span></span>{' '}
            <span className="ln"><motion.span className="tr-hi" initial="hidden" animate={headIn ? 'show' : 'hidden'} variants={lineV} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.18 }}>places.</motion.span></span>
          </h2>
          <motion.p className="tr-sub" initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(4px)' }} animate={headIn ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}} transition={{ duration: 0.7, delay: 0.3, ease: EXPO }}>
            Conferences, retreats, and leadership summits — on us. See the country while you build the career.
          </motion.p>
          <motion.div className="tr-stats" initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }} animate={headIn ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.42, ease: EXPO }}>
            {STATS.map((s) => <span className="tr-stat" key={s}>{s}</span>)}
          </motion.div>
        </div>

        <div className="tr-journey" ref={journeyRef}>
          <svg className="tr-route" viewBox="0 0 1000 280" preserveAspectRatio="none" aria-hidden="true">
            <motion.path d="M 120 200 C 300 200 330 70 500 70 C 670 70 700 200 880 200"
              initial={{ opacity: 0 }} animate={entered ? { opacity: 1 } : {}} transition={{ duration: 1, ease: EXPO, delay: 0.3 }} />
          </svg>
          <div className="tr-grid">
            {items.map((trip, i) => <Stop key={trip.name} trip={trip} i={i} entered={entered} reduce={reduce} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
