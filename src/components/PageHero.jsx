import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { FadeUp, SplitText } from './AnimatedSection';

/* Interior-page hero. Warm-editorial register: upright-caps Fraunces title +
   italic-serif accent line. Supports several distinct opening layouts so no two
   pages start the same way:
     • default            — text only
     • align="center"     — centered manifesto (no imagery)
     • media + mediaSide  — split: copy on one side, photo(s) on the other
     • backdrop           — full-bleed photo behind the copy, with a legibility scrim
   Background is static (one-shot light sweep on mount); scroll parallax retained;
   reduced-motion safe. */
export default function PageHero({
  eyebrow,
  title,
  italic,
  subhead,
  children,
  badge,                 // optional ReactNode (e.g. <StampBadge/>)
  media,                 // optional ReactNode -> split layout
  mediaSide = 'right',   // 'right' | 'left'
  backdrop,              // optional src string -> full-bleed photo behind the copy
  align = 'left',        // 'left' | 'center'
  minH = '74vh',
  tint = 'teal',         // 'teal' | 'amber'
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const washA = tint === 'amber'
    ? 'radial-gradient(circle, color-mix(in srgb, var(--ember) 22%, transparent), transparent 62%)'
    : 'radial-gradient(circle, color-mix(in srgb, var(--electric) 26%, transparent), transparent 62%)';
  const washB = 'radial-gradient(circle, color-mix(in srgb, var(--ember) 14%, transparent), transparent 62%)';

  const center = align === 'center';
  const split = !!media && !backdrop;
  const leftMedia = mediaSide === 'left';

  const textCol = (
    <div className={center ? 'mx-auto text-center' : ''} style={center ? { maxWidth: 860 } : undefined}>
      {badge && <div className={`mb-6 ${center ? 'flex justify-center' : ''}`}>{badge}</div>}
      {eyebrow && (
        <FadeUp>
          <span className="eyebrow block mb-6">{eyebrow}</span>
        </FadeUp>
      )}
      <h1 className="t-display-xl mb-8" style={{ color: 'var(--bone)', fontSize: 'clamp(26px, 3.4vw, 50px)' }}>
        <SplitText text={title} className="d-caps" />
        {italic && (
          <>
            <br />
            <SplitText text={italic} className="d-ital" style={{ color: 'var(--electric)' }} delay={0.25} />
          </>
        )}
      </h1>
      {subhead && (
        <FadeUp delay={0.6}>
          <p className="body-lg measure" style={{ maxWidth: 640, marginInline: center ? 'auto' : undefined }}>{subhead}</p>
        </FadeUp>
      )}
      {children && (
        <FadeUp delay={0.8}>
          <div className={`mt-10 ${center ? 'flex justify-center' : ''}`}>{children}</div>
        </FadeUp>
      )}
    </div>
  );

  return (
    <section ref={ref} className="relative flex items-end overflow-hidden paper" style={{ minHeight: minH }}>
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <div className="absolute inset-0" style={{ background: 'var(--ink)' }} />

        {backdrop ? (
          /* full-bleed photo + legibility scrim (works for left or centered copy) */
          <>
            <img src={backdrop} alt="" aria-hidden="true" loading="eager"
              className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.5, objectPosition: 'center 32%' }} />
            <div className="absolute inset-0" style={{ background: 'color-mix(in srgb, var(--ink) 48%, transparent)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--ink) 35%, transparent) 0%, transparent 32%, var(--ink) 100%)' }} />
          </>
        ) : (
          /* STATIC ambient washes (no animation loop) */
          <>
            <div aria-hidden className="absolute rounded-full pointer-events-none"
              style={{ width: '55%', height: '70%', left: '4%', top: '6%', background: washA, filter: 'blur(46px)' }} />
            <div aria-hidden className="absolute rounded-full pointer-events-none"
              style={{ width: '45%', height: '55%', right: '6%', top: '6%', background: washB, filter: 'blur(52px)' }} />
          </>
        )}

        {/* one-shot diagonal light sweep on mount */}
        {!reduce && (
          <motion.div aria-hidden className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(105deg, transparent 35%, color-mix(in srgb, var(--electric) 12%, transparent) 50%, transparent 65%)' }}
            initial={{ x: '-60%' }} animate={{ x: '120%' }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} />
        )}
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, transparent 50%, var(--ink) 100%)' }} />
      </motion.div>

      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full pb-16 md:pb-24 pt-32 md:pt-40"
      >
        {split ? (
          <div className={`grid ${leftMedia ? 'lg:grid-cols-[0.82fr_1.18fr]' : 'lg:grid-cols-[1.18fr_0.82fr]'} gap-8 lg:gap-12 items-center`}>
            <div className={leftMedia ? 'lg:order-2' : ''}>{textCol}</div>
            <div className={`w-full ${leftMedia ? 'lg:order-1' : ''}`}>{media}</div>
          </div>
        ) : textCol}
      </motion.div>
    </section>
  );
}
