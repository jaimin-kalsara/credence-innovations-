import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

/* Spring-smoothed scroll parallax. Wraps any visual element and drifts it as the
   section travels through the viewport — the drift is run through a soft spring so
   it eases behind the scroll for a buttery feel (pairs with Lenis smooth scroll).
   Transform-only + will-change, so it never repaints layout. Disabled under
   prefers-reduced-motion.

   speed  — fraction of the element's height to drift each way (0.1 = ±10%).
   axis   — 'y' (default) or 'x'.
   clip   — set true on a parent with overflow:hidden when drifting an oversized
            image so the drift never reveals an edge gap. */
export default function Parallax({
  children,
  speed = 0.1,
  axis = 'y',
  className = '',
  style = {},
  as: Tag = 'div',
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.5 });
  const dist = speed * 100;
  const shift = useTransform(smooth, [0, 1], [`${dist}%`, `${-dist}%`]);

  const MotionTag = motion[Tag] || motion.div;
  const motionStyle = reduce ? {} : (axis === 'x' ? { x: shift } : { y: shift });

  return (
    <Tag ref={ref} className={className} style={style}>
      <MotionTag style={{ ...motionStyle, willChange: reduce ? undefined : 'transform' }}>
        {children}
      </MotionTag>
    </Tag>
  );
}
