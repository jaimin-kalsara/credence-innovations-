import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/* Draw-on hand annotation layer. Generalizes DrawUnderline's stroke-in
   mechanism (Framer pathLength 0->1) into a small library of hand-wobbled
   marks. The parent positions the svg via className/style (usually absolute);
   the svg fills its box and stretches to fit (preserveAspectRatio="none").

   Each entry is an array of paths; { d, delay } lets multi-stroke marks
   (arrow head, check tail) trail the primary stroke. All beziers are
   intentionally loose / off-axis so nothing reads as geometric. */
const MARKS = {
  // wavy hand line, kin to DrawUnderline
  underline: [
    { d: 'M2,8 C18,3.5 33,11 51,7 C69,3 85,10 98,5.5' },
  ],
  // loose open ellipse with a deliberate gap at the start/end
  circle: [
    { d: 'M70,12 C40,5 14,12 9,34 C5,52 26,66 52,64 C80,62 96,46 92,28 C89,15 74,9 58,9' },
  ],
  // curved shaft + two-stroke head (head trails the shaft)
  arrow: [
    { d: 'M5,20 C26,9 50,8 72,16 C82,19.5 88,24 92,30' },
    { d: 'M78,17 C84,20 89,24 92,30', delay: 0.25 },
    { d: 'M82,42 C87,38 90,34 92,30', delay: 0.25 },
  ],
  // two-segment tick (down-stroke, then the longer rising tail)
  check: [
    { d: 'M10,46 C18,53 24,60 32,70' },
    { d: 'M32,70 C46,48 64,28 90,12', delay: 0.22 },
  ],
  // hand brace [ — top serif, spine, bottom serif as one continuous stroke
  bracket: [
    { d: 'M62,6 C40,5 26,8 24,14 C22,26 24,44 23,52 C22,62 26,78 30,84 C36,90 50,93 64,92' },
  ],
  // wavy horizontal divider, more amplitude than underline
  squiggle: [
    { d: 'M2,18 C12,6 22,30 34,18 C46,6 56,30 68,18 C80,6 90,30 98,18' },
  ],
  // rough 5-point star, single travelling stroke that overshoots slightly
  star: [
    { d: 'M50,6 C56,24 60,34 80,38 C62,44 58,50 62,70 C50,58 44,57 28,68 C34,48 31,44 12,38 C33,32 38,26 38,8 C44,20 47,26 50,6' },
  ],
};

const EASE = [0.16, 1, 0.3, 1];

export default function Scribble({
  kind = 'underline',
  color = 'var(--ember)',
  width = 3,
  delay = 0,
  flip = false,
  className = '',
  style,
  ...rest
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();

  const paths = MARKS[kind] || MARKS.underline;

  // Decorative underlines were removed site-wide per design direction. Other
  // marks (circle, check, arrow, star, bracket, squiggle) are unaffected.
  if (kind === 'underline') return null;

  return (
    <svg
      ref={ref}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'visible',
        pointerEvents: 'none',
        transform: flip ? 'scaleX(-1)' : undefined,
        ...style,
      }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      {...rest}
    >
      {paths.map((p, i) => (
        <motion.path
          key={i}
          d={p.d}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          animate={
            reduce
              ? { pathLength: 1, opacity: 1 }
              : inView
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={
            reduce
              ? { duration: 0 }
              : {
                  pathLength: {
                    duration: 0.82,
                    ease: EASE,
                    delay: delay + (p.delay || 0),
                  },
                  opacity: { duration: 0.18, delay: delay + (p.delay || 0) },
                }
          }
        />
      ))}
    </svg>
  );
}
