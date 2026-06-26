import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import MagneticButton from './MagneticButton';
import { SOCIAL, SOCIAL_URL, SOCIAL_VIDEOS_READY } from '../data/media';

const EXPO = [0.16, 1, 0.3, 1];

/* SocialWall — the @credence social wall at the foot of the home page.
   A horizontal, infinitely auto-scrolling strip of portrait media tiles
   (Instagram reels + photos) that fan up into a gentle, spatially-FIXED
   dome: middle tiles ride high and upright, outer tiles drop toward the
   corners and tilt out. Cards flow THROUGH the curve as they scroll — the
   bump does not slide with the strip.

   Reuses the site marquee (`.marquee-wrap` + `.marquee-track`, CSS keyframes
   in index.css that pause on :hover). The arch is one cheap rAF loop that
   reads the marquee's live progress from the Web Animations API (never
   getComputedStyle), gated to only run while the section is on screen.

   Performance contract:
   • <video preload="none"> — no reel is fetched until its tile enters the
     visible band (IntersectionObserver → play(), which triggers the fetch).
   • The duplicated second half (the seamless-loop clones) renders each reel
     as a plain poster <img>, never a live <video> — no second decoders.
   • Per-frame work is read currentTime + write transforms only; each tile's
     base center + width is cached on mount/resize, not measured per frame. */

const AMP = 42;     // dome height (px)
const ROT = 5.5;    // max tile tilt (deg)
const CLAMP = 1.35; // clamp on the normalized horizontal position t

function InstagramGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function VerifiedGlyph({ size = 16 }) {
  // Material Symbols "verified" seal — the check is a clean cut-out of the badge.
  return (
    <svg className="sw-verified" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 2.96 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21.04l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
    </svg>
  );
}

export default function SocialWall() {
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches
  );

  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const archRefs = useRef([]);   // .social-arch wrappers (both copies)
  const videoRefs = useRef([]);  // real <video> els (first copy only)
  const metaRef = useRef([]);    // cached { c: center-x, w } per wrapper
  const envRef = useRef({ vw: 1, wrapLeft: 0, half: 1 });
  const rafRef = useRef(0);
  const runningRef = useRef(false);

  /* scroll-linked parallax — three layers drift at different rates as the
     section passes, giving real depth. The strip uses VERTICAL parallax only:
     a y-translate never changes the tiles' horizontal position, so the arch
     dome (which reads x) stays perfectly aligned. Disabled for reduced motion. */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgYRaw = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);       // background recedes (descends)
  const headerYRaw = useTransform(scrollYProgress, [0, 1], ['46px', '-46px']); // header floats up (foreground)
  const stripYRaw = useTransform(scrollYProgress, [0, 1], ['28px', '-24px']);  // marquee rises, slower
  const bgY = reduce ? 0 : bgYRaw;
  const headerY = reduce ? 0 : headerYRaw;
  const stripY = reduce ? 0 : stripYRaw;

  const doubled = [...SOCIAL, ...SOCIAL];

  /* track breakpoint — arch is desktop/tablet only */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const upd = () => setIsMobile(mq.matches);
    mq.addEventListener('change', upd);
    return () => mq.removeEventListener('change', upd);
  }, []);

  /* cache each tile's layout center + the environment (cheap, not per-frame).
     offset* metrics ignore CSS transforms, so they give the rest-position
     center even while the marquee is mid-animation. */
  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const wrap = track.parentElement;
    envRef.current = {
      vw: window.innerWidth || 1,
      wrapLeft: wrap ? wrap.getBoundingClientRect().left : 0,
      half: track.scrollWidth / 2 || 1, // one copy = the loop distance
    };
    metaRef.current = archRefs.current.map((el) =>
      el ? { c: el.offsetLeft + el.offsetWidth / 2, w: el.offsetWidth } : null
    );
  }, []);

  /* write the dome transform for every wrapper at the current scroll offset */
  const paint = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { vw, wrapLeft, half } = envRef.current;

    // live marquee offset from the Web Animations API (no layout flush)
    let tx = 0;
    const anim = track.getAnimations?.()[0];
    if (anim && anim.effect) {
      const dur = anim.effect.getComputedTiming().duration || 1;
      const ct = typeof anim.currentTime === 'number' ? anim.currentTime : 0;
      const p = (((ct % dur) + dur) % dur) / dur; // 0..1
      tx = -half * p;
    }

    const arches = archRefs.current;
    const metas = metaRef.current;
    for (let i = 0; i < arches.length; i++) {
      const el = arches[i];
      const m = metas[i];
      if (!el || !m) continue;
      const cx = wrapLeft + m.c + tx;           // tile center in the viewport
      let t = (cx / vw) * 2 - 1;                 // -1 left … 0 center … +1 right
      if (t > CLAMP) t = CLAMP; else if (t < -CLAMP) t = -CLAMP;
      const ty = AMP * t * t - AMP * 0.35;       // center up, edges down
      const rot = ROT * t;                       // tilt outward at the edges
      el.style.transform = `translateY(${ty.toFixed(2)}px) rotate(${rot.toFixed(3)}deg)`;
    }
  }, []);

  const loop = useCallback(() => {
    paint();
    rafRef.current = requestAnimationFrame(loop);
  }, [paint]);

  const start = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  const stop = useCallback(() => {
    runningRef.current = false;
    cancelAnimationFrame(rafRef.current);
  }, []);

  /* measure on mount + whenever size / breakpoint changes */
  useEffect(() => {
    measure();
    if (isMobile) {
      // flat strip — clear any arch transform left from a wider layout
      archRefs.current.forEach((el) => { if (el) el.style.transform = ''; });
    } else {
      paint(); // place the dome immediately so there's no first-frame flash
    }
    const onResize = () => { measure(); if (!isMobile) paint(); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [measure, paint, isMobile]);

  /* run the rAF loop ONLY while the section is on screen, and never on
     mobile (flat) or reduced motion (static). IO on the section is reliable
     because the section moves with page scroll (unlike the animated tiles). */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (isMobile || reduce) {
      stop();
      if (!isMobile) { measure(); paint(); } // reduced motion: one static dome
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { measure(); start(); }
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(section);
    return () => { io.disconnect(); stop(); };
  }, [isMobile, reduce, measure, paint, start, stop]);

  /* band-gated autoplay: a reel plays only while its tile sits in the central
     band, capping concurrent decode to ~2–3. preload="none" means play() is
     also what first fetches the file. No autoplay under reduced motion. */
  useEffect(() => {
    if (reduce) return;
    const vids = videoRefs.current.filter(Boolean);
    if (!vids.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        });
      },
      // trim the viewport 15% each side so only mid-strip tiles count
      { root: null, rootMargin: '0px -15% 0px -15%', threshold: 0.55 }
    );
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [reduce, isMobile]);

  return (
    <section ref={sectionRef} className="sw-section paper pad-sm relative overflow-hidden">
      <style>{`
        /* ── premium ambient background — brand teal + warm amber only,
           tinted via tokens so it stays subtle and on-tone in both themes ── */
        .sw-section {
          background-color: var(--ink);
        }
        .sw-bg { display: none; position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        /* top key-light */
        .sw-bg-glow { position: absolute; left: 50%; top: -10%; transform: translateX(-50%);
          width: min(84vw, 1060px); height: 56%;
          background: radial-gradient(60% 70% at 50% 0%, color-mix(in srgb, var(--electric) 15%, transparent), transparent 66%);
          filter: blur(24px); }
        /* two soft drifting orbs — one teal, one amber */
        .sw-orb { position: absolute; border-radius: 50%; filter: blur(76px); will-change: transform; }
        .sw-orb-1 { width: 32vw; max-width: 440px; aspect-ratio: 1; left: -7%; top: 4%;
          background: radial-gradient(circle, color-mix(in srgb, var(--electric) 22%, transparent), transparent 64%); }
        .sw-orb-2 { width: 30vw; max-width: 420px; aspect-ratio: 1; right: -6%; bottom: -8%;
          background: radial-gradient(circle, color-mix(in srgb, var(--ember) 15%, transparent), transparent 64%); }
        /* fine grain for tactile depth (static, cheap) */
        .sw-grain { position: absolute; inset: 0; opacity: 0.035; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 140px 140px; }
        /* twinkling sparkles — tiny brand-teal glints that fade in and out */
        .sw-spark { position: absolute; width: 5px; height: 5px; border-radius: 50%; opacity: 0;
          background: radial-gradient(circle, color-mix(in srgb, var(--electric) 85%, #ffffff), transparent 70%);
          box-shadow: 0 0 9px color-mix(in srgb, var(--electric) 55%, transparent); will-change: opacity, transform; }
        .sw-spark-1 { left: 13%; top: 24%; animation: sw-twinkle 5.4s ease-in-out 0.4s infinite; }
        .sw-spark-2 { right: 15%; top: 18%; animation: sw-twinkle 6.6s ease-in-out 1.6s infinite; }
        .sw-spark-3 { left: 24%; bottom: 30%; animation: sw-twinkle 7.2s ease-in-out 2.6s infinite; }
        .sw-spark-4 { right: 22%; bottom: 24%; animation: sw-twinkle 5.9s ease-in-out 1.0s infinite; }
        @keyframes sw-twinkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 0.85; transform: scale(1); } }

        /* ── premium header ─────────────────────────────────────────────── */
        .sw-head { position: relative; z-index: 2; text-align: center; }
        .sw-badge { display: inline-flex; align-items: center; gap: 9px; padding: 7px 15px 7px 11px;
          border-radius: 999px; border: 1px solid color-mix(in srgb, var(--electric) 26%, var(--hair));
          background: color-mix(in srgb, var(--graphite) 58%, transparent);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 12px 30px -22px var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.06);
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--bone); }
        .sw-badge-dot { position: relative; width: 7px; height: 7px; border-radius: 50%; background: var(--electric); }
        .sw-badge-dot::after { content: ''; position: absolute; inset: -4px; border-radius: 50%;
          background: var(--electric); opacity: 0.4; animation: sw-ping 2.4s var(--ease-out-quart) infinite; }
        @keyframes sw-ping { 0% { transform: scale(0.6); opacity: 0.5; } 70%, 100% { transform: scale(2.1); opacity: 0; } }
        .sw-title { font-family: var(--font-display); color: var(--bone); margin-top: clamp(18px, 2.2vw, 26px);
          line-height: 1.0; letter-spacing: -0.02em; font-size: clamp(34px, 5.2vw, 68px); }
        /* generous bottom padding so the italic descenders (p, y) are never
           clipped by the reveal's overflow:hidden; 110% slide still hides them. */
        .sw-title-line { display: block; overflow: hidden; padding: 0.05em 0.08em 0.26em; }
        .sw-title-line > span { display: block; will-change: transform; }
        .sw-ital { font-style: italic; font-weight: 500;
          background: linear-gradient(100deg, var(--electric) 0%, #6FB6D9 50%, var(--electric) 100%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: var(--electric); }
        .sw-accent-line { height: 2px; width: 0; margin: clamp(18px, 2vw, 24px) auto 0; border-radius: 2px;
          background: linear-gradient(90deg, transparent, var(--electric), var(--ember), transparent); }
        .sw-sub { color: var(--smoke); max-width: 600px; margin: clamp(16px, 1.8vw, 22px) auto 0;
          font-size: clamp(15px, 1.2vw, 18px); line-height: 1.62; }

        /* ── gradient outline + glow on the marquee tiles (visual only) ──── */
        .sw-card::before {
          content: ''; position: absolute; inset: 0; z-index: 3; pointer-events: none; border-radius: inherit;
          padding: 1px;
          background: linear-gradient(145deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 26%, transparent 50%, color-mix(in srgb, var(--electric) 34%, transparent) 100%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity: 0.4; transition: opacity 0.45s ease;
        }
        .sw-card:hover::before { opacity: 0.85; }

        /* asymmetric: the dome only lifts centre tiles ~15px up but drops the
           edges ~62px, so the top band can be tight while the bottom keeps the
           headroom the arch needs (overflow-hidden would otherwise clip it). */
        .sw-marquee { padding-top: clamp(26px, 3vw, 38px); padding-bottom: clamp(64px, 6vw, 76px); }
        .sw-strip { margin-top: clamp(18px, 2.4vw, 30px); }
        .social-arch { padding-inline: 9px; will-change: transform; transform: translateY(0); }
        .sw-card {
          display: block; position: relative;
          width: clamp(160px, 17vw, 224px); aspect-ratio: 3 / 4;
          border-radius: 20px; border: 1px solid var(--hair);
          overflow: hidden; background: var(--graphite);
          box-shadow: 0 20px 46px -26px var(--shadow-card), 0 2px 8px -4px rgba(0,0,0,0.4);
          transition: transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s cubic-bezier(0.16,1,0.3,1);
          /* translate3d keeps the card on its own GPU layer so the rounded clip
             holds while the inner image scales (fixes square-corner hover glitch
             inside the transformed .social-arch). */
          transform: translate3d(0, 0, 0); backface-visibility: hidden;
        }
        .sw-card:hover { transform: translate3d(0, -8px, 0);
          box-shadow: 0 40px 72px -28px var(--shadow-card),
            0 0 0 1px color-mix(in srgb, var(--electric) 22%, transparent),
            0 18px 50px -22px color-mix(in srgb, var(--electric) 40%, transparent); }
        .sw-card:focus-visible { outline: 2px solid var(--electric); outline-offset: 3px; }
        .sw-media-wrap { position: absolute; inset: 0; overflow: hidden; border-radius: inherit; }
        .sw-media { width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.55s cubic-bezier(0.16,1,0.3,1); }
        .sw-card:hover .sw-media { transform: scale(1.06); }
        .sw-ig {
          position: absolute; top: 10px; right: 10px; width: 30px; height: 30px;
          display: grid; place-items: center; border-radius: 50%;
          background: rgba(10,10,11,0.42); backdrop-filter: blur(4px);
          color: #F4F1EA; opacity: 0; transform: translateY(-4px);
          transition: opacity 0.3s ease, transform 0.3s ease; pointer-events: none;
        }
        .sw-card:hover .sw-ig { opacity: 1; transform: translateY(0); }
        @media (hover: none) { .sw-ig { opacity: 0.82; transform: none; } }
        /* "View on Instagram" overlay — fades up from the bottom on hover */
        .sw-card::after {
          content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none; border-radius: inherit;
          background: linear-gradient(to top, rgba(10,12,12,0.5), transparent 38%);
          opacity: 0; transition: opacity 0.3s ease;
        }
        .sw-card:hover::after { opacity: 1; }
        .sw-view {
          position: absolute; left: 10px; right: 10px; bottom: 10px; z-index: 2;
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          padding: 8px 10px; border-radius: 999px; white-space: nowrap;
          font-family: 'JetBrains Mono', monospace; font-size: 8.5px; letter-spacing: 0.1em; text-transform: uppercase;
          color: #0E1618; background: rgba(243,238,226,0.94);
          backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
          opacity: 0; transform: translateY(7px); transition: opacity 0.3s ease, transform 0.3s ease; pointer-events: none;
          box-shadow: 0 10px 22px -14px rgba(0,0,0,0.5);
        }
        .sw-card:hover .sw-view { opacity: 1; transform: translateY(0); }
        @media (hover: none) { .sw-card::after, .sw-view { display: none; } }
        /* Instagram identity chip under the heading */
        .sw-handle {
          display: inline-flex; align-items: center; gap: 9px; margin-top: clamp(18px, 2.2vw, 26px);
          padding: 9px 16px 9px 13px; border-radius: 999px; text-decoration: none;
          border: 1px solid var(--hair); background: color-mix(in srgb, var(--graphite) 52%, transparent);
          box-shadow: 0 14px 30px -24px var(--shadow-card);
          transition: border-color .3s ease, background .3s ease, transform .3s var(--ease-out-quart);
        }
        .sw-handle:hover { border-color: color-mix(in srgb, var(--electric) 45%, var(--hair));
          background: color-mix(in srgb, var(--graphite) 72%, transparent); transform: translateY(-1px); }
        .sw-handle:focus-visible { outline: 2px solid var(--electric); outline-offset: 3px; }
        .sw-handle-ig { display: grid; place-items: center; color: var(--electric); }
        .sw-handle-name { display: inline-flex; align-items: center; gap: 5px;
          font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--bone); }
        .sw-verified { color: var(--electric); flex: none; }
        .sw-handle-sep { width: 1px; height: 14px; background: var(--hair); }
        .sw-handle-cta { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--smoke); }
        .sw-btn-ig { display: inline-flex; align-items: center; margin-right: 8px; vertical-align: middle; }
        /* WCAG 2.2.2 — a focused tile must not scroll out from under a keyboard user */
        .sw-marquee:focus-within .marquee-track { animation-play-state: paused; }
        @media (max-width: 640px) {
          .sw-marquee { padding-block: 18px; }
          .sw-card { width: clamp(132px, 42vw, 168px); border-radius: 14px; }
          .social-arch { transform: none !important; padding-inline: 6px; will-change: auto; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sw-marquee .marquee-track { animation: none !important; transform: translateX(0) !important; }
          .sw-card, .sw-media, .sw-ig { transition: none; }
          .sw-card:hover { transform: none; box-shadow: 0 18px 42px -26px var(--shadow-card); }
          .sw-card:hover .sw-media { transform: none; }
          .sw-badge-dot::after, .sw-spark { animation: none !important; }
          .sw-spark { display: none; }
        }
      `}</style>

      {/* ── layered ambient background (decorative, parallax + fade-in) ── */}
      <motion.div
        className="sw-bg" aria-hidden="true"
        style={{ y: bgY }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1.3, ease: EXPO }}
      >
        <div className="sw-bg-glow" />
        <motion.span className="sw-orb sw-orb-1"
          animate={reduce ? undefined : { x: ['-3%', '6%', '-3%'], y: ['2%', '-4%', '2%'] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.span className="sw-orb sw-orb-2"
          animate={reduce ? undefined : { x: ['3%', '-5%', '3%'], y: ['-2%', '5%', '-2%'] }}
          transition={{ duration: 31, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="sw-grain" />
        {/* twinkling decorative sparkles (parallax with the bg layer) */}
        <span className="sw-spark sw-spark-1" /><span className="sw-spark sw-spark-2" />
        <span className="sw-spark sw-spark-3" /><span className="sw-spark sw-spark-4" />
      </motion.div>

      {/* ── premium header (staged cinematic reveal + scroll parallax) ── */}
      <div className="shell">
        <motion.div className="sw-head" style={{ y: headerY }}>
          <motion.span className="sw-badge"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: EXPO }}>
            <span className="sw-badge-dot" aria-hidden="true" />
            On Instagram
          </motion.span>

          {/* line-clip reveal driven by the (always-visible) h2 — observing the
              clipped child spans directly would deadlock the IntersectionObserver. */}
          <motion.h2 className="sw-title"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } } }}>
            <span className="sw-title-line">
              <motion.span variants={{
                hidden: reduce ? { opacity: 0 } : { y: '110%' },
                show: { opacity: 1, y: '0%', transition: { duration: 0.85, ease: EXPO } },
              }}>
                Life at Credence,
              </motion.span>
            </span>
            <span className="sw-title-line">
              <motion.span className="sw-ital" variants={{
                hidden: reduce ? { opacity: 0 } : { y: '110%' },
                show: { opacity: 1, y: '0%', transition: { duration: 0.85, ease: EXPO } },
              }}>
                post by post.
              </motion.span>
            </span>
          </motion.h2>

          <motion.div className="sw-accent-line" aria-hidden="true"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 'clamp(120px, 18vw, 220px)', opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.42, ease: EXPO }} />

          <motion.p className="sw-sub"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.5, ease: EXPO }}>
            Reels from the floor, wins worth celebrating, and the team behind the standard — straight from our feed.
          </motion.p>

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.6, ease: EXPO }}>
            <a className="sw-handle" href={SOCIAL_URL} target="_blank" rel="noopener noreferrer" aria-label="Credence Innovations on Instagram (opens in a new tab)">
              <span className="sw-handle-ig" aria-hidden="true"><InstagramGlyph /></span>
              <span className="sw-handle-name">@credenceinnovations<VerifiedGlyph /></span>
              <span className="sw-handle-sep" aria-hidden="true" />
              <span className="sw-handle-cta">Latest from Instagram</span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* marquee container — scales 0.96 → 1 and fades in once (the inner
          marquee structure + scroll logic stay exactly as-is). On settle it
          fires a resize so the arch re-measures at the final scale. */}
      <motion.div
        className="sw-strip"
        style={{ position: 'relative', zIndex: 2, y: stripY, willChange: 'transform, opacity' }}
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, delay: 0.35, ease: EXPO }}
        onAnimationComplete={() => { try { window.dispatchEvent(new Event('resize')); } catch { /* noop */ } }}
      >
        <div className="sw-marquee marquee-wrap overflow-hidden relative">
          <div className="marquee-track" ref={trackRef}>
            {doubled.map((item, i) => {
              const isClone = i >= SOCIAL.length;
              const liveVideo = item.type === 'video' && !isClone && !reduce && SOCIAL_VIDEOS_READY;
              const imgSrc = item.type === 'video' ? item.poster : item.src;
              return (
                <div
                  key={i}
                  className="social-arch"
                  ref={(el) => { archRefs.current[i] = el; }}
                >
                  <a
                    className="sw-card"
                    href={isClone ? undefined : item.href}
                    target={isClone ? undefined : '_blank'}
                    rel={isClone ? undefined : 'noopener noreferrer'}
                    aria-hidden={isClone ? 'true' : undefined}
                    tabIndex={isClone ? -1 : undefined}
                    aria-label={
                      isClone
                        ? undefined
                        : `${item.type === 'video' ? 'Watch reel' : 'View post'} on Instagram — ${item.caption}`
                    }
                  >
                    <div className="sw-media-wrap">
                      {liveVideo ? (
                        <video
                          ref={(el) => { videoRefs.current[i] = el; }}
                          className="sw-media"
                          src={item.src}
                          poster={item.poster}
                          muted
                          loop
                          playsInline
                          preload="none"
                          tabIndex={-1}
                          aria-hidden="true"
                        />
                      ) : (
                        <img className="sw-media" src={imgSrc} alt="" loading="lazy" draggable="false" />
                      )}
                      <span className="sw-ig"><InstagramGlyph /></span>
                      {!isClone && <span className="sw-view" aria-hidden="true">View on Instagram</span>}
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <div className="shell" style={{ textAlign: 'center', marginTop: 'clamp(14px, 2vw, 26px)', position: 'relative', zIndex: 2 }}>
        <MagneticButton href={SOCIAL_URL} target="_blank" rel="noopener noreferrer">
          <span className="sw-btn-ig" aria-hidden="true"><InstagramGlyph /></span>
          Follow @credenceinnovations
        </MagneticButton>
      </div>
    </section>
  );
}
