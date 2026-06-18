import { useId, useMemo } from 'react';
import StatCard from './StatCard';

/* Archetype D helper — an intentionally NON-uniform stat grid. Some cards span
   two rows ('tall') or two columns ('wide') so the rhythm is broken and the grid
   never reads as an identical-card slop wall. StatCard owns its own FadeUp reveal
   and tilt; here we only lay the cards out and assign varied (alternating-sign)
   tilts when a card doesn't specify one. An optional stamp sits at the corner.

   No perpetual motion: the only animation is StatCard's reveal-once FadeUp.
   Responsive tracks are scoped via a per-instance class so we never touch
   index.css. */

const clampTilt = (t) => Math.max(-2.5, Math.min(2.5, t));

// Deterministic small tilt by index so renders agree and the sign alternates.
const tiltForIndex = (i) => {
  const sign = i % 2 === 0 ? 1 : -1;
  const mag = [1.4, 0.8, 2.0][i % 3]; // cycle magnitudes so it never feels mechanical
  return clampTilt(sign * mag);
};

export default function OddCardGrid({
  cards = [],
  columns = 3,
  className = '',
  style = {},
  ...rest
}) {
  const rawId = useId();
  const scope = `oddgrid-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  // Guarantee at most one dominant card: keep only the FIRST 'tall' and the
  // FIRST 'wide'; demote any further spans to normal so a single card leads.
  const resolved = useMemo(() => {
    let usedTall = false;
    let usedWide = false;
    return cards.map((card, i) => {
      let span = card.span;
      if (span === 'tall') {
        if (usedTall) span = undefined;
        else usedTall = true;
      } else if (span === 'wide') {
        if (usedWide) span = undefined;
        else usedWide = true;
      }
      const tilt = typeof card.tilt === 'number' ? card.tilt : tiltForIndex(i);
      return { ...card, span, tilt };
    });
  }, [cards]);

  return (
    <>
      {/* Scoped responsive rule: 2 columns on small screens, `columns` on md+.
          Wide cards never exceed the column count; tall cards span two rows. */}
      <style>{`
        .${scope} {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          grid-auto-rows: minmax(150px, auto);
          grid-auto-flow: dense;
          gap: clamp(14px, 2vw, 22px);
        }
        .${scope} .odd-cell--tall { grid-row: span 2; }
        .${scope} .odd-cell--wide { grid-column: span 2; }
        @media (min-width: 768px) {
          .${scope} { grid-template-columns: repeat(${columns}, minmax(0, 1fr)); }
        }
      `}</style>

      <div className={`${scope} ${className}`.trim()} style={style} {...rest}>
        {resolved.map((card, i) => {
          const { span, stamp, accent, label, value, sub, pill, tilt } = card;
          return (
            <div
              key={i}
              className={`odd-cell${span ? ` odd-cell--${span}` : ''}`}
              style={{ position: 'relative', display: 'flex' }}
            >
              <StatCard
                label={label}
                value={value}
                sub={sub}
                pill={pill}
                tilt={tilt}
                accent={accent}
                style={{ width: '100%', height: '100%' }}
              />
              {stamp && (
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: -14,
                    right: -10,
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}
                >
                  {stamp}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
