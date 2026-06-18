import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';
import Odometer from './Odometer';

/* Shared scroll-scrubbed timeline for About / WhatWeDo.
   A connecting rail DRAWS-ON tied to the container's scroll progress
   (useScroll + useTransform — scroll-linked, not a loop): vertical
   orientation scales a left rail from the top (scaleY), horizontal scales
   a top rail from the left (scaleX). Each milestone reveals once: the dot
   pops, an ember Scribble circle rings the marker, and the marker / heading
   / body / optional Odometer stat fade up. Reduced motion -> rail fully
   drawn, dots static, scribbles + stats instant. */

const EASE = [0.16, 1, 0.3, 1];

function Milestone({ item, orientation, reduce, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const show = reduce || inView;

  return (
    <li
      ref={ref}
      className="scrub-step"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: orientation === 'horizontal' ? 'column' : 'row',
        gap: orientation === 'horizontal' ? '1.1rem' : '1.5rem',
        alignItems: 'flex-start',
        paddingLeft: orientation === 'horizontal' ? 0 : '0.25rem',
        paddingTop: orientation === 'horizontal' ? '0.25rem' : 0,
      }}
    >
      {/* Dot + ring marker, sits centered on the rail */}
      <div
        className="scrub-node"
        style={{
          position: 'relative',
          flex: '0 0 auto',
          width: '2.6rem',
          height: '2.6rem',
          display: 'grid',
          placeItems: 'center',
          marginLeft: orientation === 'horizontal' ? 0 : '-1.3rem',
          marginTop: orientation === 'horizontal' ? '-1.3rem' : '0.1rem',
        }}
      >
        <motion.span
          aria-hidden="true"
          style={{
            display: 'block',
            width: '0.85rem',
            height: '0.85rem',
            borderRadius: '50%',
            background: 'var(--electric)',
            boxShadow: '0 0 0 4px var(--ink), 0 0 0 5px var(--brand-soft)',
          }}
          initial={reduce ? { scale: 1 } : { scale: 0 }}
          animate={show ? { scale: 1 } : { scale: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE, delay: 0.04 }}
        />
      </div>

      {/* Text column */}
      <div className="scrub-body" style={{ flex: '1 1 auto', minWidth: 0 }}>
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, ease: EASE, delay: 0.08 }}
        >
          <span
            className="scrub-marker"
            style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)',
              lineHeight: 1,
              color: 'var(--electric)',
              marginBottom: '0.55rem',
            }}
          >
            {item.marker}
          </span>
          <h3
            className="t-display-s"
            style={{ margin: '0 0 0.5rem', color: 'var(--bone)', fontFamily: 'var(--font-display)' }}
          >
            {item.heading}
          </h3>
          {item.body && (
            <p className="body" style={{ margin: 0, color: 'var(--smoke)', maxWidth: '46ch' }}>
              {item.body}
            </p>
          )}
          {item.stat && (
            <Odometer value={item.stat} className="stat-num" style={{ marginTop: '0.7rem', display: 'inline-block' }} />
          )}
        </motion.div>
      </div>
    </li>
  );
}

export default function ScrubTimeline({ milestones = [], orientation = 'vertical', className = '', style }) {
  const containerRef = useRef(null);
  const reduce = useReducedMotion();
  const horizontal = orientation === 'horizontal';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  // Rail draw-on: vertical scales Y from the top, horizontal scales X from the left.
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Static rail geometry (the channel the dots sit on).
  const railTrack = horizontal
    ? {
        position: 'absolute',
        top: 0,
        left: '1.3rem',
        right: '1.3rem',
        height: 2,
        background: 'var(--hair)',
      }
    : {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '1.3rem',
        width: 2,
        background: 'var(--hair)',
      };

  const railFill = horizontal
    ? {
        position: 'absolute',
        top: 0,
        left: '1.3rem',
        right: '1.3rem',
        height: 2,
        background: 'var(--electric)',
        transformOrigin: 'left center',
        scaleX: reduce ? 1 : progress,
      }
    : {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '1.3rem',
        width: 2,
        background: 'var(--electric)',
        transformOrigin: 'top center',
        scaleY: reduce ? 1 : progress,
      };

  return (
    <div
      ref={containerRef}
      className={`scrub-timeline ${className}`}
      style={{ position: 'relative', ...style }}
    >
      {/* Connecting rail (decorative) */}
      <div aria-hidden="true" style={railTrack} />
      <motion.div aria-hidden="true" style={railFill} />

      <ol
        className="scrub-steps"
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: horizontal ? 'grid' : 'flex',
          gridTemplateColumns: horizontal
            ? `repeat(${Math.max(milestones.length, 1)}, minmax(0, 1fr))`
            : undefined,
          flexDirection: horizontal ? undefined : 'column',
          gap: horizontal ? '2rem' : '3.25rem',
        }}
      >
        {milestones.map((item, i) => (
          <Milestone
            key={item.marker ?? i}
            item={item}
            orientation={orientation}
            reduce={reduce}
            index={i}
          />
        ))}
      </ol>
    </div>
  );
}
