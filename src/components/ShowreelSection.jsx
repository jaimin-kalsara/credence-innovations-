import { useRef, useState, useEffect } from 'react';
import {
  motion, useReducedMotion,
  useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, useInView,
} from 'framer-motion';

/* ShowreelSection — a premium 50/50 split showcase: minimal copy on the left,
   the reel shown FULL in one cinematic glass frame on the right, ringed by
   floating glass UI cards (a live stat, the cast strip, a "plays on its own"
   pill). One rounded glassmorphism panel on a layered, breathing background.
   Staged entrance, scroll parallax, mouse-tilt + cursor light on hover. No GSAP.

   Drop the final cut into SHOWREEL_SRC (+ poster) and the frame becomes a real
   muted, looping <video> that autoplays when ~60% visible, pauses keeping its
   position when it leaves, and resumes on return. Empty src → polished
   placeholder player (poster + chrome) that still animates on scroll. */

const SHOWREEL_SRC = '';                          // e.g. '/media/video/showreel.mp4'
const SHOWREEL_POSTER = '/media/credencecrew1.jpg';
const CAST = ['/media/briteam2.jpg', '/media/cadepromo.jpg', '/media/thumbsup.jpg'];

const EXPO = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 120, damping: 20, mass: 1 };

function PlayGlyph() {
  return (<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5 L19 12 L8 18.5 Z" /></svg>);
}
const FEATURES = [
  { label: 'Trained reps', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></svg>) },
  { label: 'Real shoppers', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 7h14l-1.2 10.5a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>) },
  { label: 'Conversions', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l5-5 3 3 7-7" /><path d="M16 6h4v4" /></svg>) },
];

export default function ShowreelSection() {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const playRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState(false);
  const isPlaceholder = !SHOWREEL_SRC;

  const secInView = useInView(sectionRef, { margin: '-12% 0px -12% 0px' });
  const [entered, setEntered] = useState(false);
  useEffect(() => { if (secInView) setEntered(true); }, [secInView]);
  useEffect(() => {
    const id = setTimeout(() => {
      const el = sectionRef.current; if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) setEntered(true);
    }, 800);
    return () => clearTimeout(id);
  }, []);

  // autoplay on the stable stage; pause keeps position
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        const visible = e.isIntersecting && e.intersectionRatio >= 0.5;
        setInView(visible);
        const v = videoRef.current;
        if (!v || reduce) return;
        if (visible) {
          playRef.current = v.play();
          if (playRef.current && playRef.current.catch) playRef.current.catch(() => {});
        } else {
          const pause = () => { v.pause(); };
          if (playRef.current && playRef.current.then) playRef.current.then(pause).catch(pause);
          else pause();
        }
      },
      { threshold: [0, 0.5, 0.7], rootMargin: '150px 0px 150px 0px' },
    );
    io.observe(stage);
    return () => io.disconnect();
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-5%', '5%']);
  const frameY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [30, -30]);
  const cardAY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [44, -30]);
  const cardBY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-30, 44]);

  // tilt + cursor light on the frame
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [3, -3]), SPRING);
  const ry = useSpring(useTransform(mx, [0, 1], [-3, 3]), SPRING);
  const scale = useSpring(1, SPRING);
  const glareX = useTransform(mx, (v) => `${(v * 100).toFixed(1)}%`);
  const glareY = useTransform(my, (v) => `${(v * 100).toFixed(1)}%`);
  const glare = useMotionTemplate`radial-gradient(480px circle at ${glareX} ${glareY}, rgba(255,255,255,0.14), transparent 60%)`;
  useEffect(() => { scale.set(hover && !reduce ? 1.025 : 1); }, [hover, reduce, scale]);
  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => { setHover(false); mx.set(0.5); my.set(0.5); };

  const playing = inView && !reduce;
  const frameEnter = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6, delay: 0.35 } } }
    : { hidden: { opacity: 0, scale: 0.9, y: 36, rotate: 1.4, filter: 'blur(10px)' },
        show: { opacity: 1, scale: 1, y: 0, rotate: 0, filter: 'blur(0px)', transition: { ...SPRING, delay: 0.35 } } };
  const wordVar = reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : { hidden: { y: '120%' }, show: { y: '0%' } };
  const cardEnter = (delay) => (reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.5, delay } } }
    : { hidden: { opacity: 0, scale: 0.8, y: 18 }, show: { opacity: 1, scale: 1, y: 0, transition: { ...SPRING, delay } } });
  const up = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: entered ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.7, delay, ease: EXPO },
  });

  return (
    <section id="showreel" ref={sectionRef} className="rl-section paper relative overflow-hidden pad-lg" aria-label="Showreel">
      <style>{`
        .rl-section { background-color: var(--ink); }
        .rl-bg { display: none; position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
        .rl-mesh { position: absolute; inset: -12%;
          background:
            radial-gradient(38% 34% at 18% 20%, color-mix(in srgb, var(--electric) 11%, transparent), transparent 70%),
            radial-gradient(40% 36% at 84% 80%, color-mix(in srgb, var(--ember) 7%, transparent), transparent 72%); }
        .rl-orb { position: absolute; border-radius: 50%; filter: blur(82px); will-change: transform; }
        .rl-orb-1 { width: 28vw; max-width: 420px; aspect-ratio: 1; left: -8%; top: 14%;
          background: radial-gradient(circle, color-mix(in srgb, var(--electric) 16%, transparent), transparent 64%); }
        .rl-orb-2 { width: 26vw; max-width: 380px; aspect-ratio: 1; right: -6%; bottom: -8%;
          background: radial-gradient(circle, color-mix(in srgb, var(--ember) 12%, transparent), transparent 64%); }
        .rl-grid { position: absolute; inset: 0; opacity: 0.4;
          background-image: linear-gradient(color-mix(in srgb, var(--bone) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--bone) 6%, transparent) 1px, transparent 1px);
          background-size: 64px 64px;
          -webkit-mask: radial-gradient(circle at 50% 40%, #000, transparent 78%); mask: radial-gradient(circle at 50% 40%, #000, transparent 78%); }
        .rl-grain { position: absolute; inset: 0; opacity: 0.04; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 140px 140px; }
        .rl-spark { position: absolute; width: 5px; height: 5px; border-radius: 50%; opacity: 0;
          background: radial-gradient(circle, color-mix(in srgb, var(--electric) 85%, #fff), transparent 70%);
          box-shadow: 0 0 9px color-mix(in srgb, var(--electric) 55%, transparent); will-change: opacity, transform; }
        .rl-spark-1 { left: 12%; top: 28%; animation: rl-tw 5.6s ease-in-out 0.4s infinite; }
        .rl-spark-2 { right: 14%; top: 22%; animation: rl-tw 6.8s ease-in-out 1.7s infinite; }
        .rl-spark-3 { left: 46%; bottom: 16%; animation: rl-tw 7.4s ease-in-out 2.6s infinite; }
        @keyframes rl-tw { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 0.75; transform: scale(1); } }

        /* the one premium panel — 50 / 50 */
        .rl-panel { position: relative; z-index: 2; max-width: 1200px; margin-inline: auto; border-radius: 32px;
          padding: clamp(22px, 3vw, 48px); display: grid; grid-template-columns: 1fr; gap: clamp(30px, 4vw, 48px); align-items: center;
          background: color-mix(in srgb, var(--graphite) 55%, transparent); border: 1px solid var(--hair);
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 60px 130px -60px var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.05); }
        .rl-panel::before { content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px; pointer-events: none; z-index: 1;
          background: linear-gradient(150deg, color-mix(in srgb, var(--bone) 22%, transparent), transparent 42%, color-mix(in srgb, var(--electric) 34%, transparent));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0.5; }

        /* LEFT — copy */
        .rl-left { position: relative; z-index: 2; }
        .rl-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--electric); }
        .rl-eyebrow .dot { position: relative; width: 7px; height: 7px; border-radius: 50%; background: var(--ember); }
        .rl-eyebrow .dot::after { content: ''; position: absolute; inset: -4px; border-radius: 50%; background: var(--ember); opacity: 0.4; animation: rl-ping 2.2s var(--ease-out-quart) infinite; }
        @keyframes rl-ping { 0% { transform: scale(0.6); opacity: 0.5; } 70%, 100% { transform: scale(2.1); opacity: 0; } }
        .rl-title { font-family: var(--font-display); color: var(--bone); margin-top: clamp(14px, 1.8vw, 22px);
          line-height: 1.0; letter-spacing: -0.02em; font-size: clamp(40px, 4.6vw, 66px); }
        .rl-line { display: inline-block; overflow: hidden; vertical-align: bottom; padding: 0.02em 0.06em 0.12em; }
        .rl-line > span { display: inline-block; will-change: transform; }
        .rl-hi { font-style: italic; font-weight: 500;
          background: linear-gradient(100deg, var(--electric) 0%, #6FB6D9 52%, var(--electric) 100%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: var(--electric); }
        .rl-desc { color: var(--smoke); max-width: 42ch; margin-top: clamp(16px, 2vw, 24px); font-size: clamp(15px, 1.1vw, 17px); line-height: 1.62; }
        .rl-feats { display: flex; flex-wrap: wrap; gap: 10px; margin-top: clamp(24px, 3vw, 34px); }
        .rl-feat { display: inline-flex; align-items: center; gap: 8px; padding: 9px 14px; border-radius: 999px;
          background: color-mix(in srgb, var(--ink) 45%, transparent); border: 1px solid var(--hair); color: var(--bone);
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
          transition: transform 0.4s var(--ease-out-expo), border-color 0.4s ease, background 0.4s ease; }
        .rl-feat:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--electric) 42%, var(--hair)); }
        .rl-feat svg { width: 15px; height: 15px; color: var(--electric); }
        .rl-auto { display: inline-flex; align-items: center; gap: 10px; margin-top: clamp(26px, 3vw, 34px);
          font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--smoke); }
        .rl-auto::before { content: ''; width: 26px; height: 1px; background: var(--electric); }

        /* RIGHT — the reel, shown FULL */
        .rl-right { position: relative; z-index: 2; }
        .rl-stage { position: relative; perspective: 1200px; }
        .rl-aura { position: absolute; inset: -12%; z-index: 0; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, color-mix(in srgb, var(--electric) 20%, transparent), transparent 62%);
          filter: blur(48px); animation: rl-breathe 9s ease-in-out infinite; }
        @keyframes rl-breathe { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.06); } }
        .rl-frame { position: relative; z-index: 2; width: 100%; aspect-ratio: 4 / 3; border-radius: 24px; overflow: hidden;
          background: #0c1013; cursor: pointer; transform-style: preserve-3d; -webkit-tap-highlight-color: transparent; will-change: transform;
          box-shadow: 0 50px 110px -50px var(--shadow-card), 0 6px 20px -8px var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.06);
          transition: box-shadow 0.5s var(--ease-out-expo); }
        .rl-frame.is-hover { box-shadow: 0 68px 130px -50px var(--shadow-card),
          0 0 0 1px color-mix(in srgb, var(--electric) 38%, transparent), 0 32px 84px -28px color-mix(in srgb, var(--electric) 48%, transparent); }
        .rl-frame:focus-visible { outline: 2px solid var(--electric); outline-offset: 5px; }
        /* object-fit: cover fills the frame; the poster/video shows full + clean */
        .rl-media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block;
          transform: translateZ(0); backface-visibility: hidden; transition: transform 8s linear; }
        .rl-frame.is-playing .rl-poster { transform: scale(1.06); }
        .rl-border { position: absolute; inset: 0; border-radius: inherit; padding: 1px; pointer-events: none;
          background: linear-gradient(150deg, rgba(255,255,255,0.5), transparent 42%, color-mix(in srgb, var(--electric) 55%, transparent));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude;
          opacity: 0.5; transition: opacity 0.5s ease; }
        .rl-frame.is-hover .rl-border { opacity: 0.95; }
        .rl-glass { position: absolute; inset: 0; pointer-events: none; opacity: 0.4; transition: opacity 0.5s ease;
          background: linear-gradient(140deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 38%, transparent 62%); }
        .rl-frame.is-hover .rl-glass { opacity: 0; }
        .rl-scrim { position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(to top, rgba(6,9,12,0.5) 1%, transparent 36%); }
        .rl-glare { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 0.4s ease; }
        .rl-frame.is-hover .rl-glare { opacity: 1; }
        .rl-sweep { position: absolute; top: -30%; bottom: -30%; left: -45%; width: 40%; pointer-events: none; opacity: 0;
          background: linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.14) 50%, transparent 58%); transform: translateX(0) rotate(2deg); }
        .rl-frame.is-hover .rl-sweep { opacity: 1; animation: rl-sweep 1.1s var(--ease-out-expo); }
        @keyframes rl-sweep { from { transform: translateX(0) rotate(2deg); } to { transform: translateX(520%) rotate(2deg); } }

        .rl-play { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 4;
          display: grid; place-items: center; width: clamp(58px, 5.4vw, 74px); aspect-ratio: 1; border-radius: 50%; color: #0e1618;
          background: rgba(243,238,226,0.95); backdrop-filter: blur(6px); box-shadow: 0 18px 44px -16px rgba(0,0,0,0.6);
          transition: transform 0.4s var(--ease-out-expo); }
        .rl-play svg { margin-left: 3px; }
        .rl-frame.is-hover .rl-play { transform: translate(-50%, -50%) scale(1.06); }
        .rl-ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 3; width: 74px; height: 74px; border-radius: 50%;
          border: 1px solid rgba(243,238,226,0.5); animation: rl-pulse 2.6s var(--ease-out-quart) infinite; }
        @keyframes rl-pulse { 0% { transform: translate(-50%, -50%) scale(0.85); opacity: 0.6; } 70%, 100% { transform: translate(-50%, -50%) scale(1.7); opacity: 0; } }

        .rl-chip { position: absolute; z-index: 5; top: 14px; left: 14px; display: inline-flex; align-items: center; gap: 7px;
          padding: 6px 11px 6px 9px; border-radius: 999px; font-family: 'JetBrains Mono', monospace; font-size: 9px;
          letter-spacing: 0.14em; text-transform: uppercase; color: #F3EEE2;
          background: rgba(10,14,15,0.5); border: 1px solid rgba(255,255,255,0.16); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
        .rl-chip .d { position: relative; width: 7px; height: 7px; border-radius: 50%; background: #E8923C; }
        .rl-chip .d::after { content: ''; position: absolute; inset: -4px; border-radius: 50%; background: #E8923C; opacity: 0.4; animation: rl-ping 1.9s var(--ease-out-quart) infinite; }
        .rl-time { position: absolute; z-index: 5; top: 16px; right: 16px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #F3EEE2; }
        .rl-progress { position: absolute; z-index: 5; left: 0; right: 0; bottom: 0; height: 3px; background: rgba(255,255,255,0.16); }
        .rl-progress-fill { display: block; height: 100%; width: 0; background: linear-gradient(90deg, var(--electric), var(--ember)); }
        .rl-frame.is-playing .rl-progress-fill { animation: rl-prog 60s linear infinite; }
        @keyframes rl-prog { from { width: 0; } to { width: 100%; } }

        /* floating glass UI cards over the frame */
        .rl-card { position: absolute; z-index: 6; border-radius: 16px; padding: 12px 14px; will-change: transform;
          background: color-mix(in srgb, #0D1117 78%, var(--graphite)); border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 26px 60px -30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08); color: #F3EEE2; }
        .rl-card-stat { left: -6%; bottom: 12%; display: flex; align-items: center; gap: 11px; animation: rl-float 7s ease-in-out infinite; }
        .rl-stat-ic { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; flex: none;
          background: color-mix(in srgb, var(--electric) 22%, transparent); color: #8FC8E0; }
        .rl-stat-ic svg { width: 17px; height: 17px; }
        .rl-stat-n { font-family: var(--font-display); font-weight: 600; font-size: 19px; line-height: 1; }
        .rl-stat-l { font-family: 'JetBrains Mono', monospace; font-size: 8px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(243,238,226,0.66); margin-top: 4px; }
        .rl-card-cast { right: -5%; bottom: 24%; animation: rl-float 8.6s ease-in-out 1s infinite; }
        .rl-cast-row { display: flex; align-items: center; }
        .rl-cast-row img { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 2px solid #0D1117; }
        .rl-cast-row img:not(:first-child) { margin-left: -10px; }
        .rl-cast-l { display: block; font-family: 'JetBrains Mono', monospace; font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(243,238,226,0.66); margin-top: 8px; }
        .rl-card-pill { right: 2%; top: 10%; display: inline-flex; align-items: center; gap: 7px; padding: 9px 14px; border-radius: 999px;
          font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; animation: rl-float 6.4s ease-in-out 0.5s infinite; }
        .rl-card-pill svg { width: 13px; height: 13px; color: #8FC8E0; }
        @keyframes rl-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }

        @media (min-width: 940px) {
          .rl-panel { grid-template-columns: 0.92fr 1.08fr; gap: clamp(40px, 4vw, 72px); }
        }
        @media (max-width: 620px) {
          .rl-card-stat, .rl-card-cast { left: auto; right: auto; }
          .rl-card-stat { left: 4%; bottom: 8%; } .rl-card-cast, .rl-card-pill { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rl-spark, .rl-sweep, .rl-aura, .rl-ring, .rl-chip .d::after, .rl-eyebrow .dot::after, .rl-card, .rl-frame.is-playing .rl-progress-fill, .rl-frame.is-playing .rl-poster { animation: none !important; }
          .rl-spark { display: none; }
          .rl-frame, .rl-glass, .rl-border, .rl-media, .rl-feat { transition: none; }
        }
      `}</style>

      {/* layered background */}
      <motion.div className="rl-bg" aria-hidden="true" style={{ y: bgY }}
        initial={{ opacity: 0 }} animate={entered ? { opacity: 1 } : {}} transition={{ duration: 1.3, ease: EXPO }}>
        <div className="rl-mesh" />
        <motion.span className="rl-orb rl-orb-1"
          animate={reduce ? undefined : { x: ['-3%', '6%', '-3%'], y: ['2%', '-5%', '2%'] }} transition={{ duration: 27, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.span className="rl-orb rl-orb-2"
          animate={reduce ? undefined : { x: ['3%', '-6%', '3%'], y: ['-2%', '5%', '-2%'] }} transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="rl-grid" />
        <div className="rl-grain" />
        <span className="rl-spark rl-spark-1" /><span className="rl-spark rl-spark-2" /><span className="rl-spark rl-spark-3" />
      </motion.div>

      <div className="shell relative">
        <motion.div className="rl-panel"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.985 }}
          animate={entered ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: EXPO }}>

          {/* LEFT — copy */}
          <div className="rl-left">
            <motion.span className="rl-eyebrow"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }} animate={entered ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EXPO }}><span className="dot" aria-hidden="true" />Showreel</motion.span>
            <h2 className="rl-title">
              <span className="rl-line"><motion.span className="rl-hi"
                initial="hidden" animate={entered ? 'show' : 'hidden'} variants={wordVar}
                transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.12 }}>The work,</motion.span></span>{' '}
              <span className="rl-line"><motion.span
                initial="hidden" animate={entered ? 'show' : 'hidden'} variants={wordVar}
                transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.2 }}>in</motion.span></span>{' '}
              <span className="rl-line"><motion.span className="rl-hi"
                initial="hidden" animate={entered ? 'show' : 'hidden'} variants={wordVar}
                transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.28 }}>motion.</motion.span></span>
            </h2>
            <motion.p className="rl-desc" {...up(0.42)}>
              Sixty seconds inside a Credence activation — trained reps on the floor, real shoppers,
              real conversions. Hit play, or just keep scrolling and it starts on its own.
            </motion.p>
            <motion.div className="rl-feats" {...up(0.5)}>
              {FEATURES.map((f) => (
                <span className="rl-feat" key={f.label}>{f.icon}{f.label}</span>
              ))}
            </motion.div>
            <motion.span className="rl-auto" {...up(0.58)}>Plays automatically</motion.span>
          </div>

          {/* RIGHT — the reel, full in one frame */}
          <div className="rl-right" ref={stageRef}>
            <div className="rl-stage">
              <span className="rl-aura" aria-hidden="true" />
              <motion.div style={reduce ? undefined : { y: frameY }} className="relative">
                <motion.div initial="hidden" animate={entered ? 'show' : 'hidden'} variants={frameEnter}>
                  <motion.div
                    className={`rl-frame ${playing ? 'is-playing' : ''} ${hover ? 'is-hover' : ''}`}
                    style={reduce ? undefined : { rotateX: rx, rotateY: ry, scale, transformPerspective: 900 }}
                    onMouseMove={onMove} onMouseEnter={() => setHover(true)} onMouseLeave={onLeave}
                    onFocus={() => setHover(true)} onBlur={() => setHover(false)}
                    tabIndex={0} role="img" aria-label="Credence showreel" data-cursor="expand"
                  >
                    {isPlaceholder ? (
                      <img className="rl-media rl-poster" src={SHOWREEL_POSTER} alt="" loading="lazy" />
                    ) : (
                      <video ref={videoRef} className="rl-media" src={SHOWREEL_SRC} poster={SHOWREEL_POSTER}
                        muted loop playsInline preload="none" tabIndex={-1} aria-label="Credence showreel" />
                    )}
                    <span className="rl-scrim" aria-hidden="true" />
                    <span className="rl-glass" aria-hidden="true" />
                    <span className="rl-border" aria-hidden="true" />
                    {!reduce && <motion.span className="rl-glare" style={{ background: glare }} aria-hidden="true" />}
                    <span className="rl-sweep" aria-hidden="true" />

                    {isPlaceholder && <span className="rl-ring" aria-hidden="true" />}
                    <span className="rl-play" aria-hidden="true"><PlayGlyph /></span>

                    <span className="rl-chip"><span className="d" aria-hidden="true" />{isPlaceholder ? 'Preview' : 'Showreel'}</span>
                    <span className="rl-time" aria-hidden="true">0:60</span>
                    <span className="rl-progress" aria-hidden="true"><span className="rl-progress-fill" /></span>
                  </motion.div>
                </motion.div>

                {/* floating glass UI cards */}
                <motion.div className="rl-card rl-card-stat" style={reduce ? undefined : { y: cardAY }}
                  initial="hidden" animate={entered ? 'show' : 'hidden'} variants={cardEnter(0.55)} aria-hidden="true">
                  <span className="rl-stat-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l5-5 3 3 7-7" /><path d="M16 6h4v4" /></svg></span>
                  <span><span className="rl-stat-n">Real</span><span className="rl-stat-l">Conversions, live</span></span>
                </motion.div>

                <motion.div className="rl-card rl-card-cast" style={reduce ? undefined : { y: cardBY }}
                  initial="hidden" animate={entered ? 'show' : 'hidden'} variants={cardEnter(0.64)} aria-hidden="true">
                  <span className="rl-cast-row">{CAST.map((s) => <img key={s} src={s} alt="" loading="lazy" />)}</span>
                  <span className="rl-cast-l">Inside the reel</span>
                </motion.div>

                <motion.div className="rl-card rl-card-pill"
                  initial="hidden" animate={entered ? 'show' : 'hidden'} variants={cardEnter(0.7)} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5 L19 12 L8 18.5 Z" /></svg>Auto-plays
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
