import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import StatCard from './StatCard';

/* FloatingCards (Archetype C) — StatCards drifting over a stage.
   The parent passes its visual as `children`; this component renders a
   position:relative wrapper that overlays absolutely-positioned StatCards at the
   four corner anchors on lg+ screens, and falls back to a plain 2-col grid on
   mobile. Each floating card gets a transform-only, scroll-linked y drift with a
   DISTINCT range capped within ±28px. No perpetual loops — purely scroll-linked.
   Reduced motion -> static (no drift). */

// Corner offset utilities per anchor. Small responsive offsets so cards hug the
// stage edges without clipping. Absolute positioning is only applied on lg+.
const ANCHOR_POS = {
  tl: 'top-3 left-3 lg:top-4 lg:left-4',
  tr: 'top-3 right-3 lg:top-4 lg:right-4',
  bl: 'bottom-3 left-3 lg:bottom-4 lg:left-4',
  br: 'bottom-3 right-3 lg:bottom-4 lg:right-4',
};

// Distinct scroll-drift ranges per index, all capped within ±28px. Cards drift in
// alternating directions to feel parallaxed rather than uniform.
const DRIFT_RANGES = [
  [28, -22],
  [-26, 20],
  [22, -28],
  [-20, 26],
];

function FloatingCard({ card, index, scrollYProgress, reduce }) {
  const range = DRIFT_RANGES[index % DRIFT_RANGES.length];
  // Hooks must run unconditionally; when reduced we simply ignore the output.
  const y = useTransform(scrollYProgress, [0, 1], range);
  const anchor = ANCHOR_POS[card.anchor] || ANCHOR_POS.tl;

  return (
    <motion.div
      className={`absolute z-10 ${anchor}`}
      style={reduce ? undefined : { y, willChange: 'transform' }}
    >
      <StatCard
        label={card.label}
        value={card.value}
        sub={card.sub}
        pill={card.pill}
        accent={card.accent}
        tilt={card.tilt}
      />
    </motion.div>
  );
}

export default function FloatingCards({ cards = [], children, className = '' }) {
  const containerRef = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* The parent's visual / stage. */}
      {children}

      {/* lg+ : absolutely-positioned, scroll-drifting cards over the stage. */}
      <div className="hidden lg:block" aria-hidden={false}>
        {cards.map((card, i) => (
          <FloatingCard
            key={card.label ?? i}
            card={card}
            index={i}
            scrollYProgress={scrollYProgress}
            reduce={reduce}
          />
        ))}
      </div>

      {/* mobile : same StatCards in a normal 2-col grid below, no drift. */}
      {cards.length > 0 && (
        <div className="lg:hidden grid grid-cols-2 gap-3 mt-4">
          {cards.map((card, i) => (
            <StatCard
              key={card.label ?? i}
              label={card.label}
              value={card.value}
              sub={card.sub}
              pill={card.pill}
              accent={card.accent}
              tilt={card.tilt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
