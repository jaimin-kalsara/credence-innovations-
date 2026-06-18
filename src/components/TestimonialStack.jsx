import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import SpotlightCard from './SpotlightCard';
import Scribble from './Scribble';
import { FadeUp } from './AnimatedSection';

/* Archetype F — testimonial stack over giant background type.
   A stroked Fraunces word ghosts behind a 3-up grid of before/after quote
   cards. The middle card drops down (md:mt-14) to break the baseline; each
   card gets a faint scroll-linked parallax (distinct ranges) so the stack
   drifts as you pass. Reduced motion -> everything renders at rest. */

const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] || '')
    .join('')
    .toUpperCase();

// distinct parallax travel per column so the trio never moves in lockstep
const PARALLAX = [
  [-18, 18],
  [22, -22],
  [-12, 12],
];

function QuoteCard({ card, index, reduce }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const range = PARALLAX[index % PARALLAX.length];
  const yRaw = useTransform(scrollYProgress, [0, 1], range);
  const y = reduce ? 0 : yRaw;

  const { before, after, months, name, company, tag } = card;

  return (
    <motion.div ref={ref} style={{ y }}>
      <FadeUp delay={index * 0.1}>
        <SpotlightCard as="div" className="paper-card" style={{ position: 'relative', padding: '2rem 1.75rem 1.6rem' }}>
          {/* rating mark, top-right */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 14,
              right: 16,
              width: 34,
              height: 34,
              pointerEvents: 'none',
            }}
          >
            <Scribble kind="star" color="var(--ember)" width={3} delay={index * 0.1 + 0.4} />
          </div>

          {/* oversized terracotta quote mark */}
          <span
            aria-hidden="true"
            className="d-ital"
            style={{
              display: 'block',
              fontSize: 'clamp(52px, 6vw, 76px)',
              lineHeight: 0.6,
              color: 'var(--ember)',
              marginBottom: '0.6rem',
              userSelect: 'none',
            }}
          >
            &ldquo;
          </span>

          {/* before */}
          <p
            className="eyebrow"
            style={{ marginBottom: '0.5rem' }}
          >
            Before Credence
          </p>
          <p className="body-sm" style={{ color: 'var(--smoke)' }}>
            {before}
          </p>

          {/* animated divider */}
          <motion.div
            initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transformOrigin: 'left center',
              height: 1,
              background: 'var(--hair)',
              margin: '1.15rem 0',
            }}
          />

          {/* after */}
          <p
            className="eyebrow"
            style={{ color: 'var(--electric)', marginBottom: '0.5rem' }}
          >
            After {months}
          </p>
          <p className="body" style={{ color: 'var(--bone)' }}>
            {after}
          </p>

          {/* footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--divider)',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                flex: '0 0 auto',
                width: 42,
                height: 42,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                background: 'var(--brand-soft)',
                color: 'var(--electric)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: '0.02em',
              }}
            >
              {initials(name)}
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 15,
                  color: 'var(--bone)',
                  lineHeight: 1.2,
                }}
              >
                {name}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--smoke)',
                  marginTop: 2,
                }}
              >
                {company}
              </p>
            </div>
            {tag && (
              <span
                style={{
                  flex: '0 0 auto',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--electric)',
                  background: 'var(--brand-soft)',
                  borderRadius: 999,
                  padding: '4px 11px',
                  whiteSpace: 'nowrap',
                }}
              >
                {tag}
              </span>
            )}
          </div>
        </SpotlightCard>
      </FadeUp>
    </motion.div>
  );
}

export default function TestimonialStack({
  bgWord = 'TRUSTED',
  cards = [],
  eyebrow,
  heading,
  className = '',
  ...rest
}) {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgX = useTransform(scrollYProgress, [0, 1], ['7%', '-7%']);

  return (
    <section ref={sectionRef} className={`pad-md relative overflow-hidden ${className}`} {...rest}>
      <div className="shell relative">
        {/* giant ghost word */}
        <motion.div
          aria-hidden="true"
          className="d-caps"
          style={{
            fontSize: 'clamp(120px, 24vw, 340px)',
            lineHeight: 0.8,
            color: 'transparent',
            WebkitTextStroke: '1px var(--hair)',
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            x: reduce ? 0 : bgX,
            willChange: 'transform',
          }}
        >
          {bgWord}
        </motion.div>

        {/* optional header */}
        {(eyebrow || heading) && (
          <FadeUp className="relative" style={{ marginBottom: '3rem', maxWidth: '46ch' }}>
            {eyebrow && (
              <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>
                {eyebrow}
              </p>
            )}
            {heading && <h2 className="t-display-m">{heading}</h2>}
          </FadeUp>
        )}

        {/* foreground grid — horizontal swipe carousel on phones */}
        <div className="row-scroll relative grid gap-6 md:grid-cols-3 md:gap-7">
          {cards.map((card, i) => (
            <div key={i} className={i === 1 ? 'md:mt-14' : ''}>
              <QuoteCard card={card} index={i} reduce={reduce} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
