import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import CinematicImage from './CinematicImage';
import { ClipReveal } from './AnimatedSection';

/* Frames a CinematicImage as a clean print figure: hairline border, soft radius,
   a left->right clip wipe on enter, an optional mono caption — and a smooth,
   spring-eased scroll parallax (the image is scaled up inside the clipped frame
   and drifts as the figure passes through the viewport, so it never reveals a
   gap). Disabled under reduced motion. */
export default function EditorialFigure({
  src,
  label,
  caption,
  aspect = '4/3',
  index = 0,
  duotone = false,
  parallax = true,
  className = '',
  style = {},
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  // parallax (a scaled, drifting image) is desktop-only — on phones it just costs
  // GPU and crops the image; a clean, still figure scrolls smoother.
  const [big, setBig] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const upd = () => setBig(mq.matches);
    upd();
    mq.addEventListener('change', upd);
    return () => mq.removeEventListener('change', upd);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.5 });
  const y = useTransform(smooth, [0, 1], ['11%', '-11%']);
  const on = parallax && !reduce && big;

  return (
    <figure ref={ref} className={className} style={{ margin: 0, ...style }}>
      <ClipReveal>
        <div style={{ border: '1px solid var(--hair)', borderRadius: 18, overflow: 'hidden' }}>
          <motion.div style={on ? { y, scale: 1.28, willChange: 'transform' } : undefined}>
            <CinematicImage src={src} label={label} aspect={aspect} index={index} duotone={duotone} />
          </motion.div>
        </div>
      </ClipReveal>

      {caption && (
        <figcaption
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            lineHeight: 1.5,
            color: 'var(--smoke)',
            marginTop: 10,
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
