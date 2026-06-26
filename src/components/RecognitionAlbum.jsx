import { useRef, useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';
import { FadeUp } from './AnimatedSection';
import { RECOGNITION } from '../data/media';

/* RecognitionAlbum — a compact, two-column awards & recognition album:
   the photo album sits on the LEFT (one card at a time, full photo uncropped
   over a soft blurred fill), a short bit of context + the controls on the
   RIGHT. Navigate with the arrows, dots, native swipe, or ← / → when focused.
   Pure CSS scroll-snap drives the motion; React only reflects the active index.
   Both columns rise in with the house FadeUp (premium, no pop). */

const SLIDES = RECOGNITION;

function Chevron({ dir }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === 'left' ? 'M15 5 L8 12 L15 19' : 'M9 5 L16 12 L9 19'} />
    </svg>
  );
}

export default function RecognitionAlbum() {
  const reduce = useReducedMotion();
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  // autoplay: pause on hover/focus; a synced progress bar drives the advance so
  // the timing and the indicator can never drift apart, and both pause in place.
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const dirRef = useRef(1);
  const paused = hovered || focused;

  const update = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    const slides = t.querySelectorAll('.ra-slide');
    if (!slides.length) return;
    const center = t.scrollLeft + t.clientWidth / 2;
    let best = 0, bestD = Infinity;
    slides.forEach((s, i) => {
      const c = s.offsetLeft + s.offsetWidth / 2;
      const d = Math.abs(c - center);
      if (d < bestD) { bestD = d; best = i; }
    });
    setActive(best);
    setAtStart(t.scrollLeft <= 2);
    setAtEnd(t.scrollLeft + t.clientWidth >= t.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    update();
    t.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { t.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [update]);

  const scrollToIndex = useCallback((i) => {
    const t = trackRef.current;
    if (!t) return;
    const slides = t.querySelectorAll('.ra-slide');
    const target = slides[Math.max(0, Math.min(slides.length - 1, i))];
    if (!target) return;
    t.scrollTo({ left: target.offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
  }, [reduce]);

  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollToIndex(active + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); scrollToIndex(active - 1); }
  };

  // auto-advance one slide, bouncing at the ends so it loops forever via short,
  // adjacent transitions (no long rewind). Fired when the progress bar completes.
  // The timestamp guard collapses any duplicate animationend (e.g. StrictMode)
  // into a single step, so it never skips a slide.
  const lastAdvanceRef = useRef(0);
  const advanceFrom = useCallback((i) => {
    const now = performance.now();
    if (now - lastAdvanceRef.current < 1500) return;
    lastAdvanceRef.current = now;
    let next = i + dirRef.current;
    if (next > SLIDES.length - 1) { dirRef.current = -1; next = i - 1; }
    else if (next < 0) { dirRef.current = 1; next = i + 1; }
    scrollToIndex(next);
  }, [scrollToIndex]);

  return (
    <section data-theme="dark" className="paper relative overflow-hidden pad-md" style={{ background: 'var(--ink)' }}>
      <style>{`
        .ra-stage { position: relative; width: 100%; }
        .ra-track {
          display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth;
          border-radius: 20px; scrollbar-width: none; -ms-overflow-style: none;
        }
        .ra-track::-webkit-scrollbar { display: none; }
        .ra-slide {
          flex: 0 0 100%; scroll-snap-align: center; position: relative;
          aspect-ratio: 3 / 2; border-radius: 20px; overflow: hidden;
          border: 1px solid var(--hair); background: var(--graphite);
        }
        .ra-bg { position: absolute; inset: 0; background-size: cover; background-position: center;
          transform: scale(1.18); filter: blur(28px) brightness(0.5) saturate(1.15); }
        .ra-bg::after { content: ''; position: absolute; inset: 0; background: rgba(10,14,15,0.32); }
        .ra-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; z-index: 1; }
        .ra-num {
          position: absolute; top: 14px; left: 14px; z-index: 2;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.18em;
          text-transform: uppercase; color: #F4F1EA; padding: 5px 10px; border-radius: 999px;
          background: rgba(10,14,15,0.5); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
        }
        .ra-arrow {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 4;
          width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center;
          cursor: pointer; color: var(--bone);
          background: color-mix(in srgb, var(--ink) 68%, transparent);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          border: 1px solid var(--hair);
          transition: background 0.3s, color 0.3s, transform 0.3s, opacity 0.3s;
        }
        .ra-arrow:hover:not(:disabled) { background: var(--electric); color: #0E1618; transform: translateY(-50%) scale(1.07); }
        .ra-arrow:disabled { opacity: 0.3; cursor: default; }
        .ra-arrow:focus-visible { outline: 2px solid var(--electric); outline-offset: 3px; }
        .ra-prev { left: 12px; }
        .ra-next { right: 12px; }
        .ra-controls { display: flex; align-items: center; gap: 22px; margin-top: clamp(24px, 3vw, 34px); }
        .ra-count { font-family: 'JetBrains Mono', monospace; font-size: 13px; letter-spacing: 0.14em; color: var(--bone); }
        .ra-count-sep { color: var(--smoke); margin: 0 4px; }
        .ra-dots { display: flex; gap: 9px; }
        .ra-dot { width: 9px; height: 9px; border-radius: 50%; padding: 0; cursor: pointer; border: none;
          background: var(--hair); transition: background 0.3s, width 0.3s, border-radius 0.3s; }
        .ra-dot.is-on { background: var(--electric); width: 26px; border-radius: 5px; }
        .ra-dot:focus-visible { outline: 2px solid var(--electric); outline-offset: 2px; }
        /* autoplay progress — the subtle "loading" line that times each slide */
        .ra-progress { height: 2px; width: 100%; max-width: 240px; margin-top: clamp(18px, 2vw, 24px);
          border-radius: 2px; background: var(--hair); overflow: hidden; }
        .ra-progress-fill { display: block; height: 100%; width: 100%; transform: scaleX(0); transform-origin: left;
          background: var(--electric); animation: ra-fill 4.5s linear forwards; }
        @keyframes ra-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) {
          .ra-track { scroll-behavior: auto; }
          .ra-arrow, .ra-dot { transition: none; }
        }
        @media (max-width: 640px) {
          .ra-slide { aspect-ratio: 4 / 5; }
          .ra-arrow { width: 40px; height: 40px; }
        }
      `}</style>

      {/* ambient depth */}
      <div aria-hidden="true" className="pointer-events-none absolute" style={{
        width: 'min(54vw, 620px)', height: 'min(54vw, 620px)', right: '-6%', top: '4%',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--ember) 13%, transparent), transparent 64%)', filter: 'blur(80px)',
      }} />

      <div className="shell relative" style={{ zIndex: 2 }}>
        <div className="grid lg:grid-cols-[1.12fr_0.88fr] gap-10 lg:gap-16 items-center">

          {/* LEFT — the album */}
          <FadeUp>
            <div
              className="ra-stage"
              role="region"
              aria-roledescription="carousel"
              aria-label="Awards and recognition photo album"
              tabIndex={0}
              onKeyDown={onKey}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            >
              <button className="ra-arrow ra-prev" onClick={() => scrollToIndex(active - 1)} disabled={atStart} aria-label="Previous photo">
                <Chevron dir="left" />
              </button>
              <div className="ra-track" ref={trackRef}>
                {SLIDES.map((src, i) => (
                  <figure className="ra-slide" key={src + i} data-cursor="expand"
                    aria-roledescription="slide" aria-label={`Recognition photo ${i + 1} of ${SLIDES.length}`}>
                    <div className="ra-bg" style={{ backgroundImage: `url(${src})` }} aria-hidden="true" />
                    <img className="ra-photo" src={src} alt={`Credence Innovations award & recognition — photo ${i + 1}`} draggable="false" />
                    <span className="ra-num">{String(i + 1).padStart(2, '0')} · Recognition</span>
                  </figure>
                ))}
              </div>
              <button className="ra-arrow ra-next" onClick={() => scrollToIndex(active + 1)} disabled={atEnd} aria-label="Next photo">
                <Chevron dir="right" />
              </button>
            </div>
          </FadeUp>

          {/* RIGHT — short context + controls */}
          <FadeUp delay={0.1}>
            <div>
              <span className="eyebrow block mb-5">Recognition</span>
              <h2 className="t-display-m" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', lineHeight: 1.05 }}>
                The wins worth <span className="d-ital" style={{ color: 'var(--electric)' }}>framing.</span>
              </h2>
              <p className="body mt-5" style={{ color: 'var(--smoke)', maxWidth: '34ch' }}>
                Awards, stages, and the nights that earned them.
              </p>

              <div className="ra-controls">
                <span className="ra-count" aria-live="polite">
                  {String(active + 1).padStart(2, '0')}<span className="ra-count-sep">/</span>{String(SLIDES.length).padStart(2, '0')}
                </span>
                <div className="ra-dots" role="tablist" aria-label="Choose a photo">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      className={`ra-dot ${i === active ? 'is-on' : ''}`}
                      aria-label={`Go to photo ${i + 1}`}
                      aria-current={i === active}
                      onClick={() => scrollToIndex(i)}
                    />
                  ))}
                </div>
              </div>

              {/* autoplay progress — paused on hover/focus; completing it advances the slide */}
              {!reduce && (
                <div className="ra-progress" aria-hidden="true">
                  <span
                    key={active}
                    className="ra-progress-fill"
                    style={{ animationPlayState: paused ? 'paused' : 'running' }}
                    onAnimationEnd={() => advanceFrom(active)}
                  />
                </div>
              )}
            </div>
          </FadeUp>

        </div>
      </div>
    </section>
  );
}
