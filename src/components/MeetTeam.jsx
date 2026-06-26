import { useRef } from 'react';
import {
  motion, useReducedMotion,
  useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, useInView,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import MagneticButton from './MagneticButton';
import { getMember } from '../data/team';

/* ============================================================================
   MeetTeam — a premium editorial showcase of the leadership trio.

   Podium-staggered cards, each with a scroll-triggered portrait unmask, a
   name line-reveal, per-card scroll parallax on the photo, 3D cursor-tilt,
   a mouse-following accent glow and a sheen sweep on hover. Layered, fully
   theme-adaptive background (soft glows · dot grid · grain). Reduced-motion
   collapses to clean static cards. No GSAP.
============================================================================ */

const SLUGS = ['markese-stepp', 'aron-janko', 'krista-sanford'];
const EXPO = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 140, damping: 22, mass: 1 };

function TeamCard({ m, i, reduce }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-90px' });

  // per-card scroll parallax on the portrait
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-9%', '9%']);
  const numY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [18, -18]);

  // 3D cursor tilt + mouse-following glow
  const mx = useMotionValue(0.5); const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), SPRING);
  const ry = useSpring(useTransform(mx, [0, 1], [-7, 7]), SPRING);
  const gx = useTransform(mx, (v) => `${(v * 100).toFixed(1)}%`);
  const gy = useTransform(my, (v) => `${(v * 100).toFixed(1)}%`);
  const glow = useMotionTemplate`radial-gradient(300px circle at ${gx} ${gy}, color-mix(in srgb, var(--electric) 26%, transparent), transparent 62%)`;
  const onMove = (e) => { if (reduce) return; const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height); };
  const onLeave = () => { mx.set(0.5); my.set(0.5); };

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 + i * 0.12 } } };
  const item = reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EXPO } } };
  const photoV = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } }
    : { hidden: { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.14 }, show: { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, transition: { duration: 0.95, ease: EXPO } } };
  const lineV = reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : { hidden: { y: '115%' }, show: { y: '0%', transition: { ...SPRING } } };

  return (
    <motion.div ref={ref} className="mt-cell" variants={container} initial="hidden" animate={inView ? 'show' : 'hidden'}>
      <Link className="mt-link" to={`/team/${m.slug}`} data-cursor="expand" aria-label={`View ${m.name}'s profile — ${m.role}`}>
        <motion.div className="mt-card" onMouseMove={onMove} onMouseLeave={onLeave}
          style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 1100 }}>
          <span className="mt-rim" aria-hidden="true" />
          {!reduce && <motion.span className="mt-glow" aria-hidden="true" style={{ background: glow }} />}

          <div className="mt-photo">
            <motion.div className="mt-photo-mask" variants={photoV}>
              <motion.img src={m.photo} alt={`${m.name}, ${m.role} at Credence Innovations`} loading="lazy" draggable="false"
                style={reduce ? undefined : { y: imgY, scale: 1.12 }} />
            </motion.div>
            <span className="mt-photo-scrim" aria-hidden="true" />
            <span className="mt-sheen" aria-hidden="true" />
            <motion.span className="mt-num" style={reduce ? undefined : { y: numY }}>{String(i + 1).padStart(2, '0')}</motion.span>
            <motion.span className="mt-rolechip" variants={item}>{m.role}</motion.span>
          </div>

          <div className="mt-body">
            <h3 className="mt-name"><span className="mt-line"><motion.span variants={lineV}>{m.name}</motion.span></span></h3>
            {m.tagline && <motion.p className="mt-tag" variants={item}>{m.tagline}</motion.p>}
            <motion.span className="mt-view" variants={item}>
              View profile
              <span className="mt-arrow material-symbols-rounded" aria-hidden="true">arrow_forward</span>
            </motion.span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function MeetTeam() {
  const reduce = useReducedMotion();
  const headRef = useRef(null);
  const headIn = useInView(headRef, { once: true, margin: '-12% 0px' });
  const members = SLUGS.map(getMember).filter(Boolean);

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-5%', '5%']);
  const wordV = reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : { hidden: { y: '120%' }, show: { y: '0%' } };

  return (
    <section ref={sectionRef} className="mt-section paper relative overflow-hidden pad-lg" aria-label="Meet the team">
      <style>{`
        .mt-section { isolation: isolate; background-color: var(--ink); }
        .mt-bg { display: none; position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
        .mt-orb { position: absolute; border-radius: 50%; filter: blur(90px); }
        .mt-orb-1 { width: 38vw; max-width: 560px; aspect-ratio: 1; left: -6%; top: 2%; background: radial-gradient(circle, color-mix(in srgb, var(--electric) 15%, transparent), transparent 64%); }
        .mt-orb-2 { width: 32vw; max-width: 460px; aspect-ratio: 1; right: -4%; bottom: -4%; background: radial-gradient(circle, color-mix(in srgb, var(--ember) 12%, transparent), transparent 64%); }
        .mt-dots { position: absolute; inset: 0; opacity: 0.5;
          background-image: radial-gradient(color-mix(in srgb, var(--bone) 9%, transparent) 1px, transparent 1px); background-size: 32px 32px;
          -webkit-mask: radial-gradient(circle at 50% 30%, #000, transparent 78%); mask: radial-gradient(circle at 50% 30%, #000, transparent 78%); }
        .mt-grain { position: absolute; inset: 0; opacity: 0.035; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 140px 140px; }

        /* heading */
        .mt-head { position: relative; z-index: 2; text-align: center; max-width: 760px; margin-inline: auto; }
        .mt-eyebrow { display: inline-flex; align-items: center; gap: 9px; padding: 7px 15px; border-radius: 999px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--bone);
          background: color-mix(in srgb, var(--graphite) 55%, transparent); border: 1px solid color-mix(in srgb, var(--electric) 24%, var(--hair)); }
        .mt-eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--electric); box-shadow: 0 0 10px var(--electric); }
        .mt-title { font-family: var(--font-display); color: var(--bone); line-height: 1.0; letter-spacing: -0.02em; margin-top: clamp(16px, 1.8vw, 22px); font-size: clamp(34px, 4.4vw, 62px); }
        .mt-title .ln { display: block; overflow: hidden; padding: 0.04em 0.06em 0.12em; }
        .mt-title .ln > span { display: inline-block; will-change: transform; }
        .mt-ital { font-style: italic; font-weight: 500;
          background: linear-gradient(100deg, var(--electric), #6FB6D9 55%, var(--electric)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: var(--electric); }
        .mt-sub { color: var(--smoke); font-size: clamp(15px, 1.1vw, 17px); line-height: 1.6; max-width: 56ch; margin: clamp(16px, 1.6vw, 20px) auto 0; }

        /* grid — podium stagger on desktop */
        .mt-grid { position: relative; z-index: 2; display: grid; grid-template-columns: 1fr; gap: clamp(22px, 2.6vw, 34px); align-items: start;
          margin-top: clamp(40px, 5vw, 68px); }
        .mt-cell { display: flex; }
        @media (min-width: 640px) and (max-width: 1023px) {
          .mt-grid { grid-template-columns: repeat(2, 1fr); }
          .mt-cell:nth-child(3) { grid-column: 1 / -1; justify-self: center; width: min(100%, calc(50% - 17px)); }
        }
        @media (min-width: 1024px) {
          .mt-grid { grid-template-columns: repeat(3, 1fr); gap: clamp(26px, 2vw, 40px); }
          .mt-cell:nth-child(odd) { margin-top: clamp(20px, 3.2vw, 52px); }   /* middle leader on the podium peak */
        }

        .mt-link { display: flex; width: 100%; text-decoration: none; perspective: 1100px; -webkit-tap-highlight-color: transparent;
          transition: transform .5s var(--ease-out-expo); }
        .mt-link:hover { transform: translateY(-8px); }
        .mt-link:focus-visible { outline: 2px solid var(--electric); outline-offset: 4px; border-radius: 24px; }

        .mt-card { position: relative; display: flex; flex-direction: column; width: 100%; border-radius: 22px; overflow: hidden;
          background: var(--graphite); border: 1px solid var(--hair); transform-style: preserve-3d; will-change: transform;
          box-shadow: 0 1px 0 rgba(255,255,255,0.05) inset, 0 26px 56px -36px var(--shadow-card);
          transition: box-shadow .5s ease, border-color .45s ease; }
        [data-theme="dark"] .mt-card { background: linear-gradient(160deg, rgba(255,255,255,0.05), transparent 55%), linear-gradient(160deg, #1b262d, #141c22); border-color: rgba(255,255,255,0.09); }
        .mt-link:hover .mt-card { border-color: color-mix(in srgb, var(--electric) 46%, var(--hair));
          box-shadow: 0 1px 0 rgba(255,255,255,0.07) inset, 0 46px 92px -40px var(--shadow-card), 0 0 0 1px color-mix(in srgb, var(--electric) 24%, transparent); }
        .mt-rim { position: absolute; inset: 0; z-index: 5; border-radius: inherit; padding: 1px; pointer-events: none; opacity: 0; transition: opacity .45s ease;
          background: linear-gradient(150deg, color-mix(in srgb, var(--electric) 70%, transparent), transparent 40%, color-mix(in srgb, var(--ember) 55%, transparent));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
        .mt-link:hover .mt-rim { opacity: 0.9; }
        .mt-glow { position: absolute; inset: 0; z-index: 4; pointer-events: none; opacity: 0; transition: opacity .4s ease; }
        .mt-link:hover .mt-glow { opacity: 1; }

        .mt-photo { position: relative; aspect-ratio: 4 / 5; overflow: hidden; background: var(--ink); }
        .mt-photo-mask { position: absolute; inset: 0; will-change: clip-path, transform; }
        .mt-photo img { width: 100%; height: 100%; object-fit: cover; object-position: center 18%; display: block;
          filter: saturate(1.04) contrast(1.03); transition: transform .9s var(--ease-out-quart), filter .6s ease; }
        .mt-link:hover .mt-photo img { transform: scale(1.06) !important; filter: saturate(1.12) contrast(1.05); }
        .mt-photo-scrim { position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background: linear-gradient(to top, color-mix(in srgb, var(--ink) 78%, transparent) 0%, transparent 42%); }
        .mt-sheen { position: absolute; inset: 0; z-index: 3; pointer-events: none; transform: translateX(-120%) skewX(-18deg);
          background: linear-gradient(100deg, transparent, rgba(255,255,255,0.22), transparent); transition: transform .9s var(--ease-out-expo); }
        .mt-link:hover .mt-sheen { transform: translateX(120%) skewX(-18deg); }
        .mt-num { position: absolute; z-index: 3; top: 14px; left: 15px; font-family: var(--font-display); font-weight: 600; font-size: 30px; line-height: 1;
          color: #F4F1EA; text-shadow: 0 2px 18px rgba(0,0,0,0.5); opacity: 0.9; }
        .mt-rolechip { position: absolute; z-index: 3; bottom: 13px; left: 14px; display: inline-flex; align-items: center;
          font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase; color: #F3EEE2;
          background: rgba(10,14,15,0.5); border: 1px solid rgba(243,238,226,0.16); padding: 6px 11px; border-radius: 999px;
          backdrop-filter: blur(7px); -webkit-backdrop-filter: blur(7px); }

        .mt-body { position: relative; z-index: 3; display: flex; flex-direction: column; padding: clamp(18px, 1.9vw, 25px); }
        .mt-name { font-family: var(--font-display); color: var(--bone); font-size: clamp(21px, 1.6vw, 26px); line-height: 1.08; letter-spacing: -0.012em; }
        .mt-line { display: block; overflow: hidden; padding-bottom: 0.06em; }
        .mt-line > span { display: inline-block; will-change: transform; }
        .mt-tag { color: var(--smoke); font-size: 14px; line-height: 1.55; margin-top: 12px; }
        .mt-view { display: inline-flex; align-items: center; gap: 8px; margin-top: clamp(16px, 1.7vw, 22px);
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--bone); transition: color .3s ease; }
        .mt-link:hover .mt-view { color: var(--electric); }
        .mt-arrow { font-size: 18px; transition: transform .4s var(--ease-out-expo); }
        .mt-link:hover .mt-arrow { transform: translateX(5px); }

        .mt-cta { position: relative; z-index: 2; display: flex; justify-content: center; margin-top: clamp(38px, 4.4vw, 60px); }

        @media (prefers-reduced-motion: reduce) {
          .mt-link, .mt-card, .mt-photo img, .mt-sheen, .mt-arrow, .mt-rim, .mt-glow { transition: none; }
          .mt-link:hover { transform: none; }
          .mt-link:hover .mt-photo img { transform: none !important; }
        }

        /* MOBILE — horizontal snap carousel (≤640px only; desktop grid untouched) */
        @media (max-width: 640px) {
          .mt-grid { display: flex; flex-wrap: nowrap; overflow-x: auto; overflow-y: visible;
            scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; gap: 14px;
            scroll-padding-inline: 0; padding-bottom: 12px; max-width: 100%;
            -ms-overflow-style: none; scrollbar-width: none; }
          .mt-grid::-webkit-scrollbar { display: none; }
          .mt-cell { flex: 0 0 82%; scroll-snap-align: start; min-width: 0; margin-top: 0 !important; }
        }
      `}</style>

      {/* layered background */}
      <motion.div className="mt-bg" aria-hidden="true" style={{ y: bgY }}>
        <span className="mt-orb mt-orb-1" />
        <span className="mt-orb mt-orb-2" />
        <span className="mt-dots" />
        <span className="mt-grain" />
      </motion.div>

      <div className="shell relative">
        {/* heading */}
        <div className="mt-head" ref={headRef}>
          <motion.span className="mt-eyebrow"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }} animate={headIn ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EXPO }}>
            <span className="dot" aria-hidden="true" />Meet the team
          </motion.span>
          <h2 className="mt-title">
            <span className="ln"><motion.span initial="hidden" animate={headIn ? 'show' : 'hidden'} variants={wordV} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.1 }}>The people behind</motion.span></span>
            <span className="ln"><motion.span className="mt-ital" initial="hidden" animate={headIn ? 'show' : 'hidden'} variants={wordV} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.18 }}>the standard.</motion.span></span>
          </h2>
          <motion.p className="mt-sub"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(4px)' }} animate={headIn ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}} transition={{ duration: 0.7, delay: 0.3, ease: EXPO }}>
            The leaders who bring our values to life every day — building trusted customer experiences across every campaign.
          </motion.p>
        </div>

        {/* cards */}
        <div className="mt-grid">
          {members.map((m, i) => <TeamCard key={m.slug} m={m} i={i} reduce={reduce} />)}
        </div>

        {/* CTA */}
        <div className="mt-cta">
          <MagneticButton to="/team" variant="outline">View all team members</MagneticButton>
        </div>
      </div>
    </section>
  );
}
