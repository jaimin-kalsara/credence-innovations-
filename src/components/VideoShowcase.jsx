import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  motion, AnimatePresence, useReducedMotion,
  useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, useInView,
} from 'framer-motion';
import { FadeUp } from './AnimatedSection';
import { VIDEOS_READY } from '../data/media';

const SPRING = { type: 'spring', stiffness: 120, damping: 20, mass: 1 };

/* VideoShowcase — shared building blocks for the brand's video surfaces:
   • VideoGrid    — a responsive grid of cover tiles (poster + play button) that
                    open a full lightbox (sound + controls) on click. Used for
                    the team testimonials grid and the careers grid.
   • FeaturedVideo — a single large "film" tile (natural ratio, or a fixed
                    `aspect` frame with a blurred fill) that opens the same
                    lightbox. Used for the founder feature and the About story.

   Performance: covers are STATIC posters (these are 34–110MB HD interview
   clips, so autoplaying them on scroll was the site's biggest lag source).
   Only the lightbox loads + plays the real file, and only while it's open —
   so nothing heavy is fetched until the visitor actually clicks play.
   Styles live in index.css under the `.vs-*` namespace. */

const EXPO = [0.16, 1, 0.3, 1];

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5 L19 12 L8 18.5 Z" />
    </svg>
  );
}

/* full-screen player: eager load + sound + native controls, focus-trapped,
   body-scroll-locked, closes on Esc / backdrop / button (restores focus). */
function VideoLightbox({ video, onClose }) {
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  useEffect(() => {
    const prevFocus = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'Tab') {
        const f = dialogRef.current?.querySelectorAll('button, video, [href], [tabindex]:not([tabindex="-1"])');
        if (!f || !f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (prevFocus && prevFocus.focus) prevFocus.focus();
    };
  }, [onClose]);

  const note = VIDEOS_READY
    ? video.blurb
    : [video.blurb, 'Full video coming soon.'].filter(Boolean).join(' · ');

  return createPortal(
    <motion.div
      className="vs-backdrop"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      role="dialog" aria-modal="true" aria-label={video.title || 'Video'}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        ref={dialogRef} className="vs-modal"
        initial={{ opacity: 0, y: 18, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3, ease: EXPO }}
      >
        <button ref={closeRef} type="button" className="vs-close" onClick={onClose} aria-label="Close video">✕</button>
        {VIDEOS_READY
          ? <video className="vs-modal-video" src={video.src} poster={video.poster} controls autoPlay playsInline preload="auto" />
          : <img className="vs-modal-video" src={video.poster} alt={video.title || 'Video'} />}
        {(video.title || note) && (
          <div className="vs-modal-meta">
            {video.title && <h3>{video.title}</h3>}
            {note && <p>{note}</p>}
          </div>
        )}
      </motion.div>
    </motion.div>,
    document.body
  );
}

function CoverCard({ item, onOpen }) {
  return (
    <button type="button" className="vs-card" onClick={() => onOpen(item)} aria-label={`Play video — ${item.title}`}>
      <img className="vs-cover" src={item.poster} alt="" loading="lazy" />
      <span className="vs-grad" aria-hidden="true" />
      <span className="vs-play" aria-hidden="true"><PlayIcon /></span>
      {item.title && (
        <span className="vs-cap">{item.title}{item.blurb && <em>{item.blurb}</em>}</span>
      )}
    </button>
  );
}

export function VideoGrid({ items = [] }) {
  const [active, setActive] = useState(null);
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {items.map((it, i) => (
          <FadeUp key={i} delay={i * 0.06}>
            <CoverCard item={it} onOpen={setActive} />
          </FadeUp>
        ))}
      </div>
      <AnimatePresence>
        {active && <VideoLightbox video={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </>
  );
}

/* little equaliser used by the "Now playing" pill */
function NowPlayingBars() {
  return (
    <span className="tm-eq" aria-hidden="true"><i /><i /><i /></span>
  );
}

/* ── one cinematic video card ─────────────────────────────────────────────
   Four nested layers keep every transform independent (no fights):
     .tm-parallax  ← scroll-linked drift (useScroll → useTransform)
     .tm-enter     ← one-shot entrance (fade/scale/translate/rotate/de-blur)
     .tm-card      ← mouse tilt (≤4°) + hover scale, holds the video + overlays
   Hover/focus = "active": the parent guarantees only one card is active, so
   only one video ever plays. preload="none" + play-on-active = lazy load. */
function TeamVideoCard({ item, pos, num, delay, entered, isActive, onActivate, onDeactivate, onOpen, progress, reduce }) {
  const videoRef = useRef(null);
  const barRef = useRef(null);
  const playRef = useRef(null); // tracks the in-flight play() promise (race-safe pause)

  // mouse position inside the card (0..1) → tilt + glare
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [4, -4]), SPRING);
  const ry = useSpring(useTransform(mx, [0, 1], [-4, 4]), SPRING);
  const scale = useSpring(1, SPRING);
  const glareX = useTransform(mx, (v) => `${(v * 100).toFixed(1)}%`);
  const glareY = useTransform(my, (v) => `${(v * 100).toFixed(1)}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.22), transparent 46%)`;

  // scroll-linked parallax (subtle, different per position; spread→together)
  const pyR = reduce ? [0, 0] : pos === 'center' ? [26, -26] : pos === 'left' ? [40, -10] : [10, -40];
  const pxR = reduce ? [0, 0, 0] : pos === 'left' ? [0, -20, 0] : pos === 'right' ? [0, 20, 0] : [0, 0, 0];
  const prR = reduce ? [0, 0] : pos === 'left' ? [1.6, -1.6] : pos === 'right' ? [-1.6, 1.6] : [0.6, -0.6];
  const py = useTransform(progress, [0, 1], pyR);
  const px = useTransform(progress, [0, 0.5, 1], pxR);
  const pr = useTransform(progress, [0, 1], prR);

  useEffect(() => { scale.set(isActive && !reduce ? 1.03 : 1); }, [isActive, reduce, scale]);

  // play/pause driven by the single shared "active" flag. Pausing waits for any
  // in-flight play() to settle first, so a fast hover-switch never leaves two
  // videos playing (the classic "play() interrupted by pause()" race).
  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduce) return;
    if (isActive) {
      v.muted = false;
      playRef.current = v.play(); // unmute if policy allows…
      if (playRef.current && playRef.current.catch) {
        playRef.current.catch(() => { v.muted = true; playRef.current = v.play(); if (playRef.current && playRef.current.catch) playRef.current.catch(() => {}); }); // …else fall back to muted
      }
    } else {
      const pause = () => { v.pause(); try { v.currentTime = 0; } catch { /* noop */ } v.muted = true; };
      if (playRef.current && playRef.current.then) playRef.current.then(pause).catch(pause);
      else pause();
      if (barRef.current) barRef.current.style.transform = 'scaleX(0)';
    }
  }, [isActive, reduce]);

  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onProgress = () => {
    const v = videoRef.current, bar = barRef.current;
    if (!v || !bar || !v.duration) return;
    bar.style.transform = `scaleX(${(v.currentTime / v.duration).toFixed(4)})`;
  };

  const enterVar = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.5, delay } } }
    : {
        hidden: { opacity: 0, scale: 0.9, y: 44, rotate: pos === 'left' ? -2.5 : pos === 'right' ? 2.5 : 0, filter: 'blur(12px)' },
        show: { opacity: 1, scale: 1, y: 0, rotate: 0, filter: 'blur(0px)', transition: { ...SPRING, delay } },
      };

  return (
    <div className={`tm-slot tm-slot--${pos}`}>
      <motion.div className="tm-parallax" style={reduce ? undefined : { y: py, x: px, rotate: pr }}>
        <motion.div className="tm-enter" initial="hidden" animate={entered ? 'show' : 'hidden'} variants={enterVar}>
          <motion.button
            type="button"
            className={`tm-card tm-card--${pos} ${isActive ? 'is-active' : ''}`}
            style={reduce ? undefined : { rotateX: rx, rotateY: ry, scale, transformPerspective: 900 }}
            onMouseMove={onMove}
            onMouseEnter={onActivate}
            onMouseLeave={() => { onDeactivate(); mx.set(0.5); my.set(0.5); }}
            onFocus={onActivate}
            onBlur={onDeactivate}
            onClick={() => onOpen(item)}
            aria-label={`Play video — ${item.title}`}
            data-cursor="expand"
          >
            {/* media */}
            <img className="tm-poster" src={item.poster} alt="" loading="lazy" aria-hidden="true" />
            {VIDEOS_READY && (
              <video
                ref={videoRef} className="tm-video" src={item.src} poster={item.poster}
                muted loop playsInline preload="none" tabIndex={-1} aria-hidden="true"
                onTimeUpdate={onProgress}
              />
            )}

            {/* premium surface layers */}
            <span className="tm-scrim" aria-hidden="true" />
            <span className="tm-glass" aria-hidden="true" />
            <span className="tm-border" aria-hidden="true" />
            {!reduce && <motion.span className="tm-glare" style={{ background: glare }} aria-hidden="true" />}
            {!reduce && <span className="tm-sweep" aria-hidden="true" />}
            {!reduce && <span className="tm-particles" aria-hidden="true"><i /><i /><i /><i /></span>}

            {/* play affordance (fades out while playing) */}
            <span className="tm-play" aria-hidden="true"><span className="tm-play-ring" /><PlayIcon /></span>

            {/* "Now playing" indicator */}
            <span className="tm-now" aria-hidden="true"><NowPlayingBars />Now playing</span>

            {/* caption — slides up on hover */}
            <span className="tm-meta">
              <span className="tm-num">{num}{pos === 'center' ? ' — Featured' : ''}</span>
              <span className="tm-cap-title">{item.title}</span>
              {item.blurb && <span className="tm-teaser">{item.blurb}</span>}
              <span className="tm-foot">
                <span className="tm-by">{item.name ? `${item.name} · Credence team` : 'Credence team'}</span>
                {item.length && <span className="tm-len">{item.length}</span>}
              </span>
            </span>

            {/* scrubbing progress line */}
            <span className="tm-progress" aria-hidden="true"><i ref={barRef} /></span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* TestimonialShowcase — "From the team": a cinematic, self-contained dark island.
   One large centre video flanked by two offset side videos read as a single
   premium composition (overlapping depth, glass, gradient borders, ambient
   glow). Layered background (mesh + orbs + grid + grain). Staged entrance on
   first view (glow → heading words → subtitle → cards spring in, 100ms apart),
   subtle scroll parallax, magical hover (autoplay, tilt, glare, "now playing",
   progress), and single-video-at-a-time playback. Full lightbox on click. */
export function TestimonialShowcase({ items = [] }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const [lightbox, setLightbox] = useState(null);
  const [activeIdx, setActiveIdx] = useState(null);

  const visible = useInView(sectionRef, { margin: '-12% 0px -12% 0px' });
  const [entered, setEntered] = useState(false);
  useEffect(() => { if (visible) setEntered(true); }, [visible]);
  useEffect(() => { if (!visible) setActiveIdx(null); }, [visible]); // pause when off-screen

  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'end start'] });

  if (!items.length) return null;

  const cards = [
    { item: items[0], pos: 'center', num: '01', delay: 0.10 },
    { item: items[1], pos: 'left', num: '02', delay: 0.20 },
    { item: items[2], pos: 'right', num: '03', delay: 0.30 },
  ].filter((c) => c.item);

  const headWords = ['The', 'people', 'behind'];
  const wordVar = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { hidden: { y: '110%' }, show: { y: '0%' } };

  return (
    <section ref={sectionRef} className="tm-section paper relative overflow-hidden pad-lg" aria-label="From the team">
      <style>{`
        .tm-section { background-color: var(--ink); }

        /* layered background */
        .tm-bg { display: none; position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
        .tm-mesh { position: absolute; inset: -12%;
          background:
            radial-gradient(38% 36% at 20% 24%, rgba(111,168,194,0.12), transparent 70%),
            radial-gradient(40% 38% at 82% 30%, rgba(180,96,168,0.07), transparent 70%),
            radial-gradient(44% 42% at 60% 92%, rgba(232,146,60,0.07), transparent 72%); }
        .tm-grid { position: absolute; inset: 0; opacity: 0.5;
          background-image: linear-gradient(color-mix(in srgb, var(--bone) 7%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--bone) 7%, transparent) 1px, transparent 1px);
          background-size: 58px 58px;
          -webkit-mask: radial-gradient(circle at 50% 36%, #000, transparent 72%); mask: radial-gradient(circle at 50% 36%, #000, transparent 72%); }
        .tm-grain { position: absolute; inset: 0; opacity: 0.045; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 140px 140px; }
        .tm-orb { position: absolute; border-radius: 50%; filter: blur(80px); will-change: transform; }
        .tm-orb-1 { width: 36vw; max-width: 520px; aspect-ratio: 1; left: -8%; top: 6%;
          background: radial-gradient(circle, rgba(111,168,194,0.30), transparent 64%); }
        .tm-orb-2 { width: 32vw; max-width: 460px; aspect-ratio: 1; right: -6%; bottom: -6%;
          background: radial-gradient(circle, rgba(232,146,60,0.20), transparent 64%); }
        .tm-keylight { position: absolute; left: 50%; top: -6%; width: min(80vw, 1000px); height: 56%;
          background: radial-gradient(60% 70% at 50% 0%, rgba(111,168,194,0.22), transparent 66%); filter: blur(14px); }

        /* heading */
        .tm-head { position: relative; z-index: 2; text-align: center; max-width: 760px; margin-inline: auto; }
        .tm-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--electric); }
        .tm-eyebrow::before { content: ''; width: 22px; height: 1px; background: linear-gradient(90deg, transparent, var(--electric)); }
        .tm-eyebrow::after { content: ''; width: 22px; height: 1px; background: linear-gradient(90deg, var(--electric), transparent); }
        .tm-title { font-family: var(--font-display); color: var(--bone); margin-top: clamp(14px, 1.8vw, 22px);
          line-height: 1.0; letter-spacing: -0.02em; font-size: clamp(34px, 5vw, 64px); }
        .tm-line { display: inline-block; overflow: hidden; vertical-align: top; padding-block: 0.04em; }
        .tm-line > span { display: inline-block; will-change: transform; }
        .tm-word { margin-right: 0.26em; }
        .tm-ital { font-style: italic; font-weight: 500;
          background: linear-gradient(100deg, var(--electric) 0%, #6FB6D9 50%, var(--electric) 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: var(--electric); }
        .tm-sub { color: var(--smoke); margin: clamp(14px, 1.6vw, 20px) auto 0; max-width: 56ch;
          font-size: clamp(15px, 1.2vw, 18px); line-height: 1.6; }

        /* cinematic stage */
        .tm-stage { position: relative; z-index: 2; margin-top: clamp(38px, 4.6vw, 70px);
          display: grid; grid-template-columns: 0.84fr 1.12fr 0.84fr; align-items: center;
          gap: clamp(10px, 1.4vw, 26px); perspective: 1300px; }
        .tm-slot { position: relative; min-width: 0; }
        .tm-slot--center { grid-column: 2; grid-row: 1; z-index: 3; }
        .tm-slot--left { grid-column: 1; grid-row: 1; z-index: 2; transform: translateY(30px); margin-right: -5%; }
        .tm-slot--right { grid-column: 3; grid-row: 1; z-index: 2; transform: translateY(-30px); margin-left: -5%; }
        .tm-parallax { will-change: transform; }
        .tm-enter { will-change: transform, opacity; }

        .tm-card { position: relative; display: block; width: 100%; padding: 0; border: 0; cursor: pointer;
          aspect-ratio: 4 / 5; border-radius: 28px; overflow: hidden; background: var(--graphite);
          transform-style: preserve-3d; -webkit-tap-highlight-color: transparent;
          box-shadow: 0 30px 70px -34px var(--shadow-card), 0 2px 10px -4px var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.06);
          transition: box-shadow 0.5s var(--ease-out-expo); }
        .tm-card--center { aspect-ratio: 4 / 5; }
        .tm-card.is-active { box-shadow: 0 50px 100px -40px var(--shadow-card),
          0 0 0 1px color-mix(in srgb, var(--electric) 38%, transparent),
          0 24px 70px -26px color-mix(in srgb, var(--electric) 45%, transparent); }
        .tm-card:focus-visible { outline: 2px solid var(--electric); outline-offset: 4px; }

        .tm-poster, .tm-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
        .tm-video { opacity: 0; transition: opacity 0.5s ease; }
        .tm-card.is-active .tm-video { opacity: 1; }
        .tm-card.is-active .tm-poster { opacity: 0; }
        .tm-poster { transition: opacity 0.5s ease, transform 0.7s var(--ease-out-expo); }

        /* surface treatments */
        .tm-scrim { position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(to top, rgba(6,9,12,0.82) 2%, rgba(6,9,12,0.16) 40%, transparent 64%); }
        .tm-glass { position: absolute; inset: 0; pointer-events: none; opacity: 0.5; transition: opacity 0.5s ease;
          background: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 36%, transparent 60%); }
        .tm-card.is-active .tm-glass { opacity: 0; }
        .tm-border { position: absolute; inset: 0; pointer-events: none; border-radius: inherit; padding: 1px;
          background: linear-gradient(150deg, rgba(255,255,255,0.55), transparent 38%, color-mix(in srgb, var(--electric) 55%, transparent));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude;
          opacity: 0.4; transition: opacity 0.5s ease; }
        .tm-card.is-active .tm-border { opacity: 0.95; }
        .tm-glare { position: absolute; inset: 0; pointer-events: none; mix-blend-mode: soft-light; opacity: 0; transition: opacity 0.4s ease; }
        .tm-card.is-active .tm-glare { opacity: 1; }
        .tm-sweep { position: absolute; top: -30%; bottom: -30%; left: -40%; width: 34%; pointer-events: none;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.10) 50%, transparent 60%);
          transform: translateX(0) rotate(2deg); animation: tm-sweep 7.5s ease-in-out 1.4s infinite; }
        @keyframes tm-sweep { 0% { transform: translateX(0) rotate(2deg); } 60%, 100% { transform: translateX(560%) rotate(2deg); } }
        .tm-particles i { position: absolute; width: 4px; height: 4px; border-radius: 50%;
          background: rgba(255,255,255,0.7); box-shadow: 0 0 8px rgba(255,255,255,0.6); opacity: 0; }
        .tm-particles i:nth-child(1) { left: 18%; top: 26%; animation: tm-float 6.5s ease-in-out infinite; }
        .tm-particles i:nth-child(2) { left: 76%; top: 20%; animation: tm-float 8s ease-in-out 1.2s infinite; }
        .tm-particles i:nth-child(3) { left: 30%; top: 70%; animation: tm-float 7.2s ease-in-out 0.6s infinite; }
        .tm-particles i:nth-child(4) { left: 64%; top: 60%; animation: tm-float 9s ease-in-out 2s infinite; }
        @keyframes tm-float { 0%, 100% { opacity: 0; transform: translateY(6px); } 30%, 70% { opacity: 0.5; } 50% { transform: translateY(-10px); } }

        /* play affordance */
        .tm-play { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 3;
          display: grid; place-items: center; width: clamp(54px, 5vw, 70px); aspect-ratio: 1; border-radius: 50%;
          color: #0e1618; background: rgba(243,238,226,0.94); backdrop-filter: blur(6px);
          box-shadow: 0 16px 40px -16px rgba(0,0,0,0.6); transition: opacity 0.4s ease, transform 0.4s var(--ease-out-expo); }
        .tm-play svg { margin-left: 2px; }
        .tm-play-ring { position: absolute; inset: -8px; border-radius: 50%; border: 1px solid rgba(243,238,226,0.5);
          animation: tm-pulse 2.6s var(--ease-out-quart) infinite; }
        @keyframes tm-pulse { 0% { transform: scale(0.8); opacity: 0.6; } 70%, 100% { transform: scale(1.4); opacity: 0; } }
        .tm-card.is-active .tm-play { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }

        /* now playing */
        .tm-now { position: absolute; top: 14px; left: 14px; z-index: 4; display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 11px 6px 9px; border-radius: 999px; font-family: 'JetBrains Mono', monospace; font-size: 9px;
          letter-spacing: 0.14em; text-transform: uppercase; color: #F3EEE2;
          background: rgba(10,14,15,0.55); border: 1px solid rgba(255,255,255,0.14); backdrop-filter: blur(8px);
          opacity: 0; transform: translateY(-6px); transition: opacity 0.4s ease, transform 0.4s var(--ease-out-expo); }
        .tm-card.is-active .tm-now { opacity: 1; transform: translateY(0); }
        .tm-eq { display: inline-flex; align-items: flex-end; gap: 2px; height: 11px; }
        .tm-eq i { width: 2px; background: #7FB4CC; border-radius: 1px; height: 40%; animation: tm-eq 0.9s ease-in-out infinite; }
        .tm-eq i:nth-child(2) { animation-delay: 0.2s; } .tm-eq i:nth-child(3) { animation-delay: 0.4s; }
        @keyframes tm-eq { 0%, 100% { height: 30%; } 50% { height: 100%; } }

        /* caption */
        .tm-meta { position: absolute; left: 0; right: 0; bottom: 0; z-index: 3; display: flex; flex-direction: column;
          align-items: flex-start; gap: 5px; padding: clamp(16px, 1.6vw, 24px); text-align: left;
          transform: translateY(6px); transition: transform 0.5s var(--ease-out-expo); }
        .tm-card.is-active .tm-meta { transform: translateY(-6px); }
        /* caption sits over the dark scrim/video → fixed light in BOTH themes */
        .tm-num { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase; color: #8FC1D8; }
        .tm-cap-title { font-family: var(--font-display); font-weight: 600; color: #F6F2E8; line-height: 1.08;
          font-size: clamp(17px, 1.5vw, 23px); letter-spacing: -0.01em; }
        .tm-teaser { color: rgba(243,238,226,0.78); font-size: 12.5px; line-height: 1.45; max-width: 30ch;
          max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.5s ease, opacity 0.4s ease, margin 0.4s ease; }
        .tm-card.is-active .tm-teaser { max-height: 60px; opacity: 1; margin-top: 1px; }
        .tm-foot { display: inline-flex; align-items: center; gap: 9px; margin-top: 2px; }
        .tm-by { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(243,238,226,0.62); }
        .tm-len { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.08em; color: #F3EEE2;
          padding: 2px 7px; border-radius: 999px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.16); }

        /* progress line */
        .tm-progress { position: absolute; left: 0; right: 0; bottom: 0; z-index: 5; height: 2px; background: rgba(255,255,255,0.1);
          opacity: 0; transition: opacity 0.4s ease; }
        .tm-card.is-active .tm-progress { opacity: 1; }
        .tm-progress i { display: block; height: 100%; transform-origin: left; transform: scaleX(0);
          background: linear-gradient(90deg, var(--electric), var(--ember)); }

        @media (max-width: 860px) {
          .tm-stage { grid-template-columns: 1fr; gap: clamp(20px, 5vw, 30px); max-width: 460px; margin-inline: auto; perspective: none; }
          .tm-slot { grid-column: 1 !important; grid-row: auto !important; transform: none !important; margin: 0 !important; }
          .tm-card { aspect-ratio: 16 / 11; }
          .tm-card--center { aspect-ratio: 16 / 11; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tm-sweep, .tm-play-ring, .tm-eq i, .tm-particles i { animation: none !important; }
          .tm-card, .tm-glass, .tm-border, .tm-meta, .tm-now, .tm-play, .tm-video, .tm-poster { transition: none; }
        }

        /* MOBILE — horizontal snap carousel (≤640px only; desktop stage untouched) */
        @media (max-width: 640px) {
          .tm-stage { display: flex; flex-wrap: nowrap; overflow-x: auto; overflow-y: visible;
            scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; gap: 14px;
            scroll-padding-inline: 0; padding-bottom: 12px; max-width: 100%; margin-inline: 0;
            -ms-overflow-style: none; scrollbar-width: none; }
          .tm-stage::-webkit-scrollbar { display: none; }
          .tm-slot { flex: 0 0 84% !important; scroll-snap-align: start; min-width: 0; }
        }
      `}</style>

      {/* layered background */}
      <div className="tm-bg" aria-hidden="true">
        <div className="tm-mesh" />
        <motion.div className="tm-keylight"
          initial={{ opacity: 0, scale: 0.85 }} animate={entered ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.4, ease: EXPO }} />
        <motion.span className="tm-orb tm-orb-1"
          animate={reduce ? undefined : { x: ['-4%', '7%', '-4%'], y: ['2%', '-5%', '2%'] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.span className="tm-orb tm-orb-2"
          animate={reduce ? undefined : { x: ['4%', '-6%', '4%'], y: ['-3%', '5%', '-3%'] }}
          transition={{ duration: 31, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="tm-grid" />
        <div className="tm-grain" />
      </div>

      <div className="shell relative" style={{ zIndex: 2 }}>
        {/* heading — word reveal + subtitle */}
        <div className="tm-head">
          <motion.span className="tm-eyebrow"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EXPO }}>
            From the team
          </motion.span>
          <h2 className="tm-title">
            {headWords.map((w, i) => (
              <span className="tm-line" key={w}>
                <motion.span className="tm-word"
                  initial="hidden" animate={entered ? 'show' : 'hidden'} variants={wordVar}
                  transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.12 + i * 0.07 }}>
                  {w}
                </motion.span>
              </span>
            ))}
            <span className="tm-line">
              <motion.span className="tm-word tm-ital"
                initial="hidden" animate={entered ? 'show' : 'hidden'} variants={wordVar}
                transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.12 + headWords.length * 0.07 }}>
                the standard.
              </motion.span>
            </span>
          </h2>
          <motion.p className="tm-sub"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.42, ease: EXPO }}>
            Real team members on what it&apos;s like to build a career on the floor — hover to watch, click for the full story.
          </motion.p>
        </div>

        {/* cinematic trio */}
        <div ref={stageRef} className="tm-stage">
          {cards.map((c, i) => (
            <TeamVideoCard
              key={c.item.title + i}
              item={c.item} pos={c.pos} num={c.num} delay={c.delay}
              entered={entered} reduce={reduce} progress={scrollYProgress}
              isActive={activeIdx === i}
              onActivate={() => setActiveIdx(i)}
              onDeactivate={() => setActiveIdx((cur) => (cur === i ? null : cur))}
              onOpen={setLightbox}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && <VideoLightbox video={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </section>
  );
}

/* FeaturedVideo — a single feature tile. Omit `aspect` for the media's natural
   ratio (good for portrait clips in a narrow column); pass e.g. aspect="16 / 9"
   for a contained, fixed-ratio frame with a soft blurred fill (good for a wide
   story video so it never becomes a giant scroll). */
export function FeaturedVideo({ item, aspect }) {
  const [open, setOpen] = useState(false);
  const framed = Boolean(aspect);
  return (
    <>
      <button
        type="button"
        className={`vs-film ${framed ? 'vs-film--framed' : 'vs-film--natural'}`}
        style={framed ? { aspectRatio: aspect } : undefined}
        onClick={() => setOpen(true)}
        aria-label={`Play video — ${item.title}`}
      >
        {framed && <span className="vs-bg" style={{ backgroundImage: `url(${item.poster})` }} aria-hidden="true" />}
        <img className={framed ? 'vs-fit' : 'vs-cover-natural'} src={item.poster} alt="" loading="lazy" />
        <span className="vs-grad" aria-hidden="true" />
        <span className="vs-play" aria-hidden="true"><PlayIcon /></span>
      </button>
      <AnimatePresence>
        {open && <VideoLightbox video={item} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
