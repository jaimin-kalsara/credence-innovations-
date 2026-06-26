import { useRef, useEffect } from 'react';
import {
  motion, useReducedMotion, animate,
  useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, useInView,
} from 'framer-motion';
import MagneticButton from './MagneticButton';
import DrawUnderline from './DrawUnderline';
import StampBadge from './StampBadge';
import { getMember } from '../data/team';

/* ============================================================================
   FounderSpotlight — the founder, as an editorial magazine spread.

   Quote-led and deliberately un-boxy: a giant pull-quote, an arch-framed
   portrait that dissolves into the page (no hard card), floating glass award
   callouts, count-up stats separated by hairlines (not boxes), a signature,
   and a huge parallaxing "2016" watermark. Cinematic scroll choreography:
   line-mask quote reveal, portrait clip + parallax, staggered chip pops,
   3D cursor-tilt with a mouse-following glow. Theme-adaptive · no GSAP.
============================================================================ */

const EXPO = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 130, damping: 21, mass: 1 };

function CountUp({ to, suffix = '' }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => Math.round(v).toLocaleString());
  useEffect(() => {
    if (!inView) return undefined;
    if (reduce) { mv.set(to); return undefined; }
    const controls = animate(mv, to, { duration: 1.4, ease: EXPO });
    return () => controls.stop();
  }, [inView, to, reduce, mv]);
  return <span ref={ref} className="fs-stat-n"><motion.span>{text}</motion.span>{suffix}</span>;
}

export default function FounderSpotlight() {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const headIn = useInView(headRef, { once: true, margin: '-12% 0px' });
  const awards = getMember('abby-caudill')?.awards ?? [];

  // scroll choreography
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const markY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['12%', '-12%']); // watermark
  const portraitY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [46, -46]);
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-7%', '7%']);
  const c1 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -34]);
  const c2 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-30, 44]);
  const c3 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [50, -28]);

  // 3D tilt + cursor glow on the portrait
  const mx = useMotionValue(0.5); const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), SPRING);
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), SPRING);
  const gx = useTransform(mx, (v) => `${(v * 100).toFixed(1)}%`);
  const gy = useTransform(my, (v) => `${(v * 100).toFixed(1)}%`);
  const glow = useMotionTemplate`radial-gradient(280px circle at ${gx} ${gy}, color-mix(in srgb, var(--electric) 30%, transparent), transparent 60%)`;
  const onMove = (e) => { if (reduce) return; const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height); };
  const onLeave = () => { mx.set(0.5); my.set(0.5); };

  const lineV = reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : { hidden: { y: '118%' }, show: { y: '0%' } };
  const up = (delay = 0, margin = '-12%') => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 22, filter: 'blur(5px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin },
    transition: { duration: 0.7, delay, ease: EXPO },
  });
  const chip = (delay) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 14 },
    animate: headIn ? { opacity: 1, scale: 1, y: 0 } : {},
    transition: reduce ? { duration: 0.5, delay } : { ...SPRING, delay },
  });

  const CHIPS = [
    { y: c1, cls: 'fs-c-award', icon: 'trophy', n: 'Owner of the Year', l: '2022 · national recognition' },
    { y: c2, cls: 'fs-c-consult', icon: 'star', n: 'National Consultant', l: 'Class of 2025' },
    { y: c3, cls: 'fs-c-since', icon: 'flag', n: 'On the floor since 2016', l: 'Still on it' },
  ];

  return (
    <section ref={sectionRef} className="fs-section paper relative overflow-hidden pad-lg" aria-label="The founder">
      <style>{`
        .fs-section { isolation: isolate; background-color: var(--ink); }
        .fs-bg { display: none; position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
        .fs-orb { position: absolute; border-radius: 50%; filter: blur(92px); }
        .fs-orb-1 { width: 36vw; max-width: 540px; aspect-ratio: 1; right: -6%; top: -4%; background: radial-gradient(circle, color-mix(in srgb, var(--electric) 15%, transparent), transparent 64%); }
        .fs-orb-2 { width: 32vw; max-width: 460px; aspect-ratio: 1; left: -8%; bottom: -8%; background: radial-gradient(circle, color-mix(in srgb, var(--ember) 12%, transparent), transparent 64%); }
        .fs-grain { position: absolute; inset: 0; opacity: 0.035; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 140px 140px; }
        .fs-mark { position: absolute; z-index: 0; right: clamp(-30px, 1vw, 40px); top: 8%; font-family: var(--font-display); font-weight: 600;
          font-size: clamp(190px, 30vw, 460px); line-height: 0.8; letter-spacing: -0.04em; pointer-events: none; user-select: none;
          color: transparent; -webkit-text-stroke: 1.4px color-mix(in srgb, var(--bone) 12%, transparent); opacity: 0.7; }

        .fs-inner { position: relative; z-index: 2; }

        /* hero quote */
        .fs-eyebrow { display: inline-flex; align-items: center; gap: 9px; padding: 7px 15px; border-radius: 999px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--bone);
          background: color-mix(in srgb, var(--graphite) 52%, transparent); border: 1px solid color-mix(in srgb, var(--ember) 26%, var(--hair)); }
        .fs-eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ember); box-shadow: 0 0 10px var(--ember); }
        .fs-quote { position: relative; font-family: var(--font-display); color: var(--bone); line-height: 1.06; letter-spacing: -0.018em;
          font-size: clamp(29px, 4.1vw, 58px); max-width: 20ch; margin-top: clamp(20px, 2.2vw, 30px); }
        .fs-quote .fs-q { font-style: normal; font-weight: 600; color: color-mix(in srgb, var(--ember) 88%, transparent); }
        .fs-quote .fs-q-open { margin-right: 0.04em; }
        .fs-quote .fs-q-close { margin-left: 0.02em; }
        .fs-ln { display: block; overflow: hidden; padding: 0.04em 0.04em 0.1em; }
        .fs-ln > span { display: inline-block; will-change: transform; }
        .fs-accent { font-style: italic; font-weight: 500;
          background: linear-gradient(100deg, var(--electric), #6FB6D9 55%, var(--electric)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: var(--electric); }

        /* the spread */
        .fs-spread { display: grid; grid-template-columns: 1fr; gap: clamp(48px, 6vw, 70px); margin-top: clamp(40px, 5vw, 66px); align-items: center; }
        @media (min-width: 1024px) {
          .fs-spread { grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr); column-gap: clamp(56px, 6vw, 96px); align-items: center; }
        }

        /* portrait — arch frame that dissolves into the page (no hard box) */
        .fs-figure { position: relative; perspective: 1200px; }
        .fs-aura { position: absolute; inset: -8% -6% -2%; z-index: 0; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle at 50% 36%, color-mix(in srgb, var(--electric) 18%, transparent), transparent 62%); filter: blur(48px); }
        .fs-portrait { position: relative; z-index: 2; aspect-ratio: 4 / 5; max-width: 440px; margin-inline: auto;
          border-radius: clamp(120px, 21vw, 210px) clamp(120px, 21vw, 210px) 26px 26px; overflow: hidden; transform-style: preserve-3d; will-change: transform;
          box-shadow: 0 50px 110px -52px var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.07); cursor: pointer; -webkit-tap-highlight-color: transparent; }
        .fs-portrait img { position: absolute; inset: 0; width: 100%; height: 108%; object-fit: cover; object-position: center 16%; display: block;
          filter: saturate(1.05) contrast(1.03); transition: transform .9s var(--ease-out-quart); }
        .fs-portrait:hover img { transform: scale(1.045); }
        .fs-fade { position: absolute; inset: 0; z-index: 3; pointer-events: none;
          background: linear-gradient(to top, var(--ink) 0%, color-mix(in srgb, var(--ink) 40%, transparent) 9%, transparent 26%); }
        .fs-rim { position: absolute; inset: 0; z-index: 4; border-radius: inherit; padding: 1px; pointer-events: none; opacity: 0.55; transition: opacity .5s ease;
          background: linear-gradient(160deg, rgba(255,255,255,0.5), transparent 40%, color-mix(in srgb, var(--electric) 50%, transparent));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
        .fs-portrait:hover .fs-rim { opacity: 1; }
        .fs-pglow { position: absolute; inset: 0; z-index: 5; pointer-events: none; opacity: 0; transition: opacity .4s ease; mix-blend-mode: screen; }
        .fs-portrait:hover .fs-pglow { opacity: 1; }
        .fs-stamp { position: absolute; z-index: 7; left: -10px; bottom: 30px; }

        /* floating glass award callouts */
        .fs-chip { position: absolute; z-index: 6; }
        .fs-card { display: flex; align-items: center; gap: 11px; padding: 11px 15px 11px 12px; border-radius: 15px; white-space: nowrap;
          background: color-mix(in srgb, var(--graphite) 66%, transparent); border: 1px solid var(--hair);
          backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); box-shadow: 0 26px 54px -34px var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.07); }
        [data-theme="dark"] .fs-card { background: linear-gradient(158deg, rgba(255,255,255,0.05), transparent 58%), linear-gradient(158deg, #1b262d, #151d23); border-color: rgba(255,255,255,0.1); }
        .fs-idle { display: inline-block; animation: fs-float 7s ease-in-out infinite; }
        @keyframes fs-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .fs-card-ic { width: 34px; height: 34px; border-radius: 10px; flex: none; display: grid; place-items: center;
          background: color-mix(in srgb, var(--ember) 16%, transparent); color: var(--ember); }
        .fs-card-ic svg { width: 17px; height: 17px; }
        .fs-card-n { font-family: var(--font-display); font-weight: 600; color: var(--bone); font-size: 15px; line-height: 1.1; }
        .fs-card-l { display: block; font-family: 'JetBrains Mono', monospace; font-size: 8.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--smoke); margin-top: 4px; }
        .fs-c-award  { top: 6%; right: -8%; }
        .fs-c-consult { top: 46%; left: -16%; }
        .fs-c-since  { bottom: 12%; right: -12%; }
        @media (max-width: 1023px) { .fs-chip, .fs-stamp { display: none; } }

        /* editorial detail column — un-boxed */
        .fs-story { color: var(--smoke); font-size: clamp(15px, 1.12vw, 17.5px); line-height: 1.62; max-width: 50ch; }
        .fs-sign { display: flex; align-items: center; gap: 16px; margin-top: clamp(26px, 3vw, 36px); }
        .fs-sign-rule { width: 40px; height: 1px; background: var(--electric); flex: none; }
        .fs-sign-name { font-family: var(--font-display); font-style: italic; color: var(--bone); font-size: clamp(28px, 2.8vw, 40px); line-height: 1; }
        .fs-sign-role { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--smoke); margin-top: 7px; }

        .fs-stats { display: flex; flex-wrap: wrap; gap: clamp(20px, 3vw, 46px); margin-top: clamp(28px, 3.2vw, 40px); }
        .fs-stat { position: relative; padding-left: clamp(18px, 2vw, 28px); }
        .fs-stat::before { content: ''; position: absolute; left: 0; top: 6px; bottom: 6px; width: 1px; background: linear-gradient(var(--electric), transparent); opacity: 0.6; }
        .fs-stat:first-child { padding-left: 0; }
        .fs-stat:first-child::before { display: none; }
        .fs-stat-n { font-family: var(--font-display); font-weight: 600; color: var(--bone); font-size: clamp(30px, 3.3vw, 46px); line-height: 1; letter-spacing: -0.02em; }
        .fs-stat-l { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--smoke); margin-top: 9px; line-height: 1.4; max-width: 14ch; }

        .fs-rec { display: flex; flex-wrap: wrap; gap: 9px 20px; margin-top: clamp(26px, 3vw, 36px); }
        .fs-rec-item { display: inline-flex; align-items: center; gap: 9px; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--smoke); }
        .fs-rec-item .rd { width: 5px; height: 5px; border-radius: 50%; background: var(--ember); flex: none; }

        .fs-cta { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 26px; margin-top: clamp(30px, 3.4vw, 42px);
          padding-top: clamp(24px, 2.6vw, 32px); border-top: 1px solid var(--hair); }
        .fs-cta-note { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--smoke); }

        @media (prefers-reduced-motion: reduce) {
          .fs-idle { animation: none; }
          .fs-portrait img, .fs-rim, .fs-pglow { transition: none; }
        }
      `}</style>

      {/* background */}
      <div className="fs-bg" aria-hidden="true">
        <span className="fs-orb fs-orb-1" />
        <span className="fs-orb fs-orb-2" />
        <span className="fs-grain" />
      </div>
      <motion.span className="fs-mark" aria-hidden="true" style={{ y: markY }}>2016</motion.span>

      <div className="shell fs-inner">
        {/* hero quote */}
        <div ref={headRef}>
          <motion.span className="fs-eyebrow"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }} animate={headIn ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EXPO }}>
            <span className="dot" aria-hidden="true" />The founder · Abby Caudill
          </motion.span>
          <blockquote className="fs-quote">
            <span className="fs-ln"><motion.span initial="hidden" animate={headIn ? 'show' : 'hidden'} variants={lineV} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.1 }}><span className="fs-q fs-q-open" aria-hidden="true">&ldquo;</span>We don&apos;t chase sales.</motion.span></span>
            <span className="fs-ln"><motion.span initial="hidden" animate={headIn ? 'show' : 'hidden'} variants={lineV} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.18 }}>We earn trust — through</motion.span></span>
            <span className="fs-ln"><motion.span initial="hidden" animate={headIn ? 'show' : 'hidden'} variants={lineV} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.26 }}>people who treat your</motion.span></span>
            <span className="fs-ln"><motion.span initial="hidden" animate={headIn ? 'show' : 'hidden'} variants={lineV} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.34 }}>brand like{' '}
              <DrawUnderline color="var(--electric)"><span className="fs-accent">their own name&apos;s on it.</span></DrawUnderline><span className="fs-q fs-q-close" aria-hidden="true">&rdquo;</span></motion.span></span>
          </blockquote>
        </div>

        {/* spread */}
        <div className="fs-spread">
          {/* portrait */}
          <motion.div className="fs-figure" style={reduce ? undefined : { y: portraitY }}>
            <span className="fs-aura" aria-hidden="true" />
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08 }}
              animate={headIn ? { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', scale: 1 } : {}}
              transition={{ duration: 1, ease: EXPO, delay: 0.12 }}
              className="fs-portrait" data-cursor="expand"
              onMouseMove={onMove} onMouseLeave={onLeave}
              style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 1100 }}>
              <motion.img src="/team/abby-caudill.png" alt="Abby Caudill, Founder of Credence Innovations" loading="lazy" draggable="false" style={reduce ? undefined : { y: imgY }} />
              <span className="fs-fade" aria-hidden="true" />
              <span className="fs-rim" aria-hidden="true" />
              {!reduce && <motion.span className="fs-pglow" aria-hidden="true" style={{ background: glow }} />}
            </motion.div>

            <div className="fs-stamp" aria-hidden="true">
              <motion.div initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: -28 }} animate={headIn ? { opacity: 1, scale: 1, rotate: 0 } : {}} transition={reduce ? { duration: 0.5, delay: 0.5 } : { ...SPRING, delay: 0.55 }}>
                <StampBadge topText="TEN YEARS" bottomText="ZERO FAILED" center="EST '16" color="var(--ember)" size={104} rotate={-9} />
              </motion.div>
            </div>

            {CHIPS.map((c, i) => (
              <motion.div key={c.cls} className={`fs-chip ${c.cls}`} style={reduce ? undefined : { y: c.y }}>
                <motion.div {...chip(0.6 + i * 0.1)}>
                  <span className="fs-idle"><span className="fs-card">
                    <span className="fs-card-ic">
                      {c.icon === 'trophy' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="5" /><path d="M8.5 13.4 L7 21 l5-2.6 5 2.6 -1.5-7.6" /></svg>}
                      {c.icon === 'star' && <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.7 5.9 6.3.7-4.7 4.3 1.3 6.2L12 16.9 6.1 19.6l1.3-6.2L2.7 9.1l6.3-.7z" /></svg>}
                      {c.icon === 'flag' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22V4M5 4h11l-2 4 2 4H5" /></svg>}
                    </span>
                    <span><span className="fs-card-n">{c.n}</span><span className="fs-card-l">{c.l}</span></span>
                  </span></span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* detail */}
          <div className="fs-detail">
            <motion.p className="fs-story" {...up(0)}>
              Abby moved from Kentucky for a single floor job in 2016 — and never looked back. She built Credence
              on one rule she won&apos;t bend: only field a team you&apos;d be proud to put in front of your own
              customers. Every rep is trained to that standard, because every campaign carries her name.
            </motion.p>

            <motion.div className="fs-sign" {...up(0.08)}>
              <span className="fs-sign-rule" aria-hidden="true" />
              <div>
                <div className="fs-sign-name">Abby Caudill</div>
                <div className="fs-sign-role">Founder · On the floor since 2016</div>
              </div>
            </motion.div>

            <motion.div className="fs-stats" {...up(0.14)}>
              <div className="fs-stat"><CountUp to={10} suffix="+" /><div className="fs-stat-l">Years on the floor</div></div>
              <div className="fs-stat"><CountUp to={450} suffix="+" /><div className="fs-stat-l">Reps trained</div></div>
              <div className="fs-stat"><CountUp to={99} suffix="%" /><div className="fs-stat-l">U.S. population reach</div></div>
            </motion.div>

            <motion.div className="fs-rec" {...up(0.2)}>
              {awards.map((a) => (
                <span key={a} className="fs-rec-item"><span className="rd" aria-hidden="true" />{a}</span>
              ))}
            </motion.div>

            <motion.div className="fs-cta" {...up(0.26)}>
              <MagneticButton to="/team/abby-caudill">View Abby&apos;s full profile</MagneticButton>
              <span className="fs-cta-note">A decade on the floor — still on it.</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
