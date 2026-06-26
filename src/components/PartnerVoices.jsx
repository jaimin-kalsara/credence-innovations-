import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion';
import { FadeUp } from './AnimatedSection';
import BrandLogo from './BrandLogo';

/* ============================================================
   PARTNER VOICES — animated testimonials (brand-adapted).

   Adapted from a shadcn "animated-testimonials" block into this
   project's stack (JSX + Tailwind v4 + framer-motion + brand tokens)
   — no shadcn/radix/lucide needed. Per the brief, each card shows ONLY
   the partner's outcome ("after") quote. Left rail carries the pitch +
   nav dots; the right card rotates with an energetic slide/scale, stars
   strike in, the result chip pops, and an auto-advance beat keeps it
   alive. Honest monogram avatars (the partners are anonymized execs),
   not stock faces. Reduced motion → static, dot-navigable.
   ============================================================ */

const EXPO = [0.16, 1, 0.3, 1];
const ROTATE_MS = 6000;

const TESTIMONIALS = [
  {
    id: 1,
    quote: "Our Credence reps outperformed our internal sales staff by the third month. Inside Walmart and Target, they don't feel outsourced — they feel like part of our team.",
    rating: 5, role: 'Director of Field Marketing', company: 'Fortune 50 Telecom', result: 'Pilot → 12-market rollout', initials: 'FT',
  },
  {
    id: 2,
    quote: "They put live reps in our highest-traffic Lowe's and Costco locations within six weeks. By quarter two we'd expanded into eight new markets.",
    rating: 5, role: 'VP, Growth', company: 'National Home-Services Brand', result: '1 region → 8 markets', initials: 'HS',
  },
  {
    id: 3,
    quote: "The Credence team doesn't just drive sign-ups — they protect the brand. Every rep sounds like they've worked for us for years.",
    rating: 5, role: 'Head of Customer Acquisition', company: 'National Energy Provider', result: 'Unknown → trusted', initials: 'EP',
  },
];
const TRUSTED = ['AT&T', 'Apple', 'LeafFilter', 'Just Energy'];

function Star({ delay, reduce }) {
  return (
    <motion.svg
      width="18" height="18" viewBox="0 0 24 24" fill="var(--ember)" stroke="var(--ember)" strokeWidth="1" strokeLinejoin="round"
      initial={reduce ? false : { scale: 0, rotate: -40, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: reduce ? 0 : delay, ease: EXPO }}
      style={{ transformOrigin: 'center' }}
    >
      <path d="M12 2.4l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 18.4 6.09 21.5l1.13-6.57L2.45 9.34l6.6-.96z" />
    </motion.svg>
  );
}

export default function PartnerVoices() {
  const reduce = useReducedMotion();
  const n = TESTIMONIALS.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });

  // auto-advance; `active` in deps means manual nav (arrows/dots) resets the beat
  useEffect(() => {
    if (reduce || paused || !inView) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), ROTATE_MS);
    return () => clearInterval(id);
  }, [reduce, paused, inView, n, active]);

  const prev = () => setActive((a) => (a - 1 + n) % n);
  const next = () => setActive((a) => (a + 1) % n);

  const t = TESTIMONIALS[active];

  return (
    <section ref={ref} className="pad-lg paper relative overflow-hidden" style={{ paddingBottom: 'clamp(44px, 5vw, 76px)' }} aria-label="Partner voices">
      <style>{`
        .material-symbols-rounded {
          font-family: 'Material Symbols Rounded'; font-weight: normal; font-style: normal;
          line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block;
          white-space: nowrap; word-wrap: normal; direction: ltr; font-size: 23px;
          -webkit-font-smoothing: antialiased; font-feature-settings: 'liga';
        }
        /* premium round nav buttons (prev / next) */
        .pv-nav-btn {
          width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; flex: none;
          color: var(--bone); cursor: none;
          background: color-mix(in srgb, var(--graphite) 55%, transparent);
          border: 1px solid var(--hair); box-shadow: 0 12px 28px -22px var(--shadow-card);
          transition: background .3s ease, color .3s ease, border-color .3s ease, transform .35s var(--ease-out-quart), box-shadow .35s ease;
        }
        .pv-nav-btn:hover { background: var(--electric); color: #0E1618; border-color: transparent;
          transform: translateY(-2px); box-shadow: 0 18px 36px -20px var(--glow-strong); }
        .pv-nav-btn:active { transform: translateY(0); }
        .pv-nav-btn:focus-visible { outline: 2px solid var(--electric); outline-offset: 3px; }
        @media (max-width: 480px) { .pv-nav-btn { width: 42px; height: 42px; } }
        @media (prefers-reduced-motion: reduce) { .pv-nav-btn { transition: background .2s ease, color .2s ease; } .pv-nav-btn:hover { transform: none; } }
      `}</style>
      {/* ambient energy */}
      <div aria-hidden="true" className="pointer-events-none absolute" style={{
        width: 'min(54vw, 680px)', height: 'min(54vw, 680px)', left: '-8%', top: '6%',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--electric) 16%, transparent), transparent 64%)', filter: 'blur(74px)',
      }} />
      <div aria-hidden="true" className="pointer-events-none absolute" style={{
        width: 'min(48vw, 600px)', height: 'min(48vw, 600px)', right: '-8%', bottom: '0%',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--ember) 14%, transparent), transparent 64%)', filter: 'blur(80px)',
      }} />

      <div className="shell relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── LEFT — pitch + nav ── */}
          <div>
            <FadeUp>
              <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6" style={{ background: 'var(--brand-soft)', border: '1px solid var(--hair)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--ember)" aria-hidden="true"><path d="M12 2.4l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 18.4 6.09 21.5l1.13-6.57L2.45 9.34l6.6-.96z" /></svg>
                <span className="font-mono" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ember)' }}>Partner voices</span>
              </span>
            </FadeUp>

            <FadeUp delay={0.05}>
              <h2 className="t-display-l" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', maxWidth: '14ch' }}>
                <span className="d-caps">What partners say after a year inside </span>
                <span className="d-ital" style={{ color: 'var(--electric)' }}>Fortune 500 retail.</span>
              </h2>
            </FadeUp>

            <FadeUp delay={0.1}>
              <p className="body-lg mt-6" style={{ color: 'var(--smoke)', maxWidth: '46ch' }}>
                Real outcomes from brands we put on the floor — in their words.
              </p>
            </FadeUp>

            {/* energetic proof + nav dots */}
            <FadeUp delay={0.16}>
              <div className="flex flex-wrap items-center gap-x-7 gap-y-5 mt-9">
                <div>
                  <span className="stat-num" style={{ fontSize: 'clamp(34px, 4vw, 50px)', lineHeight: 1, color: 'var(--electric)' }}>98%</span>
                  <p className="font-mono mt-1" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--smoke)' }}>partners come back</p>
                </div>
                <span aria-hidden="true" style={{ width: 1, height: 44, background: 'var(--hair)' }} />

                {/* prev · dots · next */}
                <div className="flex items-center gap-3.5">
                  <button type="button" className="pv-nav-btn" onClick={prev} data-cursor="expand" aria-label="Previous testimonial">
                    <span className="material-symbols-rounded" aria-hidden="true">arrow_back</span>
                  </button>
                  <div className="flex items-center gap-2.5" role="tablist" aria-label="Choose a testimonial">
                    {TESTIMONIALS.map((_, i) => (
                      <button
                        key={i}
                        role="tab"
                        aria-selected={active === i}
                        aria-label={`Testimonial ${i + 1}`}
                        data-cursor="expand"
                        onClick={() => setActive(i)}
                        className="rounded-full"
                        style={{ width: active === i ? 38 : 9, height: 9, cursor: 'none', background: active === i ? 'var(--electric)' : 'var(--hair)', transition: 'width 0.4s var(--ease-out-quart), background-color 0.4s ease' }}
                      />
                    ))}
                  </div>
                  <button type="button" className="pv-nav-btn" onClick={next} data-cursor="expand" aria-label="Next testimonial">
                    <span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
                  </button>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* ── RIGHT — rotating testimonial card ── */}
          <FadeUp delay={0.12}>
            <div
              className="relative"
              style={{ minHeight: 'clamp(360px, 46vh, 460px)' }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* decorative offset squares */}
              <div aria-hidden="true" className="absolute rounded-2xl" style={{ inset: '12% -4% -8% 8%', background: 'var(--brand-soft)', zIndex: 0 }} />

              <AnimatePresence mode="wait">
                <motion.figure
                  key={t.id}
                  className="paper-card relative h-full flex flex-col"
                  style={{ borderRadius: 22, padding: 'clamp(26px, 3vw, 44px)', zIndex: 1, margin: 0 }}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 64, scale: 0.95, rotate: 1 }}
                  animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -56, scale: 0.95, rotate: -1 }}
                  transition={{ duration: 0.55, ease: EXPO }}
                >
                  {/* stars */}
                  <div className="flex gap-1.5 mb-6">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} delay={0.15 + i * 0.07} reduce={reduce} />
                    ))}
                  </div>

                  {/* quote */}
                  <div className="relative flex-1">
                    <span aria-hidden="true" style={{ position: 'absolute', top: -22, left: -6, fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600, fontSize: 90, lineHeight: 1, color: 'var(--electric)', opacity: 0.16 }}>&ldquo;</span>
                    <blockquote className="relative" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', fontSize: 'clamp(19px, 1.9vw, 26px)', lineHeight: 1.34, margin: 0 }}>
                      {t.quote}
                    </blockquote>
                  </div>

                  {/* result chip */}
                  <span className="inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 mt-7" style={{ background: 'color-mix(in srgb, var(--ember) 14%, transparent)', border: '1px solid color-mix(in srgb, var(--ember) 35%, var(--hair))' }}>
                    <span className="rounded-full" style={{ width: 5, height: 5, background: 'var(--ember)' }} />
                    <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ember)' }}>{t.result}</span>
                  </span>

                  <span aria-hidden="true" style={{ height: 1, background: 'var(--hair)', margin: '22px 0' }} />

                  {/* attribution */}
                  <figcaption className="flex items-center gap-4">
                    <span className="grid place-items-center shrink-0 rounded-full" style={{ width: 50, height: 50, background: 'var(--brand-soft)', border: '1px solid var(--hair)', color: 'var(--electric)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17 }}>
                      {t.initials}
                    </span>
                    <div>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--bone)', fontSize: 16, lineHeight: 1.1 }}>{t.role}</p>
                      <p className="font-mono mt-1" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--smoke)' }}>{t.company}</p>
                    </div>
                  </figcaption>

                  {/* auto-advance beat */}
                  <div style={{ height: 2, background: 'var(--hair)', borderRadius: 2, overflow: 'hidden', marginTop: 22 }}>
                    {!reduce && !paused && inView && (
                      <motion.div key={active} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: ROTATE_MS / 1000, ease: 'linear' }} style={{ height: '100%', transformOrigin: 'left', background: 'linear-gradient(90deg, var(--electric), var(--ember))' }} />
                    )}
                  </div>
                </motion.figure>
              </AnimatePresence>
            </div>
          </FadeUp>
        </div>

        {/* ── trusted brands ── */}
        <FadeUp delay={0.1}>
          <div className="mt-14 md:mt-20 text-center">
            <p className="font-mono mb-7" style={{ fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--smoke)' }}>
              Brands we&apos;ve put on the floor
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
              {TRUSTED.map((c) => (
                <BrandLogo key={c} name={c} height={26} className="brand-plate--sm" />
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
