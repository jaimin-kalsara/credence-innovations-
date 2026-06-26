import { useRef, useState, useEffect } from 'react';
import {
  motion, useReducedMotion,
  useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, useInView,
} from 'framer-motion';
import MagneticButton from './MagneticButton';
import { FOUNDER_VIDEO } from '../data/media';

/* ============================================================================
   FounderFilm — "In Her Words"

   An editorial, asymmetrical floating composition: the founder's interview is
   the centrepiece, with two large editorial headings flanking it and glass
   info-chips clustered around the frame (clear of the side copy). A curved
   thread, soft gradient glows, grain and floating particles set the mood.
   Cinematic staged entrance, scroll parallax on every layer, mouse-tilt +
   cursor light on the film, magnetic CTA, idle float on the chips. Fully
   theme-adaptive, no GSAP. Scroll autoplay that pauses keeping position.
============================================================================ */

const EXPO = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 120, damping: 20, mass: 1 };
const AVA = ['/media/briteam2.jpg', '/media/cadepromo.jpg', '/media/aronshivanimiami.jpg', '/media/baylenarondeep.jpg', '/media/dexterjanetabby.jpg'];

function TrophyIcon() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="5" /><path d="M8.5 13.4 L7 21 l5-2.6 5 2.6 -1.5-7.6" /></svg>); }
function WaveIcon() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M4 12h0.01M8 8v8M12 5v14M16 8v8M20 12h0.01" /></svg>); }

export default function FounderFilm() {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const playRef = useRef(null);
  const wantPlayRef = useRef(false);
  const [muted, setMuted] = useState(true);
  const [hover, setHover] = useState(false);

  const inView = useInView(sectionRef, { margin: '-12% 0px -12% 0px' });
  const [entered, setEntered] = useState(false);
  useEffect(() => { if (inView) setEntered(true); }, [inView]);
  useEffect(() => {
    const id = setTimeout(() => {
      const el = sectionRef.current; if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) setEntered(true);
    }, 800);
    return () => clearTimeout(id);
  }, []);

  // Robust, error-free playback for the (large) founder clip:
  //  · buffer ahead the moment the section is *near* (preload bumps to auto)
  //  · play only when it's in view, pause cleanly when it leaves
  //  · every play()/pause() is race-guarded so no "interrupted" errors fire
  //  · self-heals through buffering stalls and transient media errors
  useEffect(() => {
    const v = videoRef.current; const stage = stageRef.current;
    if (!v || !stage || reduce) return undefined;
    v.muted = true;

    const playSafe = () => {
      if (!wantPlayRef.current || reduce || !v.paused) return;
      const p = v.play();
      playRef.current = p;
      if (p && p.catch) p.catch(() => {});   // swallow Abort / NotAllowed
    };
    const pauseSafe = () => {
      const finish = () => { if (!v.paused) v.pause(); };
      // wait for any in-flight play() to settle before pausing
      if (playRef.current && playRef.current.then) playRef.current.then(finish).catch(finish);
      else finish();
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (v.preload !== 'auto') v.preload = 'auto';   // start buffering early
          if (e.intersectionRatio >= 0.35) { wantPlayRef.current = true; playSafe(); }
          else { wantPlayRef.current = false; pauseSafe(); }
        } else { wantPlayRef.current = false; pauseSafe(); }
      },
      { threshold: [0, 0.35, 0.8], rootMargin: '400px 0px 400px 0px' },
    );
    io.observe(stage);

    // kick playback once enough has buffered (covers the slow-first-load case)
    const onReady = () => playSafe();
    let retried = false;
    const onError = () => { if (retried) return; retried = true; const t = v.currentTime || 0; v.load(); v.addEventListener('loadeddata', () => { try { v.currentTime = t; } catch (_) {} playSafe(); }, { once: true }); };
    v.addEventListener('canplay', onReady);
    v.addEventListener('loadeddata', onReady);
    v.addEventListener('error', onError);

    return () => {
      io.disconnect();
      v.removeEventListener('canplay', onReady);
      v.removeEventListener('loadeddata', onReady);
      v.removeEventListener('error', onError);
    };
  }, [reduce]);

  // scroll parallax — every layer at a different rate
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%']);
  const videoY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);
  const leftY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-26, 26]);
  const rightY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [26, -26]);
  const f1 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [56, -46]);
  const f2 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-46, 56]);
  const f3 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [48, -34]);
  const f4 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-34, 50]);

  // tilt + cursor light on the film
  const mx = useMotionValue(0.5); const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [4, -4]), SPRING);
  const ry = useSpring(useTransform(mx, [0, 1], [-4, 4]), SPRING);
  const scl = useSpring(1, SPRING);
  const glareX = useTransform(mx, (v) => `${(v * 100).toFixed(1)}%`);
  const glareY = useTransform(my, (v) => `${(v * 100).toFixed(1)}%`);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(255,255,255,0.16), transparent 60%)`;
  useEffect(() => { scl.set(hover && !reduce ? 1.03 : 1); }, [hover, reduce, scl]);
  const onMove = (e) => { if (reduce) return; const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height); };
  const onLeave = () => { setHover(false); mx.set(0.5); my.set(0.5); };
  const toggleSound = (e) => {
    e.stopPropagation();
    const v = videoRef.current; if (!v) return;
    v.muted = !v.muted; setMuted(v.muted);
    if (!v.muted) { wantPlayRef.current = true; const p = v.play(); playRef.current = p; if (p && p.catch) p.catch(() => {}); }
  };

  const videoEnter = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.7, delay: 0.35 } } }
    : { hidden: { opacity: 0, scale: 0.9, y: 30, filter: 'blur(12px)' }, show: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', transition: { ...SPRING, delay: 0.35 } } };
  const wordVar = reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : { hidden: { y: '120%' }, show: { y: '0%' } };
  const chipEnter = (delay) => (reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.5, delay } } }
    : { hidden: { opacity: 0, scale: 0.78, y: 16 }, show: { opacity: 1, scale: 1, y: 0, transition: { ...SPRING, delay } } });
  const up = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(5px)' },
    animate: entered ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {},
    transition: { duration: 0.7, delay, ease: EXPO },
  });

  return (
    <section ref={sectionRef} className="iw-section paper relative overflow-hidden" aria-label="In her words">
      <style>{`
        .iw-section { padding-block: clamp(56px, 8vw, 120px); background-color: var(--ink); }
        .iw-bg { display: none; position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
        .iw-glow { position: absolute; border-radius: 50%; filter: blur(90px); will-change: transform; }
        .iw-glow-1 { width: 34vw; max-width: 520px; aspect-ratio: 1; left: 6%; top: 6%; background: radial-gradient(circle, color-mix(in srgb, var(--electric) 16%, transparent), transparent 64%); }
        .iw-glow-2 { width: 30vw; max-width: 460px; aspect-ratio: 1; right: 4%; bottom: 0%; background: radial-gradient(circle, color-mix(in srgb, var(--ember) 13%, transparent), transparent 64%); }
        .iw-glow-3 { width: 24vw; max-width: 360px; aspect-ratio: 1; left: 50%; top: 40%; transform: translateX(-50%); background: radial-gradient(circle, color-mix(in srgb, var(--electric) 9%, transparent), transparent 66%); }
        .iw-dots { position: absolute; inset: 0; opacity: 0.5;
          background-image: radial-gradient(color-mix(in srgb, var(--bone) 10%, transparent) 1px, transparent 1px); background-size: 30px 30px;
          -webkit-mask: radial-gradient(circle at 50% 40%, #000, transparent 76%); mask: radial-gradient(circle at 50% 40%, #000, transparent 76%); }
        .iw-grain { position: absolute; inset: 0; opacity: 0.04; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 140px 140px; }
        .iw-thread { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
        .iw-thread path { fill: none; stroke: color-mix(in srgb, var(--electric) 30%, transparent); stroke-width: 1.2; stroke-dasharray: 1 8; stroke-linecap: round; }
        .iw-particle { position: absolute; width: 5px; height: 5px; border-radius: 50%; opacity: 0;
          background: radial-gradient(circle, color-mix(in srgb, var(--electric) 85%, #fff), transparent 70%); box-shadow: 0 0 9px color-mix(in srgb, var(--electric) 55%, transparent); }
        .iw-particle:nth-of-type(1) { left: 30%; top: 30%; animation: iw-tw 6s ease-in-out 0.4s infinite; }
        .iw-particle:nth-of-type(2) { right: 28%; top: 24%; animation: iw-tw 7.2s ease-in-out 1.6s infinite; }
        .iw-particle:nth-of-type(3) { left: 40%; bottom: 18%; animation: iw-tw 6.6s ease-in-out 2.4s infinite; }
        .iw-particle:nth-of-type(4) { right: 36%; bottom: 26%; animation: iw-tw 7.8s ease-in-out 1.1s infinite; }
        @keyframes iw-tw { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 0.75; transform: scale(1); } }

        .iw-canvas { position: relative; z-index: 2; max-width: 1320px; margin-inline: auto; padding-inline: clamp(16px, 4vw, 40px); }
        .iw-grid { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: clamp(24px, 4vw, 64px); }

        /* editorial text blocks */
        .iw-left, .iw-right { max-width: 300px; }
        .iw-pill { display: inline-flex; align-items: center; gap: 9px; padding: 7px 14px 7px 10px; border-radius: 999px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--bone);
          background: color-mix(in srgb, var(--graphite) 58%, transparent); border: 1px solid color-mix(in srgb, var(--electric) 24%, var(--hair));
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
        .iw-pill .gem { color: var(--electric); display: grid; place-items: center; }
        .iw-h { font-family: var(--font-display); color: var(--bone); line-height: 0.98; letter-spacing: -0.025em; }
        .iw-left .iw-h { margin-top: clamp(16px, 1.8vw, 24px); font-size: clamp(40px, 4vw, 62px); }
        .iw-right .iw-h { font-size: clamp(38px, 3.8vw, 58px); }
        .iw-line { display: block; overflow: hidden; padding: 0.03em 0.06em 0.1em; }
        .iw-line > span { display: inline-block; will-change: transform; }
        .iw-ital { font-style: italic; font-weight: 500;
          background: linear-gradient(100deg, var(--electric) 0%, #6FB6D9 52%, var(--electric) 100%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: var(--electric); }
        .iw-p { color: var(--smoke); font-size: clamp(14px, 1.05vw, 16px); line-height: 1.62; margin-top: clamp(16px, 1.8vw, 22px); }
        .iw-left .iw-cta { margin-top: clamp(24px, 2.6vw, 34px); }
        .iw-num { font-family: var(--font-display); font-size: 13px; color: var(--bone); width: 38px; height: 38px; border-radius: 50%;
          display: inline-grid; place-items: center; background: color-mix(in srgb, var(--graphite) 55%, transparent); border: 1px solid var(--hair); margin-bottom: 18px; }
        .iw-right { text-align: right; justify-self: end; }
        .iw-right .iw-num { margin-left: auto; }
        .iw-right .iw-p { margin-left: auto; }

        /* the film */
        .iw-stage { position: relative; perspective: 1200px; }
        .iw-aura { position: absolute; inset: -16%; z-index: 0; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, color-mix(in srgb, var(--electric) 24%, transparent), transparent 60%); filter: blur(46px); animation: iw-breathe 9s ease-in-out infinite; }
        @keyframes iw-breathe { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.82; transform: scale(1.06); } }
        .iw-frame { position: relative; z-index: 2; width: clamp(258px, 23vw, 326px); aspect-ratio: 9 / 15; border-radius: 30px; overflow: hidden;
          background: var(--graphite); cursor: pointer; transform-style: preserve-3d; -webkit-tap-highlight-color: transparent; will-change: transform;
          box-shadow: 0 56px 120px -54px var(--shadow-card), 0 8px 24px -10px var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.06);
          transition: box-shadow 0.5s var(--ease-out-expo); }
        .iw-frame.on { box-shadow: 0 76px 144px -54px var(--shadow-card), 0 0 0 1px color-mix(in srgb, var(--electric) 38%, transparent), 0 36px 96px -30px color-mix(in srgb, var(--electric) 50%, transparent); }
        .iw-frame:focus-visible { outline: 2px solid var(--electric); outline-offset: 5px; }
        .iw-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transform: translateZ(0); backface-visibility: hidden; }
        .iw-border { position: absolute; inset: 0; border-radius: inherit; padding: 1px; pointer-events: none;
          background: linear-gradient(150deg, rgba(255,255,255,0.5), transparent 42%, color-mix(in srgb, var(--electric) 55%, transparent));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0.5; transition: opacity 0.5s ease; }
        .iw-frame.on .iw-border { opacity: 0.95; }
        .iw-glass { position: absolute; inset: 0; pointer-events: none; opacity: 0.4; transition: opacity 0.5s ease; background: linear-gradient(140deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 38%, transparent 62%); }
        .iw-frame.on .iw-glass { opacity: 0; }
        .iw-scrim { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(to top, rgba(6,9,12,0.62) 1%, transparent 30%); }
        .iw-glare { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 0.4s ease; }
        .iw-frame.on .iw-glare { opacity: 1; }
        .iw-saypill { position: absolute; z-index: 4; left: 14px; right: 14px; bottom: 14px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; border: none;
          font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase; color: #F3EEE2;
          background: rgba(10,14,15,0.62); border-radius: 999px; padding: 12px 16px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); transition: background 0.3s ease, transform 0.3s var(--ease-out-quart); }
        .iw-saypill:hover { background: rgba(10,14,15,0.84); transform: translateY(-1px); }
        .iw-saypill:focus-visible { outline: 2px solid var(--electric); outline-offset: 3px; }
        .iw-saypill .dot { width: 6px; height: 6px; border-radius: 50%; background: #E8923C; }

        /* floating glass chips — clustered around the video, clear of the side copy */
        .iw-chip { position: absolute; z-index: 6; }
        .iw-card { display: flex; align-items: center; gap: 11px; padding: 11px 15px; border-radius: 16px; white-space: nowrap;
          background: color-mix(in srgb, var(--graphite) 64%, transparent); border: 1px solid var(--hair);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: 0 26px 56px -34px var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.07); }
        [data-theme="dark"] .iw-card { background: linear-gradient(158deg, rgba(255,255,255,0.05), transparent 60%), linear-gradient(158deg, #1b262d, #151d23); border-color: rgba(255,255,255,0.1); }
        .iw-idle { display: inline-block; animation: iw-float 7s ease-in-out infinite; }
        @keyframes iw-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        .iw-stack { display: flex; }
        .iw-stack img, .iw-stack .more { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 2px solid color-mix(in srgb, var(--graphite) 90%, #000); }
        .iw-stack img:not(:first-child), .iw-stack .more { margin-left: -10px; }
        .iw-stack .more { display: grid; place-items: center; background: color-mix(in srgb, var(--graphite) 80%, transparent); color: var(--smoke); font-size: 13px; border: 2px solid var(--hair); }
        .iw-card-n { font-family: var(--font-display); font-weight: 600; color: var(--bone); font-size: 18px; line-height: 1; }
        .iw-card-l { display: block; font-family: 'JetBrains Mono', monospace; font-size: 8.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--smoke); margin-top: 4px; max-width: 15ch; white-space: normal; line-height: 1.4; }
        .iw-card-ic { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; flex: none; background: color-mix(in srgb, var(--electric) 16%, transparent); color: var(--electric); }
        .iw-card-ic svg { width: 17px; height: 17px; }
        .iw-card-ic--dark { background: #0E1618; color: #F3EEE2; border: 1px solid rgba(255,255,255,0.12); }
        .iw-arrow { position: absolute; right: 1%; bottom: 0; z-index: 6; width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center;
          background: var(--bone); color: var(--ink); border: none; cursor: pointer; box-shadow: 0 24px 50px -22px var(--shadow-card); transition: transform 0.4s var(--ease-out-expo); }
        .iw-arrow:hover { transform: translateY(-3px) rotate(8deg); }
        .iw-arrow:focus-visible { outline: 2px solid var(--electric); outline-offset: 3px; }

        /* chip placements — anchored to the video centre (left:/right: 50% + margin) */
        .iw-c-stat  { left: 50%; margin-left: -258px; top: 1%; }
        .iw-c-award { right: 50%; margin-right: -252px; top: 7%; }
        .iw-c-floor { left: 50%; margin-left: -264px; bottom: 15%; }
        .iw-c-reach { right: 50%; margin-right: -262px; bottom: 7%; }

        /* tablet — drop the floating layer (it needs the room), keep a clean trio */
        @media (max-width: 1180px) { .iw-chip, .iw-arrow, .iw-thread { display: none; } }

        /* mobile — elegant centred stack */
        @media (max-width: 880px) {
          .iw-grid { grid-template-columns: 1fr; gap: clamp(28px, 7vw, 40px); justify-items: center; text-align: center; }
          .iw-left, .iw-right { max-width: 440px; }
          .iw-right { text-align: center; justify-self: center; }
          .iw-right .iw-num, .iw-right .iw-p { margin-inline: auto; }
          .iw-left .iw-h { font-size: clamp(38px, 11vw, 52px); }
          .iw-right .iw-h { font-size: clamp(34px, 9.5vw, 46px); }
          .iw-p { margin-inline: auto; max-width: 38ch; }
          .iw-stage { order: 2; }   /* heading → video → supporting */
          .iw-right { order: 3; margin-top: clamp(4px, 2vw, 12px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .iw-particle, .iw-idle, .iw-aura { animation: none !important; }
          .iw-particle { display: none; }
          .iw-frame, .iw-glass, .iw-border, .iw-card { transition: none; }
        }
      `}</style>

      {/* layered background */}
      <motion.div className="iw-bg" aria-hidden="true" style={{ y: bgY }} initial={{ opacity: 0 }} animate={entered ? { opacity: 1 } : {}} transition={{ duration: 1.4, ease: EXPO }}>
        <motion.span className="iw-glow iw-glow-1" animate={reduce ? undefined : { x: ['-3%', '6%', '-3%'], y: ['2%', '-5%', '2%'] }} transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.span className="iw-glow iw-glow-2" animate={reduce ? undefined : { x: ['3%', '-6%', '3%'], y: ['-2%', '5%', '-2%'] }} transition={{ duration: 33, repeat: Infinity, ease: 'easeInOut' }} />
        <span className="iw-glow iw-glow-3" />
        <div className="iw-dots" />
        <div className="iw-grain" />
        <svg className="iw-thread" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <path d="M120,360 C300,300 360,180 500,200 C640,220 690,360 880,300" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="iw-particle" /><span className="iw-particle" /><span className="iw-particle" /><span className="iw-particle" />
      </motion.div>

      <div className="iw-canvas">
        <div className="iw-grid">
          {/* LEFT editorial */}
          <motion.div className="iw-left" style={reduce ? undefined : { y: leftY }}>
            <motion.span className="iw-pill" initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }} animate={entered ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EXPO }}>
              <span className="gem" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3h12l4 6-10 12L2 9z" opacity="0.9" /></svg></span>In her words
            </motion.span>
            <h2 className="iw-h">
              <span className="iw-line"><motion.span initial="hidden" animate={entered ? 'show' : 'hidden'} variants={wordVar} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.12 }}>A decade</motion.span></span>
              <span className="iw-line"><motion.span initial="hidden" animate={entered ? 'show' : 'hidden'} variants={wordVar} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.2 }}>on the</motion.span></span>
              <span className="iw-line"><motion.span className="iw-ital" initial="hidden" animate={entered ? 'show' : 'hidden'} variants={wordVar} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.28 }}>floor.</motion.span></span>
            </h2>
            <motion.p className="iw-p" {...up(0.42)}>Why Credence exists — and the standard behind every campaign — straight from the founder. One honest minute with Abby.</motion.p>
            <motion.div className="iw-cta" {...up(0.52)}><MagneticButton to="/team/abby-caudill">Watch her story</MagneticButton></motion.div>
          </motion.div>

          {/* CENTER film */}
          <div className="iw-stage" ref={stageRef}>
            <span className="iw-aura" aria-hidden="true" />
            <motion.div style={reduce ? undefined : { y: videoY }} className="relative">
              <motion.div initial="hidden" animate={entered ? 'show' : 'hidden'} variants={videoEnter}>
                <motion.div className={`iw-frame ${hover ? 'on' : ''}`} style={reduce ? undefined : { rotateX: rx, rotateY: ry, scale: scl, transformPerspective: 900 }}
                  onMouseMove={onMove} onMouseEnter={() => setHover(true)} onMouseLeave={onLeave} onFocus={() => setHover(true)} onBlur={() => setHover(false)}
                  onClick={toggleSound} tabIndex={0} role="button" aria-label={`${FOUNDER_VIDEO.title} — ${muted ? 'tap to unmute' : 'tap to mute'}`} data-cursor="expand">
                  <video ref={videoRef} className="iw-video" src={FOUNDER_VIDEO.src} poster={FOUNDER_VIDEO.poster} muted loop playsInline preload="metadata" tabIndex={-1} aria-label={FOUNDER_VIDEO.title} disablePictureInPicture x-webkit-airplay="deny" />
                  <span className="iw-scrim" aria-hidden="true" />
                  <span className="iw-glass" aria-hidden="true" />
                  <span className="iw-border" aria-hidden="true" />
                  {!reduce && <motion.span className="iw-glare" style={{ background: glare }} aria-hidden="true" />}
                  <button type="button" className="iw-saypill" onClick={toggleSound} aria-label={muted ? 'Unmute video' : 'Mute video'}><span className="dot" aria-hidden="true" />{muted ? 'Tap to hear her' : 'Sound on'}</button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT editorial */}
          <motion.div className="iw-right" style={reduce ? undefined : { y: rightY }}>
            <motion.span className="iw-num" {...up(0.3)}>01</motion.span>
            <h2 className="iw-h">
              <span className="iw-line"><motion.span initial="hidden" animate={entered ? 'show' : 'hidden'} variants={wordVar} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.36 }}>Built,</motion.span></span>
              <span className="iw-line"><motion.span className="iw-ital" initial="hidden" animate={entered ? 'show' : 'hidden'} variants={wordVar} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.44 }}>not hired.</motion.span></span>
            </h2>
            <motion.p className="iw-p" {...up(0.56)}>Every rep is trained to the bar she&apos;d set for her own customers. People first, standard always.</motion.p>
          </motion.div>
        </div>

        {/* ── floating glass chips (parallax outer · entrance inner · idle span) ── */}
        <motion.div className="iw-chip iw-c-stat" style={reduce ? undefined : { y: f1 }}>
          <motion.div initial="hidden" animate={entered ? 'show' : 'hidden'} variants={chipEnter(0.6)}>
            <span className="iw-idle"><span className="iw-card">
              <span className="iw-stack" aria-hidden="true"><img src={AVA[0]} alt="" loading="lazy" /><img src={AVA[1]} alt="" loading="lazy" /><img src={AVA[2]} alt="" loading="lazy" /></span>
              <span><span className="iw-card-n">450+</span><span className="iw-card-l">Reps trained, in person</span></span>
            </span></span>
          </motion.div>
        </motion.div>

        <motion.div className="iw-chip iw-c-award" style={reduce ? undefined : { y: f2 }}>
          <motion.div initial="hidden" animate={entered ? 'show' : 'hidden'} variants={chipEnter(0.68)}>
            <span className="iw-idle"><span className="iw-card">
              <span className="iw-card-ic iw-card-ic--dark"><TrophyIcon /></span>
              <span><span className="iw-card-n" style={{ fontSize: 15 }}>Owner of the Year</span><span className="iw-card-l">National recognition · 2022</span></span>
            </span></span>
          </motion.div>
        </motion.div>

        <motion.div className="iw-chip iw-c-floor" style={reduce ? undefined : { y: f3 }}>
          <motion.div initial="hidden" animate={entered ? 'show' : 'hidden'} variants={chipEnter(0.76)}>
            <span className="iw-idle"><span className="iw-card">
              <span className="iw-card-ic"><WaveIcon /></span>
              <span><span className="iw-card-n" style={{ fontSize: 15 }}>On the floor</span><span className="iw-card-l">Since 2016 — trained, not scripted</span></span>
            </span></span>
          </motion.div>
        </motion.div>

        <motion.div className="iw-chip iw-c-reach" style={reduce ? undefined : { y: f4 }}>
          <motion.div initial="hidden" animate={entered ? 'show' : 'hidden'} variants={chipEnter(0.84)}>
            <span className="iw-idle"><span className="iw-card">
              <span><span className="iw-card-n" style={{ fontSize: 15 }}>40+ cities · 99% reach</span><span className="iw-card-l">Built, not hired</span></span>
              <span className="iw-stack" aria-hidden="true"><img src={AVA[3]} alt="" loading="lazy" /><img src={AVA[4]} alt="" loading="lazy" /><span className="more">+</span></span>
            </span></span>
          </motion.div>
        </motion.div>

        <motion.a href="/team/abby-caudill" className="iw-arrow" aria-label="Read Abby's full story"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }} animate={entered ? { opacity: 1, scale: 1 } : {}} transition={reduce ? { duration: 0.5, delay: 0.9 } : { ...SPRING, delay: 0.92 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 L17 7 M9 7 h8 v8" /></svg>
        </motion.a>
      </div>
    </section>
  );
}
