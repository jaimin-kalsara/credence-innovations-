import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/* Section transition that reads like a manila folder tab.
   A full-width hairline rule with one small rounded-top trapezoidal tab
   sitting on it — the tab is filled with the incoming surface color so it
   visually "stitches" two sections together. Mono caps label with a small
   colored mark (square) in the tone color. Mostly static; a single 0.4s
   draw-on of the tab's top edge on view. No loops. */
export default function FolderTabDivider({
  label,
  tone = 'ember',
  flip = false,
  fill = 'var(--ink)',
  className = '',
  style = {},
  ...rest
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();

  const accent = tone === 'electric' ? 'var(--electric)' : 'var(--ember)';

  // Rounded-top trapezoid: wider at the base, narrower at the rounded top.
  const tabClip = 'polygon(8% 100%, 0% 100%, 14% 0%, 86% 0%, 100% 100%, 92% 100%)';

  return (
    <div
      ref={ref}
      className={`relative w-full ${className}`}
      style={{ height: 34, ...style }}
      aria-hidden="true"
      {...rest}
    >
      {/* hairline rule sits where the tab base meets it */}
      <div
        className="absolute left-0 w-full"
        style={{
          top: flip ? 0 : 'auto',
          bottom: flip ? 'auto' : 0,
          height: 1,
          background: 'var(--hair)',
        }}
      />

      {/* the tab itself, centered */}
      <div
        className="absolute left-1/2 flex items-center justify-center"
        style={{
          bottom: flip ? 'auto' : 0,
          top: flip ? 0 : 'auto',
          transform: `translateX(-50%)${flip ? ' scaleY(-1)' : ''}`,
          width: 186,
          height: 34,
        }}
      >
        {/* trapezoid background (clip-path) + top/side border simulated via inner outline */}
        <div
          className="absolute inset-0"
          style={{
            background: fill,
            clipPath: tabClip,
            WebkitClipPath: tabClip,
            border: '1px solid var(--hair)',
            borderBottom: 'none',
          }}
        />

        {/* crisp draw-on of the tab's top edge (left -> right wipe) */}
        <svg
          className="absolute left-0 w-full pointer-events-none"
          style={{ top: 1, height: 6, overflow: 'visible' }}
          viewBox="0 0 100 6"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M14,5 C14.5,1.4 17.5,0.6 22,0.6 L78,0.6 C82.5,0.6 85.5,1.4 86,5"
            fill="none"
            stroke={accent}
            strokeWidth="1.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={reduce
              ? { duration: 0 }
              : { pathLength: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.15 } }}
          />
        </svg>

        {/* label — un-flip the text so it stays upright when flip is set */}
        {label ? (
          <span
            className="relative flex items-center"
            style={{
              transform: flip ? 'scaleY(-1)' : 'none',
              gap: '0.5em',
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: '10.5px',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--smoke)',
              lineHeight: 1,
              paddingTop: 1,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: 1,
                background: accent,
                flex: '0 0 auto',
              }}
            />
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
