import { useRef, useState } from 'react';
import {
  motion, useReducedMotion, useScroll, useTransform, useSpring, useMotionValueEvent,
} from 'framer-motion';
import { STAGES, StageGraphic, StageIcon } from './FourStepModel';
import MagneticButton from './MagneticButton';

/* ============================================================================
   ProcessJourney — "How We Work" (Framer Motion, no GSAP)

   A cinematic vertical scroll-story of the four-stage rollout. A glowing spine
   draws itself down the centre as you scroll (Framer pathLength/scaleY tied to
   useScroll), a comet rides its head, and four glassmorphism process cards sit
   alternately left/right — each springs in on view, lights up when the journey
   reaches it, and stays "completed" behind you while future steps stay faded.
   Cards tilt to the cursor with a light reflection and a soft sweep on hover.
   A layered, breathing background sits behind it all.

   Reuses the live StageGraphic dashboards (live feed → five doors → 99% map →
   replication grid) so the section literally demonstrates the workflow. Fully
   theme-adaptive, transform/opacity only, 60fps, prefers-reduced-motion aware.
============================================================================ */

const EXPO = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 120, damping: 20, mass: 1 };

const COPY = [
  { k: 'On the floor', line: 'We land your brand where buying actually happens.' },
  { k: 'Five doors', line: "One pass into Walmart, Target, Costco, Lowe's & BJ's." },
  { k: 'Coast to coast', line: 'Ninety-nine percent of America — one network deep.' },
  { k: 'Replication', line: 'What wins in one store, we run in hundreds.' },
];

function ProcessCard({ stage, copy, side, state, reduce }) {
  // state: 'future' | 'current' | 'done'
  const cardRef = useRef(null);
  const onMove = (e) => {
    if (reduce) return;
    const el = cardRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', ((px - 0.5) * 7).toFixed(2) + 'deg');
    el.style.setProperty('--rx', ((py - 0.5) * -7).toFixed(2) + 'deg');
    el.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
    el.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
  };
  const onLeave = () => {
    const el = cardRef.current; if (!el) return;
    el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg');
  };

  return (
    <motion.div
      className={`pj-card pj-card--${side} is-${state}`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 44, rotate: side === 'left' ? -1.4 : 1.4, filter: 'blur(8px)' }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0, rotate: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-90px' }}
      transition={reduce ? { duration: 0.5 } : SPRING}
    >
      <div ref={cardRef} className="pj-card-tilt" onPointerMove={onMove} onPointerLeave={onLeave}>
        {!reduce && <span className="pj-glare" aria-hidden="true" />}
        {!reduce && <span className="pj-sweep" aria-hidden="true" />}

        <div className="pj-card-head">
          <span className="pj-num">{stage.n}</span>
          <span className="pj-icon" aria-hidden="true"><StageIcon name={stage.visual} size={20} /></span>
          <span className="pj-head-txt">
            <span className="pj-kicker">{copy.k}</span>
            <h3 className="pj-title">{stage.title}</h3>
          </span>
        </div>

        <p className="pj-line">{copy.line}</p>

        <div className="pj-graphic">
          <StageGraphic visual={stage.visual} reduce={reduce} />
        </div>

        <p className="pj-body">{stage.body}</p>

        <div className="pj-foot">
          <span className="pj-cap">{stage.caption}</span>
          <span className="pj-bar" aria-hidden="true"><span className="pj-bar-fill" /></span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProcessJourney() {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const journeyRef = useRef(null);
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);

  // spine + comet driven by scroll through the journey
  const { scrollYProgress } = useScroll({ target: journeyRef, offset: ['start 64%', 'end 72%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.6 });
  const cometTop = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.02) setEntered(true);
    const i = Math.max(0, Math.min(STAGES.length - 1, Math.floor(v * STAGES.length)));
    setActive(i);
  });

  // background scroll parallax
  const { scrollYProgress: secProg } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(secProg, [0, 1], reduce ? ['0%', '0%'] : ['-5%', '5%']);

  const wordVar = reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : { hidden: { y: '115%' }, show: { y: '0%' } };

  return (
    <section ref={sectionRef} className="pj-section paper relative overflow-hidden pad-lg" aria-label="How we work">
      <style>{`
        .pj-section { background:
          radial-gradient(120% 70% at 50% -8%, color-mix(in srgb, var(--electric) 10%, transparent), transparent 56%),
          radial-gradient(60% 50% at 10% 70%, color-mix(in srgb, var(--ember) 6%, transparent), transparent 60%),
          radial-gradient(60% 50% at 92% 86%, color-mix(in srgb, var(--electric) 6%, transparent), transparent 60%),
          var(--ink); }

        /* layered background */
        .pj-bg { position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
        .pj-mesh { position: absolute; inset: -12%;
          background:
            radial-gradient(38% 32% at 18% 18%, color-mix(in srgb, var(--electric) 12%, transparent), transparent 70%),
            radial-gradient(40% 34% at 84% 64%, color-mix(in srgb, var(--ember) 8%, transparent), transparent 72%); }
        .pj-orb { position: absolute; border-radius: 50%; filter: blur(82px); will-change: transform; }
        .pj-orb-1 { width: 30vw; max-width: 440px; aspect-ratio: 1; left: -8%; top: 10%;
          background: radial-gradient(circle, color-mix(in srgb, var(--electric) 16%, transparent), transparent 64%); }
        .pj-orb-2 { width: 28vw; max-width: 400px; aspect-ratio: 1; right: -7%; top: 52%;
          background: radial-gradient(circle, color-mix(in srgb, var(--ember) 12%, transparent), transparent 64%); }
        .pj-grid { position: absolute; inset: 0; opacity: 0.4;
          background-image: linear-gradient(color-mix(in srgb, var(--bone) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--bone) 6%, transparent) 1px, transparent 1px);
          background-size: 64px 64px;
          -webkit-mask: radial-gradient(circle at 50% 30%, #000, transparent 76%); mask: radial-gradient(circle at 50% 30%, #000, transparent 76%); }
        .pj-grain { position: absolute; inset: 0; opacity: 0.04; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 140px 140px; }
        .pj-spark { position: absolute; width: 5px; height: 5px; border-radius: 50%; opacity: 0;
          background: radial-gradient(circle, color-mix(in srgb, var(--electric) 85%, #fff), transparent 70%);
          box-shadow: 0 0 9px color-mix(in srgb, var(--electric) 55%, transparent); will-change: opacity, transform; }
        .pj-spark-1 { left: 12%; top: 30%; animation: pj-tw 5.6s ease-in-out 0.4s infinite; }
        .pj-spark-2 { right: 14%; top: 24%; animation: pj-tw 6.8s ease-in-out 1.7s infinite; }
        .pj-spark-3 { left: 16%; bottom: 22%; animation: pj-tw 7.4s ease-in-out 2.6s infinite; }
        .pj-spark-4 { right: 18%; bottom: 30%; animation: pj-tw 6.1s ease-in-out 1.0s infinite; }
        @keyframes pj-tw { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 0.75; transform: scale(1); } }

        /* heading */
        .pj-head { position: relative; z-index: 2; text-align: center; max-width: 820px; margin-inline: auto; }
        .pj-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--electric); }
        .pj-eyebrow::before, .pj-eyebrow::after { content: ''; width: 24px; height: 1px; }
        .pj-eyebrow::before { background: linear-gradient(90deg, transparent, var(--electric)); }
        .pj-eyebrow::after { background: linear-gradient(90deg, var(--electric), transparent); }
        .pj-h { font-family: var(--font-display); color: var(--bone); margin-top: clamp(12px, 1.6vw, 18px);
          line-height: 1.0; letter-spacing: -0.02em; font-size: clamp(38px, 5.4vw, 72px); }
        .pj-line-clip { display: inline-block; overflow: hidden; vertical-align: bottom; padding: 0.04em 0.06em 0.12em; }
        .pj-line-clip > span { display: inline-block; will-change: transform; }
        .pj-ital { font-style: italic; font-weight: 500;
          background: linear-gradient(100deg, var(--electric) 0%, #6FB6D9 50%, var(--electric) 100%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: var(--electric); }
        .pj-sub { color: var(--smoke); max-width: 56ch; margin: clamp(14px, 1.6vw, 20px) auto 0; font-size: clamp(15px, 1.2vw, 18px); line-height: 1.6; }

        /* ── the journey ── */
        .pj-journey { position: relative; z-index: 2; margin-top: clamp(48px, 6vw, 80px); max-width: 1120px; margin-inline: auto; }

        /* the drawing spine */
        .pj-spine { position: absolute; top: 0; bottom: 0; left: 50%; width: 2px; transform: translateX(-50%); z-index: 1; }
        .pj-spine-track { position: absolute; inset: 0; border-radius: 2px; background: var(--hair); }
        .pj-spine-fill { position: absolute; left: 0; right: 0; top: 0; height: 100%; border-radius: 2px; transform-origin: top; will-change: transform;
          background: linear-gradient(to bottom, var(--electric), color-mix(in srgb, var(--electric) 80%, var(--ember)));
          box-shadow: 0 0 12px color-mix(in srgb, var(--electric) 60%, transparent); }
        .pj-comet { position: absolute; left: 50%; transform: translate(-50%, -50%); width: 16px; height: 16px; border-radius: 50%; z-index: 2; will-change: top;
          background: radial-gradient(circle, #fff, var(--electric) 42%, transparent 72%);
          box-shadow: 0 0 18px 4px color-mix(in srgb, var(--electric) 70%, transparent); }

        .pj-row { position: relative; display: grid; grid-template-columns: 1fr 1fr; column-gap: clamp(36px, 5vw, 72px);
          align-items: center; margin-block: clamp(34px, 4.5vw, 56px); }
        .pj-row:first-child { margin-top: 0; }
        .pj-row:last-child { margin-bottom: 0; }
        .pj-node { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 3;
          width: 16px; height: 16px; border-radius: 50%; background: var(--ink); border: 2px solid var(--hair);
          transition: border-color 0.5s ease, box-shadow 0.5s ease, background 0.5s ease; }
        .pj-node.on { border-color: var(--electric); background: color-mix(in srgb, var(--electric) 22%, var(--ink));
          box-shadow: 0 0 0 5px color-mix(in srgb, var(--electric) 14%, transparent), 0 0 16px color-mix(in srgb, var(--electric) 55%, transparent); }
        .pj-node.cur::after { content: ''; position: absolute; inset: -6px; border-radius: 50%; border: 1.5px solid var(--ember);
          animation: pj-pulse 2s var(--ease-out-quart) infinite; }
        @keyframes pj-pulse { 0% { transform: scale(0.7); opacity: 0.6; } 70%, 100% { transform: scale(1.9); opacity: 0; } }

        /* cards */
        .pj-card { position: relative; z-index: 2; perspective: 1000px; }
        .pj-row--left .pj-card { grid-column: 1; }
        .pj-row--right .pj-card { grid-column: 2; }
        .pj-card-tilt { position: relative; border-radius: 28px; padding: clamp(20px, 2vw, 30px); overflow: hidden;
          background: color-mix(in srgb, var(--graphite) 62%, transparent); border: 1px solid var(--hair);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 36px 80px -46px var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.05);
          transform: perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)); transform-style: preserve-3d;
          transition: transform 0.4s var(--ease-out-quart), box-shadow 0.5s ease, border-color 0.5s ease, opacity 0.5s ease; will-change: transform; }
        .pj-card-tilt::before { content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px; pointer-events: none; z-index: 1;
          background: linear-gradient(150deg, color-mix(in srgb, var(--bone) 26%, transparent), transparent 44%, color-mix(in srgb, var(--electric) 40%, transparent));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude;
          opacity: 0.4; transition: opacity 0.5s ease; }
        .pj-card-tilt:hover { transform: perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale(1.02);
          box-shadow: 0 50px 100px -44px var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.07); }
        .pj-card-tilt:hover::before { opacity: 0.8; }
        /* journey state: future faded, current glows, done settled */
        .pj-card.is-future .pj-card-tilt { opacity: 0.62; }
        .pj-card.is-current .pj-card-tilt { border-color: color-mix(in srgb, var(--electric) 42%, var(--hair));
          box-shadow: 0 46px 96px -44px var(--shadow-card), 0 0 0 1px color-mix(in srgb, var(--electric) 26%, transparent),
            0 24px 70px -30px color-mix(in srgb, var(--electric) 40%, transparent), inset 0 1px 0 rgba(255,255,255,0.07); }
        .pj-card.is-current .pj-card-tilt::before { opacity: 0.9; }
        .pj-card.is-current .pj-bar-fill { transform: scaleX(1); }

        .pj-glare { position: absolute; inset: 0; pointer-events: none; z-index: 2; opacity: 0; transition: opacity 0.4s ease;
          background: radial-gradient(380px circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.12), transparent 60%); }
        .pj-card-tilt:hover .pj-glare { opacity: 1; }
        .pj-sweep { position: absolute; top: -40%; bottom: -40%; left: -50%; width: 40%; pointer-events: none; z-index: 2; opacity: 0;
          background: linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.10) 50%, transparent 58%); transform: translateX(0) rotate(2deg); }
        .pj-card-tilt:hover .pj-sweep { opacity: 1; animation: pj-sweep 1.1s var(--ease-out-expo); }
        @keyframes pj-sweep { from { transform: translateX(0) rotate(2deg); } to { transform: translateX(560%) rotate(2deg); } }

        .pj-card-head { position: relative; z-index: 3; display: flex; align-items: center; gap: 14px; }
        .pj-num { font-family: var(--font-display); font-weight: 600; font-size: clamp(28px, 3vw, 40px); line-height: 1; color: var(--electric); letter-spacing: -0.02em; }
        .pj-icon { width: 42px; height: 42px; border-radius: 13px; display: grid; place-items: center; flex: none;
          background: var(--brand-soft); border: 1px solid var(--hair); color: var(--electric);
          transition: transform 0.4s var(--ease-out-expo); }
        .pj-card-tilt:hover .pj-icon { transform: translateY(-3px); }
        .pj-head-txt { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .pj-kicker { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ember); }
        .pj-title { font-family: var(--font-display); font-weight: 600; color: var(--bone); font-size: clamp(17px, 1.5vw, 22px); line-height: 1.12; letter-spacing: -0.01em; }
        .pj-l { position: relative; z-index: 3; }
        .pj-line { position: relative; z-index: 3; font-family: var(--font-display); font-style: italic; color: var(--bone);
          font-size: clamp(18px, 1.5vw, 23px); line-height: 1.3; margin-top: clamp(14px, 1.6vw, 20px); max-width: 26ch; }
        .pj-graphic { position: relative; z-index: 3; margin-top: clamp(18px, 2vw, 24px); padding: clamp(14px, 1.6vw, 20px);
          border-radius: 18px; background: color-mix(in srgb, var(--ink) 55%, transparent); border: 1px solid var(--hair-faint); }
        .pj-body { position: relative; z-index: 3; color: var(--smoke); font-size: 13.5px; line-height: 1.6; margin-top: clamp(16px, 1.8vw, 22px); }
        .pj-foot { position: relative; z-index: 3; display: flex; align-items: center; justify-content: space-between; gap: 16px;
          margin-top: clamp(16px, 1.8vw, 20px); padding-top: 14px; border-top: 1px solid var(--hair-faint); }
        .pj-cap { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--smoke); }
        .pj-bar { width: 84px; height: 3px; border-radius: 3px; background: var(--hair); overflow: hidden; flex: none; }
        .pj-bar-fill { display: block; height: 100%; transform-origin: left; transform: scaleX(0);
          background: linear-gradient(90deg, var(--electric), var(--ember)); transition: transform 0.7s var(--ease-out-expo); }

        .pj-cta { position: relative; z-index: 2; text-align: center; margin-top: clamp(48px, 6vw, 80px); }

        /* ── mobile / tablet: spine to the left, cards stacked ── */
        @media (max-width: 880px) {
          .pj-journey { padding-left: 30px; }
          .pj-spine { left: 7px; }
          .pj-row { grid-template-columns: 1fr; margin-block: clamp(26px, 6vw, 36px); }
          .pj-row--left .pj-card, .pj-row--right .pj-card { grid-column: 1; }
          .pj-node { left: -23px; top: 34px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pj-spark, .pj-sweep, .pj-node.cur::after, .pj-comet { animation: none !important; }
          .pj-spark { display: none; }
          .pj-card-tilt { transition: none; transform: none; }
          .pj-card-tilt:hover { transform: none; }
        }
      `}</style>

      {/* layered background */}
      <motion.div className="pj-bg" aria-hidden="true" style={{ y: bgY }}
        initial={{ opacity: 0 }} animate={entered ? { opacity: 1 } : { opacity: 0.6 }} transition={{ duration: 1.3, ease: EXPO }}>
        <div className="pj-mesh" />
        <motion.span className="pj-orb pj-orb-1"
          animate={reduce ? undefined : { x: ['-3%', '6%', '-3%'], y: ['2%', '-5%', '2%'] }} transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.span className="pj-orb pj-orb-2"
          animate={reduce ? undefined : { x: ['3%', '-6%', '3%'], y: ['-2%', '5%', '-2%'] }} transition={{ duration: 33, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="pj-grid" />
        <div className="pj-grain" />
        <span className="pj-spark pj-spark-1" /><span className="pj-spark pj-spark-2" />
        <span className="pj-spark pj-spark-3" /><span className="pj-spark pj-spark-4" />
      </motion.div>

      <div className="shell relative">
        {/* heading */}
        <div className="pj-head">
          <motion.span className="pj-eyebrow"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, ease: EXPO }}>How we work</motion.span>
          <motion.h2 className="pj-h" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
            transition={{ staggerChildren: 0.08, delayChildren: 0.08 }}>
            <span className="pj-line-clip"><motion.span variants={wordVar} transition={reduce ? { duration: 0.5 } : SPRING}>One store</motion.span></span>{' '}
            <span className="pj-line-clip"><motion.span variants={wordVar} transition={reduce ? { duration: 0.5 } : SPRING}>to a</motion.span></span>{' '}
            <span className="pj-line-clip"><motion.span className="pj-ital" variants={wordVar} transition={reduce ? { duration: 0.5 } : SPRING}>nation.</motion.span></span>
          </motion.h2>
          <motion.p className="pj-sub"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.4, ease: EXPO }}>
            A proven four-stage rollout — watch it build, stage by stage, as you scroll.
          </motion.p>
        </div>

        {/* the journey */}
        <div ref={journeyRef} className="pj-journey">
          {/* spine */}
          <div className="pj-spine" aria-hidden="true">
            <div className="pj-spine-track" />
            <motion.div className="pj-spine-fill" style={reduce ? { transform: 'scaleY(1)' } : { scaleY: fill }} />
            {!reduce && <motion.div className="pj-comet" style={{ top: cometTop }} />}
          </div>

          {STAGES.map((stage, i) => {
            const side = i % 2 === 0 ? 'left' : 'right';
            const state = i < active ? 'done' : i === active ? 'current' : 'future';
            return (
              <div className={`pj-row pj-row--${side}`} key={stage.n}>
                <span className={`pj-node ${i <= active ? 'on' : ''} ${i === active ? 'cur' : ''}`} aria-hidden="true" />
                <ProcessCard stage={stage} copy={COPY[i]} side={side} state={state} reduce={reduce} />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div className="pj-cta"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, ease: EXPO }}>
          <MagneticButton variant="outline" to="/what-we-do">See the full model</MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
