import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  motion, AnimatePresence, useReducedMotion,
  useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, useInView,
} from 'framer-motion';
import { VIDEOS_READY } from '../data/media';

/* ============================================================================
   CareerInterviews — "In their words" (Careers)

   An editorial interview reel: one large featured frame (cursor-tilt, glare,
   crossfade) paired with a text-led playlist — hovering a track previews it as
   the feature, clicking opens the full clip with sound. Posters stay static
   (the source clips are heavy), so nothing loads until you click play — the
   premium feel comes from the composition, not autoplay. Un-boxy, theme-
   adaptive, scroll-triggered. No GSAP.
============================================================================ */

const EXPO = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 130, damping: 21, mass: 1 };

function PlayGlyph({ s = 20 }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5 L19 12 L8 18.5 Z" /></svg>;
}

function Lightbox({ video, onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [onClose]);
  return createPortal(
    <motion.div className="ci-lb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div className="ci-lb-box" initial={{ opacity: 0, y: 16, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3, ease: EXPO }}>
        <button className="ci-lb-close" onClick={onClose} aria-label="Close video"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
        {VIDEOS_READY
          ? <video className="ci-lb-video" src={video.src} poster={video.poster} controls autoPlay playsInline preload="auto" />
          : <img className="ci-lb-video" src={video.poster} alt={video.title || 'Video'} />}
        {(video.title || video.blurb) && <div className="ci-lb-meta">{video.title && <h3>{video.title}</h3>}{video.blurb && <p>{video.blurb}{!VIDEOS_READY ? ' · Full video coming soon.' : ''}</p>}</div>}
      </motion.div>
    </motion.div>,
    document.body,
  );
}

export default function CareerInterviews({ items = [] }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const inView = useInView(sectionRef, { margin: '-10% 0px -10% 0px' });
  const [entered, setEntered] = useState(false);
  useEffect(() => { if (inView) setEntered(true); }, [inView]);
  useEffect(() => {
    const id = setTimeout(() => { const el = sectionRef.current; if (!el) return; const r = el.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) setEntered(true); }, 800);
    return () => clearTimeout(id);
  }, []);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-4%', '4%']);
  const featY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [36, -36]);
  const markY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['10%', '-10%']);

  // cursor tilt + glare on the feature
  const mx = useMotionValue(0.5); const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [5, -5]), SPRING);
  const ry = useSpring(useTransform(mx, [0, 1], [-5, 5]), SPRING);
  const gx = useTransform(mx, (v) => `${(v * 100).toFixed(1)}%`);
  const gy = useTransform(my, (v) => `${(v * 100).toFixed(1)}%`);
  const glare = useMotionTemplate`radial-gradient(360px circle at ${gx} ${gy}, rgba(255,255,255,0.18), transparent 56%)`;
  const onMove = (e) => { if (reduce) return; const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height); };
  const onLeave = () => { mx.set(0.5); my.set(0.5); };

  if (!items.length) return null;
  const cur = items[active];
  const lineV = reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : { hidden: { y: '120%' }, show: { y: '0%' } };

  return (
    <section ref={sectionRef} className="ci-section paper relative overflow-hidden pad-lg" aria-label="In their words">
      <style>{`
        .ci-section { isolation: isolate;
          background:
            radial-gradient(56% 42% at 84% 8%, color-mix(in srgb, var(--electric) 9%, transparent), transparent 60%),
            radial-gradient(52% 40% at 6% 92%, color-mix(in srgb, var(--ember) 7%, transparent), transparent 62%),
            var(--ink); }
        .ci-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .ci-orb { position: absolute; border-radius: 50%; filter: blur(94px); }
        .ci-orb-1 { width: 34vw; max-width: 500px; aspect-ratio: 1; left: -8%; top: -4%; background: radial-gradient(circle, color-mix(in srgb, var(--electric) 14%, transparent), transparent 64%); }
        .ci-orb-2 { width: 30vw; max-width: 440px; aspect-ratio: 1; right: -8%; bottom: -8%; background: radial-gradient(circle, color-mix(in srgb, var(--ember) 11%, transparent), transparent 64%); }
        .ci-grain { position: absolute; inset: 0; opacity: 0.035; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 140px 140px; }
        .ci-mark { position: absolute; z-index: 0; right: 1%; top: 12%; font-family: var(--font-display); font-weight: 600; font-style: italic;
          font-size: clamp(180px, 26vw, 400px); line-height: 0.6; color: transparent; -webkit-text-stroke: 1.4px color-mix(in srgb, var(--bone) 11%, transparent); pointer-events: none; user-select: none; }

        .ci-inner { position: relative; z-index: 2; }

        /* header */
        .ci-pill { display: inline-flex; align-items: center; gap: 9px; padding: 7px 15px; border-radius: 999px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--bone);
          background: color-mix(in srgb, var(--graphite) 52%, transparent); border: 1px solid color-mix(in srgb, var(--electric) 26%, var(--hair)); }
        .ci-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--electric); box-shadow: 0 0 10px var(--electric); }
        .ci-title { font-family: var(--font-display); color: var(--bone); line-height: 1.0; letter-spacing: -0.02em; font-size: clamp(32px, 4.4vw, 60px); margin-top: clamp(14px, 1.6vw, 20px); max-width: 16ch; }
        .ci-title .ln { display: block; overflow: hidden; padding-bottom: 0.06em; }
        .ci-title .ln > span { display: inline-block; will-change: transform; }
        .ci-hi { font-style: italic; font-weight: 500; background: linear-gradient(100deg, var(--electric), #6FB6D9 55%, var(--electric)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: var(--electric); }
        .ci-sub { color: var(--smoke); font-size: clamp(15px, 1.1vw, 17px); line-height: 1.6; max-width: 52ch; margin-top: clamp(14px, 1.4vw, 18px); }

        /* stage */
        .ci-stage { display: grid; grid-template-columns: 1fr; gap: clamp(32px, 4vw, 56px); margin-top: clamp(36px, 4.4vw, 60px); align-items: center; }
        @media (min-width: 920px) { .ci-stage { grid-template-columns: minmax(0, 1.06fr) minmax(0, 0.94fr); column-gap: clamp(40px, 4.5vw, 72px); } }

        /* feature frame — soft, no hard border */
        .ci-feat { position: relative; perspective: 1100px; }
        .ci-aura { position: absolute; inset: -10%; z-index: 0; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--electric) 18%, transparent), transparent 62%); filter: blur(46px); }
        .ci-frame { position: relative; z-index: 2; width: min(440px, 100%); margin-inline: auto; aspect-ratio: 4 / 5; border-radius: clamp(22px, 2vw, 30px); overflow: hidden;
          background: var(--graphite); cursor: pointer; transform-style: preserve-3d; -webkit-tap-highlight-color: transparent;
          box-shadow: 0 54px 116px -54px var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.07); }
        .ci-frame:focus-visible { outline: 2px solid var(--electric); outline-offset: 4px; }
        .ci-poster { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
        .ci-scrim { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(to top, rgba(6,9,12,0.8) 2%, rgba(6,9,12,0.18) 38%, transparent 62%); }
        .ci-ring { position: absolute; inset: 0; z-index: 4; border-radius: inherit; padding: 1px; pointer-events: none; opacity: 0.5; transition: opacity .5s ease;
          background: linear-gradient(150deg, rgba(255,255,255,0.5), transparent 40%, color-mix(in srgb, var(--electric) 55%, transparent));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
        .ci-frame:hover .ci-ring { opacity: 0.95; }
        .ci-glare { position: absolute; inset: 0; z-index: 4; pointer-events: none; opacity: 0; transition: opacity .4s ease; mix-blend-mode: soft-light; }
        .ci-frame:hover .ci-glare { opacity: 1; }
        .ci-play { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 5; display: grid; place-items: center;
          width: clamp(58px, 5vw, 72px); aspect-ratio: 1; border-radius: 50%; color: #0e1618; background: rgba(243,238,226,0.95); box-shadow: 0 16px 40px -16px rgba(0,0,0,0.6);
          transition: transform .4s var(--ease-out-expo); }
        .ci-play svg { margin-left: 2px; }
        .ci-play::after { content: ''; position: absolute; inset: -8px; border-radius: 50%; border: 1px solid rgba(243,238,226,0.5); animation: ci-pulse 2.6s var(--ease-out-quart) infinite; }
        @keyframes ci-pulse { 0% { transform: scale(0.8); opacity: 0.6; } 70%,100% { transform: scale(1.4); opacity: 0; } }
        .ci-frame:hover .ci-play { transform: translate(-50%,-50%) scale(1.08); }
        .ci-tag { position: absolute; top: 14px; left: 14px; z-index: 5; display: inline-flex; align-items: center; gap: 7px; padding: 6px 11px; border-radius: 999px;
          font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: #F3EEE2;
          background: rgba(10,14,15,0.5); border: 1px solid rgba(255,255,255,0.14); backdrop-filter: blur(8px); }
        .ci-tag .rec { width: 6px; height: 6px; border-radius: 50%; background: #E8923C; box-shadow: 0 0 8px #E8923C; }
        .ci-cap { position: absolute; left: 0; right: 0; bottom: 0; z-index: 5; padding: clamp(16px, 1.8vw, 24px); }
        .ci-cap-n { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase; color: #8FC1D8; }
        .ci-cap-t { font-family: var(--font-display); font-weight: 600; color: #F6F2E8; font-size: clamp(20px, 1.8vw, 26px); line-height: 1.1; margin-top: 5px; }
        .ci-cap-b { color: rgba(243,238,226,0.8); font-size: 13px; line-height: 1.5; margin-top: 6px; max-width: 32ch; }

        /* playlist */
        .ci-list { position: relative; }
        .ci-list-h { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--smoke); margin-bottom: clamp(8px, 1vw, 14px); display: flex; align-items: center; gap: 10px; }
        .ci-list-h::after { content: ''; flex: 1; height: 1px; background: var(--hair); }
        .ci-row { position: relative; display: flex; align-items: center; gap: clamp(14px, 1.6vw, 20px); width: 100%; text-align: left; padding: clamp(15px, 1.7vw, 20px) 6px clamp(15px, 1.7vw, 20px) 18px;
          border-top: 1px solid var(--hair); cursor: pointer; -webkit-tap-highlight-color: transparent; transition: padding-left .4s var(--ease-out-expo); }
        .ci-row:last-child { border-bottom: 1px solid var(--hair); }
        .ci-row .ci-bar { position: absolute; left: 0; top: 12px; bottom: 12px; width: 3px; border-radius: 3px; background: linear-gradient(var(--electric), var(--ember)); }
        .ci-row-n { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.12em; color: var(--smoke); flex: none; transition: color .35s ease; }
        .ci-row[data-on="true"] .ci-row-n { color: var(--ember); }
        .ci-thumb { position: relative; width: clamp(58px, 6vw, 74px); aspect-ratio: 1; border-radius: 12px; overflow: hidden; flex: none; filter: saturate(0.96); transition: filter .4s ease, transform .5s var(--ease-out-expo); }
        .ci-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ci-thumb .mini { position: absolute; inset: 0; display: grid; place-items: center; color: #fff; opacity: 0; transition: opacity .4s ease; background: rgba(8,12,14,0.32); }
        .ci-row:hover .ci-thumb, .ci-row[data-on="true"] .ci-thumb { filter: saturate(1.05); transform: scale(1.03); }
        .ci-row:hover .ci-thumb .mini, .ci-row[data-on="true"] .ci-thumb .mini { opacity: 1; }
        .ci-row-tx { min-width: 0; flex: 1; }
        .ci-row-t { font-family: var(--font-display); font-weight: 600; color: var(--bone); font-size: clamp(18px, 1.6vw, 23px); line-height: 1.12; letter-spacing: -0.01em; opacity: 0.62; transition: color .35s ease, opacity .35s ease; }
        .ci-row[data-on="true"] .ci-row-t { color: var(--electric); opacity: 1; }
        .ci-row:hover .ci-row-t { opacity: 0.92; }
        .ci-row-b { color: var(--smoke); font-size: 13px; line-height: 1.45; margin-top: 4px; }
        .ci-row-go { flex: none; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; color: var(--smoke); border: 1px solid var(--hair); transition: all .4s var(--ease-out-expo); }
        .ci-row[data-on="true"] .ci-row-go, .ci-row:hover .ci-row-go { color: var(--ink); background: var(--bone); border-color: var(--bone); transform: translateX(2px); }

        /* lightbox */
        .ci-lb { position: fixed; inset: 0; z-index: 90; display: grid; place-items: center; padding: clamp(16px, 4vw, 48px); background: rgba(6,10,12,0.86); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
        .ci-lb-box { position: relative; width: min(92vw, 1000px); }
        .ci-lb-video { display: block; width: 100%; height: auto; max-height: 82vh; border-radius: 14px; box-shadow: 0 60px 130px -40px rgba(0,0,0,0.9); background: #000; }
        .ci-lb-close { position: absolute; top: -16px; right: -16px; width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; background: var(--bone); color: var(--ink); border: none; cursor: pointer; transition: transform .3s; z-index: 2; }
        .ci-lb-close:hover { transform: rotate(90deg); }
        .ci-lb-meta { margin-top: 16px; text-align: center; }
        .ci-lb-meta h3 { font-family: var(--font-display); color: var(--bone); font-size: clamp(18px, 2vw, 24px); }
        .ci-lb-meta p { color: var(--smoke); font-size: 14px; margin-top: 4px; }

        @media (prefers-reduced-motion: reduce) { .ci-play::after { animation: none; } }
      `}</style>

      <motion.div className="ci-bg" aria-hidden="true" style={{ y: bgY }}>
        <span className="ci-orb ci-orb-1" />
        <span className="ci-orb ci-orb-2" />
        <span className="ci-grain" />
      </motion.div>
      <motion.span className="ci-mark" aria-hidden="true" style={{ y: markY }}>&rdquo;</motion.span>

      <div className="shell ci-inner">
        {/* header */}
        <div ref={headRef}>
          <motion.span className="ci-pill"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }} animate={entered ?{ opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EXPO }}>
            <span className="dot" aria-hidden="true" />In their words
          </motion.span>
          <h2 className="ci-title">
            <span className="ln"><motion.span initial="hidden" animate={entered ?'show' : 'hidden'} variants={lineV} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.1 }}>What the work</motion.span></span>
            <span className="ln"><motion.span className="ci-hi" initial="hidden" animate={entered ?'show' : 'hidden'} variants={lineV} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.18 }}>actually looks like.</motion.span></span>
          </h2>
          <motion.p className="ci-sub"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(4px)' }} animate={entered ?{ opacity: 1, y: 0, filter: 'blur(0px)' } : {}} transition={{ duration: 0.7, delay: 0.3, ease: EXPO }}>
            No script — just the team on what they do, why it matters, and what they got out of it. Hover a clip to preview, click to watch.
          </motion.p>
        </div>

        {/* stage */}
        <div className="ci-stage">
          {/* feature */}
          <motion.div className="ci-feat" style={reduce ? undefined : { y: featY }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
            animate={entered ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}} transition={{ duration: 0.8, ease: EXPO }}>
            <span className="ci-aura" aria-hidden="true" />
            <motion.div className="ci-frame" data-cursor="expand" role="button" tabIndex={0}
              onMouseMove={onMove} onMouseLeave={onLeave} onClick={() => setLightbox(cur)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLightbox(cur); } }}
              aria-label={`Play video — ${cur.title}`}
              style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 1000 }}>
              <AnimatePresence initial={false}>
                <motion.img key={active} className="ci-poster" src={cur.poster} alt={cur.title}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EXPO }} />
              </AnimatePresence>
              <span className="ci-scrim" aria-hidden="true" />
              {!reduce && <motion.span className="ci-glare" style={{ background: glare }} aria-hidden="true" />}
              <span className="ci-ring" aria-hidden="true" />
              <span className="ci-tag"><span className="rec" aria-hidden="true" />In their words</span>
              <span className="ci-play" aria-hidden="true"><PlayGlyph s={22} /></span>
              <AnimatePresence initial={false}>
                <motion.div className="ci-cap" key={active} initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: EXPO }}>
                  <div className="ci-cap-n">{String(active + 1).padStart(2, '0')} · Credence team</div>
                  <div className="ci-cap-t">{cur.title}</div>
                  {cur.blurb && <div className="ci-cap-b">{cur.blurb}</div>}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* playlist */}
          <div className="ci-list">
            <div className="ci-list-h">The clips · {String(items.length).padStart(2, '0')}</div>
            {items.map((it, i) => (
              <motion.button key={i} type="button" className="ci-row" data-on={active === i} data-cursor="expand"
                onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => { setActive(i); setLightbox(it); }}
                aria-label={`${it.title} — ${it.blurb || 'play'}`}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }} animate={entered ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: EXPO }}>
                {active === i && <motion.span layoutId="ci-active-bar" className="ci-bar" aria-hidden="true" transition={SPRING} />}
                <span className="ci-row-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="ci-thumb"><img src={it.poster} alt="" loading="lazy" /><span className="mini" aria-hidden="true"><PlayGlyph s={16} /></span></span>
                <span className="ci-row-tx">
                  <span className="ci-row-t">{it.title}</span>
                  {it.blurb && <span className="ci-row-b">{it.blurb}</span>}
                </span>
                <span className="ci-row-go" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightbox && <Lightbox video={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </section>
  );
}
