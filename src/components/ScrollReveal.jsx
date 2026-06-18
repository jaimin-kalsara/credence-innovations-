import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/* BOLD scroll-linked reveal with a FULL lifecycle — open, hold, close.
   As the element travels through the viewport its motion is scrubbed directly
   to scroll position:
     • OPEN  — slides in from `from` + fades + scales up as it enters from the bottom.
     • HOLD  — sits fully visible & still through the readable middle.
     • CLOSE — fades out + rises + scales down slightly as it exits past the top.
   Scroll back up and it reverses. Smooth via Lenis (no per-element spring).

   from      'up' | 'down' | 'left' | 'right'
   distance  px of entry travel (default 110 — large so it READS as motion)
   scaleFrom starting scale
   exit      set false to keep it fully visible after it has entered (no close) */
export default function ScrollReveal({
  children,
  from = 'up',
  distance = 110,
  scaleFrom = 0.92,
  exit = true,
  className = '',
  style = {},
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  // On phones the bold horizontal slides fight the swipe carousels and risk
  // pushing the page wider than the screen — so ScrollReveal is desktop-only.
  const [big, setBig] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const upd = () => setBig(mq.matches);
    upd();
    mq.addEventListener('change', upd);
    return () => mq.removeEventListener('change', upd);
  }, []);
  // track the element's whole journey through the viewport
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const dx = from === 'left' ? -distance : from === 'right' ? distance : 0;
  const dy = from === 'up' ? distance : from === 'down' ? -distance : 0;

  // keyframe stops across the journey: enter by ~0.24, hold, close after ~0.86
  const opacity = useTransform(
    scrollYProgress,
    exit ? [0, 0.22, 0.86, 1] : [0, 0.22],
    exit ? [0, 1, 1, 0] : [0, 1],
  );
  const x = useTransform(scrollYProgress, [0, 0.24], [dx, 0]);
  const y = useTransform(
    scrollYProgress,
    exit ? [0, 0.24, 0.86, 1] : [0, 0.24],
    exit ? [dy, 0, 0, -64] : [dy, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    exit ? [0, 0.24, 0.88, 1] : [0, 0.24],
    exit ? [scaleFrom, 1, 1, 0.965] : [scaleFrom, 1],
  );

  if (reduce || !big) {
    return <div className={className} style={style}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, x, y, scale, opacity, willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}
