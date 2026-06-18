import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import CinematicImage from './CinematicImage';
import { SplitText, FadeUp } from './AnimatedSection';

const EXPO = [0.16, 1, 0.3, 1];

/* Default scatter if no photos passed — overlapping editorial collage. */
const DEFAULT_PHOTOS = [
  { index: 0, w: 26, x: 4, y: 14, rot: -5, depth: 1.0, hideSm: false },
  { index: 2, w: 22, x: 72, y: 8, rot: 4, depth: -0.7, hideSm: true },
  { index: 4, w: 24, x: 78, y: 56, rot: -3, depth: 0.6, hideSm: true },
  { index: 1, w: 20, x: 10, y: 60, rot: 6, depth: -1.0, hideSm: false },
  { index: 3, w: 18, x: 44, y: 70, rot: -2, depth: 0.4, hideSm: true },
];

/* One polaroid-framed photo. Scroll-linked parallax drift keyed to `depth`
   (transform-only, not a loop). Reveal-once fade + scale-in, staggered. */
function CollagePhoto({ photo, i, progress, reduce }) {
  const { index = i, src, w = 22, x = 0, y = 0, rot = 0, depth = 0.6, hideSm } = photo;

  // Distinct small parallax ranges per depth — purely transform.
  const range = 28 * (depth || 0.6);
  const yDrift = useTransform(progress, [0, 1], [range, -range]);

  return (
    <motion.div
      className={`absolute ${hideSm ? 'hidden md:block' : ''}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}%`,
        rotate: `${rot}deg`,
        y: reduce ? 0 : yDrift,
        zIndex: 0,
      }}
      initial={reduce ? false : { opacity: 0, scale: 0.92 }}
      whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay: 0.06 * i, ease: EXPO }}
      aria-hidden="true"
    >
      <div
        className="p-[6px] pb-[14px]"
        style={{
          border: '1px solid var(--hair)',
          background: 'var(--graphite)',
          boxShadow: 'var(--shadow-card)',
          borderRadius: 3,
        }}
      >
        <CinematicImage src={src} index={index} aspect="4/5" duotone />
      </div>
    </motion.div>
  );
}

export default function DarkIslandHeadline({
  eyebrow,
  heading,
  subhead,
  photos,
  cta,
  rounded = false,
  className = '',
  children,
  style = {},
  ...rest
}) {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);

  const list = photos && photos.length ? photos : DEFAULT_PHOTOS;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const Collage = (
    <>
      {/* scattered background collage */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {list.map((photo, i) => (
          <CollagePhoto
            key={i}
            photo={photo}
            i={i}
            progress={scrollYProgress}
            reduce={reduce}
          />
        ))}
        {/* legibility scrim so the headline reads over the collage */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 80% at 50% 42%, rgba(10,10,11,0.86) 30%, rgba(10,10,11,0.62) 62%, rgba(10,10,11,0.30) 100%)',
          }}
        />
      </div>

      {/* foreground centered column */}
      <div className="shell-narrow relative z-10 text-center">
        {eyebrow && (
          <FadeUp className="eyebrow" style={{ display: 'block', marginBottom: '1.2rem' }}>
            {eyebrow}
          </FadeUp>
        )}

        <h2 className="t-display-xl" style={{ margin: 0 }}>
          {typeof heading === 'string' ? (
            reduce ? (
              <span>{heading}</span>
            ) : (
              <SplitText text={heading} />
            )
          ) : reduce ? (
            heading
          ) : (
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, ease: EXPO }}
              style={{ display: 'inline-block' }}
            >
              {heading}
            </motion.span>
          )}
        </h2>

        {subhead && (
          <FadeUp delay={0.12} className="body-lg measure" style={{ margin: '1.4rem auto 0', color: 'var(--smoke)' }}>
            {subhead}
          </FadeUp>
        )}

        {cta && (
          <FadeUp delay={0.2} style={{ marginTop: '2.2rem' }}>
            {cta}
          </FadeUp>
        )}

        {children}
      </div>

      {/* bottom fade to blend into the next (cream) section */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none z-[5]"
        style={{ background: 'linear-gradient(180deg, transparent, var(--bone))' }}
        aria-hidden="true"
      />
    </>
  );

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      className={`paper relative overflow-hidden pad-lg ${className}`}
      style={style}
      {...rest}
    >
      {rounded ? (
        <div className="island-dark relative overflow-hidden">{Collage}</div>
      ) : (
        Collage
      )}
    </section>
  );
}
