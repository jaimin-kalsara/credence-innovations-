import { Fragment } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* MarqueeColumn — a single vertically auto-scrolling column. The item list is
   rendered twice and the track translates -50% on an infinite linear loop, so
   the seam is invisible. Honors prefers-reduced-motion (renders a static, un-
   duplicated list). Generic: pass any items + a renderItem(item, i) callback.
   Adapted from the "testimonials columns" pattern to this Vite/JS codebase
   (framer-motion, not motion/react; no "use client"). */
export default function MarqueeColumn({ items = [], duration = 24, className = '', renderItem }) {
  const reduce = useReducedMotion();
  const passes = reduce ? [0] : [0, 1];

  return (
    <div className={className}>
      <motion.div
        className="flex flex-col gap-6 pb-6"
        animate={reduce ? undefined : { translateY: '-50%' }}
        transition={reduce ? undefined : { duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
      >
        {passes.map((pass) => (
          <Fragment key={pass}>
            {items.map((it, i) => (
              <Fragment key={`${pass}-${i}`}>{renderItem(it, i)}</Fragment>
            ))}
          </Fragment>
        ))}
      </motion.div>
    </div>
  );
}
