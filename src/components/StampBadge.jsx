import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/* Rubber-stamp credential badge. Inked, slightly rotated, faint ink-bleed.
   Outer ring strokes-on via pathLength once in view; center word fades + scales
   in; everything then sits fully static. No loops. */
export default function StampBadge({
  topText = '',
  bottomText = '',
  center = '',
  color = 'var(--ember)',
  rotate = -8,
  size = 110,
  className = '',
  style,
  ...rest
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();

  // Unique ids so multiple stamps on one page don't collide their textPaths.
  const uid = useRef(`stamp-${Math.random().toString(36).slice(2, 9)}`).current;
  const topArc = `${uid}-top`;
  const bottomArc = `${uid}-bottom`;

  const ariaLabel = [topText, center, bottomText].filter(Boolean).join(' ') || 'badge';

  const ringTransition = reduce
    ? { duration: 0 }
    : { pathLength: { duration: 1.05, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.25 } };

  const centerTransition = reduce
    ? { duration: 0 }
    : { duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] };

  const arcText = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 8,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    fill: color,
  };

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 110 110"
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={{
        transform: `rotate(${rotate}deg)`,
        opacity: 0.9,
        overflow: 'visible',
        ...style,
      }}
      {...rest}
    >
      <defs>
        {/* Top arc: sweeps across the upper ring, text reads left-to-right. */}
        <path
          id={topArc}
          fill="none"
          d="M 16,55 A 39,39 0 0 1 94,55"
        />
        {/* Bottom arc reversed (sweep flag 0) so the lower text reads upright. */}
        <path
          id={bottomArc}
          fill="none"
          d="M 18,55 A 37,37 0 0 0 92,55"
        />
      </defs>

      {/* Outer ring — strokes on in view. */}
      <motion.circle
        cx="55"
        cy="55"
        r="50"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={ringTransition}
      />

      {/* Inner ring — static companion. */}
      <motion.circle
        cx="55"
        cy="55"
        r="45"
        fill="none"
        stroke={color}
        strokeWidth="1"
        initial={reduce ? false : { opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.3, delay: 0.35 }}
      />

      {topText && (
        <text style={arcText}>
          <textPath href={`#${topArc}`} startOffset="50%" textAnchor="middle">
            {topText}
          </textPath>
        </text>
      )}

      {bottomText && (
        <text style={arcText}>
          <textPath href={`#${bottomArc}`} startOffset="50%" textAnchor="middle">
            {bottomText}
          </textPath>
        </text>
      )}

      {center && (
        <motion.text
          x="55"
          y="55"
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            fontStyle: 'italic',
            fill: color,
            transformBox: 'fill-box',
            transformOrigin: 'center',
          }}
          initial={reduce ? false : { opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
          transition={centerTransition}
        >
          {center}
        </motion.text>
      )}
    </svg>
  );
}
