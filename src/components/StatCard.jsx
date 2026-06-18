import { useMemo } from 'react';
import { FadeUp } from './AnimatedSection';
import Odometer from './Odometer';

/* Floating, lightly-tilted stat tile. A paper-card with a mono kicker label,
   a rolling Odometer number tinted by the accent, an optional sub line and an
   optional status pill. FadeUp owns the reveal + reduced-motion behaviour; the
   tilt is a static layout rotation (no perpetual motion). */
const clampTilt = (t) => Math.max(-2.5, Math.min(2.5, t));

export default function StatCard({
  label,
  value,
  sub,
  pill,
  tilt,
  accent = 'var(--electric)',
  float = false,
  className = '',
  style = {},
  ...rest
}) {
  // Resolve tilt once: explicit prop wins, otherwise a stable random in -2.5..2.5.
  const resolvedTilt = useMemo(
    () => clampTilt(typeof tilt === 'number' ? tilt : (Math.random() * 8 - 4)),
    [tilt],
  );

  return (
    <FadeUp className={className} style={style}>
      <div
        className="paper-card paper-card--tilt"
        data-float={float ? '' : undefined}
        style={{
          '--tilt': `${resolvedTilt}deg`,
          borderRadius: 14,
          padding: '22px 24px',
          position: 'relative',
        }}
        {...rest}
      >
        {pill && (
          <span
            style={{
              position: 'absolute',
              top: 14,
              right: 16,
              fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
              fontSize: 11,
              letterSpacing: '0.04em',
              lineHeight: 1.4,
              color: 'var(--electric)',
              background: 'var(--brand-soft)',
              borderRadius: 999,
              padding: '2px 10px',
              whiteSpace: 'nowrap',
            }}
          >
            {pill}
          </span>
        )}

        {label && (
          <div
            style={{
              fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--smoke)',
              marginBottom: 6,
              paddingRight: pill ? 96 : 0,
            }}
          >
            {label}
          </div>
        )}

        <Odometer
          value={value}
          className="stat-num"
          style={{
            display: 'block',
            fontSize: 'clamp(34px, 4.5vw, 64px)',
            lineHeight: 1,
            color: accent,
          }}
        />

        {sub && (
          <div className="body-sm" style={{ color: 'var(--smoke)', marginTop: 8 }}>
            {sub}
          </div>
        )}
      </div>
    </FadeUp>
  );
}
