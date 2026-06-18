import { Link } from 'react-router-dom';
import { FadeUp, ClipReveal } from './AnimatedSection';
import Scribble from './Scribble';

/* Archetype A engine — alternating text / visual feature row.

   side ........ which side the TEXT column sits on at lg ('left' | 'right').
                 On mobile the VISUAL always stacks first, then the text.
   eyebrow ..... optional mono kicker (.eyebrow)
   heading ..... ReactNode (may hold .d-caps / .d-ital spans + DrawUnderline)
   body ........ string | ReactNode
   link ........ { label, to } -> .tab-link with a trailing arrow
   tab ......... color for the link's left tab (default ember)
   visual ...... ReactNode painted in the visual column (e.g. CinematicImage)
   annotation .. { kind, color?, style? } -> one Scribble overlaid on the visual
   stamp ....... ReactNode (e.g. StampBadge) pinned to a corner of the visual
*/
export default function FeatureRow({
  side = 'left',
  eyebrow,
  heading,
  body,
  extra,
  link,
  tab = 'var(--ember)',
  visual,
  annotation,
  stamp,
  className = '',
}) {
  const textRight = side === 'right';

  const textCol = (
    <FadeUp
      // mobile: visual first (order-1) then text (order-2).
      // lg: text sits on `side`. Use order CLASSES only — inline order would
      // beat the responsive classes and break desktop placement.
      className={`order-2 ${textRight ? 'lg:order-2' : 'lg:order-1'}`}
    >
      {eyebrow && (
        <div className="eyebrow" style={{ marginBottom: 16 }}>
          {eyebrow}
        </div>
      )}

      <div className="t-display-l">{heading}</div>

      {body && (
        <p className="body-lg measure" style={{ marginTop: 22, color: 'var(--smoke)' }}>
          {body}
        </p>
      )}

      {extra && <div style={{ marginTop: 28 }}>{extra}</div>}

      {link && (
        <Link
          className="tab-link"
          to={link.to}
          style={{ ['--tab']: tab, marginTop: 28 }}
        >
          {link.label}
          <span className="arrow">→</span>
        </Link>
      )}
    </FadeUp>
  );

  const visualCol = (
    <div
      // mobile: visual first (order-1); lg: opposite side to the text.
      className={`order-1 ${textRight ? 'lg:order-1' : 'lg:order-2'}`}
      style={{ position: 'relative' }}
    >
      <ClipReveal>{visual}</ClipReveal>

      {annotation && (
        <Scribble
          kind={annotation.kind}
          color={annotation.color}
          delay={0.5}
          aria-hidden="true"
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            ...annotation.style,
          }}
        />
      )}

      {stamp && (
        <div
          style={{
            position: 'absolute',
            top: -18,
            right: -18,
            zIndex: 2,
          }}
        >
          {stamp}
        </div>
      )}
    </div>
  );

  return (
    <section className={`pad-md ${className}`}>
      <div className="shell">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-20 items-center">
          {textCol}
          {visualCol}
        </div>
      </div>
    </section>
  );
}
