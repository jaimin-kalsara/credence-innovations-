import { useRef, useState, useEffect, useCallback, Fragment } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, useSpring, useVelocity, useTime } from 'framer-motion';
import { StageIcon } from './FourStepModel';
import { FIELD, CREW } from '../data/media';
import MagneticButton from './MagneticButton';

/* ============================================================================
   WorkflowJourney — "How We Work" (Framer Motion, no GSAP)

   A luxury zig-zag of four pinned process cards joined by a hand-drawn thread
   that attaches EXACTLY to each card's pin (the path is measured live from the
   real pin centres, so it's pixel-perfect and re-measures on resize/entrance).
   The thread sits BEHIND the cards (it only shows in the gaps) and runs cleanly
   from the first pin to the final "Ready to scale" note.

   Each card holds its existing stage photo, sits pinned, and SWINGS gently like
   a hanging print — the swing pivots exactly on the pin, so the pin never moves
   and the thread stays attached. Cards spring in on view, lift + tilt to the
   cursor, and zoom their photo on hover. Theme-adaptive, no GSAP.
============================================================================ */

const EXPO = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 120, damping: 20, mass: 1 };
const PHOTOS = [FIELD[8] || CREW[0], FIELD[5] || CREW[1], CREW[0], CREW[1]];

const STEPS = [
  { n: '01', title: 'Market Entry', body: 'We land your brand on the floor — where buying actually happens.', visual: 'rep', side: 'right', img: PHOTOS[0] },
  { n: '02', title: 'Retail Access', body: "One pass into Walmart, Target, Costco, Lowe's & BJ's.", visual: 'doors', side: 'left', img: PHOTOS[1] },
  { n: '03', title: 'National Reach', body: 'Ninety-nine percent of America — one network, coast to coast.', visual: 'map', side: 'right', img: PHOTOS[2] },
  { n: '04', title: 'National Scale', body: 'What wins in one store, we replicate across hundreds.', visual: 'scale', side: 'left', img: PHOTOS[3] },
];

function StepCard({ step, index, reduce, registerPin, onSettled, swing }) {
  const ref = useRef(null);
  // scroll-driven pendulum: shared scroll swing × per-card direction + a tiny idle sway
  const time = useTime();
  const mult = (step.side === 'right' ? 1 : -1) * (0.85 + index * 0.07);
  const idle = useTransform(time, (t) => Math.sin(t / 1600 + index * 1.6) * 0.5);
  const swingRot = useTransform([swing, idle], ([s, i]) => s * mult + i);
  const onMove = (e) => {
    if (reduce) return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', ((px - 0.5) * 6).toFixed(2) + 'deg');
    el.style.setProperty('--rx', ((py - 0.5) * -6).toFixed(2) + 'deg');
    el.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
    el.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg');
  };
  return (
    <motion.div
      className={`wf-card-pos wf-card-pos--${step.side}`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.92, rotate: step.side === 'right' ? 5 : -5, filter: 'blur(8px)' }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, rotate: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-90px' }}
      transition={reduce ? { duration: 0.5 } : { ...SPRING, delay: 0.05 }}
      onAnimationComplete={onSettled}
    >
      {/* swing pivots on the pin so the pin never moves; rotation = scroll velocity (gravity) + tiny idle */}
      <motion.div className="wf-card-swing" style={reduce ? undefined : { rotate: swingRot }}>
        <div ref={ref} className="wf-card" onPointerMove={onMove} onPointerLeave={onLeave} tabIndex={0}>
          <span className="wf-pin" ref={(el) => registerPin(index, el)} aria-hidden="true" />
          {!reduce && <span className="wf-glare" aria-hidden="true" />}

          <div className="wf-photo">
            <img src={step.img} alt="" loading="lazy" />
            <span className="wf-photo-grad" aria-hidden="true" />
            <span className="wf-num">{step.n}</span>
          </div>
          <div className="wf-card-body">
            <div className="wf-card-top">
              <span className="wf-ic" aria-hidden="true"><StageIcon name={step.visual} size={18} /></span>
              <h3 className="wf-title">{step.title}</h3>
            </div>
            <p className="wf-body">{step.body}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function WorkflowJourney({
  eyebrow = 'How we work',
  headline = [{ t: 'From one store' }, { t: 'to' }, { t: 'every state.', hi: true }],
  subhead = 'A proven four-stage rollout — built to compound, market by market. Follow the thread from a single store floor to a nationwide network.',
  cta = { label: 'See the full model', to: '/what-we-do' },
} = {}) {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const flowRef = useRef(null);
  const endRef = useRef(null);
  const pinRefs = useRef([]);
  const [pathD, setPathD] = useState('');

  const { scrollYProgress: secProg } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(secProg, [0, 1], reduce ? ['0%', '0%'] : ['-5%', '5%']);
  const { scrollYProgress: flowProg } = useScroll({ target: flowRef, offset: ['start 78%', 'end 62%'] });
  const draw = reduce ? 1 : flowProg;

  /* gravity swing — scroll velocity drives the pendulum; an under-damped spring
     makes the cards overshoot and settle (a small sway) when the scroll stops. */
  const { scrollY } = useScroll();
  const scrollVel = useVelocity(scrollY);
  const swingTarget = useTransform(scrollVel, [-2600, 0, 2600], [5, 0, -5]); // clamped to ±5°
  const swing = useSpring(swingTarget, { stiffness: 52, damping: 11, mass: 0.85 });

  const registerPin = useCallback((i, el) => { pinRefs.current[i] = el; }, []);

  // build the thread from the live pin centres → pixel-perfect, attached to pins
  const measure = useCallback(() => {
    const flow = flowRef.current;
    const pins = pinRefs.current.filter(Boolean);
    if (!flow || pins.length < 2) return;
    const fr = flow.getBoundingClientRect();
    const pts = pins.map((el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2 - fr.left, y: r.top + r.height / 2 - fr.top }; });
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const mx = (a.x + b.x) / 2;            // bow the curve through the open centre gap
      d += ` C ${mx.toFixed(1)} ${a.y.toFixed(1)}, ${mx.toFixed(1)} ${b.y.toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    }
    const er = endRef.current?.getBoundingClientRect();
    if (er) {
      const ex = er.left + er.width / 2 - fr.left;
      const ey = er.top - fr.top - 8;
      const last = pts[pts.length - 1];
      const mx = (last.x + ex) / 2;
      d += ` C ${mx.toFixed(1)} ${last.y.toFixed(1)}, ${mx.toFixed(1)} ${ey.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`;
    }
    setPathD(d);
  }, []);

  useEffect(() => {
    measure();
    const t = [setTimeout(measure, 500), setTimeout(measure, 1200), setTimeout(measure, 2200)];
    window.addEventListener('resize', measure);
    return () => { t.forEach(clearTimeout); window.removeEventListener('resize', measure); };
  }, [measure]);

  const wordVar = reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : { hidden: { y: '115%' }, show: { y: '0%' } };

  return (
    <section ref={sectionRef} className="wf-section paper relative overflow-hidden pad-lg" aria-label="How we work">
      <style>{`
        .wf-section { background-color: var(--ink); }
        .wf-bg { display: none; position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
        .wf-orb { position: absolute; border-radius: 50%; filter: blur(84px); will-change: transform; }
        .wf-orb-1 { width: 30vw; max-width: 440px; aspect-ratio: 1; left: -8%; top: 8%;
          background: radial-gradient(circle, color-mix(in srgb, var(--electric) 16%, transparent), transparent 64%); }
        .wf-orb-2 { width: 26vw; max-width: 380px; aspect-ratio: 1; right: -6%; bottom: -4%;
          background: radial-gradient(circle, color-mix(in srgb, var(--ember) 12%, transparent), transparent 64%); }
        .wf-grid { position: absolute; inset: 0; opacity: 0.4;
          background-image: linear-gradient(color-mix(in srgb, var(--bone) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--bone) 6%, transparent) 1px, transparent 1px);
          background-size: 66px 66px;
          -webkit-mask: radial-gradient(circle at 50% 40%, #000, transparent 80%); mask: radial-gradient(circle at 50% 40%, #000, transparent 80%); }
        .wf-grain { position: absolute; inset: 0; opacity: 0.04; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 140px 140px; }
        .wf-spark { position: absolute; width: 5px; height: 5px; border-radius: 50%; opacity: 0;
          background: radial-gradient(circle, color-mix(in srgb, var(--electric) 85%, #fff), transparent 70%);
          box-shadow: 0 0 9px color-mix(in srgb, var(--electric) 55%, transparent); }
        .wf-spark-1 { left: 16%; top: 40%; animation: wf-tw 5.6s ease-in-out 0.4s infinite; }
        .wf-spark-2 { right: 18%; top: 30%; animation: wf-tw 6.8s ease-in-out 1.7s infinite; }
        .wf-spark-3 { left: 40%; bottom: 18%; animation: wf-tw 7.4s ease-in-out 2.6s infinite; }
        @keyframes wf-tw { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 0.7; transform: scale(1); } }

        /* header */
        .wf-head { position: relative; z-index: 2; max-width: 620px; }
        .wf-pill { display: inline-flex; align-items: center; gap: 9px; padding: 7px 15px 7px 11px; border-radius: 999px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--bone);
          background: color-mix(in srgb, var(--graphite) 58%, transparent); border: 1px solid color-mix(in srgb, var(--electric) 24%, var(--hair));
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.06); }
        .wf-pill .dot { position: relative; width: 7px; height: 7px; border-radius: 50%; background: var(--electric); }
        .wf-pill .dot::after { content: ''; position: absolute; inset: -4px; border-radius: 50%; background: var(--electric); opacity: 0.4; animation: wf-ping 2.4s var(--ease-out-quart) infinite; }
        @keyframes wf-ping { 0% { transform: scale(0.6); opacity: 0.5; } 70%, 100% { transform: scale(2.1); opacity: 0; } }
        .wf-h { font-family: var(--font-display); color: var(--bone); margin-top: clamp(16px, 2vw, 24px);
          line-height: 1.02; letter-spacing: -0.02em; font-size: clamp(34px, 4.4vw, 60px); }
        .wf-line { display: inline-block; overflow: hidden; vertical-align: bottom; padding: 0.02em 0.06em 0.12em; }
        .wf-line > span { display: inline-block; will-change: transform; }
        .wf-hi { font-style: italic; font-weight: 500;
          background: linear-gradient(100deg, var(--electric) 0%, #6FB6D9 52%, var(--electric) 100%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: var(--electric); }
        .wf-sub { color: var(--smoke); max-width: 46ch; margin-top: clamp(14px, 1.6vw, 20px); font-size: clamp(15px, 1.1vw, 17px); line-height: 1.62; }

        /* the zig-zag flow */
        .wf-flow { position: relative; z-index: 2; margin-top: clamp(34px, 4vw, 56px); max-width: 1080px; margin-inline: auto; }
        /* thread sits BEHIND the cards — only ever visible in the gaps */
        .wf-connectors { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; overflow: visible; }
        .wf-dots { fill: none; stroke: color-mix(in srgb, var(--electric) 58%, var(--hair)); stroke-width: 2; stroke-linecap: round;
          stroke-dasharray: 0.1 9; animation: wf-flowdash 2.6s linear infinite; }
        @keyframes wf-flowdash { to { stroke-dashoffset: -18.2; } }
        .wf-draw { fill: none; stroke: var(--electric); stroke-width: 1.4; opacity: 0.5; }

        .wf-row { position: relative; z-index: 2; display: grid; grid-template-columns: 1fr 1fr; column-gap: clamp(24px, 4vw, 60px);
          align-items: center; }
        .wf-card-pos { will-change: transform, opacity; width: min(100%, 350px); }
        .wf-card-pos--right { grid-column: 2; justify-self: end; }
        .wf-card-pos--left { grid-column: 1; justify-self: start; }
        .wf-card-swing { transform-origin: 50% -3px; will-change: transform; }

        .wf-card { position: relative; border-radius: 26px; padding: 13px; cursor: default;
          background: color-mix(in srgb, var(--graphite) 70%, transparent); border: 1px solid var(--hair);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 42px 90px -50px var(--shadow-card), 0 6px 18px -8px var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.06);
          transform: perspective(1100px) translateY(var(--lift, 0px)) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale(var(--sc, 1));
          transform-style: preserve-3d; transition: transform 0.45s var(--ease-out-quart), box-shadow 0.5s ease, border-color 0.5s ease; will-change: transform; }
        /* premium elevated card surface in dark mode — distinct from the deep background */
        [data-theme="dark"] .wf-card {
          background:
            linear-gradient(158deg, rgba(255,255,255,0.07), rgba(255,255,255,0.015) 44%, transparent 72%),
            linear-gradient(158deg, #1c272e 0%, #161f25 100%);
          border-color: rgba(255,255,255,0.11);
          box-shadow: 0 44px 92px -48px rgba(0,0,0,0.85), 0 8px 22px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08); }
        .wf-card::before { content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px; pointer-events: none; z-index: 3;
          background: linear-gradient(150deg, color-mix(in srgb, var(--bone) 26%, transparent), transparent 42%, color-mix(in srgb, var(--electric) 40%, transparent));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude;
          opacity: 0.4; transition: opacity 0.5s ease; }
        .wf-card:hover, .wf-card:focus-visible { --lift: -10px; --sc: 1.03; outline: none;
          border-color: color-mix(in srgb, var(--electric) 40%, var(--hair));
          box-shadow: 0 60px 110px -48px var(--shadow-card), 0 0 0 1px color-mix(in srgb, var(--electric) 24%, transparent),
            0 30px 80px -30px color-mix(in srgb, var(--electric) 40%, transparent), inset 0 1px 0 rgba(255,255,255,0.08); }
        .wf-card:hover::before, .wf-card:focus-visible::before { opacity: 0.9; }
        .wf-glare { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 4; opacity: 0; transition: opacity 0.4s ease;
          background: radial-gradient(360px circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.12), transparent 60%); }
        .wf-card:hover .wf-glare { opacity: 1; }

        /* the pin */
        .wf-pin { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); width: 20px; height: 20px; border-radius: 50%; z-index: 5;
          background: radial-gradient(circle at 34% 28%, #ffffff, var(--electric) 46%, color-mix(in srgb, var(--electric) 55%, #000) 100%);
          box-shadow: 0 4px 8px -1px rgba(0,0,0,0.4), 0 0 0 4px color-mix(in srgb, var(--electric) 12%, transparent), inset 0 1px 2px rgba(255,255,255,0.7); }
        .wf-pin::after { content: ''; position: absolute; left: 50%; top: 15px; width: 1px; height: 10px; transform: translateX(-50%);
          background: linear-gradient(180deg, color-mix(in srgb, var(--electric) 40%, transparent), transparent); }

        /* photo (existing stage image) */
        .wf-photo { position: relative; border-radius: 16px; overflow: hidden; aspect-ratio: 16 / 10; }
        .wf-photo img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.7s var(--ease-out-expo); }
        .wf-card:hover .wf-photo img { transform: scale(1.06); }
        .wf-photo-grad { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(to top, rgba(6,9,12,0.55), transparent 50%); }
        .wf-num { position: absolute; right: 12px; bottom: 8px; font-family: var(--font-display); font-weight: 600; font-size: clamp(26px, 2.6vw, 38px); line-height: 1;
          color: transparent; -webkit-text-stroke: 1px rgba(243,238,226,0.85); }

        .wf-card-body { padding: clamp(14px, 1.4vw, 18px) clamp(8px, 1vw, 12px) clamp(6px, 0.8vw, 8px); }
        .wf-card-top { display: flex; align-items: center; gap: 11px; }
        .wf-ic { width: 36px; height: 36px; border-radius: 11px; display: grid; place-items: center; flex: none;
          background: var(--brand-soft); border: 1px solid var(--hair); color: var(--electric); transition: transform 0.4s var(--ease-out-expo); }
        .wf-card:hover .wf-ic { transform: translateY(-2px) scale(1.06); }
        .wf-title { font-family: var(--font-display); font-weight: 600; color: var(--bone); font-size: clamp(20px, 1.8vw, 26px); line-height: 1.1; letter-spacing: -0.01em; }
        .wf-body { color: var(--smoke); font-size: clamp(13px, 1vw, 14.5px); line-height: 1.55; margin-top: 9px; }

        /* end accent + CTA */
        .wf-end { position: relative; z-index: 2; text-align: center; margin-top: clamp(40px, 5vw, 64px); }
        .wf-end-note { font-family: var(--font-display); font-style: italic; color: var(--electric); font-size: clamp(22px, 2.6vw, 36px); letter-spacing: -0.01em; }
        .wf-cta { margin-top: clamp(26px, 3vw, 38px); }

        @media (max-width: 760px) {
          .wf-flow { max-width: 440px; }
          .wf-row { grid-template-columns: 1fr; margin-bottom: clamp(26px, 7vw, 38px); }
          .wf-card-pos--right, .wf-card-pos--left { grid-column: 1; justify-self: stretch; width: 100%; }
          .wf-connectors { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wf-spark, .wf-card-swing, .wf-dots, .wf-pill .dot::after, .wf-ic, .wf-photo img { animation: none !important; }
          .wf-spark { display: none; }
          .wf-card { transition: none; }
        }

        /* MOBILE — horizontal snap carousel (≤640px only; desktop zig-zag untouched) */
        @media (max-width: 640px) {
          .wf-flow { display: flex; flex-wrap: nowrap; overflow-x: auto; overflow-y: visible;
            scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; gap: 14px;
            scroll-padding-inline: 0; padding-bottom: 12px; max-width: 100%; margin-inline: 0;
            -ms-overflow-style: none; scrollbar-width: none; }
          .wf-flow::-webkit-scrollbar { display: none; }
          .wf-flow > .wf-row { flex: 0 0 86%; scroll-snap-align: start; min-width: 0; margin-bottom: 0; }
          .wf-card-pos--right, .wf-card-pos--left { width: 100%; }
        }
      `}</style>

      {/* layered background */}
      <motion.div className="wf-bg" aria-hidden="true" style={{ y: bgY }}>
        <motion.span className="wf-orb wf-orb-1"
          animate={reduce ? undefined : { x: ['-3%', '6%', '-3%'], y: ['2%', '-5%', '2%'] }} transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.span className="wf-orb wf-orb-2"
          animate={reduce ? undefined : { x: ['3%', '-6%', '3%'], y: ['-2%', '5%', '-2%'] }} transition={{ duration: 33, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="wf-grid" />
        <div className="wf-grain" />
        <span className="wf-spark wf-spark-1" /><span className="wf-spark wf-spark-2" /><span className="wf-spark wf-spark-3" />
      </motion.div>

      <div className="shell relative">
        {/* header */}
        <div className="wf-head">
          <motion.span className="wf-pill"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, ease: EXPO }}>
            <span className="dot" aria-hidden="true" />{eyebrow}</motion.span>
          <motion.h2 className="wf-h" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
            transition={{ staggerChildren: 0.07, delayChildren: 0.08 }}>
            {headline.map((seg, i) => (
              <Fragment key={i}>
                <span className="wf-line"><motion.span className={seg.hi ? 'wf-hi' : undefined} variants={wordVar} transition={reduce ? { duration: 0.5 } : SPRING}>{seg.t}</motion.span></span>{i < headline.length - 1 ? ' ' : ''}
              </Fragment>
            ))}
          </motion.h2>
          <motion.p className="wf-sub"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.4, ease: EXPO }}>
            {subhead}
          </motion.p>
        </div>

        {/* zig-zag cards + the pin-attached thread */}
        <div ref={flowRef} className="wf-flow">
          <svg className="wf-connectors" aria-hidden="true">
            {pathD && <path className="wf-dots" d={pathD} />}
            {pathD && <motion.path className="wf-draw" d={pathD} style={{ pathLength: draw }} />}
          </svg>

          {STEPS.map((step, i) => (
            <div className={`wf-row wf-row--${step.side}`} key={step.n}>
              <StepCard step={step} index={i} reduce={reduce} registerPin={registerPin} onSettled={measure} swing={swing} />
            </div>
          ))}
        </div>

        {/* end accent + CTA */}
        <motion.div className="wf-end"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: EXPO }}>
          <span className="wf-end-note" ref={endRef}>Ready to scale nationwide.</span>
          {cta && (
            <div className="wf-cta">
              <MagneticButton variant="outline" to={cta.to}>{cta.label}</MagneticButton>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
