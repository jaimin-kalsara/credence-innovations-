import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { FadeUp } from './AnimatedSection';

/* A single word that WIPES UP into view out of a mask as the heading enters,
   holds, then WIPES UP and away as the heading scrolls past the top — a full
   open→close lifecycle scrubbed to scroll (reverses on scroll-back).
   ranges = [inStart, inEnd, outStart, outEnd]. */
function ScrollWord({ word, progress, ranges }) {
  const y = useTransform(progress, ranges, ['115%', '0%', '0%', '-115%']);
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.12em', marginBottom: '-0.12em' }}>
      <motion.span style={{ display: 'inline-block', y, willChange: 'transform' }}>
        {word}
      </motion.span>
    </span>
  );
}

/* Scroll-driven word reveal over the heading's WHOLE journey through the
   viewport: words cascade UP in as it enters, hold through the middle, then
   cascade UP and out as it leaves. Falls back to plain text under reduced motion. */
function ScrollWords({ text, className = '', style = {} }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // Only the scroll-word effect needs a plain string; anything else renders as-is.
  if (reduce || typeof text !== 'string') {
    return <span ref={ref} className={className} style={style}>{text}</span>;
  }
  const words = text.split(' ');
  const n = words.length;

  return (
    <span ref={ref} className={className} style={style}>
      {words.map((w, i) => {
        const f = n > 1 ? i / (n - 1) : 0;
        const inS = 0.08 + f * 0.12;   // staggered wipe-IN (early third)
        const inE = inS + 0.16;
        const outS = 0.72 + f * 0.10;  // staggered wipe-OUT (final third)
        const outE = outS + 0.14;
        return (
          <span key={i} style={{ display: 'inline-block', marginRight: '0.26em' }}>
            <ScrollWord word={w} progress={scrollYProgress} ranges={[inS, inE, outS, outE]} />
          </span>
        );
      })}
    </span>
  );
}

/* Standard section header.
   - Mixed mode (pass `titleItalic`): upright-caps clause + italic-serif clause.
   - Default: italic-only.
   The headline uses the scroll-linked word reveal in both modes. */
export default function SectionHeading({
  eyebrow,
  title,
  titleItalic,
  subhead,
  align = 'left',
  maxWidth = 700,
  size = 'l',
}) {
  const center = align === 'center';
  const mixed = Boolean(titleItalic);
  const sizeClass = size === 'xl' ? 't-display-xl' : size === 'm' ? 't-display-m' : 't-display-l';

  return (
    <div className={`${center ? 'text-center mx-auto' : ''} mb-12 md:mb-16`} style={center ? { maxWidth } : {}}>
      {eyebrow && (
        <FadeUp>
          <span className="eyebrow block mb-5">{eyebrow}</span>
        </FadeUp>
      )}

      {title && mixed && (
        <h2 className={sizeClass} style={{ color: 'var(--bone)' }}>
          <ScrollWords text={title} className="d-caps" />{' '}
          <ScrollWords text={titleItalic} className="d-ital" style={{ color: 'var(--electric)' }} />
        </h2>
      )}

      {title && !mixed && (
        <h2 className="leading-[1.05]"
          style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(32px, 5vw, 64px)', color: 'var(--bone)' }}>
          <ScrollWords text={title} />
        </h2>
      )}

      {subhead && (
        <FadeUp delay={0.15}>
          <p className={`mt-6 text-lg leading-relaxed ${center ? 'mx-auto' : ''}`}
            style={{ color: 'var(--smoke)', maxWidth: center ? maxWidth : 640 }}>
            {subhead}
          </p>
        </FadeUp>
      )}
    </div>
  );
}
